import fs from 'fs';
import path from 'path';
import rawQuotesArchive from '../../data/commish-archives/quotes.json';

export interface CommishQuote {
  id: string;
  category?: 'quote' | 'banter_intro';
  edition?: 'friday' | 'sunday' | 'tuesday' | 'any';
  quote: string;
  context: string;
  year?: number;
  topic?: string;
  tags?: string[];
  activeRosterSafe?: boolean;
}

export interface QuoteSelectionOptions {
  edition?: 'friday' | 'sunday' | 'tuesday';
  tagOrTopic?: string;
  preferredTags?: string[];
  excludeQuotes?: string[];
  includeHistoricalRoster?: boolean;
}

const ROTATION_STORAGE_KEY = 'bh_commish_quote_rotation_v2';

interface RotationState {
  usedQuoteIds: string[];
  usedBanterIds: string[];
  lastUpdated: string;
}

let inMemoryRotation: RotationState = {
  usedQuoteIds: [],
  usedBanterIds: [],
  lastUpdated: new Date().toISOString()
};

function getArchiveFilePath(filename = 'quotes.json'): string {
  try {
    if (typeof process !== 'undefined' && process.cwd && typeof window === 'undefined') {
      return path.join(process.cwd(), 'data', 'commish-archives', filename);
    }
  } catch {
    // Ignore in browser environment
  }
  return '';
}

function loadRotationState(): RotationState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(ROTATION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.usedQuoteIds)) {
          inMemoryRotation = {
            usedQuoteIds: parsed.usedQuoteIds,
            usedBanterIds: Array.isArray(parsed.usedBanterIds) ? parsed.usedBanterIds : [],
            lastUpdated: parsed.lastUpdated || new Date().toISOString()
          };
          return inMemoryRotation;
        }
      }
    } else {
      const rotFile = getArchiveFilePath('rotation-state.json');
      if (rotFile && fs && fs.existsSync && fs.existsSync(rotFile)) {
        const parsed = JSON.parse(fs.readFileSync(rotFile, 'utf-8'));
        if (parsed && Array.isArray(parsed.usedQuoteIds)) {
          inMemoryRotation = {
            usedQuoteIds: parsed.usedQuoteIds,
            usedBanterIds: Array.isArray(parsed.usedBanterIds) ? parsed.usedBanterIds : [],
            lastUpdated: parsed.lastUpdated || new Date().toISOString()
          };
          return inMemoryRotation;
        }
      }
    }
  } catch {
    // Ignore storage read errors and use in-memory state
  }
  return inMemoryRotation;
}

function saveRotationState(state: RotationState): void {
  inMemoryRotation = { ...state, lastUpdated: new Date().toISOString() };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(inMemoryRotation));
    } else {
      const rotFile = getArchiveFilePath('rotation-state.json');
      if (rotFile && fs && fs.writeFileSync) {
        const dir = path.dirname(rotFile);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(rotFile, JSON.stringify(inMemoryRotation, null, 2), 'utf-8');
      }
    }
  } catch {
    // Ignore storage write errors
  }
}

const BUNDLED_ARCHIVE: CommishQuote[] = Array.isArray(rawQuotesArchive)
  ? (rawQuotesArchive as CommishQuote[])
  : [];

let cachedQuotes: CommishQuote[] | null = null;

export function loadCommishQuotes(): CommishQuote[] {
  try {
    const archiveFile = getArchiveFilePath('quotes.json');
    if (archiveFile && fs && fs.existsSync && fs.existsSync(archiveFile)) {
      const content = fs.readFileSync(archiveFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedQuotes = parsed;
        return parsed;
      }
    }
  } catch {
    // In browser or when fs is unavailable, fall back to static bundled JSON import
  }
  return cachedQuotes || BUNDLED_ARCHIVE;
}

function fisherYatesShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Selects an authentic Don "The Commish" Threet quote from the segmented archive
 * using a non-repeating shuffle-bag rotation and context/edition matching.
 */
