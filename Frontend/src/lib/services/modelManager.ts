/**
 * BOLA Marathi — Dynamic Gemini Model Discovery & Selection System
 * Discovers available models from Google Gemini API, filters out TTS/Audio/Speech/Live/Embedding models,
 * and selects the optimal conversational text model without hardcoded defaults.
 */

const STORAGE_MODEL_KEY = "bola_gemini_model";
const STORAGE_VERSION_KEY = "bola_gemini_version";
const STORAGE_CANDIDATES_KEY = "bola_gemini_candidates";

export interface ModelCapabilities {
  chat: boolean;
  generateContent: boolean;
  streaming: boolean;
}

export interface ModelDiscoveryResult {
  success: boolean;
  selectedModel: string;
  apiVersion: string;
  availableModels: string[];
  capabilities: ModelCapabilities;
  message: string;
}

// Keywords for non-conversational text models (TTS, Speech, Audio, Live, Image, Embedding)
const NON_CHAT_KEYWORDS = [
  "tts",
  "speech",
  "audio",
  "live",
  "preview-tts",
  "imagen",
  "embedding",
  "realtime",
  "bidi"
];

export class ModelManager {
  /**
   * Helper to check if a model name represents a valid conversational text chat model
   */
  public static isConversationalChatModel(modelName: string): boolean {
    if (!modelName) return false;
    const lower = modelName.toLowerCase();
    for (const kw of NON_CHAT_KEYWORDS) {
      if (lower.includes(kw)) return false;
    }
    return true;
  }

  /**
   * Get active model configuration and candidate models from storage
   */
  public static getStoredModelConfig(): {
    model: string;
    apiVersion: string;
    candidateModels: string[];
    capabilities: ModelCapabilities;
  } {
    try {
      if (typeof window === "undefined") {
        return {
          model: "",
          apiVersion: "v1beta",
          candidateModels: [],
          capabilities: { chat: true, generateContent: true, streaming: true }
        };
      }
      let model = localStorage.getItem(STORAGE_MODEL_KEY) || "";
      const apiVersion = localStorage.getItem(STORAGE_VERSION_KEY) || "v1beta";
      let candidateModels: string[] = [];

      try {
        const savedCandidates = localStorage.getItem(STORAGE_CANDIDATES_KEY);
        if (savedCandidates) {
          candidateModels = JSON.parse(savedCandidates);
        }
      } catch {}

      // If stored model is a non-chat model (e.g. TTS), filter candidate list and switch to first valid chat model
      if (model && !this.isConversationalChatModel(model)) {
        console.warn(`[ModelManager] Stored model '${model}' is a TTS/Audio model. Switching to a valid text chat model...`);
        const validCandidates = candidateModels.filter((m) => this.isConversationalChatModel(m));
        if (validCandidates.length > 0) {
          model = validCandidates[0];
          this.saveModelConfig(model, apiVersion, validCandidates);
        } else {
          model = "";
        }
      }

      return {
        model,
        apiVersion,
        candidateModels,
        capabilities: { chat: Boolean(model), generateContent: Boolean(model), streaming: Boolean(model) }
      };
    } catch {
      return {
        model: "",
        apiVersion: "v1beta",
        candidateModels: [],
        capabilities: { chat: false, generateContent: false, streaming: false }
      };
    }
  }

  /**
   * Save working model configuration and candidate list to storage
   */
  public static saveModelConfig(model: string, apiVersion: string = "v1beta", candidateModels: string[] = []): void {
    try {
      localStorage.setItem(STORAGE_MODEL_KEY, model.trim());
      localStorage.setItem(STORAGE_VERSION_KEY, apiVersion.trim());
      localStorage.setItem(STORAGE_CANDIDATES_KEY, JSON.stringify(candidateModels));
    } catch (err) {
      console.warn("[ModelManager] Failed to save model config:", err);
    }
  }

  /**
   * Query Google Gemini API list models endpoint and pick the optimal supported text chat model
   */
  public static async discoverAndSelectModel(apiKey: string): Promise<ModelDiscoveryResult> {
    const cleanKey = apiKey ? apiKey.trim() : "";
    const defaultCapabilities: ModelCapabilities = { chat: false, generateContent: false, streaming: false };

    if (!cleanKey) {
      return {
        success: false,
        selectedModel: "",
        apiVersion: "v1beta",
        availableModels: [],
        capabilities: defaultCapabilities,
        message: "✗ Invalid API Key: Key cannot be empty."
      };
    }

    const apiVersion = "v1beta";
    const envUrl = 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof process !== 'undefined' && (process.env?.VITE_API_URL as string)) ||
      'http://localhost:5000';
    const baseUrl = envUrl.replace(/\/$/, '');
    const modelsUrl = `${baseUrl}/api/models`;

