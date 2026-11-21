export interface NflInjury {
  player: string;
  team: string;
  position: string;
  injury: string;
  status: string; // Questionable, Doubtful, Out
  poolImpact: 'High' | 'Moderate' | 'Low';
  notes?: string;
  updatedAt?: string;
}

const ESPN_INJURIES_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const ACTIVE_STATUS_SET = new Set(['out', 'doubtful', 'questionable']);
const OFF_SKILL_POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
const DEF_POSITIONS = new Set(['LB', 'CB', 'S', 'DE', 'DT', 'EDGE', 'DL', 'DB']);

// Complete 32-franchise mapping supporting cities, full names, mascots, and abbreviations
const TEAM_CITY_TO_ABBR: Record<string, string> = {
  'arizona': 'ARI',
  'arizona cardinals': 'ARI',
  'cardinals': 'ARI',
  'ari': 'ARI',
  'atlanta': 'ATL',
  'atlanta falcons': 'ATL',
  'falcons': 'ATL',
  'atl': 'ATL',
  'baltimore': 'BAL',
  'baltimore ravens': 'BAL',
  'ravens': 'BAL',
  'bal': 'BAL',
  'buffalo': 'BUF',
  'buffalo bills': 'BUF',
  'bills': 'BUF',
  'buf': 'BUF',
  'carolina': 'CAR',
  'carolina panthers': 'CAR',
  'panthers': 'CAR',
  'car': 'CAR',
  'chicago': 'CHI',
  'chicago bears': 'CHI',
  'bears': 'CHI',
  'chi': 'CHI',
  'cincinnati': 'CIN',
  'cincinnati bengals': 'CIN',
  'bengals': 'CIN',
  'cin': 'CIN',
  'cleveland': 'CLE',
  'cleveland browns': 'CLE',
  'browns': 'CLE',
  'cle': 'CLE',
  'dallas': 'DAL',
  'dallas cowboys': 'DAL',
  'cowboys': 'DAL',
  'dal': 'DAL',
  'denver': 'DEN',
  'denver broncos': 'DEN',
  'broncos': 'DEN',
  'den': 'DEN',
  'detroit': 'DET',
  'detroit lions': 'DET',
  'lions': 'DET',
  'det': 'DET',
  'green bay': 'GB',
  'green bay packers': 'GB',
  'packers': 'GB',
  'gb': 'GB',
  'houston': 'HOU',
  'houston texans': 'HOU',
  'texans': 'HOU',
  'hou': 'HOU',
  'indianapolis': 'IND',
  'indianapolis colts': 'IND',
  'colts': 'IND',
  'ind': 'IND',
  'jacksonville': 'JAX',
  'jacksonville jaguars': 'JAX',
  'jaguars': 'JAX',
  'jax': 'JAX',
  'jac': 'JAX',
  'kansas city': 'KC',
  'kansas city chiefs': 'KC',
  'chiefs': 'KC',
  'kc': 'KC',
  'las vegas': 'LV',
  'las vegas raiders': 'LV',
  'raiders': 'LV',
  'lv': 'LV',
  'lvr': 'LV',
  'la chargers': 'LAC',
  'los angeles chargers': 'LAC',
  'chargers': 'LAC',
  'lac': 'LAC',
  'la rams': 'LAR',
  'los angeles rams': 'LAR',
  'rams': 'LAR',
  'lar': 'LAR',
  'miami': 'MIA',
  'miami dolphins': 'MIA',
  'dolphins': 'MIA',
  'mia': 'MIA',
  'minnesota': 'MIN',
  'minnesota vikings': 'MIN',
  'vikings': 'MIN',
  'min': 'MIN',
  'new england': 'NE',
  'new england patriots': 'NE',
  'patriots': 'NE',
  'ne': 'NE',
  'new orleans': 'NO',
  'new orleans saints': 'NO',
  'saints': 'NO',
  'no': 'NO',
  'ny giants': 'NYG',
  'new york giants': 'NYG',
  'giants': 'NYG',
  'nyg': 'NYG',
  'ny jets': 'NYJ',
  'new york jets': 'NYJ',
  'jets': 'NYJ',
  'nyj': 'NYJ',
  'philadelphia': 'PHI',
  'philadelphia eagles': 'PHI',
  'eagles': 'PHI',
  'phi': 'PHI',
  'pittsburgh': 'PIT',
  'pittsburgh steelers': 'PIT',
  'steelers': 'PIT',
  'pit': 'PIT',
  'san francisco': 'SF',
  'san francisco 49ers': 'SF',
  '49ers': 'SF',
  'niners': 'SF',
  'sf': 'SF',
  'seattle': 'SEA',
  'seattle seahawks': 'SEA',
  'seahawks': 'SEA',
  'sea': 'SEA',
  'tampa bay': 'TB',
  'tampa bay buccaneers': 'TB',
  'buccaneers': 'TB',
  'bucs': 'TB',
  'tb': 'TB',
  'tennessee': 'TEN',
  'tennessee titans': 'TEN',
  'titans': 'TEN',
  'ten': 'TEN',
  'washington': 'WAS',
  'washington commanders': 'WAS',
  'commanders': 'WAS',
  'was': 'WAS',
  'wsh': 'WAS',
};

