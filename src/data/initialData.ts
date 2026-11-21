import { Game, Player, PlayerPickData, WeeklyDispatch, ChatMessage, FineItem, SeasonHistory } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  {
    "id": "joel",
    "name": "Joel",
    "email": "admin@example.com",
    "role": "admin",
    "tagline": "The Admin • Son of the Commish",
    "isActive": true
  },
  {
    "id": "don",
    "name": "Don",
    "email": "consultant@example.com",
    "role": "consultant",
    "tagline": "The Consultant • Commissioner for Life 👑",
    "hasHandwrittenPicks": true,
    "isActive": true
  },
  {
    "id": "rudy",
    "name": "Rudy",
    "email": "rudy@example.com",
    "role": "player",
    "tagline": "Rudymania 2011 Wire-to-Wire Legend • Elvis Sponsor",
    "hasHandwrittenPicks": true,
    "isActive": true
  },
  {
    "id": "brian",
    "name": "Brian",
    "email": "brian@example.com",
    "role": "player",
    "isDefendingChamp": true,
    "tagline": "🏆 Defending Champion",
    "isActive": true
  },
  {
    "id": "jessica",
    "name": "Jessica",
    "email": "jessica@example.com",
    "role": "player",
    "tagline": "Daughter of the Commish • 2012 Week 2 Champ",
    "isActive": true
  },
  {
    "id": "trevor",
    "name": "Trevor",
    "email": "trevor@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": true
  },
  {
    "id": "lanny",
    "name": "Lanny",
    "email": "lanny@example.com",
    "role": "player",
    "tagline": "Co-Founder & Branham Veteran",
    "hasHandwrittenPicks": true,
    "isActive": true
  },
  {
    "id": "jennifer",
    "name": "Jennifer",
    "email": "jennifer@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": true
  },
  {
    "id": "marcio",
    "name": "Marcio",
    "email": "marcio@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": true
  },
  {
    "id": "tyler",
    "name": "Tyler",
    "email": "tyler@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": true
  },
  {
    "id": "elvis",
    "name": "Elvis",
    "email": "elvis.presley@poollegend.com",
    "role": "player",
    "isElvis": true,
    "tagline": "Honorary Permanent Member • Rudy Sponsored",
    "isActive": true
  },
  {
    "id": "jordan",
    "name": "Jordan",
    "email": "jordan@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": true
  },
  {
    "id": "jeff",
    "name": "Jeff",
    "email": "jeff@example.com",
    "role": "player",
    "tagline": "Son of the Commish • 2012 Week 1 Champ",
    "isActive": false
  },
  {
    "id": "richard",
    "name": "Richard",
    "email": "richard@example.com",
    "role": "player",
    "tagline": "Die-Hard Rams Fan",
    "isActive": false
  },
  {
    "id": "christine",
    "name": "Christine",
    "email": "christine@example.com",
    "role": "player",
    "tagline": "Contender • Confirmed Out",
    "isActive": false
  },
  {
    "id": "nick",
    "name": "Nick",
    "email": "nick@example.com",
    "role": "player",
    "tagline": "Certified Cheese Head & 49ers Skeptic",
    "isActive": false
  },
  {
    "id": "robert",
    "name": "Robert",
    "email": "robert@example.com",
    "role": "player",
    "tagline": "Pool Veteran",
    "isActive": false
  },
  {
    "id": "kristine",
    "name": "Kristine",
    "email": "kristine@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": false
  },
  {
    "id": "keith",
    "name": "Keith",
    "email": "keith@example.com",
    "role": "player",
    "tagline": "Lone Wolf Detroit Picker",
    "hasHandwrittenPicks": true,
    "isActive": false
  },
  {
    "id": "juan",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "player",
    "tagline": "Contender",
    "isActive": false
  }
];

export const INITIAL_GAMES: Game[] = [
  {
    "gameNumber": 1,
    "week": 7,
    "awayTeam": "New England Patriots",
    "homeTeam": "Chicago Bears",
    "awayRecord": "4-2",
    "homeRecord": "4-2",
    "spread": "CHI -3",
    "favorite": "Chicago Bears",
    "overUnder": 50.5,
    "day": "Thu",
    "kickoffTime": "5:15 PM",
    "kickoffIso": "2026-10-23T00:15Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": true,
    "isSNF": false
  },
  {
    "gameNumber": 2,
    "week": 7,
    "awayTeam": "Pittsburgh Steelers",
    "homeTeam": "New Orleans Saints",
    "awayRecord": "4-2",
    "homeRecord": "2-4",
    "spread": "PIT -3.5",
    "favorite": "Pittsburgh Steelers",
    "overUnder": 44.5,
    "day": "Sun",
    "kickoffTime": "6:30 AM",
    "kickoffIso": "2026-10-25T13:30Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 3,
    "week": 7,
    "awayTeam": "San Francisco 49ers",
    "homeTeam": "Atlanta Falcons",
    "awayRecord": "6-0",
    "homeRecord": "2-4",
    "spread": "SF -3",
    "favorite": "San Francisco 49ers",
    "overUnder": 49.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 4,
    "week": 7,
    "awayTeam": "Cleveland Browns",
    "homeTeam": "Tennessee Titans",
    "awayRecord": "4-2",
    "homeRecord": "1-5",
    "spread": "CLE -1.5",
    "favorite": "Cleveland Browns",
    "overUnder": 38.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 5,
    "week": 7,
    "awayTeam": "Indianapolis Colts",
    "homeTeam": "Minnesota Vikings",
    "awayRecord": "2-4",
    "homeRecord": "5-0",
    "spread": "MIN -6.5",
    "favorite": "Minnesota Vikings",
    "overUnder": 41.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 6,
    "week": 7,
    "awayTeam": "Miami Dolphins",
    "homeTeam": "New York Jets",
    "awayRecord": "0-5",
    "homeRecord": "2-4",
    "spread": "NYJ -4.5",
    "favorite": "New York Jets",
    "overUnder": 38.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 7,
    "week": 7,
    "awayTeam": "Tampa Bay Buccaneers",
    "homeTeam": "Carolina Panthers",
    "awayRecord": "1-5",
    "homeRecord": "3-2",
    "spread": "CAR -3.5",
    "favorite": "Carolina Panthers",
    "overUnder": 44.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 8,
    "week": 7,
    "awayTeam": "Cincinnati Bengals",
    "homeTeam": "Baltimore Ravens",
    "awayRecord": "3-2",
    "homeRecord": "4-2",
    "spread": "BAL -3",
    "favorite": "Baltimore Ravens",
    "overUnder": 51.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 9,
    "week": 7,
    "awayTeam": "New York Giants",
    "homeTeam": "Houston Texans",
    "awayRecord": "3-2-1",
    "homeRecord": "2-4",
    "spread": "HOU -10",
    "favorite": "Houston Texans",
    "overUnder": 42.5,
    "day": "Sun",
    "kickoffTime": "10:00 AM",
    "kickoffIso": "2026-10-25T17:00Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 10,
    "week": 7,
    "awayTeam": "Denver Broncos",
    "homeTeam": "Arizona Cardinals",
    "awayRecord": "4-2",
    "homeRecord": "2-4",
    "spread": "DEN -4.5",
    "favorite": "Denver Broncos",
    "overUnder": 43.5,
    "day": "Sun",
    "kickoffTime": "1:05 PM",
    "kickoffIso": "2026-10-25T20:05Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 11,
    "week": 7,
    "awayTeam": "Green Bay Packers",
    "homeTeam": "Detroit Lions",
    "awayRecord": "4-2",
    "homeRecord": "3-2",
    "spread": "DET -3",
    "favorite": "Detroit Lions",
    "overUnder": 53.5,
    "day": "Sun",
    "kickoffTime": "1:25 PM",
    "kickoffIso": "2026-10-25T20:25Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 12,
    "week": 7,
    "awayTeam": "Los Angeles Rams",
    "homeTeam": "Las Vegas Raiders",
    "awayRecord": "2-4",
    "homeRecord": "3-3",
    "spread": "LAR -4.5",
    "favorite": "Los Angeles Rams",
    "overUnder": 47.5,
    "day": "Sun",
    "kickoffTime": "1:25 PM",
    "kickoffIso": "2026-10-25T20:25Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 13,
    "week": 7,
    "awayTeam": "Kansas City Chiefs",
    "homeTeam": "Seattle Seahawks",
    "awayRecord": "5-0",
    "homeRecord": "3-3",
    "spread": "SEA -2.5",
    "favorite": "Seattle Seahawks",
    "overUnder": 42.5,
    "day": "Sun",
    "kickoffTime": "5:20 PM",
    "kickoffIso": "2026-10-26T00:20Z",
    "status": "scheduled",
    "isMNF": false,
    "isTNF": false,
    "isSNF": false
  },
  {
    "gameNumber": 14,
    "week": 7,
    "awayTeam": "Dallas Cowboys",
    "homeTeam": "Philadelphia Eagles",
    "awayRecord": "2-4",
    "homeRecord": "2-4",
    "spread": "DAL -4.5",
    "favorite": "Dallas Cowboys",
    "overUnder": 44.5,
    "day": "Mon",
    "kickoffTime": "5:15 PM",
    "kickoffIso": "2026-10-27T00:15Z",
    "status": "scheduled",
    "isMNF": true,
    "isTNF": false,
    "isSNF": false
  }
];

