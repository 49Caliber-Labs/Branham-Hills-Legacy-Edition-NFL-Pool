import { Game, PlayerPickData } from '../types';

export type PickActor = 'admin' | 'contender' | 'elvis' | 'vegas_autofill';

export const PICK_ACTOR_PRIORITY: Record<PickActor, number> = {
  admin: 4,
  contender: 3,
  elvis: 2,
  vegas_autofill: 1,
};

export type MissedPickPolicy =
  | 'vegas_autofill_human_priority'
  | 'vegas_autofill_equal_standing'
  | 'no_autofill_zero';

export const AUTOFILL_GRACE_MS = 2 * 60 * 1000;
export const DEFAULT_MNF_TIEBREAKER = 45;

export interface CertifiedPickEntry {
  pickedTeam: string;
  certifiedAtKickoff: string;
  adminOverriddenAt?: string;
  actor: PickActor;
  isVegasDefault: boolean;
  isCorrect: boolean | null;
}

export function normalizeTeamPickForGame(
  game: Pick<Game, 'awayTeam' | 'homeTeam'>,
  rawTeam?: string | null
): string | null {
  if (typeof rawTeam !== 'string') return null;
  const trimmed = rawTeam.trim();
  if (!trimmed) return null;

  const pickedLower = trimmed.toLowerCase();
  const awayLower = (game.awayTeam || '').trim().toLowerCase();
  const homeLower = (game.homeTeam || '').trim().toLowerCase();

  if (awayLower && pickedLower === awayLower) return game.awayTeam;
  if (homeLower && pickedLower === homeLower) return game.homeTeam;

  const matchesAway = Boolean(awayLower && (awayLower.includes(pickedLower) || pickedLower.includes(awayLower)));
  const matchesHome = Boolean(homeLower && (homeLower.includes(pickedLower) || pickedLower.includes(homeLower)));

  if (matchesAway && !matchesHome) return game.awayTeam;
  if (matchesHome && !matchesAway) return game.homeTeam;
  return null;
}

export function resolveGameFavorite(
  game: Pick<Game, 'awayTeam' | 'homeTeam' | 'favorite' | 'spread'>
): string {
  const fromFavorite = normalizeTeamPickForGame(game, game.favorite);
  if (fromFavorite) return fromFavorite;

  if (typeof game.spread === 'string' && game.spread.trim()) {
    const cleanedSpreadTeam = game.spread
      .replace(/\s*[+-]?\d+(?:\.\d+)?\s*$/i, '')
      .trim();
    const fromFullSpreadPrefix = normalizeTeamPickForGame(game, cleanedSpreadTeam);
    if (fromFullSpreadPrefix) return fromFullSpreadPrefix;

    const firstToken = game.spread.trim().split(/\s+/)[0] || '';
    const fromToken = normalizeTeamPickForGame(game, firstToken);
    if (fromToken) return fromToken;
  }

  return game.homeTeam;
}

export function resolveDefaultMnfTiebreaker(games: Game[]): number {
  const mnfGame =
    games.find(g => g.isMNF) ||
    [...games].reverse().find(g => typeof g.day === 'string' && g.day.toLowerCase().includes('mon'));

  if (mnfGame && typeof mnfGame.overUnder === 'number' && mnfGame.overUnder > 0) {
    return Math.round(mnfGame.overUnder);
  }
  return DEFAULT_MNF_TIEBREAKER;
}

export function buildElvisPickSheet(games: Game[], nowIso?: string): PlayerPickData {
  const picks: Record<number, string> = {};
  for (const g of games) {
    picks[g.gameNumber] = resolveGameFavorite(g);
  }
  const activeWeek =
    games.find(g => typeof g.week === 'number' && g.week > 0)?.week ||
    games[0]?.week ||
    6;

  return {
    contenderName: 'Elvis',
    picks,
    tiebreaker: resolveDefaultMnfTiebreaker(games),
    submittedAt: nowIso || new Date().toISOString(),
    week: activeWeek,
  };
}

