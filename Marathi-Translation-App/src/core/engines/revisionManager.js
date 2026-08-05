/**
 * BOLA Marathi — Revision Manager
 * Core Engine Layer
 * 
 * Coordinates spaced repetition cards, counts due items, and updates
 * review intervals inside IndexedDB.
 */

import { RevisionEngine } from './revisionEngine.js';
import { StorageManager } from '../../infrastructure/storage/storageManager.js';

export const RevisionManager = (() => {

  async function logAttempt(word, score) {
    const queue = await StorageManager.getRevisionQueue();
    const existing = queue.find(item => item.word === word) || {
      word,
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5,
      errorCount: 0
    };

    const updated = RevisionEngine.calculateNextReview(existing, score);

    await StorageManager.saveRevisionItem({
      word,
      repetitions: updated.repetitions,
      interval: updated.interval,
      easeFactor: updated.easeFactor,
      nextReviewDate: updated.nextReviewDate,
      errorCount: (existing.errorCount || 0) + (score < 70 ? 1 : 0)
    });
  }

  async function getDueCount() {
    const queue = await StorageManager.getRevisionQueue();
    const now = new Date();
    return queue.filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    }).length;
  }

  async function getDueCards() {
    const queue = await StorageManager.getRevisionQueue();
    const now = new Date();
    return queue.filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    });
  }

  async function completeRevision(word) {
    await StorageManager.removeRevisionItem(word);
  }

  return {
    logAttempt,
    getDueCount,
    getDueCards,
    completeRevision
  };
})();
