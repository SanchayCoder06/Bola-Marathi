import { createFileRoute } from "@tanstack/react-router";
import { Flame, Check, ArrowRight, Gem, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, ProgressBar } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daily-challenge")({
  head: () => ({
    meta: [
      { title: "Daily Challenge — BOLA Marathi" },
      { name: "description", content: "Complete today's three challenges to keep your streak alive." },
      { property: "og:title", content: "Daily Challenge" },
      { property: "og:description", content: "Three quick tasks. One streak." },
    ],
  }),
  component: Daily,
});

const tasks = [
  { title: "Order a vada pav", desc: "Roleplay conversation", xp: 40, done: true, tone: "primary" },
  { title: "Learn 5 new words", desc: "Vocabulary flashcards", xp: 30, done: false, tone: "secondary", progress: 0.4 },
  { title: "Culture story: Ganpati", desc: "3 min read", xp: 20, done: false, tone: "accent" },
];

function Daily() {
  const done = tasks.filter((t) => t.done).length;
  return (
    <AppShell title="Daily Challenge" subtitle="Resets in 8h 24m" back>
      <div className="relative overflow-hidden rounded-[28px] gradient-sunset p-5 text-white shadow-glow">
        <Flame className="absolute right-4 top-4 opacity-70" size={26} />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/85">Day 27 streak</p>
        <h2 className="mt-1 font-display text-2xl font-bold">Keep the fire alive</h2>
        <p className="mt-1 text-xs text-white/85">Complete all 3 tasks to earn +100 XP and a streak freeze.</p>
        <div className="mt-4">
          <ProgressBar value={done / tasks.length} className="bg-white/20" />
          <p className="mt-1 text-[11px] text-white/85">{done} of {tasks.length} complete</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {tasks.map((t, i) => (
          <div key={i} className={cn(
            "flex items-center gap-3 rounded-2xl border p-4 shadow-e1",
            t.done ? "border-success/40 bg-success/10" : "border-border bg-card",
          )}>
            <span className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
              t.done ? "bg-success text-white" : "gradient-saffron text-white",
            )}>
              {t.done ? <Check size={18} strokeWidth={3} /> : <span className="font-bold">{i + 1}</span>}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">{t.desc}</p>
              {t.progress !== undefined && !t.done && (
                <ProgressBar value={t.progress} className="mt-2 max-w-[160px]" />
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Chip tone="accent"><Gem size={10} /> +{t.xp}</Chip>
              {!t.done && <ArrowRight size={16} className="text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} /> New challenges every day at 6:00 AM IST
        </div>
      </div>
    </AppShell>
  );
}
