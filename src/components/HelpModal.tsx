import React, { memo, useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Smartphone, 
  Tablet,
  Monitor,
  Laptop,
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Share2, 
  PlusSquare, 
  MoreVertical,
  Printer,
  Palette,
  Shield,
  Sparkles,
  Award,
  Layers,
  FileText,
  Settings,
  Radio,
  Lock
} from 'lucide-react';
import { getPoolConfig } from '../config/leagueConfig';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpTab = 'devices' | 'picks' | 'leaderboard' | 'themes-print' | 'admin';

export const HelpModal: React.FC<HelpModalProps> = memo(({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<HelpTab>('devices');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200" style={{ contain: 'strict' }}>
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]"
        style={{ contain: 'layout paint' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Modal Header */}
        <div 
          className="text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md"
          style={{ background: 'var(--theme-header-bg, #022c22)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl font-bold border border-white/20 shadow-inner">
              📖
            </div>
            <div>
              <h3 id="help-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Branham Hills Pool • Complete Operations Manual</span>
              </h3>
              <p className="text-xs text-emerald-200">
                Installation on all devices, weekly contender guide, themes, print deck & commissioner tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
            aria-label="Close help manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'devices' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Install on Devices</span>
          </button>

          <button
            onClick={() => setActiveTab('picks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'picks' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Picks & Autolock</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leaderboard' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Leaderboard & Scores</span>
          </button>

          <button
            onClick={() => setActiveTab('themes-print')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'themes-print' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Themes & Print Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admin' 
                ? 'bg-amber-900 text-amber-100 shadow-xs' 
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Commissioner & Admin Hub</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm grow">
          
          {/* ========================================================= */}
          {/* TAB 1: DEVICE INSTALLATION INSTRUCTIONS                   */}
          {/* ========================================================= */}
          {activeTab === 'devices' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>1-Tap Direct Icon Access Across All Screens</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This pool runs as a modern Progressive Web App (PWA). You do not need the App Store, Google Play, or any passwords. Follow the steps below for your specific device to add a 1-tap launcher to your home screen or desktop.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. iPhone */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>Apple iPhone (Safari)</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>Open the pool web link in <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share</strong> button at the bottom of the screen (square with an arrow pointing up <Share2 className="w-3 h-3 inline text-slate-500" />).</li>
                    <li>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> (<PlusSquare className="w-3 h-3 inline text-slate-500" />).</li>
                    <li>Tap <strong>Add</strong> in the top-right corner. The official Branham Hills icon will appear right alongside your regular apps.</li>
                  </ol>
                </div>

                {/* 2. iPad & Tablets */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
                    <Tablet className="w-4 h-4 text-blue-700" />
                    <span>Apple iPad & iPad Pro (Safari)</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>Open the pool in <strong>Safari</strong> on your iPad.</li>
                    <li>Tap the <strong>Share</strong> button located in the top navigation bar next to the address field (<Share2 className="w-3 h-3 inline text-slate-500" />).</li>
                    <li>Select <strong>&ldquo;Add to Home Screen&rdquo;</strong> from the pop-up menu.</li>
                    <li>Tap <strong>Add</strong>. <em>Power user tip:</em> Drag the pool app icon into your iPad Dock or use iPadOS <strong>Split View</strong> to watch live game updates side-by-side with Sunday broadcasts!</li>
                  </ol>
                </div>

                {/* 3. Android Phones & Tablets */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
                    <Smartphone className="w-4 h-4 text-green-700" />
                    <span>Android Phones & Tablets (Chrome / Samsung Internet)</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>Open the pool link in <strong>Google Chrome</strong> or Samsung Internet.</li>
                    <li>Tap the <strong>three vertical dots menu</strong> in the top-right corner (<MoreVertical className="w-3 h-3 inline text-slate-500" />).</li>
                    <li>Tap <strong>&ldquo;Install App&rdquo;</strong> (or <strong>&ldquo;Add to Home screen&rdquo;</strong>).</li>
                    <li>Tap <strong>Install</strong> to confirm. The pool will launch in borderless, full-screen mode like a native app.</li>
                  </ol>
                </div>

                {/* 4. Windows PC */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
                    <Monitor className="w-4 h-4 text-indigo-700" />
                    <span>Windows PC (Microsoft Edge or Google Chrome)</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>In <strong>Edge</strong> or <strong>Chrome</strong>, navigate to the pool web address.</li>
                    <li>Look at the right side of your browser address bar: click the <strong>Install App icon</strong> (monitor with down arrow).</li>
                    <li>Alternatively, click the browser menu (<strong>&hellip;</strong>) &rarr; <strong>Apps</strong> &rarr; <strong>&ldquo;Install this site as an app&rdquo;</strong>.</li>
                    <li>Check <strong>&ldquo;Pin to Taskbar&rdquo;</strong> for instant 1-click access from your Windows desktop.</li>
                  </ol>
                </div>

                {/* 5. Apple Mac */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-200 pb-2">
                    <Laptop className="w-4 h-4 text-slate-800" />
                    <span>Apple Mac (macOS Safari or Chrome)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      <strong className="text-slate-900 block mb-1">In Safari (macOS Sonoma or newer):</strong>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Click <strong>File</strong> in the top menu bar &rarr; select <strong>&ldquo;Add to Dock&hellip;&rdquo;</strong>.</li>
                        <li>Click <strong>Add</strong>. The pool runs as a standalone macOS window in your Dock, separate from regular browser tabs.</li>
                      </ol>
                    </div>
                    <div>
                      <strong className="text-slate-900 block mb-1">In Google Chrome on Mac:</strong>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Click the <strong>Install</strong> icon in the address bar, or click Chrome menu &rarr; <strong>Save and Share</strong> &rarr; <strong>Install Branham Hills Pool</strong>.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PICKS, AUTOLOCK & KICKOFF LOCKOUTS                 */}
          {/* ========================================================= */}
          {activeTab === 'picks' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>How to Play: Straight-Up Picks with Instant Autolock</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Straight-up picking rules the pool—no point spreads. 1 point is awarded for each outright winner.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm block mb-0.5">Select Your Contender Name</strong>
                    <p>
                      Tap your name in the roster selector at the top. The app securely binds your device to your profile so you never need to enter passwords.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm block mb-0.5">Instant Per-Pick Autolock (No Submit Button Needed)</strong>
                    <p>
                      Simply tap the team you predict will win. The pick <strong>immediately autolocks</strong> and securely saves to both local storage and cloud persistence. You no longer have to worry about forgetting to tap a manual &ldquo;Submit&rdquo; button.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm block mb-0.5">Freedom to Change Until Kickoff</strong>
                    <p>
                      You can change your pick or tiebreaker as many times as you like before that specific game begins. Every tap updates your selection in real time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                    4
                  </span>
                  <div>
                    <strong className="text-amber-950 text-sm block mb-0.5">Kickoff Whistle Lockout & Vegas Favorites Autofill</strong>
                    <p className="text-amber-900/90 leading-relaxed">
                      Each game locks permanently at its scheduled kickoff. To ensure no contender is discouraged or penalized with zeros due to a busy weekend, any unsubmitted game pick is <strong>automatically assigned the consensus Vegas Favorite at kickoff</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                    5
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm block mb-0.5">Monday Night Tiebreaker Score</strong>
                    <p>
                      Enter your predicted combined total points scored by both teams in the Monday Night Football finale. This number is used strictly to break deadlocks when two or more contenders finish tied for 1st place in total weekly wins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: LEADERBOARD, MATRIX & LIVE SCORES                  */}
          {/* ========================================================= */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>The Grand Ledger: Live Matrix & Sunday Race Tracking</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Track everyone&rsquo;s picks, live scores, and season standings across multiple purpose-built views.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <strong className="text-slate-900 text-sm block">📊 Live Matrix Spreadsheet</strong>
                  <p className="text-slate-600 leading-relaxed">
                    View every contender&rsquo;s picks across every game on a single board. Winning picks display a bold green checkmark. Losing picks are cleanly and softly faded so you can audit the board without disruptive crossed-out lines.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <strong className="text-slate-900 text-sm block">⏱️ Live Clock & NFL Scoring Sync</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Live NFL scores and in-progress statuses automatically ingest throughout Sunday and Monday, calculating real-time straight-up points and tiebreaker deltas live behind the plate.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <strong className="text-slate-900 text-sm block">🏆 Cumulative Season Ledger</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Audit the overall 40th Anniversary leaderboard, tracking total season wins, weekly crowns, runner-up silver finishes, and historical consistency from Week 1 to the finale.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                  <strong className="text-slate-900 text-sm block">💬 Locker Room &amp; Consultants&rsquo; Corner</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Trade real-time banter and reactions in the Locker Room chat, or visit Consultants&rsquo; Corner to explore league governance rules, historic decrees, and non-monetary Penalty Flag citations into the Umpire Penalty Jar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: THEMES & THE PRINT DECK                            */}
          {/* ========================================================= */}
          {activeTab === 'themes-print' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
                <h4 className="text-sm font-black text-purple-950 flex items-center gap-2 mb-1">
                  <Palette className="w-4 h-4 text-purple-700" />
                  <span>Personalize Your Franchise & Export Physical Sheets</span>
                </h4>
                <p className="text-xs text-purple-900/80">
                  Select your favorite NFL team color theme and generate isolated, shrink-to-fit printable documents.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span>32 NFL Team Color Themes</span>
                  </strong>
                  <p className="leading-relaxed">
                    Open the <strong>Themes & Print Deck</strong> tab to select any of the 32 NFL franchises (e.g. San Francisco, Green Bay, Kansas City, Dallas, LA Rams, LA Chargers). The chosen theme updates banners, buttons, and navigation across the app and is permanently remembered on your device until you choose another. (The historical Dispatches archive remains permanently green and gold to honor the 1986 pool vault).
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 text-sm flex items-center gap-2">
                    <Printer className="w-4 h-4 text-emerald-700" />
                    <span>Blank Upcoming Week Pick Sheets</span>
                  </strong>
                  <p className="leading-relaxed">
                    Need a physical sheet for yourself, family, or friends? Select any week in the NFL season to generate an official blank pick sheet. By default, it opens in clean high-contrast <strong>Black & White</strong> to conserve ink, with a one-click toggle to print in <strong>Team Themed Color</strong>.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Isolated Scoresheet Printing & Export</span>
                  </strong>
                  <p className="leading-relaxed">
                    The <strong>Print Scoresheet</strong> tool completely isolates the scoring matrix from navigation, sidebars, and buttons. Contenders are automatically sorted strictly in <strong>descending order of total season wins</strong>, complete with a dedicated Season Total column.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 text-sm flex items-center gap-2">
                    <Printer className="w-4 h-4 text-slate-700" />
                    <span>Shrink-to-Fit Landscape Layout</span>
                  </strong>
                  <p className="leading-relaxed">
                    All printouts are engineered with landscape orientation styling (`@page &#123; size: landscape; &#125;`) and dynamic container scaling so that 16-game boards fit cleanly on standard 8.5&quot; &times; 11&quot; paper without clipping or overflowing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: COMMISSIONER & ADMIN HUB MANUAL                    */}
          {/* ========================================================= */}
          {activeTab === 'admin' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Commissioner Dugout & Operations Center</span>
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  The Admin Hub provides complete governance over the pool. All critical administrative actions are protected by PIN security (`adminAuth`).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>PIN Authentication & Dugout Access</span>
                  </strong>
                  <p className="text-slate-600">
                    Entering the Commissioner PIN unlocks administrative override privileges, pick adjustments, and ledger certified locks.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Contender Pick Overrides</span>
                  </strong>
                  <p className="text-slate-600">
                    If a contender calls or texts in their selections before kickoff, the commissioner can select their name in the Dugout and enter or adjust picks directly.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-700" />
                    <span>Manual Game Lock & Winner Overrides</span>
                  </strong>
                  <p className="text-slate-600">
                    The commissioner can manually force lock any game or set/correct official winners in the rare event of stat corrections, postponements, or ties.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Emergency Vegas Favorites Trigger</span>
                  </strong>
                  <p className="text-slate-600">
                    A dedicated trigger in the Admin Hub instantly populates consensus Vegas favorites for any contender who missed entering picks prior to kickoff.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Certified Kickoff Ledgers & Running Audits</span>
                  </strong>
                  <p className="text-slate-600">
                    Every kickoff snapshot is permanently written to `weekN-certified-ledger.json` and `weekN-running-audit.json`, guaranteeing an indisputable audit trail.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                  <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <NewspaperIcon className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Dispatches & Custom Admin Message</span>
                  </strong>
                  <p className="text-slate-600">
                    Generate Friday Wire, Sunday Recap, and Tuesday Final dispatches, edit custom notes under &ldquo;Message from Admin Joel&rdquo;, shuffle takes with Gemini, and auto-draft directly to Gmail.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Contact Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Need Immediate Help or Can&rsquo;t Reach the Site?</div>
                <p className="text-[11px] text-slate-500">
                  Contact {getPoolConfig().adminName} ({getPoolConfig().adminTitle}) and they can record your picks directly into the Dugout.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${getPoolConfig().adminEmail}`}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-colors shrink-0 text-center shadow-2xs"
            >
              Contact {getPoolConfig().adminName}
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Branham Hills Legacy Pool &bull; 40 Years of Straight-Up Glory (1986&ndash;2026)
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-xs"
            style={{ background: 'var(--theme-header-bg, #022c22)' }}
          >
            Got It, Back to the Action!
          </button>
        </div>
      </div>
    </div>
  );
});

// Inline helper icon component for Newspaper
function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className || "w-4 h-4"}
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}
