import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  Trophy, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Smartphone,
  LayoutGrid,
  List,
  User,
  Zap,
  Sliders
} from 'lucide-react';
import { Game, Player, PlayerPickData, SeasonHistory } from '../types';
import { HelpModal } from './HelpModal';
import { isGameLockedByKickoff } from '../utils/storageSanitizer';
import {
  applyBlankOnlyFavorites,
  resolveDefaultMnfTiebreaker,
  isGameLockedAtTime,
  sanitizeClientSubmissionPicks
} from '../utils/pickRulesEngine';
import { isGameTie } from '../utils/nflTieEngine';
import { formatTeamCityOrRegion } from '../utils/nflTeamThemes';

interface WeeklyPicksTabProps {
  games: Game[];
  players: Player[];
  activePlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  allPicks: Record<string, PlayerPickData>;
  onSavePicks: (
    contenderName: string,
    picks: Record<number, string>,
    tiebreaker: number | '',
    adminOverride?: boolean,
    allowClearUnlocked?: boolean
  ) => void;
  onViewLeaderboard: () => void;
  isCompactMode?: boolean;
  currentWeek?: number;
  seasonHistory?: SeasonHistory;
}

interface WeeklyPickGameCardProps {
  game: Game;
  pickedTeam?: string;
  onPickTeam: (gameNumber: number, team: string) => void;
  isUnlockedOverride?: boolean;
  isCompact?: boolean;
  currentWeekNumber?: number;
}

/**
 * Dynamic week evaluator for the picks sheet.
 * Extracts the declared week from the active games or falls back cleanly.
 */
export function getDynamicPicksWeek(games: Game[], explicitWeek?: number): number {
  if (games && games.length > 0) {
    const declaredWeek = games.find(g => typeof g.week === 'number' && g.week > 0)?.week;
    if (declaredWeek) return declaredWeek;
  }
  if (explicitWeek && explicitWeek > 0) return explicitWeek;
  return 4;
}

