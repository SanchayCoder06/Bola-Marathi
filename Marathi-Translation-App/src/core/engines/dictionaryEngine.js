/**
 * BOLA Marathi — Dictionary Engine
 * Core Engine Layer
 * 
 * Conducts word matching across IndexedDB definition index tables and manages bookmarks.
 */

import { DBService } from '../../infrastructure/storage/db.js';
import { StorageManager } from '../../infrastructure/storage/storageManager.js';
import { apiClient } from '../../api/client.js';

export const DictionaryEngine = (() => {
  let _fullIndex = [];
  let _isInitialized = false;

  async function init() {
    if (_isInitialized) return;
    _isInitialized = true;

    try {
      await DBService.seedIfEmpty();
      
      // Load seed vocabulary
      _fullIndex = await DBService.getAll('dictionary');
      
      // Lazily ingest lesson phrases into the search index
      const resLessons = await fetch('data/lessons/lessons.json');
      if (resLessons.ok) {
        const data = await resLessons.json();
        const seenWords = new Set(_fullIndex.map(w => w.word));
        
        data.modules.forEach(m => {
          m.lessons.forEach(l => {
            l.phrases.forEach(p => {
              const cleanWord = p.marathi.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g,"").trim();
              if (cleanWord && !seenWords.has(cleanWord)) {
                seenWords.add(cleanWord);
                _fullIndex.push({
                  word: cleanWord,
                  transliteration: p.transliteration,
                  partOfSpeech: 'Phrase',
                  englishMeaning: p.english,
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
      console.warn("DictionaryEngine failed to initialize index:", e);
    }
  }

  function searchWords(query) {
    if (!query || query.trim() === '') return _fullIndex.slice(0, 10);
    const q = query.trim().toLowerCase();

    return _fullIndex.filter(item => 
      item.word.includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.englishMeaning.toLowerCase().includes(q)
    );
  }

  async function searchOnline(word) {
    if (!word || word.trim() === '') return null;
    try {
      const result = await apiClient.dictionary({ word });
      if (result && result.word) {
        const existingIdx = _fullIndex.findIndex(w => w.word === result.word);
        if (existingIdx >= 0) {
          _fullIndex[existingIdx] = result;
        } else {
          _fullIndex.unshift(result);
        }
        await DBService.put('dictionary', result).catch(() => {});
      }
      return result;
    } catch (err) {
      console.warn("[DictionaryEngine] Online API search failed:", err);
      return null;
    }
  }

  return {
    init,
    searchWords,
    searchOnline
  };
})();

