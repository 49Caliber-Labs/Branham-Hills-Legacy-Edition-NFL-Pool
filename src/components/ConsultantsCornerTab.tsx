import React, { memo } from 'react';
import { 
  Award, 
  Shield, 
  Scale, 
  Smile, 
  Trophy,
  History,
  Mail,
  Sliders
} from 'lucide-react';
import { ElvisBadge } from './ElvisBadge';
import { getPoolConfig, getEditionLabel } from '../config/leagueConfig';

export const ConsultantsCornerTab: React.FC = memo(() => {
  const poolConfig = getPoolConfig();
  const showLore = poolConfig.rules.enableLoreAndQuotes && poolConfig.editionTier !== 'opensource';

  const tiebreakerLabel =
    poolConfig.rules.tiebreakerRule === 'closest_without_going_over'
      ? 'Price Is Right Rule (Closest Without Going Over)'
      : 'Closest Total Combined MNF Points (Over or Under) • Exact Tie Crowns Co-Champions';

  const missedPickLabel =
    poolConfig.rules.missedPickRule === 'no_autofill_zero'
      ? 'Hard Lockout (Unsubmitted Picks Lock as 0 pts at Kickoff)'
      : poolConfig.rules.missedPickRule === 'vegas_autofill_equal_standing'
        ? 'Vegas Favorite Kickoff Autofill (Equal Podium Standing)'
        : 'Vegas Favorite Kickoff Autofill (Manual Submissions Hold Podium Priority on Ties)';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Hero Tribute Card */}
      <div 
        className="text-white rounded-2xl p-6 sm:p-8 shadow-md border-2 transition-colors"
        style={{ 
          background: 'linear-gradient(to bottom right, var(--theme-header-bg, #1b3a2b), var(--theme-primary, #142d21))',
          borderColor: 'var(--theme-border-accent, #064e3b)'
        }}
      >
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b"
          style={{ borderColor: 'var(--theme-border-accent, rgba(16, 185, 129, 0.4))' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-[#1b3a2b] flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-inner shrink-0">
              ⚾
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Branham Hills Legacy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                The Consultant’s Corner
              </h2>
              <p className="text-emerald-200 text-sm font-medium">
                In Honor of Don Threet • Commissioner Emeritus & The Administration
              </p>
            </div>
          </div>

          <div 
            className="text-left sm:text-right p-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-card-bg, rgba(6, 78, 59, 0.6))',
              borderColor: 'var(--theme-border-accent, #047857)'
            }}
          >
            <div className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--theme-accent, #6ee7b7)' }}>
              The Administration
            </div>
            <div className="text-sm font-bold text-white">Don: The Consultant</div>
            <div className="text-xs opacity-90">Joel: The Admin</div>
          </div>
        </div>

        {/* The 40-Year Origin Story */}
        <div className="space-y-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal">
          <p>
            For forty consecutive seasons, this football pool has connected community, little league alumni, lifelong friends, and three generations of family.
          </p>
          <p>
            The pool grew out of community service and good friends lending a hand. When Branham Hills Little League needed leadership, Don stepped in alongside friend and league parent Lanny to help guide the league as co-presidents, backed by a tireless group of dedicated parents and volunteers. A few years later, Rudy stepped up to take the reins, continuing that shared tradition of keeping youth sports thriving for the kids.
          </p>
          <p>
            Long after their own kids had outgrown little league, Don, Rudy, and other longtime volunteers stayed involved where help was needed most—stepping onto the diamond as volunteer umpires for Little League and Senior League games across the community for more than two decades.
          </p>
          <p>
            To bring everyone together across football season and celebrate lasting friendships, they started this friendly football pool. This pool has always been 100% free-to-play, where the weekly prize is the best one known to mankind: <strong>bragging rights</strong>.
          </p>
          <p>
            This pool stands as a tribute to Don, Rudy, Lanny, Keith, Richard, Robert, and all the volunteers who gave so much of their time to the community. The lasting friendships made along the way are what keep this tradition alive season after season.
          </p>
          <p 
            className="italic p-3.5 rounded-xl border text-white font-medium"
            style={{
              backgroundColor: 'var(--theme-card-bg, rgba(6, 78, 59, 0.5))',
              borderColor: 'var(--theme-border, #047857)'
            }}
          >
            A very special thank you and loving tribute to our friends Eric and Cady, remembered and toasted often in stories told Sunday mornings at the doughnut shop, Monday nights at Mountain Mike&rsquo;s, and around the poker table. Friends forever.
          </p>

          <div 
            className="p-4 rounded-xl border text-sm mt-4"
            style={{
              backgroundColor: 'var(--theme-card-bg, rgba(6, 78, 59, 0.7))',
              borderColor: 'var(--theme-border-accent, #047857)'
            }}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1" style={{ color: 'var(--theme-accent, #fbbf24)' }}>
              <Shield className="w-4 h-4" />
              <span>Retirement of the Title</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100">
              With Don stepping down after 40 seasons, <strong>the title of &ldquo;The Commissioner&rdquo; is officially retired forever</strong>. There will never be another. Don continues to oversee the pool as <strong>The Consultant</strong>, while his son Joel manages day-to-day operations as <strong>The Admin</strong> (together known as <strong>The Administration</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Official Pool Rules (Don’s Code) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Scale className="w-5 h-5 text-emerald-800" />
          <h3 className="text-lg font-bold text-slate-900">
            The Official Pool Rules (Don’s Code)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>1. Straight Up Winners (No Spread)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every game, every week. You pick the outright winner. <strong>1 point</strong> for each winning pick, 0 points for a loss. No point spreads to argue about.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>2. Monday Night Tiebreaker (First Place Only)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Along with your picks, predict the combined total points scored by both teams in the Monday Night Football game. The tiebreaker applies <strong>strictly to break a tie for 1st place rank</strong> for the week (not to all players). Contenders receive <strong>0 points</strong> for winning the tiebreaker—all contender scores remain consistent with actual wins and losses. The winner receives official acknowledgement of the tiebreaker in the Tuesday Dispatch as the weekly winner.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>3. Individual Game Lockout</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Picks lock strictly at the scheduled kickoff of each individual game. You can modify your picks for any upcoming game right up until the opening whistle.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>4. The Honor System &amp; Zero-Wagering Charter</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This pool runs strictly on family, honor, and mutual respect. 100% free-to-play for entertainment and bragging rights only—no entry fees, purses, or wagering.
            </p>
          </div>
        </div>
      </div>

      {/* Active Pool Governance & Rule Variances */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Pool Governance &amp; Rule Variances
            </h3>
            <p className="text-xs text-slate-500">
              {getEditionLabel(poolConfig.editionTier)} • Free Updates • Zero Ads Ever
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="font-bold text-slate-900 mb-1">Monday Night Tiebreaker Rule</div>
            <p className="text-slate-600">{tiebreakerLabel}</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="font-bold text-slate-900 mb-1">Missed-Pick / Kickoff Policy</div>
            <p className="text-slate-600">{missedPickLabel}</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="font-bold text-slate-900 mb-1">Autonomous Vegas Bot</div>
            <p className="text-slate-600">
              {poolConfig.enableHouseBot ? `Enabled (${poolConfig.houseBotName})` : 'Disabled (Human Contenders Only)'}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="font-bold text-slate-900 mb-1">Penalty / Citation Jar</div>
            <p className="text-slate-600">
              {poolConfig.rules.enablePenaltyJar
                ? `${poolConfig.rules.penaltyJarTitle} (Tracked in ${poolConfig.rules.penaltyUnitPlural}, Zero Monetary Value)`
                : 'Disabled'}
            </p>
          </div>
        </div>
      </div>

      {showLore && (
      <>
      {/* The Story of Elvis */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕶️</span>
            <h3 className="text-lg font-bold text-amber-950">
              The Legend of Elvis in the Pool
            </h3>
          </div>
          <ElvisBadge compact={true} />
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed mb-3">
          Don&rsquo;s best friend, fellow umpire, and Little League alumni <strong>Rudy</strong> started buying a spot for <strong>Elvis</strong> every single season because both Rudy and Don are fanatical Elvis devotees.
        </p>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          When Don noticed Rudy was giving Elvis identical picks to his own, Don laid down the law: <em>&ldquo;Rudy, you gotta give Elvis different picks, otherwise it&rsquo;s just a wash!&rdquo;</em> From that day forward, Elvis officially receives an independent weekly slate of picks to keep the entire pool honest!
        </p>
      </div>

      {/* The Consultant's Unfiltered Decrees & Authentic Quotes (2011–2026) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Smile className="w-5 h-5 text-emerald-800" />
          <h3 className="text-lg font-bold text-slate-900">
            Don’s Unfiltered Decrees & Authentic Quotes (2011–2026)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: '2017 Rules Warning • Mascot Ban',
              quote: 'DO NOT USE MASCOTS! City, State, or Region only....I have spoken! Teams have moved: you must list LA Rams or LA Chargers. There is NO team in St Louis! Count Count Count....I say this EVERY season!'
            },
            {
              label: '2012 Citation Memo • Objection Rule',
              quote: 'Clarification: Any OBJECTION earns a Penalty Flag in the Umpire Jar! I have spoken!'
            },
            {
              label: '2016 Week 8 • The Secret (ASTPW)',
              quote: 'Annual Secret To Picking Winners, also known as: ASTPW! Use the SJ Mercury Newspaper Latest Line!'
            },
            {
              label: '2017 Week 3 • Count Chocula',
              quote: "Folks still missing picks...count count count... I'm not talking about Count Chocula!"
            },
            {
              label: '2017 Week 10 • Lanny’s Eruption',
              quote: "LANNY IS PERFECT, PICKED ALL 14!!!!! Lanny was volcano hot this week! 14 games, 14 winners! ... a few high 80's and the rest of us need a Lanny Eruption to catch up, that's not ketchup!"
            },
            {
              label: '2017 Final Dispatch • Grandchild Pride',
              quote: "Son Joel picked 14 winners! To end the season! His son Jordan, my grandson, and Trevor also my grandson, picked 13 winners each! Ain't my grandsons GRAND!"
            },
            {
              label: '2017 Week 14 & Week 12 • Cellar Patrol Roasts',
              quote: 'If you need sticky to pick winners....try some super glue....a win just might stick on you! For those below the line...you can join Elvis in that big Gold Record in the sky!'
            },
            {
              label: '2018 Week 10 • Winners Walk, Losers Stalk',
              quote: 'Bunching up...from 90 to 85...12 players in the scrum! Great competition! Winners Walk, Losers Stalk!'
            }
          ].map((item, idx) => (
            <blockquote
              key={idx}
              className="p-3.5 bg-slate-50 border-l-4 rounded-r-xl text-xs sm:text-sm text-slate-700"
              style={{ borderLeftColor: 'var(--theme-primary, #047857)' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                {item.label}
              </div>
              <p className="italic">&ldquo;{item.quote}&rdquo;</p>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Chronological Season Email Vault (2011–2021) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Mail className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Chronological Season Email Vault (2011–2021)
            </h3>
            <p className="text-xs text-slate-500">
              Recovered directly from {poolConfig.consultantName}&rsquo;s historic league archives
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2011 • The Year of &ldquo;Rudymania&rdquo;</div>
            <p className="text-slate-600 leading-relaxed">
              Co-founder <strong>Rudy Perez</strong> held the #1 spot on the master leaderboard for all 17 consecutive weeks. Don certified: <em>&ldquo;2011 will be forever known as Rudymania; Won Wire to Wire! 17 weeks in a row!&rdquo;</em>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2012 • &ldquo;Jessepaloosa&rdquo; &amp; Timestamped Proof</div>
            <p className="text-slate-600 leading-relaxed">
              Jessica took all home teams in Week 2 (13-of-15) and led the pool through Week 6&rsquo;s <em>&ldquo;Jessepaloosa&rdquo;</em> run. When MNF banter questioned Don adjusting her sheet, Don forwarded her Sun Nov 4 8:50 AM email: <em>&ldquo;AnyONE else questions my integrity will immediately become the new Commish! I have spoken!&rdquo;</em> Keith replied Don&rsquo;s football pool integrity was unquestioned—only his politics had room for improvement.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2013 • Call Sign Debates (&ldquo;RWNV Joe&rdquo;)</div>
            <p className="text-slate-600 leading-relaxed">
              Following Opening Week wins for Nick &amp; Don and Week 4&rsquo;s warning protecting daughters Jessica &amp; Jennifer, Don consulted Jessica and Joel on Joe Lichter&rsquo;s pool handle (<em>&ldquo;NM Joe back to WY Joe?&rdquo;</em>)—prompting Joel&rsquo;s suggestion: <em>&ldquo;Roamer, wanderer, nomad, vagabond Joe or &lsquo;RWNV Joe&rsquo;.&rdquo;</em>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2015 • &ldquo;The Rudy Rule&rdquo; &amp; 10-Second Self-Destruct</div>
            <p className="text-slate-600 leading-relaxed">
              Honoring years of hand-typed weekly sheets brought to Mountain Mike&rsquo;s, Don awarded Rudy a 1/16 win per week—along with the deadline warning: <em>&ldquo;If Rudy or any of his MNF Cronies are caught NOT paying by Oct 1st, this email and all of its contents will self destruct in 10 seconds!&rdquo;</em>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2017 • Lanny&rsquo;s Eruption (14-0) &amp; Perfect 16 Christmas</div>
            <p className="text-slate-600 leading-relaxed">
              Lanny Ross swept a 14-0 slate in Week 10 (<em>&ldquo;Lanny was volcano hot this week!&rdquo;</em>), and on Christmas Week 15 grandson <strong>Jordan</strong> and Robert posted perfect 16-0 slates (<em>&ldquo;JimmeyG, JimmeyG and to all.....a JimmeyG!&rdquo;</em>) on Don&rsquo;s road to his first overall championship in over 10 years.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">2018–2021 • Kickoff Poem &amp; &ldquo;Mr. Football&rdquo;</div>
            <p className="text-slate-600 leading-relaxed">
              Don opened 2018 with his Mountain Mike&rsquo;s kickoff rhyme (<em>&ldquo;Pay on time, Picks on time... And I will be fine!&rdquo;</em>), and <strong>Juan Vargas</strong> dominated Wire-to-Wire to earn the title <em>&ldquo;Mr. Football&rdquo;</em> and the inaugural Branham Hills Yellow Jacket at Mina Pruneda&rsquo;s Championship Sunday banquet, before Oakridge Round Table &amp; the 2021 digital transition.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Championships & Era Highlights Ledger (2011–2026) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Trophy className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Historical Championships &amp; Era Highlights (2011–2026)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950 text-amber-200 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 rounded-tl-lg">Era / Season</th>
                <th className="py-2.5 px-3">Overall Champion</th>
                <th className="py-2.5 px-3 rounded-tr-lg">Key Highlights &amp; Defining Lore</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {[
                { era: '2011', champ: 'Rudy Perez', lore: '"Rudymania" — 17 consecutive weeks in 1st place (wire-to-wire).' },
                { era: '2012', champ: 'Rudy Perez', lore: 'Back-to-back title; Jessica’s "Jessepaloosa" 13-home-win run; Delano Ct banquet.' },
                { era: '2016', champ: 'Nick Habian / Don Threet', lore: 'Nick’s 4 weekly wins; ASTPW SJ Mercury Newspaper line strategy.' },
                { era: '2017', champ: 'Don Threet ("The Commish")', lore: 'First Commish title in 10+ years; Lanny’s 14-0 Eruption; Jordan & Robert 16-0 perfect Christmas slate.' },
                { era: '2018', champ: 'Juan Vargas ("Mr. Football")', lore: 'Wire-to-wire dominance; official "Mr. Football" decree; Yellow Jacket presentation.' },
                { era: '2026 (40th)', champ: 'The Administration', lore: 'Title retired in honor of Don Threet; Joel Threet manages 40th Anniversary App.' }
              ].map((row) => (
                <tr key={row.era} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-emerald-900 whitespace-nowrap">{row.era}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{row.champ}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.lore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
});
