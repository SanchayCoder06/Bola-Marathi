import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, VolumeX, Sparkles, Languages, Send, Lightbulb, RefreshCw, Trash2, HelpCircle, BookOpen, MicOff, Lock, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";
import { AudioEngine } from "@/lib/services/audioEngine";
import { ApiKeyManager } from "@/lib/services/apiKeyManager";
import { apiClient } from "@/lib/api/client";
import type { DoubtExample } from "@/lib/api/types";

export const Route = createFileRoute("/conversation")({
  head: () => ({
    meta: [
      { title: "AI Marathi Tutor — BOLA Marathi" },
      { name: "description", content: "Ask any Marathi question to your personal AI Tutor with voice recognition and streaming chat." },
      { property: "og:title", content: "AI Marathi Tutor" },
      { property: "og:description", content: "Ask questions, get explanations, transliterations, and examples." },
    ],
  }),
  component: Conversation,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  question?: string;
  answer: string;
  en?: string;
  transliteration?: string;
  examples?: DoubtExample[];
  timestamp: string;
}

const initialHistory: ChatMessage[] = [
  {
    id: "init_1",
    role: "assistant",
    answer: "नमस्कार! मी तुमची मराठी AI शिक्षक मीरा आहे. तुम्ही मला कोणताही प्रश्न विचारू शकता!",
    en: "Hello! I am your Marathi AI tutor Meera. You can ask me any question!",
    transliteration: "namaskār! mī tumchī marāṭhī AI shikṣhak mīrā āhe. tumhī malā koṇatāhī prashna vichārū shakatā!",
    examples: [
      {
        marathi: "तुमचं नाव काय आहे?",
        transliteration: "tumcha nāv kāy āhe?",
        english: "What is your name?"
      }
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const examplePrompts = [
  "मराठीत स्वागत कसे करायचे?",
  "How to ask for a train ticket in Marathi?",
  "मराठीमध्ये 'धन्यवाद' कसे म्हणायचे?",
  "Count 1 to 10 in Marathi"
];

function FormattedMessageText({ content, isUser }: { content: string; isUser: boolean }) {
  if (!content) return null;
  const lines = content.split("\n");

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={cn("space-y-1.5 text-sm leading-relaxed", isUser ? "text-white" : "text-foreground")}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        if (trimmed.startsWith("#")) {
          const headerText = trimmed.replace(/^#+\s*/, "");
          return (
            <h4 key={idx} className={cn("font-bold text-base mt-2 mb-1", isUser ? "text-white" : "text-primary")}>
              {parseBoldText(headerText)}
            </h4>
          );
        }

        if (/^[\-\*•]\s+/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[\-\*•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", isUser ? "bg-white" : "bg-primary")} />
              <span>{parseBoldText(bulletText)}</span>
            </div>
          );
        }

        if (/^\d+[\.\)]\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className={cn("font-bold font-mono text-xs mt-0.5", isUser ? "text-white/90" : "text-primary")}>
                  {numMatch[1]}
                </span>
                <span>{parseBoldText(numMatch[2])}</span>
              </div>
            );
          }
        }

        return <p key={idx}>{parseBoldText(trimmed)}</p>;
      })}
    </div>
  );
}

