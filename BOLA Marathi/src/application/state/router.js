/**
 * BOLA Marathi — Router
 * Application Layer
 * 
 * Handles URL hash-based navigation, popstate actions, and updates the
 * active view state in AppState.
 */

import { AppState } from './appState.js';

export const Router = (() => {

  const HASH_MAP = {
    '#splash': 'splash',
    '#home': 'home',
    '#journey': 'journey',
    '#practice': 'practice',
    '#dictionary': 'dictionary',
    '#profile': 'profile'
  };

  function init() {
    window.addEventListener('hashchange', _handleHashChange);
    _handleHashChange();
  }

  function _handleHashChange() {
    const hash = window.location.hash || '#splash';
    
    // Check if it's a primary tab hash
    const primaryTab = HASH_MAP[hash];
    if (primaryTab) {
      AppState.update('activeTab', primaryTab);
      AppState.update('rpg.activeLandmarkId', null); // Clear sub-views
      return;
    }

    // Check for parameter routes (e.g., #journey/pune/pune-station)
    if (hash.startsWith('#journey/')) {
      const parts = hash.split('/');
      const cityId = parts[1];
      const landmarkId = parts[2];

      AppState.update('activeTab', 'journey');
      if (cityId) AppState.update('rpg.currentCity', cityId);
      if (landmarkId) {
        AppState.update('rpg.activeLandmarkId', landmarkId);
      } else {
        AppState.update('rpg.activeLandmarkId', null);
      }
      return;
    }

    // Default fallback
    window.location.hash = '#home';
  }

  function navigate(hashRoute) {
    window.location.hash = hashRoute;
  }

  return {
    init,
    navigate
  };
})();
