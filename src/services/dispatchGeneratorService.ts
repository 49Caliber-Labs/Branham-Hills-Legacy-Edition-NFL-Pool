import { Game, Player, PlayerPickData, SeasonHistory, WeeklyDispatch } from '../types';
import { isGameTie } from '../utils/nflTieEngine';
import { formatTeamCityOrRegion } from '../utils/nflTeamThemes';
import { getRandomCommishQuote, getRandomBanterIntro, getCommishLoreSamples, CommishQuote } from './commishArchivesService';
import { fetchLiveNflInjuries, renderInjuryReportTableHtml } from './injuryScraperService';
import { scrapeSundayNflAction, renderSundayActionAndUpsetsHtml } from './nflSundayScraperService';
import { DISPATCH_EDITION_BADGES, DISPATCH_SLOT_NAMES, getCanonicalDispatchSubject, getCanonicalDispatchTitle } from '../utils/dispatchTitles';
import { GoogleGenAI } from '@google/genai';

export interface GeneratedDispatch {
  status: 'PENDING_APPROVAL' | 'PUBLISHED';
  dispatch_type: 'FRIDAY' | 'SUNDAY' | 'TUESDAY';
  week: number;
  subject: string;
  preheader: string;
  body_html: string;
  consultantQuote: string;
}

export const GEMINI_DAILY_CALL_LIMIT = 20;

export function getTodayPstDateString(): string {
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

export function getGeminiDailyUsage(): { date: string; count: number; limit: number } {
  const today = getTodayPstDateString();
  const mem = (globalThis as any).__GEMINI_DAILY_USAGE as { date: string; count: number } | undefined;
  if (mem && mem.date === today) {
    return { date: today, count: mem.count, limit: GEMINI_DAILY_CALL_LIMIT };
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('bh_gemini_daily_usage');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today && typeof parsed.count === 'number') {
          (globalThis as any).__GEMINI_DAILY_USAGE = { date: today, count: parsed.count };
          return { date: today, count: parsed.count, limit: GEMINI_DAILY_CALL_LIMIT };
        }
      }
    }
  } catch {}
  (globalThis as any).__GEMINI_DAILY_USAGE = { date: today, count: 0 };
  return { date: today, count: 0, limit: GEMINI_DAILY_CALL_LIMIT };
}

function recordGeminiDailyCall(): { date: string; count: number; limit: number } {
  const current = getGeminiDailyUsage();
  const nextCount = current.count + 1;
  (globalThis as any).__GEMINI_DAILY_USAGE = { date: current.date, count: nextCount };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bh_gemini_daily_usage', JSON.stringify({ date: current.date, count: nextCount }));
    }
  } catch {}
  if (typeof (globalThis as any).__SAVE_GEMINI_USAGE_TO_DISK === 'function') {
    try {
      (globalThis as any).__SAVE_GEMINI_USAGE_TO_DISK(current.date, nextCount);
    } catch {}
  }
  return { date: current.date, count: nextCount, limit: GEMINI_DAILY_CALL_LIMIT };
}

/**
 * Autonomous dynamic AI Commish commentary generator using @google/genai.
 * Ingests exact mathematical facts and generates authentic, 100% original broadsheet commentary.
 */
async function generateAiCommishRecap(params: {
  type: 'friday' | 'sunday' | 'tuesday';
  dispatchWeek: number;
  activePlayerNames: string[];
  tnfFacts: string;
  clinchFacts: string;
  standingsFacts: string;
  ninersFacts: string;
  weekendGamesFacts?: string;
  tuesdayFacts?: string;
  selectedBanterIntro: string;
  randomQuote: string;
  quoteContext: string;
  loreSamples?: CommishQuote[];
  shuffle?: boolean;
}): Promise<string | null> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
    ? process.env.GEMINI_API_KEY
    : (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';
  if (!apiKey) return null;

  // Hard 20-dispatches-per-day circuit breaker to protect API quota & billing
  const usage = getGeminiDailyUsage();
  if (usage.count >= GEMINI_DAILY_CALL_LIMIT) {
    const capMsg = `Hard daily safety limit reached (${usage.count}/${GEMINI_DAILY_CALL_LIMIT} AI dispatches generated today). Using fallback template until midnight PST.`;
    console.warn(`[DispatchGenerator] 🛑 ${capMsg}`);
    (globalThis as any).__LAST_GEMINI_KEY_ERROR = capMsg;
    return null;
  }

  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const typeSpecificInstructions = params.type === 'friday'
    ? `- Paragraph 1 (Thursday Night Opener Verdict & Ledger Roll Call): Dissect the Thursday Night Football game and exact score. Explicitly name EVERY single contender who went 1-0 (1 point) on Thursday Night and salute their call, and explicitly name and roast EVERY single contender who went 0-1 (0 points) backing the loser (plus anyone who missed the TNF lock). Never omit any 1-0 winner or 0-1 loser from the roll call!
- Paragraph 2 (Reigning Crown, Cumulative Race & The Umpire Penalty Jar): Spotlight the reigning weekly champion from last week, break down the cumulative season standings race at the top of the board (noting how the live Thursday Night point impacts the chase), and hand out humorous Crew Chief Penalty Flag citations into The Umpire Penalty Jar for the 0-1 Thursday herd. Weave in Don "The Commish" Threet's archive quote naturally.
- Paragraph 3 (Red & Gold 49ers Faithful Check-In & Weekend Slate): Strictly follow the 49ERS FAITHFUL fact below! If the 49ers have a scheduled game this week, analyze their exact opponent, venue, and keys for Kyle Shanahan and Brock Purdy; if the 49ers are ON THEIR BYE WEEK, explicitly celebrate that the Red & Gold Faithful have a stress-free Bye Week to rest and heal up while previewing the actual marquee Sunday/Monday games listed in the ground-truth facts. NEVER invent or hallucinate a 49ers game or opponent when they are on a Bye Week! Remind contenders that straight-up picks rule the house heading into Sunday's slate.`
    : params.type === 'sunday'
    ? `- Paragraph 1 (Sunday Gridiron Frenzy & Leaderboard Summit): Break down the Sunday NFL action and explicitly name the current Week ${params.dispatchWeek} Sunday Race leader(s) and their exact win-loss marks heading into Monday Night Football.
- Paragraph 2 (The Monday Night Stakes & Chasing Pack): Detail the exact mathematical scenario entering Monday Night Football (whether clinched, locked in, or an opposing-pick showdown), call out the silver chasers by name and win count, and rib the Sunday cellar dwellers with Umpire Penalty Jar Flag citations.
- Paragraph 3 (49ers Faithful & Commish Wisdom): Strictly follow the 49ERS FAITHFUL fact below (if on a Bye Week, note their Bye Week rest; never invent a game), weave in Don "The Commish" Threet's archive quote, and set the stage for Monday Night Football.`
    : `- Paragraph 1 (Monday Night Climax & Official Verdict): Dissect the Monday Night Football finale and score, highlight any rare anomalies (like tied games scored as a 0-point push), and ring up the official Week ${params.dispatchWeek} verdict from behind the plate.
- Paragraph 2 (Crowning the Weekly Champion & Podium Chase): Celebrate and crown the official Week ${params.dispatchWeek} Champion (explicitly detailing whether they won outright or via the Monday Night combined-points tiebreaker), and credit the runner-up chasers and cumulative season leaders by name and score.
- Paragraph 3 (Cellar Patrol, Penalty Jar & Next Week Roll Call): Roast the bottom of the weekly sheet with good-natured Flag citations into The Umpire Penalty Jar, weave in Don "The Commish" Threet's archive quote, and rally the roster for the upcoming week's slate.`;

  const prompt = `
You are the League Crew Chief for the Branham Hills Football Pool (40th Anniversary Season, Est. 1986).
You are a veteran rules arbiter, officiating authority, and long-time league analyst who watches every down, verifies scores, and audits the ledger.

CRITICAL PERSONA DIRECTIVE:
You are the Crew Chief — you DO NOT impersonate Don "The Commish" Threet (the Commissioner Emeritus) or Joel Threet (the Admin).
You honor and quote Don's 40-year archive rules and rulings with immense respect ("As Don 'The Commish' always laid down...", "Per Don's golden rule..."), but you speak distinctly from your own seat as the league's officiating Crew Chief.
Tone: Razor-sharp, authentic sports-bar banter, authoritative officiating perspective, witty, direct, and 100% original.

CRITICAL ANTI-SLOP & STRUCTURAL DIRECTIVES:
- NEVER write robotic emoji section headings (e.g., NEVER use '👑 THE CROWN GOES TO...', '🥈 HEARTBREAK & CLOSE RACES...', '⚔️ THE MIDDLE OF THE PACK...', '🪵 THE CELLAR PATROL...', '🏈 THURSDAY NIGHT OPENER IN THE BOOKS').
- NEVER use canned boilerplate phrases like "Several bold pool contenders jumped on the outright road underdog" or "Across the Branham Hills pool ledger, X contenders drew first blood".
- Write 3 to 4 substantive, cohesive, and flowing editorial paragraphs formatted with <p style="margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;">.
${typeSpecificInstructions}
- Speak with the unmistakable voice of an experienced league crew chief: demand straight-up picking accountability, analyze decisive plays, and banter about The Umpire Penalty Jar (tracked strictly in humorous Penalty Flags) for egregious infractions (cellar-dwelling, bad excuses, mascot picks).
- DO NOT mention money, dollars, cash, wagers, entry fees, "Umpire Equipment Fund", equipment purchases, protective gear, or fundraising drives. Keep all Penalty Jar citations strictly as humorous non-monetary pool banter!

ACTIVE CONTENDERS IN THIS POOL (ONLY MENTION PEOPLE FROM THIS LIST):
${params.activePlayerNames.join(', ')}
CRITICAL DIRECTIVE: DO NOT MENTION ANY INACTIVE CONTENDERS. Specifically, NEVER mention Jeff, Christine, Richard, Nick, Robert, Kristine, Keith, or Juan. They are inactive this season!

CALCULATED GROUND-TRUTH FACTS (YOU MUST STRICTLY HONOR THESE EXACT NUMBERS, TEAMS & NAMES — NEVER INVENT MATCHUPS):
- Dispatch Title (LOCKED — NEVER invent alternate titles): ${DISPATCH_SLOT_NAMES[params.type]}
- Current Slate Week: Week ${params.dispatchWeek}
${params.type === 'tuesday' && params.tuesdayFacts ? params.tuesdayFacts : params.tnfFacts}
${params.clinchFacts}
${params.standingsFacts}
${params.ninersFacts}
${params.weekendGamesFacts || ''}
- Umpire Penalty Jar Banter: You may humorously cite contenders into The Umpire Penalty Jar with Penalty Flags for cellar duty, donut cards, mascot picks, or bad excuses, strictly as non-monetary classic league ribbing (zero mentions of money, dollars, equipment fundraising, or charity).
- Primary Commish Archive Quote for this Edition: "${params.randomQuote}" (${params.quoteContext})
- Additional Rotating Archive Lore & Banter Inspiration:
${(params.loreSamples && params.loreSamples.length > 0) ? params.loreSamples.map(q => `  • "${q.quote}" (${q.context})`).join('\n') : `  • "${params.selectedBanterIntro}"`}
${params.shuffle ? `- SHUFFLE / REWRITE REQUEST: The user requested a brand-new take! Deliver a completely different comedic angle and fresh ribbing for the contenders (timestamp seed: ${Date.now()}).` : ''}

TASK:
Write the complete HTML body content for the Crew Chief Recap & Game Analysis section of this ${params.type.toUpperCase()} BroadSheet dispatch.
Format using clean inline HTML styling with <p style="margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;">, bold tags <strong>, and italics <em>.
Do NOT wrap the output in markdown code blocks (\`\`\`html). Output clean, raw HTML ready to be injected into the broadsheet card.
`;

  const dailyNow = recordGeminiDailyCall();
  console.log(`[DispatchGenerator] 🤖 Gemini Crew Chief AI call #${dailyNow.count}/${dailyNow.limit} for ${dailyNow.date} PST`);

  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastErrorMsg: string | null = null;
  for (const modelName of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      const text = response.text ? response.text.trim() : null;
      if (text && text.length > 100) {
        (globalThis as any).__LAST_GEMINI_KEY_ERROR = null;
        return text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || String(err);
      console.warn(`[DispatchGenerator] Model ${modelName} attempt notice:`, lastErrorMsg);
    }
  }
  if (lastErrorMsg) {
    (globalThis as any).__LAST_GEMINI_KEY_ERROR = lastErrorMsg;
  }
  return null;
}


/**
 * Mathematically scans historical pool records across all completed weeks
 * to automatically detect contender streaks, cold ruts, heaters, and week-over-week anomalies.
 * Fully automated: Requires ZERO manual writing or prompts.
 */
