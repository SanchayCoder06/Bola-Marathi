/**
 * BOLA Marathi — App Shell Controller
 * Presentation Layer
 */

import { AppState } from '../application/state/appState.js';
import { Router } from '../application/state/router.js';
import { DBService } from '../infrastructure/storage/db.js';

import { HomeScreen } from './screens/homeScreen.js';
import { JourneyScreen } from './screens/journeyScreen.js';
import { PracticeScreen } from './screens/practiceScreen.js';
import { DictionaryScreen } from './screens/dictionaryScreen.js';
import { ProfileScreen } from './screens/profileScreen.js';

// Global UI toast notification fallback
window.UI = {
  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.style.cssText = "position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%) translateY(100px); background: rgba(13, 22, 44, 0.95); border: var(--border-glass); color: #fff; padding: 12px 24px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; z-index: 10000; box-shadow: var(--shadow-lg); backdrop-filter: blur(12px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s; opacity: 0; pointer-events: none;";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.offsetHeight; // reflow
    toast.style.transform = "translateX(-50%) translateY(0)";
    toast.style.opacity = "1";

    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(100px)";
      toast.style.opacity = "0";
    }, 2800);
  }
};

export const AppController = (() => {

  const SCREEN_MAP = {
    home: HomeScreen,
    journey: JourneyScreen,
    practice: PracticeScreen,
    dictionary: DictionaryScreen,
    profile: ProfileScreen
  };

  async function start() {
    // 1. Initialize DB and seed
    await DBService.seedIfEmpty();

    // 2. Initialize State Manager
    await AppState.init();

    // 3. Wire state notifications
    AppState.subscribe(_handleStateUpdate);

    // 4. Start Router
    Router.init();
  }

  function _renderBaseShell(state) {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const isLightTheme = state.settings.theme === 'light';

    appEl.innerHTML = `
      <!-- Global Sticky Top Header -->
      <header class="app-header" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 8px; background: transparent; position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: var(--border-glass);">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 800; font-family: 'Poppins', sans-serif; color: var(--text-primary); margin: 0; letter-spacing: -0.5px;">नमस्कार, मित्रा! 👋</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="display: flex; gap: 6px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.8rem;">
            <span style="padding: 4px 10px; background: var(--bg-card); border: var(--border-glass); border-radius: 20px; color: var(--text-primary);">🔥 ${state.stats.streak} Streak</span>
            <span style="padding: 4px 10px; background: var(--bg-card); border: var(--border-glass); border-radius: 20px; color: var(--text-primary);">⭐ ${state.stats.xp} XP</span>
          </div>
          <button id="themeToggleBtn" style="border: none; background: transparent; font-size: 1.3rem; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; outline: none; transition: transform 0.2s;" title="Toggle Theme">
            ${isLightTheme ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main id="mainContent" style="padding-bottom: 85px;">
        <div id="screenContainer" style="padding: 0;"></div>
      </main>

      <!-- Premium Bottom Navigation Bar with Vector SVGs -->
      <nav class="app-nav" id="appNav">
        <div class="nav-menu">
          <button class="nav-item ${state.activeTab === 'home' ? 'active' : ''}" id="navHome" data-tab="home">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            <span class="nav-text">Home</span>
          </button>
          <button class="nav-item ${state.activeTab === 'journey' ? 'active' : ''}" id="navJourney" data-tab="journey">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
            </span>
            <span class="nav-text">Journey</span>
          </button>
          <button class="nav-item ${state.activeTab === 'practice' ? 'active' : ''}" id="navPractice" data-tab="practice">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"/></svg>
            </span>
            <span class="nav-text">Practice</span>
          </button>
          <button class="nav-item ${state.activeTab === 'dictionary' ? 'active' : ''}" id="navDictionary" data-tab="dictionary">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </span>
            <span class="nav-text">Dictionary</span>
          </button>
          <button class="nav-item ${state.activeTab === 'profile' ? 'active' : ''}" id="navProfile" data-tab="profile">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span class="nav-text">Profile</span>
          </button>
        </div>
      </nav>
    `;

    // Bind bottom nav click events
    document.getElementById('navHome')?.addEventListener('click', () => Router.navigate('#home'));
    document.getElementById('navJourney')?.addEventListener('click', () => Router.navigate('#journey'));
    document.getElementById('navPractice')?.addEventListener('click', () => Router.navigate('#practice'));
    document.getElementById('navDictionary')?.addEventListener('click', () => Router.navigate('#dictionary'));
    document.getElementById('navProfile')?.addEventListener('click', () => Router.navigate('#profile'));

    // Bind Theme Toggle click event
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      const nextTheme = state.settings.theme === 'light' ? 'dark' : 'light';
      AppState.update('settings.theme', nextTheme);
    });
  }

  function _renderSplashScreen(container) {
    container.innerHTML = `
      <div class="screen active" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 85vh; text-align: center; gap: 20px;">
        <div style="width: 100%; max-width: 320px; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255, 123, 0, 0.25); box-shadow: var(--shadow-lg); background: rgba(0,0,0,0.3); margin-bottom: 12px; position: relative;">
          <img src="assets/images/marathi_study_hero.png" style="width: 100%; height: 200px; object-fit: cover;" alt="BOLA Marathi Cover" />
          <div style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.65); padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; color: var(--color-accent); border: 1px solid rgba(255,255,255,0.1); font-family: 'Poppins', sans-serif;">PWA v1.0</div>
        </div>
        <div style="font-size: 3.6rem; animation: pulse 2.5s infinite ease-in-out; filter: drop-shadow(0 4px 12px rgba(255, 123, 0, 0.3));">🙏</div>
        <h1 class="text-gradient" style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 2.8rem; letter-spacing: -1px; margin: 0; line-height: 1.1;">BOLA मराठी</h1>
        <p style="font-family: 'Baloo 2', sans-serif; font-size: 1.15rem; color: var(--text-secondary); font-weight: 600; margin: 0; max-width: 280px; line-height: 1.3;">Learn Marathi by living real-life RPG missions.</p>
        <div style="width: 120px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-top: 16px;">
          <div style="height: 100%; width: 100%; background: var(--gradient-accent); animation: loadingProgress 1.4s ease-in-out infinite;"></div>
        </div>
        <style>
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        </style>
      </div>
    `;

    setTimeout(() => {
      Router.navigate('#home');
    }, 1800);
  }

  function _handleStateUpdate(state) {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const tab = state.activeTab;

    if (tab === 'splash') {
      _renderSplashScreen(appEl);
      return;
    }

    // Build main nav shell if it is not already painted
    if (!document.getElementById('appNav')) {
      _renderBaseShell(state);
    }

    // Toggle global header display based on active tab
    const globalHeader = document.querySelector('.app-header');
    if (globalHeader) {
      globalHeader.style.display = (tab === 'home') ? 'none' : 'flex';
    }

    // Update nav item highlights
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tab);
    });

    const screenContainer = document.getElementById('screenContainer');
    const screenComponent = SCREEN_MAP[tab];
    if (screenContainer && screenComponent) {
      screenComponent.render(screenContainer);
    }
  }

  return {
    start
  };
})();

// Boot app on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  AppController.start();
});
