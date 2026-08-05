/**
 * BOLA Marathi — PracticeScreen Component
 * Presentation Layer
 */

import { AppState } from '../../application/state/appState.js';
import { RevisionManager } from '../../core/engines/revisionManager.js';
import { DetectiveManager } from '../../core/engines/detectiveManager.js';
import { AIEngine } from '../../core/engines/aiEngine.js';

export const PracticeScreen = {
  async render(container) {
    const state = AppState.getState();
    const dueCount = await RevisionManager.getDueCount();
    const activeSubView = state.practiceSubView; // 'revision' | 'detective' | 'correct' | 'doubt' | null

    if (activeSubView === 'revision') {
      await _renderSmartRevisionDeck(container);
      return;
    }

    if (activeSubView === 'detective') {
      _renderDetectiveGames(container);
      return;
    }

    if (activeSubView === 'correct') {
      _renderFreeCorrectionSandbox(container);
      return;
    }

    if (activeSubView === 'doubt') {
      _renderAskDoubtSandbox(container);
      return;
    }

    _renderPracticeMenu(container, dueCount);
  }
};

function _renderPracticeMenu(container, dueCount) {
  container.innerHTML = `
    <div class="screen active" id="screen-practice-menu" style="display: flex; flex-direction: column; gap: 20px;">
      <div class="screen-header">
        <h1 class="screen-title text-gradient" style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.45rem; color: var(--text-primary); margin: 0;">Practice Sandbox</h1>
        <p class="screen-subtitle" style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 4px;">Strengthen your Marathi through local interactive drills</p>
      </div>

      <!-- Smart Revision Card -->
      <div class="glass-card" id="btnSmartRevision" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 1px solid rgba(255, 123, 0, 0.2); background: var(--bg-card); border-radius: 20px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="padding: 12px; background: rgba(255, 123, 0, 0.1); border-radius: 16px; color: var(--color-accent); display: flex;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); font-family: 'Poppins', sans-serif; margin: 0 0 2px;">Smart Revision</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; line-height: 1.3;">
              ${dueCount > 0 ? `${dueCount} weak areas scheduled. Review now.` : 'All caught up! Practice vocabulary on the map.'}
            </p>
          </div>
        </div>
        <div style="font-size: 1.3rem; color: var(--color-accent); font-weight: 700; font-family: 'Inter', sans-serif;">➔</div>
      </div>

      <!-- Grid of Subgames -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        
        <!-- Detective Mode -->
        <div class="glass-card" id="btnDetectiveMode" style="padding: 20px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border: var(--border-glass); background: var(--bg-card); border-radius: 20px; transition: transform 0.2s;">
          <div style="padding: 10px; background: rgba(108, 92, 231, 0.1); border-radius: 12px; color: var(--color-primary); width: fit-content; display: flex;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin: 0 0 2px; font-family: 'Poppins', sans-serif;">Detective Mode</h4>
            <p style="font-size: 0.75rem; color: var(--text-tertiary); margin: 0;">Find grammar errors</p>
          </div>
        </div>

        <!-- Free Correction -->
        <div class="glass-card" id="btnTextCorrection" style="padding: 20px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border: var(--border-glass); background: var(--bg-card); border-radius: 20px; transition: transform 0.2s;">
          <div style="padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; color: var(--color-success); width: fit-content; display: flex;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin: 0 0 2px; font-family: 'Poppins', sans-serif;">Free Correction</h4>
            <p style="font-size: 0.75rem; color: var(--text-tertiary); margin: 0;">Input text evaluation</p>
          </div>
        </div>

      </div>

      <!-- Ask a Doubt Card -->
      <div class="glass-card" id="btnAskDoubt" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: var(--border-glass); background: var(--bg-card); border-radius: 20px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="padding: 12px; background: rgba(0, 210, 255, 0.1); border-radius: 16px; color: var(--color-info); display: flex;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); font-family: 'Poppins', sans-serif; margin: 0 0 2px;">Ask a Doubt</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; line-height: 1.3;">Ask our AI language tutor grammar questions</p>
          </div>
        </div>
        <div style="font-size: 1.3rem; color: var(--color-info); font-weight: 700;">➔</div>
      </div>
    </div>
  `;

  document.getElementById('btnSmartRevision').addEventListener('click', () => {
    if (dueCount > 0) {
      AppState.update('practiceSubView', 'revision');
      PracticeScreen.render(container);
    } else {
      UI.showToast("No cards due! Weak items from map dialogue are saved here.");
    }
  });

  document.getElementById('btnDetectiveMode').addEventListener('click', () => {
    AppState.update('practiceSubView', 'detective');
    PracticeScreen.render(container);
  });

  document.getElementById('btnTextCorrection').addEventListener('click', () => {
    AppState.update('practiceSubView', 'correct');
    PracticeScreen.render(container);
  });

  document.getElementById('btnAskDoubt').addEventListener('click', () => {
    AppState.update('practiceSubView', 'doubt');
    PracticeScreen.render(container);
  });
}