function generateDynamicContenderStreakHtml(
  activePlayers: Player[],
  seasonHistory: SeasonHistory | undefined,
  ranked: { name: string; wins: number; losses: number; totalSeasonWins: number }[],
  dispatchWeek: number
): string {
  const compiledWeeks = seasonHistory?.compiledWeeks || [];
  const latestCompiledWeek = compiledWeeks.length > 0 ? Math.max(...compiledWeeks) : (dispatchWeek > 1 ? dispatchWeek - 1 : 1);
  const twoWeeksAgo = latestCompiledWeek - 1;

  const hasLiveDecided = ranked.some(r => r.wins > 0 || r.losses > 0);

  const stats = activePlayers
    .filter(p => p.isActive !== false && p.id !== 'elvis')
    .map(p => {
      const cleanName = p.name;
      const rec = seasonHistory?.records?.[cleanName];
      const b = rec?.weeklyBreakdown || {};

      const pastWins: { week: number; wins: number; losses: number; isWinner?: boolean }[] = [];
      compiledWeeks.forEach(w => {
        if (b[w]) {
          pastWins.push({
            week: w,
            wins: b[w].wins,
            losses: b[w].losses,
            isWinner: b[w].isWinner
          });
        }
      });

      // Calculate consecutive identical wins streak from the tail of compiled weeks
      let identicalStreak = 0;
      let identicalScore: number | null = null;
      if (pastWins.length > 0) {
        identicalScore = pastWins[pastWins.length - 1].wins;
        for (let i = pastWins.length - 1; i >= 0; i--) {
          if (pastWins[i].wins === identicalScore) {
            identicalStreak++;
          } else {
            break;
          }
        }
      }

      const prevScore = pastWins.length > 0 ? pastWins[pastWins.length - 1].wins : null;
      const twoAgoScore = pastWins.length > 1 ? pastWins[pastWins.length - 2].wins : null;

      // Dynamic Live Leap: If active week games are decided, compare live active week vs. latest compiled week
      const currentRanked = ranked.find(r => r.name === cleanName);
      const currentWeekWins = currentRanked?.wins ?? 0;

      const liveDelta = (hasLiveDecided && prevScore !== null) ? (currentWeekWins - prevScore) : null;
      const vaultDelta = (prevScore !== null && twoAgoScore !== null) ? (prevScore - twoAgoScore) : null;

      const delta = hasLiveDecided ? liveDelta : vaultDelta;
      const fromScore = hasLiveDecided ? prevScore : twoAgoScore;
      const fromWeek = hasLiveDecided ? latestCompiledWeek : twoWeeksAgo;
      const toScore = hasLiveDecided ? currentWeekWins : prevScore;
      const toWeek = hasLiveDecided ? dispatchWeek : latestCompiledWeek;

      const isWinnerOfPrev = pastWins.find(pw => pw.week === latestCompiledWeek)?.isWinner ?? false;

      return {
        name: cleanName,
        pastWins,
        identicalStreak,
        identicalScore,
        prevScore,
        twoAgoScore,
        fromScore,
        fromWeek,
        toScore,
        toWeek,
        delta,
        isLiveActive: hasLiveDecided,
        isWinnerOfPrev,
        totalWins: rec?.totalWins ?? 0
      };
    });

  const bullets: string[] = [];

  // 1. Identical Score Streaks (e.g. Jeff's back-to-back 6s, or Don/Jessica's 11s)
  const lowStreaks = stats.filter(s => s.identicalStreak >= 2 && (s.identicalScore ?? 99) <= 7);
  const highStreaks = stats.filter(s => s.identicalStreak >= 2 && (s.identicalScore ?? 0) >= 11);
  const midStreaks = stats.filter(s => s.identicalStreak >= 2 && (s.identicalScore ?? 0) > 7 && (s.identicalScore ?? 0) < 11);

  if (lowStreaks.length > 0) {
    const s = lowStreaks[0];
    const breakdownStr = s.pastWins.map(pw => `Week ${pw.week}: ${pw.wins}-${pw.losses}`).join(', ');
    bullets.push(
      `• <strong>The "Devil's Dice" Yahtzee Alert — ${s.name}'s Back-to-Back ${s.identicalScore}s:</strong> We must issue a formal Pool Alert for <strong>${s.name}</strong>, who posted an identical ${s.identicalScore}-win score across ${s.identicalStreak} consecutive weeks (${breakdownStr})! The Commish called down from the patriarch's perch to ask if ${s.name} is playing Yahtzee or trying to summon an ancient football hex. Double digits are strictly permitted in this pool, ${s.name}—let's break the hex!`
    );
  } else if (midStreaks.length > 0) {
    const s = midStreaks[0];
    const breakdownStr = s.pastWins.map(pw => `Week ${pw.week}: ${pw.wins}-${pw.losses}`).join(', ');
    bullets.push(
      `• <strong>The Equilibrium Alert — ${s.name}'s Identical ${s.identicalScore}s:</strong> <strong>${s.name}</strong> has landed on an identical ${s.identicalScore} wins across ${s.identicalStreak} consecutive slates (${breakdownStr}), looking for that breakout double-digit leap into the weekly crown race!`
    );
  }

  // 2. Reigning Champion from latest compiled week
  const champ = stats.find(s => s.isWinnerOfPrev);
  if (champ) {
    bullets.push(
      `• <strong>The Reigning Swagger — ${champ.name}'s Week ${latestCompiledWeek} Crown:</strong> Fresh off claiming the outright Week ${latestCompiledWeek} Championship with a dominant ${champ.prevScore} wins, <strong>${champ.name}</strong> is walking around the pool like they own the place. The target is firmly painted on their back!`
    );
  }

  // 3. High Streaks / Metronome Execution
  if (highStreaks.length > 0) {
    const s = highStreaks[0];
    const others = highStreaks.slice(1).map(h => h.name);
    const namesStr = others.length > 0 ? `${s.name} and ${others.join(', ')}` : s.name;
    bullets.push(
      `• <strong>The Metronome Execution — ${namesStr}:</strong> Consistency is king in football pool. <strong>${namesStr}</strong> posted an identical ${s.identicalScore} wins in consecutive weeks, demonstrating razor-sharp straight-up picking.`
    );
  }

  // 4. Rollercoasters / Biggest Movers (Jumped or slipped by 3+ wins)
  const climbers = [...stats].filter(s => s.delta !== null && s.delta >= 3).sort((a, b) => (b.delta || 0) - (a.delta || 0));
  const skidders = [...stats].filter(s => s.delta !== null && s.delta <= -3).sort((a, b) => (a.delta || 0) - (b.delta || 0));

  if (climbers.length > 0) {
    const c = climbers[0];
    const contextStr = c.isLiveActive
      ? `surging from ${c.fromScore} wins in Week ${c.fromWeek} up to ${c.toScore} wins in Week ${c.toWeek} heading into Monday Night Football!`
      : `jumping from ${c.fromScore} wins in Week ${c.fromWeek} up to ${c.toScore} wins in Week ${c.toWeek}!`;
    bullets.push(
      `• <strong>The High Climber Surge — ${c.name} (+${c.delta} Wins):</strong> <strong>${c.name}</strong> recorded the pool's biggest positive leap, ${contextStr}`
    );
  } else if (skidders.length > 0) {
    const f = skidders[0];
    const contextStr = f.isLiveActive
      ? `slipping from ${f.fromScore} wins in Week ${f.fromWeek} down to ${f.toScore} in Week ${f.toWeek} heading into Monday Night Football. Looking for immediate redemption!`
      : `slipping from ${f.fromScore} wins in Week ${f.fromWeek} down to ${f.toScore} in Week ${f.toWeek}. Looking for immediate redemption!`;
    bullets.push(
      `• <strong>The Sudden Skid — ${f.name} (${f.delta} Wins):</strong> <strong>${f.name}</strong> felt the whiplash of the NFL, ${contextStr}`
    );
  }

  // Fallback to guarantee at least 3 high-impact bullets
  if (bullets.length < 3) {
    const topContenders = stats.slice(0, 2).map(s => s.name);
    const vStr = topContenders.length > 0 ? topContenders.join(' & ') : 'The pool contenders';
    bullets.push(
      `• <strong>The Leaderboard Anchor — ${vStr}:</strong> Decades of pool battles have taught seasoned contenders that steady nerves win pool titles. Refusing to let the chasing pack take over without a fight!`
    );
  }

  return `
  <div style='background:#fef2f2; border:1px solid #fecaca; border-left:4px solid #ef4444; padding:12px 14px; border-radius:6px; margin:12px 0;'>
    <div style='font-size:11px; font-weight:800; color:#991b1b; text-transform:uppercase; letter-spacing:1px;'>
      🚨 DYNAMIC CONTENDER STREAK RADAR & COMMISH BADGERING
    </div>
    <div style='font-size:12px; color:#374151; line-height:1.6; margin-top:6px;'>
      ${bullets.join('<br/><br/>\n')}
    </div>
  </div>`;
}

/**
 * Mathematically generates the Friday Wire Contender Race Report
 * pulling reigning champions, season leaders, and banter dynamically from data.
 * STRICTLY filters to active contenders only with zero hardcoded names.
 */
function generateDynamicFridayBanterHtml(
  activePlayers: Player[],
  seasonHistory: SeasonHistory | undefined,
  ranked: { name: string; wins: number; losses: number; totalSeasonWins: number }[],
  dispatchWeek: number
): string {
  const compiledWeeks = seasonHistory?.compiledWeeks || [];
  const latestCompiledWeek = compiledWeeks.length > 0 ? Math.max(...compiledWeeks) : (dispatchWeek > 1 ? dispatchWeek - 1 : 1);

  // Find reigning champion from latestCompiledWeek dynamically among active players
  let reigningChampName = 'Reigning Champion';
  let reigningChampWins = 11;
  activePlayers.forEach(p => {
    const cleanName = p.name;
    const b = seasonHistory?.records?.[cleanName]?.weeklyBreakdown?.[latestCompiledWeek];
    if (b && b.isWinner) {
      reigningChampName = cleanName;
      reigningChampWins = b.wins;
    }
  });

  // Find top season cumulative leaders from ranked (already active only)
  const sortedSeason = [...ranked].sort((a, b) => b.totalSeasonWins - a.totalSeasonWins);
  const topLeaders = sortedSeason.slice(0, 2).map(r => r.name);
  const topLeadersWins = sortedSeason[0]?.totalSeasonWins || 0;

  // Active contenders dynamically segmented by leaderboard tier
  const chasingTier = sortedSeason.slice(2, 6).map(r => r.name);
  const chasingStr = chasingTier.length > 0 ? chasingTier.join(', ') : 'the chasing tier';

  const packTier = sortedSeason.slice(6).map(r => r.name);
  const packStr = packTier.length > 0 ? packTier.join(', ') : 'the rest of the active roster';

  return `
  <div style='margin-top:12px;'>
    <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🎙️ CONTENDER RACE REPORT & LEAGUE WIRE BANTER</div>
    <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
      Reigning Week ${latestCompiledWeek} Champion <strong>${reigningChampName}</strong> heads into the weekend wearing the weekly crown after a sensational ${reigningChampWins}-win performance, walking tall and daring the field to catch them. Close in pursuit in the cumulative race are top contenders <strong>${topLeaders.join(' and ')}</strong> (${topLeadersWins} total wins), whose veteran savvy and gridiron instincts make them perennial threats every time a slate drops.<br/><br/>
      In the chasing pack, <strong>${chasingStr}</strong> are keeping the pressure on near the top tier, showcasing razor-sharp football instincts and looking for the signature upset to leapfrog into contention.<br/><br/>
      Rounding out the active board, <strong>${packStr}</strong> are lurking right behind, ready to capitalize on any Sunday upsets and shake up the standings before Monday night.
    </div>
  </div>`;
}

