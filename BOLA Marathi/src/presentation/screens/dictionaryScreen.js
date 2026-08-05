/**
 * BOLA Marathi — DictionaryScreen Component
 * Presentation Layer
 */

import { AppState } from '../../application/state/appState.js';
import { DictionaryEngine } from '../../core/engines/dictionaryEngine.js';
import { CultureEngine } from '../../core/engines/cultureEngine.js';
import { AudioEngine } from '../../core/engines/audioEngine.js';
import { apiClient } from '../../api/client.js';

export const DictionaryScreen = {
  async render(container) {
    await DictionaryEngine.init();
    await CultureEngine.init();

    const state = AppState.getState();
    const playerXp = state.stats.xp;
    let activeSubTab = 'vocabulary'; // 'vocabulary' | 'culture' | 'translator'
    let currentDirection = 'en_to_mr';

    function _drawScreen() {
      container.innerHTML = `
        <div class="screen active" id="screen-dictionary" style="display: flex; flex-direction: column; min-height: 80vh;">
          <div class="screen-header" style="margin-bottom: 16px;">
            <h1 class="screen-title text-gradient" style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.45rem; color: var(--text-primary); margin: 0;">Reference Desk</h1>
            <p class="screen-subtitle" style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 4px;">Browse vocabulary definitions, cultural topics, and AI translator</p>
          </div>

          <!-- Tab Selector Toggle -->
          <div class="tab-header-toggle" style="display: flex; margin-bottom: 16px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; border: var(--border-glass);">
            <button class="toggle-btn" id="btnTabVocab" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${activeSubTab === 'vocabulary' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-size: 0.82rem;">📖 Vocabulary</button>
            <button class="toggle-btn" id="btnTabTranslate" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${activeSubTab === 'translator' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-size: 0.82rem;">🔄 Translator</button>
            <button class="toggle-btn" id="btnTabCulture" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${activeSubTab === 'culture' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-size: 0.82rem;">🏮 Culture Logs</button>
          </div>

          <!-- Dynamic Content Container -->
          <div id="dictContentArea" style="flex: 1;"></div>
        </div>
      `;

      document.getElementById('btnTabVocab').addEventListener('click', () => {
        activeSubTab = 'vocabulary';
        _drawScreen();
      });

      document.getElementById('btnTabTranslate').addEventListener('click', () => {
        activeSubTab = 'translator';
        _drawScreen();
      });

      document.getElementById('btnTabCulture').addEventListener('click', () => {
        activeSubTab = 'culture';
        _drawScreen();
      });

      if (activeSubTab === 'vocabulary') {
        _drawVocabularyTab();
      } else if (activeSubTab === 'translator') {
        _drawTranslatorTab();
      } else {
        _drawCultureTab();
      }
    }

    function _drawVocabularyTab() {
      const targetArea = document.getElementById('dictContentArea');
      if (!targetArea) return;

      targetArea.innerHTML = `
        <div class="glass-card" style="padding: 16px; margin-bottom: 16px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card);">
          <div class="search-input-wrapper" style="display: flex; gap: 8px;">
            <input type="text" id="dictSearchText" class="input-field" placeholder="Search words or meanings..." style="flex: 1; border-radius: 12px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.06); padding: 12px; font-size: 0.95rem; outline: none;" />
            <button class="btn btn-primary" id="btnExecuteSearch" style="padding: 0 20px; border-radius: 12px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer;">Search</button>
          </div>
        </div>

        <div id="searchResultsList" style="display: flex; flex-direction: column; gap: 12px;"></div>
      `;

      const input = document.getElementById('dictSearchText');
      const list = document.getElementById('searchResultsList');

      async function _performSearch() {
        const query = input.value.trim();
        if (!query) {
          const defaultResults = DictionaryEngine.searchWords('');
          _renderResults(defaultResults);
          return;
        }

        list.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 0.9rem;">
            Searching dictionary for "${query}"...
          </div>
        `;

        try {
          // 1. Direct call to POST /api/dictionary
          const onlineResult = await apiClient.dictionary({ word: query });

          let combinedResults = [];
          if (onlineResult && onlineResult.word) {
            combinedResults.push(onlineResult);
            DictionaryEngine.searchOnline(query).catch(() => {});
          }

          const localMatches = DictionaryEngine.searchWords(query);
          localMatches.forEach(item => {
            if (!combinedResults.some(r => r.word === item.word)) {
              combinedResults.push(item);
            }
          });

          if (combinedResults.length === 0) {
            list.innerHTML = `
              <div style="text-align: center; padding: 24px; color: var(--text-tertiary); font-size: 0.9rem;">
                No dictionary entries found for "${query}".
              </div>
            `;
            return;
          }

          _renderResults(combinedResults);
        } catch (err) {
          console.warn("[DictionaryScreen] API call failed, using local offline fallback:", err);
          const localResults = DictionaryEngine.searchWords(query);
          _renderResults(localResults);
        }
      }

      function _renderResults(results) {
        if (!results || results.length === 0) {
          list.innerHTML = `
            <div style="text-align: center; padding: 24px; color: var(--text-tertiary); font-size: 0.9rem;">
              No dictionary entries found.
            </div>
          `;
          return;
        }

        list.innerHTML = results.map(item => `
          <div class="glass-card result-word-card" data-word="${item.word}" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-radius: 16px; border: var(--border-glass); background: var(--bg-card); transition: transform 0.2s;">
            <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
              <button class="btn-speak-word" data-word="${item.word}" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 50%; font-size: 0.9rem; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--text-primary); transition: background 0.2s;">🔊</button>
              <div>
                <div style="font-size: 1.15rem; font-weight: bold; font-family: var(--font-marathi); color: var(--text-primary);">${item.word} <span style="font-size: 0.8rem; font-weight: 500; color: var(--color-accent); font-family: var(--font-ui);">(${item.transliteration || ''})</span></div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${item.englishMeaning || ''}</div>
              </div>
            </div>
            <div style="font-size: 0.75rem; color: var(--color-accent); font-weight: 700;">${item.partOfSpeech || 'Noun'}</div>
          </div>
        `).join('');

        list.querySelectorAll('.result-word-card').forEach(card => {
          card.addEventListener('click', () => {
            const word = card.dataset.word;
            const detail = results.find(x => x.word === word);
            if (detail) {
              _showWordDetailsModal(detail);
            }
          });
        });

        list.querySelectorAll('.btn-speak-word').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.dataset.word;
            AudioEngine.speak(word);
          });
        });
      }

      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          _performSearch();
        }, 250);
      });

      document.getElementById('btnExecuteSearch').addEventListener('click', _performSearch);
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(debounceTimer);
          _performSearch();
        }
      });

      _performSearch();
    }

    function _drawTranslatorTab() {
      const targetArea = document.getElementById('dictContentArea');
      if (!targetArea) return;

      targetArea.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Direction Controls -->
          <div class="glass-card" style="padding: 14px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase;">Translation Direction</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
              <button class="dir-btn ${currentDirection === 'en_to_mr' ? 'active' : ''}" data-dir="en_to_mr" style="padding: 8px 12px; border-radius: 10px; border: 1px solid ${currentDirection === 'en_to_mr' ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}; background: ${currentDirection === 'en_to_mr' ? 'rgba(255,138,0,0.15)' : 'rgba(0,0,0,0.1)'}; color: ${currentDirection === 'en_to_mr' ? 'var(--color-accent)' : 'var(--text-primary)'}; font-size: 0.8rem; font-weight: 700; cursor: pointer;">English ➔ Marathi</button>
              <button class="dir-btn ${currentDirection === 'mr_to_en' ? 'active' : ''}" data-dir="mr_to_en" style="padding: 8px 12px; border-radius: 10px; border: 1px solid ${currentDirection === 'mr_to_en' ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}; background: ${currentDirection === 'mr_to_en' ? 'rgba(255,138,0,0.15)' : 'rgba(0,0,0,0.1)'}; color: ${currentDirection === 'mr_to_en' ? 'var(--color-accent)' : 'var(--text-primary)'}; font-size: 0.8rem; font-weight: 700; cursor: pointer;">Marathi ➔ English</button>
              <button class="dir-btn ${currentDirection === 'hi_to_mr' ? 'active' : ''}" data-dir="hi_to_mr" style="padding: 8px 12px; border-radius: 10px; border: 1px solid ${currentDirection === 'hi_to_mr' ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}; background: ${currentDirection === 'hi_to_mr' ? 'rgba(255,138,0,0.15)' : 'rgba(0,0,0,0.1)'}; color: ${currentDirection === 'hi_to_mr' ? 'var(--color-accent)' : 'var(--text-primary)'}; font-size: 0.8rem; font-weight: 700; cursor: pointer;">Hindi ➔ Marathi</button>
              <button class="dir-btn ${currentDirection === 'mr_to_hi' ? 'active' : ''}" data-dir="mr_to_hi" style="padding: 8px 12px; border-radius: 10px; border: 1px solid ${currentDirection === 'mr_to_hi' ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}; background: ${currentDirection === 'mr_to_hi' ? 'rgba(255,138,0,0.15)' : 'rgba(0,0,0,0.1)'}; color: ${currentDirection === 'mr_to_hi' ? 'var(--color-accent)' : 'var(--text-primary)'}; font-size: 0.8rem; font-weight: 700; cursor: pointer;">Marathi ➔ Hindi</button>
            </div>
          </div>

          <!-- Input Textarea -->
          <div class="glass-card" style="padding: 16px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card); display: flex; flex-direction: column; gap: 12px;">
            <textarea id="translateInput" rows="3" placeholder="Enter text to translate..." style="width: 100%; border-radius: 12px; background: rgba(0,0,0,0.15); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.08); padding: 12px; font-size: 0.95rem; outline: none; resize: none; box-sizing: border-box;"></textarea>
            <button id="btnTranslateExecute" class="btn btn-primary" style="height: 48px; border-radius: 14px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; font-size: 0.95rem;">Translate</button>
          </div>

          <!-- Translation Output Card -->
          <div id="translateResultArea"></div>
        </div>
      `;

      targetArea.querySelectorAll('.dir-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentDirection = btn.dataset.dir;
          _drawTranslatorTab();
        });
      });

      const translateBtn = document.getElementById('btnTranslateExecute');
      const translateInput = document.getElementById('translateInput');
      const resultArea = document.getElementById('translateResultArea');

      async function _doTranslate() {
        const text = translateInput.value.trim();
        if (!text) return;

        resultArea.innerHTML = `
          <div class="glass-card" style="padding: 20px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card); text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
            Translating via AI engine...
          </div>
        `;

        try {
          const res = await apiClient.translate({ text, direction: currentDirection });

          resultArea.innerHTML = `
            <div class="glass-card" style="padding: 20px; border-radius: 20px; border: 1px solid rgba(255, 138, 0, 0.2); background: var(--bg-card); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 14px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase;">Translation</span>
                  <button id="btnSpeakTranslate" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 50%; width: 34px; height: 34px; font-size: 0.95rem; cursor: pointer; color: var(--text-primary); display: flex; align-items: center; justify-content: center;">🔊</button>
                </div>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-top: 4px; font-family: var(--font-marathi); line-height: 1.3;">
                  ${res.translatedText || 'N/A'}
                </div>
              </div>

              ${res.transliteration ? `
                <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                  <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase;">Transliteration (Pronunciation)</span>
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-accent); margin-top: 2px;">
                    ${res.transliteration}
                  </div>
                </div>
              ` : ''}
            </div>
          `;

          const speakBtn = document.getElementById('btnSpeakTranslate');
          if (speakBtn) {
            speakBtn.addEventListener('click', () => {
              AudioEngine.speak(res.translatedText);
            });
          }
        } catch (err) {
          resultArea.innerHTML = `
            <div class="glass-card" style="padding: 16px; border-radius: 16px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); color: #EF4444; font-size: 0.88rem;">
              Translation error: ${err.message || 'Server error'}
            </div>
          `;
        }
      }

      translateBtn.addEventListener('click', _doTranslate);
      translateInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          _doTranslate();
        }
      });
    }

    function _drawCultureTab() {
      const targetArea = document.getElementById('dictContentArea');
      if (!targetArea) return;

      const cards = CultureEngine.getCultureCards(playerXp);

      targetArea.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${cards.map(c => {
            let imgPath = '';
            if (c.id === 'culture-pune-ganpati') imgPath = 'assets/images/ganesh_festival.png';
            if (c.id === 'culture-pune-misal') imgPath = 'assets/images/modak.png';
            if (c.id === 'culture-pune-shaniwarwada') imgPath = 'assets/images/shivaji_maharaj.png';
            if (c.id === 'lavani') imgPath = 'assets/images/lavani.png';

            return `
              <div class="glass-card ${c.isUnlocked ? '' : 'locked'}" style="border-radius: 20px; border: var(--border-glass); background: var(--bg-card); overflow: hidden; opacity: ${c.isUnlocked ? '1' : '0.55'}; box-shadow: var(--shadow-sm);">
                ${c.isUnlocked && imgPath ? `<img src="${imgPath}" style="width: 100%; height: 130px; object-fit: cover; border-bottom: 1px solid rgba(255,255,255,0.06);" />` : ''}
                <div style="padding: 16px 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent); background: rgba(255, 123, 0, 0.1); padding: 4px 8px; border-radius: 8px; font-family: 'Inter', sans-serif;">
                      ${c.category.toUpperCase()}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">
                      ${c.isUnlocked ? '🔓 Unlocked' : `🔒 Requires ${c.unlockXp} XP`}
                    </span>
                  </div>
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-top: 0; margin-bottom: 6px; font-family: 'Poppins', sans-serif;">${c.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
                    ${c.isUnlocked ? c.description : 'Explore Maharashtra and acquire more XP checkpoints to unlock this cultural log card.'}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function _showWordDetailsModal(item) {
      const modal = document.createElement('div');
      modal.className = 'practice-modal-overlay';
      modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000;";
      
      const isWater = item.word && item.word.includes('पाणी');
      const modak = item.word && item.word.includes('मोदक');
      let imageNode = '';
      if (isWater) imageNode = `<img src="assets/images/water_glass.png" style="width: 100%; height: 140px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06);" />`;
      if (modak) imageNode = `<img src="assets/images/modak.png" style="width: 100%; height: 140px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06);" />`;

      modal.innerHTML = `
        <div class="glass-card" style="width: 90%; max-width: 380px; padding: 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: #0b1329; position: relative; box-sizing: border-box; text-align: left; box-shadow: var(--shadow-lg);">
          <div id="btnModalClose" style="position: absolute; top: 12px; right: 16px; font-size: 1.8rem; color: rgba(255,255,255,0.5); cursor: pointer; line-height: 1;">×</div>
          
          ${imageNode}
 
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="font-size: 1.7rem; font-weight: bold; font-family: var(--font-marathi); color: #fff;">${item.word}</div>
              <button id="btnModalSpeak" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 50%; font-size: 0.95rem; cursor: pointer; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: #fff;">🔊</button>
            </div>
            <div style="font-size: 0.9rem; color: var(--color-accent); margin-top: 4px; font-weight: 600;">${item.transliteration || ''}</div>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4); font-weight: 500; margin-top: 2px;">Type: ${item.partOfSpeech || 'Noun'}</div>
          </div>
 
          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 4px;">English Translation</div>
            <div style="font-size: 1.05rem; color: #fff; font-weight: 500;">${item.englishMeaning || ''}</div>
          </div>
 
          ${item.hindiMeaning ? `
            <div style="margin-top: 12px;">
              <div style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 4px;">Hindi Translation</div>
              <div style="font-size: 1.05rem; color: #fff; font-weight: 500; font-family: var(--font-marathi);">${item.hindiMeaning}</div>
            </div>
          ` : ''}
 
          ${item.exampleMarathi ? `
            <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="font-size: 0.85rem; font-weight: bold; color: #fff;">Example Usage</div>
                <button id="btnModalSpeakExample" style="background: transparent; border: none; font-size: 1.1rem; cursor: pointer; color: var(--color-accent);">🔊</button>
              </div>
              <div style="font-size: 1.1rem; color: #fff; font-family: var(--font-marathi); font-style: italic; background: rgba(0,0,0,0.15); padding: 8px 12px; border-radius: 8px; border: var(--border-glass);">"${item.exampleMarathi}"</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 6px; padding-left: 4px;">— ${item.exampleEnglish}</div>
            </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('#btnModalClose').addEventListener('click', () => {
        modal.remove();
      });

      modal.querySelector('#btnModalSpeak').addEventListener('click', () => {
        AudioEngine.speak(item.word);
      });

      const speakEx = modal.querySelector('#btnModalSpeakExample');
      if (speakEx && item.exampleMarathi) {
        speakEx.addEventListener('click', () => {
          AudioEngine.speak(item.exampleMarathi);
        });
      }
    }

    _drawScreen();
  }
};