const TEAM_SORTED_KEYS = Object.keys(TEAM_CITY_TO_ABBR).sort((a, b) => b.length - a.length);

function addAbbrWithAliases(set: Set<string>, rawAbbr: string): void {
  const abbr = rawAbbr.toUpperCase().trim();
  if (!abbr) return;
  set.add(abbr);
  if (abbr === 'WAS' || abbr === 'WSH') {
    set.add('WAS');
    set.add('WSH');
  } else if (abbr === 'LAR' || abbr === 'LA') {
    set.add('LAR');
    set.add('LA');
  } else if (abbr === 'JAX' || abbr === 'JAC') {
    set.add('JAX');
    set.add('JAC');
  } else if (abbr === 'LV' || abbr === 'LVR') {
    set.add('LV');
    set.add('LVR');
  }
}

function normalizeDisplayAbbr(rawAbbr: string): string {
  const upper = rawAbbr.toUpperCase().trim();
  if (upper === 'WSH') return 'WAS';
  if (upper === 'JAC') return 'JAX';
  if (upper === 'LA') return 'LAR';
  if (upper === 'LVR') return 'LV';
  return upper;
}

function resolveSingleTeamAbbr(rawName?: string): string | null {
  if (typeof rawName !== 'string') return null;
  const lower = rawName.toLowerCase().trim();
  if (!lower) return null;

  const direct = TEAM_CITY_TO_ABBR[lower];
  if (direct) return direct;

  for (const key of TEAM_SORTED_KEYS) {
    if (key.length <= 3) continue; // avoid accidental substring hits on 2-3 char codes
    if (lower.includes(key)) {
      return TEAM_CITY_TO_ABBR[key];
    }
  }
  return null;
}

function resolveTargetAbbrs(activeTeamNames?: string[]): Set<string> | null {
  if (!activeTeamNames || activeTeamNames.length === 0) return null;
  const set = new Set<string>();
  for (const name of activeTeamNames) {
    const resolved = resolveSingleTeamAbbr(name);
    if (resolved) {
      addAbbrWithAliases(set, resolved);
    }
  }
  return set.size > 0 ? set : null;
}

function determineImpact(pos: string, status: string): 'High' | 'Moderate' | 'Low' {
  const normStatus = status.toLowerCase();
  if (pos === 'QB') return 'High';
  if (OFF_SKILL_POSITIONS.has(pos)) {
    if (normStatus.includes('out') || normStatus.includes('doubtful') || normStatus.includes('questionable')) {
      return 'High';
    }
    return 'Moderate';
  }
  if (DEF_POSITIONS.has(pos) && (normStatus.includes('out') || normStatus.includes('doubtful'))) {
    return 'Moderate';
  }
  return 'Low';
}