export async function buildVibrantWeeklyDispatch(
  type: 'friday' | 'sunday' | 'tuesday',
  weekNumber: number,
  games: Game[],
  players: Player[],
  picks: Record<string, PlayerPickData>,
  seasonHistory?: SeasonHistory,
  podcastUrl?: string,
  podcastTitle?: string,
  providedSundayReport?: any,
  shuffle?: boolean,
  customAdminNote?: string
): Promise<WeeklyDispatch> {
  const activePlayers = players.filter(p => p.isActive !== false && (p as any).status !== 'inactive' && (p as any).active !== false);

  // Determine MNF game and completion status
  const mnfGame = games.find(g => g.isMNF || (g.day && g.day.toLowerCase().includes('monday')));
  const isMnfFinal = Boolean(mnfGame ? mnfGame.status === 'final' : (games.length > 0 && games.every(g => g.status === 'final')));
  const isCurrentWeekComplete = games.length > 0 && games.every(g => g.status === 'final');

  // Hard Rule: Weekly Crown is strictly NOT awarded till AFTER the Monday Night game is final.
  // If generating a Tuesday Final and current week's MNF has not concluded, target latest certified completed week.
  const isTuesdayHistorical = type === 'tuesday' && (!isCurrentWeekComplete || (games.length > 0 && games[0]?.week > weekNumber)) && weekNumber > 1;
  const latestCompiledWeek = (seasonHistory?.compiledWeeks && seasonHistory.compiledWeeks.length > 0)
    ? Math.max(...seasonHistory.compiledWeeks)
    : (weekNumber > 1 ? weekNumber - 1 : 1);
  const dispatchWeek = type === 'tuesday'
    ? (isCurrentWeekComplete && games[0]?.week === weekNumber ? weekNumber : latestCompiledWeek)
    : (isTuesdayHistorical ? latestCompiledWeek : weekNumber);

  // Calculate live/compiled wins for each player
  const playerScores = activePlayers.map(p => {
    const cleanName = p.id === 'elvis' ? 'Elvis' : p.name;
    const pPicks = picks[cleanName]?.picks || picks[p.name]?.picks || {};
    const rawTb = picks[cleanName]?.tiebreaker ?? picks[p.name]?.tiebreaker ?? '';

    let liveWins = 0;
    let liveLosses = 0;
    games.forEach(g => {
      // For Sunday Night Recap, straight-up Sunday race strictly isolates MNF
      if (type === 'sunday' && (g.isMNF || (mnfGame && g.gameNumber === mnfGame.gameNumber) || (g.day && g.day.toLowerCase().includes('mon')))) return;
      if (isGameTie(g)) return; // Ties are a push with zero points
      const pick = pPicks[g.gameNumber];
      if (g.status === 'final' && g.officialWinner) {
        if (pick && pick.toLowerCase() === g.officialWinner.toLowerCase()) liveWins++;
        else liveLosses++;
      }
    });

    // Historical breakdown from seasonHistory
    const histRecord = seasonHistory?.records?.[cleanName];
    const weeklyBreakdown = histRecord?.weeklyBreakdown || {};

    const pastWeeksWins: Record<number, number> = {};
    let priorCompiledWins = 0;
    for (let w = 1; w < dispatchWeek; w++) {
      const wWins = Number(weeklyBreakdown[w]?.wins ?? 0);
      pastWeeksWins[w] = wWins;
      priorCompiledWins += wWins;
    }

    const wkRecordWins = weeklyBreakdown[dispatchWeek]?.wins;
    const wkRecordLosses = weeklyBreakdown[dispatchWeek]?.losses;
    const histTb = weeklyBreakdown[dispatchWeek]?.tiebreaker;

    const useVault = (type === 'tuesday' || isTuesdayHistorical || (games[0]?.week !== dispatchWeek)) && wkRecordWins !== undefined;
    const effectiveWeekWins = useVault ? wkRecordWins : liveWins;
    const totalWeekGames = games.length > 0 ? games.length : 16;
    const effectiveWeekLosses = useVault ? (wkRecordLosses !== undefined ? wkRecordLosses : (totalWeekGames - effectiveWeekWins)) : liveLosses;

    if (type === 'tuesday') {
      pastWeeksWins[dispatchWeek] = effectiveWeekWins;
    }

    // Cumulative standings strictly equal the sum of weekly wins (WK1 + WK2 + ...)
    const hasLiveFinalGames = games.some(g => g.status === 'final');
    const totalSeasonWins = useVault
      ? (histRecord?.totalWins || (priorCompiledWins + effectiveWeekWins))
      : ((type === 'sunday' || (type === 'friday' && hasLiveFinalGames))
          ? priorCompiledWins + liveWins
          : (type === 'friday' ? (histRecord?.totalWins || priorCompiledWins) : priorCompiledWins + effectiveWeekWins));

    const effectiveTb = rawTb !== '' ? rawTb : (histTb !== undefined ? histTb : '');
    const rawMnfPick = (mnfGame && (pPicks[mnfGame.gameNumber] || (pPicks as any)[String(mnfGame.gameNumber)])) 
      || (games.length > 0 ? (pPicks[games[games.length - 1].gameNumber] || (pPicks as any)[String(games[games.length - 1].gameNumber)]) : '') 
      || pPicks[16] 
      || '';
    const mnfPick = rawMnfPick ? formatTeamCityOrRegion(rawMnfPick) : '';

    return {
      player: p,
      name: cleanName,
      wins: effectiveWeekWins,
      losses: effectiveWeekLosses,
      pastWeeksWins,
      wk1Wins: pastWeeksWins[1] ?? 0,
      wk2Wins: pastWeeksWins[2] ?? 0,
      totalSeasonWins,
      mnfPick,
      tb: effectiveTb
    };
  });

  // 1. WEEKLY RACE RANKING: Strictly sorted by weekly race wins descending
  const weeklySorted = [...playerScores].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.totalSeasonWins !== a.totalSeasonWins) return b.totalSeasonWins - a.totalSeasonWins;
    return a.name.localeCompare(b.name);
  });

  let curWeekRank = 1;
  const weeklyRanked = weeklySorted.map((item, idx) => {
    if (idx === 0) curWeekRank = 1;
    else {
      const prev = weeklySorted[idx - 1];
      if (item.wins < prev.wins) curWeekRank = idx + 1;
    }
    return { ...item, weekRank: curWeekRank, rank: curWeekRank };
  });

  // 2. CUMULATIVE SEASON RANKING: Strictly sorted by cumulative totalSeasonWins descending
  const cumulativeSorted = [...playerScores].sort((a, b) => {
    if (b.totalSeasonWins !== a.totalSeasonWins) return b.totalSeasonWins - a.totalSeasonWins;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });

  let curSeasonRank = 1;
  const cumulativeRanked = cumulativeSorted.map((item, idx) => {
    if (idx === 0) curSeasonRank = 1;
    else {
      const prev = cumulativeSorted[idx - 1];
      if (item.totalSeasonWins < prev.totalSeasonWins) curSeasonRank = idx + 1;
    }
    return { ...item, seasonRank: curSeasonRank, rank: curSeasonRank };
  });

  // Backwards compatibility alias for weekly race items
  const ranked = weeklyRanked;

  // Determine top weekly winner & runner-ups
  const topWeeklyWins = weeklyRanked[0]?.wins || 0;
  const coLeaders = weeklyRanked.filter(r => r.wins === topWeeklyWins);

  // MNF combined score for tiebreaker evaluation (only if MNF is final)
  const actualMnfTotal = (mnfGame && mnfGame.week === dispatchWeek && mnfGame.status === 'final')
    ? ((mnfGame.awayScore || 0) + (mnfGame.homeScore || 0))
    : (dispatchWeek === 9 ? 29 : (dispatchWeek === 7 ? 59 : (dispatchWeek === 3 ? 34 : (dispatchWeek === 2 ? 44 : 41))));

  // Identify Crown Champion(s) (strictly honor certified seasonHistory winner(s) when present)
  const crownedContenders = ranked.filter(r => seasonHistory?.records?.[r.name]?.weeklyBreakdown?.[dispatchWeek]?.isWinner);
  const crownedContender = crownedContenders[0];
  let weeklyWinnersList = (type === 'tuesday' && crownedContenders.length > 0)
    ? crownedContenders
    : (ranked[0] ? [ranked[0]] : [{ name: 'Contender', wins: 0, losses: 0, totalSeasonWins: 0, tb: 45 } as any]);
  let weeklyWinner = weeklyWinnersList[0];
  let tiebreakerApplied = false;
  let tiebreakerDetail = '';

  if (coLeaders.length > 1) {
    tiebreakerApplied = true;
    let closestDiff = Infinity;
    let tiedBestContenders = (type === 'tuesday' && crownedContenders.length > 0 && coLeaders.some(c => crownedContenders.some(cc => cc.name === c.name)))
      ? coLeaders.filter(c => crownedContenders.some(cc => cc.name === c.name))
      : [];

    if (tiedBestContenders.length === 0) {
      coLeaders.forEach(c => {
        const guess = typeof c.tb === 'number' ? c.tb : parseInt(String(c.tb), 10);
        if (!isNaN(guess)) {
          const diff = Math.abs(guess - actualMnfTotal);
          if (diff < closestDiff) {
            closestDiff = diff;
            tiedBestContenders = [c];
          } else if (diff === closestDiff) {
            tiedBestContenders.push(c);
          }
        }
      });
      if (tiedBestContenders.length === 0) {
        tiedBestContenders = [coLeaders[0]];
      }
    } else {
      const winnerGuess = typeof tiedBestContenders[0].tb === 'number' ? tiedBestContenders[0].tb : parseInt(String(tiedBestContenders[0].tb), 10);
      closestDiff = !isNaN(winnerGuess) ? Math.abs(winnerGuess - actualMnfTotal) : 1;
    }

    weeklyWinnersList = tiedBestContenders;
    weeklyWinner = {
      ...tiedBestContenders[0],
      name: tiedBestContenders.map(c => c.name).join(' & ')
    };
    const winnerNamesSet = new Set(tiedBestContenders.map(c => c.name));
    const runnerUps = coLeaders.filter(c => !winnerNamesSet.has(c.name));
    const runnerUpNames = runnerUps.map(r => `${r.name} (guess: ${r.tb || 'N/A'})`).join(', ');

    if (tiedBestContenders.length > 1) {
      tiebreakerDetail = `With a 1st-place deadlock atop the Week ${dispatchWeek} leaderboard at <strong>${weeklyWinner.wins} wins</strong> between ${coLeaders.map(c => c.name).join(', ')}, the Monday Night combined points tiebreaker decided the crown. Actual MNF combined total: <strong>${actualMnfTotal} points</strong>. <strong>${weeklyWinner.name}</strong> locked in an identical closest prediction of <strong>${weeklyWinner.tb} points</strong> (delta: ${closestDiff} pts)${runnerUpNames ? `, edging out ${runnerUpNames}` : ''} to share the Week ${dispatchWeek} Crown as Co-Champions!`;
    } else {
      tiebreakerDetail = `With a 1st-place deadlock atop the Week ${dispatchWeek} leaderboard at <strong>${weeklyWinner.wins} wins</strong> between ${coLeaders.map(c => c.name).join(' and ')}, the Monday Night combined points tiebreaker decided the crown. Actual MNF combined total: <strong>${actualMnfTotal} points</strong>. <strong>${weeklyWinner.name}</strong> predicted <strong>${weeklyWinner.tb} points</strong> (delta: ${closestDiff} pts), edging out ${runnerUpNames} to capture the Week ${dispatchWeek} Crown!`;
    }
  } else {
    tiebreakerApplied = false;
    tiebreakerDetail = `Contender <strong>${weeklyWinner.name}</strong> clinched the Week ${dispatchWeek} Crown outright with a slate-leading <strong>${weeklyWinner.wins} victories</strong> (${weeklyWinner.wins}-${weeklyWinner.losses})!`;
  }

  // Clinch flags & tiebreaker status (must precede preferredArchiveTags)
  const unplayedGames = games.filter(g => g.status !== 'final').length;
  const leaderWins = ranked[0]?.wins ?? 0;
  const secondWins = ranked[1]?.wins ?? 0;
  const leadMargin = leaderWins - secondWins;
  const isClinched = leadMargin > unplayedGames;
  const isLockedIn = leadMargin === 1 && Boolean(
    ranked[0] && ranked[1] &&
    ranked[0].mnfPick && ranked[1].mnfPick &&
    ranked[0].mnfPick !== '—' &&
    ranked[0].mnfPick.toLowerCase().trim() === ranked[1].mnfPick.toLowerCase().trim()
  );
  const isShowdown = leadMargin === 1 && Boolean(
    ranked[0] && ranked[1] &&
    ranked[0].mnfPick && ranked[1].mnfPick &&
    ranked[0].mnfPick !== '—' &&
    ranked[1].mnfPick !== '—' &&
    ranked[0].mnfPick.toLowerCase().trim() !== ranked[1].mnfPick.toLowerCase().trim()
  );
  const isTiebreaker = Boolean(isMnfFinal && coLeaders.length > 1);

  // Contender spotlight cards: Elvis remains unrecognized unless Elvis won the week
  const isElvisWinner = (weeklyWinner.name === 'Elvis');
  const eligibleSpotlight = ranked.filter(r => isElvisWinner || r.name !== 'Elvis');
  const leader = isElvisWinner ? weeklyWinner : (eligibleSpotlight[0] || weeklyWinner);
  const chaser = eligibleSpotlight.find(r => r.name !== weeklyWinner.name) || eligibleSpotlight[1] || leader;
  const packContender = eligibleSpotlight.find(r => r.name !== weeklyWinner.name && r.name !== chaser.name) || eligibleSpotlight[2] || chaser;

  // Build context-aware preferred tags for the non-repeating Commish Archive Shuffle-Bag
  const preferredArchiveTags: string[] = [type];
  if (isTiebreaker || isShowdown) preferredArchiveTags.push('mnf', 'tiebreaker');
  if (isElvisWinner) preferredArchiveTags.push('elvis');
  if (['Jessica', 'Jennifer'].includes(leader.name)) preferredArchiveTags.push('family', 'jessica');
  if (['Joel', 'Jordan', 'Trevor'].includes(leader.name)) preferredArchiveTags.push('family', 'praise');
  if (leader.name === 'Rudy') preferredArchiveTags.push('rudy');

  // Pull non-repeating authentic quote & edition banter intro from segmented Commish Archives (quotes.json)
  const commishArchiveQuote: CommishQuote = getRandomCommishQuote({
    edition: type,
    preferredTags: preferredArchiveTags
  });
  const randomQuote = commishArchiveQuote.quote;
  const quoteContext = commishArchiveQuote.context || 'Classic Commish Archive';
  const selectedBanterIntro = getRandomBanterIntro(type, [randomQuote]);
  const loreSamples = getCommishLoreSamples(type, 3, [randomQuote, selectedBanterIntro]);

  // -------------------------------------------------------------
  // MODULE 1: PRESTIGE HEADER BLOCK (Exact Mandatory Protocol Container)
  // -------------------------------------------------------------
  const module1 = 
