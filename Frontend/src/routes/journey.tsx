import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, Check, Play, Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { useAppState } from "@/hooks/useAppState";
import { DatabaseService } from "@/lib/db/databaseService";
import { journeyStagesData, type JourneyModule, type JourneyStage } from "@/lib/data/journeyData";

function JourneyPage() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Journey (SSR)");
  } else {
    console.log("[Route Load]: Loading Journey (Client)");
  }
  const { stats } = useAppState();
  const [stages] = useState<JourneyStage[]>(journeyStagesData);
  const [modules, setModules] = useState<JourneyModule[]>([]);
  const [activeStageId, setActiveStageId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeJourneyStageId") || "foundation";
    }
    return "foundation";
  });

  const handleStageChange = (stageId: string) => {
    setActiveStageId(stageId);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeJourneyStageId", stageId);
    }
  };
  const [selectedModule, setSelectedModule] = useState<JourneyModule | null>(null);

  useEffect(() => {
    DatabaseService.getJourneyModules().then((data) => {
      if (data && data.length > 0) {
        setModules(data);
      }
    });
  }, []);

  const stageIndex = stages.findIndex((s) => s.id === activeStageId);
  const activeStage = stages[stageIndex >= 0 ? stageIndex : 0];
  const stageModules = modules.filter(
    (m) => m.moduleNumber >= activeStage.startModule && m.moduleNumber <= activeStage.endModule
  );

  const totalCompleted = modules.filter((m) => m.isCompleted).length;
  const stageCompleted = stageModules.filter((m) => m.isCompleted).length;
  const stageModuleCount = activeStage.endModule - activeStage.startModule + 1;

  return (
    <AppShell title="Learning Journey" subtitle={`Level ${stats.level} · ${stats.xp} XP · ${totalCompleted}/60 Modules`}>
      <div className="flex flex-col gap-4 pb-20 max-w-xl mx-auto">

        {/* 1. STAGE TABS */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar bg-card/70 p-1.5 rounded-2xl border border-border">
          {stages.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageChange(stage.id)}
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shrink-0",
                  isActive
                    ? "gradient-saffron text-white shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* 2. COMPACT STAGE HEADER BANNER */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-e1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Stage {stageIndex + 1} of 4
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {stageCompleted} / {stageModuleCount} Modules
            </span>
          </div>

          <h2 className="font-display text-lg font-bold text-foreground">
            {activeStage.title} ({activeStage.hindiTitle})
          </h2>
          <p className="text-xs font-medium text-muted-foreground leading-snug">
            {activeStage.description}
          </p>

          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full gradient-saffron transition-all duration-500"
              style={{ width: `${(stageCompleted / stageModuleCount) * 100}%` }}
            />
          </div>
        </div>

        {/* 3. COMPACT DUOLINGO SERPENTINE NODE PATH */}
        <div className="relative flex flex-col items-center gap-4 py-2">
          {stageModules.map((mod, index) => {
            // Tight alternating serpentine path
            const pattern = [0, 36, 60, 36, 0, -36, -60, -36];
            const offsetX = pattern[index % pattern.length];

            const marathiText =
              mod.vocabulary && mod.vocabulary[0] ? mod.vocabulary[0].mr : mod.titleEn;

            return (
              <div
                key={mod.id}
                className="relative flex flex-col items-center group cursor-pointer"
                style={{ transform: `translateX(${offsetX}px)` }}
                onClick={() => setSelectedModule(mod)}
              >
                <button
                  className={cn(
                    "relative grid h-14 w-14 place-items-center rounded-full border-3 font-bold transition-all shadow-e2 active:scale-95",
                    mod.isCompleted
                      ? "border-success bg-success text-white shadow-glow"
                      : mod.isUnlocked
                      ? "border-primary gradient-saffron text-white shadow-glow animate-pulse"
                      : "border-border bg-muted/80 text-muted-foreground cursor-not-allowed opacity-60"
                  )}
                >
                  {mod.isCompleted ? (
                    <Check size={22} strokeWidth={3} />
                  ) : mod.isUnlocked ? (
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  ) : (
                    <Lock size={18} />
                  )}

                  {mod.isUnlocked && !mod.isCompleted && (
                    <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[9px] font-black text-amber-950 shadow-md">
                      GO
                    </span>
                  )}
                </button>

                {/* Multilingual 3-line label (English / Hindi / Marathi) */}
                <div className="mt-1 text-center max-w-[140px] leading-tight">
                  <span className="block text-xs font-bold text-foreground line-clamp-1">
                    {mod.titleEn}
                  </span>
                  <span className="block font-mr text-[11px] font-semibold text-primary line-clamp-1">
                    ({mod.titleHindi})
                  </span>
                  <span className="block font-mr text-[10px] font-medium text-muted-foreground line-clamp-1">
                    ({marathiText})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. MODULE PREVIEW DRAWER MODAL */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="flex w-full max-w-md flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-e4 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  Module {selectedModule.moduleNumber}
                </span>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Close ✕
                </button>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {selectedModule.titleEn}
                </h3>
                <p className="font-mr text-sm font-semibold text-primary">
                  ({selectedModule.titleHindi})
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {selectedModule.descriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-b border-border py-2.5 text-xs font-bold">
                <span className="text-muted-foreground">Reward XP</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Sparkles size={14} /> +{selectedModule.xp} XP
                </span>
              </div>

              <Link
                to="/lesson/$id"
                params={{ id: selectedModule.id }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl gradient-saffron text-sm font-bold text-white shadow-glow hover:opacity-95 active:scale-[0.98] transition-transform"
              >
                <span>Start Lesson</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — BOLA Marathi" },
      { name: "description", content: "Duolingo-style 60-module learning path from absolute beginner to conversational fluency." },
      { property: "og:title", content: "60-Module Marathi Journey" },
      { property: "og:description", content: "Foundation, Beginner Conversation, Intermediate, and Advanced Marathi stages." },
    ],
  }),
  component: JourneyPage,
});
