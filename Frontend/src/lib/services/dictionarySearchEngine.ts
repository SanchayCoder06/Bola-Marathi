import { richDictionaryCatalog, DictionaryItem } from '../data/dictionaryCatalog';
import { apiClient } from '../api/client';

export interface SearchOptions {
  query: string;
  categoryFilter?: string;
  difficultyFilter?: string;
  grammarFilter?: string;
  favoritesFilter?: boolean;
  bookmarkedSet?: Set<string>;
  limit?: number;
  page?: number;
}

export interface SearchResponseResult {
  items: DictionaryItem[];
  totalCount: number;
  hasMore: boolean;
  didYouMean?: string;
  detectedLanguage: 'en' | 'hi' | 'mr';
}

// Levenshtein Distance for Typo Correction
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Detect language of search query
export function detectLanguage(text: string): 'en' | 'hi' | 'mr' {
  if (!text) return 'en';
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;

  if (devanagariCount > latinCount) {
    if (/[\u0933\u0972\u090d\u0911]/.test(text) || /\b(आहे|नाही|आणि|कुठे|केले|आलो)\b/.test(text)) {
      return 'mr';
    }
    if (/\b(है|हैं|और|कहाँ|किया|आया)\b/.test(text)) {
      return 'hi';
    }
    return 'mr';
  }
  return 'en';
}

// Automatic category classifier
export function autoAssignCategory(word: string, english: string = '', hindi: string = '', marathi: string = ''): DictionaryItem['category'] {
  const text = `${word} ${english} ${hindi} ${marathi}`.toLowerCase();

  if (/\b(hello|hi|welcome|namaskar|bye|good morning|good night|thank|thanks|please|sorry)\b/.test(text) || /नमस्कार|धन्यवाद|प्रणाम/.test(text)) return 'Greetings';
  if (/\b(food|eat|drink|tea|water|coffee|lunch|dinner|meal|fruit|bread|rice|sugar|sweet|spicy|taste|biscuit)\b/.test(text) || /पाणी|चहा|जेवण|अन्न|फळ|गोड|भाजी/.test(text)) return 'Food';
  if (/\b(mother|father|brother|sister|friend|family|son|daughter|uncle|aunt|child|parent)\b/.test(text) || /आई|बाबा|भाऊ|बहीण|मित्र|दोस्त|कुटुंब/.test(text)) return 'Family';
  if (/\b(train|car|bus|road|station|ticket|travel|flight|airport|hotel|street|way|where)\b/.test(text) || /गाडी|रस्ता|तिकीट|कुठे|प्रवास|स्टेशन/.test(text)) return 'Travel';
  if (/\b(buy|sell|shop|store|price|cost|money|rupee|cheap|expensive|market|pay)\b/.test(text) || /किंमत|रुपये|बाजार|दुकान|खरेदी/.test(text)) return 'Shopping';
  if (/\b(doctor|hospital|medicine|health|sick|pain|fever|body|head|hand|eye|heart)\b/.test(text) || /डॉक्टर|रुग्णालय|औषध|आरोग्य|दुखणे/.test(text)) return 'Health';
  if (/\b(school|college|book|study|learn|teacher|student|exam|class|read|write)\b/.test(text) || /शाळा|पुस्तक|अभ्यास|शिक्षक|विद्यार्थी/.test(text)) return 'Education';
  if (/\b(festival|temple|god|music|dance|art|history|culture|tradition|india|pune|mumbai)\b/.test(text) || /सण|संस्कृती|मंदिर|उत्सव|महाराष्ट्र/.test(text)) return 'Culture';
  if (/\b(tree|flower|river|mountain|sky|sun|rain|cloud|nature|green|earth)\b/.test(text) || /नदी|झाड|फूल|डोंगर|आकाश|पाऊस|निसर्ग/.test(text)) return 'Nature';
  if (/\b(dog|cat|bird|cow|tiger|lion|animal|horse|elephant|fish)\b/.test(text) || /कुत्रा|मांजर|वाघ|सिंह|हत्ती|मासा|प्राणी/.test(text)) return 'Animals';
  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|count|number)\b/.test(text) || /एक|दोन|तीन|संख्या/.test(text)) return 'Numbers';
  if (/\b(time|today|tomorrow|yesterday|now|hour|day|night|morning|evening|week|year)\b/.test(text) || /आज|उद्या|काल|वेळ|दिवस|रात्र/.test(text)) return 'Time';
  if (/\b(run|walk|speak|talk|write|read|go|come|see|look|listen|make|give|take)\b/.test(text) || /बोलणे|शिकणे|जाणे|येणे|पाहणे/.test(text)) return 'Verbs';
  if (/\b(good|bad|nice|big|small|happy|sad|hot|cold|fast|slow|beautiful)\b/.test(text) || /छान|मोठा|लहान|आनंदी|सुंदर/.test(text)) return 'Adjectives';

  return 'Daily Conversation';
}