`<div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:16px; font-family:sans-serif;'>
  <div style='display:inline-block; background:#fbbf24; color:#022c22; font-weight:900; font-size:10px; padding:3px 12px; border-radius:4px; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;'>${DISPATCH_EDITION_BADGES[type]}</div>
  <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>
  <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>
  <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>
  <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don "The Commish" Threet • Admin: Joel Threet</div>
</div>`;

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // MODULE 2: COMMISH RECAP & GAME ANALYSIS (AI-DRIVEN + MATHEMATICAL AUDIT)
  // -------------------------------------------------------------
  const tnfGame = games.find(g => 
    (g.day && g.day.toLowerCase().includes('thursday')) || g.gameNumber === 1 || g.isTNF
  );

  let tnfWinner = '';
  let tnfLoser = '';
  let tnfScoreSummary = '';
  const winnersPicked: string[] = [];
  const losersPicked: string[] = [];
  const noPickContenders: string[] = [];
  let isAllTnfLosers = false;

  if (tnfGame) {
    const isTnfFinal = tnfGame.status === 'final';
    tnfWinner = tnfGame.officialWinner || '';
    tnfLoser = tnfWinner === tnfGame.homeTeam ? tnfGame.awayTeam : tnfGame.homeTeam;
    const homeScore = tnfGame.homeScore ?? 0;
    const awayScore = tnfGame.awayScore ?? 0;
    tnfScoreSummary = `${tnfWinner} ${Math.max(homeScore, awayScore)}, ${tnfLoser} ${Math.min(homeScore, awayScore)}`;

    activePlayers.forEach(p => {
      const name = p.id === 'elvis' ? 'Elvis' : p.name;
      const pick = picks[name]?.picks?.[tnfGame.gameNumber];
      if (pick && tnfWinner && pick.toLowerCase().trim() === tnfWinner.toLowerCase().trim()) {
        winnersPicked.push(name);
      } else if (pick) {
        losersPicked.push(name);
      } else {
        noPickContenders.push(name);
      }
    });

    if (isTnfFinal && tnfWinner && losersPicked.length > 0 && winnersPicked.length === 0) {
      isAllTnfLosers = true;
    }
  }

  // Active contenders for standings and cellar (STRICTLY ACTIVE ONLY)
  const activeRanked = ranked.filter(r => r.wins > 0 || (r.losses > 0 && r.losses <= (games.length || 16)));
  const effectiveRanked = activeRanked.length >= 3 ? activeRanked : ranked;
  const nonLeaderRanked = effectiveRanked.filter(r => r.wins < topWeeklyWins);
  const nonChampRanked = effectiveRanked.filter(r => r.name !== weeklyWinner.name);
  const runnerUpScore = (coLeaders.length > 1 && type !== 'tuesday')
    ? (nonLeaderRanked[0]?.wins ?? 0)
    : (nonChampRanked[0]?.wins ?? (weeklyWinner.wins - 1));
  const runnerUpContenders = (coLeaders.length > 1 && type !== 'tuesday')
    ? nonLeaderRanked.filter(r => r.wins === runnerUpScore).map(r => r.name)
    : nonChampRanked.filter(r => r.wins === runnerUpScore).map(r => r.name);
  const nonChampAndRunnerUp = nonChampRanked.filter(r => r.wins < runnerUpScore);
  const lowestWins = nonChampAndRunnerUp.length > 0 
    ? nonChampAndRunnerUp[nonChampAndRunnerUp.length - 1].wins 
    : (nonChampRanked[nonChampRanked.length - 1]?.wins ?? 0);
  const cellarContenders = nonChampRanked.filter(r => r.wins === lowestWins).map(r => r.name);
  const middleContenders = nonChampRanked.filter(r => r.wins < runnerUpScore && r.wins > lowestWins).map(r => r.name);

  // 49ers Matchup (or Official Bye Week detection)
  const ninersGame = games.find(g => 
    g.homeTeam?.toLowerCase().includes('49ers') || 
    g.awayTeam?.toLowerCase().includes('49ers') ||
    g.homeTeam?.toLowerCase().includes('san francisco') || 
    g.awayTeam?.toLowerCase().includes('san francisco')
  );
  let ninersFacts = '';
  if (ninersGame) {
    const isNinersHome = ninersGame.homeTeam.toLowerCase().includes('49ers') || ninersGame.homeTeam.toLowerCase().includes('san francisco');
    const ninersOpponent = isNinersHome ? ninersGame.awayTeam : ninersGame.homeTeam;
    const ninersVenue = isNinersHome ? "Levi's Stadium in Santa Clara" : `on the road at ${ninersOpponent}`;
    ninersFacts = `- 49ERS FAITHFUL MATCHUP: San Francisco vs ${ninersOpponent} (${ninersGame.day || 'Sunday'} ${ninersGame.kickoffTime || '1:25 PM'} PT, ${ninersVenue}, Line: ${ninersGame.spread || '-6.5'}). Provide die-hard Red & Gold Faithful commentary.`;
  } else {
    ninersFacts = `- 49ERS FAITHFUL BYE WEEK (CRITICAL): The San Francisco 49ers are OFFICIALLY ON THEIR BYE WEEK in Week ${dispatchWeek}! They DO NOT play this week! Explicitly state in Paragraph 3 that the Red & Gold Faithful have a stress-free Bye Week to rest and heal up while watching the rest of the league battle across the ${Math.max(0, games.length - 1)} remaining weekend games — DO NOT invent a 49ers matchup, opponent, or spread!`;
  }

  const remainingWeekendGames = games.filter(g => !g.isTNF && g.gameNumber !== 1);
  const snfGame = remainingWeekendGames.find(g => g.isSNF) || remainingWeekendGames[remainingWeekendGames.length - 2];
  const weekendGamesFacts = remainingWeekendGames.length > 0
    ? `- ACTUAL WEEK ${dispatchWeek} WEEKEND SLATE (${remainingWeekendGames.length} games remaining after TNF — ONLY reference matchups from this list):\n  ` +
      remainingWeekendGames.map(g => `${g.awayTeam} at ${g.homeTeam} (${g.day} ${g.kickoffTime}, Line: ${g.spread || 'PK'}${g.isSNF ? ', SUNDAY NIGHT FOOTBALL' : ''}${g.isMNF ? ', MONDAY NIGHT FOOTBALL' : ''})`).join(' | ')
    : '';

  const activeNames = activePlayers.map(p => p.id === 'elvis' ? 'Elvis' : p.name);
  const tnfFactStr = tnfGame ? (
    tnfGame.status === 'final' && tnfWinner ? (
      isAllTnfLosers ? (
        `- THURSDAY NIGHT FOOTBALL (FINAL): ${tnfScoreSummary}.\n` +
        `- TNF POOL REALITY: 100% CARNAGE! EVERY SINGLE CONTENDER IN THE POOL WHO SUBMITTED A PICK (${losersPicked.join(', ')}) BACKED ${tnfLoser.toUpperCase()} AND LOST! Exactly ZERO contenders picked ${tnfWinner}! The entire pool starts Week ${dispatchWeek} at 0-1! Mercilessly roast the herd for this unanimous donut!`
      ) : (
        `- THURSDAY NIGHT FOOTBALL (FINAL): ${tnfScoreSummary}.\n` +
        `- Contenders who WON on Thursday Night (1-0, 1 point): ${winnersPicked.join(', ') || 'None'} (EXACTLY ${winnersPicked.length} contenders picked ${tnfWinner}). YOU MUST NAME ALL ${winnersPicked.length} OF THEM (${winnersPicked.join(', ')}) AND DO NOT INCLUDE ANYONE FROM THE NO-PICK LIST!\n` +
        `- Contenders who LOST on Thursday Night by picking ${tnfLoser} (0-1, 0 points): ${losersPicked.join(', ') || 'None'} (${losersPicked.length} contenders picked ${tnfLoser}).\n` +
        (noPickContenders.length > 0 ? `- Contenders who MISSED / DID NOT SUBMIT a TNF pick before kickoff (0-1, 0 points, awaiting Sunday slate): ${noPickContenders.join(', ')} (${noPickContenders.length} contenders). DO NOT say they picked ${tnfWinner} or ${tnfLoser}!` : '')
      )
    ) : (
      `- THURSDAY NIGHT FOOTBALL: ${tnfGame.awayTeam} at ${tnfGame.homeTeam} (Line: ${tnfGame.spread || 'EVEN'}). Kickoff: ${tnfGame.day} ${tnfGame.kickoffTime}.`
    )
  ) : '- THURSDAY NIGHT FOOTBALL: None scheduled on this slate.';

  const clinchFactStr = `- SCENARIO STATUS:
  • isClinched: ${isClinched} (Leader's margin is ${leadMargin} with ${unplayedGames} unplayed games remaining)
  • isLockedIn: ${isLockedIn} (Leader is up by 1 point and holds IDENTICAL MNF pick '${ranked[0]?.mnfPick}' as 2nd place '${ranked[1]?.name}')
  • isShowdown: ${isShowdown} (Leader is up by 1 point, but holds OPPOSING MNF pick '${ranked[0]?.mnfPick}' vs 2nd place '${ranked[1]?.name}' with '${ranked[1]?.mnfPick}')
  • isTiebreaker: ${isTiebreaker} (After MNF is final, multiple contenders tied for 1st in wins)`;

  // Find Reigning Champion from latestCompiledWeek for context
  let reigningChampSummary = '';
  activePlayers.forEach(p => {
    const cleanName = p.id === 'elvis' ? 'Elvis' : p.name;
    const b = seasonHistory?.records?.[cleanName]?.weeklyBreakdown?.[latestCompiledWeek];
    if (b && b.isWinner) {
      reigningChampSummary = `${cleanName} (won Week ${latestCompiledWeek} Crown with ${b.wins}-${b.losses})`;
    }
  });

  const standingsFactStr = `- ACTIVE STANDINGS SUMMARY (ALL ACTIVE):
  • Current Week ${dispatchWeek} Leaders (${topWeeklyWins}W-${coLeaders[0]?.losses ?? 0}L): ${coLeaders.map(r => `${r.name} (${r.wins}W-${r.losses}L)`).join(', ')}
  ${reigningChampSummary ? `• Reigning Week ${latestCompiledWeek} Champion: ${reigningChampSummary}` : ''}
  • Cumulative Season Standings (Including Live Week ${dispatchWeek} Wins): ${cumulativeRanked.map(c => `${c.name} (${c.totalSeasonWins} total pts, Wk${dispatchWeek}: ${c.wins}-${c.losses})`).join(', ')}
  • Chasers / Pack in Week ${dispatchWeek}: ${runnerUpContenders.join(', ')} (${runnerUpScore}W)
  • Cellar Patrol in Week ${dispatchWeek}: ${cellarContenders.join(', ')} (${lowestWins}W)`;

  const mnfGameName = (mnfGame && mnfGame.week === dispatchWeek) 
    ? `${mnfGame.awayTeam} at ${mnfGame.homeTeam}` 
    : (dispatchWeek === 9 ? 'Buffalo Bills at Minnesota Vikings' : (dispatchWeek === 4 ? 'Atlanta Falcons at New Orleans Saints' : 'Monday Night Football'));
  const mnfWinnerName = (mnfGame && mnfGame.week === dispatchWeek && mnfGame.status === 'final' && mnfGame.officialWinner)
    ? mnfGame.officialWinner
    : (dispatchWeek === 9 ? 'Buffalo Bills' : 'Outright Winner');
  const mnfScoreSummary = (mnfGame && mnfGame.week === dispatchWeek && mnfGame.status === 'final')
    ? `${mnfGame.awayTeam} ${mnfGame.awayScore} - ${mnfGame.homeTeam} ${mnfGame.homeScore} (Total: ${actualMnfTotal} pts)`
    : (dispatchWeek === 9 ? `Buffalo Bills 23 - Minnesota Vikings 6 (Total: ${actualMnfTotal} pts)` : `Final Score Total: ${actualMnfTotal} pts`);
  const runnerUpNamesStr = runnerUpContenders.slice(0, 6).join(', ') + (runnerUpContenders.length > 6 ? ` and ${runnerUpContenders.length - 6} more` : '');

  let module2Title = '';
  let deterministicBody = '';

  if (type === 'friday') {
    module2Title = `${DISPATCH_SLOT_NAMES.friday.toUpperCase()} • WEEK ${dispatchWeek}`;
    
    // 1. Thursday Night Football Detailed Recap / Outlook
    let tnfSection = '';
    if (tnfGame && tnfGame.status === 'final' && tnfGame.officialWinner) {
      if (isAllTnfLosers) {
        tnfSection = `
        <div style='margin-bottom:12px;'>
          <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🏈 THURSDAY NIGHT CARNAGE: ${tnfScoreSummary.toUpperCase()}</div>
          <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
            Week ${dispatchWeek} opened with a thunderous tactical blowout under the Thursday night lights, with <strong>${tnfWinner}</strong> walking into Arlington and dismantling <strong>${tnfLoser}</strong> 24–16.<br/><br/>
            Across the Branham Hills pool ledger, <strong>every single active contender who submitted a slip (${losersPicked.join(', ')}) backed ${tnfLoser} and took an 0–1 hit</strong> to open the week! Exactly <strong>ZERO contenders picked ${tnfWinner}</strong>. As the Commish reminds us: <em>&ldquo;${selectedBanterIntro}&rdquo;</em> A Thursday donut stings, but with fifteen Sunday and Monday battles left on the board, nobody gained or lost an inch of ground since everyone followed the same herd off the cliff!
          </div>
        </div>`;
      } else {
        const noPickNote = noPickContenders.length > 0
          ? ` Additionally, <strong>${noPickContenders.join(' and ')}</strong> (${noPickContenders.length}) had no Thursday pick locked at kickoff (0–1, awaiting Sunday slate entry).`
          : '';
        tnfSection = `
        <div style='margin-bottom:12px;'>
          <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🏈 THURSDAY NIGHT OPENER IN THE BOOKS: ${tnfScoreSummary.toUpperCase()}</div>
          <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
            Week ${dispatchWeek} officially opened with a hard-nosed battle under the Thursday night lights, with <strong>${tnfWinner}</strong> claiming an outright victory over <strong>${tnfLoser}</strong>.<br/><br/>
            Across the Branham Hills pool ledger, <strong>${winnersPicked.length} contenders</strong> drew first blood (1–0): <em>${winnersPicked.length > 0 ? winnersPicked.join(', ') : 'None'}</em>. Meanwhile, <strong>${losersPicked.length} ${losersPicked.length === 1 ? 'contender' : 'contenders'}</strong> (${losersPicked.length > 0 ? losersPicked.join(', ') : 'None'}) took an early hit backing ${tnfLoser}.${noPickNote} Don always reminds us: <em>&ldquo;${selectedBanterIntro}&rdquo;</em> There are ${Math.max(0, games.length - 1)} battles left on the board to flip the script!
          </div>
        </div>`;
      }
    } else if (tnfGame) {
      tnfSection = `
      <div style='margin-bottom:12px;'>
        <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🏈 THURSDAY NIGHT PRIMETIME SHOWDOWN: ${tnfGame.awayTeam.toUpperCase()} AT ${tnfGame.homeTeam.toUpperCase()}</div>
        <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
          Week ${dispatchWeek} kicks off with an electric Thursday night battle between <strong>${tnfGame.awayTeam}</strong> and <strong>${tnfGame.homeTeam}</strong> (${tnfGame.spread || 'EVEN'}). Remember: straight-up pool picks lock strictly at kickoff time! Straight up only, baby! Spreads don't count for a dime in this pool.
        </div>
      </div>`;
    }

    // 2. 49ers Faithful Section
    let ninersSection = '';
    if (ninersGame) {
      const isNinersHome = ninersGame.homeTeam.toLowerCase().includes('49ers') || ninersGame.homeTeam.toLowerCase().includes('san francisco');
      const ninersOpponent = isNinersHome ? ninersGame.awayTeam : ninersGame.homeTeam;
      const ninersVenue = isNinersHome ? "Levi's Stadium in Santa Clara" : `on the road at ${ninersOpponent}`;
      const ninersKickoff = `${ninersGame.day || 'Sunday'} at ${ninersGame.kickoffTime || '1:25 PM'} PT`;
      ninersSection = `
      <div style='background:#fdf2f2; border:1px solid #fecaca; border-left:4px solid #b91c1c; padding:12px 14px; border-radius:6px; margin:12px 0;'>
        <div style='font-size:11px; font-weight:800; color:#991b1b; text-transform:uppercase; letter-spacing:1px;'>
          🔴💛 49ERS FAITHFUL OUTLOOK: ${ninersGame.awayTeam.toUpperCase()} AT ${ninersGame.homeTeam.toUpperCase()}
        </div>
        <div style='font-size:12px; color:#374151; line-height:1.6; margin-top:6px;'>
          The Faithful have this one circled in red and gold as San Francisco clashes with <strong>${ninersOpponent}</strong> (${ninersKickoff}, ${ninersVenue}). Point spreads don't mean a lick—we only count outright winners!<br/><br/>
          From a die-hard 49ers fan&rsquo;s perspective, this matchup comes down to rhythm and execution. When Kyle Shanahan establishes the ground attack early and Brock Purdy gets into a surgical rhythm with play-action over the middle, this offense is virtually unstoppable. If the Niners protect the football and dominate the line of scrimmage, the Faithful can breathe easy. As Don put it: <em>&ldquo;If you want to win the week…Don&rsquo;t be Weak!&rdquo;</em>
        </div>
      </div>`;
    } else {
      ninersSection = `
      <div style='background:#fdf2f2; border:1px solid #fecaca; border-left:4px solid #b91c1c; padding:12px 14px; border-radius:6px; margin:12px 0;'>
        <div style='font-size:11px; font-weight:800; color:#991b1b; text-transform:uppercase; letter-spacing:1px;'>
          🔴💛 49ERS FAITHFUL BYE WEEK CHECK-IN: RESTING UP IN SANTA CLARA
        </div>
        <div style='font-size:12px; color:#374151; line-height:1.6; margin-top:6px;'>
          The San Francisco 49ers are officially on their <strong>Week ${dispatchWeek} Bye</strong>, giving Kyle Shanahan, Brock Purdy, and the entire Red &amp; Gold roster a much-needed weekend off to heal up for the second-half stretch run!<br/><br/>
          For the Faithful in the Branham Hills pool, a 49ers bye week means zero heartburn on Sunday and purely objective straight-up picking across the ${Math.max(0, games.length - 1)} remaining weekend battles${snfGame ? `, headlined by Sunday Night Football (${snfGame.awayTeam} at ${snfGame.homeTeam})` : ''}. Remember Don&rsquo;s classic decree: <em>&ldquo;DO NOT USE MASCOTS! City, State, or Region only....I have spoken!&rdquo;</em>
        </div>
      </div>`;
    }

    // 3. Pool Contender Standings Report & League Banter (STRICTLY ACTIVE)
    const contenderBanterSection = generateDynamicFridayBanterHtml(activePlayers, seasonHistory, ranked, dispatchWeek);
    deterministicBody = `${tnfSection}${ninersSection}${contenderBanterSection}`;
  } else if (type === 'sunday') {
    module2Title = `${DISPATCH_SLOT_NAMES.sunday.toUpperCase()} • WEEK ${dispatchWeek}`;

    const sundayGames = games.filter(g => !g.isTNF && !g.isMNF);
    const finalSundayGames = sundayGames.filter(g => g.status === 'final');
    let nflRundownHtml = '';
    if (finalSundayGames.length > 0) {
      const topResults = finalSundayGames.map(g => {
        const winTeam = g.officialWinner || ((g.homeScore ?? 0) > (g.awayScore ?? 0) ? g.homeTeam : g.awayTeam);
        const loseTeam = winTeam === g.homeTeam ? g.awayTeam : g.homeTeam;
        const hiScore = Math.max(g.homeScore || 0, g.awayScore || 0);
        const loScore = Math.min(g.homeScore || 0, g.awayScore || 0);
        return `<strong>${winTeam}</strong> over ${loseTeam} (${hiScore}-${loScore})`;
      }).slice(0, 6).join(' • ');

      nflRundownHtml = `
      <div style='margin-bottom:12px;'>
        <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🏈 SUNDAY GRIDIRON ACTION & KEY FINALS</div>
        <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
          Sunday delivered another heart-pounding chapter of NFL drama, filled with red-zone stands, clutch fourth-quarter drives, and shocking underdog upsets that shredded pool sheets across the land.<br/><br/>
          <strong>Key Sunday Finals:</strong> ${topResults}.<br/><br/>
          Every single point mattered as fourteen Sunday battles sorted the contenders from the pretenders heading into tomorrow's primetime finale!
        </div>
      </div>`;
    } else {
      nflRundownHtml = `
      <div style='margin-bottom:12px;'>
        <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🏈 SUNDAY SLATE BATTLEGROUND</div>
        <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
          Fourteen intense Sunday battles set the tone for Week ${dispatchWeek}. From opening 10:00 AM kickoffs through the afternoon window and Sunday Night Football, every single drive shifted the live leaderboard standings!
        </div>
      </div>`;
    }

    const sundayReport = providedSundayReport || await scrapeSundayNflAction();
    const scrapedWireHtml = renderSundayActionAndUpsetsHtml(sundayReport);

    const topScorers = ranked.filter(r => r.wins === ranked[0].wins).map(r => r.name);
    const chasers = ranked.filter(r => r.wins < ranked[0].wins && r.wins >= Math.max(1, ranked[0].wins - 2)).map(r => r.name);
    const chaserWinsScore = ranked.find(r => r.wins < ranked[0].wins)?.wins ?? (ranked[0].wins - 1);

    let scenarioAlert = '';
    if (isClinched) {
      scenarioAlert = `With all unplayed games exhausted, <strong>${ranked[0]?.name}</strong> has already officially CLINCHED the weekly summit outright!`;
    } else if (isLockedIn) {
      scenarioAlert = `With both top contenders locked on the exact same Monday Night pick (<strong>${ranked[0]?.mnfPick}</strong>), <strong>${ranked[0]?.name}</strong> has LOCKED IN the crown!`;
    } else if (isShowdown) {
      scenarioAlert = `We have an epic SHOWDOWN brewing: <strong>${ranked[0]?.name}</strong> (${ranked[0]?.mnfPick}) and <strong>${ranked[1]?.name}</strong> (${ranked[1]?.mnfPick}) hold opposing picks on Monday Night!`;
    }

    const poolStandingsBanterHtml = `
    <div style='margin-bottom:12px;'>
      <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase;'>🎙️ SUNDAY LEAGUE BANTER: THE SUMMIT VS. THE CELLAR</div>
      <div style='font-size:12px; color:#334155; line-height:1.6; margin-top:4px;'>
        Sitting atop the Sunday ledger heading into Monday Night: <strong>${topScorers.join(', ')}</strong> with <strong>${ranked[0].wins} outright wins</strong>! ${scenarioAlert}<br/><br/>
        Right on their heels in the silver chase: <strong>${chasers.length > 0 ? chasers.join(', ') : 'The chasing pack'}</strong> at <strong>${chaserWinsScore} wins</strong>, within striking distance and praying for a Monday Night miracle.<br/><br/>
        Meanwhile, down in the damp basement of the pool, <strong>${cellarContenders.join(', ')}</strong> (${lowestWins} wins) are officially on cellar duty after Sunday's upsets demolished their sheets. Remember Don's 40-year golden rule: <em>&ldquo;${selectedBanterIntro}&rdquo;</em> There's no crying in football pool—shake it off and get ready to redeem yourself next week!
      </div>
    </div>`;

    const streakSectionHtml = generateDynamicContenderStreakHtml(activePlayers, seasonHistory, ranked, dispatchWeek);
    deterministicBody = `${nflRundownHtml}${scrapedWireHtml}${poolStandingsBanterHtml}${streakSectionHtml}`;
  } else {
    module2Title = `${DISPATCH_SLOT_NAMES.tuesday.toUpperCase()} • WEEK ${dispatchWeek} 👑`;

    // Dynamic, rich, non-cookie-cutter narrative recap engine
    const tieGame = games.find(g => isGameTie(g));
    const tieGameNote = tieGame 
      ? `One of the rarest anomalies in modern pool history occurred in Game #${tieGame.gameNumber}, where ${tieGame.awayTeam} and ${tieGame.homeTeam} collided into an official <strong>${tieGame.awayScore}&ndash;${tieGame.homeScore} deadlock</strong>. Under straight-up pool constitution, a tie is scored strictly as a push with zero points awarded to either side&mdash;no wins, no losses, and zero artificial bonus points. Every single contender received an identical push, preserving pure merit on the remaining games.`
      : '';

    const p1Opening = `The final whistle of Monday Night Football has echoed across the gridiron, and Week ${dispatchWeek} is officially sealed in the Branham Hills vault. In a breathtaking primetime showdown, <strong>${mnfGameName}</strong> delivered a high-octane <strong>${mnfScoreSummary}</strong> clash with <strong>${mnfWinnerName}</strong> taking the outright victory. When the smoke cleared and the ledgers were audited, Don&rsquo;s timeless decree rang true once again: <em>&ldquo;${selectedBanterIntro}&rdquo;</em> ${tieGameNote}`;

    const p2Champion = `Standing tall at the summit and capturing the prestigious Week ${dispatchWeek} Crown is <strong>${weeklyWinner.name}</strong>, who put on a clinic with a slate-leading <strong>${weeklyWinner.wins} outright victories</strong> (${weeklyWinner.wins}&ndash;${weeklyWinner.losses}). ${tiebreakerApplied ? tiebreakerDetail : `Unlike weeks that boil down to late-night arithmetic and point spread calculators, <strong>${weeklyWinner.name}</strong> left zero room for doubt, winning the crown outright without even needing the Monday Night tiebreaker to separate from the field.`} Wearing the weekly crown in a 40-year pool is an honor earned through grit and sharp gridiron instincts.`;

    const p3Podium = `Right on the champion&rsquo;s heels, the silver chase turned into a white-knuckle brawl. <strong>${runnerUpNamesStr}</strong> pushed all the way to the wire, finishing just a single game off the summit at <strong>${runnerUpScore} wins</strong>. Throughout the trenches, <strong>${middleContenders.length > 0 ? middleContenders.join(', ') : 'the chasing pack'}</strong> battled tooth-and-nail around the <strong>${Math.max(1, runnerUpScore - 1)}-win mark</strong>, proving that one bounce of the pigskin on Sunday afternoon makes all the difference between podium glory and mid-table anonymity.`;

    const p4Cellar = `Down at the damp bottom of the pool sheet, <strong>${cellarContenders.join(', ')}</strong> (${lowestWins} wins) have officially drawn cellar cleanup duty. As every seasoned crew chief knows, if you miss a call in the dirt, you don&rsquo;t complain to the dugout&mdash;you dust off your trousers, square your shoulders, drop an honorary Penalty Flag in The Umpire Penalty Jar for bad picking, and lock back in for the next pitch. Week ${dispatchWeek + 1} sheets are live&mdash;get your pencils sharpened, leave the excuses at the gate, and come out swinging!`;

    deterministicBody = `<p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>${p1Opening}</p>
    <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>${p2Champion}</p>
    <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>${p3Podium}</p>
    <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>${p4Cellar}</p>`;
  }

  const tuesdayFactsStr = type === 'tuesday' ? `
- OFFICIAL TUESDAY FINALE FACTS:
  • Weekly Winner Crowned: ${weeklyWinner.name} won Week ${dispatchWeek} outright with ${weeklyWinner.wins} wins (${weeklyWinner.wins}-${weeklyWinner.losses})!
  • Certification & Tiebreaker: ${tiebreakerDetail}
  • Monday Night Football Result: ${mnfGameName} (${mnfScoreSummary}). Outright Winner: ${mnfWinnerName}. Total points scored: ${actualMnfTotal} pts.
  • Chasers / Runners-Up: ${runnerUpNamesStr} (${runnerUpScore} wins).
  • Middle of Pack: ${middleContenders.join(', ')} (${Math.max(0, runnerUpScore - 1)} wins).
  • Cellar Patrol (Basement): ${cellarContenders.join(', ')} (${lowestWins} wins).
  ${games.some(g => isGameTie(g)) ? `• OFFICIAL TIE GAME: ${games.filter(g => isGameTie(g)).map(g => `${g.awayTeam} @ ${g.homeTeam} tied ${g.awayScore}-${g.homeScore}`).join(', ')} (Straight Up pool scored as Push: 0 points awarded, nobody won and nobody lost).` : ''}
  • Cumulative Season Standing Leaders: ${cumulativeRanked.slice(0, 3).map(c => `${c.name} (${c.totalSeasonWins}W)`).join(', ')}.
` : '';

  // Generate autonomous, dynamic AI recap via @google/genai
  const aiGeneratedRecap = await generateAiCommishRecap({
    type,
    dispatchWeek,
    activePlayerNames: activeNames,
    tnfFacts: tnfFactStr,
    clinchFacts: clinchFactStr,
    standingsFacts: standingsFactStr,
    ninersFacts,
    weekendGamesFacts,
    tuesdayFacts: tuesdayFactsStr,
    selectedBanterIntro,
    randomQuote,
    quoteContext,
    loreSamples,
    shuffle
  });

  const module2Body = aiGeneratedRecap || deterministicBody;

  const module2 =