export const INITIAL_PICKS: Record<string, PlayerPickData> = {
  "Joel": {
    "contenderName": "Joel",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Don": {
    "contenderName": "Don",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Rudy": {
    "contenderName": "Rudy",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Brian": {
    "contenderName": "Brian",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Jessica": {
    "contenderName": "Jessica",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Trevor": {
    "contenderName": "Trevor",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Lanny": {
    "contenderName": "Lanny",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Jennifer": {
    "contenderName": "Jennifer",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Marcio": {
    "contenderName": "Marcio",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Tyler": {
    "contenderName": "Tyler",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Elvis": {
    "contenderName": "Elvis",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  },
  "Jordan": {
    "contenderName": "Jordan",
    "picks": {},
    "tiebreaker": "",
    "week": 7
  }
};

export const INITIAL_DISPATCHES: WeeklyDispatch[] = [
  {
    "id": "dispatch-tuesday",
    "type": "tuesday",
    "week": 6,
    "weekNumber": 6,
    "title": "The Weekly Final • Week 6",
    "subtitle": "Weekly crown awarded to Jessica (9-5), MNF recap & official standings locked",
    "timestamp": "12:05 AM",
    "publishedAt": "2026-10-21T10:50:06.106Z",
    "isPublished": true,
    "content": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:14px; font-family:sans-serif;'>\n    <div style='display:inline-block; background:#fbbf24; color:#022c22; font-weight:900; font-size:10px; padding:3px 12px; border-radius:4px; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;'>👑 DISPATCH 3 OF 3: THE WEEKLY FINAL</div>\n    <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n    <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n    <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n    <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n  </div>\n\n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n    <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>THE WEEKLY FINAL • WEEK 6 👑</h2>\n    <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>The final whistle of Monday Night Football has echoed across Levi&rsquo;s Stadium, and Week 6 is officially sealed in the Branham Hills vault! In a primetime showdown for the Faithful, the <strong>San Francisco 49ers</strong> defeated the <strong>Washington Commanders 23&ndash;17</strong> (Combined MNF Total: 40 points) to remain unbeaten at 6&ndash;0. Across an upset-heavy 14-game Week 6 slate where Denver stunned Seattle (17&ndash;14), Cleveland edged Baltimore (13&ndash;10), Tennessee toppled Indianapolis (26&ndash;20), Carolina upset Philadelphia (25&ndash;14), and Arizona shocked the Rams (18&ndash;16), surviving Sunday required nerves of steel.</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Standing tall at the summit and capturing the prestigious <strong>Week 6 Crown outright is Jessica</strong>, who navigated the minefield with a slate-leading <strong>9 outright victories (9&ndash;5, TB: 51)</strong>! Entering Monday Night with a solo 8&ndash;5 lead over chasers Don (7&ndash;6) and Brian (7&ndash;6)—after only Jessica, Don, and Brian had the vision to punch Denver&rsquo;s Thursday night ticket—all 12 contenders across the entire Branham Hills league locked in the <strong>San Francisco 49ers</strong> on Monday Night Football! When the 49ers closed out Washington 23&ndash;17, every contender notched a Monday night victory and Jessica sealed her wire-to-wire solo Week 6 championship!</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Right on the champion&rsquo;s heels, <strong>Don (8&ndash;6, TB: 55)</strong> and <strong>Brian (8&ndash;6, TB: 149)</strong> shared Co-Runner-Up honors on the silver step of the podium. Behind them, a massive six-contender pack deadlocked at <strong>7&ndash;7</strong> (<strong>Rudy, Tyler, Elvis, Jennifer, Jordan, and Trevor</strong>), while <strong>Lanny</strong> and <strong>Marcio</strong> finished at <strong>6&ndash;8</strong>. In the overall season race through 6 weeks, <strong>Rudy (59 wins)</strong> holds a 1-point edge over <strong>Lanny (58 wins)</strong>, with newly crowned Week 6 Champion <strong>Jessica (57 wins)</strong> charging into solo 3rd place just two games off the lead!</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Down at the damp bottom of the Week 6 sheet, your humble Admin <strong>Joel (5&ndash;9, TB: 58)</strong> officially draws solo cellar cleanup duty after backing the wrong side of Sunday&rsquo;s coin-flip upsets. As Don &ldquo;The Commish&rdquo; Threet always put it: <em>&ldquo;Winners Walk, Losers Stalk!&rdquo;</em> One Penalty Flag goes straight into The Umpire Penalty Jar, the chalkboard is wiped clean at midnight, and Week 7 pick sheets are now open for Tuesday morning submissions!</p>\n    </div>\n  </div>\n\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n    <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n      <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>👑 WEEK 6 WEEKLY RACE PODIUM</span>\n      <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Weekly Race Certification</span>\n    </div>\n    <div style='padding:12px 14px;'>\n      <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n        <tr>\n          <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>👑 #1 Weekly Crown</div>\n            <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Jessica</div>\n            <div style='font-size:12px; color:#713f12; font-weight:700;'>9 Wins (9-5)</div>\n            <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>Daughter of the Commish • Outright Wk 6 Champ</div>\n          </td>\n          <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Weekly Runner-Up (2-Way Tie)</div>\n            <div style='font-size:14px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Don</div>\n            <div style='font-size:12px; color:#334155; font-weight:700;'>8 Wins (8-6)</div>\n            <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (2 Contenders Tied)</div>\n          </td>\n          <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n            <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n            <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n            <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (2-way tie at #2 Runner-Up)</div>\n          </td>\n        </tr>\n      </table>\n    </div>\n  </div>\n\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n    <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n      <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>📅 LOOKAHEAD: WEEK 7 BATTLEGROUND</span>\n      <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Opening Lines & Slate Schedule</span>\n    </div>\n    <div style='padding:12px 14px; font-size:12px; color:#064e3b; line-height:1.6;'>\n      • <strong>Fresh Slate:</strong> The ledger resets at midnight after Monday Night Football, and 14 brand new NFL matchups open up in Week 7 (beginning Thursday Night with New England at Chicago).<br/>\n      • <strong>Sheet Distribution:</strong> Blank Week 7 pick sheets are now live and open for Tuesday morning submissions!\n    </div>\n  </div>\n\n  <div style='margin-bottom:14px;'>\n    <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n      📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER (THROUGH WEEK 6)\n    </div>\n    <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n      <thead>\n        <tr style='background:#064e3b;'>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n          <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>59</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>58</td>\n    </tr><tr style='background:#fef9c3; border-bottom:2px solid #facc15; font-weight:bold;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'><span style='color:#854d0e; font-weight:800;'>#3 👑</span></td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#422006; font-weight:800;'>Jessica</span> <span style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:9px; padding:1px 6px; border-radius:4px; margin-left:4px; text-transform:uppercase;'>Wk 6 Crown</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 6 Winner: Jessica (9 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>9</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>57</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>56</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#7</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>54</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>53</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>50</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>50</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#11</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr>\n      </tbody>\n    </table>\n    <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n      * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 = TOTAL PTS). Translucent gold blocks (👑) indicate weekly champions.\n    </div>\n  </div>\n\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n    <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n      <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n      <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n        Week 6 results are officially certified and locked in the pool vault! Congratulations to our Week 6 Champion Jessica (9-5). Week 7 pick sheets are now open for Tuesday morning submissions.\n      </div>\n    </div>\n    <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n      <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n      <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n        &ldquo;Bunching up...from 90 to 85...12 players in the scrum! Great competition! Winners Walk, Losers Stalk!&rdquo;\n      </div>\n      <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2018 Week 10 Dispatch</div>\n    </div>\n  </div>\n</div>",
    "body_html": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:14px; font-family:sans-serif;'>\n    <div style='display:inline-block; background:#fbbf24; color:#022c22; font-weight:900; font-size:10px; padding:3px 12px; border-radius:4px; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;'>👑 DISPATCH 3 OF 3: THE WEEKLY FINAL</div>\n    <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n    <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n    <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n    <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n  </div>\n\n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n    <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>THE WEEKLY FINAL • WEEK 6 👑</h2>\n    <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>The final whistle of Monday Night Football has echoed across Levi&rsquo;s Stadium, and Week 6 is officially sealed in the Branham Hills vault! In a primetime showdown for the Faithful, the <strong>San Francisco 49ers</strong> defeated the <strong>Washington Commanders 23&ndash;17</strong> (Combined MNF Total: 40 points) to remain unbeaten at 6&ndash;0. Across an upset-heavy 14-game Week 6 slate where Denver stunned Seattle (17&ndash;14), Cleveland edged Baltimore (13&ndash;10), Tennessee toppled Indianapolis (26&ndash;20), Carolina upset Philadelphia (25&ndash;14), and Arizona shocked the Rams (18&ndash;16), surviving Sunday required nerves of steel.</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Standing tall at the summit and capturing the prestigious <strong>Week 6 Crown outright is Jessica</strong>, who navigated the minefield with a slate-leading <strong>9 outright victories (9&ndash;5, TB: 51)</strong>! Entering Monday Night with a solo 8&ndash;5 lead over chasers Don (7&ndash;6) and Brian (7&ndash;6)—after only Jessica, Don, and Brian had the vision to punch Denver&rsquo;s Thursday night ticket—all 12 contenders across the entire Branham Hills league locked in the <strong>San Francisco 49ers</strong> on Monday Night Football! When the 49ers closed out Washington 23&ndash;17, every contender notched a Monday night victory and Jessica sealed her wire-to-wire solo Week 6 championship!</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Right on the champion&rsquo;s heels, <strong>Don (8&ndash;6, TB: 55)</strong> and <strong>Brian (8&ndash;6, TB: 149)</strong> shared Co-Runner-Up honors on the silver step of the podium. Behind them, a massive six-contender pack deadlocked at <strong>7&ndash;7</strong> (<strong>Rudy, Tyler, Elvis, Jennifer, Jordan, and Trevor</strong>), while <strong>Lanny</strong> and <strong>Marcio</strong> finished at <strong>6&ndash;8</strong>. In the overall season race through 6 weeks, <strong>Rudy (59 wins)</strong> holds a 1-point edge over <strong>Lanny (58 wins)</strong>, with newly crowned Week 6 Champion <strong>Jessica (57 wins)</strong> charging into solo 3rd place just two games off the lead!</p>\n      <p style='margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;'>Down at the damp bottom of the Week 6 sheet, your humble Admin <strong>Joel (5&ndash;9, TB: 58)</strong> officially draws solo cellar cleanup duty after backing the wrong side of Sunday&rsquo;s coin-flip upsets. As Don &ldquo;The Commish&rdquo; Threet always put it: <em>&ldquo;Winners Walk, Losers Stalk!&rdquo;</em> One Penalty Flag goes straight into The Umpire Penalty Jar, the chalkboard is wiped clean at midnight, and Week 7 pick sheets are now open for Tuesday morning submissions!</p>\n    </div>\n  </div>\n\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n    <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n      <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>👑 WEEK 6 WEEKLY RACE PODIUM</span>\n      <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Weekly Race Certification</span>\n    </div>\n    <div style='padding:12px 14px;'>\n      <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n        <tr>\n          <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>👑 #1 Weekly Crown</div>\n            <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Jessica</div>\n            <div style='font-size:12px; color:#713f12; font-weight:700;'>9 Wins (9-5)</div>\n            <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>Daughter of the Commish • Outright Wk 6 Champ</div>\n          </td>\n          <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Weekly Runner-Up (2-Way Tie)</div>\n            <div style='font-size:14px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Don</div>\n            <div style='font-size:12px; color:#334155; font-weight:700;'>8 Wins (8-6)</div>\n            <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (2 Contenders Tied)</div>\n          </td>\n          <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n            <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n            <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n            <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n            <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (2-way tie at #2 Runner-Up)</div>\n          </td>\n        </tr>\n      </table>\n    </div>\n  </div>\n\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n    <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n      <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>📅 LOOKAHEAD: WEEK 7 BATTLEGROUND</span>\n      <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Opening Lines & Slate Schedule</span>\n    </div>\n    <div style='padding:12px 14px; font-size:12px; color:#064e3b; line-height:1.6;'>\n      • <strong>Fresh Slate:</strong> The ledger resets at midnight after Monday Night Football, and 14 brand new NFL matchups open up in Week 7 (beginning Thursday Night with New England at Chicago).<br/>\n      • <strong>Sheet Distribution:</strong> Blank Week 7 pick sheets are now live and open for Tuesday morning submissions!\n    </div>\n  </div>\n\n  <div style='margin-bottom:14px;'>\n    <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n      📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER (THROUGH WEEK 6)\n    </div>\n    <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n      <thead>\n        <tr style='background:#064e3b;'>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n          <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6</th>\n          <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>59</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>58</td>\n    </tr><tr style='background:#fef9c3; border-bottom:2px solid #facc15; font-weight:bold;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'><span style='color:#854d0e; font-weight:800;'>#3 👑</span></td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#422006; font-weight:800;'>Jessica</span> <span style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:9px; padding:1px 6px; border-radius:4px; margin-left:4px; text-transform:uppercase;'>Wk 6 Crown</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 6 Winner: Jessica (9 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>9</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>57</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>56</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#7</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>54</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>53</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>50</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>50</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#11</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr>\n      </tbody>\n    </table>\n    <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n      * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 = TOTAL PTS). Translucent gold blocks (👑) indicate weekly champions.\n    </div>\n  </div>\n\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n    <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n      <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n      <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n        Week 6 results are officially certified and locked in the pool vault! Congratulations to our Week 6 Champion Jessica (9-5). Week 7 pick sheets are now open for Tuesday morning submissions.\n      </div>\n    </div>\n    <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n      <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n      <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n        &ldquo;Bunching up...from 90 to 85...12 players in the scrum! Great competition! Winners Walk, Losers Stalk!&rdquo;\n      </div>\n      <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2018 Week 10 Dispatch</div>\n    </div>\n  </div>\n</div>",
    "subject": "[Branham Hills Pool: Legacy Edition] 🏈 The Weekly Final • Week 6",
    "preheader": "Jessica captures the Week 6 Crown outright with 9 wins! Full Weeks 1-6 standings inside.",
    "consultantQuote": "Bunching up...from 90 to 85...12 players in the scrum! Great competition! Winners Walk, Losers Stalk!",
    "status": "pending",
    "dispatch_type": "TUESDAY"
  },
  {
    "id": "dispatch-sunday",
    "type": "sunday",
    "week": 6,
    "weekNumber": 6,
    "title": "Sunday Night Live • Week 6",
    "subtitle": "Sunday frenzy, leaderboard shuffle & Monday night previews",
    "timestamp": "09:05 PM",
    "publishedAt": "2026-10-20T21:05:03.449Z",
    "isPublished": true,
    "content": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:16px; font-family:sans-serif;'>\n  <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n  <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n  <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n  <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n</div>\n  \n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n  <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>SUNDAY NIGHT LIVE • WEEK 6</h2>\n  <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'><p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nBlow the whistle and audit the tape, because Week 6 opened with pure gridiron carnage and never looked back. The tone was set Thursday night when Denver ambushed Seattle 17-14—a collective gut punch that left every single submitted pick in the dirt, saddling <strong>Elvis</strong> and the entire pool with an opening donut. But while Thursday was a universal penalty flag, Sunday became a masterclass in attrition. Standing solo atop the summit heading into Monday Night Football is <strong>Elvis</strong> at <strong>6-7</strong>. Navigating a Sunday slate littered with red-zone turnovers, missed chip-shots, and back-door covers, Elvis took the punishment and emerged as the only competitor on the board to navigate through the chaos and bank positive tallies.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nFrom an officiating standpoint, the ledger requires no late review: <strong>Elvis has mathematically clinched the Week 6 title</strong> before Monday Night Football even kicks off. With an insurmountable six-game cushion, the silver chase has dissolved into an outright audit of the league basement. In four decades of reviewing cards, the crew has rarely witnessed an eleven-way logjam at the bottom: reigning Week 5 kingpin <strong>Rudy</strong>, co-runner up <strong>Lanny</strong>, alongside <strong>Jennifer</strong>, <strong>Jessica</strong>, <strong>Marcio</strong>, <strong>Trevor</strong>, <strong>Don</strong>, <strong>Joel</strong>, <strong>Tyler</strong>, <strong>Brian</strong>, and <strong>Jordan</strong> are all locked at <strong>0-13</strong>. That isn't just a cold afternoon; that is an all-out picking blackout. Every single one of you on zero-win patrol is officially cited into The Umpire Penalty Jar for collective chalk-eating, lack of preparation, and dereliction of straight-up picking duties. Feed the jar on your way out.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nAll eyes now turn to Levi's Stadium as the San Francisco 49ers (-7.5) host the Washington Commanders. For the Red & Gold Faithful, this is a business trip: control the trenches, execute clean tackling in space, and leave no doubt under the Monday night lights. In the 2018 archives, Don \"The Commish\" Threet once rallied the league with his classic decree: <em>\"BIG NEWS FLASH.... THE LEADER IS SLIPPING! only got 7... I'm only 3 behind! Coming after you!\"</em> Unfortunately for the chasing herd this week, Elvis isn't slipping at all—his trophy is already signed, sealed, and audited, leaving the remaining eleven contenders to fight over pride and a single solitary point. Settle in, watch the 49ers handle business, and let's close out Week 6 in style.\n</p></div>\n</div>\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>⭐ WEEK 6 SUNDAY RACE LEADERS (HEADING INTO MNF)</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Current Week Sunday Race • Straight-Up Outright Wins</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n      <tr>\n        <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>⭐ #1 Sunday Leader</div>\n          <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Elvis</div>\n          <div style='font-size:12px; color:#713f12; font-weight:700;'>6 Wins (6-7)</div>\n          <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>The King • Rudy Sponsored</div>\n        </td>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Sunday Chasers (11-Way Tie)</div>\n          <div style='font-size:13px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Don • Jennifer • Jessica • Joel • Jordan • Lanny • Marcio • Rudy • Trevor • Tyler</div>\n          <div style='font-size:12px; color:#334155; font-weight:700;'>0 Wins (0-13)</div>\n          <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (11 Contenders Tied)</div>\n        </td>\n        <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n          <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n          <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n          <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (11-way tie at #2 Runner-Up)</div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n  \n<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 MONDAY NIGHT FOOTBALL FORECAST & CONTENDER SHOWDOWN</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>The Week 6 Decider</span>\n  </div>\n  <div style='padding:14px;'>\n    <div style='background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:12px; margin-bottom:12px;'>\n      <div style='font-size:10px; font-weight:800; color:#0f766e; text-transform:uppercase; letter-spacing:1px;'>⭐ PRIMETIME SHOWDOWN & SPREAD</div>\n      <div style='font-size:15px; font-weight:800; color:#064e3b; margin:4px 0;'>Washington Commanders at San Francisco 49ers</div>\n      <div style='font-size:11px; color:#475569;'>Kickoff: 5:15 PM • Line: San Francisco 49ers (SF -7.5)</div>\n    </div>\n\n    <table style='width:100%; border-collapse:separate; border-spacing:8px; margin-bottom:12px;'>\n      <tr>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>\n          <div style='font-size:11px; font-weight:800; color:#1e293b; text-transform:uppercase;'>RIDING WASHINGTON COMMANDERS:</div>\n          <div style='font-size:11px; color:#334155; margin-top:4px; line-height:1.5;'>\n            None locked in yet\n          </div>\n        </td>\n        <td style='background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>\n          <div style='font-size:11px; font-weight:800; color:#065f46; text-transform:uppercase;'>RIDING SAN FRANCISCO 49ERS:</div>\n          <div style='font-size:11px; color:#047857; margin-top:4px; line-height:1.5;'>\n            Elvis\n          </div>\n        </td>\n      </tr>\n    </table>\n\n    <div style='font-size:12px; color:#334155; line-height:1.6;'>\n      <strong>⚡ The Finale:</strong> Tonight's final whistle determines our Week 6 Weekly Champion! If contenders finish tied for 1st place in outright weekly wins, the Monday Night combined points tiebreaker crowns the champion.\n    </div>\n  </div>\n</div>\n  <div style='margin-bottom:14px;'>\n  \n    <div style='margin-bottom:16px;'>\n      <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n        🏈 WEEK 6 SUNDAY RACE STANDINGS (HEADING INTO MNF)\n      </div>\n      <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n        <thead>\n          <tr style='background:#064e3b;'>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>WK RK</th>\n            <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>CONTENDER</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN WINS</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN LOSSES</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>MNF PICK</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>TIEBREAKER</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'><span style='color:#854d0e; font-weight:800;'>#1 ⭐</span></td>\n        <td style='padding:5px 8px; font-size:12px;'><strong style='color:#064e3b;'>Elvis</strong></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>6</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>7</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>53</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr>\n        </tbody>\n      </table>\n      <div style='background:#f0fdf4; padding:5px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n        * Straight-up wins on completed Sunday games. Monday Night Football winner decides weekly champion. MNF tiebreaker delta strictly breaks 1st-place weekly deadlocks.\n      </div>\n    </div>\n  <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n    📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#064e3b;'>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n        <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6 (SUN)</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>45</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>44</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#11</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>42</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>41</td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 (SUN) = TOTAL PTS). Translucent gold blocks (👑) indicate previous weekly champions.\n  </div>\n</div>\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n  <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n    <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n    <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n      Monday Night Football will decide our Week 6 champion. Standings finalize Tuesday morning!\n    </div>\n  </div>\n  <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n    <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n    <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n      &ldquo;BIG NEWS FLASH....JUAN IS SLIPPING! only got 7...and Tenn for MNF. I&rsquo;m only 3 behind! Coming after you Juan!&rdquo;\n    </div>\n    <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2018 Week 15 Dispatch</div>\n  </div>\n</div>\n</div>",
    "body_html": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:16px; font-family:sans-serif;'>\n  <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n  <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n  <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n  <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n</div>\n  \n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n  <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>SUNDAY NIGHT LIVE • WEEK 6</h2>\n  <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'><p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nBlow the whistle and audit the tape, because Week 6 opened with pure gridiron carnage and never looked back. The tone was set Thursday night when Denver ambushed Seattle 17-14—a collective gut punch that left every single submitted pick in the dirt, saddling <strong>Elvis</strong> and the entire pool with an opening donut. But while Thursday was a universal penalty flag, Sunday became a masterclass in attrition. Standing solo atop the summit heading into Monday Night Football is <strong>Elvis</strong> at <strong>6-7</strong>. Navigating a Sunday slate littered with red-zone turnovers, missed chip-shots, and back-door covers, Elvis took the punishment and emerged as the only competitor on the board to navigate through the chaos and bank positive tallies.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nFrom an officiating standpoint, the ledger requires no late review: <strong>Elvis has mathematically clinched the Week 6 title</strong> before Monday Night Football even kicks off. With an insurmountable six-game cushion, the silver chase has dissolved into an outright audit of the league basement. In four decades of reviewing cards, the crew has rarely witnessed an eleven-way logjam at the bottom: reigning Week 5 kingpin <strong>Rudy</strong>, co-runner up <strong>Lanny</strong>, alongside <strong>Jennifer</strong>, <strong>Jessica</strong>, <strong>Marcio</strong>, <strong>Trevor</strong>, <strong>Don</strong>, <strong>Joel</strong>, <strong>Tyler</strong>, <strong>Brian</strong>, and <strong>Jordan</strong> are all locked at <strong>0-13</strong>. That isn't just a cold afternoon; that is an all-out picking blackout. Every single one of you on zero-win patrol is officially cited into The Umpire Penalty Jar for collective chalk-eating, lack of preparation, and dereliction of straight-up picking duties. Feed the jar on your way out.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nAll eyes now turn to Levi's Stadium as the San Francisco 49ers (-7.5) host the Washington Commanders. For the Red & Gold Faithful, this is a business trip: control the trenches, execute clean tackling in space, and leave no doubt under the Monday night lights. In the 2018 archives, Don \"The Commish\" Threet once rallied the league with his classic decree: <em>\"BIG NEWS FLASH.... THE LEADER IS SLIPPING! only got 7... I'm only 3 behind! Coming after you!\"</em> Unfortunately for the chasing herd this week, Elvis isn't slipping at all—his trophy is already signed, sealed, and audited, leaving the remaining eleven contenders to fight over pride and a single solitary point. Settle in, watch the 49ers handle business, and let's close out Week 6 in style.\n</p></div>\n</div>\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>⭐ WEEK 6 SUNDAY RACE LEADERS (HEADING INTO MNF)</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Current Week Sunday Race • Straight-Up Outright Wins</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n      <tr>\n        <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>⭐ #1 Sunday Leader</div>\n          <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Elvis</div>\n          <div style='font-size:12px; color:#713f12; font-weight:700;'>6 Wins (6-7)</div>\n          <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>The King • Rudy Sponsored</div>\n        </td>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Sunday Chasers (11-Way Tie)</div>\n          <div style='font-size:13px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Don • Jennifer • Jessica • Joel • Jordan • Lanny • Marcio • Rudy • Trevor • Tyler</div>\n          <div style='font-size:12px; color:#334155; font-weight:700;'>0 Wins (0-13)</div>\n          <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (11 Contenders Tied)</div>\n        </td>\n        <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n          <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n          <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n          <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (11-way tie at #2 Runner-Up)</div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n  \n<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 MONDAY NIGHT FOOTBALL FORECAST & CONTENDER SHOWDOWN</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>The Week 6 Decider</span>\n  </div>\n  <div style='padding:14px;'>\n    <div style='background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:12px; margin-bottom:12px;'>\n      <div style='font-size:10px; font-weight:800; color:#0f766e; text-transform:uppercase; letter-spacing:1px;'>⭐ PRIMETIME SHOWDOWN & SPREAD</div>\n      <div style='font-size:15px; font-weight:800; color:#064e3b; margin:4px 0;'>Washington Commanders at San Francisco 49ers</div>\n      <div style='font-size:11px; color:#475569;'>Kickoff: 5:15 PM • Line: San Francisco 49ers (SF -7.5)</div>\n    </div>\n\n    <table style='width:100%; border-collapse:separate; border-spacing:8px; margin-bottom:12px;'>\n      <tr>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>\n          <div style='font-size:11px; font-weight:800; color:#1e293b; text-transform:uppercase;'>RIDING WASHINGTON COMMANDERS:</div>\n          <div style='font-size:11px; color:#334155; margin-top:4px; line-height:1.5;'>\n            None locked in yet\n          </div>\n        </td>\n        <td style='background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:10px; width:50%; vertical-align:top;'>\n          <div style='font-size:11px; font-weight:800; color:#065f46; text-transform:uppercase;'>RIDING SAN FRANCISCO 49ERS:</div>\n          <div style='font-size:11px; color:#047857; margin-top:4px; line-height:1.5;'>\n            Elvis\n          </div>\n        </td>\n      </tr>\n    </table>\n\n    <div style='font-size:12px; color:#334155; line-height:1.6;'>\n      <strong>⚡ The Finale:</strong> Tonight's final whistle determines our Week 6 Weekly Champion! If contenders finish tied for 1st place in outright weekly wins, the Monday Night combined points tiebreaker crowns the champion.\n    </div>\n  </div>\n</div>\n  <div style='margin-bottom:14px;'>\n  \n    <div style='margin-bottom:16px;'>\n      <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n        🏈 WEEK 6 SUNDAY RACE STANDINGS (HEADING INTO MNF)\n      </div>\n      <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n        <thead>\n          <tr style='background:#064e3b;'>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>WK RK</th>\n            <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>CONTENDER</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN WINS</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>SUN LOSSES</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>MNF PICK</th>\n            <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700;'>TIEBREAKER</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'><span style='color:#854d0e; font-weight:800;'>#1 ⭐</span></td>\n        <td style='padding:5px 8px; font-size:12px;'><strong style='color:#064e3b;'>Elvis</strong></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>6</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>7</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>53</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr><tr style='background:#f0fdf4; border-bottom:1px solid #d1fae5;'>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n        <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#047857;'>0</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#64748b;'>13</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:600; color:#1e293b;'>Pending</td>\n        <td style='padding:5px 8px; text-align:center; font-size:11px; color:#0f766e;'>—</td>\n      </tr>\n        </tbody>\n      </table>\n      <div style='background:#f0fdf4; padding:5px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n        * Straight-up wins on completed Sunday games. Monday Night Football winner decides weekly champion. MNF tiebreaker delta strictly breaks 1st-place weekly deadlocks.\n      </div>\n    </div>\n  <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n    📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#064e3b;'>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n        <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6 (SUN)</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>6</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>55</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#2</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#4</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>45</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>44</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#11</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>42</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>41</td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 (SUN) = TOTAL PTS). Translucent gold blocks (👑) indicate previous weekly champions.\n  </div>\n</div>\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n  <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n    <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n    <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n      Monday Night Football will decide our Week 6 champion. Standings finalize Tuesday morning!\n    </div>\n  </div>\n  <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n    <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n    <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n      &ldquo;BIG NEWS FLASH....JUAN IS SLIPPING! only got 7...and Tenn for MNF. I&rsquo;m only 3 behind! Coming after you Juan!&rdquo;\n    </div>\n    <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2018 Week 15 Dispatch</div>\n  </div>\n</div>\n</div>",
    "subject": "[Branham Hills Pool: Legacy Edition] 🏈 Sunday Night Live • Week 6",
    "preheader": "Sunday frenzy, leaderboard shuffle & Monday night previews",
    "consultantQuote": "BIG NEWS FLASH....JUAN IS SLIPPING! only got 7...and Tenn for MNF. I'm only 3 behind! Coming after you Juan!",
    "status": "drafted",
    "dispatch_type": "SUNDAY",
    "draftId": "r-6454634868898757721",
    "draftUrl": "https://mail.google.com/mail/u/0/#drafts"
  },
  {
    "id": "dispatch-friday",
    "type": "friday",
    "week": 6,
    "weekNumber": 6,
    "title": "The Friday Wire and Injury Report • Week 6",
    "subtitle": "Thursday recap, scraped NFL injury wire & weekend matchup lookahead",
    "timestamp": "02:25 AM",
    "publishedAt": "2026-10-17T02:25:01.948Z",
    "isPublished": true,
    "content": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:16px; font-family:sans-serif;'>\n  <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n  <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n  <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n  <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n</div>\n  \n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n  <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>THE FRIDAY WIRE AND INJURY REPORT • WEEK 6</h2>\n  <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'><p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nThe final whistle blew in the Pacific Northwest, the replay review is officially closed, and the ledger is certified: Denver 17, Seattle 14 to kick off Week 6. Out here in the league audit booth, prime officiating marks go out to <strong>Don</strong>, <strong>Brian</strong>, and <strong>Jessica</strong>—the sharp trio who refused to drink the home-chalk Kool-Aid, backed the Broncos outright, and secured the only 1-0 marks on the board. Meanwhile, the rest of the pool suffered an immediate case of blown-coverage whiplash. <strong>Joel</strong>, <strong>Rudy</strong>, <strong>Trevor</strong>, <strong>Lanny</strong>, <strong>Jennifer</strong>, <strong>Marcio</strong>, <strong>Tyler</strong>, and <strong>Elvis</strong> all walked directly into the lumber at 0-1 when Seattle's offense went ice cold in the fourth quarter. Add in <strong>Jordan</strong>, who completely overslept the Thursday night lock for an unforced zero, and three-quarters of the pool is already staring at a deficit before Sunday's early slate even kicks off.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nIt is a swift dose of humble pie for reigning Week 5 champion <strong>Rudy</strong>, who hoisted last week's crown on an 11-3 heater only to drop the very first snap of Week 6. That Thursday jolt tightens up an already cutthroat season chase. <strong>Lanny</strong> and <strong>Rudy</strong> still share the mountaintop at 52 cumulative points, but <strong>Jessica</strong> climbs to 49 alongside <strong>Elvis</strong> (49), while <strong>Jennifer</strong>, <strong>Marcio</strong>, and <strong>Trevor</strong> sit just a single point back at 48. <strong>Don</strong> pushes his total to 46, <strong>Joel</strong> marks 44, <strong>Brian</strong> ties up <strong>Tyler</strong> at 43, and <strong>Jordan</strong> brings up the rear at 41. In the spirit of league tradition, the Crew Chief is assessing a prompt Penalty Flag citation into The Umpire Penalty Jar for the eight-member Seattle chalk herd, plus an extra Penalty Flag from Jordan for clock-management negligence. As Don \"The Commish\" Threet famously dropped into the pool archives: <em>\"If you took the points, you're in the wrong pool. Straight up only, baby! And if you picked Denver tomorrow night, Rudy, you better start lighting candles right now.\"</em> The candles clearly burned bright for Denver this time, and the reigning champ's lead just got trimmed.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nLooking ahead to the main event, the Red & Gold Faithful turn their eyes to Levi's Stadium for a primetime Monday Night Football showcase against the Washington Commanders (Monday, 5:15 PM PT). The desert has San Francisco posted as a heavy -7.5 favorite, but as every veteran in Branham Hills knows, point spreads are meaningless garbage on this scorecard—straight-up execution is the only law of the land. For Kyle Shanahan and Brock Purdy, the blueprint demands classic 49ers football: establishing the outside-zone ground attack early, setting up Purdy's lethal play-action rhythm, and letting the defensive front pin its ears back. With thirteen games left to settle on the weekend ledger, there is zero room to hide out in the cellar. Submit your picks, mind the clock, and let the Sunday slate rip.\n</p></div>\n</div>\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>👑 WEEK 5 WEEKLY RACE PODIUM</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Weekly Race Certification • Crowned at Tuesday Final</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n      <tr>\n        <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>👑 #1 Weekly Crown</div>\n          <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Rudy</div>\n          <div style='font-size:12px; color:#713f12; font-weight:700;'>11 Wins (11-3)</div>\n          <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>Rudymania 2011 Wire-to-Wire Legend • Elvis Sponsor</div>\n        </td>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Weekly Runner-Up (2-Way Tie)</div>\n          <div style='font-size:14px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Lanny</div>\n          <div style='font-size:12px; color:#334155; font-weight:700;'>10 Wins (10-4)</div>\n          <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (2 Contenders Tied)</div>\n        </td>\n        <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n          <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n          <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n          <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (2-way tie at #2 Runner-Up)</div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n  \n<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 SUNDAY NFL MARQUEE MATCHUPS & WEEKEND LOOKAHEAD</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Week 6 Slate Preview</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <div style='font-size:11px; color:#064e3b; margin-bottom:10px; line-height:1.5;'>\n      With the Thursday opener in the books, fifteen gridiron battles remain on the Week 6 board. Here are the premier Sunday marquee matchups highlighting this weekend's slate:\n    </div>\n    <div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #1</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 6:30 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Houston Texans <span style='color:#64748b; font-weight:normal;'>at</span> Jacksonville Jaguars\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Jacksonville Jaguars (JAX -2.5)</strong></span>\n          <span>Projected Total: <strong>42.5 pts</strong></span>\n        </div>\n      </div><div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #2</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Chicago Bears <span style='color:#64748b; font-weight:normal;'>at</span> Atlanta Falcons\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Chicago Bears (CHI -1.5)</strong></span>\n          <span>Projected Total: <strong>51.5 pts</strong></span>\n        </div>\n      </div><div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #3</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Baltimore Ravens <span style='color:#64748b; font-weight:normal;'>at</span> Cleveland Browns\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Baltimore Ravens (BAL -3)</strong></span>\n          <span>Projected Total: <strong>39.5 pts</strong></span>\n        </div>\n      </div><div style='background:#fefce8; border:1px solid #facc15; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#854d0e; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>⭐ SUNDAY NIGHT SHOWDOWN</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Tennessee Titans <span style='color:#64748b; font-weight:normal;'>at</span> Indianapolis Colts\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Indianapolis Colts (IND -7)</strong></span>\n          <span>Projected Total: <strong>44.5 pts</strong></span>\n        </div>\n      </div>\n    <div style='margin-top:14px; margin-bottom:10px;'>\n      <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:20px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px;'>⚡ LIVE NFL INJURY WIRE & GAME IMPACT REPORT</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Friday Briefing</span>\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-size:12px; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#022c22; color:#fef3c7; text-transform:uppercase; font-size:11px;'>\n        <th style='padding:8px 10px; text-align:left;'>Player</th>\n        <th style='padding:8px 10px; text-align:center;'>Team</th>\n        <th style='padding:8px 10px; text-align:center;'>Pos</th>\n        <th style='padding:8px 10px; text-align:left;'>Injury / Diagnosis</th>\n        <th style='padding:8px 10px; text-align:center;'>Status</th>\n        <th style='padding:8px 10px; text-align:center;'>Pool Impact</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Jordan Love</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>GB</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>QB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Knee (MCL Sprain)</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Christian McCaffrey</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>RB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Calf / Achilles Tendinitis</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Saquon Barkley</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>PHI</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>RB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Shoulder</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>A.J. Brown</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>PHI</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Hamstring</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Puka Nacua</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>LAR</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Knee (PCL Sprain)</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Deebo Samuel</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Calf Strain</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>George Kittle</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>TE</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Hamstring</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Brock Bowers</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>LV</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>TE</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Foot</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fffbeb; color:#d97706; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>MODERATE</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Fred Warner</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>LB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Ankle</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Sauce Gardner</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>NYJ</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>CB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Shoulder</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fffbeb; color:#d97706; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>MODERATE</span></td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:8px 12px; font-size:11px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Pool Impact evaluates outright pick volatility. Quarterback and primary backfield shifts heavily swing straight-up win likelihood.\n  </div>\n</div>\n    </div>\n  </div>\n</div>\n  <div style='margin-bottom:14px;'>\n  \n  <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n    📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#064e3b;'>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n        <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6 (TNF)</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#3</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#3</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>46</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>44</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>41</td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 (TNF) = TOTAL PTS). Translucent gold blocks (👑) indicate previous weekly champions.\n  </div>\n</div>\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n  <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n    <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n    <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n      Review the injury reports above carefully before making your weekend selections. Have a great slate!\n    </div>\n  </div>\n  <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n    <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n    <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n      &ldquo;If you took the points, you&rsquo;re in the wrong pool. Straight up only, baby! And if you picked Denver tomorrow night, Rudy, you better start lighting candles right now.&rdquo;\n    </div>\n    <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2026 Week 2 Sunday Roast — Consultant&rsquo;s Word of Wisdom</div>\n  </div>\n</div>\n</div>",
    "body_html": "<div style='max-width:600px; font-family:sans-serif;'>\n  <div style='background:#022c22; border:2px solid #d4af37; padding:20px; text-align:center; border-radius:8px; margin-bottom:16px; font-family:sans-serif;'>\n  <div style='color:#fbbf24; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;'>BRANHAM HILLS FOOTBALL POOL</div>\n  <h1 style='color:#fef08a; font-size:26px; margin:6px 0; font-weight:800; text-transform:uppercase;'>LEGACY EDITION</h1>\n  <div style='display:inline-block; background:#d4af37; color:#022c22; font-weight:bold; font-size:10px; padding:4px 14px; border-radius:12px; margin:8px 0; text-transform:uppercase;'>⭐ 40TH ANNIVERSARY SEASON • EST. 1986 ⭐</div>\n  <div style='color:#fef3c7; font-size:11px; font-style:italic;'>Founder & Commish: Don \"The Commish\" Threet • Admin: The Admin</div>\n</div>\n  \n  <div style='background:#fdfbf7; border:1px solid #e2d9cc; border-left:4px solid #064e3b; padding:15px; border-radius:6px; margin-bottom:14px;'>\n  <h2 style='color:#064e3b; font-size:14px; margin:0 0 8px 0; font-weight:800; text-transform:uppercase; letter-spacing:1px;'>THE FRIDAY WIRE AND INJURY REPORT • WEEK 6</h2>\n  <div style='color:#334155; font-size:12px; line-height:1.6; margin:0;'><p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nThe final whistle blew in the Pacific Northwest, the replay review is officially closed, and the ledger is certified: Denver 17, Seattle 14 to kick off Week 6. Out here in the league audit booth, prime officiating marks go out to <strong>Don</strong>, <strong>Brian</strong>, and <strong>Jessica</strong>—the sharp trio who refused to drink the home-chalk Kool-Aid, backed the Broncos outright, and secured the only 1-0 marks on the board. Meanwhile, the rest of the pool suffered an immediate case of blown-coverage whiplash. <strong>Joel</strong>, <strong>Rudy</strong>, <strong>Trevor</strong>, <strong>Lanny</strong>, <strong>Jennifer</strong>, <strong>Marcio</strong>, <strong>Tyler</strong>, and <strong>Elvis</strong> all walked directly into the lumber at 0-1 when Seattle's offense went ice cold in the fourth quarter. Add in <strong>Jordan</strong>, who completely overslept the Thursday night lock for an unforced zero, and three-quarters of the pool is already staring at a deficit before Sunday's early slate even kicks off.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nIt is a swift dose of humble pie for reigning Week 5 champion <strong>Rudy</strong>, who hoisted last week's crown on an 11-3 heater only to drop the very first snap of Week 6. That Thursday jolt tightens up an already cutthroat season chase. <strong>Lanny</strong> and <strong>Rudy</strong> still share the mountaintop at 52 cumulative points, but <strong>Jessica</strong> climbs to 49 alongside <strong>Elvis</strong> (49), while <strong>Jennifer</strong>, <strong>Marcio</strong>, and <strong>Trevor</strong> sit just a single point back at 48. <strong>Don</strong> pushes his total to 46, <strong>Joel</strong> marks 44, <strong>Brian</strong> ties up <strong>Tyler</strong> at 43, and <strong>Jordan</strong> brings up the rear at 41. In the spirit of league tradition, the Crew Chief is assessing a prompt Penalty Flag citation into The Umpire Penalty Jar for the eight-member Seattle chalk herd, plus an extra Penalty Flag from Jordan for clock-management negligence. As Don \"The Commish\" Threet famously dropped into the pool archives: <em>\"If you took the points, you're in the wrong pool. Straight up only, baby! And if you picked Denver tomorrow night, Rudy, you better start lighting candles right now.\"</em> The candles clearly burned bright for Denver this time, and the reigning champ's lead just got trimmed.\n</p>\n<p style=\"margin: 0 0 10px 0; line-height: 1.6; font-size: 12px; color: #334155;\">\nLooking ahead to the main event, the Red & Gold Faithful turn their eyes to Levi's Stadium for a primetime Monday Night Football showcase against the Washington Commanders (Monday, 5:15 PM PT). The desert has San Francisco posted as a heavy -7.5 favorite, but as every veteran in Branham Hills knows, point spreads are meaningless garbage on this scorecard—straight-up execution is the only law of the land. For Kyle Shanahan and Brock Purdy, the blueprint demands classic 49ers football: establishing the outside-zone ground attack early, setting up Purdy's lethal play-action rhythm, and letting the defensive front pin its ears back. With thirteen games left to settle on the weekend ledger, there is zero room to hide out in the cellar. Submit your picks, mind the clock, and let the Sunday slate rip.\n</p></div>\n</div>\n  <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>👑 WEEK 5 WEEKLY RACE PODIUM</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Weekly Race Certification • Crowned at Tuesday Final</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <table style='width:100%; border-collapse:separate; border-spacing:6px;'>\n      <tr>\n        <td style='background:#fef9c3; border:1px solid #facc15; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#854d0e; text-transform:uppercase;'>👑 #1 Weekly Crown</div>\n          <div style='font-size:15px; font-weight:800; color:#422006; margin:4px 0;'>Rudy</div>\n          <div style='font-size:12px; color:#713f12; font-weight:700;'>11 Wins (11-3)</div>\n          <div style='font-size:10px; color:#854d0e; font-style:italic; margin-top:4px;'>Rudymania 2011 Wire-to-Wire Legend • Elvis Sponsor</div>\n        </td>\n        <td style='background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#475569; text-transform:uppercase;'>🥈 T-#2 Weekly Runner-Up (2-Way Tie)</div>\n          <div style='font-size:14px; font-weight:800; color:#0f172a; margin:4px 0;'>Brian • Lanny</div>\n          <div style='font-size:12px; color:#334155; font-weight:700;'>10 Wins (10-4)</div>\n          <div style='font-size:10px; color:#475569; font-style:italic; margin-top:4px;'>Co-Runners-Up (2 Contenders Tied)</div>\n        </td>\n        <td style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; width:33%; vertical-align:top; text-align:center;'>\n          <div style='font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;'>🥉 #3 Weekly Podium</div>\n          <div style='font-size:14px; font-weight:800; color:#64748b; margin:4px 0;'>None (Vacated)</div>\n          <div style='font-size:12px; color:#94a3b8; font-weight:700;'>—</div>\n          <div style='font-size:10px; color:#94a3b8; font-style:italic; margin-top:4px;'>Vacated (2-way tie at #2 Runner-Up)</div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n  \n<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:12px; text-transform:uppercase; letter-spacing:1px;'>🏈 SUNDAY NFL MARQUEE MATCHUPS & WEEKEND LOOKAHEAD</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Week 6 Slate Preview</span>\n  </div>\n  <div style='padding:12px 14px;'>\n    <div style='font-size:11px; color:#064e3b; margin-bottom:10px; line-height:1.5;'>\n      With the Thursday opener in the books, fifteen gridiron battles remain on the Week 6 board. Here are the premier Sunday marquee matchups highlighting this weekend's slate:\n    </div>\n    <div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #1</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 6:30 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Houston Texans <span style='color:#64748b; font-weight:normal;'>at</span> Jacksonville Jaguars\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Jacksonville Jaguars (JAX -2.5)</strong></span>\n          <span>Projected Total: <strong>42.5 pts</strong></span>\n        </div>\n      </div><div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #2</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Chicago Bears <span style='color:#64748b; font-weight:normal;'>at</span> Atlanta Falcons\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Chicago Bears (CHI -1.5)</strong></span>\n          <span>Projected Total: <strong>51.5 pts</strong></span>\n        </div>\n      </div><div style='background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#065f46; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>🔥 SUNDAY MARQUEE CLASH #3</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Baltimore Ravens <span style='color:#64748b; font-weight:normal;'>at</span> Cleveland Browns\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Baltimore Ravens (BAL -3)</strong></span>\n          <span>Projected Total: <strong>39.5 pts</strong></span>\n        </div>\n      </div><div style='background:#fefce8; border:1px solid #facc15; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n        <div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;'>\n          <span style='background:#854d0e; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;'>⭐ SUNDAY NIGHT SHOWDOWN</span>\n          <span style='font-size:11px; font-weight:bold; color:#475569;'>Sun • 10:00 AM PT</span>\n        </div>\n        <div style='font-size:13px; font-weight:800; color:#0f172a; margin:3px 0;'>\n          Tennessee Titans <span style='color:#64748b; font-weight:normal;'>at</span> Indianapolis Colts\n        </div>\n        <div style='font-size:11px; color:#475569; display:flex; gap:14px; flex-wrap:wrap;'>\n          <span>Opening Favorite: <strong style='color:#065f46;'>Indianapolis Colts (IND -7)</strong></span>\n          <span>Projected Total: <strong>44.5 pts</strong></span>\n        </div>\n      </div>\n    <div style='margin-top:14px; margin-bottom:10px;'>\n      <div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:20px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>\n  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>\n    <span style='color:#fef08a; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px;'>⚡ LIVE NFL INJURY WIRE & GAME IMPACT REPORT</span>\n    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Official Friday Briefing</span>\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-size:12px; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#022c22; color:#fef3c7; text-transform:uppercase; font-size:11px;'>\n        <th style='padding:8px 10px; text-align:left;'>Player</th>\n        <th style='padding:8px 10px; text-align:center;'>Team</th>\n        <th style='padding:8px 10px; text-align:center;'>Pos</th>\n        <th style='padding:8px 10px; text-align:left;'>Injury / Diagnosis</th>\n        <th style='padding:8px 10px; text-align:center;'>Status</th>\n        <th style='padding:8px 10px; text-align:center;'>Pool Impact</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Jordan Love</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>GB</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>QB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Knee (MCL Sprain)</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Christian McCaffrey</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>RB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Calf / Achilles Tendinitis</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Saquon Barkley</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>PHI</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>RB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Shoulder</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>A.J. Brown</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>PHI</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Hamstring</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Puka Nacua</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>LAR</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Knee (PCL Sprain)</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Deebo Samuel</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>WR</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Calf Strain</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fee2e2; color:#991b1b; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Out</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>George Kittle</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>TE</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Hamstring</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Brock Bowers</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>LV</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>TE</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Foot</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fffbeb; color:#d97706; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>MODERATE</span></td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Fred Warner</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>SF</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>LB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Ankle</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span></td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:8px 10px; font-weight:bold; color:#064e3b;'>Sauce Gardner</td>\n      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center;'>NYJ</td>\n      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace;'>CB</td>\n      <td style='padding:8px 10px; color:#4b5563;'>Shoulder</td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fef3c7; color:#92400e; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>Questionable</span></td>\n      <td style='padding:8px 10px; text-align:center;'><span style='background:#fffbeb; color:#d97706; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>MODERATE</span></td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:8px 12px; font-size:11px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Pool Impact evaluates outright pick volatility. Quarterback and primary backfield shifts heavily swing straight-up win likelihood.\n  </div>\n</div>\n    </div>\n  </div>\n</div>\n  <div style='margin-bottom:14px;'>\n  \n  <div style='font-size:12px; font-weight:800; color:#064e3b; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;'>\n    📊 OFFICIAL CUMULATIVE SEASON STANDINGS LEDGER\n  </div>\n  <table style='width:100%; border-collapse:collapse; font-family:sans-serif;'>\n    <thead>\n      <tr style='background:#064e3b;'>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>SEASON RK</th>\n        <th style='padding:6px 8px; text-align:left; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>CONTENDER</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK1</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK2</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK3</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK4</th><th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK5</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:1px;'>WK6 (TNF)</th>\n        <th style='padding:6px 8px; text-align:center; color:#fef3c7; font-size:10px; text-transform:uppercase; font-weight:800; letter-spacing:1px;'>TOTAL PTS</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Lanny</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#1</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Rudy</span></td>\n      <td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 1 Winner: Rudy (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 5 Winner: Rudy (11 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>11</span>\n          </span>\n        </td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>52</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#3</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jessica</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#3</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Elvis</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>49</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jennifer</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 4 Winner: Jennifer (13 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>13</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Marcio</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 2 Winner: Marcio (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#5</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Trevor</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>48</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#8</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Don</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>11</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>46</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#9</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Joel</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>44</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Brian</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>1</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ffffff; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#10</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Tyler</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>8</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>7</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>10</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>43</td>\n    </tr><tr style='background:#ecfdf5; border-bottom:1px solid #d1fae5;'>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#064e3b;'>#12</td>\n      <td style='padding:5px 8px; font-size:12px;'><span style='color:#0f172a; font-weight:600;'>Jordan</span></td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>6</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:3px 5px; text-align:center; font-size:11px;'>\n          <span style='display:inline-flex; align-items:center; justify-content:center; gap:2px; background:rgba(212, 175, 55, 0.22); border:1px solid rgba(212, 175, 55, 0.55); border-radius:4px; padding:2px 5px; color:#78350f; font-weight:800; box-shadow:0 1px 2px rgba(0,0,0,0.05);' title='Week 3 Winner: Jordan (12 Wins)'>\n            <span style='font-size:9px;'>👑</span> <span>12</span>\n          </span>\n        </td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>9</td><td style='padding:5px 8px; text-align:center; font-size:11px; color:#334155;'>5</td>\n      <td style='padding:5px 8px; text-align:center; font-size:11px; font-weight:700; color:#0f766e;'>0</td>\n      <td style='padding:5px 8px; text-align:center; font-weight:800; font-size:12px; color:#064e3b;'>41</td>\n    </tr>\n    </tbody>\n  </table>\n  <div style='background:#f0fdf4; padding:6px 10px; font-size:10px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>\n    * Cumulative points equal sum of weekly wins (WK1 + WK2 + WK3 + WK4 + WK5 + WK6 (TNF) = TOTAL PTS). Translucent gold blocks (👑) indicate previous weekly champions.\n  </div>\n</div>\n  <div style='border-top:2px solid #d4af37; padding-top:12px;'>\n  <div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; margin-bottom:8px;'>\n    <div style='font-size:10px; font-weight:bold; color:#0f766e; text-transform:uppercase;'>ADMIN NOTE • THE ADMIN</div>\n    <div style='font-size:11px; color:#475569; margin-top:2px; line-height:1.5;'>\n      Review the injury reports above carefully before making your weekend selections. Have a great slate!\n    </div>\n  </div>\n  <div style='background:#fef3c7; border:2px solid #d4af37; border-radius:6px; padding:12px; text-align:center;'>\n    <div style='font-size:10px; font-weight:bold; color:#92400e; text-transform:uppercase; letter-spacing:1.5px;'>📜 FROM THE COMMISH ARCHIVES (1986–2026)</div>\n    <div style='font-size:12px; font-style:italic; font-weight:600; color:#78350f; margin-top:4px; line-height:1.5;'>\n      &ldquo;If you took the points, you&rsquo;re in the wrong pool. Straight up only, baby! And if you picked Denver tomorrow night, Rudy, you better start lighting candles right now.&rdquo;\n    </div>\n    <div style='font-size:10px; color:#b45309; margin-top:4px; font-weight:bold;'>— Don &ldquo;The Commish&rdquo; Threet • 2026 Week 2 Sunday Roast — Consultant&rsquo;s Word of Wisdom</div>\n  </div>\n</div>\n</div>",
    "subject": "[Branham Hills Pool: Legacy Edition] 🏈 The Friday Wire and Injury Report • Week 6",
    "preheader": "Thursday recap, scraped NFL injury wire & weekend matchup lookahead",
    "consultantQuote": "If you took the points, you're in the wrong pool. Straight up only, baby! And if you picked Denver tomorrow night, Rudy, you better start lighting candles right now.",
    "status": "drafted",
    "dispatch_type": "FRIDAY",
    "draftId": "r-5557467747639562507",
    "draftUrl": "https://mail.google.com/mail/u/0/#drafts"
  }
];

