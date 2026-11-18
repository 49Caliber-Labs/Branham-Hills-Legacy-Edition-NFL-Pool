export interface NflTheme {
  id: string;
  teamName: string;
  fullName: string;
  primary: string;         // Main dominant franchise color
  secondary: string;       // Secondary franchise color
  accentColor: string;     // High-contrast vibrant pop for active highlights
  headerBg: string;        // Deep header tone for top bars and modals
  subHeaderBg: string;     // Subheader and table header tone
  borderColor: string;     // Primary structural border tone
  ringColor: string;       // Focus/active outline ring tone
  borderAccent: string;    // Coordinated secondary accent border for cards/tabs
  cardBg: string;          // Coordinated tinted card/panel background
  buttonBg: string;        // Button fill color
  buttonText: string;      // Button text color
  textColor?: string;      // Header text color (defaults to #ffffff)
}

export const DEFAULT_THEME_ID = 'forest';

/**
 * Universal NFL Team Name Formatter:
 * Enforces City/Region only across the entire application.
 * Special Rule: Rams and Chargers are displayed strictly as 'LA Rams' and 'LA Chargers'.
 * NY teams are displayed as 'NY Giants' and 'NY Jets'.
 * Mascots (Packers, 49ers, Chiefs, etc.) are never displayed.
 */
export function formatTeamCityOrRegion(teamName: string | undefined | null): string {
  if (!teamName) return '';
  const trimmed = teamName.trim();
  const lower = trimmed.toLowerCase();

  // Special cases for LA Rams and LA Chargers (strict user rule)
  if (lower.includes('charger') || lower === 'lac') return 'LA Chargers';
  if (lower.includes('ram') || lower === 'lar') return 'LA Rams';

  // NY teams
  if (lower.includes('giant') || lower === 'nyg') return 'NY Giants';
  if (lower.includes('jet') || lower === 'nyj') return 'NY Jets';

  // Specific franchise city/region mappings
  if (lower.includes('49er') || lower.includes('niners') || lower.includes('san francisco') || lower === 'sf') return 'San Francisco';
  if (lower.includes('cardinal') || lower.includes('arizona') || lower === 'ari' || lower === 'arz') return 'Arizona';
  if (lower.includes('falcon') || lower.includes('atlanta') || lower === 'atl') return 'Atlanta';
  if (lower.includes('raven') || lower.includes('baltimore') || lower === 'bal') return 'Baltimore';
  if (lower.includes('bill') || lower.includes('buffalo') || lower === 'buf') return 'Buffalo';
  if (lower.includes('panther') || lower.includes('carolina') || lower === 'car') return 'Carolina';
  if (lower.includes('bear') || lower.includes('chicago') || lower === 'chi') return 'Chicago';
  if (lower.includes('bengal') || lower.includes('cincinnati') || lower === 'cin') return 'Cincinnati';
  if (lower.includes('brown') || lower.includes('cleveland') || lower === 'cle') return 'Cleveland';
  if (lower.includes('cowboy') || lower.includes('dallas') || lower === 'dal') return 'Dallas';
  if (lower.includes('bronco') || lower.includes('denver') || lower === 'den') return 'Denver';
  if (lower.includes('lion') || lower.includes('detroit') || lower === 'det') return 'Detroit';
  if (lower.includes('packer') || lower.includes('green bay') || lower === 'gb') return 'Green Bay';
  if (lower.includes('texan') || lower.includes('houston') || lower === 'hou') return 'Houston';
  if (lower.includes('colt') || lower.includes('indianapolis') || lower === 'ind') return 'Indianapolis';
  if (lower.includes('jaguar') || lower.includes('jacksonville') || lower === 'jax' || lower === 'jac') return 'Jacksonville';
  if (lower.includes('chief') || lower.includes('kansas city') || lower === 'kc') return 'Kansas City';
  if (lower.includes('raider') || lower.includes('las vegas') || lower === 'lv' || lower === 'oak') return 'Las Vegas';
  if (lower.includes('dolphin') || lower.includes('miami') || lower === 'mia') return 'Miami';
  if (lower.includes('viking') || lower.includes('minnesota') || lower === 'min') return 'Minnesota';
  if (lower.includes('patriot') || lower.includes('new england') || lower === 'ne') return 'New England';
  if (lower.includes('saint') || lower.includes('new orleans') || lower === 'no') return 'New Orleans';
  if (lower.includes('eagle') || lower.includes('philadelphia') || lower === 'phi') return 'Philadelphia';
  if (lower.includes('steeler') || lower.includes('pittsburgh') || lower === 'pit') return 'Pittsburgh';
  if (lower.includes('seahawk') || lower.includes('seattle') || lower === 'sea') return 'Seattle';
  if (lower.includes('buccaneer') || lower.includes('tampa bay') || lower === 'tb') return 'Tampa Bay';
  if (lower.includes('titan') || lower.includes('tennessee') || lower === 'ten') return 'Tennessee';
  if (lower.includes('commander') || lower.includes('redskin') || lower.includes('washington') || lower === 'was' || lower === 'wsh') return 'Washington';

  return trimmed;
}

