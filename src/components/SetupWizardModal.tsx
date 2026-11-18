import React, { useState, memo, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Sliders,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Scale,
  Flag,
  Bot,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import {
  PoolConfig,
  EditionTier,
  TiebreakerRule,
  MissedPickRule,
  getPoolConfig,
  resolveMaxContendersForTier
} from '../config/leagueConfig';

interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig: PoolConfig;
  onSaveConfig: (next: PoolConfig) => void;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = memo(({
  isOpen,
  onClose,
  initialConfig,
  onSaveConfig
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<PoolConfig>(initialConfig);
  const [disclaimerChecked, setDisclaimerChecked] = useState<boolean>(
    Boolean(initialConfig.disclaimerAcceptedAt)
  );
  const [commitmentChecked, setCommitmentChecked] = useState<boolean>(
    Boolean(initialConfig.commissionerCommitmentAccepted)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const latest = getPoolConfig();
      setDraft(latest);
      setDisclaimerChecked(Boolean(latest.disclaimerAcceptedAt));
      setCommitmentChecked(Boolean(latest.commissionerCommitmentAccepted));
      setValidationError(null);
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canProceedCharter = disclaimerChecked && commitmentChecked;

  const handleSelectTier = (tier: EditionTier) => {
    setDraft(prev => ({
      ...prev,
      editionTier: tier,
      maxContenders: resolveMaxContendersForTier(tier),
      rules: {
        ...prev.rules,
        enableLoreAndQuotes: tier === 'opensource' ? false : prev.rules.enableLoreAndQuotes
      }
    }));
  };

  const handleSaveAndLaunch = (useDefaults: boolean) => {
    const base = useDefaults ? initialConfig : draft;
    const finalized: PoolConfig = {
      ...base,
      isSetupCompleted: true,
      disclaimerAcceptedAt: base.disclaimerAcceptedAt || new Date().toISOString(),
      commissionerCommitmentAccepted: true,
      maxContenders: resolveMaxContendersForTier(base.editionTier),
      noAdsGuarantee: true
    };
    onSaveConfig(finalized);
    onClose();
  };

  const handleNextStep = () => {
    setValidationError(null);
    if (step === 1 && !canProceedCharter) {
      setValidationError('Please accept both the Zero-Wagering Charter and the Commissioner Commitment Pact to continue.');
      return;
    }
    if (step === 2) {
      if (!draft.poolName.trim()) {
        setValidationError('Pool Name is required.');
        return;
      }
      if (!/^\d{4}$/.test(draft.adminPin.trim())) {
        setValidationError('Admin PIN must be a 4-digit number.');
        return;
      }
    }
    setStep(prev => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3));
  };

  const handleQuickAcceptDefaults = () => {
    setDisclaimerChecked(true);
    setCommitmentChecked(true);
    handleSaveAndLaunch(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="setup-wizard-title"
      >
        {/* Header */}
        <div
          className="text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-emerald-800/50"
          style={{ background: 'var(--theme-header-bg, #022c22)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-inner shrink-0">
              ⚙️
            </div>
            <div>
              <h2 id="setup-wizard-title" className="text-base sm:text-lg font-black tracking-tight">
                Commissioner Setup Wizard &amp; Governance Charter
              </h2>
              <p className="text-xs text-emerald-200">
                Lifetime Edition • Free Updates • Zero Ads Ever • Non-Gambling Entertainment Tracker
              </p>
            </div>
          </div>
          {draft.isSetupCompleted && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close setup wizard"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 1 as const, label: '1. Charter & Disclaimer', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { id: 2 as const, label: '2. Edition & Identity', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 3 as const, label: '3. House Bot & Rules', icon: <Sliders className="w-3.5 h-3.5" /> }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 1 || canProceedCharter) {
                  setValidationError(null);
                  setStep(item.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                step === item.id
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm grow">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: DISCLAIMER & COMMISSIONER COMMITMENT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-950 text-sm">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Entertainment &amp; Zero-Wagering Legal Disclaimer</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  This software is strictly a <strong>recreational straight-up picks, scoring ledger, and social banter tracker</strong> built exclusively for entertainment and bragging rights. It includes zero real-money wagering, zero payment collection, zero escrow, zero cash prizes, and zero financial payouts. All comedic Penalty Jar citations track honorary <strong>Flags / Citations</strong> with zero monetary value.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Commissioner Operational Responsibility Pact</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  A great pool runs on consistency, accountability, and fair stewardship. By stepping into the Commissioner / Admin role, you agree to:
                </p>
                <ul className="list-disc pl-5 text-xs text-amber-900/90 space-y-1">
                  <li>Maintain an accurate active contender roster and respect the pool&rsquo;s licensed contender ceiling.</li>
                  <li>Verify official Monday Night Football final scores and certify weekly standings before Tuesday dispatches.</li>
                  <li>Protect your Admin PIN and record legitimate pre-kickoff call-in overrides transparently.</li>
                  <li>Enforce your pool&rsquo;s selected tiebreaker and missed-pick rule variances uniformly across every contender.</li>
                </ul>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={disclaimerChecked}
                    onChange={e => setDisclaimerChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-700 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    I confirm this pool is operated strictly for entertainment and bragging rights with zero money, entry fees, or gambling involved.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={commitmentChecked}
                    onChange={e => setCommitmentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-700 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    I accept the Commissioner Operational Responsibility Pact to maintain rosters, audit weekly scores, and administer pool rules fairly.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: EDITION SELECTION & POOL IDENTITY */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Select Software Edition (Lifetime • Free Updates • Zero Ads Ever)
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'opensource' as const,
                      title: 'Umpire Pool (Open-Source)',
                      price: 'Free • MIT',
                      cap: 'Up to 20 Contenders',
                      desc: 'Neutral sports UI & hardened scoring engine without Branham Hills lore.'
                    },
                    {
                      id: 'standard_20' as const,
                      title: 'Awesome Dawson Standard',
                      price: '$9.99 Lifetime',
                      cap: 'Up to 20 Contenders',
                      desc: 'Full character, Commish Quote Vault, Friday/Sunday/Tuesday dispatches & 32 NFL themes.'
                    },
                    {
                      id: 'league_100' as const,
                      title: 'Awesome Dawson League',
                      price: '$19.99 Lifetime',
                      cap: 'Up to 100 Contenders',
                      desc: 'Full Commercial Lore Edition expanded for large community, office & family leagues.'
                    }
                  ].map(tier => {
                    const selected = draft.editionTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleSelectTier(tier.id)}
                        className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selected
                            ? 'bg-emerald-50 border-emerald-700 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                              {tier.price}
                            </span>
                            {selected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                          </div>
                          <div className="font-black text-xs text-slate-900">{tier.title}</div>
                          <div className="text-[11px] font-bold text-emerald-800 mt-0.5">{tier.cap}</div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-2 leading-snug">{tier.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {draft.editionTier !== 'opensource' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 shrink-0">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    <span>Lifetime License Key (Optional for Self-Hosted Demo):</span>
                  </div>
                  <input
                    type="text"
                    value={draft.licenseKey}
                    onChange={e => setDraft(prev => ({ ...prev, licenseKey: e.target.value }))}
                    placeholder="e.g. DAWSON-49CAL-XXXX"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pool Name</label>
                  <input
                    type="text"
                    value={draft.poolName}
                    onChange={e => setDraft(prev => ({ ...prev, poolName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={draft.poolSubtitle}
                    onChange={e => setDraft(prev => ({ ...prev, poolSubtitle: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin / Commissioner Name</label>
                  <input
                    type="text"
                    value={draft.adminName}
                    onChange={e => setDraft(prev => ({ ...prev, adminName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin Contact / Dispatch Email</label>
                  <input
                    type="email"
                    value={draft.adminEmail}
                    onChange={e => setDraft(prev => ({ ...prev, adminEmail: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Founder / Consultant Emeritus Name</label>
                  <input
                    type="text"
                    value={draft.consultantName}
                    onChange={e => setDraft(prev => ({ ...prev, consultantName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Season</label>
                    <input
                      type="number"
                      value={draft.seasonYear}
                      onChange={e => setDraft(prev => ({ ...prev, seasonYear: Number(e.target.value) || 2026 }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Est. Year</label>
                    <input
                      type="number"
                      value={draft.foundedYear}
                      onChange={e => setDraft(prev => ({ ...prev, foundedYear: Number(e.target.value) || 1986 }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Admin PIN</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={draft.adminPin}
                      onChange={e => setDraft(prev => ({ ...prev, adminPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 font-mono font-black text-slate-900 text-center"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Backend Server URL (<code className="font-mono text-[11px]">apiBaseUrl</code> — for Capacitor iOS/Android builds; leave blank on Web/PWA)
                  </label>
                  <input
                    type="url"
                    value={draft.apiBaseUrl || ''}
                    onChange={e => setDraft(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                    placeholder="https://your-pool-server.example.com (blank uses same-origin /api)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OPTIONAL VEGAS BOT & RULE VARIANCES */}
          {step === 3 && (
            <div className="space-y-4">
              {/* House Bot Card */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm">
                    <Bot className="w-4 h-4 text-amber-700" />
                    <span>Autonomous Consensus House Bot (&ldquo;Elvis&rdquo; Slot)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft(prev => ({ ...prev, enableHouseBot: !prev.enableHouseBot }))}
                    className={`px-3 py-1 rounded-lg text-xs font-black border cursor-pointer transition-colors ${
                      draft.enableHouseBot
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {draft.enableHouseBot ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
                {draft.enableHouseBot && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="font-bold text-amber-950 block mb-1">Bot Display Name</label>
                      <input
                        type="text"
                        value={draft.houseBotName}
                        onChange={e => setDraft(prev => ({ ...prev, houseBotName: e.target.value }))}
                        placeholder="e.g. Elvis or Vegas Consensus"
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-amber-950 block mb-1">Bot Tagline</label>
                      <input
                        type="text"
                        value={draft.houseBotTagline}
                        onChange={e => setDraft(prev => ({ ...prev, houseBotTagline: e.target.value }))}
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rule Variances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="font-black text-slate-900 block">Monday Night Tiebreaker Rule</label>
                  <select
                    value={draft.rules.tiebreakerRule}
                    onChange={e => setDraft(prev => ({
                      ...prev,
                      rules: { ...prev.rules, tiebreakerRule: e.target.value as TiebreakerRule }
                    }))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-semibold text-slate-900"
                  >
                    <option value="closest_over_or_under_co_champs">
                      Closest to MNF Total (Over or Under) • Exact Tie Crowns Co-Champions
                    </option>
                    <option value="closest_without_going_over">
                      Price Is Right Rule (Closest Without Going Over)
                    </option>
                  </select>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="font-black text-slate-900 block">Missed-Pick / Kickoff Autofill Policy</label>
                  <select
                    value={draft.rules.missedPickRule}
                    onChange={e => setDraft(prev => ({
                      ...prev,
                      rules: { ...prev.rules, missedPickRule: e.target.value as MissedPickRule }
                    }))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-semibold text-slate-900"
                  >
                    <option value="vegas_autofill_human_priority">
                      Auto-Fill Vegas Favorites at Kickoff (Manual Submissions Hold Podium Priority)
                    </option>
                    <option value="vegas_autofill_equal_standing">
                      Auto-Fill Vegas Favorites at Kickoff (Equal Podium Standing)
                    </option>
                    <option value="no_autofill_zero">
                      Hard Lockout (Unsubmitted Games Score 0 Points)
                    </option>
                  </select>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <Flag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Non-Monetary Penalty Jar</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tracks comedic Penalty Flags (zero currency).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft(prev => ({
                      ...prev,
                      rules: { ...prev.rules, enablePenaltyJar: !prev.rules.enablePenaltyJar }
                    }))}
                    className={`px-3 py-1 rounded-lg font-black border cursor-pointer ${
                      draft.rules.enablePenaltyJar
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {draft.rules.enablePenaltyJar ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Commish Lore &amp; Quote Vault</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Displays classic 2011–2021 quotes &amp; history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft(prev => ({
                      ...prev,
                      rules: { ...prev.rules, enableLoreAndQuotes: !prev.rules.enableLoreAndQuotes }
                    }))}
                    className={`px-3 py-1 rounded-lg font-black border cursor-pointer ${
                      draft.rules.enableLoreAndQuotes
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {draft.rules.enableLoreAndQuotes ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div>
            {step === 1 && (
              <button
                type="button"
                onClick={handleQuickAcceptDefaults}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Quick Accept &amp; Launch with Defaults
              </button>
            )}
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1))}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveAndLaunch(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-xs border border-amber-500"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Configuration &amp; Enter Pool</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
