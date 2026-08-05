/**
 * BOLA Marathi — Centralized API Layer Types
 * Defines type-safe request/response contracts for backend endpoints.
 */

// --- 1. TRANSLATE API ---
export type TranslationDirection = 'en_to_mr' | 'mr_to_en' | 'hi_to_mr' | 'mr_to_hi';

export interface TranslateRequest {
  text: string;
  direction?: TranslationDirection;
}

export interface TranslateResponse {
  translatedText: string;
  transliteration?: string;
}

// --- 2. DICTIONARY API ---
export interface DictionaryRequest {
  word: string;
}

export interface DictionaryResponse {
  word: string;
  transliteration: string;
  partOfSpeech: string;
  englishMeaning: string;
  hindiMeaning?: string;
  exampleMarathi: string;
  exampleEnglish: string;
  exampleHindi?: string;
}

// --- 3. ASSESS PRONUNCIATION API ---
export interface AssessRequest {
  expectedMarathi: string;
  expectedTransliteration: string;
  expectedEnglish: string;
  userTranscription?: string;
  audioBase64?: string;
  audioMimeType?: string;
}

export interface WordScore {
  word: string;
  transliteration: string;
  score: number;
  tip?: string | null;
}

export interface AssessResponse {
  score: number;
  accuracy: 'excellent' | 'good' | 'fair' | 'poor';
  feedback: string;
  word_scores: WordScore[];
  encouragement: string;
}

// --- 4. SENTENCE CORRECTION API ---
export interface CorrectRequest {
  sentence: string;
}

export interface CorrectResponse {
  isCorrect: boolean;
  corrected: string;
  explanation: string;
  improvements?: string | null;
}

// --- 5. DOUBT RESOLUTION API ---
export interface DoubtRequest {
  question: string;
}

export interface DoubtExample {
  marathi: string;
  transliteration: string;
  english: string;
}

export interface DoubtResponse {
  answer: string;
  examples: DoubtExample[];
}

// --- 6. COMBINED AI API ---
export interface AiRequest {
  sentence?: string;
  question?: string;
  type?: 'correct' | 'doubt';
}

export type AiResponse = CorrectResponse | DoubtResponse;

// --- COMMON CLIENT & HOOK TYPES ---
export interface ApiClientOptions {
  baseUrl?: string;
  personalKey?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
