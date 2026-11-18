import { isFirebaseConfigured } from '../lib/firebase-client';

/**
 * CloudWriteWatchdog - Universal 24/7 Circuit Breaker & Rate Limiter
 * 
 * Prevents runaway cloud write loops from ever exhausting Firestore quotas or incurring unexpected cloud bills.
 * Hard limit: 500 writes per day (normal pool operations require < 400 writes PER WEEK).
 * Velocity limit: Max 10 writes per minute.
 */

export const DAILY_WRITE_LIMIT = 500;
export const VELOCITY_LIMIT_PER_MINUTE = 10;
const STORAGE_KEY = 'bh_cloud_write_watchdog_v1';

export interface CloudWriteLogEntry {
  timestampIso: string;
  target: string;
  caller: string;
  count: number;
}

export interface WatchdogState {
  date: string; // YYYY-MM-DD
  dailyCount: number;
  recentTimestamps: number[]; // Epoch ms of writes in the last 60 seconds
  isTripped: boolean;
  trippedReason: string | null;
  trippedAtIso: string | null;
  history: CloudWriteLogEntry[];
}

export function getTodayDateString(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// In-memory state singleton
let inMemoryWatchdogState: WatchdogState = loadInitialWatchdogState();

function loadInitialWatchdogState(): WatchdogState {
  const today = getTodayDateString();
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today) {
          return {
            ...parsed,
            recentTimestamps: Array.isArray(parsed.recentTimestamps) 
              ? parsed.recentTimestamps.filter((t: number) => Date.now() - t < 60000)
              : []
          };
        }
      }
    }
  } catch {}

  return {
    date: today,
    dailyCount: 0,
    recentTimestamps: [],
    isTripped: false,
    trippedReason: null,
    trippedAtIso: null,
    history: []
  };
}

function persistWatchdogState(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryWatchdogState));
    }
  } catch {}

  // Broadcast event to UI listeners if in browser
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('cloud_write_watchdog_updated', {
        detail: getWatchdogStatus()
      }));
    } catch {}
  }
}

/**
 * Check whether a prospective write is safe to execute.
 * Returns allowed: false if the circuit breaker is tripped or velocity limit exceeded.
 */
export function canPerformCloudWrite(target: string, writeCount = 1): { allowed: boolean; reason?: string } {
  const today = getTodayDateString();
  const now = Date.now();

  // Day rollover check
  if (inMemoryWatchdogState.date !== today) {
    inMemoryWatchdogState = {
      date: today,
      dailyCount: 0,
      recentTimestamps: [],
      isTripped: false,
      trippedReason: null,
      trippedAtIso: null,
      history: []
    };
    persistWatchdogState();
  }

  // Check if circuit breaker was already tripped
  if (inMemoryWatchdogState.isTripped) {
    return {
      allowed: false,
      reason: inMemoryWatchdogState.trippedReason || 'Circuit breaker engaged. Daily quota limit reached.'
    };
  }

  // Check daily limit
  if (inMemoryWatchdogState.dailyCount + writeCount > DAILY_WRITE_LIMIT) {
    inMemoryWatchdogState.isTripped = true;
    inMemoryWatchdogState.trippedReason = `Daily write limit of ${DAILY_WRITE_LIMIT} reached (${inMemoryWatchdogState.dailyCount} writes today). All further cloud writes blocked.`;
    inMemoryWatchdogState.trippedAtIso = new Date().toISOString();
    persistWatchdogState();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cloud_write_watchdog_tripped', {
        detail: { reason: inMemoryWatchdogState.trippedReason, target }
      }));
    }

    return { allowed: false, reason: inMemoryWatchdogState.trippedReason };
  }

  // Check 60-second velocity limit
  const recent = inMemoryWatchdogState.recentTimestamps.filter(t => now - t < 60000);
  inMemoryWatchdogState.recentTimestamps = recent;

  if (recent.length + writeCount > VELOCITY_LIMIT_PER_MINUTE) {
    const reason = `Velocity safety brake: Exceeded ${VELOCITY_LIMIT_PER_MINUTE} writes/minute (${recent.length} writes in last 60s). Write to "${target}" throttled.`;
    console.warn(`[CloudWriteWatchdog] 🛑 ${reason}`);
    return { allowed: false, reason };
  }

  return { allowed: true };
}

