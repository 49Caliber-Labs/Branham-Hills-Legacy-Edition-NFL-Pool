import assert from 'node:assert/strict';
import type { Game, PlayerPickData } from '../src/types';
import {
  AUTOFILL_GRACE_MS,
  DEFAULT_MNF_TIEBREAKER,
  PICK_ACTOR_PRIORITY,
  applyBlankOnlyFavorites,
  buildElvisPickSheet,
  isGameEligibleForAutofill,
  isGameLockedAtTime,
  mergeAuthoritativeWeekPicks,
  normalizeTeamPickForGame,
  resolveDefaultMnfTiebreaker,
  resolveGameFavorite,
  sanitizeClientSubmissionPicks,
  shouldIncomingSlotWin,
  type CertifiedPickEntry
} from '../src/utils/pickRulesEngine';

function fail(message: string, err?: unknown): never {
  console.error(`[E2E FAIL] ${message}`);
  if (err) console.error(err);
  process.exit(1);
}

function runTest(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`[E2E PASS] ${name}`);
  } catch (err) {
    fail(name, err);
  }
}

const nowMs = Date.now();
const unlockedKickoffIso = new Date(nowMs + 2 * 60 * 60 * 1000).toISOString();
const postGraceKickoffIso = new Date(nowMs - AUTOFILL_GRACE_MS - 60_000).toISOString();
const insideGraceKickoffIso = new Date(nowMs - 30_000).toISOString();
const preKickoffSubmittedIso = new Date(nowMs - 60 * 60 * 1000).toISOString();
const postKickoffSubmittedIso = new Date(nowMs - 10_000).toISOString();

function makeGame(overrides: Partial<Game> & Pick<Game, 'gameNumber' | 'awayTeam' | 'homeTeam'>): Game {
  return {
    id: `wk11-g${overrides.gameNumber}`,
    week: 11,
    spread: `${overrides.homeTeam} -3.5`,
    kickoffTime: 'Sun 1:00 PM',
    kickoffIso: unlockedKickoffIso,
    status: 'upcoming',
    awayScore: 0,
    homeScore: 0,
    ...overrides
  } as Game;
}

const lockedGame1 = makeGame({
  gameNumber: 1,
  awayTeam: 'Buffalo Bills',
  homeTeam: 'Kansas City Chiefs',
  favorite: 'Kansas City Chiefs',
  spread: 'Kansas City Chiefs -2.5',
  kickoffIso: postGraceKickoffIso,
  status: 'in_progress'
});

const graceGame2 = makeGame({
  gameNumber: 2,
  awayTeam: 'Chicago Bears',
  homeTeam: 'Detroit Lions',
  favorite: 'Detroit Lions',
  spread: 'Detroit Lions -6.5',
  kickoffIso: insideGraceKickoffIso,
  status: 'in_progress'
});

const unlockedGame3 = makeGame({
  gameNumber: 3,
  awayTeam: 'Cincinnati Bengals',
  homeTeam: 'Baltimore Ravens',
  favorite: undefined,
  spread: 'Baltimore Ravens -4.5',
  kickoffIso: unlockedKickoffIso,
  status: 'upcoming'
});

const unlockedMnfGame4 = makeGame({
  gameNumber: 4,
  awayTeam: 'Dallas Cowboys',
  homeTeam: 'San Francisco 49ers',
  favorite: undefined,
  spread: 'San Francisco 49ers -7.0',
  kickoffTime: 'Mon 8:15 PM',
  kickoffIso: unlockedKickoffIso,
  status: 'upcoming'
});

const sampleWeekGames: Game[] = [lockedGame1, graceGame2, unlockedGame3, unlockedMnfGame4];

// 1. Canonical favorites, Elvis generation & MNF tiebreaker parity
runTest('1. resolveGameFavorite, normalizeTeamPickForGame & buildElvisPickSheet parity', () => {
  assert.equal(DEFAULT_MNF_TIEBREAKER, 45);
  assert.equal(resolveGameFavorite(lockedGame1), 'Kansas City Chiefs');
  assert.equal(resolveGameFavorite(unlockedGame3), 'Baltimore Ravens');
  assert.equal(resolveGameFavorite(unlockedMnfGame4), 'San Francisco 49ers');
  assert.equal(normalizeTeamPickForGame(lockedGame1, 'Bills'), 'Buffalo Bills');
  assert.equal(normalizeTeamPickForGame(lockedGame1, 'Detroit Lions'), null);

  assert.equal(resolveDefaultMnfTiebreaker(sampleWeekGames), DEFAULT_MNF_TIEBREAKER);

  const elvisSheet = buildElvisPickSheet(sampleWeekGames, preKickoffSubmittedIso);
  assert.equal(elvisSheet.contenderName, 'Elvis');
  assert.equal(elvisSheet.week, 11);
  assert.equal(elvisSheet.tiebreaker, DEFAULT_MNF_TIEBREAKER);
  assert.equal(elvisSheet.submittedAt, preKickoffSubmittedIso);
  for (const g of sampleWeekGames) {
    assert.equal(elvisSheet.picks[g.gameNumber], resolveGameFavorite(g));
  }
});

