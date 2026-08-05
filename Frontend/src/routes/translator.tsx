import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeftRight, Volume2, Copy, Check, Clock, RefreshCw, Languages, Sparkles, Key } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, SectionHeader } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { ApiKeyManager } from "@/lib/services/apiKeyManager";
import { SharedAiService } from "@/lib/services/sharedAiService";
import { AudioEngine } from "@/lib/services/audioEngine";

type Direction = "en_to_mr" | "mr_to_en" | "hi_to_mr" | "mr_to_hi";

interface TranslationHistoryItem {
  id: string;
  original: string;
  translated: string;
  transliteration?: string;
  direction: Direction;
  timestamp: string;
}

const directionLabels: Record<Direction, { from: string; to: string }> = {
  en_to_mr: { from: "English", to: "Marathi (मराठी)" },
  mr_to_en: { from: "Marathi (मराठी)", to: "English" },
  hi_to_mr: { from: "Hindi (हिंदी)", to: "Marathi (मराठी)" },
  mr_to_hi: { from: "Marathi (मराठी)", to: "Hindi (हिंदी)" },
};

function TranslatorPage() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Translator (SSR)");
  } else {
    console.log("[Route Load]: Loading Translator (Client)");
  }
  const [inputText, setInputText] = useState("");
  const [direction, setDirection] = useState<Direction>("en_to_mr");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    original: string;
    translated: string;
    transliteration?: string;
    english?: string;
    hindi?: string;
    marathi?: string;
    confidence?: number;
    source?: string;
  } | null>(null);

  useEffect(() => {
    setHasKey(ApiKeyManager.hasApiKey());
  }, []);

  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return [
        {
          id: "hist_1",
          original: "Where is the train station?",
          translated: "रेल्वे स्टेशन कुठे आहे?",
          transliteration: "relve sṭeśan kuṭhe āhe?",
          direction: "en_to_mr",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    try {
      const saved = localStorage.getItem("bola_translation_history");
      return saved ? JSON.parse(saved) : [
        {
          id: "hist_1",
          original: "Where is the train station?",
          translated: "रेल्वे स्टेशन कुठे आहे?",
          transliteration: "relve sṭeśan kuṭhe āhe?",
          direction: "en_to_mr",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    } catch {
      return [];
    }
  });

  const saveHistoryItem = (item: TranslationHistoryItem) => {
    const updated = [item, ...history.filter(h => h.original !== item.original)].slice(0, 20);
    setHistory(updated);
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("bola_translation_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save translation history:", e);
      }
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setCopied(false);

    console.log("==========================================");
    console.log("🚀 [TRANSLATOR TRACE] Execution Started");
    console.log(`1. Input: "${inputText}" | Direction: "${direction}"`);
    console.log(`2. Has Gemini API Key: ${hasKey}`);

    try {
      let translatedText = inputText;
      let transliterationText: string | undefined;
      let englishText: string | undefined;
      let hindiText: string | undefined;
      let marathiText: string | undefined;
      let confidenceNum: number | undefined;
      let sourceName = "SQLite Database";

      if (hasKey) {
        console.log("3. Calling Gemini AI via SharedAiService...");
        try {
          const aiRes = await SharedAiService.translateText(inputText, direction);
          console.log("4. Gemini Response Received:", aiRes);
          translatedText = aiRes.translatedText || inputText;
          transliterationText = aiRes.transliteration;
          englishText = aiRes.english;
          hindiText = aiRes.hindi;
          marathiText = aiRes.marathi;
          confidenceNum = aiRes.confidence || 0.98;
          sourceName = "Gemini AI";
          console.log("5. Gemini Translation Success!");
        } catch (aiErr) {
          console.warn("5. Gemini Call Failed -> Triggering ApiClient Fallback:", aiErr);
          const res = await apiClient.translate({ text: inputText, direction });
          console.log("6. ApiClient Fallback Response Received:", res);
          translatedText = res.translatedText || inputText;
          transliterationText = res.transliteration;
          englishText = res.english;
          hindiText = res.hindi;
          marathiText = res.marathi;
          confidenceNum = res.confidence;
          sourceName = res.source || "SQLite Database";
        }
      } else {
        console.log("3. No Gemini Key -> Searching Local Database / ApiClient...");
        const res = await apiClient.translate({ text: inputText, direction });
        console.log("BACKEND RESPONSE", res);
        translatedText = res.translatedText || inputText;
        transliterationText = res.transliteration;
        englishText = res.english;
        hindiText = res.hindi;
        marathiText = res.marathi;
        confidenceNum = res.confidence;
        sourceName = res.source || "SQLite Database";
      }

      const finalRenderObj = {
        original: inputText,
        translated: translatedText,
        transliteration: transliterationText,
        english: englishText,
        hindi: hindiText,
        marathi: marathiText,
        confidence: confidenceNum,
        source: sourceName
      };

      console.log("7. FINAL OBJECT RENDERED BY UI:", finalRenderObj);
      console.log("==========================================");

      setTranslationResult(finalRenderObj);

      saveHistoryItem({
        id: `hist_${Date.now()}`,
        original: inputText,
        translated: translatedText,
        transliteration: transliterationText,
        direction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.warn("Translation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDirection = () => {
    const swapMap: Record<Direction, Direction> = {
      en_to_mr: "mr_to_en",
      mr_to_en: "en_to_mr",
      hi_to_mr: "mr_to_hi",
      mr_to_hi: "hi_to_mr",
    };
    setDirection(swapMap[direction]);
    setInputText("");
    setTranslationResult(null);
  };

  const handleSpeak = (text: string) => {
    AudioEngine.speak(text);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppShell title="Sentence Translator" subtitle="English ↔ Marathi ↔ Hindi">
      <div className="flex flex-col gap-5 max-w-xl mx-auto pb-16">

        {/* API Key Missing Notice */}
        {!hasKey && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <Key size={20} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold">Standard SQLite Database Translation</p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Configure your Gemini API key in Settings to unlock AI-enhanced translations.
                </p>
              </div>
            </div>
            <Link
              to="/settings"
              className="shrink-0 rounded-xl gradient-saffron px-3 py-1.5 text-xs font-bold text-white shadow-e1 hover:opacity-95"
            >
              Open Settings
            </Link>
          </div>
        )}

        {/* Language selector bar */}
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-e1">
          <div className="flex-1 text-center font-display text-sm font-bold text-foreground">
            {directionLabels[direction].from}
          </div>

          <button
            onClick={toggleDirection}
            className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary hover:scale-105 active:scale-95 transition-transform"
            title="Swap Languages"
          >
            <ArrowLeftRight size={18} />
          </button>

          <div className="flex-1 text-center font-display text-sm font-bold text-foreground">
            {directionLabels[direction].to}
          </div>
        </div>

        {/* Translation Input & Actions Card */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-e2">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                direction.startsWith("en")
                  ? "Enter English sentence to translate..."
                  : direction.startsWith("hi")
                  ? "हिंदी वाक्य यहाँ दर्ज करें..."
                  : "मराठी वाक्य प्रविष्ट करा..."
              }
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-muted/30 p-3.5 font-mr text-base outline-none focus:border-primary transition-colors placeholder:font-sans placeholder:text-xs"
            />
            {inputText && (
              <button
                onClick={() => setInputText("")}
                className="absolute right-3 top-3 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Languages size={14} />
              <span>Sentence Search</span>
            </div>

            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="inline-flex items-center gap-2 rounded-xl gradient-saffron px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-95 disabled:opacity-50 active:scale-95 transition-transform"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Translate</span>
            </button>
          </div>
        </div>

        {/* Translation Output Card */}
        {translationResult && (
          <div className="flex flex-col gap-3 rounded-3xl border border-primary/30 bg-card p-5 shadow-e3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-wider">
                <Sparkles size={13} /> Result ({translationResult.source || "SQLite Database"})
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSpeak(translationResult.translated)}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary hover:scale-105 transition-transform"
                  title="Listen Pronunciation"
                >
                  <Volume2 size={16} />
                </button>
                <button
                  onClick={() => handleCopy(translationResult.translated)}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  title="Copy Translation"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div>
              <p className="font-mr text-2xl font-bold text-foreground leading-relaxed">
                {translationResult.translated}
              </p>

              {translationResult.transliteration && (
                <p className="mt-1 text-xs font-medium text-muted-foreground italic">
                  IPA: {translationResult.transliteration}
                </p>
              )}
            </div>

            {/* Multilingual English, Hindi & Marathi Translations */}
            {(translationResult.english || translationResult.hindi || translationResult.marathi) && (
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                {translationResult.english && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">English:</span>
                    <span className="font-medium text-foreground">{translationResult.english}</span>
                  </div>
                )}
                {translationResult.hindi && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Hindi:</span>
                    <span className="font-mr font-medium text-foreground">{translationResult.hindi}</span>
                  </div>
                )}
                {translationResult.marathi && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Marathi:</span>
                    <span className="font-mr font-medium text-foreground">{translationResult.marathi}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Translation History Section */}
        <div className="flex flex-col gap-3">
          <SectionHeader title="Recent Translations" />

          {history.length > 0 ? (
            <div className="flex flex-col gap-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setInputText(item.original);
                    setDirection(item.direction);
                  }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-e1 hover:border-primary/40 transition-all cursor-pointer group"
                >
                  <div>
                    <p className="font-mr text-sm font-bold text-foreground">{item.translated}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.original}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground">{item.timestamp}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.translated);
                      }}
                      className="mt-1 text-primary hover:scale-110 transition-transform"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground">
              <Clock size={24} className="mx-auto mb-2 opacity-50" />
              Your recent translations will appear here.
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/translator")({
  head: () => ({
    meta: [
      { title: "Translator — BOLA Marathi" },
      { name: "description", content: "Translate between English, Marathi, and Hindi with transliteration, audio, and history." },
      { property: "og:title", content: "Marathi Translator" },
      { property: "og:description", content: "Instant Marathi, English, and Hindi translations with pronunciation." },
    ],
  }),
  component: TranslatorPage,
});
