/**
 * BOLA Marathi — Dictionary Manager
 * Application Layer
 * 
 * Manages search indexes for offline vocabulary lookup. Parses large lesson databases
 * in lazy-loaded asynchronous chunks to optimize UI thread execution times.
 */

export const DictionaryManager = (() => {
  
  const SEED_WORDS = [
    { word: 'नमस्कार', transliteration: 'Namaskar', partOfSpeech: 'Greeting', englishMeaning: 'Hello / Greetings', hindiMeaning: 'नमस्ते / नमस्कार', exampleMarathi: 'नमस्कार, कसे आहात?', exampleEnglish: 'Hello, what is your name?', exampleHindi: 'नमस्ते, आपका नाम क्या है?' },
    { word: 'धन्यवाद', transliteration: 'Dhanyavaad', partOfSpeech: 'Noun', englishMeaning: 'Thank you', hindiMeaning: 'धन्यवाद / शुक्रिया', exampleMarathi: 'मदतीसाठी खूप खूप धन्यवाद.', exampleEnglish: 'Thank you very much for the help.', exampleHindi: 'मदद के लिए बहुत--बहुत धन्यवाद।' },
    { word: 'कृपया', transliteration: 'Krupaya', partOfSpeech: 'Adverb', englishMeaning: 'Please', hindiMeaning: 'कृपया', exampleMarathi: 'कृपया मला पाणी द्या.', exampleEnglish: 'Please give me water.', exampleHindi: 'कृपया मुझे पानी दें।' },
    { word: 'कसे आहात', transliteration: 'Kase aahat', partOfSpeech: 'Phrase', englishMeaning: 'How are you? (formal)', hindiMeaning: 'आप कैसे हैं?', exampleMarathi: 'काका, तुम्ही कसे आहात?', exampleEnglish: 'Uncle, how are you?', exampleHindi: 'चाचाजी, आप कैसे हैं?' },
    { word: 'ठीक आहे', transliteration: 'Theek aahe', partOfSpeech: 'Adverb', englishMeaning: 'Okay / All right', hindiMeaning: 'ठीक है / अच्छा', exampleMarathi: 'ठीक आहे, आपण उद्या भेटू.', exampleEnglish: 'Okay, we will meet tomorrow.', exampleHindi: 'ठीक है, हम कल मिलेंगे।' },
    { word: 'हो', transliteration: 'Ho', partOfSpeech: 'Adverb', englishMeaning: 'Yes', hindiMeaning: 'हाँ', exampleMarathi: 'हो, मी मराठी शिकत आहे.', exampleEnglish: 'Yes, I am learning Marathi.', exampleHindi: 'हाँ, मैं मराठी सीख रहा हूँ।' },
    { word: 'नाही', transliteration: 'Naahi', partOfSpeech: 'Adverb', englishMeaning: 'No', hindiMeaning: 'नहीं', exampleMarathi: 'नाही, मला चहा नको आहे.', exampleEnglish: 'No, I do not want tea.', exampleHindi: 'नहीं, मुझे चाय नहीं चाहिए।' },
    { word: 'पाणी', transliteration: 'Paani', partOfSpeech: 'Noun', englishMeaning: 'Water', hindiMeaning: 'पानी / जल', exampleMarathi: 'मला प्यायला पाणी हवे आहे.', exampleEnglish: 'I want water to drink.', exampleHindi: 'मुझे पीने के लिए पानी चाहिए।' },
    { word: 'जेवण', transliteration: 'Jevan', partOfSpeech: 'Noun', englishMeaning: 'Food / Meal', hindiMeaning: 'खाना / भोजन', exampleMarathi: 'तुम्ही जेवण केले का?', exampleEnglish: 'Did you have your food?', exampleHindi: 'क्या आपने खाना खाया?' },
    { word: 'चहा', transliteration: 'Chaha', partOfSpeech: 'Noun', englishMeaning: 'Tea', hindiMeaning: 'चाय', exampleMarathi: 'मला गरम चहा आवडतो.', exampleEnglish: 'I like hot tea.', exampleHindi: 'मुझे गर्म चाय पसंद है।' }
  ];

  let _fullIndex = [...SEED_WORDS];
  let _cultureCards = [];
  let _isInitialized = false;

  /**
   * Initialize dictionary by loading lessons in lazy-loaded chunks
   */
  async function init() {
    if (_isInitialized) return;
    _isInitialized = true;

    try {
      // 1. Fetch culture cards database
      const resCulture = await fetch('data/culture.json');
      if (resCulture.ok) {
        const data = await resCulture.json();
        _cultureCards = data.cultureCards || [];
      }

      // 2. Fetch and parse lessons in lazy chunks
      const resLessons = await fetch('data/lessons.json');
      if (resLessons.ok) {
        const data = await resLessons.json();
        const allPhrases = [];
        
        data.modules.forEach(m => {
          m.lessons.forEach(l => {
            l.phrases.forEach(p => {
              allPhrases.push(p);
            });
          });
        });

        // Parse asynchronously in chunks of 50 phrases to avoid freezing the UI thread
        let phraseIndex = 0;
        const seenWords = new Set(SEED_WORDS.map(w => w.word));

        function parseChunk() {
          const CHUNK_SIZE = 50;
          let parsedCount = 0;

          while (phraseIndex < allPhrases.length && parsedCount < CHUNK_SIZE) {
            const p = allPhrases[phraseIndex];
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
                exampleEnglish: p.english,
                exampleHindi: p.hindi || ''
              });
            }
            
            phraseIndex++;
            parsedCount++;
          }

          if (phraseIndex < allPhrases.length) {
            // Schedule next parsing chunk on the next event loop tick
            if (window.requestIdleCallback) {
              window.requestIdleCallback(parseChunk);
            } else {
              setTimeout(parseChunk, 0);
            }
          } else {
            console.log(`Lazy loading vocabulary complete. Indexed ${_fullIndex.length} terms.`);
          }
        }

        parseChunk();
      }
    } catch (e) {
      console.warn("Dictionary initialization run in offline fallback mode:", e);
    }
  }

  /**
   * Search offline vocab database by query string
   * @param {string} query 
   */
  function searchWords(query) {
    if (!query || query.trim() === '') return _fullIndex.slice(0, 10);
    const q = query.trim().toLowerCase();

    return _fullIndex.filter(item => 
      item.word.includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.englishMeaning.toLowerCase().includes(q) ||
      item.hindiMeaning.toLowerCase().includes(q)
    );
  }

  /**
   * Get culture cards unlocked by the player's active XP level
   * @param {number} playerXp 
   */
  function getCultureCards(playerXp) {
    return _cultureCards.map(card => ({
      ...card,
      isUnlocked: playerXp >= card.unlockXp
    }));
  }

  return {
    init,
    searchWords,
    getCultureCards
  };
})();
