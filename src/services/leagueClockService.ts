import { Game } from '../types';

export type LeaguePhase = 
  | 'PRE_WEEK'      // 0 games kicked off
  | 'TNF_LIVE'      // Thursday Night game is live
  | 'TNF_FINAL'     // TNF is final (Triggers Friday Night Wire)
  | 'SUNDAY_LIVE'   // Sunday slate is underway
  | 'SNF_FINAL'     // Sunday night game is final (Triggers Sunday Night Recap)
  | 'MNF_LIVE'      // Monday night game is underway
  | 'MNF_FINAL'     // All weekly games final (Triggers Tuesday Final & Standings Freeze)
  | 'WEEK_FROZEN';  // Standings frozen & archived

export interface LeaguePulse {
  phase: LeaguePhase;
  phaseLabel: string;
  phaseDescription: string;
  currentWeek: number;
  totalGames: number;
  finalGames: number;
  liveGames: number;
  pendingGames: number;
  allGamesFinal: boolean;
  hasTNF: boolean;
  tnfFinal: boolean;
  snfFinal: boolean;
  mnfFinal: boolean;
  recommendedDispatch: 'friday' | 'sunday' | 'tuesday' | null;
  canAdvanceWeek: boolean;
}

/**
 * Pure evaluator for the Official League Clock.
 * Decoupled: does NOT mutate state, touch database, or write picks.
 */
export function evaluateLeaguePulse(games: Game[]): LeaguePulse {
  const totalGames = games.length;
  if (totalGames === 0) {
    return {
      phase: 'PRE_WEEK',
      phaseLabel: 'Pre-Kickoff',
      phaseDescription: 'Picks open for all matchups',
      currentWeek: 4,
      totalGames: 0,
      finalGames: 0,
      liveGames: 0,
      pendingGames: 0,
      allGamesFinal: false,
      hasTNF: false,
      tnfFinal: false,
      snfFinal: false,
      mnfFinal: false,
      recommendedDispatch: null,
      canAdvanceWeek: false
    };
  }

  const currentWeek = games.find(g => typeof g.week === 'number' && g.week > 0)?.week || games[0]?.week || 4;
  const finalGames = games.filter(g => g.status === 'final').length;
  const liveGames = games.filter(g => g.status === 'in_progress').length;
  const pendingGames = games.filter(g => g.status === 'scheduled' || !g.status).length;
  const allGamesFinal = finalGames === totalGames && totalGames > 0;

  // Identify special marquee games dynamically (handles 13, 14, 15, or 16 game weeks & MNF doubleheaders)
  const tnfGame = games.find(g => g.isTNF || (g.day && g.day.toLowerCase().includes('thu')) || (g.kickoffTime && g.kickoffTime.toLowerCase().includes('thu')));
  const mnfGames = games.filter(g => g.isMNF || (g.day && g.day.toLowerCase().includes('mon')) || (g.kickoffTime && g.kickoffTime.toLowerCase().includes('mon')));
  const mnfGame = mnfGames.length > 0 ? mnfGames[mnfGames.length - 1] : undefined;
  const sundayGames = games.filter(g => g !== tnfGame && !mnfGames.includes(g) && (!g.day || g.day.toLowerCase().includes('sun')));
  const snfGame = games.find(g =>
    g.isSNF ||
    (g.day && g.day.toLowerCase().includes('sun night')) ||
    (g.kickoffTime && g.kickoffTime.toLowerCase().includes('sun night')) ||
    ((!g.day || g.day.toLowerCase().includes('sun')) && g.kickoffTime && (g.kickoffTime.includes('5:') || g.kickoffTime.includes('8:')))
  ) || (sundayGames.length > 0 ? sundayGames[sundayGames.length - 1] : undefined);

  const mnfGamesCount = mnfGames.length || (mnfGame ? 1 : 0);
  const nonMnfCount = Math.max(1, totalGames - mnfGamesCount);

  const tnfFinal = tnfGame?.status === 'final';
  const tnfLive = tnfGame?.status === 'in_progress';
  const snfFinal = Boolean(snfGame && snfGame.status === 'final' && finalGames >= nonMnfCount);
  const mnfFinal = allGamesFinal || (mnfGames.length > 0 && mnfGames.every(g => g.status === 'final') && finalGames >= totalGames);
  const mnfLive = mnfGames.some(g => g.status === 'in_progress');

  let phase: LeaguePhase = 'PRE_WEEK';
  let phaseLabel = 'Pre-Kickoff';
  let phaseDescription = 'All sheets open for contender picks';
  let recommendedDispatch: 'friday' | 'sunday' | 'tuesday' | null = null;

  if (allGamesFinal) {
    phase = 'MNF_FINAL';
    phaseLabel = 'Week Complete (MNF Final)';
    phaseDescription = `All ${totalGames} games final. Tuesday crown ready. Safe to Freeze & Advance.`;
    recommendedDispatch = 'tuesday';
  } else if (mnfLive) {
    phase = 'MNF_LIVE';
    phaseLabel = 'Monday Night Football Live';
    phaseDescription = 'Final game underway. Tiebreaker points deciding the crown.';
  } else if (snfFinal || (finalGames >= nonMnfCount && !mnfFinal)) {
    phase = 'SNF_FINAL';
    phaseLabel = 'Sunday Slate Final';
    phaseDescription = 'Sunday action wrapped. Sunday Night Recap ready.';
    recommendedDispatch = 'sunday';
  } else if (liveGames > 0) {
    phase = 'SUNDAY_LIVE';
    phaseLabel = 'NFL Action Live';
    phaseDescription = `${liveGames} live games on the board`;
  } else if (tnfFinal) {
    phase = 'TNF_FINAL';
    phaseLabel = 'TNF Final';
    phaseDescription = 'Thursday opener final. Friday Night Wire ready.';
    recommendedDispatch = 'friday';
  } else if (tnfLive) {
    phase = 'TNF_LIVE';
    phaseLabel = 'Thursday Night Opener Live';
    phaseDescription = 'Game 1 in progress. Remaining games unlocked.';
  }

  return {
    phase,
    phaseLabel,
    phaseDescription,
    currentWeek,
    totalGames,
    finalGames,
    liveGames,
    pendingGames,
    allGamesFinal,
    hasTNF: Boolean(tnfGame),
    tnfFinal: Boolean(tnfFinal),
    snfFinal: Boolean(snfFinal || (finalGames >= nonMnfCount && !mnfFinal)),
    mnfFinal: Boolean(mnfFinal),
    recommendedDispatch,
    canAdvanceWeek: allGamesFinal || finalGames >= nonMnfCount
  };
}
