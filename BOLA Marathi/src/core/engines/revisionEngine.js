/**
 * BOLA Marathi — Revision Engine
 * Domain Layer (Pure Business Logic)
 * 
 * Implements the SuperMemo-2 (SM-2) algorithm for calculating spaced
 * repetition intervals, ease factors, and repetitions for review flashcards.
 */

export const RevisionEngine = (() => {
  
  /**
   * Convert a percentage score (0-100) into an SM-2 quality grade (0-5)
   * @param {number} score - Percentage score (0-100)
   * @returns {number} - Quality rating (0-5)
   */
  function scoreToQuality(score) {
    if (score >= 90) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 50) return 2;
    if (score >= 30) return 1;
    return 0;
  }

  /**
   * Calculate the next review statistics using SM-2 algorithm
   * @param {Object} cardStats - Current card stats { repetitions, interval, easeFactor }
   * @param {number} score - Speaking/Quiz score (0-100)
   * @returns {{ repetitions: number, interval: number, easeFactor: number, nextReviewDate: string }}
   */
  function calculateNextReview(cardStats, score) {
    const q = scoreToQuality(score);
    
    // Set default values if not defined
    let repetitions = cardStats?.repetitions || 0;
    let interval = cardStats?.interval || 0;
    let easeFactor = cardStats?.easeFactor || 2.5;

    // Calculate new Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    // Determine repetition interval
    if (q >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Calculate actual timestamp for the next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
      repetitions,
      interval,
      easeFactor,
      nextReviewDate: nextReviewDate.toISOString()
    };
  }

  return {
    scoreToQuality,
    calculateNextReview
  };
})();