export function isGameLockedAtTime(
  game: Pick<Game, 'status' | 'kickoffIso'>,
  nowMs: number = Date.now()
): boolean {
  if (game.status === 'final' || game.status === 'in_progress') {
    return true;
  }
  if (game.kickoffIso) {
    const kickoffMs = new Date(game.kickoffIso).getTime();
    if (!isNaN(kickoffMs) && nowMs >= kickoffMs) {
      return true;
    }
  }
  return false;
}

export function isGameEligibleForAutofill(
  game: Pick<Game, 'status' | 'kickoffIso'>,
  options: {
    nowMs?: number;
    lastCloudSyncMs: number | null;
    cloudRequired: boolean;
    missedPickPolicy?: MissedPickPolicy;
  }
): boolean {
  if (options.missedPickPolicy === 'no_autofill_zero') {
    return false;
  }

  const nowMs = options.nowMs ?? Date.now();
  if (!isGameLockedAtTime(game, nowMs)) {
    return false;
  }

  const kickoffMs = game.kickoffIso ? new Date(game.kickoffIso).getTime() : NaN;
  const pastGrace =
    game.status === 'final' ||
    (!isNaN(kickoffMs)
      ? nowMs >= kickoffMs + AUTOFILL_GRACE_MS
      : game.status === 'in_progress');

  if (!pastGrace) {
    return false;
  }

  if (options.cloudRequired) {
    if (options.lastCloudSyncMs === null) {
      return false;
    }
    if (!isNaN(kickoffMs) && options.lastCloudSyncMs < kickoffMs) {
      return false;
    }
  }

  return true;
}

export function shouldIncomingSlotWin(
  existing: { team?: string; actor?: PickActor } | null | undefined,
  incoming: { team: string; actor: PickActor; submittedAt?: string },
  game?: Pick<Game, 'status' | 'kickoffIso'>
): boolean {
  const incomingTeam = typeof incoming.team === 'string' ? incoming.team.trim() : '';
  if (!incomingTeam) return false;

  const existingTeam = typeof existing?.team === 'string' ? existing.team.trim() : '';

  // HARD INVARIANT: vegas_autofill NEVER overwrites an existing pick.
  if (incoming.actor === 'vegas_autofill') {
    return existingTeam.length === 0;
  }

  if (incoming.actor === 'admin') {
    return true;
  }

  if (existingTeam.length === 0) {
    return true;
  }

  const existingActor: PickActor = existing?.actor || 'contender';

  if (existingActor === 'admin') {
    return false;
  }

  if (incoming.actor === 'elvis') {
    return existingActor === 'vegas_autofill' || existingActor === 'elvis';
  }

  // incoming.actor === 'contender'
  if (existingActor === 'vegas_autofill') {
    if (!game) {
      return true;
    }
    if (game.kickoffIso && incoming.submittedAt) {
      const kickoffMs = new Date(game.kickoffIso).getTime();
      const submittedMs = new Date(incoming.submittedAt).getTime();
      if (!isNaN(kickoffMs) && !isNaN(submittedMs)) {
        return submittedMs <= kickoffMs + 60_000;
      }
    }
    return !isGameLockedAtTime(game);
  }

  if (existingActor === 'elvis') {
    return false;
  }

  // contender updating an existing contender pick: allowed only before game locks
  return !game || !isGameLockedAtTime(game);
}

export function applyBlankOnlyFavorites(
  existingPicks: Record<number, string>,
  games: Game[],
  options: { allowLockedGames: boolean; nowMs?: number }
): { picks: Record<number, string>; filledCount: number } {
  const nowMs = options.nowMs ?? Date.now();
  const nextPicks: Record<number, string> = { ...existingPicks };
  let filledCount = 0;

  for (const g of games) {
    const current = nextPicks[g.gameNumber];
    if (typeof current === 'string' && current.trim().length > 0) {
      continue;
    }
    if (!options.allowLockedGames && isGameLockedAtTime(g, nowMs)) {
      continue;
    }
    nextPicks[g.gameNumber] = resolveGameFavorite(g);
    filledCount += 1;
  }

  return { picks: nextPicks, filledCount };
}

