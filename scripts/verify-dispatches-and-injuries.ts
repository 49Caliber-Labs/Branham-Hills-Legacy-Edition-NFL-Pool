import assert from 'node:assert/strict';
import type { Game, Player, PlayerPickData, SeasonHistory } from '../src/types';
import {
  DISPATCH_EDITION_BADGES,
  DISPATCH_SLOT_NAMES,
  getCanonicalDispatchSubject,
  getCanonicalDispatchTitle,
  normalizeDispatchCanonicalTitles
} from '../src/utils/dispatchTitles';
import {
  fetchLiveNflInjuries,
  renderInjuryReportTableHtml
} from '../src/services/injuryScraperService';
import { buildVibrantWeeklyDispatch } from '../src/services/dispatchGeneratorService';
import { generateDispatchPayload } from '../src/services/gmailService';
import { validateDispatchMandatoryFields } from '../src/services/operationalCheckService';

const REQUIRE_LIVE = process.argv.includes('--require-live');
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

async function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`[E2E PASS] ${name}`);
  } catch (err) {
    console.error(`[E2E FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

const samplePlayers: Player[] = [
  { id: 'p1', name: 'Alex Mercer', email: 'alex.mercer@example.com', role: 'admin', isActive: true },
  { id: 'p2', name: 'Jordan Vance', email: 'jordan.vance@example.com', role: 'player', isActive: true },
  { id: 'p3', name: 'Casey Brooks', email: 'casey.brooks@example.com', role: 'player', isActive: true },
  { id: 'p4', name: 'Taylor Reed', email: 'taylor.reed@example.com', role: 'player', isActive: true },
  { id: 'p5', name: 'Morgan Hayes', email: 'morgan.hayes@example.com', role: 'player', isActive: true },
  { id: 'p6', name: 'Riley Quinn', email: 'riley.quinn@example.com', role: 'player', isActive: true },
  { id: 'p7', name: 'Parker Cole', email: 'parker.cole@example.com', role: 'player', isActive: true },
  { id: 'p8', name: 'Drew Foster', email: 'drew.foster@example.com', role: 'player', isActive: true }
];

const sundayInProgressGames: Game[] = [
  {
    gameNumber: 1,
    week: 11,
    awayTeam: 'Kansas City Chiefs',
    homeTeam: 'Buffalo Bills',
    day: 'Thu',
    kickoffTime: 'Thu 5:15 PM',
    status: 'final',
    awayScore: 24,
    homeScore: 27,
    officialWinner: 'Buffalo Bills',
    favorite: 'Buffalo Bills',
    spread: 'Buffalo Bills -2.5',
    overUnder: 48.5,
    isTNF: true
  },
  {
    gameNumber: 2,
    week: 11,
    awayTeam: 'San Francisco 49ers',
    homeTeam: 'Seattle Seahawks',
    day: 'Sun',
    kickoffTime: 'Sun 1:05 PM',
    status: 'final',
    awayScore: 28,
    homeScore: 21,
    officialWinner: 'San Francisco 49ers',
    favorite: 'San Francisco 49ers',
    spread: 'San Francisco 49ers -4.5',
    overUnder: 46.5
  },
  {
    gameNumber: 3,
    week: 11,
    awayTeam: 'Baltimore Ravens',
    homeTeam: 'Pittsburgh Steelers',
    day: 'Sun',
    kickoffTime: 'Sun 5:20 PM',
    status: 'scheduled',
    awayScore: 0,
    homeScore: 0,
    favorite: 'Baltimore Ravens',
    spread: 'Baltimore Ravens -3.0',
    overUnder: 47.5,
    isSNF: true
  },
  {
    gameNumber: 4,
    week: 11,
    awayTeam: 'Detroit Lions',
    homeTeam: 'Dallas Cowboys',
    day: 'Mon',
    kickoffTime: 'Mon 5:15 PM',
    status: 'scheduled',
    awayScore: 0,
    homeScore: 0,
    favorite: 'Detroit Lions',
    spread: 'Detroit Lions -3.5',
    overUnder: 51.5,
    isMNF: true
  }
];

const tuesdayFinalGames: Game[] = sundayInProgressGames.map(g => {
  if (g.gameNumber === 3) {
    return {
      ...g,
      status: 'final',
      awayScore: 24,
      homeScore: 20,
      officialWinner: 'Baltimore Ravens'
    };
  }
  if (g.gameNumber === 4) {
    return {
      ...g,
      status: 'final',
      awayScore: 31,
      homeScore: 24,
      officialWinner: 'Detroit Lions'
    };
  }
  return g;
});

const samplePicks: Record<string, PlayerPickData> = {
  'Alex Mercer': {
    contenderName: 'Alex Mercer',
    picks: { 1: 'Buffalo Bills', 2: 'San Francisco 49ers', 3: 'Baltimore Ravens', 4: 'Detroit Lions' },
    tiebreaker: 52,
    week: 11
  },
  'Jordan Vance': {
    contenderName: 'Jordan Vance',
    picks: { 1: 'Buffalo Bills', 2: 'San Francisco 49ers', 3: 'Pittsburgh Steelers', 4: 'Detroit Lions' },
    tiebreaker: 49,
    week: 11
  },
  'Casey Brooks': {
    contenderName: 'Casey Brooks',
    picks: { 1: 'Kansas City Chiefs', 2: 'San Francisco 49ers', 3: 'Baltimore Ravens', 4: 'Detroit Lions' },
    tiebreaker: 55,
    week: 11
  },
  'Taylor Reed': {
    contenderName: 'Taylor Reed',
    picks: { 1: 'Buffalo Bills', 2: 'Seattle Seahawks', 3: 'Baltimore Ravens', 4: 'Dallas Cowboys' },
    tiebreaker: 45,
    week: 11
  },
  'Morgan Hayes': {
    contenderName: 'Morgan Hayes',
    picks: { 1: 'Kansas City Chiefs', 2: 'Seattle Seahawks', 3: 'Pittsburgh Steelers', 4: 'Detroit Lions' },
    tiebreaker: 44,
    week: 11
  },
  'Riley Quinn': {
    contenderName: 'Riley Quinn',
    picks: { 1: 'Buffalo Bills', 2: 'San Francisco 49ers', 3: 'Baltimore Ravens', 4: 'Dallas Cowboys' },
    tiebreaker: 50,
    week: 11
  },
  'Parker Cole': {
    contenderName: 'Parker Cole',
    picks: { 1: 'Kansas City Chiefs', 2: 'San Francisco 49ers', 3: 'Pittsburgh Steelers', 4: 'Dallas Cowboys' },
    tiebreaker: 41,
    week: 11
  },
  'Drew Foster': {
    contenderName: 'Drew Foster',
    picks: { 1: 'Buffalo Bills', 2: 'Seattle Seahawks', 3: 'Pittsburgh Steelers', 4: 'Detroit Lions' },
    tiebreaker: 47,
    week: 11
  }
};

const sampleSeasonHistory: SeasonHistory = {
  compiledWeeks: [10],
  records: Object.fromEntries(
    samplePlayers.map((p, idx) => [
      p.name,
      {
        contenderName: p.name,
        totalWins: 80 - idx * 2,
        totalLosses: 50 + idx * 2,
        weeklyBreakdown: {
          10: { week: 10, wins: 10 - (idx % 3), losses: 4 + (idx % 3), isWinner: idx === 0 }
        }
      }
    ])
  )
};

async function main() {
  await runTest('1. Canonical dispatch slot titles and normalization reject legacy drift', () => {
    assert.equal(DISPATCH_SLOT_NAMES.friday, 'The Friday Wire and Injury Report');
    assert.equal(DISPATCH_SLOT_NAMES.sunday, 'Sunday Night Live');
    assert.equal(DISPATCH_SLOT_NAMES.tuesday, 'The Weekly Final');

    assert.equal(getCanonicalDispatchTitle('friday', 11), 'The Friday Wire and Injury Report • Week 11');
    assert.equal(getCanonicalDispatchTitle('sunday', 10), 'Sunday Night Live • Week 10');
    assert.equal(getCanonicalDispatchTitle('tuesday', 10), 'The Weekly Final • Week 10');

    const normFri = normalizeDispatchCanonicalTitles({
      id: 'wk11-friday',
      type: 'friday',
      week: 11,
      title: 'FRIDAY WIRE AND INJURY REPORT • Week 11',
      subject: '[NFL Pool 2026] FRIDAY WIRE AND INJURY REPORT • Week 11'
    });
    assert.equal(normFri.title, 'The Friday Wire and Injury Report • Week 11');
    assert.equal(normFri.subject, '[NFL Pool 2026] 🏈 The Friday Wire and Injury Report • Week 11');

    const normSun = normalizeDispatchCanonicalTitles({
      id: 'wk10-sunday',
      type: 'sunday',
      week: 10,
      title: 'Sunday Night Recap • Week 10',
      subject: '[NFL Pool 2026] Sunday Night Recap • Week 10'
    });
    assert.equal(normSun.title, 'Sunday Night Live • Week 10');
    assert.equal(normSun.subject, '[NFL Pool 2026] 🏈 Sunday Night Live • Week 10');

    const normTue = normalizeDispatchCanonicalTitles({
      id: 'wk10-tuesday',
      type: 'tuesday',
      week: 10,
      title: 'Tuesday Final • Week 10 Crown',
      subject: '[NFL Pool 2026] Tuesday Final • Week 10 Crown'
    });
    assert.equal(normTue.title, 'The Weekly Final • Week 10');
    assert.equal(normTue.subject, '[NFL Pool 2026] 🏈 The Weekly Final • Week 10');

    assert.equal(
      getCanonicalDispatchSubject('tuesday', 11, '[NFL Pool 2026]'),
      '[NFL Pool 2026] 🏈 The Weekly Final • Week 11'
    );
  });

  await runTest('2. Empty injury table renders honest unavailability without 2024 hardcoded players', () => {
    const emptyHtml = renderInjuryReportTableHtml([]);
    assert.ok(
      emptyHtml.includes('Live ESPN NFL injury feed is temporarily unreachable') ||
        emptyHtml.includes('Verify official team inactive lists prior to kickoff'),
      'Expected honest unavailability copy when injuries array is empty'
    );
    assert.equal(emptyHtml.includes('Christian McCaffrey'), false);
    assert.equal(emptyHtml.includes('Deebo Samuel'), false);
    assert.equal(emptyHtml.includes('Jordan Mason'), false);
  });

  await runTest(`3. Live ESPN injury scraper${REQUIRE_LIVE ? ' (--require-live)' : ' (best-effort without --require-live)'}`, async () => {
    const activeTeams = [
      'Kansas City Chiefs',
      'Buffalo Bills',
      'San Francisco 49ers',
      'Seattle Seahawks',
      'Baltimore Ravens',
      'Pittsburgh Steelers',
      'Detroit Lions',
      'Dallas Cowboys',
      'Philadelphia Eagles',
      'Los Angeles Rams',
      'Cincinnati Bengals',
      'Green Bay Packers'
    ];
    const injuries = await fetchLiveNflInjuries(activeTeams);
    if (REQUIRE_LIVE) {
      assert.ok(
        injuries.length >= 4,
        `Expected >= 4 live ESPN injuries across active teams, got ${injuries.length}`
      );
    }

    const nowMs = Date.now();
    const validStatuses = new Set(['Out', 'Doubtful', 'Questionable']);
    const stale2024Notes = [
      'Achilles / IR-Return watch — practice window closely monitored',
      'Pneumonia / Hospitalization recovery — day-to-day evaluation',
      'AC Joint Sprain — limited in Friday walkthrough',
      'Right Ankle Sprain — game-time decision per coaching staff',
      'High Ankle / Knee — out week-to-week after MRI',
      'Left Ankle Sprain — trending toward playing on limited snaps'
    ];

    for (const inj of injuries) {
      assert.ok(validStatuses.has(inj.status), `Unexpected status ${inj.status} for ${inj.player}`);
      assert.ok(inj.updatedAt, `Missing updatedAt timestamp for ${inj.player}`);
      const ts = Date.parse(inj.updatedAt);
      assert.ok(!Number.isNaN(ts), `Invalid updatedAt ${inj.updatedAt} for ${inj.player}`);
      assert.ok(nowMs - ts <= FOURTEEN_DAYS_MS, `Stale injury timestamp (${inj.updatedAt}) for ${inj.player}`);
      for (const staleNote of stale2024Notes) {
        assert.notEqual(inj.notes, staleNote, `Found stale 2024 fallback note on ${inj.player}`);
      }
    }

    if (injuries.length > 0) {
      console.log('   Top 5 live scraped ESPN injuries:');
      for (const sample of injuries.slice(0, 5)) {
        console.log(
          `   - ${sample.player} (${sample.team}, ${sample.position}): ${sample.status} | ${sample.injury} | updated ${sample.updatedAt}`
        );
      }
    }
  });

  await runTest('4. Vibrant broadsheet generator locks canonical titles and edition badges across all 3 slots', async () => {
    const fridayDispatch = await buildVibrantWeeklyDispatch(
      'friday',
      11,
      sundayInProgressGames,
      samplePlayers,
      samplePicks,
      sampleSeasonHistory
    );
    assert.equal(fridayDispatch.title, 'The Friday Wire and Injury Report • Week 11');
    assert.ok(fridayDispatch.subject?.includes('The Friday Wire and Injury Report • Week 11'));
    assert.ok(fridayDispatch.content.includes(DISPATCH_EDITION_BADGES.friday));
    assert.ok(fridayDispatch.content.includes('THE FRIDAY WIRE AND INJURY REPORT'));
    assert.ok(fridayDispatch.content.includes('LIVE NFL INJURY WIRE'));

    const sundayDispatch = await buildVibrantWeeklyDispatch(
      'sunday',
      11,
      sundayInProgressGames,
      samplePlayers,
      samplePicks,
      sampleSeasonHistory
    );
    assert.equal(sundayDispatch.title, 'Sunday Night Live • Week 11');
    assert.ok(sundayDispatch.subject?.includes('Sunday Night Live • Week 11'));
    assert.ok(sundayDispatch.content.includes(DISPATCH_EDITION_BADGES.sunday));
    assert.ok(sundayDispatch.content.includes('SUNDAY NIGHT LIVE'));

    const tuesdayDispatch = await buildVibrantWeeklyDispatch(
      'tuesday',
      11,
      tuesdayFinalGames,
      samplePlayers,
      samplePicks,
      sampleSeasonHistory
    );
    assert.equal(tuesdayDispatch.title, 'The Weekly Final • Week 11');
    assert.ok(tuesdayDispatch.subject?.includes('The Weekly Final • Week 11'));
    assert.ok(tuesdayDispatch.content.includes(DISPATCH_EDITION_BADGES.tuesday));
    assert.ok(tuesdayDispatch.content.includes('THE WEEKLY FINAL'));
  });

  await runTest('5. Gmail dispatch payloads and operational mandatory-field checks pass with canonical names', async () => {
    const fridayPayload = await generateDispatchPayload('friday', sundayInProgressGames, samplePlayers, samplePicks, 11);
    assert.ok(fridayPayload.subject.includes('The Friday Wire and Injury Report'));
    assert.ok(fridayPayload.body.includes('THE FRIDAY WIRE AND INJURY REPORT'));

    const sundayPayload = await generateDispatchPayload('sunday', sundayInProgressGames, samplePlayers, samplePicks, 11);
    assert.ok(sundayPayload.subject.includes('Sunday Night Live'));
    assert.ok(sundayPayload.body.includes('SUNDAY NIGHT LIVE'));

    const sundayValidation = validateDispatchMandatoryFields('sunday', sundayPayload.body, samplePlayers, sundayInProgressGames);
    assert.equal(
      sundayValidation.allPopulated,
      true,
      `Sunday mandatory fields failed: ${sundayValidation.missingFields.join('; ')}`
    );

    const tuesdayPayload = await generateDispatchPayload('tuesday', tuesdayFinalGames, samplePlayers, samplePicks, 11);
    assert.ok(tuesdayPayload.subject.includes('The Weekly Final'));
    assert.ok(tuesdayPayload.body.includes('THE WEEKLY FINAL'));

    const tuesdayValidation = validateDispatchMandatoryFields('tuesday', tuesdayPayload.body, samplePlayers, tuesdayFinalGames);
    assert.equal(
      tuesdayValidation.allPopulated,
      true,
      `Tuesday mandatory fields failed: ${tuesdayValidation.missingFields.join('; ')}`
    );
  });

  console.log('\nALL DISPATCH & INJURY VERIFICATION CHECKS PASSED.');
}

main().catch(err => {
  console.error('[FATAL E2E ERROR]', err);
  process.exit(1);
});