export class DictionarySearchEngine {
  private static catalog: DictionaryItem[] = richDictionaryCatalog;

  // Get autocomplete search suggestions for input prefix
  public static getSuggestions(input: string, limit: number = 5): string[] {
    if (!input || !input.trim()) return [];
    const q = input.trim().toLowerCase();
    const suggestions = new Set<string>();

    for (const item of this.catalog) {
      if (item.word.toLowerCase().startsWith(q)) suggestions.add(item.word);
      if (item.transliteration.toLowerCase().startsWith(q)) suggestions.add(item.transliteration);
      if (item.englishMeaning.toLowerCase().startsWith(q)) suggestions.add(item.englishMeaning);
      if (item.hindiMeaning.toLowerCase().startsWith(q)) suggestions.add(item.hindiMeaning);
      if (suggestions.size >= limit) break;
    }

    return Array.from(suggestions);
  }

  // Find typo correction suggestion if query yields 0 results
  public static getTypoSuggestion(query: string): string | undefined {
    if (!query || query.length < 3) return undefined;
    const q = query.trim().toLowerCase();

    let bestMatch: string | undefined = undefined;
    let minDistance = 999;

    for (const item of this.catalog) {
      const candidates = [
        item.word,
        item.transliteration,
        item.englishMeaning,
        item.hindiMeaning
      ];

      for (const cand of candidates) {
        const candLower = cand.toLowerCase();
        const dist = levenshteinDistance(q, candLower);
        if (dist < minDistance && dist <= 2 && dist > 0) {
          minDistance = dist;
          bestMatch = cand;
        }
      }
    }

    return bestMatch;
  }

  // Merge duplicate words together into single combined entries
  private static mergeDuplicateEntries(items: DictionaryItem[]): DictionaryItem[] {
    const wordMap = new Map<string, DictionaryItem>();

    for (const item of items) {
      const key = item.word.trim().toLowerCase();
      if (!wordMap.has(key)) {
        wordMap.set(key, { ...item });
      } else {
        const existing = wordMap.get(key)!;
        // Merge english meanings
        if (item.englishMeaning && !existing.englishMeaning.includes(item.englishMeaning)) {
          existing.englishMeaning = `${existing.englishMeaning} / ${item.englishMeaning}`;
        }
        // Merge hindi meanings
        if (item.hindiMeaning && !existing.hindiMeaning.includes(item.hindiMeaning)) {
          existing.hindiMeaning = existing.hindiMeaning ? `${existing.hindiMeaning} / ${item.hindiMeaning}` : item.hindiMeaning;
        }
        // Merge examples
        if (item.exampleMarathi && !existing.exampleMarathi) {
          existing.exampleMarathi = item.exampleMarathi;
          existing.exampleEnglish = item.exampleEnglish;
          existing.exampleHindi = item.exampleHindi;
        }
      }
    }

    return Array.from(wordMap.values());
  }