    try {
      const resp = await fetch(modelsUrl, {
        method: "GET",
        headers: {
          "x-gemini-key": cleanKey,
          "x-gemini-version": apiVersion
        }
      });
      if (!resp.ok) {
        if (resp.status === 400 || resp.status === 403) {
          return {
            success: false,
            selectedModel: "",
            apiVersion,
            availableModels: [],
            capabilities: defaultCapabilities,
            message: "✗ Invalid API Key: Unable to authenticate with Gemini servers."
          };
        }
        if (resp.status === 429) {
          return {
            success: false,
            selectedModel: "",
            apiVersion,
            availableModels: [],
            capabilities: defaultCapabilities,
            message: "✗ Rate Limit Exceeded: Please check your Gemini plan quota."
          };
        }
        return {
          success: false,
          selectedModel: "",
          apiVersion,
          availableModels: [],
          capabilities: defaultCapabilities,
          message: `Unable to connect to Gemini. Please verify your API key or internet connection.`
        };
      }

      const data = await resp.json();
      const rawModelsList: any[] = data.models || [];

      // Filter 1: Must support generateContent
      // Filter 2: Must NOT be a TTS/Audio/Speech/Live/Embedding/Image model
      const candidateModels = rawModelsList
        .filter((m) => {
          const methods = m.supportedGenerationMethods || [];
          const name = (m.name || "").replace(/^models\//, "");
          return methods.includes("generateContent") && this.isConversationalChatModel(name);
        })
        .map((m) => (m.name || "").replace(/^models\//, ""));

      console.log(`[ModelManager] Available raw models count: ${rawModelsList.length}`);
      console.log(`[ModelManager] Filtered conversational text models count: ${candidateModels.length}`);

      if (candidateModels.length === 0) {
        return {
          success: false,
          selectedModel: "",
          apiVersion,
          availableModels: [],
          capabilities: defaultCapabilities,
          message: "Connected to Gemini, but no valid text chat models were found (non-chat TTS/Audio models excluded)."
        };
      }

      // Sort candidate models: Flash text priority first, Pro text second
      const sortedCandidates = this.sortCandidatesByPriority(candidateModels);
      const selectedModel = sortedCandidates[0];

      const activeCapabilities: ModelCapabilities = {
        chat: true,
        generateContent: true,
        streaming: true
      };

      // Save dynamic discovered model config & clean candidate list
      this.saveModelConfig(selectedModel, apiVersion, sortedCandidates);

      return {
        success: true,
        selectedModel,
        apiVersion,
        availableModels: sortedCandidates,
        capabilities: activeCapabilities,
        message: "✓ API Key Connected"
      };
    } catch (err: any) {
      return {
        success: false,
        selectedModel: "",
        apiVersion,
        availableModels: [],
        capabilities: defaultCapabilities,
        message: "Unable to connect to Gemini. Please verify your API key or internet connection."
      };
    }
  }

  /**
   * Priority Model Selection for Text Chat
   */
  private static sortCandidatesByPriority(candidateModels: string[]): string[] {
    const flashPriority = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-002",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash",
      "gemini-flash"
    ];

    const proPriority = [
      "gemini-1.5-pro",
      "gemini-1.5-pro-latest",
      "gemini-1.5-pro-002",
      "gemini-pro",
      "gemini-1.0-pro"
    ];

    const sorted: string[] = [];
    const set = new Set(candidateModels);

    // 1. Add Flash priority matches
    for (const f of flashPriority) {
      const match = candidateModels.find((m) => m.toLowerCase() === f.toLowerCase());
      if (match && !sorted.includes(match)) {
        sorted.push(match);
        set.delete(match);
      }
    }

    // 2. Add Pro priority matches
    for (const p of proPriority) {
      const match = candidateModels.find((m) => m.toLowerCase() === p.toLowerCase());
      if (match && !sorted.includes(match)) {
        sorted.push(match);
        set.delete(match);
      }
    }

    // 3. Add remaining flash models
    candidateModels.forEach((m) => {
      if (set.has(m) && m.toLowerCase().includes("flash") && !sorted.includes(m)) {
        sorted.push(m);
        set.delete(m);
      }
    });

    // 4. Add remaining candidates
    candidateModels.forEach((m) => {
      if (set.has(m) && !sorted.includes(m)) {
        sorted.push(m);
      }
    });

    return sorted;
  }
}
