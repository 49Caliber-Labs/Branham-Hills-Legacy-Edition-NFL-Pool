import { Game, Player, PlayerPickData, WeeklyDispatch, ChatMessage, FineItem, SeasonHistory } from '../types';
import { generateDispatchPayload, sendGmailMessage, createGmailDraft, getCachedAccessToken } from './gmailService';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase-client';
import { guardedCloudWrite } from '../utils/cloudWriteWatchdog';
import { isGameLockedAtTime, sanitizeClientSubmissionPicks } from '../utils/pickRulesEngine';

export interface PoolDataResponse {
  games: Game[];
  players: Player[];
  picks: Record<string, PlayerPickData>;
  dispatches: WeeklyDispatch[];
  messages: ChatMessage[];
  fines: FineItem[];
  seasonHistory?: SeasonHistory;
  lastUpdated: string;
}

/**
 * Fetch all pool data globally from the server
 */
export async function fetchGlobalPoolData(): Promise<PoolDataResponse | null> {
  try {
    const res = await fetch('/api/pool-data');
    if (!res.ok) {
      console.warn(`[SyncService] Failed to fetch pool data (${res.status})`);
      return null;
    }
    const data: PoolDataResponse = await res.json();
    return data;
  } catch (err) {
    console.error('[SyncService] Network error fetching global pool data:', err);
    return null;
  }
}

/**
 * Publish or update a dispatch globally so all users see it on reload
 */
export async function publishDispatchGlobally(dispatch: WeeklyDispatch): Promise<{
  success: boolean;
  dispatch?: WeeklyDispatch;
  dispatches?: WeeklyDispatch[];
}> {
  try {
    const res = await fetch('/api/dispatches/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispatch })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to publish dispatch globally:', err);
    return { success: false };
  }
}

/**
 * Physically remove a dispatch globally from public view
 */
