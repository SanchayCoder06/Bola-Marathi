import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Plane, GraduationCap, Briefcase, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatabaseService } from "@/lib/db/databaseService";
import { AuthService } from "@/lib/services/authService";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "Pick your path — BOLA Marathi" },
      { name: "description", content: "Choose your reason for learning and your current level." },
      { property: "og:title", content: "Pick your path — BOLA Marathi" },
      { property: "og:description", content: "Personalize your Marathi journey in seconds." },
    ],
  }),
  component: Language,
});

const goals = [
  { id: "tour", label: "Traveling to Maharashtra", icon: Plane },
  { id: "study", label: "Student / Academic", icon: GraduationCap },
  { id: "work", label: "Moving for work", icon: Briefcase },
  { id: "love", label: "Just love the language", icon: Heart },
];
const levels = [
  { id: "new", label: "Complete beginner", sub: "I know a few words" },
  { id: "basic", label: "Basics", sub: "I can greet & introduce" },
  { id: "conv", label: "Conversational", sub: "I get by day-to-day" },
  { id: "fluent", label: "Fluent", sub: "I want to refine" },
];
const minutes = [5, 10, 15, 30];

function withTimeout<T>(promise: Promise<T>, ms: number = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Operation timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function Language() {
  const [goal, setGoal] = useState("tour");
  const [level, setLevel] = useState("new");
  const [mins, setMins] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    DatabaseService.getUser().then((user) => {
      if (user.learningGoal) setGoal(user.learningGoal);
      if (user.currentLevel) setLevel(user.currentLevel);
      if (user.dailyGoalMins) setMins(user.dailyGoalMins);
    }).catch((e) => console.warn("Failed to fetch initial user personalization:", e));
  }, []);

  const handleStartLearning = async () => {
    console.log("[Personalization Step 1] Submitting preferences...");
    console.log(`[Personalization Step 1] Goal: ${goal}, Level: ${level}, Mins: ${mins}`);
    setIsSaving(true);

    try {
      console.log("[Personalization Step 2] Saving choices to DatabaseService...");
      try {
        await withTimeout(
          DatabaseService.updateUser({
            learningGoal: goal,
            currentLevel: level,
            dailyGoalMins: mins,
            onboardingCompleted: true
          }),
          2500
        );
      } catch (e) {
        console.warn("[Personalization Warning] DatabaseService save warning:", e);
      }

      console.log("[Personalization Step 3] Updating AuthService currentUser state...");
      await AuthService.updateCurrentUser({
        onboardingCompleted: true
      });

      console.log("[Personalization Step 4] Updating daily goal progress & settings...");
      try {
        await withTimeout(DatabaseService.updateProgress({ dailyGoal: mins * 5 }), 2000);
        await withTimeout(DatabaseService.updateSettings({ dailyGoalTarget: mins }), 2000);
      } catch (e) {
        console.warn("[Personalization Warning] Settings update warning:", e);
      }

      console.log("[Personalization Step 5] Personalization complete! Navigating to Course...");
      nav({ to: "/course" });
    } catch (err: any) {
      console.error("[Personalization Error] Execution encountered error:", err);
      // Fallback navigation to course
      nav({ to: "/course" });
    } finally {
      console.log("[Personalization Step 6] Resetting isSaving = false");
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-[max(env(safe-area-inset-top),24px)]">
      <div className="flex items-center justify-between">
        <Link to="/onboarding" className="text-xs font-semibold text-muted-foreground">Back</Link>
        <span className="text-xs font-semibold text-muted-foreground">Setup</span>
      </div>
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 gradient-saffron" /></div>
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold">Personalize your journey</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll tune missions, pace, and vocabulary to fit you.</p>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why are you learning?</h2>
        <div className="grid grid-cols-2 gap-3">
          {goals.map((g) => {
            const active = goal === g.id;
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left shadow-e1 transition-all active:scale-[0.97]",
                  active ? "border-primary bg-primary-soft text-primary shadow-glow" : "border-border bg-card text-foreground"
                )}
              >
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl", active ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                  <Icon size={18} />
                </span>
                <span className="text-xs font-bold leading-tight">{g.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marathi level</h2>
        <div className="flex flex-col gap-2">
          {levels.map((l) => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border p-3 text-left shadow-e1 transition-all active:scale-[0.98]",
                  active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground"
                )}
              >
                <div>
                  <p className="text-sm font-bold">{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.sub}</p>
                </div>
                <div className={cn("grid h-6 w-6 place-items-center rounded-full border", active ? "border-primary bg-primary text-white" : "border-border bg-card")}>
                  {active && <Check size={12} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily commitment</h2>
        <div className="grid grid-cols-4 gap-2">
          {minutes.map((m) => {
            const active = mins === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMins(m)}
                className={cn(
                  "flex flex-col items-center rounded-2xl border py-3 shadow-e1 transition-all active:scale-[0.96]",
                  active ? "border-primary bg-primary text-white shadow-glow" : "border-border bg-card text-foreground"
                )}
              >
                <span className="font-display text-lg font-bold">{m}</span>
                <span className="text-[10px] uppercase opacity-80">min/day</span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={handleStartLearning}
        disabled={isSaving}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl gradient-saffron text-base font-semibold text-white shadow-glow active:scale-[0.98] disabled:opacity-75"
      >
        <span>{isSaving ? "Saving..." : "Start Learning"}</span>
      </button>
    </div>
  );
}
