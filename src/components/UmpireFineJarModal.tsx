import React, { useState, memo } from 'react';
import { X, Flag, Plus, Check, Heart, Trophy, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { FineItem, Player } from '../types';
import { getPoolConfig } from '../config/leagueConfig';

interface UmpireFineJarModalProps {
  isOpen: boolean;
  onClose: () => void;
  fines: FineItem[];
  players: Player[];
  onAddFine: (contenderName: string, reason: string, amount?: number) => void;
  onTogglePaid: (fineId: string) => void;
}

const FineRowItem: React.FC<{
  fine: FineItem;
  unitSingular: string;
  unitPlural: string;
  onTogglePaid: (fineId: string) => void;
}> = memo(({ fine, unitSingular, unitPlural, onTogglePaid }) => {
  const unitLabel = fine.amount === 1 ? unitSingular : unitPlural;
  return (
    <div
      className={`p-2 rounded-lg border flex items-center justify-between gap-2 transition-colors ${
        fine.paid
          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200/80'
          : 'bg-amber-400/15 border-amber-400/50 text-amber-100 shadow-2xs'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-white text-[11px] truncate">{fine.contenderName}</span>
          <span className="font-mono font-bold text-[10px] px-1.5 rounded bg-black/40 text-amber-300">
            {fine.amount} {unitLabel}
          </span>
          {fine.paid ? (
            <span className="text-[9px] font-semibold text-emerald-400">Cleared</span>
          ) : (
            <span className="text-[9px] font-bold text-amber-300">Active</span>
          )}
        </div>
        <p className="text-[10px] text-slate-300 truncate mt-0.5">
          {fine.reason}
        </p>
      </div>

      <button
        onClick={() => onTogglePaid(fine.id)}
        className={`p-1.5 rounded-lg border font-bold text-[10px] shrink-0 cursor-pointer transition-all ${
          fine.paid
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-xs'
        }`}
        title={fine.paid ? 'Mark active' : 'Clear citation'}
      >
        <Check className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export const UmpireFineJarModal: React.FC<UmpireFineJarModalProps> = memo(({
  isOpen,
  onClose,
  fines,
  players,
  onAddFine,
  onTogglePaid
}) => {
  const poolConfig = getPoolConfig();
  const unitSingular = poolConfig.rules.penaltyUnitSingular || 'Flag';
  const unitPlural = poolConfig.rules.penaltyUnitPlural || 'Flags';

  const [selectedContender, setSelectedContender] = useState<string>(
    players.find(p => !p.isElvis)?.name || players[0]?.name || 'Commissioner'
  );
  const [fineAmount, setFineAmount] = useState<number>(1);
  const [customReason, setCustomReason] = useState<string>('');
  const [quickReason, setQuickReason] = useState<string>('Arguing with the Commissioner');
  const [showRules, setShowRules] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalCollected = fines.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fines.filter(f => !f.paid).reduce((sum, f) => sum + f.amount, 0);
  const totalFund = totalCollected + totalPending;
  const totalUnitLabel = totalFund === 1 ? unitSingular : unitPlural;

  const presetReasons = [
    'Arguing with the Commissioner',
    'Submitted picks without City / Place names (e.g. just mascot)',
    'Microscopic type size on submitted picks',
    'Spent way too much time debating lock times 😂',
    'Questionable loyalty pick against the spread',
    'Disputing Monday Night tiebreaker score',
    'Late submission without written excuse',
    'Bragging about championship streaks'
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() || quickReason;
    onAddFine(selectedContender, finalReason, fineAmount || 1);
    setCustomReason('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" style={{ contain: 'strict' }}>
      <div 
        className="relative max-w-[370px] sm:max-w-[390px] w-full my-auto animate-in fade-in zoom-in-95 duration-150 select-none contain-modal"
        style={{ contain: 'layout paint' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-2 z-20 bg-slate-800 hover:bg-slate-900 text-white p-1.5 rounded-full border-2 border-slate-600 shadow-md cursor-pointer transition-transform hover:scale-105"
          title="Close Jar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Metal Screw Lid of the Jar */}
        <div className="mx-auto w-40 h-6 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-t-xl border-2 border-b-0 border-slate-500 shadow-sm relative flex items-center justify-between px-3">
          <div className="flex gap-1.5 justify-center w-full">
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
            <div className="w-1.5 h-3.5 bg-slate-400/80 rounded-xs shadow-inner" />
          </div>
          <div className="absolute inset-x-12 top-0.5 h-1 bg-slate-600 rounded-full shadow-inner" />
        </div>

        {/* 2. Jar Glass Collar / Ring */}
        <div className="mx-auto w-48 h-2.5 bg-gradient-to-r from-slate-300 via-white to-slate-300 border-x-2 border-slate-400 shadow-xs" />

        {/* 3. Glass Jar Body */}
        <div className="bg-gradient-to-b from-emerald-950/95 via-emerald-900/95 to-slate-900/98 rounded-3xl border-3 border-emerald-500/50 shadow-2xl overflow-hidden backdrop-blur-md relative text-white contain-modal" style={{ contain: 'layout paint' }}>
          <div className="absolute top-2 left-3 bottom-2 w-1.5 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <div className="absolute top-3 left-6 w-12 h-1 bg-white/30 rounded-full blur-[0.5px] pointer-events-none" />

          {/* Masking Tape / Kraft Paper Label on Jar */}
          <div className="pt-4 px-4 text-center">
            <div className="bg-amber-100/95 border border-amber-300 shadow-md rounded-lg py-2 px-3 rotate-[-0.5deg]">
              <div className="flex items-center justify-center gap-1.5 text-amber-950">
                <Flag className="w-4 h-4 text-amber-800 shrink-0" />
                <h3 className="text-sm sm:text-base font-black tracking-tight uppercase leading-none">
                  {poolConfig.rules.penaltyJarTitle}
                </h3>
              </div>
              <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-0.5">
                Pool Tradition &amp; Honor Citations • Non-Monetary
              </p>
            </div>
          </div>

          {/* Penalty Count Inside the Jar Display */}
          <div className="px-4 py-3 text-center">
            <div className="bg-emerald-900/70 border border-emerald-400/40 rounded-2xl py-2 px-3 shadow-inner">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Total Penalty {unitPlural} in the Jar
              </span>
              <div className="flex items-center justify-center gap-1.5 font-mono font-black text-2xl sm:text-3xl text-amber-300 drop-shadow-sm">
                <span>{totalFund} {totalUnitLabel}</span>
              </div>
              <div className="flex justify-center gap-3 text-[11px] font-semibold text-emerald-100 mt-1">
                <span className="text-emerald-300 font-bold">{totalCollected} Cleared</span>
                <span className="text-white/40">•</span>
                <span className="text-amber-200 font-bold">{totalPending} Active</span>
              </div>
            </div>
          </div>

          {/* Collapsible Rules Dropdown */}
          <div className="px-4 pb-2">
            <button
              onClick={() => setShowRules(!showRules)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-emerald-200 bg-emerald-900/50 hover:bg-emerald-800/50 px-3 py-1.5 rounded-xl border border-emerald-700/50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                The 4 Golden Umpire Rules (1 {unitSingular} Each)
              </span>
              {showRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showRules && (
              <div className="mt-1.5 p-2.5 bg-emerald-950/90 rounded-xl border border-amber-400/30 text-[10px] space-y-1 text-emerald-100 animate-in fade-in duration-150">
                <p><strong>#1:</strong> 1 {unitSingular} for arguing with the Commissioner.</p>
                <p><strong>#2:</strong> 1 {unitSingular} for submitting picks without City / Place names.</p>
                <p><strong>#3:</strong> 1 {unitSingular} for microscopic type size.</p>
                <p><strong>#4:</strong> 1 {unitSingular} for unexcused cellar-dwelling or whining.</p>
              </div>
            )}
          </div>

          {/* Citation Insertion Form */}
          <form onSubmit={handleAdd} className="px-4 pb-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-0.5">
                  Offender:
                </label>
                <select
                  value={selectedContender}
                  onChange={(e) => setSelectedContender(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-emerald-600 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400"
                >
                  {players.filter(p => !p.isElvis).map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-0.5">
                  Citation Severity:
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 5].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFineAmount(amt)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                        fineAmount === amt
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                          : 'bg-slate-900 text-emerald-200 border-emerald-700/60 hover:bg-slate-800'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-300 block mb-0.5">
                Standard Rule Preset:
              </label>
              <select
                value={quickReason}
                onChange={(e) => {
                  setQuickReason(e.target.value);
                  if (e.target.value.includes('Spent way too much time')) {
                    setFineAmount(3);
                  }
                }}
                className="w-full bg-slate-900 text-white border border-emerald-600 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-amber-400 truncate"
              >
                {presetReasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-300 block mb-0.5">
                Custom Infraction Descriptor (Write-In):
              </label>
              <input
                type="text"
                placeholder={`Or write custom reason (e.g. 1 ${unitSingular} for questionable chalk pick)...`}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full bg-slate-900 text-white placeholder-slate-400 border border-emerald-600 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Throw {fineAmount} {fineAmount === 1 ? unitSingular : unitPlural} on {selectedContender}</span>
            </button>
          </form>

          {/* Scrollable Citation Ledger */}
          <div className="px-4 pb-3 contain-content" style={{ contain: 'content' }}>
            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
              <span>Citations ({fines.length})</span>
              <span className="text-[9px] text-emerald-400/80">Tap check to clear</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs contain-content" style={{ contain: 'content' }}>
              {fines.map(fine => (
                <FineRowItem
                  key={fine.id}
                  fine={fine}
                  unitSingular={unitSingular}
                  unitPlural={unitPlural}
                  onTogglePaid={onTogglePaid}
                />
              ))}
            </div>
          </div>

          {/* Compliance & Honor Footer */}
          <div className="bg-slate-950/90 px-3 py-2 border-t border-emerald-800/60 flex flex-col items-center justify-center text-center gap-0.5 text-[10px] text-emerald-200">
            <span className="flex items-center gap-1 font-bold text-amber-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Strictly for Comedic Banter &amp; Bragging Rights • Zero Monetary Value
            </span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-300/80">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              In honor of {poolConfig.consultantName} — Commissioner for Life
            </span>
          </div>

        </div>
      </div>
    </div>
  );
});
