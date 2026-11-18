/**
 * Saved Commish Commentary Bank for Coming Weeks
 */

export interface CommentaryTemplate {
  id: string;
  title: string;
  style: 'dramatic' | 'sarcastic' | 'direct' | 'celebratory';
  openingText: string;
}

export const COMMISH_COMMENTARY_BANK: CommentaryTemplate[] = [
  {
    id: 'mountain-pass',
    title: 'The Mountain Pass (Option 1)',
    style: 'dramatic',
    openingText: `Week {WEEK} is officially in the books, and if your picks felt like driving through a foggy mountain pass with no headlights, you weren't alone. Two weeks into our 40th Anniversary season, the gridiron continues to shred pre-season logic and mock expert predictions alike. But amid the chaos, one contender navigated the wreckage with cold, calculating precision.`
  },
  {
    id: 'commish-desk',
    title: 'The Commish Desk (Option 2 - Week 2 Active)',
    style: 'sarcastic',
    openingText: `If Week 1 was a warm-up, Week 2 was a full-blown reality check. The coffee is hot at the Commish desk this Tuesday morning, and the final tally reveals a brutal week for overconfident prognosticators. When the Rams finished off the Giants on Monday Night, the leaderboard underwent a seismic shift that left a trail of broken tiebreaker sheets in its wake.`
  },
  {
    id: 'punchy-direct',
    title: 'Punchy & Direct (Option 3)',
    style: 'direct',
    openingText: `Two weeks down, fifteen to go, and the football gods are already laughing at our pre-season confidence. Between upset shockers and Monday night tiebreaker nail-biters, Week {WEEK} separated the football scholars from the optimistic guessers.`
  }
];