export function Conversation() {
  const nav = useNavigate();
  const [showTranslation, setShowTranslation] = useState(true);
  const [listening, setListening] = useState(false);
  const [muteSpeech, setMuteSpeech] = useState(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return true;
    const saved = localStorage.getItem("bola_mute_speech");
    return saved !== null ? saved === "true" : true;
  });
  const [inputText, setInputText] = useState("");
  const [hasApiKey, setHasApiKey] = useState(() => {
    if (typeof window === "undefined") return false;
    return ApiKeyManager.hasApiKey();
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return initialHistory;
    try {
      const saved = localStorage.getItem("bola_ai_tutor_history");
      return saved ? JSON.parse(saved) : initialHistory;
    } catch {
      return initialHistory;
    }
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    AudioEngine.init();
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      localStorage.setItem("bola_ai_tutor_history", JSON.stringify(chatMessages.slice(-20)));
    } catch {}
  }, [chatMessages, loading]);

  const handleClearChat = () => {
    setChatMessages(initialHistory);
    try {
      localStorage.removeItem("bola_ai_tutor_history");
    } catch {}
  };

  const handleToggleMute = () => {
    const nextMute = !muteSpeech;
    setMuteSpeech(nextMute);
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("bola_mute_speech", String(nextMute));
      } catch {}
    }
    if (nextMute) {
      AudioEngine.pause();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      answer: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Construct history payload from existing chat messages (excluding current new message)
    const historyPayload = chatMessages.slice(-20).map((m) => ({
      role: m.role,
      answer: m.answer,
      content: m.answer
    }));

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setInputText("");
    setLoading(true);

    try {
      const aiRes = await apiClient.chat({
        message: text,
        history: historyPayload
      });

      const answerText = aiRes.answer || aiRes.text || aiRes.error || "No response text received from AI model.";

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        answer: answerText,
        en: aiRes.en || "",
        transliteration: aiRes.transliteration || "",
        examples: aiRes.examples || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      if (aiRes.status === "success" && !muteSpeech) {
        AudioEngine.speak(assistantMsg.answer);
      }
    } catch (err: any) {
      console.error("[Conversation] Meera AI Chat Error:", err);
      const errorMsgText = err?.message || err?.endpoint ? `Network Error (${err.endpoint}): ${err.message}` : "Unable to process AI Chat request.";
      const errorMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        answer: errorMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser. You can type your Marathi question directly.");
      return;
    }

    if (listening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "mr-IN";
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <AppShell
      title="AI Marathi Tutor"
      subtitle="Ask any question"
      back
      right={
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-e1 hover:text-primary transition-colors",
              muteSpeech ? "text-muted-foreground" : "text-primary"
            )}
            title={muteSpeech ? "Unmute AI Voice" : "Mute AI Voice"}
          >
            {muteSpeech ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={handleClearChat}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-e1 hover:text-destructive transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      }
    >
      {/* Tutor Profile Header */}
      <div className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-e1">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-saffron text-white shadow-glow">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Meera — AI Marathi Tutor</p>
            <p className="text-xs text-muted-foreground">Vocabulary, grammar, or translations</p>
          </div>
        </div>
        <button
          onClick={() => setShowTranslation((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
            showTranslation ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Languages size={12} /> {showTranslation ? "EN on" : "EN off"}
        </button>
      </div>

      {/* Missing Gemini API Key Alert Card */}
      {!hasApiKey && (
        <div className="mt-3 flex flex-col items-center justify-center rounded-3xl border border-secondary/30 bg-secondary/10 p-5 text-center shadow-e2 animate-fade-in">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/20 text-secondary mb-2.5">
            <Lock size={22} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Gemini API Key Required</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Please add your Gemini API key in Settings to enable Meera AI features.
          </p>
          <button
            onClick={() => nav({ to: "/settings" })}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full gradient-saffron px-5 py-2 text-xs font-bold text-white shadow-glow hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Open Settings</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="mt-4 flex flex-col gap-4 pb-28">
        {chatMessages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
              <span className="text-[10px] text-muted-foreground px-2">{m.timestamp}</span>
              <div
                className={cn(
                  "max-w-[88%] rounded-3xl p-4 shadow-e1 text-sm leading-relaxed animate-fade-in",
                  isUser
                    ? "gradient-saffron text-white rounded-br-lg font-medium"
                    : "bg-card border border-border text-foreground rounded-bl-lg"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mr">
                    <FormattedMessageText content={m.answer} isUser={isUser} />
                  </div>
                  <button
                    onClick={() => AudioEngine.speak(m.answer)}
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform active:scale-95",
                      isUser ? "bg-white/20 text-white" : "bg-primary-soft text-primary"
                    )}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>

                {m.transliteration && (
                  <p className={cn("mt-1 text-xs font-mono opacity-85", isUser ? "text-white/90" : "text-primary")}>
                    /{m.transliteration}/
                  </p>
                )}

                {showTranslation && m.en && (
                  <p className={cn("mt-1.5 text-xs opacity-90 border-t pt-1.5", isUser ? "border-white/20 text-white/90" : "border-border text-muted-foreground")}>
                    {m.en}
                  </p>
                )}

                {/* Example Sentences */}
                {m.examples && m.examples.length > 0 && (
                  <div className="mt-3 rounded-2xl bg-muted/40 p-3 text-xs border border-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                      <BookOpen size={10} /> Usage Examples
                    </p>
                    {m.examples.map((ex, idx) => (
                      <div key={idx} className="mt-1.5 border-t border-border/50 pt-1.5 first:border-0 first:pt-0">
                        <p className="font-mr font-bold text-foreground">{ex.marathi}</p>
                        {ex.transliteration && <p className="text-[10px] font-mono text-muted-foreground">/{ex.transliteration}/</p>}
                        {ex.english && <p className="text-[11px] text-muted-foreground">{ex.english}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Bouncing Dots Animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-3xl bg-card border border-border px-4 py-3 text-xs text-muted-foreground shadow-e1">
              <span className="font-semibold text-primary">Meera AI is typing</span>
              <span className="flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </span>
            </div>
          </div>
        )}

        {/* Example Prompts Carousel */}
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
            <Lightbulb size={12} className="text-secondary" /> Suggested Prompts
          </p>
          <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
            {examplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-2xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-e1 hover:border-primary/40 active:scale-95 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-24 mt-2">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-e2">
          <button
            onClick={handleMicToggle}
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-all shadow-e1 active:scale-95",
              listening ? "bg-secondary animate-pulse shadow-glow" : "gradient-saffron",
            )}
            aria-label="Record Voice"
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={listening ? "Listening for Marathi speech…" : "Ask any Marathi question..."}
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-saffron text-white shadow-glow disabled:opacity-50 transition-opacity active:scale-95"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
