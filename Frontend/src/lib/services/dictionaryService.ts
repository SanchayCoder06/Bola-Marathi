/**
 * BOLA Marathi — Dedicated Word Dictionary Service
 * Responsible ONLY for word lookups and word autocomplete suggestions from /data/multilingual_dictionary.json.
 * Completely independent from sentence translation databases.
 * SSR-Safe: Gracefully falls back to empty arrays on Node.js server rendering.
 * Includes Gemini AI fallback for missing words with instant local caching.
 */

import { SharedAiService } from './sharedAiService';

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
const GENERATED_CACHE_KEY = "bola_dictionary_generated_cache";

export class DictionaryService {
  /**
   * Asynchronously load dictionary catalog (memory cache)
   */
  public static async loadDictionary(): Promise<MultilingualDictionaryEntry[]> {
    if (cachedEntries) return cachedEntries;
    if (loadPromise) return loadPromise;

    if (typeof window === "undefined") {
      return [];
    }

    loadPromise = (async () => {
      try {
        console.log("[DictionaryService] Loading pure dictionary JSON asset in browser...");
        const resp = await fetch("/data/multilingual_dictionary.json");
        if (!resp.ok) {
          throw new Error(`Failed to fetch /data/multilingual_dictionary.json: HTTP ${resp.status}`);
        }
        const rawData: any[] = await resp.json();

        const entries: MultilingualDictionaryEntry[] = rawData.map((item) => ({
          marathi: (item.marathi || item.word || "").trim(),
          hindi: item.hindi ? item.hindi.trim() : undefined,
          english: item.english ? item.english.trim() : undefined,
          meaning: (item.meaning || item.englishMeaning || item.hindiMeaning || "").trim(),
          difficulty: item.difficulty || undefined,
          category: item.category || undefined,
          source: item.source || undefined
        })).filter(e => Boolean(e.marathi) && e.marathi.split(" ").length <= 3);

        // Merge generated cached entries if present
        if (typeof localStorage !== "undefined") {
          try {
            const saved = localStorage.getItem(GENERATED_CACHE_KEY);
            if (saved) {
              const generatedItems: MultilingualDictionaryEntry[] = JSON.parse(saved);
              cachedEntries = [...generatedItems, ...entries];
              return cachedEntries;
            }
          } catch (err) {
            console.warn("[DictionaryService] Error loading generated dictionary cache:", err);
          }
        }

        cachedEntries = entries;
        console.log(`[DictionaryService] Successfully cached ${entries.length} pure dictionary words in memory.`);
        return entries;
      } catch (err) {
        console.error("[DictionaryService] Error loading dictionary:", err);
        cachedEntries = [];
        return [];
      }
    })();

    return loadPromise;
  }

  /**
   * Search dictionary words across Marathi, English, Hindi, and Meaning.
   */
  public static searchWord(options: QueryOptions = {}): QueryResult {
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

    if (letterFilter && letterFilter !== "All") {
      filtered = filtered.filter((e) => e.marathi.startsWith(letterFilter));
    }

    if (difficultyFilter && difficultyFilter !== "All") {
      filtered = filtered.filter((e) => e.difficulty?.toLowerCase() === difficultyFilter.toLowerCase());
    }

    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter((e) => e.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

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

        if (m === trimmed || e === trimmed || h === trimmed) {
          exactMatches.push(entry);
        } else if (m.startsWith(trimmed) || (e && e.startsWith(trimmed)) || (h && h.startsWith(trimmed))) {
          prefixMatches.push(entry);
        } else if (m.includes(trimmed) || (e && e.includes(trimmed)) || (h && h.includes(trimmed)) || meaning.includes(trimmed)) {
          partialMatches.push(entry);
        }
      }

      filtered = [...exactMatches, ...prefixMatches, ...partialMatches];
    }

    if (sortOrder === "desc") {
      filtered = [...filtered].reverse();
    }

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
   * Look up word with Gemini AI Fallback and local caching
   */
  public static async lookupWithAiFallback(queryWord: string): Promise<MultilingualDictionaryEntry> {
    await this.loadDictionary();
    const res = this.searchWord({ query: queryWord, pageSize: 1 });
    if (res.items.length > 0) {
      return res.items[0];
    }

    console.log(`[DictionaryService] Word "${queryWord}" not found locally. Triggering Gemini AI fallback...`);
    const generated = await SharedAiService.generateDictionaryEntry(queryWord);

    if (cachedEntries) {
      cachedEntries.unshift(generated);
    } else {
      cachedEntries = [generated];
    }

    if (typeof localStorage !== "undefined") {
      try {
        const existingSaved = localStorage.getItem(GENERATED_CACHE_KEY);
        const items: MultilingualDictionaryEntry[] = existingSaved ? JSON.parse(existingSaved) : [];
        items.unshift(generated);
        localStorage.setItem(GENERATED_CACHE_KEY, JSON.stringify(items.slice(0, 500)));
      } catch (err) {
        console.warn("[DictionaryService] Error saving generated dictionary word:", err);
      }
    }

    return generated;
  }

  public static getTotalCount(): number {
    return cachedEntries ? cachedEntries.length : 0;
  }

  public static getFavorites(): MultilingualDictionaryEntry[] {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return [];
    try {
      const saved = localStorage.getItem("bola_dictionary_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  public static getRecentWords(): MultilingualDictionaryEntry[] {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return [];
    try {
      const saved = localStorage.getItem("bola_dictionary_recent");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  public static isLoaded(): boolean {
    return cachedEntries !== null;
  }

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

  public static getSuggestions(prefix: string, limit: number = 5): string[] {
    if (!cachedEntries || !prefix.trim()) return [];
    const clean = prefix.trim().toLowerCase();
    const matches: string[] = [];

    for (const entry of cachedEntries) {
      if (entry.marathi.toLowerCase().startsWith(clean) || (entry.english && entry.english.toLowerCase().startsWith(clean))) {
        matches.push(entry.marathi);
        if (matches.length >= limit) break;
      }
    }
    return matches;
  }

  public static findPageForLetter(letter: string, pageSize: number = 10): number {
    if (!cachedEntries) return 1;
    for (let i = 0; i < cachedEntries.length; i++) {
      if (cachedEntries[i].marathi.startsWith(letter)) {
        return Math.floor(i / pageSize) + 1;
      }
    }
    return 1;
  }
}

export const MarathiDictionaryService = DictionaryService;