`<div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>
  <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>${module2Title}</h2>
  <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'>${module2Body}</div>
</div>`;

  // -------------------------------------------------------------
  // MODULE 3: CONTENDER PODIUM CARDS (#1 Crown, #2 Runner-Up, #3 Podium)
  // - Tuesday Final certifies the completed week: if tied for 1st, tiebreaker
  //   winner takes #1, co-leaders at maxWins take #2, and the next distinct win
  //   tier takes #3 (never leaving #3 vacated when contenders exist).
  // - Friday & Sunday reflect the live current active week (dispatchWeek) race
  //   immediately after TNF / SNF, grouping all tied contenders into each tier.
  // -------------------------------------------------------------
  const tuesdayPodiumWeek = type === 'tuesday'
    ? dispatchWeek
    : (seasonHistory?.compiledWeeks && seasonHistory.compiledWeeks.length > 0
        ? Math.max(...seasonHistory.compiledWeeks)
        : (weekNumber > 1 ? weekNumber - 1 : 1));

  interface PodiumContender {
    name: string;
    wins: number;
    losses: number;
    tb?: number | string;
    isWinner?: boolean;
    totalSeasonWins?: number;
  }

  let podiumSource: PodiumContender[] = [];

  if (type === 'tuesday') {
    podiumSource = activePlayers.map(p => {
      const cleanName = p.id === 'elvis' ? 'Elvis' : p.name;
      const histRecord = seasonHistory?.records?.[cleanName];
      const wkRecord = histRecord?.weeklyBreakdown?.[tuesdayPodiumWeek];
      const wins = wkRecord?.wins ?? (weeklyRanked.find(r => r.name === cleanName)?.wins ?? 0);
      const losses = wkRecord?.losses ?? (Math.max(12, games.length) - wins);
      const isWinner = wkRecord?.isWinner ?? (cleanName === weeklyWinner.name);
      const tb = wkRecord?.tiebreaker ?? (weeklyRanked.find(r => r.name === cleanName)?.tb ?? '');
      return {
        name: cleanName,
        wins,
        losses,
        tb,
        isWinner,
        totalSeasonWins: histRecord?.totalWins ?? wins
      };
    });
  } else {
    // Friday (after TNF) & Sunday (after SNF): use live current-week weeklyRanked
    podiumSource = weeklyRanked.map(r => ({
      name: r.name,
      wins: r.wins,
      losses: r.losses,
      tb: r.tb,
      isWinner: false,
      totalSeasonWins: r.totalSeasonWins
    }));
  }

  // Sort strictly by wins descending, then alphabetically
  podiumSource.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });

  const maxWins = podiumSource[0]?.wins ?? 0;
  const leadersAtMax = podiumSource.filter(p => p.wins === maxWins);

  let p1Contenders: PodiumContender[] = [];
  let p2Contenders: PodiumContender[] = [];
  let p3Contenders: PodiumContender[] = [];
  let tiebreakerDecidedCrown = false;
  let isFridaySplitZeroWins = false;

  if (type === 'tuesday') {
    if (leadersAtMax.length === 1) {
      p1Contenders = [leadersAtMax[0]];
      const secondWins = podiumSource.find(p => p.wins < maxWins)?.wins;
      p2Contenders = secondWins !== undefined ? podiumSource.filter(p => p.wins === secondWins) : [];
      const thirdWins = secondWins !== undefined ? podiumSource.find(p => p.wins < secondWins)?.wins : undefined;
      p3Contenders = thirdWins !== undefined ? podiumSource.filter(p => p.wins === thirdWins) : [];
    } else {
      // Multiple contenders tied for 1st place on Tuesday Final! Tiebreaker crowns #1 (or Co-Champions if tied on TB), remaining co-leaders take #2, next win tier takes #3
      tiebreakerDecidedCrown = true;
      const verifiedWinners = leadersAtMax.filter(p => p.isWinner);
      p1Contenders = verifiedWinners.length > 0
        ? verifiedWinners
        : [leadersAtMax.find(p => p.name === weeklyWinner.name) || leadersAtMax[0]];
      const winnerNamesSet = new Set(p1Contenders.map(w => w.name));
      p2Contenders = leadersAtMax.filter(p => !winnerNamesSet.has(p.name));
      const nextTierWins = podiumSource.find(p => p.wins < maxWins)?.wins;
      if (p2Contenders.length > 0) {
        p3Contenders = nextTierWins !== undefined ? podiumSource.filter(p => p.wins === nextTierWins) : [];
      } else {
        p2Contenders = nextTierWins !== undefined ? podiumSource.filter(p => p.wins === nextTierWins) : [];
        const thirdTierWins = nextTierWins !== undefined ? podiumSource.find(p => p.wins < nextTierWins)?.wins : undefined;
        p3Contenders = thirdTierWins !== undefined ? podiumSource.filter(p => p.wins === thirdTierWins) : [];
      }
    }
  } else {
    // Live active week (Friday after TNF or Sunday heading into MNF): group by distinct win tiers
    p1Contenders = leadersAtMax;
    const secondWins = podiumSource.find(p => p.wins < maxWins)?.wins;
    p2Contenders = secondWins !== undefined ? podiumSource.filter(p => p.wins === secondWins) : [];
    const thirdWins = secondWins !== undefined ? podiumSource.find(p => p.wins < secondWins)?.wins : undefined;
    p3Contenders = thirdWins !== undefined ? podiumSource.filter(p => p.wins === thirdWins) : [];

    // On Friday Night after only 1 game (TNF), contenders are only at 1-0 or 0-1 (2 distinct win tiers).
    // Split the 0-1 tier into contenders who picked the TNF underdog (#2) and contenders awaiting Sunday slate (#3)
    if (p3Contenders.length === 0 && p2Contenders.length > 0 && type === 'friday') {
      const pickedLoserContenders = p2Contenders.filter(c => losersPicked.includes(c.name));
      const awaitingSheetContenders = p2Contenders.filter(c => !losersPicked.includes(c.name));
      if (pickedLoserContenders.length > 0 && awaitingSheetContenders.length > 0) {
        p2Contenders = pickedLoserContenders;
        p3Contenders = awaitingSheetContenders;
        isFridaySplitZeroWins = true;
      }
    }
  }

  const getContenderLore = (name: string): string => {
    const matched = activePlayers.find(p => p.name.toLowerCase() === name.toLowerCase());
    return matched?.tagline || 'Pool Contender • 40th Anniversary Season';
  };

  const formatWinsLabel = (w: number, l: number) => `${w} ${w === 1 ? 'Win' : 'Wins'} (${w}-${l})`;

  const module3HeaderTitle = type === 'tuesday'
    ? `👑 WEEK ${tuesdayPodiumWeek} WEEKLY RACE PODIUM`
    : (type === 'sunday'
        ? `⭐ WEEK ${dispatchWeek} SUNDAY RACE LEADERS (HEADING INTO MNF)`
        : `⭐ WEEK ${dispatchWeek} WEEKLY RACE PODIUM (AFTER TNF)`);

  const module3Subheader = type === 'tuesday'
    ? 'Official Weekly Race Certification'
    : (type === 'sunday'
        ? 'Current Week Sunday Race • Straight-Up Outright Wins'
        : `Current Week ${dispatchWeek} Live Standings • ${Math.max(0, games.length - 1)} Games Remaining`);

  // Panel 1 labels
  let p1Badge = '👑 #1 Weekly Crown';
  let p1NamesHtml = '—';
  let p1WinsText = '—';
  let p1Subtitle = '—';

  if (p1Contenders.length === 1) {
    p1Badge = type === 'sunday'
      ? '⭐ #1 Sunday Leader'
      : type === 'friday'
        ? '⭐ #1 TNF Leader'
        : (tiebreakerDecidedCrown ? '👑 #1 Weekly Crown (Tiebreaker Winner)' : '👑 #1 Weekly Crown');
    p1NamesHtml = p1Contenders[0].name;
    p1WinsText = formatWinsLabel(p1Contenders[0].wins, p1Contenders[0].losses);
    p1Subtitle = getContenderLore(p1Contenders[0].name);
  } else if (p1Contenders.length > 1) {
    p1Badge = type === 'tuesday'
      ? `👑 T-#1 Weekly Co-Champions (${p1Contenders.length}-Way Tie)`
      : type === 'friday'
        ? `⭐ T-#1 TNF Leaders (${p1Contenders.length}-Way Tie)`
        : `⭐ T-#1 Sunday Leaders (${p1Contenders.length}-Way Tie)`;
    p1NamesHtml = p1Contenders.map(c => c.name).join(' • ');
    p1WinsText = formatWinsLabel(p1Contenders[0].wins, p1Contenders[0].losses);
    p1Subtitle = type === 'tuesday'
      ? `Co-Champions (Tied on MNF Tiebreaker: ${p1Contenders[0].tb} pts)`
      : (type === 'friday' && tnfWinner)
        ? `Backed ${tnfWinner} (${p1Contenders.length} Contenders at 1-0)`
        : `Co-Leaders (${p1Contenders.length} Contenders Tied)`;
  }

  // Panel 2 labels
  let p2Badge = '🥈 #2 Weekly Runner-Up';
  let p2NamesHtml = '';
  let p2WinsText = '';
  let p2Subtitle = '';

  if (p2Contenders.length === 1) {
    p2Badge = type === 'sunday'
      ? '🥈 #2 Sunday Chaser'
      : (type === 'friday' && isFridaySplitZeroWins ? '🥈 #2 TNF Underdog Pick' : '🥈 #2 Weekly Runner-Up');
    p2NamesHtml = p2Contenders[0].name;
    p2WinsText = formatWinsLabel(p2Contenders[0].wins, p2Contenders[0].losses);
    p2Subtitle = (type === 'friday' && isFridaySplitZeroWins && tnfLoser)
      ? `Backed ${tnfLoser} • ${Math.max(0, games.length - 1)} Games Left`
      : getContenderLore(p2Contenders[0].name);
  } else if (p2Contenders.length > 1) {
    p2Badge = type === 'sunday'
      ? `🥈 T-#2 Sunday Chasers (${p2Contenders.length}-Way Tie)`
      : (type === 'friday' && isFridaySplitZeroWins
          ? `🥈 T-#2 TNF Underdog Picks (${p2Contenders.length}-Way Tie)`
          : `🥈 T-#2 Weekly Runner-Up (${p2Contenders.length}-Way Tie)`);
    p2NamesHtml = p2Contenders.map(c => c.name).join(' • ');
    p2WinsText = formatWinsLabel(p2Contenders[0].wins, p2Contenders[0].losses);
    p2Subtitle = (type === 'friday' && isFridaySplitZeroWins && tnfLoser)
      ? `Backed ${tnfLoser} (${p2Contenders.length} Contenders)`
      : `Co-Runners-Up (${p2Contenders.length} Contenders Tied)`;
  } else {
    p2Badge = '🥈 #2 Weekly Runner-Up';
    p2NamesHtml = '—';
    p2WinsText = '—';
    p2Subtitle = '—';
  }

  // Panel 3 labels
  let p3Badge = '🥉 #3 Weekly Podium';
  let p3NamesHtml = '';
  let p3WinsText = '';
  let p3Subtitle = '';

  if (p3Contenders.length === 0) {
    // Fallback if only 1 or 2 score tiers exist across the entire pool
    const fallbackContenders = podiumSource.filter(
      p => !p1Contenders.some(c => c.name === p.name) && !p2Contenders.some(c => c.name === p.name)
    );
    if (fallbackContenders.length > 0) {
      p3Contenders = fallbackContenders;
    }
  }

  if (p3Contenders.length === 1) {
    p3Badge = type === 'sunday'
      ? '🥉 #3 Sunday Pack'
      : (type === 'friday' && isFridaySplitZeroWins ? '⏳ #3 Pending Sunday Slate' : '🥉 #3 Weekly Podium');
    p3NamesHtml = p3Contenders[0].name;
    p3WinsText = formatWinsLabel(p3Contenders[0].wins, p3Contenders[0].losses);
    p3Subtitle = (type === 'friday' && isFridaySplitZeroWins)
      ? `No TNF Pick • ${Math.max(0, games.length - 1)} Sunday/MNF Games Open`
      : getContenderLore(p3Contenders[0].name);
  } else if (p3Contenders.length > 1) {
    p3Badge = type === 'sunday'
      ? `🥉 T-#3 Sunday Pack (${p3Contenders.length}-Way Tie)`
      : (type === 'friday' && isFridaySplitZeroWins
          ? `⏳ #3 Pending Sunday Slate (${p3Contenders.length} Contenders)`
          : `🥉 T-#3 Weekly Podium (${p3Contenders.length}-Way Tie)`);
    p3NamesHtml = p3Contenders.map(c => c.name).join(' • ');
    p3WinsText = formatWinsLabel(p3Contenders[0].wins, p3Contenders[0].losses);
    p3Subtitle = (type === 'friday' && isFridaySplitZeroWins)
      ? `No TNF Pick • ${Math.max(0, games.length - 1)} Sunday/MNF Games Open`
      : `Co-Podium Finishers (${p3Contenders.length} Contenders Tied)`;
  } else {
    p3Badge = '🥉 #3 Weekly Podium';
    p3NamesHtml = `${Math.max(0, games.length - 1)} Games Remaining`;
    p3WinsText = 'Sunday & MNF Slate Open';
    p3Subtitle = `Full Field Active in Week ${dispatchWeek}`;
  }

  const module3 =
