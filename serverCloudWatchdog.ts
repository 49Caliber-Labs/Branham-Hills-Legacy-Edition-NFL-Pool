import fs from 'fs';
import path from 'path';
import firebaseConfig from './firebase-applet-config.json';

export const isServerFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('YOUR_') &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'demo-local-nfl-pool'
);

/**
 * ServerCloudWatchdog - Central 24/7 Firestore Write Watchdog & Circuit Breaker
 * 
 * Hard ceiling: 500 writes/day (Normal weekly pool operation requires < 200 writes TOTAL).
 * Velocity ceiling: 10 writes/minute.
 * Persistent meter: data/cloud-write-meter.json
 * 
 * If either threshold is crossed, the circuit breaker TRIPS immediately.
 * All subsequent cloud writes are blocked at the gate.
 * Local server persistence (data/pool-storage.json) continues operating 100% normally.
 */

export const SERVER_DAILY_WRITE_LIMIT = 500;
export const SERVER_VELOCITY_LIMIT_PER_MINUTE = 10;

const DATA_DIR = path.join(process.cwd(), 'data');
const METER_FILE = path.join(DATA_DIR, 'cloud-write-meter.json');

export interface CloudWriteLogEntry {
  timestampIso: string;
  target: string;
  caller: string;
  count: number;
}

export interface ServerWatchdogState {
  date: string; // YYYY-MM-DD in America/Los_Angeles
  dailyCount: number;
  recentTimestamps: number[]; // Epoch ms of writes in the last 60 seconds
  isTripped: boolean;
  trippedReason: string | null;
  trippedAtIso: string | null;
  history: CloudWriteLogEntry[];
}

export function getPstDateString(): string {
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

let inMemoryState: ServerWatchdogState = loadInitialState();

function loadInitialState(): ServerWatchdogState {
  const today = getPstDateString();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(METER_FILE)) {
      const raw = fs.readFileSync(METER_FILE, 'utf-8');
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
  } catch (err: any) {
    console.warn('[ServerWatchdog] Failed to load meter file, initializing fresh state:', err?.message);
  }

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

function persistState(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${METER_FILE}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
    fs.writeFileSync(tempFile, JSON.stringify(inMemoryState, null, 2), 'utf-8');
    try {
      fs.renameSync(tempFile, METER_FILE);
    } catch {
      // Fallback on Windows concurrent file collisions (EBUSY)
      fs.writeFileSync(METER_FILE, JSON.stringify(inMemoryState, null, 2), 'utf-8');
      try { fs.unlinkSync(tempFile); } catch {}
    }
  } catch (err: any) {
    console.error('[ServerWatchdog] Error writing meter file:', err?.message);
  }
}

/**
 * Gate check: Can the server perform a cloud write of size writeCount?
 */
export function canServerPerformCloudWrite(target: string, writeCount = 1): { allowed: boolean; reason?: string } {
  if (!isServerFirebaseConfigured) {
    return { allowed: false, reason: 'Local storage mode (Firebase not configured)' };
  }

  const today = getPstDateString();
  const now = Date.now();

  // Day rollover
  if (inMemoryState.date !== today) {
    console.log(`[ServerWatchdog] 📅 PST Day rollover from ${inMemoryState.date} to ${today}. Resetting daily write counter.`);
    inMemoryState = {
      date: today,
      dailyCount: 0,
      recentTimestamps: [],
      isTripped: false,
      trippedReason: null,
      trippedAtIso: null,
      history: []
    };
    persistState();
  }

  // Already tripped
  if (inMemoryState.isTripped) {
    return {
      allowed: false,
      reason: inMemoryState.trippedReason || 'Circuit breaker engaged. Daily Firestore write quota ceiling reached.'
    };
  }

  // Daily limit check
  if (inMemoryState.dailyCount + writeCount > SERVER_DAILY_WRITE_LIMIT) {
    inMemoryState.isTripped = true;
    inMemoryState.trippedReason = `Daily write limit of ${SERVER_DAILY_WRITE_LIMIT} reached (${inMemoryState.dailyCount} writes executed today). Circuit breaker activated to prevent quota exhaustion.`;
    inMemoryState.trippedAtIso = new Date().toISOString();
    persistState();
    console.error(`[ServerWatchdog] 🛑 CIRCUIT BREAKER TRIPPED! ${inMemoryState.trippedReason}`);
    return { allowed: false, reason: inMemoryState.trippedReason };
  }

  // 60-second velocity check
  const recent = inMemoryState.recentTimestamps.filter(t => now - t < 60000);
  inMemoryState.recentTimestamps = recent;

  if (recent.length + writeCount > SERVER_VELOCITY_LIMIT_PER_MINUTE) {
    inMemoryState.isTripped = true;
    inMemoryState.trippedReason = `Velocity brake engaged: Exceeded ${SERVER_VELOCITY_LIMIT_PER_MINUTE} writes/minute (${recent.length} in last 60s). Circuit breaker activated to prevent runaway loops.`;
    inMemoryState.trippedAtIso = new Date().toISOString();
    persistState();
    console.warn(`[ServerWatchdog] 🛑 ${inMemoryState.trippedReason}`);
    return { allowed: false, reason: inMemoryState.trippedReason };
  }

  return { allowed: true };
}

