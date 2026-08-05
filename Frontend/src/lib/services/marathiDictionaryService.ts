/**
 * BOLA Marathi — Pure Word Dictionary Service
 * Serves 38,600+ pure dictionary words (Marathi, English, Hindi, Meaning).
 * Disconnected completely from sentence translation datasets.
 * 100% offline-first word lookup & word-based autocomplete suggestions.
 */

export interface MultilingualDictionaryEntry {
  marathi: string;
  hindi?: string;
  english?: string;
  meaning: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
  source?: string;
}

export interface QueryOptions {
  query?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: "asc" | "desc";
  difficultyFilter?: string;
  categoryFilter?: string;
  letterFilter?: string;
}

export interface QueryResult {
  items: MultilingualDictionaryEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const DEVANAGARI_LETTERS = [
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं",
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ",
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र",
  "ल", "व", "श", "ष", "स", "ह"
];

let cachedEntries: MultilingualDictionaryEntry[] | null = null;
let loadPromise: Promise<MultilingualDictionaryEntry[]> | null = null;

export class MarathiDictionaryService {
  /**
   * Load JSON file only once when application starts or on demand
   */
  public static async loadDictionary(): Promise<MultilingualDictionaryEntry[]> {
    if (cachedEntries) return cachedEntries;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      try {
        console.log("[MarathiDictionaryService] Loading pure dictionary JSON asset...");
        const resp = await fetch("/data/multilingual_dictionary.json");
        if (!resp.ok) {
          throw new Error(`Failed to fetch /data/multilingual_dictionary.json: HTTP ${resp.status}`);
        }
        const rawData: any[] = await resp.json();

        // Enforce single-word / short-phrase dictionary entries ONLY (no sentences)
        const entries: MultilingualDictionaryEntry[] = rawData.map((item) => ({
          marathi: (item.marathi || item.word || "").trim(),
          hindi: item.hindi ? item.hindi.trim() : undefined,
          english: item.english ? item.english.trim() : undefined,
          meaning: (item.meaning || item.englishMeaning || item.hindiMeaning || "").trim(),
          difficulty: item.difficulty || undefined,
          category: item.category || undefined,
          source: item.source || undefined
        })).filter(e => Boolean(e.marathi) && e.marathi.split(" ").length <= 3);

        cachedEntries = entries;
        console.log(`[MarathiDictionaryService] Successfully loaded ${entries.length} pure dictionary words into memory.`);
        return entries;
      } catch (err) {
        console.error("[MarathiDictionaryService] Error loading dictionary:", err);
        cachedEntries = [];
        return [];
      }
    })();

    return loadPromise;
  }

  /**
   * Check if dictionary is loaded
   */
  public static isLoaded(): boolean {
    return Boolean(cachedEntries && cachedEntries.length > 0);
  }

  /**
   * Quick search alias returning pure dictionary word entries
   */
  public static search(query: string, limit: number = 20): MultilingualDictionaryEntry[] {
    return this.queryEntries({ query, pageSize: limit }).items;
  }

  /**
   * Dynamically fetch available categories
   */
  public static getAvailableCategories(): string[] {
    if (!cachedEntries) return [];
    const set = new Set<string>();
    for (const e of cachedEntries) {
      if (e.category && e.category.trim()) {
        set.add(e.category.trim());
      }
    }
    return Array.from(set);
  }

  /**
   * Dynamically fetch available difficulty levels
   */
  public static getAvailableDifficulties(): string[] {
    if (!cachedEntries) return [];
    const set = new Set<string>();
    for (const e of cachedEntries) {
      if (e.difficulty && e.difficulty.trim()) {
        set.add(e.difficulty.trim());
      }
    }
    return Array.from(set);
  }

  /**
   * Query pure dictionary entries by Marathi word, English word, Hindi word, or Meaning.
   * NEVER returns sentence translations.
   */
  public static queryEntries(options: QueryOptions = {}): QueryResult {
    if (!cachedEntries) {
      return { items: [], totalCount: 0, totalPages: 0, currentPage: 1 };
    }

    const {
      query = "",
      page = 1,
      pageSize = 10,
      sortOrder = "asc",
      difficultyFilter = "All",
      categoryFilter = "All",
      letterFilter = "All"
    } = options;

    let filtered = cachedEntries;

    // 1. Filter by letter
    if (letterFilter && letterFilter !== "All") {
      filtered = filtered.filter((e) => e.marathi.startsWith(letterFilter));
    }

    // 2. Filter by difficulty
    if (difficultyFilter && difficultyFilter !== "All") {
      filtered = filtered.filter((e) => e.difficulty?.toLowerCase() === difficultyFilter.toLowerCase());
    }

    // 3. Filter by category
    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter((e) => e.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // 4. Word-based Search (Marathi word, English word, Hindi word, or Meaning)
    const trimmed = query.trim().toLowerCase();
    if (trimmed) {
      const exactMatches: MultilingualDictionaryEntry[] = [];
      const prefixMatches: MultilingualDictionaryEntry[] = [];
      const partialMatches: MultilingualDictionaryEntry[] = [];

      for (let i = 0; i < filtered.length; i++) {
        const entry = filtered[i];
        const m = entry.marathi.toLowerCase();
        const e = entry.english ? entry.english.toLowerCase() : "";
        const h = entry.hindi ? entry.hindi.toLowerCase() : "";
        const meaning = entry.meaning.toLowerCase();

        // Exact match on word
        if (m === trimmed || e === trimmed || h === trimmed) {
          exactMatches.push(entry);
        }
        // Prefix match on word
        else if (m.startsWith(trimmed) || (e && e.startsWith(trimmed)) || (h && h.startsWith(trimmed))) {
          prefixMatches.push(entry);
        }
        // Partial match on word or meaning
        else if (m.includes(trimmed) || (e && e.includes(trimmed)) || (h && h.includes(trimmed)) || meaning.includes(trimmed)) {
          partialMatches.push(entry);
        }
      }

      filtered = [...exactMatches, ...prefixMatches, ...partialMatches];
    }

    // 5. Sorting
    filtered = [...filtered].sort((a, b) => {
      const cmp = a.marathi.localeCompare(b.marathi, 'mr');
      return sortOrder === "asc" ? cmp : -cmp;
    });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (validPage - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      totalCount,
      totalPages,
      currentPage: validPage
    };
  }

  /**
   * Find page index for words starting with a specific letter
   */
  public static findPageForLetter(letter: string, pageSize: number = 10): number {
    if (!cachedEntries) return 1;

    for (let i = 0; i < cachedEntries.length; i++) {
      if (cachedEntries[i].marathi.startsWith(letter)) {
        return Math.floor(i / pageSize) + 1;
      }
    }
    return 1;
  }

  /**
   * Get total dictionary word count
   */
  public static getTotalCount(): number {
    return cachedEntries ? cachedEntries.length : 0;
  }
}