export const INITIAL_FINES: FineItem[] = [
  {
    "id": "fine-joel-app-overtime",
    "contenderName": "Joel",
    "amount": 3,
    "reason": "1 Flag for each week spent polishing the pool ledger",
    "date": "Week 3",
    "paid": false,
    "issuedBy": "The Admin (Self-Imposed)"
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_SEASON_HISTORY: SeasonHistory = {
  "compiledWeeks": [
    1,
    2,
    3,
    4,
    5,
    6
  ],
  "lockedWeeks": [
    1,
    2,
    3,
    4,
    5,
    6
  ],
  "records": {
    "Rudy": {
      "contenderName": "Rudy",
      "totalWins": 59,
      "totalLosses": 33,
      "seasonRank": 1,
      "bestWeekWins": 13,
      "weeksWonCount": 2,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 13,
          "losses": 3,
          "tiebreaker": 48,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof (12 pts + KC win = 13)"
        },
        "2": {
          "week": 2,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Co-Leader"
        },
        "3": {
          "week": 3,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 11,
          "losses": 3,
          "ties": 1,
          "tiebreaker": 48,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 48)"
        }
      },
      "totalTies": 1
    },
    "Richard": {
      "contenderName": "Richard",
      "totalWins": 23,
      "totalLosses": 9,
      "seasonRank": 13,
      "bestWeekWins": 12,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 12,
          "losses": 4,
          "tiebreaker": 35,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited: 11 wins (Games 1-15) + 1 (MNF) = 12 Total (TB: 35)"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Co-Leader"
        }
      }
    },
    "Jessica": {
      "contenderName": "Jessica",
      "totalWins": 57,
      "totalLosses": 35,
      "seasonRank": 3,
      "bestWeekWins": 11,
      "weeksWonCount": 1,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 46,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 27,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 34,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 9,
          "losses": 5,
          "ties": 1,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 9,
          "losses": 5,
          "ties": 0,
          "tiebreaker": 51,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Audited & Verified: Outright Week 6 Champion (9-5, TB: 51 vs MNF 40)"
        }
      },
      "totalTies": 1
    },
    "Lanny": {
      "contenderName": "Lanny",
      "totalWins": 58,
      "totalLosses": 34,
      "seasonRank": 2,
      "bestWeekWins": 11,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 11,
          "losses": 5,
          "tiebreaker": "",
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited: 10 wins (Games 1-15) + 1 (MNF) = 11 Total (No TB sent)"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 56,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified: 11 wins (11-5)"
        },
        "3": {
          "week": 3,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 65,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 42,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 10,
          "losses": 4,
          "ties": 1,
          "tiebreaker": 65,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 6,
          "losses": 8,
          "ties": 0,
          "tiebreaker": 75,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (6-8, TB: 75)"
        }
      },
      "totalTies": 1
    },
    "Marcio": {
      "contenderName": "Marcio",
      "totalWins": 54,
      "totalLosses": 38,
      "seasonRank": 7,
      "bestWeekWins": 12,
      "weeksWonCount": 1,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 12,
          "losses": 4,
          "tiebreaker": 45,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Audited & Verified: Outright Week 2 Champion (12-4, won without tie breaker)"
        },
        "3": {
          "week": 3,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 50,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 45,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 8,
          "losses": 6,
          "ties": 1,
          "tiebreaker": 56,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 6,
          "losses": 8,
          "ties": 0,
          "tiebreaker": 50,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (6-8, TB: 50)"
        }
      },
      "totalTies": 1
    },
    "Don": {
      "contenderName": "Don",
      "totalWins": 53,
      "totalLosses": 39,
      "seasonRank": 8,
      "bestWeekWins": 11,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 46,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 7,
          "losses": 7,
          "ties": 1,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 8,
          "losses": 6,
          "ties": 0,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (8-6, TB: 55)"
        }
      },
      "totalTies": 1
    },
    "Elvis": {
      "contenderName": "Elvis",
      "totalWins": 56,
      "totalLosses": 36,
      "seasonRank": 4,
      "bestWeekWins": 11,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Vegas Favorite Bot"
        },
        "3": {
          "week": 3,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 9,
          "losses": 5,
          "ties": 1,
          "tiebreaker": 55,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 52,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 52)"
        }
      },
      "totalTies": 1
    },
    "Jennifer": {
      "contenderName": "Jennifer",
      "totalWins": 55,
      "totalLosses": 37,
      "seasonRank": 5,
      "bestWeekWins": 13,
      "weeksWonCount": 1,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 6,
          "losses": 10,
          "tiebreaker": 27,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 13,
          "losses": 3,
          "tiebreaker": 48,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Week 4 Certified Champion • 13 Wins"
        },
        "5": {
          "week": 5,
          "wins": 8,
          "losses": 6,
          "ties": 1,
          "tiebreaker": 60,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 53,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 53)"
        }
      },
      "totalTies": 1
    },
    "Trevor": {
      "contenderName": "Trevor",
      "totalWins": 55,
      "totalLosses": 37,
      "seasonRank": 5,
      "bestWeekWins": 11,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 46,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 11,
          "losses": 5,
          "tiebreaker": 42,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 44,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 8,
          "losses": 6,
          "ties": 1,
          "tiebreaker": 45,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 57,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 57)"
        }
      },
      "totalTies": 1
    },
    "Tyler": {
      "contenderName": "Tyler",
      "totalWins": 50,
      "totalLosses": 42,
      "seasonRank": 9,
      "bestWeekWins": 10,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 58,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 7,
          "losses": 9,
          "tiebreaker": 52,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 40,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 9,
          "losses": 5,
          "ties": 1,
          "tiebreaker": 52,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 48)"
        }
      },
      "totalTies": 1
    },
    "Brian": {
      "contenderName": "Brian",
      "totalWins": 50,
      "totalLosses": 42,
      "seasonRank": 9,
      "bestWeekWins": 10,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 52,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 6,
          "losses": 10,
          "tiebreaker": 53,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 38,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 10,
          "losses": 4,
          "ties": 1,
          "tiebreaker": 58,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 8,
          "losses": 6,
          "ties": 0,
          "tiebreaker": 149,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (8-6, TB: 149)"
        }
      },
      "totalTies": 1
    },
    "Joel": {
      "contenderName": "Joel",
      "totalWins": 49,
      "totalLosses": 43,
      "seasonRank": 11,
      "bestWeekWins": 10,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 42,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 49,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Live Internet Postings"
        },
        "3": {
          "week": 3,
          "wins": 10,
          "losses": 6,
          "tiebreaker": 20,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 8,
          "losses": 8,
          "tiebreaker": 41,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 9,
          "losses": 5,
          "ties": 1,
          "tiebreaker": 31,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 5,
          "losses": 9,
          "ties": 0,
          "tiebreaker": 58,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (5-9, TB: 58)"
        }
      },
      "totalTies": 1
    },
    "Jordan": {
      "contenderName": "Jordan",
      "totalWins": 48,
      "totalLosses": 44,
      "seasonRank": 12,
      "bestWeekWins": 12,
      "weeksWonCount": 1,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 6,
          "losses": 10,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "House Rule: Late entry Wk1 score tied to lowest (Jeff)"
        },
        "2": {
          "week": 2,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 48,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "House Rule: Late entry Wk1 score tied to lowest (Jeff)"
        },
        "3": {
          "week": 3,
          "wins": 12,
          "losses": 4,
          "tiebreaker": 42,
          "isWinner": true,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 3 • Crown Winner: Jordan"
        },
        "4": {
          "week": 4,
          "wins": 9,
          "losses": 7,
          "tiebreaker": 43,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Week 4 Official Final"
        },
        "5": {
          "week": 5,
          "wins": 5,
          "losses": 9,
          "ties": 1,
          "tiebreaker": 31,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Automated Compilation for Week 5 • Crown Winner: Rudy"
        },
        "6": {
          "week": 6,
          "wins": 7,
          "losses": 7,
          "ties": 0,
          "tiebreaker": 53,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Audited & Verified against Official Week 6 Pick Sheet & ESPN Finals (7-7, TB: 53)"
        }
      },
      "totalTies": 1
    },
    "Jeff": {
      "contenderName": "Jeff",
      "totalWins": 12,
      "totalLosses": 20,
      "seasonRank": 14,
      "bestWeekWins": 6,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 6,
          "losses": 10,
          "tiebreaker": 47,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 6,
          "losses": 10,
          "tiebreaker": 35,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Lowest score Wk1 benchmark"
        }
      }
    },
    "Christine": {
      "contenderName": "Christine",
      "totalWins": 2,
      "totalLosses": 14,
      "seasonRank": 15,
      "bestWeekWins": 2,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 2,
          "losses": 14,
          "tiebreaker": 13,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 0,
          "losses": 0,
          "tiebreaker": "",
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Confirmed Out / Inactive"
        }
      }
    },
    "Kristine": {
      "contenderName": "Kristine",
      "totalWins": 0,
      "totalLosses": 16,
      "seasonRank": 16,
      "bestWeekWins": 0,
      "weeksWonCount": 0,
      "weeklyBreakdown": {
        "1": {
          "week": 1,
          "wins": 0,
          "losses": 16,
          "tiebreaker": 16,
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Official Sheet Proof"
        },
        "2": {
          "week": 2,
          "wins": 0,
          "losses": 0,
          "tiebreaker": "",
          "isWinner": false,
          "isLocked": true,
          "auditNotes": "Inactive"
        }
      }
    }
  },
  "lastCompiledAt": "Week 6 Official Final • Crown Awarded to Jessica (9-5)",
  "lastAuditedAt": "2026-10-21T10:50:06.105Z"
};