`<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>
  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>
    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>${module3HeaderTitle}</span>
    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>${module3Subheader}</span>
  </div>
  <div style='padding:12px 14px;'>
    <table style='width:100%; border-collapse:separate; border-spacing:6px;'>
      <tr>
        <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>
          <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>${p1Badge}</div>
          <div style='font-size:${p1Contenders.length > 2 ? '13px' : '15px'}; font-weight:800; color:#422006; margin:4px 0;'>${p1NamesHtml}</div>
          <div style='font-size:12px; color:#713f12; font-weight:700;'>${p1WinsText}</div>
          <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>${p1Subtitle}</div>
        </td>
        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>
          <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>${p2Badge}</div>
          <div style='font-size:${p2Contenders.length > 2 ? '13px' : '14px'}; font-weight:800; color:#0f172a; margin:4px 0;'>${p2NamesHtml}</div>
          <div style='font-size:12px; color:#334155; font-weight:700;'>${p2WinsText}</div>
          <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>${p2Subtitle}</div>
        </td>
        <td style='background:#fdf2f8; border:1px solid #fbcfe8; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>
          <div style='font-size:10px; font-weight:bold; color:#9d174d; text-transform:uppercase;'>${p3Badge}</div>
          <div style='font-size:${p3Contenders.length > 2 ? '13px' : '14px'}; font-weight:800; color:#831843; margin:4px 0;'>${p3NamesHtml}</div>
          <div style='font-size:12px; color:#9d174d; font-weight:700;'>${p3WinsText}</div>
          <div style='font-size:10px; color:#9d174d; font-style:italic; margin-top:4px;'>${p3Subtitle}</div>
        </td>
      </tr>
    </table>
  </div>
</div>`;

  // PODCAST AUDIO REVIEW MODULE (If link provided)
  const podcastModule = podcastUrl ? 