export function sanitizeClientSubmissionPicks(
  existingPicks: Record<number, string>,
  incomingPicks: Record<number, string>,
  games: Game[],
  options: { adminOverride: boolean; allowClearUnlocked?: boolean; nowMs?: number }
): Record<number, string> {
  const nowMs = options.nowMs ?? Date.now();
  const gameMap = new Map<number, Game>();
  for (const g of games) {
    gameMap.set(g.gameNumber, g);
  }

  if (games.length === 0) {
    return options.allowClearUnlocked ? { ...incomingPicks } : { ...existingPicks, ...incomingPicks };
  }

  const result: Record<number, string> = {};

  for (const g of games) {
    const gNum = g.gameNumber;
    const rawExisting = existingPicks[gNum];
    const normExisting = normalizeTeamPickForGame(g, rawExisting);
    const rawIncoming = incomingPicks[gNum];
    const normIncoming = normalizeTeamPickForGame(g, rawIncoming);
    const locked = !options.adminOverride && isGameLockedAtTime(g, nowMs);

    if (locked) {
      if (normExisting) {
        result[gNum] = normExisting;
      } else if (typeof rawExisting === 'string' && rawExisting.trim()) {
        result[gNum] = rawExisting.trim();
      }
      continue;
    }

    if (normIncoming) {
      result[gNum] = normIncoming;
    } else if (!options.allowClearUnlocked && normExisting) {
      result[gNum] = normExisting;
    }
  }

  return result;
}

export interface MergeWeekPicksParams {
  weekNumber: number;
  games: Game[];
  livePicks?: Record<string, PlayerPickData>;
  archivedPicks?: Record<string, PlayerPickData>;
  cloudPicks?: Record<string, PlayerPickData>;
  ledgerGames?: Record<number, { certifiedPicks?: Record<string, CertifiedPickEntry> }>;
}

