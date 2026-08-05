/**
 * BOLA Marathi — Centralized API Client Layer
 * Handles network requests, error handling, automatic retries, and response parsing.
 */

import {
  ApiClientOptions,
  TranslateRequest,
  TranslateResponse,
  DictionaryRequest,
  DictionaryResponse,
  AssessRequest,
  AssessResponse,
  CorrectRequest,
  CorrectResponse,
  DoubtRequest,
  DoubtResponse,
  AiRequest,
  AiResponse
} from './types';

export class ApiClientError extends Error {
  public status: number;
  public endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class ApiClient {
  private baseUrl: string;
  private personalKey?: string;
  private maxRetries: number;
  private retryDelayMs: number;
  private timeoutMs: number;

  constructor(options: ApiClientOptions = {}) {
    // Environment variable resolution: Next.js or Vite or window config or default fallback
    const envUrl = 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
      'http://localhost:5000';

    this.baseUrl = (options.baseUrl ?? envUrl).replace(/\/$/, '');
    this.personalKey = options.personalKey;
    this.maxRetries = options.maxRetries ?? 2;
    this.retryDelayMs = options.retryDelayMs ?? 800;
    this.timeoutMs = options.timeoutMs ?? 15000;
  }

  /**
   * Set dynamic personal key header
   */
  public setPersonalKey(key?: string): void {
    this.personalKey = key;
  }

  /**
   * Helper delay for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Core request runner with timeout, error handling, and retry logic
   */
  private async request<T>(endpoint: string, body: any): Promise<T> {
    const fullUrl = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.personalKey) {
      headers['x-personal-key'] = this.personalKey;
    }

    let attempt = 0;
    let lastError: Error | null = null;

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

          // Throw for non-retryable 4xx client errors immediately
          if (response.status >= 400 && response.status < 500) {
            throw new ApiClientError(errorMessage, response.status, endpoint);
          }

          // Retryable server errors (5xx)
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
          return JSON.parse(jsonText) as T;
        }

        // 2. Direct JSON object return
        return rawData as T;

      } catch (err: any) {
        lastError = err;

        // Do not retry client 4xx errors
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

  // --- API METHODS ---

  /**
   * Translate text between Marathi, English, and Hindi
   */
  public async translate(req: TranslateRequest): Promise<TranslateResponse> {
    return this.request<TranslateResponse>('/api/translate', req);
  }

  /**
   * Search dictionary word definitions
   */
  public async dictionary(req: DictionaryRequest): Promise<DictionaryResponse> {
    return this.request<DictionaryResponse>('/api/dictionary', req);
  }

  /**
   * Assess user pronunciation & audio speech accuracy
   */
  public async assess(req: AssessRequest): Promise<AssessResponse> {
    return this.request<AssessResponse>('/api/assess', req);
  }

  /**
   * Correct written Marathi sentence grammar & spelling
   */
  public async correct(req: CorrectRequest): Promise<CorrectResponse> {
    return this.request<CorrectResponse>('/api/correct', req);
  }

  /**
   * Resolve user Marathi learning doubts
   */
  public async doubt(req: DoubtRequest): Promise<DoubtResponse> {
    return this.request<DoubtResponse>('/api/doubt', req);
  }

  /**
   * General multi-purpose AI assistant
   */
  public async ai(req: AiRequest): Promise<AiResponse> {
    return this.request<AiResponse>('/api/ai', req);
  }
}

// Export default singleton instance
export const apiClient = new ApiClient();
