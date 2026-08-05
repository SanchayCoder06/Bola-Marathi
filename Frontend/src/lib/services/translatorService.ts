/**
 * BOLA Marathi — Centralized Translator Service
 * Responsible ONLY for sentence translation endpoints and translation memory.
 * Never queries dictionary word databases.
 */

import { apiClient } from "../api/client";
import type { TranslateRequest, TranslateResponse } from "../api/types";

export class TranslatorService {
  /**
   * Translate sentences between English, Marathi, and Hindi
   */
  public static async translate(req: TranslateRequest): Promise<TranslateResponse> {
    return apiClient.translate(req);
  }

  /**
   * Search sentence translation memory
   */
  public static async searchSentence(query: string): Promise<any> {
    return apiClient.search({ query });
  }

  /**
   * Detect input language (en, hi, mr)
   */
  public static detectLanguage(text: string): "en" | "hi" | "mr" {
    if (!text || !text.trim()) return "en";
    const str = text.trim();
    
    // Devanagari Unicode Range U+0900 to U+097F
    const devanagariCount = (str.match(/[\u0900-\u097F]/g) || []).length;
    if (devanagariCount > 0) {
      // Check Marathi specific characters (ळ)
      if (str.includes("ळ") || str.includes("आहे") || str.includes("नाही") || str.includes("तुम्ही")) {
        return "mr";
      }
      // Hindi specific markers
      if (str.includes("है") || str.includes("और") || str.includes("आप") || str.includes("क्या")) {
        return "hi";
      }
      return "mr"; // Default Devanagari to Marathi
    }
    return "en";
  }
}
