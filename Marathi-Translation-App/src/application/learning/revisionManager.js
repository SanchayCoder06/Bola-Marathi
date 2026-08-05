/**
 * BOLA Marathi — Revision Manager
 * Application Layer
 * 
 * Handles error tracking logs in LocalStorage, queries due items,
 * and schedules card frequencies using the SM-2 Revision Engine.
 */

import { RevisionEngine } from '../../core/engines/revisionEngine.js';

export const RevisionManager = (() => {
  const STORAGE_KEY = 'bolaMarathi_revisions';

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { weakWords: {} };
    } catch {
      return { weakWords: {} };
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save revisions data:", e);
    }
  }

  /**
   * Log an error or speaking test result
   * @param {string} phraseId - Target vocabulary ID
   * @param {number} score - Speaking accuracy score (0-100)
   */
  function logAttempt(phraseId, score) {
    const data = _load();
    const existing = data.weakWords[phraseId] || { repetitions: 0, interval: 0, easeFactor: 2.5 };
    
    // Call SM-2 Domain calculations
    const updated = RevisionEngine.calculateNextReview(existing, score);
    
    // Update local database
    data.weakWords[phraseId] = {
      repetitions: updated.repetitions,
      interval: updated.interval,
      easeFactor: updated.easeFactor,
      nextReviewDate: updated.nextReviewDate,
      errorCount: (existing.errorCount || 0) + (score < 70 ? 1 : 0)
    };

    // If score is high (>=80), decrease errorCount or delete if fully learned
    if (score >= 85 && data.weakWords[phraseId].errorCount > 0) {
      data.weakWords[phraseId].errorCount--;
    }

    _save(data);
  }

  /**
   * Get total count of cards scheduled for review (due date in past)
   * @returns {number}
   */
  function getDueCount() {
    const data = _load();
    const now = new Date();
    return Object.values(data.weakWords).filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    }).length;
  }

  /**
   * Fetch all words currently due for practice
   * @returns {Array<Object>} - List of { phraseId, ...cardStats }
   */
  function getDueCards() {
    const data = _load();
    const now = new Date();
    return Object.entries(data.weakWords)
      .filter(([_, stats]) => {
        if (!stats.nextReviewDate) return true;
        return new Date(stats.nextReviewDate) <= now;
      })
      .map(([id, stats]) => ({
        phraseId: id,
        ...stats
      }));
  }

  return {
    logAttempt,
    getDueCount,
    getDueCards
  };
})();
