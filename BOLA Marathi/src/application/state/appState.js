/**
 * BOLA Marathi — Application State Manager
 * Application Layer
 * 
 * Manages global application state (navigation tabs, active RPG locations,
 * user scores) and synchronizes with IndexedDB.
 */

import { StorageManager } from '../../infrastructure/storage/storageManager.js';

export const AppState = (() => {

  const _state = {
    activeTab: 'splash', // Start with splash screen
    rpg: {
      currentCity: 'pune',
      unlockedCities: ['pune'],
      completedChapters: [],
      completedScenarios: [],
      activeLandmarkId: null,
      cityReputation: { pune: 355, mumbai: 0, nashik: 0 },
      npcRelationships: { ram: 25, rohan: 10, anil: 0, amit: 0, sunita: 0, baburao: 0 },
      unlockedSouvenirs: [],
      unlockedRecipes: [],
      openedChests: []
    },
    stats: {
      xp: 355, // Matches the requested Hero Section value
      streak: 7,
      coins: 5,
      lastPracticeDate: null,
      todayMinutes: 4,
      weeklyMinutesLog: {}
    },
    settings: {
      playbackSpeed: 'normal',
      autoPlayAudio: true,
      showTransliteration: true,
      apiKey: '',
      theme: 'light'
    },
    isOffline: false
  };

  const _listeners = [];

  /**
   * Initialize state, restoring from IndexedDB progress store
   */
  async function init() {
    try {
      const savedState = await StorageManager.getProgress();
      if (savedState) {
        if (savedState.activeTab) _state.activeTab = savedState.activeTab;
        if (savedState.rpg) _state.rpg = { ..._state.rpg, ...savedState.rpg };
        if (savedState.stats) _state.stats = { ..._state.stats, ...savedState.stats };
        if (savedState.settings) _state.settings = { ..._state.settings, ...savedState.settings };
      } else {
        // Set today's date for defaults
        const todayStr = new Date().toDateString();
        _state.stats.lastPracticeDate = todayStr;
        const log = {};
        log[new Date().toISOString().split('T')[0]] = 4;
        _state.stats.weeklyMinutesLog = log;
        await save();
      }
    } catch (e) {
      console.warn("Failed to load global state from database:", e);
    }

    // Apply active theme
    const theme = _state.settings.theme || 'dark';
    document.documentElement.className = theme === 'light' ? 'theme-light' : '';

    _state.isOffline = !navigator.onLine;
    window.addEventListener('online', () => _updateNetworkStatus(false));
    window.addEventListener('offline', () => _updateNetworkStatus(true));
  }

  function _updateNetworkStatus(isOffline) {
    _state.isOffline = isOffline;
    _notify();
  }

  async function save() {
    try {
      await StorageManager.saveProgress(_state);
    } catch (e) {
      console.warn("Database state save failed:", e);
    }
  }

  async function reset() {
    _state.activeTab = 'splash';
    _state.rpg = {
      currentCity: 'pune',
      unlockedCities: ['pune'],
      completedChapters: [],
      completedScenarios: [],
      activeLandmarkId: null,
      cityReputation: { pune: 355, mumbai: 0, nashik: 0 },
      npcRelationships: { ram: 25, rohan: 10, anil: 0, amit: 0, sunita: 0, baburao: 0 },
      unlockedSouvenirs: [],
      unlockedRecipes: [],
      openedChests: []
    };
    _state.stats = {
      xp: 355,
      streak: 7,
      coins: 5,
      lastPracticeDate: new Date().toDateString(),
      todayMinutes: 4,
      weeklyMinutesLog: {}
    };
    const log = {};
    log[new Date().toISOString().split('T')[0]] = 4;
    _state.stats.weeklyMinutesLog = log;

    _state.settings = {
      playbackSpeed: 'normal',
      autoPlayAudio: true,
      showTransliteration: true,
      apiKey: '',
      theme: 'dark'
    };
    document.documentElement.className = '';
    await save();
    _notify();
  }

  function subscribe(callback) {
    if (typeof callback === 'function') {
      _listeners.push(callback);
    }
  }

  function _notify() {
    _listeners.forEach(listener => {
      try {
        listener({ ..._state });
      } catch (e) {
        console.error("State listener failed:", e);
      }
    });
  }

  function getState() {
    return JSON.parse(JSON.stringify(_state));
  }

  async function update(path, value) {
    const keys = path.split('.');
    let target = _state;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }

    target[keys[keys.length - 1]] = value;

    if (path === 'settings.theme') {
      document.documentElement.className = value === 'light' ? 'theme-light' : '';
    }

    await save();
    _notify();
  }

  return {
    init,
    reset,
    getState,
    update,
    subscribe,
    save
  };
})();
