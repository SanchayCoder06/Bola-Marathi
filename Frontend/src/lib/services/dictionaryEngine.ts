/**
 * BOLA Marathi — Dictionary Engine
 * Manages vocabulary index search and POST /api/dictionary online search fallback.
 * Safe initialization with instant static fallback vocabulary seeding.
 */

import { DBService } from './db';
import { apiClient } from '../api/client';
import { dictionaryWords } from '../data';
import type { DictionaryResponse } from '../api/types';

const defaultStaticVocabulary: DictionaryResponse[] = dictionaryWords.map((w: any) => ({
  word: w.mr,
  transliteration: w.ipa || '',
  partOfSpeech: w.pos || 'Noun',
  englishMeaning: w.en || '',
  hindiMeaning: w.hi || '',
  exampleMarathi: w.example || '',
  exampleEnglish: w.exampleEn || ''
}));

export const DictionaryEngine = (() => {
  let _fullIndex: DictionaryResponse[] = [...defaultStaticVocabulary];
  let _isInitialized = false;

  async function init(): Promise<void> {
    if (_isInitialized) return;
    _isInitialized = true;

    // Non-blocking async IndexedDB sync
    setTimeout(async () => {
      try {
        await Promise.race([
          DBService.open(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500))
        ]);

        const stored = await DBService.getAll<DictionaryResponse>('dictionary').catch(() => []);
        if (stored && stored.length > 0) {
          const seen = new Set(stored.map((s) => s.word));
          defaultStaticVocabulary.forEach((v) => {
            if (!seen.has(v.word)) {
              stored.push(v);
            }
          });
          _fullIndex = stored;
        }

        const resLessons = await fetch('/data/lessons/lessons.json').catch(() => null);
        if (resLessons && resLessons.ok) {
          const data = await resLessons.json();
          const seenWords = new Set(_fullIndex.map((w) => w.word));

          data.modules?.forEach((m: any) => {
            m.lessons?.forEach((l: any) => {
              l.phrases?.forEach((p: any) => {
                const cleanWord = p.marathi ? p.marathi.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g, '').trim() : '';
                if (cleanWord && !seenWords.has(cleanWord)) {
                  seenWords.add(cleanWord);
                  _fullIndex.push({
                    word: cleanWord,
                    transliteration: p.transliteration || '',
                    partOfSpeech: 'Phrase',
                    englishMeaning: p.english || '',
                    hindiMeaning: p.hindi || '',
                    exampleMarathi: p.marathi,
                    exampleEnglish: p.english
                  });
                }
              });
            });
          });
        }
      } catch (e) {
        console.warn('[DictionaryEngine] Async index initialization warning:', e);
      }
    }, 0);
  }

  function searchWords(query: string): DictionaryResponse[] {
    if (!_fullIndex || _fullIndex.length === 0) {
      _fullIndex = [...defaultStaticVocabulary];
    }

    if (!query || query.trim() === '') return _fullIndex.slice(0, 20);
    const q = query.trim().toLowerCase();

    return _fullIndex.filter(
      (item) =>
        (item.word && item.word.toLowerCase().includes(q)) ||
        (item.transliteration && item.transliteration.toLowerCase().includes(q)) ||
        (item.englishMeaning && item.englishMeaning.toLowerCase().includes(q))
    );
  }

  async function searchOnline(word: string): Promise<DictionaryResponse | null> {
    if (!word || word.trim() === '') return null;
    try {
      const result = await apiClient.dictionary({ word });
      if (result && result.word) {
        const existingIdx = _fullIndex.findIndex((w) => w.word === result.word);
        if (existingIdx >= 0) {
          _fullIndex[existingIdx] = result;
        } else {
          _fullIndex.unshift(result);
        }
        await DBService.put('dictionary', result).catch(() => {});
      }
      return result;
    } catch (err) {
      console.warn('[DictionaryEngine] Online API search failed:', err);
      return null;
    }
  }

  return {
    init,
    searchWords,
    searchOnline
  };
})();