function normalizeStatusLabel(rawStatus: string): 'Out' | 'Doubtful' | 'Questionable' | null {
  const lower = rawStatus.trim().toLowerCase();
  if (lower === 'out') return 'Out';
  if (lower === 'doubtful') return 'Doubtful';
  if (lower === 'questionable') return 'Questionable';
  return null;
}

function extractInjuryDescription(item: any): string {
  const typeText = typeof item?.details?.type === 'string' ? item.details.type.trim() : '';
  const detailText = typeof item?.details?.detail === 'string' ? item.details.detail.trim() : '';

  if (typeText && typeText.toLowerCase() !== 'not specified') {
    if (
      detailText &&
      detailText.toLowerCase() !== 'not specified' &&
      !typeText.toLowerCase().includes(detailText.toLowerCase())
    ) {
      return `${typeText} (${detailText})`;
    }
    return typeText;
  }

  const shortComment = typeof item?.shortComment === 'string' ? item.shortComment.trim() : '';
  const parenMatch = shortComment.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1]) {
    const inner = parenMatch[1].trim();
    if (inner) {
      return inner.charAt(0).toUpperCase() + inner.slice(1);
    }
  }

  return 'Undisclosed';
}

function getStatusWeight(status: string): number {
  const lower = status.toLowerCase();
  if (lower === 'out') return 3;
  if (lower === 'doubtful') return 2;
  if (lower === 'questionable') return 1;
  return 0;
}

function getImpactWeight(impact: 'High' | 'Moderate' | 'Low'): number {
  if (impact === 'High') return 3;
  if (impact === 'Moderate') return 2;
  return 1;
}

