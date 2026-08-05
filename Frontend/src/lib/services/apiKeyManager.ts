/**
 * BOLA Marathi — Gemini API Key Manager
 * Securely stores, validates, and manages user Gemini API Keys in browser local storage.
 * Ensures API key is NEVER shown in plain text after saving.
 */

import { ModelManager, type ModelDiscoveryResult } from './modelManager';

const STORAGE_KEY = "bola_gemini_api_key";
const MASK_STRING = "••••••••••••••••••••••••••••••••";

export interface ValidationResult {
  isValid: boolean;
  message: string;
  selectedModel?: string;
  apiVersion?: string;
  availableModels?: string[];
}

export class ApiKeyManager {
  /**
   * Check if a valid API key exists in storage
   */
  public static hasApiKey(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 5);
  }

  /**
   * Retrieve the active Gemini API Key (for internal API network requests only)
   */
  public static getApiKey(): string | null {
    try {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? saved.trim() : null;
    } catch (err) {
      console.warn("[ApiKeyManager] LocalStorage access error:", err);
      return null;
    }
  }

  /**
   * Get masked key for UI display (NEVER displays plain text)
   */
  public static getMaskedKey(): string {
    if (!this.hasApiKey()) return "";
    return MASK_STRING;
  }

  /**
   * Test & validate a Gemini API Key with dynamic model discovery
   */
  public static async validateApiKey(apiKey: string): Promise<ValidationResult> {
    const cleanKey = apiKey ? apiKey.trim() : "";
    if (!cleanKey) {
      return { isValid: false, message: "✗ Invalid API Key: Key cannot be empty." };
    }

    // Perform dynamic model discovery via ModelManager
    const discovery: ModelDiscoveryResult = await ModelManager.discoverAndSelectModel(cleanKey);

    if (!discovery.success) {
      return { isValid: false, message: discovery.message };
    }

    return {
      isValid: true,
      message: discovery.message,
      selectedModel: discovery.selectedModel,
      apiVersion: discovery.apiVersion,
      availableModels: discovery.availableModels
    };
  }

  /**
   * Save API Key after validating connection and discovering working models
   */
  public static async saveApiKey(apiKey: string): Promise<ValidationResult> {
    const validation = await this.validateApiKey(apiKey);
    if (!validation.isValid) {
      return validation;
    }

    try {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      return validation;
    } catch (err: any) {
      return { isValid: false, message: `✗ Storage Error: Failed to save API Key (${err?.message})` };
    }
  }

  /**
   * Permanently remove stored API Key
   */
  public static deleteApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("bola_gemini_model");
      localStorage.removeItem("bola_gemini_version");
    } catch (err) {
      console.warn("[ApiKeyManager] Failed to delete key:", err);
    }
  }
}