/**
 * Record executed writes in meter & history
 */
export function recordServerCloudWrite(target: string, caller: string, writeCount = 1): void {
  const now = Date.now();
  const nowIso = new Date().toISOString();

  inMemoryState.dailyCount += writeCount;
  for (let i = 0; i < writeCount; i++) {
    inMemoryState.recentTimestamps.push(now);
  }

  inMemoryState.history.unshift({
    timestampIso: nowIso,
    target,
    caller,
    count: writeCount
  });

  if (inMemoryState.history.length > 50) {
    inMemoryState.history.length = 50;
  }

  console.log(`[ServerWatchdog] 🛡️ Cloud write logged: [${target}] by [${caller}] (+${writeCount} doc${writeCount > 1 ? 's' : ''}). Total today: ${inMemoryState.dailyCount}/${SERVER_DAILY_WRITE_LIMIT}`);
  persistState();
}

/**
 * Executes a write operation guarded by the Watchdog and circuit breaker
 */
export async function guardedServerCloudWrite<T>(
  target: string,
  caller: string,
  writeFn: () => Promise<T>,
  writeCount = 1
): Promise<{ success: boolean; result?: T; error?: string; throttled?: boolean }> {
  const check = canServerPerformCloudWrite(target, writeCount);
  if (!check.allowed) {
    console.warn(`[ServerWatchdog] 🛑 Blocked write to "${target}" by "${caller}": ${check.reason}`);
    return { success: false, throttled: true, error: check.reason };
  }

  try {
    const result = await writeFn();
    recordServerCloudWrite(target, caller, writeCount);
    return { success: true, result };
  } catch (err: any) {
    console.error(`[ServerWatchdog] Cloud write failed on "${target}":`, err?.message || err);
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Retrieve current metrics for status route & admin UI
 */
export function getServerWatchdogStatus() {
  const today = getPstDateString();
  const now = Date.now();

  // Day rollover
  if (inMemoryState.date !== today) {
    inMemoryState = {
      date: today,
      dailyCount: 0,
      recentTimestamps: [],
      isTripped: false,
      trippedReason: null,
      trippedAtIso: null,
      history: []
    };
    persistState();
  }

  const recent = (inMemoryState.recentTimestamps || []).filter(t => now - t < 60000);
  const percent = Math.min(100, Math.round((inMemoryState.dailyCount / SERVER_DAILY_WRITE_LIMIT) * 100));

  return {
    date: inMemoryState.date,
    dailyCount: inMemoryState.dailyCount,
    dailyLimit: SERVER_DAILY_WRITE_LIMIT,
    recentMinuteCount: recent.length,
    velocityLimit: SERVER_VELOCITY_LIMIT_PER_MINUTE,
    isTripped: inMemoryState.isTripped,
    trippedReason: inMemoryState.trippedReason,
    trippedAtIso: inMemoryState.trippedAtIso,
    percentUsed: percent,
    history: inMemoryState.history.slice(0, 20)
  };
}

/**
 * Reset the circuit breaker (Admin authority)
 */
export function resetServerWatchdogBreaker(): { success: boolean; message: string } {
  inMemoryState.dailyCount = 0;
  inMemoryState.isTripped = false;
  inMemoryState.trippedReason = null;
  inMemoryState.trippedAtIso = null;
  inMemoryState.recentTimestamps = [];
  persistState();
  console.log('[ServerWatchdog] ⚡ Circuit breaker & daily write counter reset to 0 by Administrator.');
  return { success: true, message: 'Server cloud write circuit breaker and daily counter successfully reset to 0.' };
}

/**
 * Manually trip the circuit breaker for verification and diagnostic testing
 */
export function tripServerWatchdogBreaker(reason = 'Diagnostic trip initiated by Admin to verify write-freeze protection.'): { success: boolean; message: string } {
  inMemoryState.isTripped = true;
  inMemoryState.trippedReason = reason;
  inMemoryState.trippedAtIso = new Date().toISOString();
  persistState();
  console.log(`[ServerWatchdog] 🛑 Circuit breaker manually tripped by Administrator: ${reason}`);
  return { success: true, message: reason };
}

/**
 * Execute an audited diagnostic ping write to verify telemetry recording
 */
export function testServerCloudWrite(
  target = 'diagnostic/ping',
  caller = 'admin_ui_test'
): { success: boolean; status: ReturnType<typeof getServerWatchdogStatus>; message?: string; throttled?: boolean } {
  const check = canServerPerformCloudWrite(target, 1);
  if (!check.allowed) {
    return {
      success: false,
      throttled: true,
      message: check.reason,
      status: getServerWatchdogStatus()
    };
  }
  recordServerCloudWrite(target, caller, 1);
  return { success: true, status: getServerWatchdogStatus() };
}
