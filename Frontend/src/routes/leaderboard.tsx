import { createFileRoute } from "@tanstack/react-router";
import { Crown, Medal, Award } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip } from "@/components/ui-kit/primitives";
import { leaderboard } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — BOLA Marathi" },
      { name: "description", content: "Weekly rankings across learners in Maharashtra league." },
      { property: "og:title", content: "Leaderboard" },
      { property: "og:description", content: "Weekly rankings across the Maharashtra league." },
    ],
  }),
  component: Leaderboard,
});

const tabs = ["Weekly", "Friends", "All time"] as const;
const podiumIcons = [Crown, Medal, Award];

function Leaderboard() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Weekly");
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <AppShell title="Leaderboard" subtitle="Sahyadri League · 4 days left" back>
      <div className="flex rounded-full border border-border bg-card p-1 shadow-e1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 text-xs font-semibold transition-all",
              tab === t ? "gradient-saffron text-white shadow-e1" : "text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="mt-6 grid grid-cols-3 items-end gap-3">
        {[podium[1], podium[0], podium[2]].map((p, i) => {
          const rank = p.rank;
          const Icon = podiumIcons[rank - 1];
          const heights = ["h-24", "h-32", "h-20"];
          return (
            <div key={p.name} className="flex flex-col items-center">
              <div className="relative">
                <img src={p.avatar} alt="" className={cn("rounded-2xl border-2 bg-card", rank === 1 ? "h-16 w-16 border-accent" : "h-14 w-14 border-border")} />
                <span className={cn(
                  "absolute -bottom-1 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full border-2 border-background text-[10px] font-bold text-white",
                  rank === 1 ? "bg-accent text-accent-foreground" : rank === 2 ? "bg-muted-foreground" : "bg-secondary",
                )}>
                  {rank}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.xp} XP</p>
              <div className={cn(
                "mt-2 flex w-full items-start justify-center rounded-t-2xl pt-3",
                heights[i],
                rank === 1 ? "gradient-saffron" : rank === 2 ? "bg-muted" : "bg-secondary/40",
              )}>
                <Icon size={18} className={rank === 1 ? "text-white" : "text-foreground"} />
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-6 flex flex-col gap-2">
        {rest.map((p) => (
          <div
            key={p.name}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 shadow-e1",
              p.isMe ? "border-primary bg-primary-soft" : "border-border bg-card",
            )}
          >
            <span className="w-6 text-center text-sm font-bold text-muted-foreground">{p.rank}</span>
            <img src={p.avatar} alt="" className="h-10 w-10 rounded-2xl border border-border bg-card" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.xp} XP this week</p>
            </div>
            {p.isMe && <Chip tone="primary">You</Chip>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
