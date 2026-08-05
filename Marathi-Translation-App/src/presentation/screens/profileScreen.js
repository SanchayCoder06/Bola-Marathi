/**
 * BOLA Marathi — ProfileScreen Component
 * Presentation Layer
 */

import { AppState } from '../../application/state/appState.js';
import { ProgressEngine } from '../../core/engines/progressEngine.js';

export const ProfileScreen = {
  render(container) {
    const state = AppState.getState();
    const stats = state.stats;
    const rep = ProgressEngine.getLaukikReputation(stats.xp);
    const settings = state.settings;
    const completedScenarios = state.rpg.completedScenarios || [];

    const achievements = [
      {
        id: 'first_step',
        title: "First Step",
        titleMarathi: "पहिले पाऊल",
        icon: "👣",
        condition: "Reach 50 XP",
        isUnlocked: stats.xp >= 50
      },
      {
        id: 'streaker',
        title: "Consistent",
        titleMarathi: "नियमित",
        icon: "🔥",
        condition: "Maintain a 3-day streak",
        isUnlocked: stats.streak >= 3
      },
      {
        id: 'foodie',
        title: "Food Lover",
        titleMarathi: "खादाड",
        icon: "🍛",
        condition: "Complete Restaurant scenario",
        isUnlocked: completedScenarios.includes('pune_restaurant')
      },
      {
        id: 'negotiator',
        title: "Negotiator",
        titleMarathi: "घासाघीस",
        icon: "🤝",
        condition: "Complete Taxi or Market",
        isUnlocked: completedScenarios.includes('pune_taxi_start') || completedScenarios.includes('pune_market_bargain')
      },
      {
        id: 'collector',
        title: "Vocabulary Guru",
        titleMarathi: "शब्दसंग्रह",
        icon: "📚",
        condition: "Reach 300 XP",
        isUnlocked: stats.xp >= 300
      },
      {
        id: 'pune_local',
        title: "Puneri Local",
        titleMarathi: "पुणेकर",
        icon: "🏰",
        condition: "Reach 500 XP",
        isUnlocked: stats.xp >= 500
      }
    ];

    container.innerHTML = `
      <div class="screen active" id="screen-profile" style="display: flex; flex-direction: column; gap: 20px;">
        <div class="screen-header">
          <h1 class="screen-title text-gradient" style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.45rem; color: var(--text-primary); margin: 0;">Profile & Settings</h1>
          <p class="screen-subtitle" style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 4px;">Manage credentials, audio playback, and streaks</p>
        </div>

        <!-- Identity Card -->
        <div class="glass-card" style="padding: 20px; display: flex; align-items: center; gap: 16px; border: var(--border-glass); background: var(--bg-card); border-radius: 20px;">
          <div style="font-size: 2.5rem; padding: 12px; background: rgba(255,255,255,0.06); border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border: var(--border-glass);">
            ${rep.badge}
          </div>
          <div>
            <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); font-family: 'Poppins', sans-serif; margin: 0 0 2px;">Marathi Explorer</h2>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
              Reputation: <strong style="color: var(--color-accent);">${rep.title}</strong>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px; font-family: 'Inter', sans-serif; font-weight: 600;">
              XP: ${stats.xp} / ${rep.nextMilestone}
            </div>
          </div>
        </div>

        <!-- Achievements / Badges Grid -->
        <div class="settings-group" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="settings-group__title" style="font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); letter-spacing: 1px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Milestone Achievements</div>
          <div class="glass-card" style="padding: 20px; border-radius: 20px; border: var(--border-glass); background: var(--bg-card); display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
            ${achievements.map(a => `
              <div style="display: flex; flex-direction: column; align-items: center; opacity: ${a.isUnlocked ? '1' : '0.4'}; transition: transform 0.2s;">
                <div style="font-size: 2.2rem; margin-bottom: 6px; position: relative; filter: ${a.isUnlocked ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'grayscale(100%)'}; line-height: 1;">
                  ${a.icon}
                  ${!a.isUnlocked ? '<span style="position: absolute; bottom: -2px; right: -2px; font-size: 0.75rem; background: #000; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1);">🔒</span>' : ''}
                </div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; font-family: 'Poppins', sans-serif;">${a.title}</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 1px; font-family: var(--font-marathi);">${a.titleMarathi}</div>
                <div style="font-size: 0.6rem; color: var(--text-tertiary); margin-top: 4px; line-height: 1.2; max-width: 80px;">${a.condition}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- API Settings -->
        <div class="settings-group" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="settings-group__title" style="font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); letter-spacing: 1px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">API Credentials</div>
          <div class="glass-card" style="padding: 20px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card);">
            <label style="font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 8px; font-weight: 600;" for="profApiKey">Gemini API Key</label>
            <input type="password" id="profApiKey" class="input-field" placeholder="Enter API key..." value="${settings.apiKey || ''}" style="width: 100%; border-radius: 10px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.06); padding: 10px 14px; margin-bottom: 4px; box-sizing: border-box; outline: none;" />
            <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 6px; line-height: 1.35;">
              Personal key used directly to call online Gemini model for Sentence Correction and doubts.
            </p>
          </div>
        </div>

        <!-- Audio Settings -->
        <div class="settings-group" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="settings-group__title" style="font-size: 0.75rem; font-weight: 800; color: var(--text-tertiary); letter-spacing: 1px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Audio Options</div>
          <div class="glass-card" style="padding: 20px; border-radius: 16px; border: var(--border-glass); background: var(--bg-card);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">Speech Speed</span>
              <div class="speed-selector" id="profSpeedSelector" style="display: flex; gap: 4px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 2px;">
                <button class="speed-option ${settings.playbackSpeed === 'slow' ? 'active' : ''}" data-speed="slow" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 6px; border: none; background: ${settings.playbackSpeed === 'slow' ? 'rgba(255,255,255,0.08)' : 'transparent'}; color: var(--text-primary); cursor: pointer; font-weight: 700;">0.6x</button>
                <button class="speed-option ${settings.playbackSpeed === 'normal' ? 'active' : ''}" data-speed="normal" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 6px; border: none; background: ${settings.playbackSpeed === 'normal' ? 'rgba(255,255,255,0.08)' : 'transparent'}; color: var(--text-primary); cursor: pointer; font-weight: 700;">1.0x</button>
                <button class="speed-option ${settings.playbackSpeed === 'fast' ? 'active' : ''}" data-speed="fast" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 6px; border: none; background: ${settings.playbackSpeed === 'fast' ? 'rgba(255,255,255,0.08)' : 'transparent'}; color: var(--text-primary); cursor: pointer; font-weight: 700;">1.2x</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Reset -->
        <button class="btn btn-secondary" id="btnResetAllProgress" style="width: 100%; padding: 14px; border-radius: 14px; font-weight: 700; color: var(--color-error); border: 1px solid rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.05); cursor: pointer; margin-top: 10px; margin-bottom: 16px;">
          Reset All Data
        </button>
      </div>
    `;

    const apiKeyInput = document.getElementById('profApiKey');
    apiKeyInput?.addEventListener('change', () => {
      AppState.update('settings.apiKey', apiKeyInput.value.trim());
      UI.showToast("API Key updated!");
    });

    document.querySelectorAll('.speed-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = btn.dataset.speed;
        AppState.update('settings.playbackSpeed', speed);
        
        // Highlight active speed button
        document.querySelectorAll('.speed-option').forEach(b => {
          b.style.background = b.dataset.speed === speed ? 'rgba(255,255,255,0.08)' : 'transparent';
        });

        UI.showToast(`Speech rate set to ${speed}`);
      });
    });

    document.getElementById('btnResetAllProgress')?.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete all streaks, XP progress, and configuration logs?")) {
        AppState.reset();
        UI.showToast("App data reset.");
        ProfileScreen.render(container);
      }
    });
  }
};