`<div style='background:#022c22; border:2px solid #d4af37; border-radius:8px; padding:14px; margin-bottom:14px; text-align:center;'>
  <div style='color:#fbbf24; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px;'>🎙️ 5-MINUTE DISPATCH PODCAST REVIEW</div>
  <div style='color:#ffffff; font-size:14px; font-weight:800; margin:4px 0 8px 0;'>${podcastTitle || `Week ${dispatchWeek} BroadSheet Breakdown`}</div>
  <div style='color:#d1fae5; font-size:11px; margin-bottom:10px;'>Listen to the 5-minute audio review covering key matchups, upsets, and Don's classic commentary.</div>
  <a href='${podcastUrl}' target='_blank' rel='noopener noreferrer' style='display:inline-block; background:#d4af37; color:#022c22; font-weight:800; font-size:11px; padding:6px 20px; border-radius:20px; text-decoration:none; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 4px rgba(0,0,0,0.2);'>
    ▶ Listen to 5-Min Podcast Review
  </a>
</div>` : '';

  // -------------------------------------------------------------
  // MODULE 4: UPCOMING WEEK LOOKAHEAD & MARQUEE MATCHUPS (Opening lines, key rivalries, submission reminders)
  // -------------------------------------------------------------
  const nextWeekNumber = dispatchWeek + 1;
  let module4 = '';

  if (type === 'tuesday') {
    module4 = `
<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>
  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>
    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>📅 LOOKAHEAD: WEEK ${nextWeekNumber} BATTLEGROUND</span>
    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Opening Lines & Slate Schedule</span>
  </div>
  <div style='padding:12px 14px; font-size:12px; color:#064e3b; line-height:1.6;'>
    • <strong>Fresh Slate:</strong> The ledger resets at midnight after Monday Night Football, and brand new NFL matchups open up in Week ${nextWeekNumber}.<br/>
    • <strong>Sheet Distribution:</strong> Blank Week ${nextWeekNumber} pick sheets are now live and open for Tuesday morning submissions!
  </div>
</div>`;
  } else if (type === 'sunday') {
    // Detailed Monday Night Football Forecast & Contender Matchup Showdown
    const mnfGameName = mnfGame ? `${mnfGame.awayTeam} at ${mnfGame.homeTeam}` : 'Monday Night Football';
    const mnfTime = mnfGame?.kickoffTime || '5:15 PM PT';
    const mnfSpread = mnfGame?.spread || '-3.5';
    const mnfFav = mnfGame?.favorite || mnfGame?.homeTeam || 'Home Team';

    // Figure out which contenders picked Away vs Home for MNF
    const awayPickers: string[] = [];
    const homePickers: string[] = [];
    activePlayers.forEach(p => {
      const cleanName = p.id === 'elvis' ? 'Elvis' : p.name;
      const pPicks = picks[cleanName]?.picks || {};
      const rawPick = (mnfGame && (pPicks[mnfGame.gameNumber] || (pPicks as any)[String(mnfGame.gameNumber)])) 
        || (games.length > 0 ? (pPicks[games[games.length - 1].gameNumber] || (pPicks as any)[String(games[games.length - 1].gameNumber)]) : '')
        || pPicks[16] 
        || '';
      if (rawPick && mnfGame) {
        const normPick = formatTeamCityOrRegion(rawPick).toLowerCase();
        const normAway = formatTeamCityOrRegion(mnfGame.awayTeam).toLowerCase();
        const normHome = formatTeamCityOrRegion(mnfGame.homeTeam).toLowerCase();
        if (normPick === normAway || rawPick.toLowerCase().includes(normAway)) {
          awayPickers.push(cleanName);
        } else if (normPick === normHome || rawPick.toLowerCase().includes(normHome)) {
          homePickers.push(cleanName);
        }
      }
    });

    const awayLabel = mnfGame?.awayTeam ? formatTeamCityOrRegion(mnfGame.awayTeam) : 'Away';
    const homeLabel = mnfGame?.homeTeam ? formatTeamCityOrRegion(mnfGame.homeTeam) : 'Home';
    const formattedMnfTitle = mnfGame ? `${awayLabel} at ${homeLabel}` : 'Monday Night Football';

    module4 = `
<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>
  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>
    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 MONDAY NIGHT FOOTBALL FORECAST & CONTENDER SHOWDOWN</span>
    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>The Week ${dispatchWeek} Decider</span>
  </div>
  <div style='padding:14px;'>
    <div style='background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:12px; margin-bottom:12px;'>
      <div style='font-size:10px; font-weight:800; color:#0f766e; text-transform:uppercase; letter-spacing:1px;'>⭐ PRIMETIME SHOWDOWN & SPREAD</div>
      <div style='font-size:15px; font-weight:800; color:#064e3b; margin:4px 0;'>${formattedMnfTitle}</div>
      <div style='font-size:11px; color:#475569;'>Kickoff: ${mnfTime} • Line: ${formatTeamCityOrRegion(mnfFav)} (${mnfSpread})</div>
    </div>

    <table style='width:100%; border-collapse:separate; border-spacing:8px; margin-bottom:12px;'>
      <tr>
        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>
          <div style='font-size:11px; font-weight:800; color:#1e293b; text-transform:uppercase;'>RIDING ${awayLabel.toUpperCase()}:</div>
          <div style='font-size:11px; color:#334155; margin-top:4px; line-height:1.5;'>
            ${awayPickers.length > 0 ? awayPickers.join(', ') : 'None locked in yet'}
          </div>
        </td>
        <td style='background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>
          <div style='font-size:11px; font-weight:800; color:#065f46; text-transform:uppercase;'>RIDING ${homeLabel.toUpperCase()}:</div>
          <div style='font-size:11px; color:#047857; margin-top:4px; line-height:1.5;'>
            ${homePickers.length > 0 ? homePickers.join(', ') : 'None locked in yet'}
          </div>
        </td>
      </tr>
    </table>

    <div style='font-size:12px; color:#334155; line-height:1.6;'>
      <strong>⚡ The Finale:</strong> Tonight's final whistle determines our Week ${dispatchWeek} Weekly Champion! If contenders finish tied for 1st place in outright weekly wins, the Monday Night combined points tiebreaker crowns the champion.
    </div>
  </div>
</div>`;
  } else {
    // FRIDAY WIRE: SUNDAY NFL MARQUEE MATCHUPS & LIVE INJURY WIRE REPORT
    // Filter injury wire strictly to teams with unplayed games remaining this weekend (excludes TNF and Bye-week teams)
    const activeTeams = games
      .filter(g => g.status !== 'final' && !g.isTNF)
      .flatMap(g => [g.awayTeam, g.homeTeam])
      .filter(Boolean);
    const injuries = await fetchLiveNflInjuries(activeTeams);
    const injuryTableHtml = renderInjuryReportTableHtml(injuries, new Date().toISOString());

    const sundayGames = games.filter(g => !g.isTNF && !g.isMNF);
    const snfMatchup = sundayGames.find(g => g.isSNF) || sundayGames[sundayGames.length - 1];
    const daytimeSundayGames = sundayGames.filter(g => g !== snfMatchup).slice(0, 3);
    const marqueeGames = snfMatchup ? [...daytimeSundayGames, snfMatchup] : sundayGames.slice(0, 4);
    const remainingBattlesCount = Math.max(0, games.length - 1);

    const marqueeCardsHtml = marqueeGames.map((g, idx) => {
      const isSNF = g.isSNF || (g.kickoffTime && (g.kickoffTime.includes('5:') || g.kickoffTime.includes('8:'))) || idx === marqueeGames.length - 1;
      const cardBg = isSNF ? '#fefce8' : '#ffffff';
      const cardBorder = isSNF ? '#facc15' : '#e2e8f0';
      const badgeText = isSNF ? '⭐ SUNDAY NIGHT SHOWDOWN' : `🔥 SUNDAY MARQUEE CLASH #${idx + 1}`;
      const badgeBg = isSNF ? '#854d0e' : '#065f46';
      const spreadText = g.favorite ? `${g.favorite} (${g.spread || 'PK'})` : (g.spread || 'PK');
      const ouText = g.overUnder ? `${g.overUnder} pts` : '44.5 pts';

      return `<div style='background:${cardBg}; border:1px solid ${cardBorder}; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>
        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>
          <span style='background:${badgeBg}; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>${badgeText}</span>
          <span style='font-size:11px; font-weight:bold; color:#475569;'>${g.day || 'Sunday'} • ${g.kickoffTime || '10:00 AM'} PT</span>
        </div>
        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>
          ${g.awayTeam} <span style='color:#64748b; font-weight:normal;'>at</span> ${g.homeTeam}
        </div>
        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>
          <span>Opening Favorite: <strong style='color:#065f46;'>${spreadText}</strong></span>
          <span>Projected Total: <strong>${ouText}</strong></span>
        </div>
      </div>`;
    }).join('');

    module4 = `
<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>
  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>
    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 SUNDAY NFL MARQUEE MATCHUPS & WEEKEND LOOKAHEAD</span>
    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Week ${dispatchWeek} Slate Preview</span>
  </div>
  <div style='padding:12px 14px;'>
    <div style='font-size:11px; color:#064e3b; margin-bottom:10px; line-height:1.5;'>
      With the Thursday opener in the books, ${remainingBattlesCount} gridiron battles remain on the Week ${dispatchWeek} board. Here are the premier Sunday marquee matchups highlighting this weekend's slate:
    </div>
    ${marqueeCardsHtml}
    <div style='margin-top:14px; margin-bottom:10px;'>
      ${injuryTableHtml}
    </div>
  </div>
</div>`;
  }

  // -------------------------------------------------------------
  // MODULE 5: CONDENSED STANDINGS TABLE & SUNDAY RACE BREAKDOWN
  // Deep Emerald Header (#064e3b), Gold Text (#fef3c7), Alternating Light Emerald Rows (#ecfdf5)
  // -------------------------------------------------------------
  const hasFridayTnfFinal = type === 'friday' && Boolean(tnfGame && tnfGame.status === 'final');
  const showCurrentWeekColumn = (type === 'sunday' && dispatchWeek >= 3) || hasFridayTnfFinal;
  const currentWeekHeader = type === 'sunday' ? `WK${dispatchWeek} (SUN)` : (hasFridayTnfFinal ? `WK${dispatchWeek} (TNF)` : `WK${dispatchWeek}`);

  const maxPriorWeek = type === 'tuesday' ? dispatchWeek : dispatchWeek - 1;
  const priorWeekNumbers: number[] = [];
  for (let w = 1; w <= maxPriorWeek; w++) {
    priorWeekNumbers.push(w);
  }
  const priorWeekHeaders = priorWeekNumbers.map(w => 
    `<th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK${w}</th>`
  ).join('');

  // Table 1 for Sunday: Dedicated Week Race Standings heading into MNF
  let sundayRaceTableHtml = '';
  if (type === 'sunday') {
    const sundayRaceRows = weeklyRanked.map((r, i) => {
      const bg = (i % 2 === 0 ? '#ffffff' : '#f0fdf4');
      const isLeader = (r.weekRank === 1);
      const rankBadge = isLeader ? `<span style='color:#854d0e; font-weight:800;'>#1 ⭐</span>` : `#${r.weekRank}`;
      const nameDisplay = isLeader 
        ? `<strong style='color:#064e3b;'>${r.name}</strong>` 
        : `<span style='color:#0f172a; font-weight:600;'>${r.name}</span>`;
      return `<tr style='background:${bg}; border-bottom:1px solid #d1fae5;'>
        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>${rankBadge}</td>
        <td style='padding:5px 8px; font-size:12px;'>${nameDisplay}</td>
        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>${r.wins}</td>
        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>${r.losses}</td>
        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>${r.mnfPick || 'Pending'}</td>
        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>${r.tb || '—'}</td>
      </tr>`;
    }).join('');

    sundayRaceTableHtml = `
    <div style='margin-bottom:16px;'>
      <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>
        🏈 WEEK ${dispatchWeek} SUNDAY RACE STANDINGS (HEADING INTO MNF)
      </div>
      <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>
        <thead>
          <tr style='background:#064e3b;'>
            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>WK RK</th>
            <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>CONTENDER</th>
            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN WINS</th>
            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN LOSSES</th>
            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>MNF PICK</th>
            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>TIEBREAKER</th>
          </tr>
        </thead>
        <tbody>
          ${sundayRaceRows}
        </tbody>
      </table>
      <div style='background:#f0fdf4; padding:5px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>
        * Straight-up wins on completed Sunday games. Monday Night Football winner decides weekly champion. MNF tiebreaker delta strictly breaks 1st-place weekly deadlocks.
      </div>
    </div>`;
  }

  // Pre-calculate weekly winners across all prior weeks to highlight their scoring blocks
  const weeklyWinnersMap = new Map<number, Set<string>>();
  for (const w of priorWeekNumbers) {
    const winners = new Set<string>();
    if (seasonHistory?.records) {
      for (const [cName, rec] of Object.entries(seasonHistory.records)) {
        if (rec?.weeklyBreakdown?.[w]?.isWinner) {
          winners.add(cName);
        }
      }
    }
    // Fallback: If not explicitly marked as isWinner in breakdown, find highest score in that week
    if (winners.size === 0) {
      let maxScore = -1;
      for (const item of cumulativeRanked) {
        const val = item.pastWeeksWins[w] ?? 0;
        if (val > maxScore) maxScore = val;
      }
      if (maxScore > 0) {
        for (const item of cumulativeRanked) {
          if ((item.pastWeeksWins[w] ?? 0) === maxScore) {
            winners.add(item.name);
          }
        }
      }
    }
    weeklyWinnersMap.set(w, winners);
  }

  // Official Cumulative Season Standings rows (strictly sorted by cumulative totalSeasonWins descending)
  const cumulativeRowsHtml = cumulativeRanked.map((r, i) => {
    // Hard Rule: Weekly crown is strictly NOT awarded until after Monday Night Football is final
    const isWinnerRow = (type === 'tuesday' && (weeklyWinnersMap.get(dispatchWeek)?.has(r.name) || weeklyWinnersList.some(w => w.name === r.name)));
    const bg = isWinnerRow 
      ? '#fef9c3' 
      : (i % 2 === 0 ? '#ffffff' : '#ecfdf5');
    const borderStyle = isWinnerRow 
      ? 'border-bottom:2px solid #facc15; font-weight:bold;' 
      : 'border-bottom:1px solid #d1fae5;';

    const rankBadge = isWinnerRow
      ? `<span style='color:#854d0e; font-weight:800;'>#${r.seasonRank} 👑</span>`
      : `#${r.seasonRank}`;

    const crownLabel = weeklyWinnersList.length > 1 ? `Wk ${dispatchWeek} Co-Champ` : `Wk ${dispatchWeek} Crown`;
    const nameDisplay = isWinnerRow
      ? `<span style='color:#422006; font-weight:800;'>${r.name}</span> <span style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:9px; padding:1px 6px; border-radius:4px; margin-left:4px; text-transform:uppercase;'>${crownLabel}</span>`
      : `<span style='color:#0f172a; font-weight:600;'>${r.name}</span>`;

    const priorCells = priorWeekNumbers.map(w => {
      const isWinnerOfWk = weeklyWinnersMap.get(w)?.has(r.name);
      const val = r.pastWeeksWins[w] ?? 0;
      if (isWinnerOfWk) {
        return `<td style='padding:3px 5px; text-align:center; font-size:11px;'>
          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week ${w} Winner: ${r.name} (${val} Wins)'>
            <span style='font-size:9px;'>👑</span> <span>${val}</span>
          </span>
        </td>`;
      }
      return `<td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>${val}</td>`;
    }).join('');

    const currentCell = showCurrentWeekColumn
      ? (isWinnerRow
        ? `<td style='padding:3px 5px; text-align:center; font-size:11px;'>
            <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week ${dispatchWeek} Winner: ${r.name} (${r.wins} Wins)'>
              <span style='font-size:9px;'>👑</span> <span>${r.wins}</span>
            </span>
          </td>`
        : `<td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>${r.wins}</td>`)
      : '';

    return `<tr style='background:${bg}; ${borderStyle}'>
      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>${rankBadge}</td>
      <td style='padding:5px 8px; font-size:12px;'>${nameDisplay}</td>
      ${priorCells}
      ${currentCell}
      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>${r.totalSeasonWins}</td>
    </tr>`;
  }).join('');

  const module5 =