export const NFL_THEMES: Record<string, NflTheme> = {
  forest: {
    id: 'forest',
    teamName: 'Forest Green',
    fullName: 'Branham Hills Classic',
    primary: '#142d21',
    secondary: '#10b981',
    accentColor: '#34d399',
    headerBg: '#0e2017',
    subHeaderBg: '#1b3a2b',
    borderColor: '#064e3b',
    ringColor: '#10b981',
    borderAccent: '#10b981',
    cardBg: '#0b1a13',
    buttonBg: '#10b981',
    buttonText: '#ffffff'
  },
  cardinals: {
    id: 'cardinals',
    teamName: 'Arizona',
    fullName: 'Arizona Cardinals',
    primary: '#97233F',
    secondary: '#FFB612',
    accentColor: '#FFC72C',
    headerBg: '#5E1222',
    subHeaderBg: '#7A1A30',
    borderColor: '#480E1A',
    ringColor: '#FFB612',
    borderAccent: '#FFB612',
    cardBg: '#23070D',
    buttonBg: '#97233F',
    buttonText: '#ffffff'
  },
  falcons: {
    id: 'falcons',
    teamName: 'Atlanta',
    fullName: 'Atlanta Falcons',
    primary: '#A71930',
    secondary: '#A5ACAF',
    accentColor: '#E03A3E',
    headerBg: '#121212',
    subHeaderBg: '#1E1E1E',
    borderColor: '#333333',
    ringColor: '#A71930',
    borderAccent: '#A71930',
    cardBg: '#181818',
    buttonBg: '#A71930',
    buttonText: '#ffffff'
  },
  ravens: {
    id: 'ravens',
    teamName: 'Baltimore',
    fullName: 'Baltimore Ravens',
    primary: '#241773',
    secondary: '#9E7C0C',
    accentColor: '#FFC72C',
    headerBg: '#140C44',
    subHeaderBg: '#1F145F',
    borderColor: '#322194',
    ringColor: '#9E7C0C',
    borderAccent: '#9E7C0C',
    cardBg: '#0F0930',
    buttonBg: '#241773',
    buttonText: '#ffffff'
  },
  bills: {
    id: 'bills',
    teamName: 'Buffalo',
    fullName: 'Buffalo Bills',
    primary: '#00338D',
    secondary: '#C60C30',
    accentColor: '#E6193C',
    headerBg: '#001C52',
    subHeaderBg: '#002970',
    borderColor: '#0040A8',
    ringColor: '#C60C30',
    borderAccent: '#C60C30',
    cardBg: '#001338',
    buttonBg: '#00338D',
    buttonText: '#ffffff'
  },
  panthers: {
    id: 'panthers',
    teamName: 'Carolina',
    fullName: 'Carolina Panthers',
    primary: '#0085CA',
    secondary: '#BFC6C9',
    accentColor: '#00A3E0',
    headerBg: '#081018',
    subHeaderBg: '#101820',
    borderColor: '#1C2A36',
    ringColor: '#0085CA',
    borderAccent: '#0085CA',
    cardBg: '#0B131B',
    buttonBg: '#0085CA',
    buttonText: '#ffffff'
  },
  bears: {
    id: 'bears',
    teamName: 'Chicago',
    fullName: 'Chicago Bears',
    primary: '#0B162A',
    secondary: '#C83803',
    accentColor: '#FF5500',
    headerBg: '#050B14',
    subHeaderBg: '#0E1D36',
    borderColor: '#1C2F4E',
    ringColor: '#C83803',
    borderAccent: '#C83803',
    cardBg: '#081120',
    buttonBg: '#C83803',
    buttonText: '#ffffff'
  },
  bengals: {
    id: 'bengals',
    teamName: 'Cincinnati',
    fullName: 'Cincinnati Bengals',
    primary: '#FB4F14',
    secondary: '#000000',
    accentColor: '#FF6D2C',
    headerBg: '#121212',
    subHeaderBg: '#202020',
    borderColor: '#363636',
    ringColor: '#FB4F14',
    borderAccent: '#FB4F14',
    cardBg: '#181818',
    buttonBg: '#FB4F14',
    buttonText: '#ffffff'
  },
  browns: {
    id: 'browns',
    teamName: 'Cleveland',
    fullName: 'Cleveland Browns',
    primary: '#311D00',
    secondary: '#FF3C00',
    accentColor: '#FF5D22',
    headerBg: '#1D1100',
    subHeaderBg: '#2B1900',
    borderColor: '#482A00',
    ringColor: '#FF3C00',
    borderAccent: '#FF3C00',
    cardBg: '#160D00',
    buttonBg: '#FF3C00',
    buttonText: '#ffffff'
  },
  cowboys: {
    id: 'cowboys',
    teamName: 'Dallas',
    fullName: 'Dallas Cowboys',
    primary: '#003594',
    secondary: '#869397',
    accentColor: '#B0B7BC',
    headerBg: '#001A4A',
    subHeaderBg: '#00276D',
    borderColor: '#0040A8',
    ringColor: '#003594',
    borderAccent: '#869397',
    cardBg: '#001235',
    buttonBg: '#003594',
    buttonText: '#ffffff'
  },
  broncos: {
    id: 'broncos',
    teamName: 'Denver',
    fullName: 'Denver Broncos',
    primary: '#FB4F14',
    secondary: '#002244',
    accentColor: '#FF7338',
    headerBg: '#001428',
    subHeaderBg: '#002244',
    borderColor: '#003466',
    ringColor: '#FB4F14',
    borderAccent: '#FB4F14',
    cardBg: '#001020',
    buttonBg: '#FB4F14',
    buttonText: '#ffffff'
  },
  lions: {
    id: 'lions',
    teamName: 'Detroit',
    fullName: 'Detroit Lions',
    primary: '#0076B6',
    secondary: '#B0B7BC',
    accentColor: '#38B6FF',
    headerBg: '#003E61',
    subHeaderBg: '#005C8F',
    borderColor: '#0076B6',
    ringColor: '#0076B6',
    borderAccent: '#B0B7BC',
    cardBg: '#002A42',
    buttonBg: '#0076B6',
    buttonText: '#ffffff'
  },
  packers: {
    id: 'packers',
    teamName: 'Green Bay',
    fullName: 'Green Bay Packers',
    primary: '#203731',
    secondary: '#FFB612',
    accentColor: '#FFC72C',
    headerBg: '#11201C',
    subHeaderBg: '#1B302B',
    borderColor: '#2D4D45',
    ringColor: '#FFB612',
    borderAccent: '#FFB612',
    cardBg: '#0D1714',
    buttonBg: '#203731',
    buttonText: '#FFB612'
  },
  texans: {
    id: 'texans',
    teamName: 'Houston',
    fullName: 'Houston Texans',
    primary: '#03202F',
    secondary: '#A71930',
    accentColor: '#C9243F',
    headerBg: '#011018',
    subHeaderBg: '#03202F',
    borderColor: '#1C3B4E',
    ringColor: '#A71930',
    borderAccent: '#A71930',
    cardBg: '#02141E',
    buttonBg: '#A71930',
    buttonText: '#ffffff'
  },
  colts: {
    id: 'colts',
    teamName: 'Indianapolis',
    fullName: 'Indianapolis Colts',
    primary: '#002C5F',
    secondary: '#A2AAAD',
    accentColor: '#0047A5',
    headerBg: '#001833',
    subHeaderBg: '#00244D',
    borderColor: '#003D7A',
    ringColor: '#002C5F',
    borderAccent: '#A2AAAD',
    cardBg: '#001226',
    buttonBg: '#002C5F',
    buttonText: '#ffffff'
  },
  jaguars: {
    id: 'jaguars',
    teamName: 'Jacksonville',
    fullName: 'Jacksonville Jaguars',
    primary: '#006778',
    secondary: '#D7A22A',
    accentColor: '#FFB81C',
    headerBg: '#003740',
    subHeaderBg: '#00505C',
    borderColor: '#006778',
    ringColor: '#D7A22A',
    borderAccent: '#D7A22A',
    cardBg: '#00252B',
    buttonBg: '#006778',
    buttonText: '#ffffff'
  },
  chiefs: {
    id: 'chiefs',
    teamName: 'Kansas City',
    fullName: 'Kansas City Chiefs',
    primary: '#E31837',
    secondary: '#FFB81C',
    accentColor: '#FFC72C',
    headerBg: '#8A091E',
    subHeaderBg: '#B5102A',
    borderColor: '#8A091E',
    ringColor: '#FFB81C',
    borderAccent: '#FFB81C',
    cardBg: '#3B030C',
    buttonBg: '#E31837',
    buttonText: '#ffffff'
  },
  raiders: {
    id: 'raiders',
    teamName: 'Las Vegas',
    fullName: 'Las Vegas Raiders',
    primary: '#000000',
    secondary: '#A5ACAF',
    accentColor: '#D1D5DB',
    headerBg: '#0E0E0E',
    subHeaderBg: '#1C1C1C',
    borderColor: '#383838',
    ringColor: '#A5ACAF',
    borderAccent: '#A5ACAF',
    cardBg: '#141414',
    buttonBg: '#262626',
    buttonText: '#ffffff'
  },
  chargers: {
    id: 'chargers',
    teamName: 'LA Chargers',
    fullName: 'Los Angeles Chargers',
    primary: '#0080C6',
    secondary: '#FFC20E',
    accentColor: '#FFD100',
    headerBg: '#004368',
    subHeaderBg: '#006399',
    borderColor: '#0080C6',
    ringColor: '#FFC20E',
    borderAccent: '#FFC20E',
    cardBg: '#00283E',
    buttonBg: '#0080C6',
    buttonText: '#ffffff'
  },
  rams: {
    id: 'rams',
    teamName: 'LA Rams',
    fullName: 'Los Angeles Rams',
    primary: '#003594',
    secondary: '#FFA300',
    accentColor: '#FFB81C',
    headerBg: '#001A4A',
    subHeaderBg: '#002870',
    borderColor: '#003594',
    ringColor: '#FFA300',
    borderAccent: '#FFA300',
    cardBg: '#001235',
    buttonBg: '#003594',
    buttonText: '#ffffff'
  },
  dolphins: {
    id: 'dolphins',
    teamName: 'Miami',
    fullName: 'Miami Dolphins',
    primary: '#008E97',
    secondary: '#FC4C02',
    accentColor: '#FF6B26',
    headerBg: '#00484D',
    subHeaderBg: '#00686E',
    borderColor: '#008E97',
    ringColor: '#FC4C02',
    borderAccent: '#FC4C02',
    cardBg: '#002C30',
    buttonBg: '#008E97',
    buttonText: '#ffffff'
  },
  vikings: {
    id: 'vikings',
    teamName: 'Minnesota',
    fullName: 'Minnesota Vikings',
    primary: '#4F2683',
    secondary: '#FFC62F',
    accentColor: '#FFD100',
    headerBg: '#281145',
    subHeaderBg: '#3C1B66',
    borderColor: '#5B2E99',
    ringColor: '#FFC62F',
    borderAccent: '#FFC62F',
    cardBg: '#1B0B2E',
    buttonBg: '#4F2683',
    buttonText: '#ffffff'
  },
  patriots: {
    id: 'patriots',
    teamName: 'New England',
    fullName: 'New England Patriots',
    primary: '#002244',
    secondary: '#C60C30',
    accentColor: '#A5ACAF',
    headerBg: '#001224',
    subHeaderBg: '#002040',
    borderColor: '#003366',
    ringColor: '#C60C30',
    borderAccent: '#C60C30',
    cardBg: '#000B17',
    buttonBg: '#C60C30',
    buttonText: '#ffffff'
  },
  saints: {
    id: 'saints',
    teamName: 'New Orleans',
    fullName: 'New Orleans Saints',
    primary: '#D3BC8D',
    secondary: '#101820',
    accentColor: '#E6D3A3',
    headerBg: '#0A0F14',
    subHeaderBg: '#161F29',
    borderColor: '#4A3E2A',
    ringColor: '#D3BC8D',
    borderAccent: '#D3BC8D',
    cardBg: '#101820',
    buttonBg: '#D3BC8D',
    buttonText: '#101820'
  },
  giants: {
    id: 'giants',
    teamName: 'NY Giants',
    fullName: 'New York Giants',
    primary: '#0B2265',
    secondary: '#A71930',
    accentColor: '#CF1D39',
    headerBg: '#051236',
    subHeaderBg: '#0A1C4F',
    borderColor: '#14358F',
    ringColor: '#A71930',
    borderAccent: '#A71930',
    cardBg: '#030A1F',
    buttonBg: '#0B2265',
    buttonText: '#ffffff'
  },
  jets: {
    id: 'jets',
    teamName: 'NY Jets',
    fullName: 'New York Jets',
    primary: '#125740',
    secondary: '#FFFFFF',
    accentColor: '#2ED69E',
    headerBg: '#092E22',
    subHeaderBg: '#104734',
    borderColor: '#1C7355',
    ringColor: '#125740',
    borderAccent: '#2ED69E',
    cardBg: '#051A13',
    buttonBg: '#125740',
    buttonText: '#ffffff'
  },
  eagles: {
    id: 'eagles',
    teamName: 'Philadelphia',
    fullName: 'Philadelphia Eagles',
    primary: '#004C54',
    secondary: '#A5ACAF',
    accentColor: '#007D8A',
    headerBg: '#002B30',
    subHeaderBg: '#003C42',
    borderColor: '#005C66',
    ringColor: '#A5ACAF',
    borderAccent: '#A5ACAF',
    cardBg: '#001A1D',
    buttonBg: '#004C54',
    buttonText: '#ffffff'
  },
  steelers: {
    id: 'steelers',
    teamName: 'Pittsburgh',
    fullName: 'Pittsburgh Steelers',
    primary: '#101820',
    secondary: '#FFB612',
    accentColor: '#FFC72C',
    headerBg: '#070B0E',
    subHeaderBg: '#151E28',
    borderColor: '#283542',
    ringColor: '#FFB612',
    borderAccent: '#FFB612',
    cardBg: '#0B1015',
    buttonBg: '#FFB612',
    buttonText: '#101820'
  },
  '49ers': {
    id: '49ers',
    teamName: 'San Francisco',
    fullName: 'San Francisco 49ers',
    primary: '#AA0000',
    secondary: '#B3995D',
    accentColor: '#E0C58A',
    headerBg: '#660000',
    subHeaderBg: '#8A0000',
    borderColor: '#B3995D',
    ringColor: '#B3995D',
    borderAccent: '#E0C58A',
    cardBg: '#2D0000',
    buttonBg: '#AA0000',
    buttonText: '#ffffff'
  },
  niners: {
    id: '49ers',
    teamName: 'San Francisco',
    fullName: 'San Francisco 49ers',
    primary: '#AA0000',
    secondary: '#B3995D',
    accentColor: '#E0C58A',
    headerBg: '#660000',
    subHeaderBg: '#8A0000',
    borderColor: '#B3995D',
    ringColor: '#B3995D',
    borderAccent: '#E0C58A',
    cardBg: '#2D0000',
    buttonBg: '#AA0000',
    buttonText: '#ffffff'
  },
  seahawks: {
    id: 'seahawks',
    teamName: 'Seattle',
    fullName: 'Seattle Seahawks',
    primary: '#002244',
    secondary: '#69BE28',
    accentColor: '#7CEB2B',
    headerBg: '#001224',
    subHeaderBg: '#002244',
    borderColor: '#00366B',
    ringColor: '#69BE28',
    borderAccent: '#69BE28',
    cardBg: '#000C19',
    buttonBg: '#69BE28',
    buttonText: '#002244'
  },
  buccaneers: {
    id: 'buccaneers',
    teamName: 'Tampa Bay',
    fullName: 'Tampa Bay Buccaneers',
    primary: '#D50A0A',
    secondary: '#FF7900',
    accentColor: '#FFA04D',
    headerBg: '#7A0606',
    subHeaderBg: '#A30808',
    borderColor: '#4A0303',
    ringColor: '#FF7900',
    borderAccent: '#FF7900',
    cardBg: '#2E0202',
    buttonBg: '#D50A0A',
    buttonText: '#ffffff'
  },
  titans: {
    id: 'titans',
    teamName: 'Tennessee',
    fullName: 'Tennessee Titans',
    primary: '#0C2340',
    secondary: '#4B92DB',
    accentColor: '#C8102E',
    headerBg: '#061324',
    subHeaderBg: '#0C2340',
    borderColor: '#1E3F66',
    ringColor: '#4B92DB',
    borderAccent: '#4B92DB',
    cardBg: '#040D17',
    buttonBg: '#4B92DB',
    buttonText: '#ffffff'
  },
  commanders: {
    id: 'commanders',
    teamName: 'Washington',
    fullName: 'Washington Commanders',
    primary: '#5A1414',
    secondary: '#FFB612',
    accentColor: '#FFC72C',
    headerBg: '#380C0C',
    subHeaderBg: '#5A1414',
    borderColor: '#380C0C',
    ringColor: '#FFB612',
    borderAccent: '#FFB612',
    cardBg: '#1F0606',
    buttonBg: '#5A1414',
    buttonText: '#FFB612'
  }
};