// 2. Single precedence law: admin (4) > contender pre-kickoff (3) > elvis (2) > vegas_autofill (1)
runTest('2. shouldIncomingSlotWin enforces strict non-overwrite actor hierarchy', () => {
  assert.equal(PICK_ACTOR_PRIORITY.admin, 4);
  assert.equal(PICK_ACTOR_PRIORITY.contender, 3);
  assert.equal(PICK_ACTOR_PRIORITY.elvis, 2);
  assert.equal(PICK_ACTOR_PRIORITY.vegas_autofill, 1);

  // vegas_autofill NEVER overwrites contender, admin, or elvis
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Buffalo Bills', actor: 'contender' },
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      lockedGame1
    ),
    false
  );
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Buffalo Bills', actor: 'admin' },
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      lockedGame1
    ),
    false
  );
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Kansas City Chiefs', actor: 'elvis' },
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      lockedGame1
    ),
    false
  );

  // vegas_autofill fills strictly empty slot
  assert.equal(
    shouldIncomingSlotWin(
      null,
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      lockedGame1
    ),
    true
  );

  // Contender vs vegas_autofill: 4 explicit boundary cases
  // (a) Unlocked game -> true
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Baltimore Ravens', actor: 'vegas_autofill' },
      { team: 'Cincinnati Bengals', actor: 'contender' },
      unlockedGame3
    ),
    true
  );
  // (b) Locked game with valid pre-kickoff submittedAt -> true (heals late-synced autofill)
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      { team: 'Buffalo Bills', actor: 'contender', submittedAt: preKickoffSubmittedIso },
      lockedGame1
    ),
    true
  );
  // (c) Locked game with post-kickoff submittedAt -> false (late submission denied)
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      { team: 'Buffalo Bills', actor: 'contender', submittedAt: postKickoffSubmittedIso },
      lockedGame1
    ),
    false
  );
  // (d) Locked game with omitted submittedAt -> false (unverified overwrite denied)
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Kansas City Chiefs', actor: 'vegas_autofill' },
      { team: 'Buffalo Bills', actor: 'contender' },
      lockedGame1
    ),
    false
  );

  // Contender updating own pick: pre-kickoff true, post-kickoff false
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Baltimore Ravens', actor: 'contender' },
      { team: 'Cincinnati Bengals', actor: 'contender' },
      unlockedGame3
    ),
    true
  );
  assert.equal(
    shouldIncomingSlotWin(
      { team: 'Buffalo Bills', actor: 'contender' },
      { team: 'Kansas City Chiefs', actor: 'contender' },
      lockedGame1
    ),
    false
  );

  // Admin overrides all actors cleanly, both pre- and post-kickoff
  for (const actor of ['contender', 'elvis', 'vegas_autofill', 'admin'] as const) {
    assert.equal(
      shouldIncomingSlotWin(
        { team: 'Buffalo Bills', actor },
        { team: 'Kansas City Chiefs', actor: 'admin' },
        lockedGame1
      ),
      true
    );
  }
});

