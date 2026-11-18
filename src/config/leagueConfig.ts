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
  leagueCode: string;
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
  leagueCode: 'DAWSON-2026',
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

export function sanitizeLeagueCode(raw?: string): string {
  const cleaned = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  return cleaned.length >= 2 ? cleaned : 'DAWSON-2026';
}

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function computeLicenseChecksum(tierPrefix: 'STD20' | 'LGE100', block: string): string {
  const normalizedBlock = String(block || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const hash = fnv1a32(`${tierPrefix}:${normalizedBlock}:49CALIBER-LEGACY-1986`);
  return hash.toString(36).toUpperCase().padStart(4, '0').slice(-4);
}

export function generateLicenseKey(tier: 'standard_20' | 'league_100', seed: string): string {
  const tierPrefix: 'STD20' | 'LGE100' = tier === 'league_100' ? 'LGE100' : 'STD20';
  const blockHash = fnv1a32(`SEED:${tierPrefix}:${String(seed || 'DEFAULT').trim()}`);
  const block = blockHash.toString(36).toUpperCase().padStart(4, '0').slice(-4);
  const checksum = computeLicenseChecksum(tierPrefix, block);
  return `DAWSON-${tierPrefix}-${block}-${checksum}`;
}

export function verifyLicenseKey(key: string): { valid: boolean; tier: EditionTier | null; normalizedKey: string } {
  const normalized = String(key || '').trim().toUpperCase();
  if (normalized === 'DAWSON-STD20-49CL-1986') {
    return { valid: true, tier: 'standard_20', normalizedKey: normalized };
  }
  if (normalized === 'DAWSON-LGE100-49CL-1986') {
    return { valid: true, tier: 'league_100', normalizedKey: normalized };
  }
  const match = normalized.match(/^DAWSON-(STD20|LGE100)-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
  if (!match) {
    return { valid: false, tier: null, normalizedKey: normalized };
  }
  const prefix = match[1] as 'STD20' | 'LGE100';
  const block = match[2];
  const checksum = match[3];
  if (computeLicenseChecksum(prefix, block) !== checksum) {
    return { valid: false, tier: null, normalizedKey: normalized };
  }
  return {
    valid: true,
    tier: prefix === 'LGE100' ? 'league_100' : 'standard_20',
    normalizedKey: normalized,
  };
}

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
  let config: PoolConfig = { ...DEFAULT_POOL_CONFIG, rules: { ...DEFAULT_POOL_CONFIG.rules } };
  let hasSavedConfig = false;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(POOL_CONFIG_STORAGE_KEY);
      if (raw) {
        hasSavedConfig = true;
        const parsed = JSON.parse(raw);
        const tier: EditionTier =
          parsed.editionTier === 'opensource' ||
          parsed.editionTier === 'standard_20' ||
          parsed.editionTier === 'league_100'
            ? parsed.editionTier
            : DEFAULT_POOL_CONFIG.editionTier;

        config = {
          ...DEFAULT_POOL_CONFIG,
          ...parsed,
          leagueCode: sanitizeLeagueCode(parsed.leagueCode || DEFAULT_POOL_CONFIG.leagueCode),
          editionTier: tier,
          maxContenders: resolveMaxContendersForTier(tier),
          noAdsGuarantee: true,
          rules: {
            ...DEFAULT_POOL_CONFIG.rules,
            ...(parsed.rules || {}),
          },
        };
      }
    } catch {
      config = { ...DEFAULT_POOL_CONFIG, rules: { ...DEFAULT_POOL_CONFIG.rules } };
    }
  }

  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLeague = params.get('league');
      const urlLicense = params.get('license');
      let shouldPersistUrlActivation = false;

      if (urlLeague) {
        const sanitizedLeague = sanitizeLeagueCode(urlLeague);
        if (config.leagueCode !== sanitizedLeague) {
          config.leagueCode = sanitizedLeague;
        }
        if (!hasSavedConfig) {
          config.isSetupCompleted = true;
          shouldPersistUrlActivation = true;
        }
      }

      if (urlLicense) {
        const verified = verifyLicenseKey(urlLicense);
        if (verified.valid && verified.tier) {
          config.licenseKey = verified.normalizedKey;
          config.editionTier = verified.tier;
          config.maxContenders = resolveMaxContendersForTier(verified.tier);
          shouldPersistUrlActivation = true;
        }
      }

      if (shouldPersistUrlActivation && window.localStorage) {
        try {
          window.localStorage.setItem(POOL_CONFIG_STORAGE_KEY, JSON.stringify(config));
        } catch {}
      }
    } catch {}
  }

  return config;
}

export function savePoolConfig(next: Partial<PoolConfig>): PoolConfig {
  const current = getPoolConfig();
  const nextTier: EditionTier = next.editionTier ?? current.editionTier;
  const merged: PoolConfig = {
    ...current,
    ...next,
    leagueCode: sanitizeLeagueCode(next.leagueCode ?? current.leagueCode),
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

export function getShareableLeagueUrl(leagueCode?: string): string {
  const code = sanitizeLeagueCode(leagueCode || getPoolConfig().leagueCode);
  let base = 'https://49caliber.com/nfl-pool/';
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    const { protocol, hostname, origin, pathname } = window.location;
    if (
      (protocol === 'http:' || protocol === 'https:') &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      base = `${origin}${pathname}`;
    }
  }
  const normalizedBase = base.endsWith('/') || base.endsWith('.html') ? base : `${base}/`;
  return `${normalizedBase}?league=${encodeURIComponent(code)}`;
}

export function resolveApiUrl(path: string): string {
  if (!path.startsWith('/api/')) return path;
  const cfg = getPoolConfig();
  const baseUrl = (cfg.apiBaseUrl || ENV_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const withLeague = /[?&]league=/.test(path)
    ? path
    : `${path}${path.includes('?') ? '&' : '?'}league=${encodeURIComponent(cfg.leagueCode || 'DAWSON-2026')}`;
  return baseUrl ? `${baseUrl}${withLeague}` : withLeague;
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