/**
 * 32 NFL Franchises + System Default, ordered alphabetically by City/Region Name
 */
export const ALL_NFL_TEAMS_ORDERED: string[] = [
  'forest',       // Forest Green (System Baseline)
  'cardinals',    // Arizona
  'falcons',      // Atlanta
  'ravens',       // Baltimore
  'bills',        // Buffalo
  'panthers',     // Carolina
  'bears',        // Chicago
  'bengals',      // Cincinnati
  'browns',       // Cleveland
  'cowboys',      // Dallas
  'broncos',      // Denver
  'lions',        // Detroit
  'packers',      // Green Bay
  'texans',       // Houston
  'colts',        // Indianapolis
  'jaguars',      // Jacksonville
  'chiefs',       // Kansas City
  'chargers',     // LA Chargers
  'rams',         // LA Rams
  'raiders',      // Las Vegas
  'dolphins',     // Miami
  'vikings',      // Minnesota
  'patriots',     // New England
  'saints',       // New Orleans
  'giants',       // NY Giants
  'jets',         // NY Jets
  'eagles',       // Philadelphia
  'steelers',     // Pittsburgh
  '49ers',        // San Francisco
  'seahawks',     // Seattle
  'buccaneers',   // Tampa Bay
  'titans',       // Tennessee
  'commanders'    // Washington
];

