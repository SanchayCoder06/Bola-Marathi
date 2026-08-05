/**
 * BOLA Marathi — Storage Manager Wrapper
 * Infrastructure Layer
 */

import { DBService } from './db.js';

export const StorageManager = (() => {

  async function getProgress() {
    const data = await DBService.get('progress', 'user_progress');
    if (data) return data.state;
    return null;
  }

  async function saveProgress(state) {
    await DBService.put('progress', { key: 'user_progress', state });
  }

  async function getBookmarks() {
    return await DBService.getAll('bookmarks');
  }

  async function addBookmark(wordItem) {
    await DBService.put('bookmarks', wordItem);
  }

  async function removeBookmark(word) {
    await DBService.remove('bookmarks', word);
  }

  async function getRevisionQueue() {
    return await DBService.getAll('revisionQueue');
  }

  async function saveRevisionItem(item) {
    await DBService.put('revisionQueue', item);
  }

  async function removeRevisionItem(word) {
    await DBService.remove('revisionQueue', word);
  }

  async function logAIQuery(question, answer) {
    await DBService.put('aiHistory', {
      timestamp: Date.now(),
      question,
      answer
    });
  }

  async function getAIHistory() {
    const history = await DBService.getAll('aiHistory');
    return history.sort((a, b) => b.timestamp - a.timestamp);
  }

  return {
    getProgress,
    saveProgress,
    getBookmarks,
    addBookmark,
    removeBookmark,
    getRevisionQueue,
    saveRevisionItem,
    removeRevisionItem,
    logAIQuery,
    getAIHistory
  };
})();
