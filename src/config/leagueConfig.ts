export type EditionTier = 'opensource' | 'standard_20' | 'league_100';

export type TiebreakerRule =
  | 'closest_over_or_under_co_champs'
  | 'closest_without_going_over';

export type MissedPickRule =
  | 'vegas_autofill_human_priority'
  | 'vegas_autofill_equal_standing'
  | 'no_autofill_zero';

export interface PoolRulesConfig {
  tiebreakerRule: TiebreakerRule;
  missedPickRule: MissedPickRule;
  enablePenaltyJar: boolean;
  penaltyJarTitle: string;
  penaltyUnitSingular: string;
  penaltyUnitPlural: string;
  enableLoreAndQuotes: boolean;
}

export interface PoolConfig {
  isSetupCompleted: boolean;
  disclaimerAcceptedAt: string | null;
  commissionerCommitmentAccepted: boolean;
  poolName: string;
  poolSubtitle: string;
  foundedYear: number;
  seasonYear: number;
  adminName: string;
  adminTitle: string;
  adminEmail: string;
  consultantName: string;
  consultantTitle: string;
  adminPin: string;
  editionTier: EditionTier;
  maxContenders: number;
  licenseKey: string;
  noAdsGuarantee: true;
  enableHouseBot: boolean;
  houseBotName: string;
  houseBotTagline: string;
  apiBaseUrl?: string;
  rules: PoolRulesConfig;
}

const POOL_CONFIG_STORAGE_KEY = 'nfl_pool_commercial_config_v1';

const ENV_API_BASE_URL =
  typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL
    ? String((import.meta as any).env.VITE_API_BASE_URL).trim().replace(/\/+$/, '')
    : '';

export const DEFAULT_POOL_CONFIG: PoolConfig = {
  isSetupCompleted: false,
  disclaimerAcceptedAt: null,
  commissionerCommitmentAccepted: false,
  poolName: 'Branham Hills Football Pool',
  poolSubtitle: 'Legacy Edition • Straight-Up',
  foundedYear: 1986,
  seasonYear: 2026,
  adminName: 'Joel',
  adminTitle: 'The Admin',
  adminEmail: 'admin@example.com',
  consultantName: 'Don',
  consultantTitle: 'The Consultant • Commissioner Emeritus',
  adminPin: '2233',
  editionTier: 'standard_20',
  maxContenders: 20,
  licenseKey: '',
  noAdsGuarantee: true,
  enableHouseBot: true,
  houseBotName: 'Elvis',
  houseBotTagline: 'Honorary Permanent Member • Consensus Favorites',
  apiBaseUrl: ENV_API_BASE_URL,
  rules: {
    tiebreakerRule: 'closest_over_or_under_co_champs',
    missedPickRule: 'vegas_autofill_human_priority',
    enablePenaltyJar: true,
    penaltyJarTitle: 'The Umpire Penalty Jar',
    penaltyUnitSingular: 'Flag',
    penaltyUnitPlural: 'Flags',
    enableLoreAndQuotes: true,
  },
};

export function resolveMaxContendersForTier(tier: EditionTier): number {
  return tier === 'league_100' ? 100 : 20;
}

export function getEditionLabel(tier: EditionTier): string {
  switch (tier) {
    case 'opensource':
      return 'Open-Source Umpire Pool (Up to 20 Contenders)';
    case 'league_100':
      return 'Awesome Dawson League Edition ($19.99 Lifetime • Up to 100 Contenders • No Ads)';
    case 'standard_20':
    default:
      return 'Awesome Dawson Standard Edition ($9.99 Lifetime • Up to 20 Contenders • No Ads)';
  }
}

export function getPoolConfig(): PoolConfig {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_POOL_CONFIG;
  }
  try {
    const raw = window.localStorage.getItem(POOL_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_POOL_CONFIG;
    const parsed = JSON.parse(raw);
    const tier: EditionTier =
      parsed.editionTier === 'opensource' ||
      parsed.editionTier === 'standard_20' ||
      parsed.editionTier === 'league_100'
        ? parsed.editionTier
        : DEFAULT_POOL_CONFIG.editionTier;

    return {
      ...DEFAULT_POOL_CONFIG,
      ...parsed,
      editionTier: tier,
      maxContenders: resolveMaxContendersForTier(tier),
      noAdsGuarantee: true,
      rules: {
        ...DEFAULT_POOL_CONFIG.rules,
        ...(parsed.rules || {}),
      },
    };
  } catch {
    return DEFAULT_POOL_CONFIG;
  }
}

export function savePoolConfig(next: Partial<PoolConfig>): PoolConfig {
  const current = getPoolConfig();
  const nextTier: EditionTier = next.editionTier ?? current.editionTier;
  const merged: PoolConfig = {
    ...current,
    ...next,
    editionTier: nextTier,
    maxContenders: resolveMaxContendersForTier(nextTier),
    noAdsGuarantee: true,
    rules: {
      ...current.rules,
      ...(next.rules || {}),
    },
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(POOL_CONFIG_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('pool_config_updated', { detail: merged }));
    } catch {}
  }

  return merged;
}

export function resolveApiUrl(path: string): string {
  if (!path.startsWith('/api/')) return path;
  const baseUrl = (getPoolConfig().apiBaseUrl || ENV_API_BASE_URL || '').trim().replace(/\/+$/, '');
  return baseUrl ? `${baseUrl}${path}` : path;
}

export const LEAGUE_CONFIG = {
  get leagueName() {
    const cfg = getPoolConfig();
    return `${cfg.poolName}: ${cfg.poolSubtitle} (Est. ${cfg.foundedYear})`;
  },
  get commissionerEmeritus() {
    const cfg = getPoolConfig();
    return {
      title: cfg.consultantTitle || 'Commissioner Emeritus',
      name: cfg.consultantName || 'Don',
    };
  },
  get admin() {
    const cfg = getPoolConfig();
    return {
      title: cfg.adminTitle || 'Admin',
      name: cfg.adminName || 'Joel',
      email: cfg.adminEmail || 'admin@example.com',
    };
  },
  crewChief: {
    title: 'League Crew Chief',
    name: 'Crew Chief',
  },
};