function _renderFreeCorrectionSandbox(container) {
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; min-height: 80vh;">
      <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <button class="module-header__back" id="btnBackToMenu" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
        <div>
          <div style="font-weight: 800; color: var(--text-primary); font-size: 1.2rem; font-family: 'Poppins', sans-serif;">Free Text Correction</div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">Get immediate feedback on Marathi phrases</div>
        </div>
      </div>

      <div class="glass-card" style="padding: 20px; border-radius: 20px; background: var(--bg-card); border: var(--border-glass);">
        <label style="font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 8px; font-weight: 600;">Type your Marathi sentence (Devanagari):</label>
        <textarea id="txtCorrectionInput" rows="3" style="width: 100%; border-radius: 12px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.06); padding: 12px; font-size: 1.1rem; font-family: var(--font-marathi); box-sizing: border-box; resize: none; outline: none;" placeholder="उदा. माझे नाव राहुल आहे..."></textarea>
        <button class="btn btn-primary" id="btnRunCorrection" style="width: 100%; margin-top: 16px; padding: 12px; border-radius: 14px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; box-shadow: var(--shadow-glow-accent);">Evaluate Sentence</button>
      </div>

      <div id="correctionResultPanel" style="margin-top: 16px;"></div>
    </div>
  `;

  document.getElementById('btnBackToMenu').addEventListener('click', () => {
    AppState.update('practiceSubView', null);
    PracticeScreen.render(container);
  });

  const btnSubmit = document.getElementById('btnRunCorrection');
  const input = document.getElementById('txtCorrectionInput');
  const panel = document.getElementById('correctionResultPanel');

  btnSubmit.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) {
      UI.showToast("Please enter a sentence.");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Analyzing Sentence...";
    panel.innerHTML = `<div class="loading-spinner" style="margin-top: 24px;"></div>`;

    try {
      const data = await AIEngine.correctSentence(text);
      
      panel.innerHTML = `
        <div class="glass-card" style="padding: 20px; border-radius: 20px; background: var(--bg-card); border: 1px solid ${data.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 1.5rem;">${data.isCorrect ? '✅' : '✏️'}</span>
            <span style="font-weight: 800; font-family: 'Poppins', sans-serif; color: ${data.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}">
              ${data.isCorrect ? 'Sentence is Correct!' : 'Grammar Correction Suggestion'}
            </span>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 2px;">Your sentence:</div>
            <div style="font-size: 1.15rem; color: var(--text-primary); font-family: var(--font-marathi);">${text}</div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 2px;">Corrected sentence:</div>
            <div style="font-size: 1.15rem; color: var(--color-success); font-family: var(--font-marathi); font-weight: bold;">${data.corrected || text}</div>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
            <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 4px;">Grammar Explanation</div>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">${data.explanation}</p>
          </div>

          ${data.improvements ? `
            <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
              <div style="font-size: 0.8rem; color: var(--color-accent); font-weight: 700; margin-bottom: 4px;">Suggested Improvements</div>
              <div style="font-size: 0.92rem; color: var(--text-primary); font-family: var(--font-marathi); line-height: 1.4;">${data.improvements}</div>
            </div>
          ` : ''}
        </div>
      `;
    } catch (e) {
      panel.innerHTML = `<div class="glass-card" style="padding: 16px; border: 1px solid var(--color-error); color: var(--color-error); border-radius: 12px;">Error: ${e.message}</div>`;
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Evaluate Sentence";
    }
  });
}

function _renderAskDoubtSandbox(container) {
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; min-height: 80vh;">
      <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <button class="module-header__back" id="btnBackToMenu" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
        <div>
          <div style="font-weight: 800; color: var(--text-primary); font-size: 1.2rem; font-family: 'Poppins', sans-serif;">Ask a Doubt</div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">Clear your queries with the local AI tutor</div>
        </div>
      </div>

      <div class="glass-card" style="padding: 20px; border-radius: 20px; background: var(--bg-card); border: var(--border-glass);">
        <div style="display: flex; gap: 8px;">
          <input type="text" id="txtDoubtInput" class="input-field" placeholder="E.g. Difference between तो and ती?" style="flex: 1; border-radius: 12px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.06); padding: 12px; font-size: 0.95rem; outline: none;" />
          <button class="btn btn-primary" id="btnAskQuestion" style="padding: 0 20px; border-radius: 12px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer;">Ask</button>
        </div>
      </div>

      <div id="doubtResultPanel" style="margin-top: 16px;"></div>
    </div>
  `;

  document.getElementById('btnBackToMenu').addEventListener('click', () => {
    AppState.update('practiceSubView', null);
    PracticeScreen.render(container);
  });

  const btnSubmit = document.getElementById('btnAskQuestion');
  const input = document.getElementById('txtDoubtInput');
  const panel = document.getElementById('doubtResultPanel');

  btnSubmit.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) {
      UI.showToast("Please enter a question.");
      return;
    }

    btnSubmit.disabled = true;
    panel.innerHTML = `<div class="loading-spinner" style="margin-top: 24px;"></div>`;

    try {
      const data = await AIEngine.askDoubt(text);
      
      panel.innerHTML = `
        <div class="glass-card" style="padding: 20px; border-radius: 20px; background: var(--bg-card); border: var(--border-glass); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--color-accent); margin-top: 0; margin-bottom: 8px; font-family: 'Poppins', sans-serif;">Tutor Explanation</h3>
          <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.5; margin-top: 0; margin-bottom: 16px;">${data.answer}</p>

          ${data.examples && data.examples.length > 0 ? `
            <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
              <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 8px; font-weight: 600;">Related Examples</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.examples.map(ex => `
                  <div style="background: rgba(0,0,0,0.15); padding: 10px 14px; border-radius: 10px; border: var(--border-glass);">
                    <div style="font-size: 1.15rem; font-weight: bold; font-family: var(--font-marathi); color: var(--text-primary);">${ex.marathi}</div>
                    <div style="font-size: 0.8rem; color: var(--color-accent); margin-top: 2px;">${ex.transliteration}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${ex.english}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } catch (e) {
      panel.innerHTML = `<div class="glass-card" style="padding: 16px; border: 1px solid var(--color-error); color: var(--color-error); border-radius: 12px;">Error: ${e.message}</div>`;
    } finally {
      btnSubmit.disabled = false;
    }
  });
}

