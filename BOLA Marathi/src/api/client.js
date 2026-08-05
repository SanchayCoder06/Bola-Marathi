/**
 * BOLA Marathi — Centralized API Client (ES Module JavaScript Edition)
 * Provides seamless connection to Vercel/Node serverless endpoints with retries and Gemini candidate parsing.
 */

import { AppState } from '../application/state/appState.js';

export class ApiClientError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class ApiClient {
  constructor(options = {}) {
    const envUrl = 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
      '';

    this.baseUrl = (options.baseUrl ?? envUrl).replace(/\/$/, '');
    this.maxRetries = options.maxRetries ?? 2;
    this.retryDelayMs = options.retryDelayMs ?? 800;
    this.timeoutMs = options.timeoutMs ?? 15000;
  }

  /**
   * Helper delay for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Core request runner with timeout, error handling, and retry logic
   */
  async request(endpoint, body) {
    const fullUrl = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };

    // Pull personal API key from AppState if present
    try {
      const state = AppState?.getState ? AppState.getState() : window.AppState?.getState();
      if (state?.settings?.apiKey) {
        headers['x-personal-key'] = state.settings.apiKey;
      }
    } catch {}

    let attempt = 0;
    let lastError = null;

    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          try {
            const parsed = JSON.parse(errText);
            if (parsed.error) errorMessage = parsed.error;
          } catch {
            if (errText) errorMessage = errText;
          }

          if (response.status >= 400 && response.status < 500) {
            throw new ApiClientError(errorMessage, response.status, endpoint);
          }

          throw new ApiClientError(errorMessage, response.status, endpoint);
        }

        const rawData = await response.json();

        // 1. Unpack Gemini candidates structure if returned
        if (
          rawData.candidates &&
          rawData.candidates[0] &&
          rawData.candidates[0].content &&
          rawData.candidates[0].content.parts &&
          rawData.candidates[0].content.parts[0] &&
          rawData.candidates[0].content.parts[0].text
        ) {
          const jsonText = rawData.candidates[0].content.parts[0].text;
          return JSON.parse(jsonText);
        }

        // 2. Direct JSON object return
        return rawData;

      } catch (err) {
        lastError = err;

        if (err instanceof ApiClientError && err.status >= 400 && err.status < 500) {
          throw err;
        }

        if (attempt <= this.maxRetries) {
          const backoff = this.retryDelayMs * Math.pow(2, attempt - 1);
          console.warn(`[ApiClient] Endpoint ${endpoint} failed (attempt ${attempt}/${this.maxRetries + 1}). Retrying in ${backoff}ms...`);
          await this.delay(backoff);
        }
      }
    }

    throw lastError || new ApiClientError('Request failed after max retries', 500, endpoint);
  }

  // --- API ENDPOINT CALLERS ---

  /**
   * Translate text between Marathi, English, and Hindi
   * @param {Object} req - { text, direction }
   */
  async translate(req) {
    return this.request('/api/translate', req);
  }

  /**
   * Search dictionary word definitions
   * @param {Object} req - { word }
   */
  async dictionary(req) {
    return this.request('/api/dictionary', req);
  }

  /**
   * Assess user pronunciation & audio speech accuracy
   * @param {Object} req - { expectedMarathi, expectedTransliteration, expectedEnglish, userTranscription, audioBase64, audioMimeType }
   */
  async assess(req) {
    return this.request('/api/assess', req);
  }

  /**
   * Correct written Marathi sentence grammar & spelling
   * @param {Object} req - { sentence }
   */
  async correct(req) {
    return this.request('/api/correct', req);
  }

  /**
   * Resolve user Marathi learning doubts
   * @param {Object} req - { question }
   */
  async doubt(req) {
    return this.request('/api/doubt', req);
  }

  /**
   * General multi-purpose AI assistant
   * @param {Object} req - { sentence, question, type }
   */
  async ai(req) {
    return this.request('/api/ai', req);
  }
}

export const apiClient = new ApiClient();