export function mergeAuthoritativeWeekPicks(
  params: MergeWeekPicksParams
): Record<string, PlayerPickData> {
  const { weekNumber, games, livePicks = {}, archivedPicks = {}, cloudPicks = {}, ledgerGames = {} } = params;

  const gameMap = new Map<number, Game>();
  for (const g of games) {
    gameMap.set(g.gameNumber, g);
  }

  const allContenders = new Set<string>();
  for (const name of Object.keys(livePicks)) allContenders.add(name);
  for (const name of Object.keys(archivedPicks)) allContenders.add(name);
  for (const name of Object.keys(cloudPicks)) allContenders.add(name);
  for (const gCert of Object.values(ledgerGames)) {
    if (gCert?.certifiedPicks) {
      for (const name of Object.keys(gCert.certifiedPicks)) {
        allContenders.add(name);
      }
    }
  }

  const resolved: Record<string, PlayerPickData> = {};

  for (const name of allContenders) {
    const live = livePicks[name]?.week === weekNumber ? livePicks[name] : undefined;
    const arch = archivedPicks[name];
    const cloud = cloudPicks[name]?.week === weekNumber ? cloudPicks[name] : undefined;

    const slotWinners: Record<number, { team: string; actor: PickActor }> = {};

    const considerCandidate = (
      gNum: number,
      rawTeam: string | undefined | null,
      actor: PickActor,
      submittedAt?: string
    ) => {
      const game = gameMap.get(gNum);
      if (games.length > 0 && !game) return;
      const normTeam = game ? normalizeTeamPickForGame(game, rawTeam) : (typeof rawTeam === 'string' ? rawTeam.trim() : null);
      if (!normTeam) return;

      const current = slotWinners[gNum];
      if (shouldIncomingSlotWin(current, { team: normTeam, actor, submittedAt }, game)) {
        slotWinners[gNum] = { team: normTeam, actor };
      }
    };

    // Pass 1: Ledger entries establish verified actor provenance per game
    for (const [gNumStr, gCert] of Object.entries(ledgerGames)) {
      const gNum = Number(gNumStr);
      const cert = gCert?.certifiedPicks?.[name];
      if (cert?.pickedTeam) {
        const certActor: PickActor = cert.actor || (cert.isVegasDefault ? 'vegas_autofill' : (name === 'Elvis' ? 'elvis' : 'contender'));
        considerCandidate(gNum, cert.pickedTeam, certActor, cert.adminOverriddenAt || cert.certifiedAtKickoff);
      }
    }

    // Pass 2: Archive picks (preserve provenance when archive matches a certified autofill slot)
    if (arch?.picks) {
      for (const [gNumStr, rawTeam] of Object.entries(arch.picks)) {
        const gNum = Number(gNumStr);
        const ledgerCert = ledgerGames[gNum]?.certifiedPicks?.[name];
        const isMatchedAutofill =
          ledgerCert?.actor === 'vegas_autofill' &&
          normalizeTeamPickForGame(gameMap.get(gNum) || { awayTeam: '', homeTeam: '' }, rawTeam) === ledgerCert.pickedTeam;
        const actor: PickActor = name === 'Elvis' ? 'elvis' : isMatchedAutofill ? 'vegas_autofill' : 'contender';
        considerCandidate(gNum, rawTeam, actor, arch.submittedAt);
      }
    }

    // Pass 3: Live memory picks
    if (live?.picks) {
      for (const [gNumStr, rawTeam] of Object.entries(live.picks)) {
        const gNum = Number(gNumStr);
        const ledgerCert = ledgerGames[gNum]?.certifiedPicks?.[name];
        const isMatchedAutofill =
          ledgerCert?.actor === 'vegas_autofill' &&
          normalizeTeamPickForGame(gameMap.get(gNum) || { awayTeam: '', homeTeam: '' }, rawTeam) === ledgerCert.pickedTeam;
        const actor: PickActor = name === 'Elvis' ? 'elvis' : isMatchedAutofill ? 'vegas_autofill' : 'contender';
        considerCandidate(gNum, rawTeam, actor, live.submittedAt);
      }
    }

    // Pass 4: Cloud picks (contender submissions from mobile/web)
    if (cloud?.picks && name !== 'Elvis') {
      for (const [gNumStr, rawTeam] of Object.entries(cloud.picks)) {
        const gNum = Number(gNumStr);
        const ledgerCert = ledgerGames[gNum]?.certifiedPicks?.[name];
        const normTeam = gameMap.get(gNum)
          ? normalizeTeamPickForGame(gameMap.get(gNum)!, rawTeam)
          : (typeof rawTeam === 'string' ? rawTeam.trim() : null);
        const isMirroredAutofill =
          ledgerCert?.actor === 'vegas_autofill' &&
          normTeam === ledgerCert.pickedTeam &&
          !cloud.submittedAt;
        const actor: PickActor = isMirroredAutofill ? 'vegas_autofill' : 'contender';
        considerCandidate(gNum, rawTeam, actor, cloud.submittedAt);
      }
    }

    const finalPicks: Record<number, string> = {};
    for (const [gNumStr, slot] of Object.entries(slotWinners)) {
      finalPicks[Number(gNumStr)] = slot.team;
    }

    const hasAnyPick = Object.keys(finalPicks).length > 0;
    let tiebreaker: number | '' = '';
    const candidateTbs = [cloud?.tiebreaker, live?.tiebreaker, arch?.tiebreaker];
    for (const tb of candidateTbs) {
      if (tb !== undefined && tb !== null && tb !== '') {
        const num = typeof tb === 'number' ? tb : parseInt(String(tb), 10);
        if (!isNaN(num) && num >= 0 && num <= 200) {
          tiebreaker = num;
          break;
        }
      }
    }

    const hasNonAutofillPick = Object.values(slotWinners).some(s => s.actor !== 'vegas_autofill');
    const submittedAt = hasNonAutofillPick
      ? (cloud?.submittedAt || live?.submittedAt || arch?.submittedAt)
      : (live?.submittedAt || arch?.submittedAt);

    resolved[name] = {
      contenderName: name,
      picks: finalPicks,
      tiebreaker: hasAnyPick ? tiebreaker : '',
      ...(submittedAt ? { submittedAt } : {}),
      week: weekNumber,
    };
  }

  return resolved;
}