// 3. Blank-only Quick Fill & Admin Hub Fill Favorites
runTest('3. applyBlankOnlyFavorites never overwrites existing human picks', () => {
  const fullPicks: Record<number, string> = {
    1: 'Buffalo Bills',
    2: 'Chicago Bears',
    3: 'Cincinnati Bengals',
    4: 'Dallas Cowboys'
  };
  const fullAdminAttempt = applyBlankOnlyFavorites(fullPicks, sampleWeekGames, {
    allowLockedGames: true,
    nowMs
  });
  assert.equal(fullAdminAttempt.filledCount, 0);
  assert.deepEqual(fullAdminAttempt.picks, fullPicks);

  const partialPicks: Record<number, string> = {
    3: 'Cincinnati Bengals' // underdog pick on unlocked game must remain intact
  };
  const playerFill = applyBlankOnlyFavorites(partialPicks, sampleWeekGames, {
    allowLockedGames: false,
    nowMs
  });
  assert.equal(playerFill.filledCount, 1); // only unlockedGame4 filled
  assert.equal(playerFill.picks[1], undefined); // lockedGame1 skipped for non-admin
  assert.equal(playerFill.picks[2], undefined); // graceGame2 locked skipped for non-admin
  assert.equal(playerFill.picks[3], 'Cincinnati Bengals');
  assert.equal(playerFill.picks[4], 'San Francisco 49ers');

  const adminFill = applyBlankOnlyFavorites(partialPicks, sampleWeekGames, {
    allowLockedGames: true,
    nowMs
  });
  assert.equal(adminFill.filledCount, 3); // games 1, 2, 4 filled; game 3 underdog preserved
  assert.equal(adminFill.picks[1], 'Kansas City Chiefs');
  assert.equal(adminFill.picks[2], 'Detroit Lions');
  assert.equal(adminFill.picks[3], 'Cincinnati Bengals');
  assert.equal(adminFill.picks[4], 'San Francisco 49ers');
});

// 4. Kickoff + Cloud-Verification Autofill Gate
runTest('4. isGameEligibleForAutofill enforces kickoff lock, 2-min grace, cloud gate, and policy', () => {
  const lockedKickoffMs = new Date(postGraceKickoffIso).getTime();

  assert.equal(isGameLockedAtTime(lockedGame1, nowMs), true);
  assert.equal(isGameLockedAtTime(unlockedGame3, nowMs), false);

  // Blocked if cloud sync never succeeded when cloud is required
  assert.equal(
    isGameEligibleForAutofill(lockedGame1, {
      nowMs,
      lastCloudSyncMs: null,
      cloudRequired: true
    }),
    false
  );

  // Blocked if last cloud sync predates kickoff (stale pre-kickoff view)
  assert.equal(
    isGameEligibleForAutofill(lockedGame1, {
      nowMs,
      lastCloudSyncMs: lockedKickoffMs - 5_000,
      cloudRequired: true
    }),
    false
  );

  // Blocked inside 2-minute kickoff grace window even when status flipped to in_progress & cloud synced
  assert.equal(
    isGameEligibleForAutofill(graceGame2, {
      nowMs,
      lastCloudSyncMs: nowMs,
      cloudRequired: true
    }),
    false
  );

  // Blocked when missedPickPolicy is no_autofill_zero
  assert.equal(
    isGameEligibleForAutofill(lockedGame1, {
      nowMs,
      lastCloudSyncMs: nowMs,
      cloudRequired: true,
      missedPickPolicy: 'no_autofill_zero'
    }),
    false
  );

  // Allowed once past grace + verified post-kickoff cloud sync
  assert.equal(
    isGameEligibleForAutofill(lockedGame1, {
      nowMs,
      lastCloudSyncMs: lockedKickoffMs + 1_000,
      cloudRequired: true,
      missedPickPolicy: 'vegas_autofill_human_priority'
    }),
    true
  );

  // Allowed without cloud sync when cloudRequired is false (local/demo environment)
  assert.equal(
    isGameEligibleForAutofill(lockedGame1, {
      nowMs,
      lastCloudSyncMs: null,
      cloudRequired: false
    }),
    true
  );
});