/**
 * Applies the selected NFL team theme across the document root as CSS custom properties.
 * Excludes Dispatches body parchment which remains permanently green and gold.
 */
export function applyGlobalAppTheme(theme: NflTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accentColor);
  root.style.setProperty('--theme-header-bg', theme.headerBg);
  root.style.setProperty('--theme-sub-header', theme.subHeaderBg);
  root.style.setProperty('--theme-border', theme.borderColor);
  root.style.setProperty('--theme-border-accent', theme.borderAccent || theme.secondary);
  root.style.setProperty('--theme-text', theme.textColor || '#ffffff');
  root.style.setProperty('--theme-ring', theme.ringColor);
  root.style.setProperty('--theme-card-bg', theme.cardBg || theme.subHeaderBg);
  root.style.setProperty('--theme-button-bg', theme.buttonBg || theme.primary);
  root.style.setProperty('--theme-button-text', theme.buttonText || '#ffffff');
}

export function getStoredMatrixTheme(): NflTheme {
  try {
    const stored = localStorage.getItem('nfl_pool_matrix_theme');
    if (stored && NFL_THEMES[stored]) {
      const theme = NFL_THEMES[stored];
      applyGlobalAppTheme(theme);
      return theme;
    }
  } catch (e) {
    console.warn('[Theme Storage] Failed to load stored theme, falling back to forest green:', e);
  }
  const defaultTheme = NFL_THEMES[DEFAULT_THEME_ID];
  applyGlobalAppTheme(defaultTheme);
  return defaultTheme;
}

export function setStoredMatrixTheme(themeId: string): NflTheme {
  const theme = NFL_THEMES[themeId] || NFL_THEMES[DEFAULT_THEME_ID];
  try {
    localStorage.setItem('nfl_pool_matrix_theme', theme.id);
  } catch (e) {
    console.warn('[Theme Storage] Failed to persist theme:', e);
  }
  applyGlobalAppTheme(theme);
  return theme;
}
