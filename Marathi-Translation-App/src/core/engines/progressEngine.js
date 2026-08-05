/**
 * BOLA Marathi — Progress Engine
 * Domain Layer (Pure Business Logic)
 * 
 * Responsible for calculations relating to XP rewards, daily streaks, 
 * and Laukik (reputation) level progression.
 */

export const ProgressEngine = (() => {
  
  /**
   * Calculate XP earned for a speaking score
   * @param {number} score - Speaking accuracy score (0-100)
   * @returns {number} - XP points earned
   */
  function calculateXpGain(score) {
    if (score >= 90) return 15;
    if (score >= 70) return 10;
    if (score >= 50) return 5;
    return 2;
  }

  /**
   * Determine new streak and last date based on previous values
   * @param {string|null} lastPracticeDateStr - Date string of last practice
   * @param {number} currentStreak - The current streak count
   * @returns {{ newStreak: number, isBroken: boolean }}
   */
  function evaluateStreak(lastPracticeDateStr, currentStreak = 0) {
    const todayStr = new Date().toDateString();
    
    if (!lastPracticeDateStr) {
      return { newStreak: 1, isBroken: false };
    }

    if (lastPracticeDateStr === todayStr) {
      return { newStreak: currentStreak, isBroken: false };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastPracticeDateStr === yesterdayStr) {
      return { newStreak: currentStreak + 1, isBroken: false };
    }

    // Streak broken (more than 1 day difference)
    return { newStreak: 1, isBroken: true };
  }

  /**
   * Map total XP points to a Laukik (Reputation) level structure
   * @param {number} xp - Cumulative player experience points
   * @returns {{ level: number, title: string, badge: string, nextMilestone: number }}
   */
  function getLaukikReputation(xp) {
    if (xp < 500) {
      return {
        level: 1,
        title: "Outsider (परका)",
        badge: "🧳",
        nextMilestone: 500
      };
    }
    if (xp < 1500) {
      return {
        level: 2,
        title: "Visitor (पाहुणा)",
        badge: "🏡",
        nextMilestone: 1500
      };
    }
    if (xp < 3500) {
      return {
        level: 3,
        title: "Neighbor (शेजारी)",
        badge: "🤝",
        nextMilestone: 3500
      };
    }
    return {
      level: 4,
      title: "Local Legend (पुणेकर/मुंबईकर)",
      badge: "👑",
      nextMilestone: 999999
    };
  }

  return {
    calculateXpGain,
    evaluateStreak,
    getLaukikReputation
  };
})();