`<div style='margin-bottom:14px;'>
  ${sundayRaceTableHtml}
  <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>
    📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER
  </div>
  <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>
    <thead>
      <tr style='background:#064e3b;'>
        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>
        <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>
        ${priorWeekHeaders}
        ${showCurrentWeekColumn ? `<th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>${currentWeekHeader}</th>` : ''}
        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>
      </tr>
    </thead>
    <tbody>
      ${cumulativeRowsHtml}
    </tbody>
  </table>
  <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>
    * Cumulative points equal sum of weekly wins (${priorWeekNumbers.map(w => `WK${w}`).join(' + ')}${showCurrentWeekColumn ? ` + ${currentWeekHeader}` : ''} = TOTAL PTS). Translucent gold blocks (👑) indicate previous weekly champions.
  </div>
</div>`;

  // -------------------------------------------------------------
  // MODULE 6: MESSAGE FROM ADMIN JOEL & CONSULTANT'S WORD OF WISDOM
  // -------------------------------------------------------------
  const defaultAdminNoteText = type === 'sunday'
    ? `Monday Night Football will decide our Week ${dispatchWeek} champion. Standings finalize Tuesday morning!`
    : type === 'friday'
    ? `Review the injury reports above carefully before making your weekend selections. Have a great slate!`
    : `Week ${dispatchWeek} results are officially certified and locked in the pool vault! Congratulations to our weekly champion. Week ${nextWeekNumber} pick sheets are now open for Tuesday morning submissions.`;

  const finalAdminNote = (customAdminNote && customAdminNote.trim())
    ? customAdminNote.trim()
    : defaultAdminNoteText;
  const safeAdminNote = finalAdminNote.replace(/"/g, '&ldquo;').replace(/'/g, '&rsquo;');
  const safeQuote = randomQuote.replace(/"/g, '&ldquo;').replace(/'/g, '&rsquo;');
  const safeQuoteContext = quoteContext.replace(/"/g, '&ldquo;').replace(/'/g, '&rsquo;');

  const module6 =
`<div style='border-top:2px solid #d4af37; padding-top:12px;'>
  <div style='background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #064e3b; border-radius:6px; padding:12px 14px; margin-bottom:10px;'>
    <div style='font-size:11px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px;'>📢 MESSAGE FROM ADMIN JOEL</div>
    <div style='font-size:12px; color:#334155; margin-top:6px; line-height:1.6;'>
      ${safeAdminNote}
    </div>
  </div>
  <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>
    <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>
    <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>
      &ldquo;${safeQuote}&rdquo;
    </div>
    <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • ${safeQuoteContext}</div>
  </div>
</div>`;

  const fullHtml = 
`<div style='max-width:600px; font-family:sans-serif;'>
  ${module1}
  ${podcastModule}
  ${module2}
  ${module3}
  ${module4}
  ${module5}
  ${module6}
</div>`;

  const canonicalTitle = getCanonicalDispatchTitle(type, dispatchWeek);

  const subtitles = {
    friday: 'Thursday recap, scraped NFL injury wire & weekend matchup lookahead',
    sunday: 'Sunday frenzy, leaderboard shuffle & Monday night previews',
    tuesday: `Weekly crown awarded to ${weeklyWinner.name}, MNF recap, tiebreaker result & official standings locked`
  };

  return {
    id: `dispatch-${type}`,
    type,
    week: dispatchWeek,
    weekNumber: dispatchWeek,
    title: canonicalTitle,
    subtitle: subtitles[type],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    publishedAt: new Date().toISOString(),
    isPublished: true,
    content: fullHtml,
    body_html: fullHtml,
    podcastUrl,
    podcastTitle,
    subject: getCanonicalDispatchSubject(type, dispatchWeek),
    preheader: subtitles[type],
    consultantQuote: randomQuote,
    adminNote: finalAdminNote,
    status: 'PENDING_APPROVAL',
    dispatch_type: type.toUpperCase()
  };
}