async function _renderSmartRevisionDeck(container) {
  const dueCards = await RevisionManager.getDueCards();
  if (dueCards.length === 0) {
    AppState.update('practiceSubView', null);
    PracticeScreen.render(container);
    return;
  }

  let phraseMap = {};
  try {
    const res = await fetch('data/lessons/lessons.json');
    if (res.ok) {
      const data = await res.json();
      data.modules.forEach(m => {
        m.lessons.forEach(l => {
          l.phrases.forEach(p => {
            phraseMap[p.marathi] = p;
          });
        });
      });
    }
  } catch (e) {
    console.warn(e);
  }

  let activeCardIndex = 0;
  let isFlipped = false;

  function _drawCard() {
    if (activeCardIndex >= dueCards.length) {
      AppState.update('practiceSubView', null);
      UI.showToast("Smart Revision session completed! 🎉");
      PracticeScreen.render(container);
      return;
    }

    const card = dueCards[activeCardIndex];
    const phrase = phraseMap[card.word] || { marathi: card.word, transliteration: '', english: 'Phrase revision target' };

    container.innerHTML = `
      <div class="screen active screen-flashcards" style="display: flex; flex-direction: column; min-height: 80vh;">
        <div class="flashcard-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <button class="flashcard-header__back" id="btnBackToMenu" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
          <div style="font-weight: 800; color: var(--text-primary); font-family: 'Poppins', sans-serif; font-size: 1.1rem;">Smart Revision Deck</div>
          <div style="font-size: 0.8rem; color: var(--text-tertiary); font-weight: 700; font-family: 'Inter', sans-serif;">${activeCardIndex + 1} / ${dueCards.length}</div>
        </div>

        <div class="flashcard-arena" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 250px;">
          <div class="flashcard-scene" id="btnFlipCard" style="width: 100%; max-width: 320px; height: 200px; perspective: 600px; cursor: pointer;">
            <div class="flashcard-inner ${isFlipped ? 'flipped' : ''}" style="width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; position: relative;">
              
              <!-- Front -->
              <div class="flashcard-face flashcard-face--front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; border: var(--border-glass); background: var(--bg-card); padding: 20px; box-sizing: border-box; box-shadow: var(--shadow-md);">
                <div style="font-size: 1.6rem; font-weight: bold; font-family: var(--font-marathi); text-align: center; color: var(--text-primary); line-height: 1.4;">${phrase.marathi}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 16px; font-weight: 600;">Tap card to reveal definition</div>
              </div>

              <!-- Back -->
              <div class="flashcard-face flashcard-face--back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; border: var(--border-glass); background: var(--bg-card); padding: 20px; box-sizing: border-box; transform: rotateY(180deg); box-shadow: var(--shadow-md);">
                <div style="font-size: 1.25rem; font-weight: bold; text-align: center; color: var(--color-accent); font-family: 'Poppins', sans-serif;">${phrase.english}</div>
                ${phrase.transliteration ? `<div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px; font-style: italic;">${phrase.transliteration}</div>` : ''}
              </div>

            </div>
          </div>
        </div>

        <div class="flashcard-actions" style="display: flex; gap: 16px; margin-top: 24px;">
          <button class="btn btn-secondary" id="btnMarkWrong" style="flex: 1; padding: 12px; border-radius: 14px; color: var(--color-error); border: 1px solid rgba(245, 87, 108, 0.2); background: rgba(245, 87, 108, 0.05); font-weight: 700; cursor: pointer;">Don't Know ✕</button>
          <button class="btn btn-primary" id="btnMarkCorrect" style="flex: 1; padding: 12px; border-radius: 14px; background: var(--gradient-success); color: #fff; border: none; font-weight: 700; cursor: pointer;">Know It ✓</button>
        </div>
      </div>
    `;

    document.getElementById('btnBackToMenu').addEventListener('click', () => {
      AppState.update('practiceSubView', null);
      PracticeScreen.render(container);
    });

    document.getElementById('btnFlipCard').addEventListener('click', () => {
      isFlipped = !isFlipped;
      _drawCard();
    });

    document.getElementById('btnMarkWrong').addEventListener('click', async () => {
      await RevisionManager.logAttempt(card.word, 40);
      isFlipped = false;
      activeCardIndex++;
      _drawCard();
    });

    document.getElementById('btnMarkCorrect').addEventListener('click', async () => {
      await RevisionManager.logAttempt(card.word, 95);
      // If mastered, remove from queue
      await RevisionManager.completeRevision(card.word);
      isFlipped = false;
      activeCardIndex++;
      _drawCard();
    });
  }

  _drawCard();
}

function _renderDetectiveGames(container) {
  let activeSubTab = 'impostor';

  function _drawScreen() {
    container.innerHTML = `
      <div class="screen active screen-quiz" style="display: flex; flex-direction: column; min-height: 80vh;">
        <div class="quiz-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <button class="quiz-header__back" id="btnBackToMenu" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
          <div>
            <div style="font-weight: 800; color: var(--text-primary); font-family: 'Poppins', sans-serif; font-size: 1.15rem;">Detective Sandbox</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">Investigate grammatical slip-ups</div>
          </div>
        </div>

        <div class="tab-header-toggle" style="display: flex; margin-bottom: 16px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; border: var(--border-glass);">
          <button class="toggle-btn ${activeSubTab === 'impostor' ? 'active' : ''}" id="btnSubTabImpostor" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${activeSubTab === 'impostor' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-size: 0.85rem;">🕵️‍♂️ Find Impostor</button>
          <button class="toggle-btn ${activeSubTab === 'scrambled' ? 'active' : ''}" id="btnSubTabScrambled" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: ${activeSubTab === 'scrambled' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-size: 0.85rem;">🧩 Arrange Words</button>
        </div>

        <div id="detectiveGameContent" style="flex: 1;"></div>
      </div>
    `;

    document.getElementById('btnBackToMenu').addEventListener('click', () => {
      AppState.update('practiceSubView', null);
      PracticeScreen.render(container);
    });

    const btnImp = document.getElementById('btnSubTabImpostor');
    const btnScr = document.getElementById('btnSubTabScrambled');

    btnImp.addEventListener('click', () => {
      activeSubTab = 'impostor';
      _drawScreen();
    });

    btnScr.addEventListener('click', () => {
      activeSubTab = 'scrambled';
      _drawScreen();
    });

    if (activeSubTab === 'impostor') {
      _drawImpostorGame();
    } else {
      _drawScrambledGame();
    }
  }

  function _drawImpostorGame() {
    const game = DetectiveManager.getImpostorGame();
    const content = document.getElementById('detectiveGameContent');
    if (!content) return;

    content.innerHTML = `
      <div class="quiz-question-card glass-card" style="padding: 24px; text-align: center; border-radius: 20px; background: var(--bg-card); border: var(--border-glass);">
        <div style="font-size: 0.8rem; color: var(--text-tertiary); font-weight: 700; margin-bottom: 12px;">CHALLENGE ${game.currentIndex + 1} OF ${game.totalCount}</div>
        <div style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 24px; font-weight: 700; font-family: 'Poppins', sans-serif;">Tap the grammatically incorrect word:</div>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 24px;">
          ${game.words.map((word, idx) => `
            <button class="impostor-word-chip" data-index="${idx}" style="padding: 12px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.15); color: var(--text-primary); font-size: 1.25rem; font-family: var(--font-marathi); cursor: pointer; font-weight: bold; transition: 200ms;">
              ${word}
            </button>
          `).join('')}
        </div>

        <div id="impostorFeedback"></div>
      </div>
    `;

    content.querySelectorAll('.impostor-word-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const isCorrect = DetectiveManager.checkImpostorSelection(idx);

        content.querySelectorAll('.impostor-word-chip').forEach(b => b.disabled = true);

        const feedback = document.getElementById('impostorFeedback');
        if (isCorrect) {
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
          btn.style.borderColor = 'var(--color-success)';
          feedback.innerHTML = `
            <div style="color: var(--color-success); font-weight: 800; margin-top: 16px; font-family: 'Poppins', sans-serif;">Correct! (+15 XP) 🎉</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.4;">${game.explanation}</div>
            <button class="btn btn-primary" id="btnNextImpostor" style="margin-top: 16px; padding: 10px 24px; border-radius: 12px; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; font-weight: 700;">Next Challenge ➔</button>
          `;
        } else {
          btn.style.background = 'rgba(239, 68, 68, 0.15)';
          btn.style.borderColor = 'var(--color-error)';
          feedback.innerHTML = `
            <div style="color: var(--color-error); font-weight: 800; margin-top: 16px; font-family: 'Poppins', sans-serif;">Incorrect. Try again!</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px;">Hint: look closely at the subject gender or verb suffixes.</div>
            <button class="btn btn-secondary" id="btnRetryImpostor" style="margin-top: 16px; padding: 10px 24px; border-radius: 12px; background: rgba(255,255,255,0.04); border: var(--border-glass); color: var(--text-primary); cursor: pointer; font-weight: 700;">Try Again 🔄</button>
          `;
        }

        document.getElementById('btnNextImpostor')?.addEventListener('click', _drawScreen);
        document.getElementById('btnRetryImpostor')?.addEventListener('click', _drawScreen);
      });
    });
  }

  function _drawScrambledGame() {
    const game = DetectiveManager.getScrambledGame();
    const content = document.getElementById('detectiveGameContent');
    if (!content) return;

    let selectedSequence = [];

    function _renderWorkspace() {
      content.innerHTML = `
        <div class="quiz-question-card glass-card" style="padding: 24px; border-radius: 20px; background: var(--bg-card); border: var(--border-glass);">
          <div style="font-size: 0.8rem; color: var(--text-tertiary); text-align: center; margin-bottom: 12px; font-weight: 700;">CHALLENGE ${game.currentIndex + 1} OF ${game.totalCount}</div>
          <div style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 8px; text-align: center; font-weight: 700; font-family: 'Poppins', sans-serif;">Arrange to mean:</div>
          <div style="font-size: 1.3rem; font-weight: 800; text-align: center; color: var(--color-accent); margin-bottom: 24px;">"${game.english}"</div>

          <div style="min-height: 48px; border-bottom: 2px dashed rgba(255,255,255,0.12); display: flex; justify-content: center; gap: 8px; padding-bottom: 8px; margin-bottom: 24px;">
            ${selectedSequence.map(idx => `
              <div style="padding: 8px 14px; background: rgba(255, 123, 0, 0.15); border-radius: 10px; color: var(--color-accent); font-size: 1.15rem; font-family: var(--font-marathi); font-weight: bold;">${game.scrambled[idx]}</div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px;">
            ${game.scrambled.map((word, idx) => {
              const isSelected = selectedSequence.includes(idx);
              return `
                <button class="scrambled-chip" data-index="${idx}" ${isSelected ? 'disabled style="opacity:0.3"' : ''} style="padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.15); color: var(--text-primary); font-size: 1.15rem; font-family: var(--font-marathi); cursor: pointer; font-weight: bold;">
                  ${word}
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="btnResetScramble" style="flex:1; border-radius:12px; padding:12px; background: rgba(255,255,255,0.04); border: var(--border-glass); color: var(--text-primary); cursor: pointer; font-weight: 700;">Clear ↺</button>
            <button class="btn btn-primary" id="btnVerifyScramble" style="flex:2; border-radius:12px; padding:12px; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; font-weight: 700; box-shadow: var(--shadow-glow-accent);">Check Answer ✓</button>
          </div>

          <div id="scrambleFeedback" style="margin-top: 16px;"></div>
        </div>
      `;

      content.querySelectorAll('.scrambled-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          if (!selectedSequence.includes(idx)) {
            selectedSequence.push(idx);
            _renderWorkspace();
          }
        });
      });

      document.getElementById('btnResetScramble').addEventListener('click', () => {
        selectedSequence = [];
        _renderWorkspace();
      });

      document.getElementById('btnVerifyScramble').addEventListener('click', () => {
        const isCorrect = DetectiveManager.checkScrambledSequence(selectedSequence);
        const feedback = document.getElementById('scrambleFeedback');
        
        document.getElementById('btnVerifyScramble').disabled = true;

        if (isCorrect) {
          feedback.innerHTML = `
            <div style="color: var(--color-success); font-weight: 800; text-align: center; font-family: 'Poppins', sans-serif;">Correct! (+20 XP) 🎉</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px; text-align: center; line-height: 1.4;">${game.explanation}</div>
            <button class="btn btn-primary" id="btnNextScramble" style="margin-top: 16px; width:100%; padding:10px; border-radius:12px; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; font-weight: 700;">Next Challenge ➔</button>
          `;
        } else {
          feedback.innerHTML = `
            <div style="color: var(--color-error); font-weight: 800; text-align: center; font-family: 'Poppins', sans-serif;">Incorrect order. Try again!</div>
            <button class="btn btn-secondary" id="btnRetryScramble" style="margin-top: 16px; width:100%; padding:10px; border-radius:12px; background: rgba(255,255,255,0.04); border: var(--border-glass); color: var(--text-primary); cursor: pointer; font-weight: 700;">Try Again 🔄</button>
          `;
        }

        document.getElementById('btnNextScramble')?.addEventListener('click', _drawScreen);
        document.getElementById('btnRetryScramble')?.addEventListener('click', _drawScreen);
      });
    }

    _renderWorkspace();
  }

  _drawScreen();
}