export function getRandomCommishQuote(optionsOrTag?: string | QuoteSelectionOptions): CommishQuote {
  const opts: QuoteSelectionOptions = typeof optionsOrTag === 'string'
    ? { tagOrTopic: optionsOrTag }
    : (optionsOrTag || {});

  const allEntries = loadCommishQuotes();
  const baseQuotes = allEntries.filter(q =>
    (q.category !== 'banter_intro') &&
    (opts.includeHistoricalRoster ? true : q.activeRosterSafe !== false)
  );

  // Filter by edition if provided ('friday', 'sunday', 'tuesday')
  let editionPool = baseQuotes;
  if (opts.edition) {
    const ed = opts.edition.toLowerCase();
    const matchedEdition = baseQuotes.filter(q =>
      !q.edition ||
      q.edition === 'any' ||
      q.edition === ed ||
      (q.tags && q.tags.some(t => t.toLowerCase() === ed))
    );
    if (matchedEdition.length > 0) {
      editionPool = matchedEdition;
    }
  }

  // Filter by explicit tagOrTopic if requested
  if (opts.tagOrTopic) {
    const filterTerm = opts.tagOrTopic.toLowerCase();
    const matchedTopic = editionPool.filter(q =>
      (q.topic && q.topic.toLowerCase().includes(filterTerm)) ||
      (q.tags && q.tags.some(t => t.toLowerCase().includes(filterTerm)))
    );
    if (matchedTopic.length > 0) {
      editionPool = matchedTopic;
    }
  }

  const rotation = loadRotationState();
  const excludeTexts = new Set(
    (opts.excludeQuotes || []).map(s => s.trim().toLowerCase()).filter(Boolean)
  );

  // Remove already-used quotes in current rotation cycle and explicit exclude list
  let unusedPool = editionPool.filter(q =>
    !rotation.usedQuoteIds.includes(q.id) &&
    !excludeTexts.has(q.quote.trim().toLowerCase())
  );

  // If all quotes for this edition have been used in the cycle, reset usedQuoteIds for this edition's IDs
  if (unusedPool.length === 0) {
    const editionIds = new Set(editionPool.map(q => q.id));
    rotation.usedQuoteIds = rotation.usedQuoteIds.filter(id => !editionIds.has(id));
    unusedPool = editionPool.filter(q => !excludeTexts.has(q.quote.trim().toLowerCase()));
    if (unusedPool.length === 0) {
      unusedPool = editionPool.length > 0 ? editionPool : baseQuotes;
    }
  }

  // If preferredTags are provided (e.g. 'mnf', 'tiebreaker', 'family', 'elvis'), prefer unused quotes matching those tags
  let finalCandidates = unusedPool;
  if (opts.preferredTags && opts.preferredTags.length > 0) {
    const prefSet = new Set(opts.preferredTags.map(t => t.toLowerCase()));
    const preferredMatches = unusedPool.filter(q =>
      q.tags && q.tags.some(t => prefSet.has(t.toLowerCase()))
    );
    if (preferredMatches.length > 0) {
      finalCandidates = preferredMatches;
    }
  }

  const shuffled = fisherYatesShuffle(finalCandidates);
  const selected = shuffled[0] || baseQuotes[0];

  if (selected && selected.id) {
    if (!rotation.usedQuoteIds.includes(selected.id)) {
      rotation.usedQuoteIds.push(selected.id);
    }
    saveRotationState(rotation);
  }

  return selected;
}

/**
 * Selects a non-repeating edition banter intro ('friday' | 'sunday' | 'tuesday')
 * from the segmented archive in quotes.json, eliminating hardcoded intro arrays.
 */
export function getRandomBanterIntro(
  edition: 'friday' | 'sunday' | 'tuesday',
  excludeIntros?: string[]
): string {
  const allEntries = loadCommishQuotes();
  const banterPool = allEntries.filter(q =>
    q.category === 'banter_intro' &&
    (q.edition === edition || q.edition === 'any' || (q.tags && q.tags.includes(edition))) &&
    q.activeRosterSafe !== false
  );

  if (banterPool.length === 0) {
    return getRandomCommishQuote({ edition }).quote;
  }

  const rotation = loadRotationState();
  const excludeTexts = new Set(
    (excludeIntros || []).map(s => s.trim().toLowerCase()).filter(Boolean)
  );

  let unusedBanter = banterPool.filter(b =>
    !rotation.usedBanterIds.includes(b.id) &&
    !excludeTexts.has(b.quote.trim().toLowerCase())
  );

  if (unusedBanter.length === 0) {
    const editionBanterIds = new Set(banterPool.map(b => b.id));
    rotation.usedBanterIds = rotation.usedBanterIds.filter(id => !editionBanterIds.has(id));
    unusedBanter = banterPool.filter(b => !excludeTexts.has(b.quote.trim().toLowerCase()));
    if (unusedBanter.length === 0) {
      unusedBanter = banterPool;
    }
  }

  const shuffled = fisherYatesShuffle(unusedBanter);
  const chosen = shuffled[0] || banterPool[0];

  if (chosen && chosen.id) {
    if (!rotation.usedBanterIds.includes(chosen.id)) {
      rotation.usedBanterIds.push(chosen.id);
    }
    saveRotationState(rotation);
  }

  return chosen.quote;
}

/**
 * Returns `count` distinct, active-roster-safe archive quotes for the given edition
 * to provide fresh historical flavor to the Crew Chief AI prompt without repeating.
 */
export function getCommishLoreSamples(
  edition: 'friday' | 'sunday' | 'tuesday',
  count = 3,
  excludeQuotes: string[] = []
): CommishQuote[] {
  const allEntries = loadCommishQuotes();
  const excludeSet = new Set(excludeQuotes.map(q => q.trim().toLowerCase()).filter(Boolean));

  const candidates = allEntries.filter(q =>
    q.category !== 'banter_intro' &&
    q.activeRosterSafe !== false &&
    !excludeSet.has(q.quote.trim().toLowerCase()) &&
    (!q.edition || q.edition === 'any' || q.edition === edition || (q.tags && q.tags.includes(edition)))
  );

  return fisherYatesShuffle(candidates).slice(0, count);
}

export function addCommishQuote(newQuote: Omit<CommishQuote, 'id'>): CommishQuote {
  const quotes = loadCommishQuotes();
  const id = `quote-${String(quotes.length + 1).padStart(3, '0')}`;
  const quoteWithId: CommishQuote = {
    category: 'quote',
    edition: 'any',
    activeRosterSafe: true,
    ...newQuote,
    id
  };
  quotes.push(quoteWithId);
  cachedQuotes = quotes;

  try {
    const archiveFile = getArchiveFilePath('quotes.json');
    if (archiveFile && fs && path) {
      const dir = path.dirname(archiveFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(archiveFile, JSON.stringify(quotes, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Commish Archives] Could not write new quote to quotes.json:', err);
  }

  return quoteWithId;
}