/**
 * Record a successfully executed cloud write
 */
export function recordCloudWrite(target: string, caller: string, writeCount = 1): void {
  const now = Date.now();
  const nowIso = new Date().toISOString();

  inMemoryWatchdogState.dailyCount += writeCount;
  for (let i = 0; i < writeCount; i++) {
    inMemoryWatchdogState.recentTimestamps.push(now);
  }

  inMemoryWatchdogState.history.unshift({
    timestampIso: nowIso,
    target,
    caller,
    count: writeCount
  });

  if (inMemoryWatchdogState.history.length > 50) {
    inMemoryWatchdogState.history.length = 50;
  }

  console.log(`[CloudWriteWatchdog] ✍️ Cloud write logged: ${target} by ${caller} (+${writeCount}). Today's total: ${inMemoryWatchdogState.dailyCount}/${DAILY_WRITE_LIMIT}`);
  persistWatchdogState();
}

/**
 * Guarded write wrapper - intercepts any write execution
 */
export async function guardedCloudWrite<T>(
  target: string,
  caller: string,
  writeFn: () => Promise<T>,
  writeCount = 1
): Promise<{ success: boolean; result?: T; error?: string; throttled?: boolean }> {
  if (!isFirebaseConfigured) {
    return { success: false, throttled: false, error: 'Local storage mode (Firebase not configured)' };
  }

  const check = canPerformCloudWrite(target, writeCount);
  if (!check.allowed) {
    console.warn(`[CloudWriteWatchdog] 🛑 Blocked write to "${target}" from "${caller}": ${check.reason}`);
    return { success: false, throttled: true, error: check.reason };
  }

  try {
    const result = await writeFn();
    recordCloudWrite(target, caller, writeCount);
    return { success: true, result };
  } catch (err: any) {
    console.error(`[CloudWriteWatchdog] Write execution error on "${target}":`, err?.message || err);
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Retrieve current watchdog metrics for UI display and status monitoring
 */
export function getWatchdogStatus(): {
  date: string;
  dailyCount: number;
  dailyLimit: number;
  recentMinuteCount: number;
  velocityLimit: number;
  isTripped: boolean;
  trippedReason: string | null;
  trippedAtIso: string | null;
  percentUsed: number;
} {
  const now = Date.now();
  const recent = (inMemoryWatchdogState.recentTimestamps || []).filter(t => now - t < 60000);
  const percent = Math.min(100, Math.round((inMemoryWatchdogState.dailyCount / DAILY_WRITE_LIMIT) * 100));

  return {
    date: inMemoryWatchdogState.date,
    dailyCount: inMemoryWatchdogState.dailyCount,
    dailyLimit: DAILY_WRITE_LIMIT,
    recentMinuteCount: recent.length,
    velocityLimit: VELOCITY_LIMIT_PER_MINUTE,
    isTripped: inMemoryWatchdogState.isTripped,
    trippedReason: inMemoryWatchdogState.trippedReason,
    trippedAtIso: inMemoryWatchdogState.trippedAtIso,
    percentUsed: percent
  };
}

/**
 * Reset the watchdog breaker (Admin authority only)
 */
export function resetWatchdogBreaker(): void {
  inMemoryWatchdogState.dailyCount = 0;
  inMemoryWatchdogState.isTripped = false;
  inMemoryWatchdogState.trippedReason = null;
  inMemoryWatchdogState.trippedAtIso = null;
  inMemoryWatchdogState.recentTimestamps = [];
  persistWatchdogState();
  console.log('[CloudWriteWatchdog] 🔄 Watchdog circuit breaker & daily counter reset to 0 by Admin.');
}
