import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Wand2, Key, Layers, MessageSquareQuote } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, SectionHeader, ProgressBar } from "@/components/ui-kit/primitives";
import { grammarTopics } from "@/lib/data";
import { SharedAiService, type GrammarAnalysisResult } from "@/lib/services/sharedAiService";
import { ApiKeyManager } from "@/lib/services/apiKeyManager";
import { cn } from "@/lib/utils";

function GrammarPage() {
  const [sentenceInput, setSentenceInput] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GrammarAnalysisResult | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [activeLevel, setActiveLevel] = useState<"ALL" | "A1" | "A2" | "B1" | "B2">("ALL");

  useEffect(() => {
    setHasKey(ApiKeyManager.hasApiKey());
  }, []);

  const handleEvaluateSentence = async () => {
    if (!sentenceInput.trim()) return;
    setEvaluating(true);
    try {
      const res = await SharedAiService.analyzeGrammar(sentenceInput);
      setAnalysisResult(res);
    } catch (err) {
      console.warn("Sentence correction error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const filteredTopics = activeLevel === "ALL" 
    ? grammarTopics 
    : grammarTopics.filter(t => t.level === activeLevel);

  const renderHighlightedOriginal = (original: string, corrected: string) => {
    const origWords = original.split(/\s+/);
    const corrWords = corrected.split(/\s+/);

    return (
      <div className="flex flex-wrap gap-1 font-mr text-base font-medium">
        {origWords.map((word, idx) => {
          const isMatch = corrWords.some((cw) => cw.toLowerCase() === word.toLowerCase());
          return (
            <span
              key={idx}
              className={cn(
                "rounded px-1 py-0.5",
                isMatch ? "bg-muted/50 text-foreground" : "bg-destructive/20 text-destructive font-bold line-through"
              )}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <AppShell title="Grammar" subtitle="Bite-sized, in context">
      <div className="flex flex-col gap-5 max-w-xl mx-auto pb-16">

        {/* API Key Setup Banner if key missing */}
        {!hasKey && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <Key size={20} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold">Gemini API Key Required</p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Configure key in Settings to enable Gemini AI Grammar Breakdown & Sentence Fixes.
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

        {/* Focus topic banner */}
        <div className="relative overflow-hidden rounded-[26px] gradient-sunset p-5 text-white shadow-glow">
          <Sparkles className="absolute right-4 top-4 opacity-70" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Today's Focus</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Postpositions ला · ने · चा</h2>
          <p className="mt-1 text-xs text-white/85">3 lessons · 12 example sentences</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>

        {/* AI Sentence Grammar Checker */}
        <div className="flex flex-col gap-2">
          <SectionHeader title="AI Grammar Checker & Breakdown" />

          <div className="rounded-2xl border border-border bg-card p-4 shadow-e1">
            <p className="text-xs font-semibold text-muted-foreground">Type your Marathi sentence (Devanagari or English):</p>
            <div className="mt-2 flex gap-2">
              <input
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEvaluateSentence()}
                placeholder="उदा. मी काल बाजारात गेला होतो..."
                className="min-w-0 flex-1 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm font-mr outline-none placeholder:font-sans"
              />
              <button
                onClick={handleEvaluateSentence}
                disabled={evaluating || !sentenceInput.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl gradient-saffron px-4 py-2.5 text-xs font-bold text-white shadow-e1 hover:opacity-90 disabled:opacity-50"
              >
                {evaluating ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                <span>Check</span>
              </button>
            </div>

            {/* Correction & Analysis Result Container */}
            {analysisResult && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 shadow-e1 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {analysisResult.isCorrect ? (
                      <CheckCircle2 size={18} className="text-success" />
                    ) : (
                      <AlertTriangle size={18} className="text-warning" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {analysisResult.isCorrect ? "Grammatically Correct" : "Needs Correction"}
                    </span>
                  </div>
                  <Chip tone={analysisResult.isCorrect ? "secondary" : "accent"}>
                    {analysisResult.isCorrect ? "100% Accuracy" : "AI Analyzed"}
                  </Chip>
                </div>

                {/* Grammar Rule Used Badge */}
                {analysisResult.ruleUsed && (
                  <div className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary-soft p-3">
                    <BookOpen size={16} className="text-secondary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Grammar Rule</p>
                      <p className="text-xs font-bold text-foreground">{analysisResult.ruleUsed}</p>
                    </div>
                  </div>
                )}

                {!analysisResult.isCorrect && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Input (Mistakes Highlighted):</p>
                    {renderHighlightedOriginal(sentenceInput, analysisResult.corrected)}
                  </div>
                )}

                <div className="rounded-xl border border-primary/20 bg-primary-soft p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Correct Sentence</p>
                  <p className="mt-1 font-mr text-lg font-bold text-foreground">{analysisResult.corrected || sentenceInput}</p>
                </div>

                {/* Multilingual Explanations (English, Hindi, Marathi) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {analysisResult.englishExplanation && (
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <span className="font-bold text-primary block text-[10px] uppercase">English Explanation</span>
                      <span className="text-muted-foreground mt-0.5 block">{analysisResult.englishExplanation}</span>
                    </div>
                  )}
                  {analysisResult.hindiExplanation && (
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <span className="font-bold text-primary block text-[10px] uppercase">Hindi Explanation</span>
                      <span className="font-mr text-muted-foreground mt-0.5 block">{analysisResult.hindiExplanation}</span>
                    </div>
                  )}
                  {analysisResult.marathiExplanation && (
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <span className="font-bold text-primary block text-[10px] uppercase">Marathi Explanation</span>
                      <span className="font-mr text-muted-foreground mt-0.5 block">{analysisResult.marathiExplanation}</span>
                    </div>
                  )}
                </div>

                {/* Word Breakdown */}
                {analysisResult.breakdown && analysisResult.breakdown.length > 0 && (
                  <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Layers size={12} /> Word Breakdown
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {analysisResult.breakdown.map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-border bg-card p-2 text-xs">
                          <span className="font-mr font-bold text-foreground block">{item.word}</span>
                          <span className="text-[10px] text-primary font-semibold block">{item.pos}</span>
                          <span className="text-[10px] text-muted-foreground truncate block">{item.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formal vs Informal Alternatives */}
                {(analysisResult.formalAlternative || analysisResult.informalAlternative) && (
                  <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MessageSquareQuote size={12} /> Alternatives
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {analysisResult.formalAlternative && (
                        <div className="rounded-xl border border-border bg-card p-2.5">
                          <span className="text-[10px] font-bold text-foreground uppercase block">Formal (शिष्टाचार)</span>
                          <span className="font-mr font-medium text-primary block mt-0.5">{analysisResult.formalAlternative}</span>
                        </div>
                      )}
                      {analysisResult.informalAlternative && (
                        <div className="rounded-xl border border-border bg-card p-2.5">
                          <span className="text-[10px] font-bold text-foreground uppercase block">Informal (अनौपचारिक)</span>
                          <span className="font-mr font-medium text-primary block mt-0.5">{analysisResult.informalAlternative}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Level Filters & Grammar Topics List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <SectionHeader title="Grammar Topics" />
            
            {/* Level Selector */}
            <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl">
              {(["ALL", "A1", "A2", "B1", "B2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors",
                    activeLevel === lvl
                      ? "gradient-saffron text-white shadow-e1"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filteredTopics.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-e1 hover:border-primary/40 transition-all cursor-pointer">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <BookOpen size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-foreground">{t.title}</p>
                    <Chip tone="accent">{t.level}</Chip>
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  <ProgressBar value={t.progress} className="mt-2" />
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/grammar")({
  head: () => ({
    meta: [
      { title: "Grammar — BOLA Marathi" },
      { name: "description", content: "Bite-sized Marathi grammar lessons from A1 to B2 and AI sentence correction." },
      { property: "og:title", content: "Marathi Grammar" },
      { property: "og:description", content: "Bite-sized grammar and AI sentence checker." },
    ],
  }),
  component: GrammarPage,
});