export async function removeDispatchGlobally(dispatchId: string): Promise<{
  success: boolean;
  dispatches?: WeeklyDispatch[];
}> {
  try {
    const res = await fetch(`/api/dispatches/${encodeURIComponent(dispatchId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to remove dispatch globally:', err);
    return { success: false };
  }
}

/**
 * Save contender picks globally with resilient dual-channel failover (Cloud + Server API)
 */
export async function savePicksGlobally(
  contenderName: string,
  picks: Record<number, string>,
  tiebreaker: number | '',
  submittedAt?: string,
  adminOverride?: boolean,
  week?: number,
  games?: Game[],
  allowClearUnlocked?: boolean
): Promise<{
  success: boolean;
  picks?: Record<string, PlayerPickData>;
  cloudSaved?: boolean;
  serverSaved?: boolean;
}> {
  let cloudSaved = false;
  let serverSaved = false;
  let returnedPicks: Record<string, PlayerPickData> | undefined = undefined;
  const timestamp = submittedAt || new Date().toISOString();

  const initialCleanPicks = Array.isArray(games) && games.length > 0
    ? sanitizeClientSubmissionPicks({}, picks, games, {
        adminOverride: !!adminOverride,
        allowClearUnlocked: !!allowClearUnlocked
      })
    : picks;

  const pickData: PlayerPickData = {
    contenderName,
    picks: initialCleanPicks,
    tiebreaker,
    submittedAt: timestamp,
    ...(typeof week === 'number' && week > 0 ? { week } : {})
  };

  // Channel 1: Guaranteed Local Server API FIRST (Durable disk storage and authoritative merge)
  try {
    const res = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contenderName,
        picks: initialCleanPicks,
        tiebreaker,
        submittedAt: timestamp,
        adminOverride: !!adminOverride,
        allowClearUnlocked: !!allowClearUnlocked,
        week
      })
    });

    if (res.ok) {
      serverSaved = true;
      const data = await res.json();
      returnedPicks = data?.picks;
      console.log(`[SyncService] Local server storage succeeded for ${contenderName}`);
    } else {
      console.warn(`[SyncService] Local server returned HTTP status ${res.status}`);
    }
  } catch (srvErr) {
    console.warn(`[SyncService] Local server network error for ${contenderName}:`, srvErr);
  }

  // Channel 2: Persist to Firestore Cloud safely using authoritative merged picks
  try {
    if (db) {
      let authoritativeRecord: PlayerPickData = returnedPicks?.[contenderName]
        ? { ...returnedPicks[contenderName] }
        : pickData;

      // If local server wasn't reachable, reconcile against existing Firestore doc before writing
      // so locked picks in cloud are never overwritten or deleted by an unmerged client view.
      if (!serverSaved && !adminOverride && Array.isArray(games) && games.length > 0) {
        try {
          const snapPromise = getDoc(doc(db, 'picks', contenderName));
          const snapTimeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 1500));
          const existingSnap: any = await Promise.race([snapPromise, snapTimeout]);
          if (existingSnap && typeof existingSnap.exists === 'function' && existingSnap.exists()) {
            const cloudData = existingSnap.data() as PlayerPickData;
            if (cloudData && cloudData.week === authoritativeRecord.week && cloudData.picks) {
              authoritativeRecord = {
                ...authoritativeRecord,
                picks: sanitizeClientSubmissionPicks(
                  cloudData.picks,
                  authoritativeRecord.picks,
                  games,
                  { adminOverride: false, allowClearUnlocked: !!allowClearUnlocked }
                )
              };
            }
          }
        } catch {}
      }

      const hasLockedGames = Array.isArray(games) && games.some(g => isGameLockedAtTime(g));
      const isEmptySheet = Object.keys(authoritativeRecord.picks || {}).length === 0;

      if (!adminOverride && isEmptySheet && (!allowClearUnlocked || hasLockedGames)) {
        console.warn(`[Firestore] Skipped empty pick sheet overwrite for ${contenderName} to protect existing picks.`);
      } else {
        const guardRes = await guardedCloudWrite(
          `picks/${contenderName}`,
          'submit_picks_client',
          async () => {
            const writeOptions = (allowClearUnlocked || adminOverride)
              ? { mergeFields: ['contenderName', 'picks', 'tiebreaker', 'submittedAt', 'week'] }
              : { merge: true };
            const cloudPromise = setDoc(doc(db, 'picks', contenderName), authoritativeRecord, writeOptions);
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Firestore write timeout after 2500ms')), 2500)
            );
            return Promise.race([cloudPromise, timeoutPromise]);
          },
          1
        );
        if (guardRes.success) {
          cloudSaved = true;
          console.log(`[Firestore] Successfully persisted picks for ${contenderName} directly to cloud.`);
        } else {
          console.warn(`[Firestore] Cloud write skipped or blocked by watchdog for ${contenderName}:`, guardRes.error);
        }
      }
    }
  } catch (fsErr: any) {
    console.warn(`[Firestore] Direct cloud save skipped/failed for ${contenderName} (server storage unaffected):`, fsErr?.message || fsErr);
  }

  // Success if either channel safely accepted the picks
  const success = cloudSaved || serverSaved;
  return {
    success,
    picks: returnedPicks,
    cloudSaved,
    serverSaved
  };
}

/**
 * Update games and scores globally
 */
export async function updateGamesGlobally(
  games: Game[]
): Promise<{ success: boolean; games?: Game[] }> {
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ games })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to update games globally:', err);
    return { success: false };
  }
}

/**
 * Repair and synchronize the roster across all devices globally
 */
export async function repairRosterGlobally(): Promise<{ success: boolean; players?: Player[] }> {
  try {
    const res = await fetch('/api/repair-roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to repair roster globally:', err);
    return { success: false };
  }
}

/**
 * Update player roster contact details globally
 */
export async function updatePlayerGlobally(
  playerUpdate: { id: string; email: string; phone?: string; location?: string; isActive?: boolean }
): Promise<{ success: boolean; players?: Player[] }> {
  try {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerUpdate })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to update player globally:', err);
    return { success: false };
  }
}

/**
 * Post a chat message to the Locker Room globally
 */
export async function postChatMessageGlobally(
  message: ChatMessage
): Promise<{ success: boolean; messages?: ChatMessage[] }> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to post message globally:', err);
    return { success: false };
  }
}

/**
 * Delete a chat message from the Locker Room globally
 */
export async function deleteChatMessageGlobally(
  id: string
): Promise<{ success: boolean; messages?: ChatMessage[] }> {
  try {
    const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to delete message globally:', err);
    return { success: false };
  }
}

/**
 * Auto-generate and save Elvis Vegas Insider Favorites globally
 */
export async function generateElvisPicksGlobally(): Promise<{
  success: boolean;
  elvisPicks?: PlayerPickData;
  picks?: Record<string, PlayerPickData>;
}> {
  try {
    const res = await fetch('/api/elvis/generate-picks', {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[SyncService] Failed to generate Elvis picks globally:', err);
    return { success: false };
  }
}

/**
 * Save multiple contenders picks in bulk globally
 */
export async function saveBulkPicksGlobally(
  allPicks: Record<string, PlayerPickData>
): Promise<{ success: boolean; picks?: Record<string, PlayerPickData> }> {
  try {
    const res = await fetch('/api/picks/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allPicks })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to save bulk picks globally:', err);
    return { success: false };
  }
}

/**
 * Add a fine to the Umpire Fine Jar globally
 */
export async function addFineGlobally(
  fine: FineItem
): Promise<{ success: boolean; fines?: FineItem[] }> {
  try {
    const res = await fetch('/api/fines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fine })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to add fine globally:', err);
    return { success: false };
  }
}

/**
 * Toggle paid status for a fine in the Umpire Fine Jar globally
 */
export async function toggleFinePaidGlobally(
  fineId: string
): Promise<{ success: boolean; fines?: FineItem[] }> {
  try {
    const res = await fetch(`/api/fines/${encodeURIComponent(fineId)}/toggle-paid`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to toggle fine paid globally:', err);
    return { success: false };
  }
}

/**
 * Update compiled season history globally
 */
export async function updateSeasonHistoryGlobally(
  seasonHistory: SeasonHistory
): Promise<{ success: boolean; seasonHistory?: SeasonHistory; dispatches?: WeeklyDispatch[] }> {
  try {
    const res = await fetch('/api/season-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seasonHistory })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[SyncService] Failed to update season history globally:', err);
    return { success: false };
  }
}

/**
 * Send a dispatch via Gmail API to all contenders and publish it to the Wire globally
 */
export async function sendAndPublishDispatch(
  type: 'friday' | 'sunday' | 'tuesday',
  dispatchMeta: { title: string; subtitle: string; consultantQuote: string },
  games: Game[],
  players: Player[],
  picks: Record<string, PlayerPickData>,
  token?: string
): Promise<{
  gmailSent: boolean;
  wirePublished: boolean;
  messageId?: string;
  error?: string;
}> {
  const payload = await generateDispatchPayload(type, games, players, picks);
  let messageId: string | undefined;
  let gmailSent = false;

  // 1. Send via Gmail if authenticated
  const authToken = token || getCachedAccessToken();
  if (authToken) {
    try {
      const sendRes = await sendGmailMessage({
        subject: payload.subject,
        bodyText: payload.body,
        to: payload.to,
        bccList: payload.bccList,
        token: authToken
      });
      messageId = sendRes.id;
      gmailSent = true;
    } catch (err: any) {
      console.warn('[SyncService] Direct Gmail send error:', err);
      // Even if Gmail send has an error, we continue to publish to Wire
    }
  }

  // 2. Publish to Wire globally so all users receive it in the app
  const now = new Date();
  const dispatchId = `dispatch-${type}`;
  const wireDispatch: WeeklyDispatch = {
    id: dispatchId,
    type,
    title: dispatchMeta.title,
    subtitle: dispatchMeta.subtitle,
    timestamp: now.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    content: payload.body,
    consultantQuote: dispatchMeta.consultantQuote
  };

  const publishRes = await publishDispatchGlobally(wireDispatch);

  return {
    gmailSent,
    wirePublished: publishRes.success,
    messageId
  };
}

/**
 * Server-authoritative score ingestion endpoint
 */
export async function syncScoresWithServer(): Promise<{
  success: boolean;
  games?: Game[];
  changedCount?: number;
  message?: string;
}> {
  try {
    const res = await fetch('/api/games/sync-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[SyncService] Server score sync failed:', err);
    return { success: false };
  }
}

/**
 * Safely freeze the completed week's standings into the vault, archive master picks,
 * and roll the pool over to the next week without losing cumulative season points.
 */
export async function advanceWeekSafely(weekNumber?: number): Promise<{
  success: boolean;
  weekFinalized?: number;
  nextWeek?: number;
  winnerName?: string;
  seasonHistory?: SeasonHistory;
  picks?: Record<string, PlayerPickData>;
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/advance-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber })
    });
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.error('[SyncService] Failed to advance week safely:', err);
    return { success: false, error: err.message || 'Network error' };
  }
}


