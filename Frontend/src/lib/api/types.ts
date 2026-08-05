/**
 * BOLA Marathi — Centralized API Layer Types
 * Defines type-safe request/response contracts for backend endpoints.
 */

export type TranslationDirection = 'en_to_mr' | 'mr_to_en' | 'hi_to_mr' | 'mr_to_hi';

export interface TranslateRequest {
  text: string;
  direction?: TranslationDirection;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface TranslateResponse {
  translatedText: string;
  transliteration?: string;
  matchedSentence?: string;
  confidence?: number;
  sourceLanguage?: string;
  targetLanguage?: string;
  english?: string;
  hindi?: string;
  marathi?: string;
  source?: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResultItem {
  id: number;
  english: string;
  hindi: string;
  marathi: string;
  confidence?: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  count: number;
}


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

export interface AssessRequest {
  expectedMarathi: string;
  expectedTransliteration?: string;
  expectedEnglish?: string;
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

export interface CorrectRequest {
  sentence: string;
}

export interface CorrectResponse {
  isCorrect: boolean;
  corrected: string;
  explanation: string;
  improvements?: string | null;
}

export interface ChatMessageContext {
  role: 'user' | 'assistant';
  answer?: string;
  question?: string;
  text?: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessageContext[];
}

export interface ChatResponse {
  answer: string;
  en?: string;
  transliteration?: string;
  examples?: DoubtExample[];
  status?: string;
}

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

export interface AiRequest {
  sentence?: string;
  question?: string;
  type?: 'correct' | 'doubt';
}

export type AiResponse = CorrectResponse | DoubtResponse;

export interface ApiClientOptions {
  baseUrl?: string;
  personalKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
