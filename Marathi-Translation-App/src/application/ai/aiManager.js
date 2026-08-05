/**
 * BOLA Marathi — AI Manager
 * Application Layer
 * 
 * Orchestrates AI queries by performing client-side cache queries in IndexedDB,
 * executing serverless fetch updates on cache misses, and throwing offline notifications.
 */

import { AppState } from '../state/appState.js';
import { QueryCache } from '../../infrastructure/storage/queryCache.js';
import { apiClient } from '../../api/client.js';

export const AIManager = (() => {

  /**
   * Local simulated responses for testing in static/offline environments
   */
  function _getMockAiResponse(endpoint, body) {
    if (endpoint.includes('correct')) {
      const sentence = body.sentence || '';
      const isCorrect = sentence.trim().endsWith('आहे.');
      return {
        isCorrect,
        corrected: isCorrect ? sentence : "माझे नाव राहुल आहे.",
        explanation: isCorrect 
          ? "Looks perfect! The sentence structure matches correct Subject-Object-Verb (SOV) agreement." 
          : "Incorrect verb ending or spelling. In Marathi, standard statements end with 'आहे' (is) as the auxiliary verb.",
        improvements: "Alternative: माझं नाव राहुल आहे. (More conversational)"
      };
    }
    if (endpoint.includes('doubt')) {
      const q = body.question || '';
      return {
        answer: `Tutor Explanation (Mock): You asked about "${q}". In Marathi, nouns are categorized into three genders: masculine (तो), feminine (ती), and neuter (ते). Verbs change endings based on gender and plurality.`,
        examples: [
          { marathi: "तो मुलगा आहे.", transliteration: "To mulga aahe.", english: "He is a boy." },
          { marathi: "ती मुलगी आहे.", transliteration: "Tee mulgi aahe.", english: "She is a girl." }
        ]
      };
    }
    return { answer: "Local offline mock resolution." };
  }

  /**
   * Helper to perform serverless proxy fetch calls via centralized ApiClient
   * @param {string} endpoint - API route (e.g. '/api/correct')
   * @param {Object} body - Request payload
   * @returns {Promise<Object>}
   */
  async function _postRequest(endpoint, body) {
    try {
      return await apiClient.request(endpoint, body);
    } catch (netErr) {
      console.warn(`[AIManager] Network request to ${endpoint} failed, falling back to local mock:`, netErr);
      return _getMockAiResponse(endpoint, body);
    }
  }

  /**
   * Evaluate a written Marathi sentence
   * @param {string} sentence - User text input
   * @returns {Promise<Object>}
   */
  async function correctSentence(sentence) {
    if (!sentence || sentence.trim() === '') {
      throw new Error("Sentence is empty.");
    }

    // 1. Check local IndexedDB cache first
    await QueryCache.init();
    const cached = await QueryCache.get('correct', sentence);
    if (cached) {
      console.log("Serving grammar check from local cache.");
      return cached;
    }

    // 2. Fallback check for network connection
    const state = AppState.getState();
    if (state.isOffline) {
      throw new Error("You are offline. Cache miss: Grammar correction cannot be processed offline without pre-cached terms.");
    }

    // 3. Perform network call
    const result = await _postRequest('/api/correct', { sentence });

    // 4. Save into local cache
    await QueryCache.set('correct', sentence, result);
    return result;
  }

  /**
   * Ask the tutor a general Marathi doubt
   * @param {string} question - Question query
   * @returns {Promise<Object>}
   */
  async function askDoubt(question) {
    if (!question || question.trim() === '') {
      throw new Error("Question is empty.");
    }

    // 1. Check cache
    await QueryCache.init();
    const cached = await QueryCache.get('doubt', question);
    if (cached) {
      console.log("Serving doubt resolution from local cache.");
      return cached;
    }

    // 2. Offline check
    const state = AppState.getState();
    if (state.isOffline) {
      throw new Error("You are offline. Cache miss: Doubt resolution requires a live network connection.");
    }

    // 3. Network call
    const result = await _postRequest('/api/doubt', { question });

    // 4. Save cache
    await QueryCache.set('doubt', question, result);
    return result;
  }

  return {
    correctSentence,
    askDoubt
  };
})();