function getPositionWeight(pos: string): number {
  if (pos === 'QB') return 5;
  if (pos === 'RB' || pos === 'WR') return 4;
  if (pos === 'TE') return 3;
  if (DEF_POSITIONS.has(pos)) return 2;
  return 1;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPstTimestamp(iso?: string): string {
  const dateObj = iso ? new Date(iso) : new Date();
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  try {
    return (
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(validDate) + ' PT'
    );
  } catch {
    return validDate.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  }
}

/**
 * Fetches live current-season NFL injury data directly from ESPN's public JSON endpoint.
 * Works identically in Node server and browser via universal fetch with a 10s AbortController timeout.
 * Never returns fabricated/hardcoded players on failure.
 */
export async function fetchLiveNflInjuries(activeTeamNames?: string[]): Promise<NflInjury[]> {
  const targetAbbrs = resolveTargetAbbrs(activeTeamNames);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(ESPN_INJURIES_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ESPN HTTP ${response.status}`);
    }

    const payload = await response.json();
    const teamGroups = Array.isArray(payload?.injuries) ? payload.injuries : [];
    if (teamGroups.length === 0) {
      throw new Error('Empty ESPN team injury array');
    }

    const nowMs = Date.now();
    const candidates: NflInjury[] = [];

    for (const teamGroup of teamGroups) {
      const teamDisplayName = typeof teamGroup?.displayName === 'string' ? teamGroup.displayName : '';
      const resolvedTeamAbbr = resolveSingleTeamAbbr(teamDisplayName);
      const groupInjuries = Array.isArray(teamGroup?.injuries) ? teamGroup.injuries : [];

      for (const item of groupInjuries) {
        const statusLabel = typeof item?.status === 'string' ? normalizeStatusLabel(item.status) : null;
        if (!statusLabel) continue;

        const dateIso = typeof item?.date === 'string' ? item.date.trim() : '';
        if (!dateIso) continue;
        const updatedMs = Date.parse(dateIso);
        if (isNaN(updatedMs) || nowMs - updatedMs > FOURTEEN_DAYS_MS) {
          continue;
        }

        const pos = typeof item?.athlete?.position?.abbreviation === 'string'
          ? item.athlete.position.abbreviation.toUpperCase().trim()
          : '';
        if (!OFF_SKILL_POSITIONS.has(pos) && !DEF_POSITIONS.has(pos)) {
          continue;
        }

        const athleteTeamAbbr = typeof item?.athlete?.team?.abbreviation === 'string'
          ? item.athlete.team.abbreviation.toUpperCase().trim()
          : '';
        const rawTeamAbbr = athleteTeamAbbr || resolvedTeamAbbr || '';
        if (!rawTeamAbbr) continue;

        const displayTeam = normalizeDisplayAbbr(rawTeamAbbr);
        if (targetAbbrs && targetAbbrs.size > 0 && !targetAbbrs.has(rawTeamAbbr) && !targetAbbrs.has(displayTeam)) {
          continue;
        }

        const playerName = typeof item?.athlete?.displayName === 'string'
          ? item.athlete.displayName.trim()
          : '';
        if (!playerName) continue;

        const shortComment = typeof item?.shortComment === 'string' ? item.shortComment.trim() : '';
        const notes = shortComment.length > 15 ? shortComment : undefined;
        const injury = extractInjuryDescription(item);
        const poolImpact = determineImpact(pos, statusLabel);

        candidates.push({
          player: playerName,
          team: displayTeam,
          position: pos,
          injury,
          status: statusLabel,
          poolImpact,
          ...(notes ? { notes } : {}),
          updatedAt: dateIso,
        });
      }
    }

    candidates.sort((a, b) => {
      const statusDiff = getStatusWeight(b.status) - getStatusWeight(a.status);
      if (statusDiff !== 0) return statusDiff;
      const impactDiff = getImpactWeight(b.poolImpact) - getImpactWeight(a.poolImpact);
      if (impactDiff !== 0) return impactDiff;
      const posDiff = getPositionWeight(b.position) - getPositionWeight(a.position);
      if (posDiff !== 0) return posDiff;
      const dateA = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const dateB = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return dateB - dateA;
    });

    const selected: NflInjury[] = [];
    const seenKeys = new Set<string>();
    const teamCounts = new Map<string, number>();

    const trySelect = (entry: NflInjury): boolean => {
      if (selected.length >= 12) return false;
      const key = `${entry.player.toLowerCase()}|${entry.team}`;
      if (seenKeys.has(key)) return false;
      const count = teamCounts.get(entry.team) || 0;
      if (count >= 2) return false;
      selected.push(entry);
      seenKeys.add(key);
      teamCounts.set(entry.team, count + 1);
      return true;
    };

    const takeBucket = (predicate: (c: NflInjury) => boolean, limit: number) => {
      let taken = 0;
      for (const c of candidates) {
        if (taken >= limit) break;
        if (predicate(c) && trySelect(c)) {
          taken++;
        }
      }
    };

    takeBucket(c => c.position === 'QB', 2);
    takeBucket(c => c.position === 'RB', 3);
    takeBucket(c => c.position === 'WR', 3);
    takeBucket(c => c.position === 'TE', 2);
    takeBucket(c => DEF_POSITIONS.has(c.position), 2);

    for (const c of candidates) {
      if (selected.length >= 12) break;
      trySelect(c);
    }

    return selected;
  } catch (err: any) {
    console.warn('[Injury Scraper] Live ESPN injury wire unavailable:', err?.message || err);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Builds the uniform, high-contrast HTML table for The Friday Wire and Injury Report dispatch.
 * Follows strict single-quote constraints: ALL HTML attributes use single quotes.
 */
export function renderInjuryReportTableHtml(injuries: NflInjury[], fetchedAtIso?: string): string {
  const updatedLabel = formatPstTimestamp(fetchedAtIso);

  const rowsHtml =
    injuries.length === 0
      ? `<tr style='background:#f8fafc; border-bottom:1px solid #d1fae5;'>
      <td colspan='6' style='padding:14px 12px; color:#334155; text-align:center; line-height:1.5; font-size:12px;'>
        Live ESPN NFL injury feed is temporarily unreachable or has no active <strong>Out / Doubtful / Questionable</strong> designations posted for remaining matchups. Verify official team inactive lists prior to kickoff.
      </td>
    </tr>`
      : injuries
          .map((inj, idx) => {
            const bg = idx % 2 === 0 ? '#ecfdf5' : '#ffffff';
            const normStatus = inj.status.toLowerCase();
            let statusBadgeColor = '#991b1b';
            let statusBg = '#fee2e2';
            if (normStatus.includes('questionable')) {
              statusBadgeColor = '#92400e';
              statusBg = '#fef3c7';
            }

            let impactBadge =
              "<span style='background:#fef2f2; color:#b91c1c; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>HIGH</span>";
            if (inj.poolImpact === 'Moderate') {
              impactBadge =
                "<span style='background:#fffbeb; color:#d97706; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>MODERATE</span>";
            } else if (inj.poolImpact === 'Low') {
              impactBadge =
                "<span style='background:#f3f4f6; color:#4b5563; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:4px;'>LOW</span>";
            }

            const safePlayer = escapeHtml(inj.player);
            const safeTeam = escapeHtml(inj.team);
            const safePos = escapeHtml(inj.position);
            const safeInjury = escapeHtml(inj.injury);
            const safeStatus = escapeHtml(inj.status);
            const notesHtml = inj.notes
              ? `<div style='font-size:10px; font-weight:normal; color:#475569; margin-top:2px; line-height:1.35;'>${escapeHtml(inj.notes)}</div>`
              : '';

            return `<tr style='background:${bg}; border-bottom:1px solid #d1fae5;'>
      <td style='padding:8px 10px; font-weight:bold; color:#064e3b; vertical-align:top;'>${safePlayer}${notesHtml}</td>
      <td style='padding:8px 10px; font-weight:bold; color:#022c22; text-align:center; vertical-align:top;'>${safeTeam}</td>
      <td style='padding:8px 10px; color:#374151; text-align:center; font-family:monospace; vertical-align:top;'>${safePos}</td>
      <td style='padding:8px 10px; color:#4b5563; vertical-align:top;'>${safeInjury}</td>
      <td style='padding:8px 10px; text-align:center; vertical-align:top;'><span style='background:${statusBg}; color:${statusBadgeColor}; font-weight:bold; font-size:10px; padding:3px 8px; border-radius:4px; text-transform:uppercase;'>${safeStatus}</span></td>
      <td style='padding:8px 10px; text-align:center; vertical-align:top;'>${impactBadge}</td>
    </tr>`;
          })
          .join('');

  return `<div style='background:#ffffff; border:1px solid #d4af37; border-radius:8px; overflow:hidden; margin-bottom:20px; box-shadow:0 2px 4px rgba(0,0,0,0.05);'>
  <div style='background:#064e3b; padding:10px 14px; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center;'>
    <span style='color:#fef08a; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px;'>⚡ LIVE NFL INJURY WIRE & GAME IMPACT REPORT</span>
    <span style='color:#a7f3d0; font-size:11px; font-style:italic;'>Live ESPN Wire • Updated ${escapeHtml(updatedLabel)}</span>
  </div>
  <table style='width:100%; border-collapse:collapse; font-size:12px; font-family:sans-serif;'>
    <thead>
      <tr style='background:#022c22; color:#fef3c7; text-transform:uppercase; font-size:11px;'>
        <th style='padding:8px 10px; text-align:left;'>Player</th>
        <th style='padding:8px 10px; text-align:center;'>Team</th>
        <th style='padding:8px 10px; text-align:center;'>Pos</th>
        <th style='padding:8px 10px; text-align:left;'>Injury / Diagnosis</th>
        <th style='padding:8px 10px; text-align:center;'>Status</th>
        <th style='padding:8px 10px; text-align:center;'>Pool Impact</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
  <div style='background:#f0fdf4; padding:8px 12px; font-size:11px; color:#065f46; font-style:italic; border-top:1px solid #d1fae5;'>
    * Pool Impact evaluates outright pick volatility. Quarterback and primary backfield shifts heavily swing straight-up win likelihood.
  </div>
</div>`;
}