// 5. Authoritative multi-source merge across Archive, Ledger, Cloud & Live Memory
runTest('5. mergeAuthoritativeWeekPicks reconciles Live/Archive/Cloud/Ledger cleanly', () => {
  const livePicks: Record<string, PlayerPickData> = {
    PlayerAlpha: {
      contenderName: 'PlayerAlpha',
      picks: { 1: 'Buffalo Bills', 3: 'Cincinnati Bengals' },
      tiebreaker: '48',
      submittedAt: preKickoffSubmittedIso,
      week: 11
    }
  };
  const archivedPicks: Record<string, PlayerPickData> = {
    PlayerBravo: {
      contenderName: 'PlayerBravo',
      picks: { 1: 'Buffalo Bills', 3: 'Baltimore Ravens' },
      tiebreaker: '51',
      submittedAt: preKickoffSubmittedIso,
      week: 11
    }
  };
  const cloudPicks: Record<string, PlayerPickData> = {
    PlayerCharlie: {
      contenderName: 'PlayerCharlie',
      picks: { 3: 'Cincinnati Bengals' },
      tiebreaker: '44',
      submittedAt: preKickoffSubmittedIso,
      week: 11
    }
  };
  const ledgerGames: Record<number, { certifiedPicks?: Record<string, CertifiedPickEntry> }> = {
    1: {
      certifiedPicks: {
        // Stale vegas_autofill in ledger MUST lose to PlayerAlpha's Buffalo Bills pick
        PlayerAlpha: {
          pickedTeam: 'Kansas City Chiefs',
          certifiedAtKickoff: postGraceKickoffIso,
          actor: 'vegas_autofill',
          isVegasDefault: true,
          isCorrect: null
        },
        // Admin override MUST beat PlayerBravo's Buffalo Bills pick
        PlayerBravo: {
          pickedTeam: 'Kansas City Chiefs',
          certifiedAtKickoff: postGraceKickoffIso,
          adminOverriddenAt: postKickoffSubmittedIso,
          actor: 'admin',
          isVegasDefault: false,
          isCorrect: null
        },
        // PlayerDelta had no submission; certified vegas_autofill fills blank slot WITHOUT fabricating submittedAt
        PlayerDelta: {
          pickedTeam: 'Kansas City Chiefs',
          certifiedAtKickoff: postGraceKickoffIso,
          actor: 'vegas_autofill',
          isVegasDefault: true,
          isCorrect: null
        }
      }
    }
  };

  const merged = mergeAuthoritativeWeekPicks({
    weekNumber: 11,
    games: sampleWeekGames,
    livePicks,
    archivedPicks,
    cloudPicks,
    ledgerGames
  });

  assert.equal(merged.PlayerAlpha.picks[1], 'Buffalo Bills');
  assert.equal(merged.PlayerAlpha.picks[3], 'Cincinnati Bengals');
  assert.equal(merged.PlayerAlpha.submittedAt, preKickoffSubmittedIso);

  assert.equal(merged.PlayerBravo.picks[1], 'Kansas City Chiefs'); // admin wins
  assert.equal(merged.PlayerBravo.picks[3], 'Baltimore Ravens'); // archive preserved

  assert.equal(merged.PlayerCharlie.picks[3], 'Cincinnati Bengals'); // cloud preserved

  assert.equal(merged.PlayerDelta.picks[1], 'Kansas City Chiefs');
  assert.equal(merged.PlayerDelta.submittedAt, undefined); // never fabricated!
});

// 6. Client submission & clear sanitization boundaries
runTest('6. sanitizeClientSubmissionPicks enforces lock boundaries and safe clearing', () => {
  const existing: Record<number, string> = {
    1: 'Buffalo Bills', // locked
    3: 'Baltimore Ravens', // unlocked
    4: 'San Francisco 49ers' // unlocked
  };

  // Contender tries to flip locked game 1 and update unlocked game 3
  const contenderEdit = sanitizeClientSubmissionPicks(
    existing,
    { 1: 'Kansas City Chiefs', 3: 'Cincinnati Bengals', 4: 'Dallas Cowboys' },
    sampleWeekGames,
    { adminOverride: false, nowMs }
  );
  assert.equal(contenderEdit[1], 'Buffalo Bills'); // locked slot untouched
  assert.equal(contenderEdit[3], 'Cincinnati Bengals'); // unlocked updated
  assert.equal(contenderEdit[4], 'Dallas Cowboys');

  // Contender clears board explicitly: unlocked cleared, locked retained!
  const contenderClear = sanitizeClientSubmissionPicks(
    existing,
    {},
    sampleWeekGames,
    { adminOverride: false, allowClearUnlocked: true, nowMs }
  );
  assert.equal(contenderClear[1], 'Buffalo Bills');
  assert.equal(contenderClear[3], undefined);
  assert.equal(contenderClear[4], undefined);

  // Accidental empty submission WITHOUT allowClearUnlocked retains existing picks
  const accidentalEmpty = sanitizeClientSubmissionPicks(
    existing,
    {},
    sampleWeekGames,
    { adminOverride: false, allowClearUnlocked: false, nowMs }
  );
  assert.equal(accidentalEmpty[1], 'Buffalo Bills');
  assert.equal(accidentalEmpty[3], 'Baltimore Ravens');
  assert.equal(accidentalEmpty[4], 'San Francisco 49ers');

  // Admin override IS permitted to modify locked game 1
  const adminEdit = sanitizeClientSubmissionPicks(
    existing,
    { 1: 'Kansas City Chiefs', 3: 'Cincinnati Bengals' },
    sampleWeekGames,
    { adminOverride: true, nowMs }
  );
  assert.equal(adminEdit[1], 'Kansas City Chiefs');
  assert.equal(adminEdit[3], 'Cincinnati Bengals');
});

console.log('[E2E COMPLETE] All 6 hardened pick rules engine invariants verified.');
