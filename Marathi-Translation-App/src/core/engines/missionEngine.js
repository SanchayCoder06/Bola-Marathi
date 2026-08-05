/**
 * BOLA Marathi — Mission Engine
 * Core Engine Layer
 * 
 * Tracks daily mission objectives, validates chapter completions, and unlocks regional
 * cities as player XP increases.
 */

import { AppState } from '../../application/state/appState.js';

export const MissionEngine = (() => {

  const DAILY_MISSION_TARGET = 15; // study target in minutes

  function evaluateMissionUnlocks(currentXp) {
    const unlockedCities = ['pune']; // Pune is always unlocked by default

    // Unlock logic based on XP
    if (currentXp >= 150) {
      unlockedCities.push('mumbai');
    }
    if (currentXp >= 500) {
      unlockedCities.push('nashik');
    }
    if (currentXp >= 1000) {
      unlockedCities.push('kolhapur');
    }
    if (currentXp >= 1500) {
      unlockedCities.push('nagpur');
    }
    if (currentXp >= 2500) {
      unlockedCities.push('konkan');
    }

    return unlockedCities;
  }

  function getDailyProgressPercent(todayMinutes) {
    return Math.min(100, Math.round((todayMinutes / DAILY_MISSION_TARGET) * 100));
  }

  return {
    evaluateMissionUnlocks,
    getDailyProgressPercent
  };
})();