const WeeklyPickGameCard: React.FC<WeeklyPickGameCardProps> = memo(({
  game,
  pickedTeam,
  onPickTeam,
  isUnlockedOverride = false,
  isCompact = false,
  currentWeekNumber
}) => {
  const effectiveWeek = game.week || currentWeekNumber || 4;
  const isAwayPicked = Boolean(pickedTeam && (
    pickedTeam === game.awayTeam || 
    formatTeamCityOrRegion(pickedTeam).toLowerCase() === formatTeamCityOrRegion(game.awayTeam).toLowerCase() ||
    game.awayTeam.toLowerCase().includes(pickedTeam.toLowerCase()) ||
    pickedTeam.toLowerCase().includes(game.awayTeam.toLowerCase())
  ));
  const isHomePicked = Boolean(pickedTeam && (
    pickedTeam === game.homeTeam || 
    formatTeamCityOrRegion(pickedTeam).toLowerCase() === formatTeamCityOrRegion(game.homeTeam).toLowerCase() ||
    game.homeTeam.toLowerCase().includes(pickedTeam.toLowerCase()) ||
    pickedTeam.toLowerCase().includes(game.homeTeam.toLowerCase())
  ));
  const isKickoffLocked = isGameLockedByKickoff(game);
  const isNaturallyLocked = game.status === 'final' || game.status === 'in_progress' || isKickoffLocked;
  const isLocked = isNaturallyLocked && !isUnlockedOverride;

  const handleTeamClick = (team: string) => {
    if (isLocked) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch (e) {}
    onPickTeam(game.gameNumber, team);
  };

  // COMPACT HIGH-DENSITY ROW (Optimized for Mobile scrolling & 1-tap picking)
  if (isCompact) {
    return (
      <div
        className={`bg-white rounded-xl p-2.5 sm:p-3 border transition-all ${
          isLocked 
            ? 'border-slate-300/80 bg-slate-50/70 opacity-90' 
            : pickedTeam 
              ? 'border-emerald-500 bg-emerald-50/20 shadow-2xs ring-1 ring-emerald-400/40' 
              : 'border-slate-200 hover:border-slate-300 shadow-2xs'
        }`}
      >
        {/* Top Mini Header */}
        <div className="flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-[10px] shadow-2xs">
              Week {effectiveWeek} • Game {game.gameNumber}
            </span>
            <span className="text-slate-600 font-semibold text-[10px]">
              {game.day} • {game.kickoffTime}
            </span>
            {game.spread && (
              <span className="text-[10px] text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Line: {game.spread}
              </span>
            )}
            {game.isMNF && (
              <span className="bg-purple-100 text-purple-900 font-black text-[9px] px-1.5 py-0.2 rounded border border-purple-200">
                ★ MNF TB
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isUnlockedOverride && isNaturallyLocked && (
              <span className="text-[9px] font-black text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded border border-amber-300">
                🔓 Unlocked
              </span>
            )}
            {game.status === 'final' && (
              isGameTie(game) ? (
                <span className="text-[10px] font-bold text-sky-950 bg-sky-100 border border-sky-300 px-1.5 py-0.2 rounded shadow-2xs">
                  ⚖️ Final: TIE
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200/80 px-1.5 py-0.2 rounded">
                  Final: {game.officialWinner}
                </span>
              )
            )}
            {game.status === 'in_progress' && (
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded animate-pulse">
                Live ({game.awayScore}-{game.homeScore})
              </span>
            )}
            {game.status === 'scheduled' && (
              isKickoffLocked ? (
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200/90 px-1.5 py-0.2 rounded border border-slate-300">
                  🔒 Locked (Kickoff)
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                  {pickedTeam ? '✓ Picked' : 'Open'}
                </span>
              )
            )}
          </div>
        </div>

        {/* Dense Horizontal Pick Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Away Team Pill */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleTeamClick(game.awayTeam)}
            className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all select-none active:scale-[0.98] ${
              isLocked
                ? isAwayPicked
                  ? isGameTie(game)
                    ? 'bg-sky-100/90 text-sky-950 border-sky-400 font-bold opacity-95 ring-1 ring-sky-300'
                    : 'bg-emerald-800 text-white border-emerald-900 font-bold opacity-90'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                : isAwayPicked
                  ? 'text-white font-black shadow-xs ring-2'
                  : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-300 hover:border-emerald-400 font-bold'
            }`}
            style={{ touchAction: 'manipulation', ...(isAwayPicked && !isLocked ? { backgroundColor: 'var(--theme-header-bg, #1b3a2b)', borderColor: 'var(--theme-secondary, #10b981)' } : {}) }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] opacity-75 font-semibold text-slate-400">
                (Away)
              </span>
              <span className="text-xs sm:text-sm font-extrabold truncate">
                {formatTeamCityOrRegion(game.awayTeam)}
              </span>
              {game.awayRecord && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isAwayPicked ? 'text-emerald-100 bg-emerald-950/80 border border-emerald-600/50' : 'text-slate-600 bg-slate-100 border border-slate-300/80'
                }`}>
                  {game.awayRecord}
                </span>
              )}
              {game.favorite === game.awayTeam && (
                <span className="text-[10px] text-amber-300 font-black" title="Vegas Favorite">★</span>
              )}
            </div>
            {isAwayPicked ? (
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ml-1 shrink-0 ${
                isGameTie(game)
                  ? 'text-sky-900 bg-sky-200/90 border border-sky-300'
                  : 'text-emerald-300 bg-emerald-900/90'
              }`}>
                {isGameTie(game) ? '⚖️ Push' : '✓'}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                {game.awayRecord || ''}
              </span>
            )}
          </button>

          {/* Home Team Pill */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleTeamClick(game.homeTeam)}
            className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all select-none active:scale-[0.98] ${
              isLocked
                ? isHomePicked
                  ? isGameTie(game)
                    ? 'bg-sky-100/90 text-sky-950 border-sky-400 font-bold opacity-95 ring-1 ring-sky-300'
                    : 'bg-emerald-800 text-white border-emerald-900 font-bold opacity-90'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                : isHomePicked
                  ? 'text-white font-black shadow-xs ring-2'
                  : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-300 hover:border-emerald-400 font-bold'
            }`}
            style={{ touchAction: 'manipulation', ...(isHomePicked && !isLocked ? { backgroundColor: 'var(--theme-header-bg, #1b3a2b)', borderColor: 'var(--theme-secondary, #10b981)' } : {}) }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] opacity-75 font-semibold text-slate-400">
                (Home)
              </span>
              <span className="text-xs sm:text-sm font-extrabold truncate">
                {formatTeamCityOrRegion(game.homeTeam)}
              </span>
              {game.homeRecord && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isHomePicked ? 'text-emerald-100 bg-emerald-950/80 border border-emerald-600/50' : 'text-slate-600 bg-slate-100 border border-slate-300/80'
                }`}>
                  {game.homeRecord}
                </span>
              )}
              {game.favorite === game.homeTeam && (
                <span className="text-[10px] text-amber-300 font-black" title="Vegas Favorite">★</span>
              )}
            </div>
            {isHomePicked ? (
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ml-1 shrink-0 ${
                isGameTie(game)
                  ? 'text-sky-900 bg-sky-200/90 border border-sky-300'
                  : 'text-emerald-300 bg-emerald-900/90'
              }`}>
                {isGameTie(game) ? '⚖️ Push' : '✓'}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                {game.homeRecord || ''}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // STANDARD CARDS VIEW
  return (
    <div
      className={`bg-white rounded-xl p-3.5 sm:p-4 border transition-all ${
        isLocked 
          ? 'border-slate-300/80 bg-slate-50/70 opacity-90' 
          : pickedTeam 
            ? 'border-emerald-500 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-400/50' 
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Game Header */}
      <div className="flex items-center justify-between text-xs mb-2.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded text-[11px] shadow-2xs">
            Week {effectiveWeek} • Game {game.gameNumber}
          </span>
          <span className="text-slate-600 font-semibold">
            {game.day} • {game.kickoffTime}
          </span>
          {game.spread && (
            <span className="text-[11px] text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Line: {game.spread}
            </span>
          )}
          {game.isMNF && (
            <span className="bg-purple-100 text-purple-900 font-extrabold text-[10px] px-2 py-0.5 rounded border border-purple-300 shadow-2xs">
              ★ MNF Tiebreaker Game
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5">
          {isUnlockedOverride && isNaturallyLocked && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-300">
              🔓 Unlocked
            </span>
          )}
          {game.status === 'final' && (
            isGameTie(game) ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-950 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded shadow-2xs">
                <span>⚖️</span>
                Final: TIE (Push)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3 text-slate-500" />
                Final: {game.officialWinner}
              </span>
            )
          )}
          {game.status === 'in_progress' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded animate-pulse shadow-2xs">
              <Clock className="w-3 h-3 text-amber-800" />
              Live: {game.quarter || '4Q'} ({game.awayScore} - {game.homeScore})
            </span>
          )}
          {game.status === 'scheduled' && (
            isKickoffLocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-300">
                <Lock className="w-3 h-3 text-slate-500" />
                Locked (Kickoff Passed)
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                ✓ Open to Pick
              </span>
            )
          )}
        </div>
      </div>

      {/* Matchup Selection Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Away Team Button */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => handleTeamClick(game.awayTeam)}
          className={`flex flex-col items-center justify-center min-h-[64px] sm:min-h-[70px] p-3 sm:p-3.5 rounded-xl border-2 transition-all text-center select-none active:scale-[0.98] ${
            isLocked
              ? isAwayPicked
                ? 'bg-emerald-800 text-white border-emerald-900 font-bold opacity-90'
                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
              : isAwayPicked
                ? 'text-white font-black shadow-md ring-2'
                : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-300 hover:border-emerald-400 font-bold'
          }`}
          style={{ touchAction: 'manipulation', ...(isAwayPicked && !isLocked ? { backgroundColor: 'var(--theme-header-bg, #1b3a2b)', borderColor: 'var(--theme-secondary, #10b981)' } : {}) }}
        >
          <div className="text-[11px] text-slate-500 font-medium mb-0.5">
            Away Team
          </div>
          <div className="text-sm sm:text-base font-black flex items-center justify-center gap-1">
            <span>{formatTeamCityOrRegion(game.awayTeam)}</span>
            {game.favorite === game.awayTeam && (
              <span className="text-amber-400 text-xs" title="Vegas Favorite">★</span>
            )}
          </div>
          {game.awayRecord && (
            <div className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 border ${
              isAwayPicked ? 'text-emerald-100 bg-emerald-950/80 border-emerald-600/60' : 'text-slate-700 bg-slate-100 border-slate-300'
            }`}>
              Record: {game.awayRecord}
            </div>
          )}
          {isAwayPicked && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 text-emerald-300" />
              <span>YOUR PICK</span>
            </div>
          )}
        </button>

        {/* Home Team Button */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => handleTeamClick(game.homeTeam)}
          className={`flex flex-col items-center justify-center min-h-[64px] sm:min-h-[70px] p-3 sm:p-3.5 rounded-xl border-2 transition-all text-center select-none active:scale-[0.98] ${
            isLocked
              ? isHomePicked
                ? 'bg-emerald-800 text-white border-emerald-900 font-bold opacity-90'
                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
              : isHomePicked
                ? 'text-white font-black shadow-md ring-2'
                : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-300 hover:border-emerald-400 font-bold'
          }`}
          style={{ touchAction: 'manipulation', ...(isHomePicked && !isLocked ? { backgroundColor: 'var(--theme-header-bg, #1b3a2b)', borderColor: 'var(--theme-secondary, #10b981)' } : {}) }}
        >
          <div className="text-[11px] text-slate-500 font-medium mb-0.5">
            Home Team
          </div>
          <div className="text-sm sm:text-base font-black flex items-center justify-center gap-1">
            <span>{formatTeamCityOrRegion(game.homeTeam)}</span>
            {game.favorite === game.homeTeam && (
              <span className="text-amber-400 text-xs" title="Vegas Favorite">★</span>
            )}
          </div>
          {game.homeRecord && (
            <div className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 border ${
              isHomePicked ? 'text-emerald-100 bg-emerald-950/80 border-emerald-600/60' : 'text-slate-700 bg-slate-100 border-slate-300'
            }`}>
              Record: {game.homeRecord}
            </div>
          )}
          {isHomePicked && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 text-emerald-300" />
              <span>YOUR PICK</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
});

export const WeeklyPicksTab: React.FC<WeeklyPicksTabProps> = memo(({
  games,
  players,
  activePlayer,
  onSelectPlayer,
  allPicks,
  onSavePicks,
  onViewLeaderboard,
  isCompactMode = true,
  currentWeek,
  seasonHistory
}) => {
  const activeWeekNumber = useMemo(() => getDynamicPicksWeek(games, currentWeek), [games, currentWeek]);

  // Determine latest compiled week and current reigning weekly winner for banner
  const latestCompiledWeek = seasonHistory?.compiledWeeks && seasonHistory.compiledWeeks.length > 0
    ? Math.max(...seasonHistory.compiledWeeks)
    : 1;

  const reigningWinnerInfo = useMemo(() => {
    if (!seasonHistory?.records) return null;
    let champName = '';
    let champWins = 0;
    for (const [name, rec] of Object.entries(seasonHistory.records) as [string, any][]) {
      const wkData = rec?.weeklyBreakdown?.[latestCompiledWeek];
      if (wkData?.isWinner) {
        champName = name;
        champWins = wkData.wins ?? 0;
        break;
      }
    }
    if (!champName) {
      let maxW = -1;
      for (const [name, rec] of Object.entries(seasonHistory.records) as [string, any][]) {
        const wWins = rec?.weeklyBreakdown?.[latestCompiledWeek]?.wins ?? -1;
        if (wWins > maxW) {
          maxW = wWins;
          champName = name;
          champWins = wWins;
        }
      }
    }
    return champName ? { name: champName, wins: champWins, week: latestCompiledWeek } : null;
  }, [seasonHistory, latestCompiledWeek]);

  // Local state for the current active form
  const [selectedPicks, setSelectedPicks] = useState<Record<number, string>>({});
  const [tiebreakerInput, setTiebreakerInput] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isUnlockedOverride, setIsUnlockedOverride] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout & Collapsible states
  const [viewStyle, setViewStyle] = useState<'compact' | 'cards'>(() => isCompactMode ? 'compact' : 'cards');
  const [isContenderGridOpen, setIsContenderGridOpen] = useState<boolean>(() => !activePlayer);
  const prevPlayerRef = useRef<string | null>(null);
  const prevWeekRef = useRef<number>(activeWeekNumber);

  // Auto-Save Execution Engine: Debounced non-blocking sync to localStorage and server
  const triggerAutoSave = useCallback((picksToSave: Record<number, string>, currentTbInput: string, player = activePlayer) => {
    if (!player) return;
    setSaveStatus('saving');
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      const existingTb = allPicks[player.name]?.tiebreaker;
      let tbNumber: number | '' = (existingTb !== undefined && existingTb !== null && existingTb !== '') ? existingTb : '';
      if (currentTbInput.trim() !== '') {
        const parsed = Number(currentTbInput);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 150) {
          tbNumber = parsed;
        }
      }
      onSavePicks(player.name, picksToSave, tbNumber, isUnlockedOverride);
      setSaveStatus('saved');
    }, 300);
  }, [activePlayer, allPicks, onSavePicks, isUnlockedOverride]);

  // Clear pick sheet when pool advances to a new week
  useEffect(() => {
    if (prevWeekRef.current !== activeWeekNumber) {
      prevWeekRef.current = activeWeekNumber;
      setSelectedPicks({});
      setTiebreakerInput('');
      setSaveStatus('idle');
      setErrorMessage(null);
    }
  }, [activeWeekNumber]);

  // Sync state when activePlayer or allPicks change
  useEffect(() => {
    if (activePlayer) {
      const isNewPlayer = prevPlayerRef.current !== activePlayer.name;
      prevPlayerRef.current = activePlayer.name;
      const rawExisting = allPicks[activePlayer.name];
      const existing = (rawExisting && rawExisting.week === activeWeekNumber)
        ? rawExisting
        : { contenderName: activePlayer.name, picks: {}, tiebreaker: '' as const, week: activeWeekNumber };

      if (isNewPlayer) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
          autoSaveTimerRef.current = null;
        }
        // Strictly load ONLY this contender's saved picks for the active week;
        // never bleed a previously viewed contender's picks or tiebreaker into a newly selected contender.
        if (existing && Object.keys(existing.picks || {}).length > 0) {
          setSelectedPicks({ ...existing.picks });
        } else {
          setSelectedPicks({});
        }
        if (existing && existing.tiebreaker !== undefined && existing.tiebreaker !== null && existing.tiebreaker !== '' && Object.keys(existing.picks || {}).length > 0) {
          setTiebreakerInput(String(existing.tiebreaker));
        } else {
          setTiebreakerInput('');
        }
      } else if (existing) {
        // If picks were reset to a clean slate (0 picks submitted for new week)
        if (Object.keys(existing.picks || {}).length === 0) {
          setSelectedPicks({});
          setTiebreakerInput('');
        } else {
          // Merge in background cloud updates while filtering any stale teams not in current games
          setSelectedPicks(prev => {
            const merged = { ...existing.picks, ...prev };
            const validMerged: Record<number, string> = {};
            for (const [gNumStr, teamVal] of Object.entries(merged)) {
              if (typeof teamVal !== 'string' || !teamVal) continue;
              const gNum = parseInt(gNumStr, 10);
              const g = games.find(item => item.gameNumber === gNum);
              if (g) {
                const away = g.awayTeam.toLowerCase();
                const home = g.homeTeam.toLowerCase();
                const picked = teamVal.toLowerCase();
                if (away.includes(picked) || picked.includes(away) || home.includes(picked) || picked.includes(home)) {
                  validMerged[gNum] = teamVal;
                }
              }
            }
            return validMerged;
          });
          if (existing.tiebreaker !== undefined && existing.tiebreaker !== '' && !tiebreakerInput) {
            setTiebreakerInput(String(existing.tiebreaker));
          }
        }
      }
      setErrorMessage(null);
    }
  }, [activePlayer, allPicks, games, activeWeekNumber, triggerAutoSave]);

  const handlePickTeam = (gameNumber: number, team: string) => {
    if (!activePlayer) {
      setIsContenderGridOpen(true);
      setErrorMessage("Please tap your name from the roster above to lock in your picks.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const updated = {
      ...selectedPicks,
      [gameNumber]: team
    };
    setSelectedPicks(updated);
    setErrorMessage(null);
    triggerAutoSave(updated, tiebreakerInput);
  };

  // Quick helper to fill remaining blank unlocked games with favorites
  const handleQuickFillFavorites = () => {
    if (!activePlayer) {
      setIsContenderGridOpen(true);
      setErrorMessage("Please tap your name from the roster above before filling picks.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const basePicks = { ...(allPicks[activePlayer.name]?.picks || {}), ...selectedPicks };
    const { picks: updated, filledCount } = applyBlankOnlyFavorites(basePicks, games, { allowLockedGames: false });
    let newTb = tiebreakerInput;
    let tbFilled = false;
    if (!tiebreakerInput) {
      newTb = String(resolveDefaultMnfTiebreaker(games));
      setTiebreakerInput(newTb);
      tbFilled = true;
    }
    setSelectedPicks(updated);
    setErrorMessage(null);
    if (filledCount > 0 || tbFilled) {
      triggerAutoSave(updated, newTb);
    }
  };

  const handleTiebreakerChange = (val: string) => {
    setTiebreakerInput(val);
    setErrorMessage(null);
    if (activePlayer && Object.keys(selectedPicks).length > 0) {
      triggerAutoSave(selectedPicks, val);
    }
  };

  const handleClearPicks = () => {
    if (window.confirm("Clear your unlocked pick selections on this sheet? (Locked/final games remain intact)")) {
      const currentEffective = activePlayer ? { ...(allPicks[activePlayer.name]?.picks || {}), ...selectedPicks } : selectedPicks;
      const preservedLocked = sanitizeClientSubmissionPicks(currentEffective, {}, games, {
        adminOverride: isUnlockedOverride,
        allowClearUnlocked: true
      });
      const mnfGame = games.find(g => g.isMNF);
      const keepMnfTb = Boolean(!isUnlockedOverride && mnfGame && isGameLockedAtTime(mnfGame));
      const nextTb = keepMnfTb ? tiebreakerInput : '';
      setSelectedPicks(preservedLocked);
      if (!keepMnfTb) {
        setTiebreakerInput('');
      }
      if (activePlayer) {
        onSavePicks(activePlayer.name, preservedLocked, nextTb !== '' ? Number(nextTb) : '', isUnlockedOverride, true);
        setSaveStatus('saved');
      }
    }
  };

  const effectivePicks = activePlayer ? { ...(allPicks[activePlayer.name]?.picks || {}), ...selectedPicks } : selectedPicks;
  const pickedCount = Object.keys(effectivePicks).filter(k => effectivePicks[Number(k)]).length;
  const isComplete = pickedCount === games.length && games.length > 0;
  const activeContenders = players.filter(p => p.isActive !== false);



  return (
    <div className="max-w-3xl mx-auto py-3 px-2 sm:px-4 pb-20 md:pb-8">
      {/* Reigning Weekly Champion Spotlight Banner */}
      {reigningWinnerInfo && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-emerald-500/10 border-2 border-amber-400/70 rounded-2xl p-3 sm:p-3.5 mb-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl select-none shrink-0">👑</span>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                Reigning Week {reigningWinnerInfo.week} Champion
              </div>
              <div className="text-sm font-black text-emerald-950 truncate flex items-center gap-1.5">
                <span>{reigningWinnerInfo.name}</span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.2 rounded-md border border-amber-300 shrink-0">
                  {reigningWinnerInfo.wins} Wins
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewLeaderboard}
            className="hidden sm:inline-flex items-center gap-1 bg-amber-200/90 hover:bg-amber-300/90 text-amber-950 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-300 transition-all cursor-pointer shrink-0"
          >
            <span>View Standings Vault</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1-Tap Contender Selector Banner (Collapsible to save vertical screen space) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-emerald-700/30 shadow-2xs mb-3">
        {/* Header with Title & Collapse Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
              Step 1
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {activePlayer ? `Contender: ${activePlayer.name}` : 'Tap Your Name to Begin'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Full Grid */}
            <button
              type="button"
              onClick={() => setIsContenderGridOpen(prev => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 cursor-pointer"
            >
              {isContenderGridOpen ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide Grid</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>{activePlayer ? `Switch (${activeContenders.length})` : 'Show Roster'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              title="Help & phone home screen instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Rules</span>
            </button>
          </div>
        </div>

        {/* Collapsible 1-Tap Name Grid */}
        {isContenderGridOpen ? (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-600 mb-2">
              Tap your name below. No password or login needed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-2">
              {activeContenders.map(p => {
                const isSelected = activePlayer?.id === p.id;
                const hasExistingPicks = !!allPicks[p.name]?.picks && Object.keys(allPicks[p.name].picks).length > 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPlayer(p);
                      if (window.innerWidth < 768) {
                        setIsContenderGridOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl font-black text-xs border-2 transition-all cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'text-white shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                    style={{
                      touchAction: 'manipulation',
                      ...(isSelected ? {
                        backgroundColor: 'var(--theme-header-bg, #1b3a2b)',
                        borderColor: 'var(--theme-border-accent, #10b981)',
                        boxShadow: '0 0 0 2px var(--theme-accent, #10b981)'
                      } : {})
                    }}
                  >
                    <div className="flex items-center gap-1 truncate">
                      {p.isDefendingChamp && <span title="Defending Champ">🏆</span>}
                      <span className="truncate">{p.name}</span>
                    </div>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    ) : hasExistingPicks ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Picks on file" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Slim Collapsed Status Banner */
          <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs">
            <div className="text-emerald-950 font-medium flex items-center gap-1.5 truncate">
              <span>Picking for:</span>
              <strong className="font-black text-emerald-900 text-xs sm:text-sm truncate">
                {activePlayer ? activePlayer.name : 'No contender selected'}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setIsContenderGridOpen(true)}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer shrink-0 ml-2"
            >
              {activePlayer ? 'Change Name' : 'Select Name'}
            </button>
          </div>
        )}
      </div>

      {/* Week Schedule & Controls Banner (Slim & Collapsible) */}
      <div 
        className="text-white rounded-2xl p-3 sm:p-4 mb-3 shadow-md"
        style={{ backgroundColor: 'var(--theme-header-bg, #1b3a2b)' }}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              Branham Hills Straight-Up Sheet
            </div>
            <h3 className="text-sm sm:text-base font-black text-white">
              Week {activeWeekNumber} Picks ({games.length} Matchups)
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Mode Toggle: Dense Compact vs Cards */}
            <div className="flex items-center bg-emerald-950/90 p-0.5 rounded-lg border border-emerald-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewStyle('compact')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewStyle === 'compact' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Compact row view - fits more games on screen"
              >
                <List className="w-3 h-3" />
                <span className="hidden sm:inline">Compact</span>
              </button>
              <button
                type="button"
                onClick={() => setViewStyle('cards')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewStyle === 'cards' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Card view with big buttons"
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            {/* Pick Progress Counter */}
            <div className="bg-emerald-900/90 border border-emerald-600/80 px-2.5 py-1 rounded-lg text-xs font-black text-white flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isComplete ? 'text-emerald-400' : 'text-amber-300'}`} />
              <span>{pickedCount}/{games.length}</span>
            </div>

            {/* Unlock All Toggle */}
            <button
              type="button"
              onClick={() => setIsUnlockedOverride(prev => !prev)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                isUnlockedOverride 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' 
                  : 'bg-emerald-800/80 text-emerald-200 border-emerald-600 hover:bg-emerald-700 hover:text-white'
              }`}
              title="Unlock all past games to edit"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">{isUnlockedOverride ? 'Locked' : 'Unlock'}</span>
            </button>
          </div>
        </div>

        {/* Action Shortcuts Bar */}
        <div className="mt-2.5 pt-2 border-t border-emerald-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="text-emerald-200/90 text-[11px] font-medium hidden sm:inline">
            Tap either <strong>Away</strong> or <strong>Home</strong> on each game.
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={handleQuickFillFavorites}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-emerald-900/70 hover:bg-emerald-850 px-2.5 py-1 rounded-lg border border-emerald-700 cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Auto-Fill Favorites</span>
            </button>
            {pickedCount > 0 && (
              <button
                type="button"
                onClick={handleClearPicks}
                className="text-[11px] font-bold text-rose-300 hover:text-rose-200 bg-emerald-900/70 hover:bg-emerald-850 px-2.5 py-1 rounded-lg border border-emerald-700 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-3 bg-red-50 border-2 border-red-400 p-3 rounded-xl flex items-start gap-2.5 text-xs text-red-900 shadow-sm animate-bounce">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="font-bold">{errorMessage}</div>
        </div>
      )}

      {/* Live Auto-Save Status Banner */}
      {pickedCount > 0 && (
        <div className="mb-3 bg-emerald-50 border-2 border-emerald-400 p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base select-none shrink-0">
              {saveStatus === 'saving' ? '⏳' : '⚡'}
            </span>
            <div className="text-xs text-emerald-950 font-bold min-w-0 truncate">
              <span>{pickedCount} of {games.length} games selected</span>
              <span className="hidden sm:inline font-normal text-emerald-800 ml-1.5">
                • {saveStatus === 'saving' ? 'Auto-saving to official board...' : '✓ Auto-saved to pool board • Locks at kickoff'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-md bg-emerald-700 text-white shadow-2xs">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>Auto-Saved</span>
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* 16 Matchup Cards / Rows */}
      <form onSubmit={(e) => e.preventDefault()} className={viewStyle === 'compact' ? 'space-y-2' : 'space-y-3'}>
        {games.map((game) => (
          <WeeklyPickGameCard
            key={game.gameNumber}
            game={game}
            pickedTeam={selectedPicks[game.gameNumber] || effectivePicks[game.gameNumber] || (effectivePicks as any)[String(game.gameNumber)]}
            onPickTeam={handlePickTeam}
            isUnlockedOverride={isUnlockedOverride}
            isCompact={viewStyle === 'compact'}
            currentWeekNumber={activeWeekNumber}
          />
        ))}

        {/* Monday Night Tiebreaker Card */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-purple-400 shadow-sm mt-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                Official Tiebreaker
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                🏈 Monday Night Combined Points Prediction
              </h3>
            </div>
            <span className="text-[10px] font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
              1st Place Decider
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
            Closest guess to total combined MNF score wins weekly tiebreakers. Auto-saves as you type.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="w-full sm:w-1/2">
              <label htmlFor="tiebreaker-field" className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                Your Total Points Guess
              </label>
              <input
                id="tiebreaker-field"
                type="number"
                min="0"
                max="150"
                step="1"
                placeholder="e.g. 45"
                value={tiebreakerInput}
                onChange={(e) => handleTiebreakerChange(e.target.value)}
                className="w-full bg-purple-50/50 border-2 border-purple-400 rounded-xl px-3.5 py-2.5 text-lg font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                style={{ touchAction: 'manipulation' }}
              />
            </div>

            <div className="w-full sm:w-1/2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div className="font-black text-slate-900 mb-0.5">
                Pool Tiebreaker Rule:
              </div>
              <div className="text-slate-600 leading-relaxed text-[11px]">
                Applies solely to resolve a tie for <strong>1st place weekly rank</strong>. <strong>0 bonus points</strong> awarded.
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Auto-Save Status & Verification Bar */}
        <div className="pt-2 pb-6">
          <div 
            className="text-white p-4 rounded-2xl border-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors"
            style={{
              backgroundColor: 'var(--theme-header-bg, #0f291e)',
              borderColor: 'var(--theme-border-accent, #10b981)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'var(--theme-card-bg, rgba(6, 78, 59, 0.8))',
                  borderColor: 'var(--theme-border, rgba(16, 185, 129, 0.5))'
                }}
              >
                {saveStatus === 'saving' ? (
                  <RefreshCw className="w-5 h-5 text-amber-300 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--theme-accent, #34d399)' }} />
                )}
              </div>
              <div>
                <div className="text-sm font-black flex items-center gap-2">
                  <span>{saveStatus === 'saving' ? 'Auto-Saving to Board...' : 'All Picks Saved Automatically'}</span>
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: 'var(--theme-card-bg, #064e3b)',
                      borderColor: 'var(--theme-border, #10b981)',
                      color: 'var(--theme-accent, #6ee7b7)'
                    }}
                  >
                    {saveStatus === 'saving' ? 'Syncing' : 'Live'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-200/90 font-medium mt-0.5">
                  {activePlayer ? `${activePlayer.name}: ` : ''}{pickedCount} of {games.length} games selected • Editable anytime before kickoff
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewLeaderboard}
              className="w-full sm:w-auto font-black text-xs px-4 py-2.5 rounded-xl border shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 hover:brightness-110"
              style={{
                backgroundColor: 'var(--theme-button-bg, #fbbf24)',
                color: 'var(--theme-button-text, #0f172a)',
                borderColor: 'var(--theme-border-accent, #f59e0b)'
              }}
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard & Matrix</span>
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
            Straight-up pool • 1-tap picks auto-save immediately • Locks at kickoff
          </p>
        </div>
      </form>

      {/* STICKY FLOATING AUTO-SAVE PROGRESS BAR ON MOBILE */}
      <div 
        className="md:hidden fixed bottom-14 left-0 right-0 z-30 p-2 bg-slate-950/95 backdrop-blur-md border-t shadow-2xl flex items-center justify-between gap-2 px-3"
        style={{ borderColor: 'var(--theme-border-accent, #064e3b)' }}
      >
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' ? (
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <CheckCircle2 className={`w-4 h-4 ${isComplete ? 'text-emerald-400' : 'text-emerald-500'}`} />
          )}
          <div className="text-xs">
            <span className="font-black text-white">
              {pickedCount}/{games.length} Picked
            </span>
            <span className="text-[10px] text-emerald-400 font-bold ml-1.5">
              {saveStatus === 'saving' ? 'Saving...' : '✓ Auto-Saved'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewLeaderboard}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <Trophy className="w-3.5 h-3.5 text-slate-950" />
          <span>Matrix</span>
        </button>
      </div>

      {/* Help & Setup Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
});
