import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Trophy, Sparkles, Coffee, Flame, Crown, BookOpen, Landmark, Lock, Gem, MessagesSquare, Award } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, ProgressBar, SectionHeader } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";
import { DatabaseService } from "@/lib/db/databaseService";
import type { AchievementModel } from "@/lib/db/models";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — BOLA Marathi" },
      { name: "description", content: "Unlock badges as you conquer Marathi." },
      { property: "og:title", content: "Achievements" },
      { property: "og:description", content: "Badges, milestones, and legendary titles." },
    ],
  }),
  component: Achievements,
});

const iconMap = { Sparkles, Coffee, Flame, Crown, BookOpen, Landmark, Gem, MessagesSquare, Award } as const;
const rarityStyle: Record<string, string> = {
  common: "from-slate-400 to-slate-600",
  rare: "from-info to-primary",
  epic: "from-secondary to-primary",
  legendary: "from-accent to-secondary",
};

function Achievements() {
  const [dbAchievements, setDbAchievements] = useState<AchievementModel[]>([]);

  useEffect(() => {
    DatabaseService.getAchievements().then(setDbAchievements);
  }, []);

  const unlockedCount = dbAchievements.filter((a) => a.unlocked).length;

  return (
    <AppShell title="Achievements" subtitle={`${unlockedCount} of ${dbAchievements.length} unlocked`} back>
      <div className="relative overflow-hidden rounded-[28px] gradient-saffron p-5 text-white shadow-glow">
        <Trophy className="absolute right-4 top-4 opacity-70" size={26} />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/85">Season 1</p>
        <h2 className="mt-1 font-display text-2xl font-bold">The Warkari Path</h2>
        <p className="mt-1 text-xs text-white/85">Complete achievements to unlock badges & legendary titles.</p>
        <ProgressBar value={dbAchievements.length > 0 ? unlockedCount / dbAchievements.length : 0} className="mt-4 bg-white/20" />
        <p className="mt-1 text-[11px] text-white/85">{unlockedCount}/{dbAchievements.length} Badges Unlocked</p>
      </div>

      <SectionHeader title="All badges" action="Filter" />
      <div className="grid grid-cols-2 gap-3">
        {dbAchievements.map((a) => {
          const Icon = iconMap[a.icon as keyof typeof iconMap] ?? Sparkles;
          return (
            <div
              key={a.id}
              className={cn(
                "flex flex-col items-center rounded-2xl border p-4 text-center shadow-e1",
                a.unlocked ? "border-border bg-card" : "border-dashed border-border bg-muted/40",
              )}
            >
              <div className={cn(
                "relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-e2",
                rarityStyle[a.rarity] || rarityStyle.common,
                !a.unlocked && "grayscale opacity-50",
              )}>
                <Icon size={24} />
                {!a.unlocked && (
                  <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-muted text-muted-foreground shadow-e1">
                    <Lock size={12} />
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold">{a.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{a.desc}</p>
              {a.progress !== undefined && !a.unlocked && (
                <ProgressBar value={a.progress} className="mt-2 w-full" />
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
