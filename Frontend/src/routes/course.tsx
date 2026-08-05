import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Flame,
  Play,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
  ArrowRight,
  Car,
  Shield,
  FileText
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { XPRing, ProgressBar } from "@/components/ui-kit/primitives";
import { useAppState } from "@/hooks/useAppState";
import { DatabaseService } from "@/lib/db/databaseService";
import { journeyStagesData, type JourneyModule, type JourneyStage } from "@/lib/data/journeyData";
import { SITUATIONAL_COURSES } from "@/lib/data/coursesData";
import { cn } from "@/lib/utils";

// Helper to return Lucide icon based on module title keywords
function getModuleIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("sound") || t.includes("alphabet") || t.includes("script")) return BookOpen;
  if (t.includes("greet") || t.includes("introduce") || t.includes("conversation") || t.includes("talk") || t.includes("call") || t.includes("banter")) return MessageSquare;
  if (t.includes("test") || t.includes("review") || t.includes("exam")) return Sparkles;
  if (t.includes("direction") || t.includes("market") || t.includes("travel") || t.includes("shop")) return Compass;
  return HelpCircle;
}

function Course() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Course (SSR)");
  } else {
    console.log("[Route Load]: Loading Course (Client)");
  }

  const { stats, activeCourseId, courseProgresses, setActiveCourse, authUser } = useAppState();
  const nav = useNavigate();
  const [modules, setModules] = useState<JourneyModule[]>([]);
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    general_stage: true,
    foundation: true,
    conversational: false,
    fluency: false,
  });

  useEffect(() => {
    DatabaseService.init().then(async () => {
      const mods = await DatabaseService.getJourneyModules();
      setModules(mods);

      const updatedStages = await DatabaseService.getJourneyStages();
      setStages(updatedStages);

      // Automatically expand the current tier the user is working on
      const activeModule = mods.find((m) => m.isUnlocked && !m.isCompleted) || mods[0];
      if (activeModule) {
        setExpandedTiers((prev) => ({
          ...prev,
          [activeModule.stageId]: true,
        }));
      } else if (updatedStages.length > 0) {
        setExpandedTiers((prev) => ({
          ...prev,
          [updatedStages[0].id]: true,
        }));
      }
    });
  }, [activeCourseId]);

  const toggleTier = (tierId: string) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [tierId]: !prev[tierId],
    }));
  };

  const handleResumeOrStartCourse = async (courseId: string) => {
    if (activeCourseId !== courseId) {
      setActiveCourse(courseId);
    }
    await DatabaseService.init();
    const allMods = await DatabaseService.getModules(courseId);
    const nextMod = allMods.find(m => m.isUnlocked && !m.isCompleted) || allMods[0];
    if (nextMod) {
      nav({ to: "/lesson/$id", params: { id: nextMod.id } });
    }
  };

  const firstName = (authUser?.name || "Aarav Sharma").split(" ")[0];

  return (
    <AppShell title="Course" subtitle="Full 60-Module Marathi Path">
      <div className="flex flex-col gap-6 w-full pb-24 max-w-xl mx-auto">
        
        {/* 1. GREETING & STREAK ROW */}
        <div className="flex items-center justify-between px-1 mt-2">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Hello, {firstName}! 👋
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Let's master Marathi today.</p>
          </div>
          
          <Link
            to="/daily-challenge"
            className="flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1.5 border border-amber-500/20 text-amber-600 dark:text-amber-400 active:scale-95 transition-all shadow-e1"
          >
            <Flame size={16} className="fill-current animate-pulse" />
            <span className="text-xs font-bold">{stats.streakDays} Day Streak</span>
          </Link>
        </div>

        {/* 2. DAILY TARGET & COMPACT XP SUMMARY */}
        <div className="relative overflow-hidden rounded-[26px] gradient-saffron p-5 text-white shadow-glow">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                <Flame size={14} className="text-amber-200" /> Daily Target
              </div>
              <p className="mt-1 font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                {stats.dailyProgress} / {stats.dailyGoal} XP
              </p>
              <p className="mt-1 text-xs font-medium text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                {stats.dailyGoal - stats.dailyProgress > 0
                  ? `${stats.dailyGoal - stats.dailyProgress} XP remaining for today's streak`
                  : "Daily goal achieved! 🌟"}
              </p>
            </div>

            <XPRing
              value={stats.dailyGoal > 0 ? stats.dailyProgress / stats.dailyGoal : 0}
              size={68}
              label={`L${stats.level}`}
              sublabel="LEVEL"
              className="text-white shrink-0"
            />
          </div>

          <div className="relative mt-3">
            <ProgressBar value={stats.dailyGoal > 0 ? stats.dailyProgress / stats.dailyGoal : 0} tone="primary" />
          </div>
        </div>

        {/* COURSE SELECTOR SECTION */}
        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground px-1">
            Active / Choose Course
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 hide-scrollbar -mx-4 md:mx-0 md:px-0">
            {SITUATIONAL_COURSES.map((course) => {
              const isActive = activeCourseId === course.id;
              const progressData = courseProgresses[course.id];
              const completedCount = progressData?.completedModules?.length || 0;
              const totalCount = course.id === 'general' ? 60 : 8;
              const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              let IconComponent = BookOpen;
              if (course.id === 'travel') IconComponent = Compass;
              if (course.id === 'rickshaw') IconComponent = Car;
              if (course.id === 'watchman') IconComponent = Shield;
              if (course.id === 'office') IconComponent = FileText;

              return (
                <div
                  key={course.id}
                  className={cn(
                    "flex flex-col justify-between min-w-[260px] max-w-[260px] rounded-[24px] border transition-all shadow-e1 bg-card relative overflow-hidden shrink-0",
                    isActive
                      ? "border-primary ring-2 ring-primary/20 scale-[1.01] shadow-glow"
                      : "border-border hover:border-muted-foreground/30 hover:scale-[1.005]"
                  )}
                >
                  {/* Card Image Banner */}
                  <div className="h-28 w-full overflow-hidden relative bg-muted/40 border-b border-border/60">
                    <img 
                      src={`/assets/illustrations/courses/${course.id}.png`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
                    {isActive && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white font-extrabold uppercase text-[8px] tracking-wider px-2 py-0.5 rounded-full shadow-md animate-pulse">
                        Active Course
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1 p-4 pt-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className={cn(
                          "p-2 rounded-xl border",
                          isActive ? "bg-amber-500/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                        )}>
                          <IconComponent size={14} />
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-full">
                          {course.total_hours} Hours
                        </span>
                      </div>

                      <h3 className="font-display text-xs font-bold text-foreground leading-snug mt-1">
                        {course.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground mb-1">
                        <span>{completedCount} / {totalCount} Modules</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full gradient-saffron rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleResumeOrStartCourse(course.id)}
                        className={cn(
                          "w-full py-2 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] shadow-sm",
                          isActive
                            ? "gradient-saffron text-white shadow-glow"
                            : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
                        )}
                      >
                        {isActive ? "Resume Study 🚀" : completedCount > 0 ? "Continue" : "Start"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 60-MODULE ROADMAP TIERS */}
        <div className="flex flex-col gap-4">
          {stages.map((stage, tierIndex) => {
            const isExpanded = expandedTiers[stage.id];
            
            // Calculate completed and total modules for this tier
            const stageModules = modules.filter(
              (m) => m.moduleNumber >= stage.startModule && m.moduleNumber <= stage.endModule
            );
            const stageCompletedCount = stageModules.filter((m) => m.isCompleted).length;
            const stageTotalCount = stage.endModule - stage.startModule + 1;
            const percent = stageTotalCount > 0 ? stageCompletedCount / stageTotalCount : 0;

            return (
              <div key={stage.id} className="rounded-[24px] border border-border bg-card shadow-e1 overflow-hidden transition-all">
                {/* TIER HEADER */}
                <button
                  onClick={() => toggleTier(stage.id)}
                  className="flex items-center justify-between w-full p-5 text-left border-b border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Tier {tierIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {stageCompletedCount} / {stageTotalCount} Complete
                      </span>
                    </div>
                    
                    <h3 className="font-display text-lg font-bold text-foreground mt-0.5 truncate">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {stage.description}
                    </p>

                    <div className="mt-2.5 max-w-xs">
                      <ProgressBar value={percent} className="h-1.5" />
                    </div>
                  </div>

                  <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* TIER MODULES MAP (COLLAPSIBLE) */}
                {isExpanded && (
                  <div className="relative flex flex-col items-center gap-6 py-8 px-4 bg-card">
                    {/* Vertical Connector Line behind the nodes */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-border pointer-events-none" />

                    {stageModules.map((mod, index) => {
                      // Alternating serpentine layout offset values:
                      // e.g. 0px, 32px, 56px, 32px, 0px, -32px, -56px, -32px
                      const pattern = [0, 30, 52, 30, 0, -30, -52, -30];
                      const offsetX = pattern[index % pattern.length];
                      
                      const IconComponent = getModuleIcon(mod.titleEn);
                      
                      // Check states
                      const isModUnlocked = mod.isUnlocked;
                      const isModCompleted = mod.isCompleted;
                      const isModActive = isModUnlocked && !isModCompleted;

                      return (
                        <div
                          key={mod.id}
                          className="relative flex items-center justify-center w-full z-10"
                        >
                          <div
                            className="flex items-center gap-4 transition-transform group cursor-pointer max-w-md w-full justify-center"
                            style={{ transform: `translateX(${offsetX}px)` }}
                            onClick={() => {
                              if (isModUnlocked) {
                                localStorage.setItem("activeJourneyStageId", stage.id);
                                nav({ to: "/lesson/$id", params: { id: mod.id } });
                              }
                            }}
                          >
                            {/* Circle Node Winding Path Button */}
                            <button
                              disabled={!isModUnlocked}
                              className={cn(
                                "relative grid h-14 w-14 place-items-center rounded-full border-3 font-bold transition-all shadow-e2 shrink-0 active:scale-95",
                                isModCompleted
                                  ? "border-success bg-success text-white shadow-glow"
                                  : isModActive
                                  ? "border-primary gradient-saffron text-white shadow-glow animate-pulse"
                                  : "border-border bg-muted/80 text-muted-foreground cursor-not-allowed opacity-60"
                              )}
                            >
                              {isModCompleted ? (
                                <CheckCircle2 size={22} strokeWidth={2.5} />
                              ) : isModActive ? (
                                <Play size={20} fill="currentColor" className="ml-0.5" />
                              ) : (
                                <Lock size={18} />
                              )}

                              {isModActive && (
                                <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[8px] font-black text-amber-950 shadow-md">
                                  GO
                                </span>
                              )}
                            </button>

                            {/* Node Metadata Bubble / Card */}
                            <div className={cn(
                              "flex flex-col gap-0.5 rounded-2xl border bg-card p-3 shadow-e1 text-left w-52 max-w-[210px] transition-all border-border",
                              isModUnlocked ? "group-hover:border-primary/40 group-hover:shadow-e2" : "opacity-60"
                            )}>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground">
                                  MODULE {mod.moduleNumber}
                                </span>
                                <span className="flex items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                                  <Clock size={10} /> ~1 hr
                                </span>
                              </div>

                              <h4 className="font-display text-xs font-bold text-foreground leading-tight line-clamp-2 mt-0.5">
                                {mod.titleEn}
                              </h4>
                              
                              <p className="font-mr text-[10px] font-semibold text-primary/80 line-clamp-1">
                                {mod.titleHindi}
                              </p>
                              
                              <p className="text-[9px] text-muted-foreground line-clamp-1 leading-normal mt-0.5">
                                {mod.descriptionEn}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/course")({
  head: () => ({
    meta: [
      { title: "Course — BOLA Marathi" },
      { name: "description", content: "Collapsible 60-module roadmap to Marathi fluency." },
      { property: "og:title", content: "Course — BOLA Marathi" },
      { property: "og:description", content: "Collapsible 60-module roadmap to Marathi fluency." },
    ],
  }),
  component: Course,
});