  // Primary search method supporting filtering, pagination, and backend SQLite FTS integration
  public static async search(options: SearchOptions): Promise<SearchResponseResult> {
    const {
      query = '',
      categoryFilter,
      difficultyFilter,
      grammarFilter,
      favoritesFilter,
      bookmarkedSet = new Set(),
      limit = 30,
      page = 1
    } = options;

    const cleanQuery = query.trim().toLowerCase();
    const detectedLanguage = detectLanguage(query);

    let rawList: DictionaryItem[] = [...this.catalog];

    // 1. Search backend SQLite database (all 155,384 trilingual records)
    try {
      const backendRes = await apiClient.search({ query: cleanQuery || 'a', limit: 60 });
      if (backendRes && backendRes.results && backendRes.results.length > 0) {
        const existingWords = new Set(rawList.map((f) => f.word.toLowerCase()));

        backendRes.results.forEach((bItem: any) => {
          const marathi = bItem.marathi || bItem.word;
          const english = bItem.english || bItem.englishMeaning;
          const hindi = bItem.hindi || bItem.hindiMeaning;

          if (marathi && marathi.trim()) {
            const cat = autoAssignCategory(marathi, english, hindi);
            if (!existingWords.has(marathi.trim().toLowerCase())) {
              existingWords.add(marathi.trim().toLowerCase());
              rawList.push({
                id: `db_${bItem.id || Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                word: marathi.trim(),
                transliteration: english ? `${english.toLowerCase().slice(0, 30)}` : '',
                englishMeaning: english || '',
                hindiMeaning: hindi || '',
                partOfSpeech: marathi.endsWith('णे') ? 'Verb' : 'Noun',
                difficulty: 'Intermediate',
                category: cat,
                exampleMarathi: marathi,
                exampleEnglish: english,
                exampleHindi: hindi,
                meaningExplanation: 'Retrieved from BOLA 155,000+ trilingual database memory.'
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn('[DictionarySearchEngine] Backend FTS database query error:', err);
    }

    // 2. Apply category filter
    if (categoryFilter && categoryFilter !== 'All') {
      rawList = rawList.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // 3. Apply difficulty filter
    if (difficultyFilter && difficultyFilter !== 'All') {
      rawList = rawList.filter(
        (item) => item.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // 4. Apply grammar filter (Verbs, Nouns, Adjectives)
    if (grammarFilter && grammarFilter !== 'All') {
      rawList = rawList.filter((item) =>
        item.partOfSpeech.toLowerCase().includes(grammarFilter.toLowerCase())
      );
    }

    // 5. Apply favorites filter
    if (favoritesFilter) {
      rawList = rawList.filter((item) => bookmarkedSet.has(item.word));
    }

    // 6. Apply search query matching (Exact, Prefix, Suffix, Substring, Fuzzy)
    if (cleanQuery) {
      const matchedLocal: { item: DictionaryItem; score: number }[] = [];

      for (const item of rawList) {
        let score = 0;
        const wordL = item.word.toLowerCase();
        const transL = item.transliteration.toLowerCase();
        const enL = item.englishMeaning.toLowerCase();
        const hiL = item.hindiMeaning.toLowerCase();

        // Exact match -> score 100
        if (wordL === cleanQuery || transL === cleanQuery || enL === cleanQuery || hiL === cleanQuery) {
          score += 100;
        }
        // Prefix match -> score 75
        else if (wordL.startsWith(cleanQuery) || transL.startsWith(cleanQuery) || enL.startsWith(cleanQuery) || hiL.startsWith(cleanQuery)) {
          score += 75;
        }
        // Suffix match -> score 50
        else if (wordL.endsWith(cleanQuery) || transL.endsWith(cleanQuery) || enL.endsWith(cleanQuery) || hiL.endsWith(cleanQuery)) {
          score += 50;
        }
        // Substring match -> score 25
        else if (wordL.includes(cleanQuery) || transL.includes(cleanQuery) || enL.includes(cleanQuery) || hiL.includes(cleanQuery)) {
          score += 25;
        }
        // Fuzzy match -> score 10
        else {
          const distEn = levenshteinDistance(cleanQuery, enL);
          const distTrans = levenshteinDistance(cleanQuery, transL);
          if (distEn <= 2 || distTrans <= 2) {
            score += 10;
          }
        }

        if (score > 0) {
          matchedLocal.push({ item, score });
        }
      }

      // Sort by match score descending
      matchedLocal.sort((a, b) => b.score - a.score);
      rawList = matchedLocal.map((m) => m.item);
    }

    // 7. Merge duplicate entries
    const mergedList = this.mergeDuplicateEntries(rawList);

    // Check for typo suggestion if 0 results
    let didYouMean: string | undefined = undefined;
    if (mergedList.length === 0 && cleanQuery) {
      didYouMean = this.getTypoSuggestion(cleanQuery);
    }

    // Pagination (Load 20-30 cards per page)
    const totalCount = mergedList.length;
    const startIndex = 0;
    const endIndex = page * limit;
    const paginatedItems = mergedList.slice(startIndex, endIndex);
    const hasMore = endIndex < totalCount;

    return {
      items: paginatedItems,
      totalCount,
      hasMore,
      didYouMean,
      detectedLanguage
    };
  }
}
