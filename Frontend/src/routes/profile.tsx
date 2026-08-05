import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, Flame, Gem, Trophy, Camera, Bookmark, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader, XPRing } from "@/components/ui-kit/primitives";
import { user as defaultUser } from "@/lib/data";
import { useAppState } from "@/hooks/useAppState";
import { AuthService } from "@/lib/services/authService";
import { DatabaseService } from "@/lib/db/databaseService";
import { cn } from "@/lib/utils";
import type { AchievementModel, LessonModel } from "@/lib/db/models";
import type { JourneyModule, JourneyStage } from "@/lib/data/journeyData";

const avatarSeeds = [
  "Aarav", "Priya", "Vikram", "Ananya", "Sameer", "Aditi", "Rohan", "Sneha", "Tanaji", "Bodhi"
];

function Profile() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Profile (SSR)");
  } else {
    console.log("[Route Load]: Loading Profile (Client)");
  }
  const { stats, activeCourseId, courseProgresses, authUser } = useAppState();
  const [achievements, setAchievements] = useState<AchievementModel[]>([]);
  const [modules, setModules] = useState<JourneyModule[]>([]);
  const [lessons, setLessons] = useState<LessonModel[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; avatar: string }>({
    name: authUser?.name || defaultUser.name,
    email: authUser?.email || "aarav.sharma@gmail.com",
    avatar: authUser?.avatar || defaultUser.avatar,
  });

  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);

  useEffect(() => {
    DatabaseService.getUser().then((dbUser) => {
      setUserProfile({
        name: authUser?.name || dbUser.name || defaultUser.name,
        email: authUser?.email || dbUser.email || "aarav.sharma@gmail.com",
        avatar: authUser?.avatar || dbUser.avatar || defaultUser.avatar,
      });
    });

    DatabaseService.getAchievements().then(setAchievements);
    DatabaseService.getJourneyModules().then(setModules);
    DatabaseService.getLessons().then(setLessons);

    try {
      const savedBookmarks = localStorage.getItem("bola_bookmarked_words");
      if (savedBookmarks) {
        setBookmarksCount(JSON.parse(savedBookmarks).length);
      } else {
        setBookmarksCount(2);
      }
    } catch {
      setBookmarksCount(2);
    }
  }, [authUser]);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  
  const totalCompletedModules = Object.values(courseProgresses).reduce(
    (sum: number, cp: any) => sum + (cp.completedModules?.length || 0),
    0
  );

  const handleUpdateAvatar = async (newSeed: string) => {
    const newAvatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${newSeed}`;
    setUserProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
    await DatabaseService.updateUser({ avatar: newAvatarUrl });
    await AuthService.updateCurrentUser({ avatar: newAvatarUrl });
    setIsEditingAvatar(false);
  };

  return (
    <AppShell title="Profile" subtitle={`Joined ${new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" })}`}>
      <div className="flex flex-col gap-6 pb-24 max-w-xl mx-auto">
        {/* User Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-e2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="h-20 w-20 rounded-full border-2 border-primary object-cover bg-amber-100 shadow-md"
              />
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full gradient-saffron text-white shadow-glow hover:scale-110 transition-transform"
                title="Change Avatar"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-foreground">{userProfile.name}</h2>
              <p className="text-xs text-muted-foreground font-medium">{userProfile.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                  Level {stats.level}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                  Student
                </span>
              </div>
            </div>

            <Link
              to="/settings"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings size={18} />
            </Link>
          </div>

          {/* Avatar Selector Tray */}
          {isEditingAvatar && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2 animate-fade-in">
              <span className="text-xs font-bold text-muted-foreground">Choose New Avatar:</span>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {avatarSeeds.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => handleUpdateAvatar(seed)}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-amber-50 hover:border-primary hover:scale-110 transition-all"
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`}
                      alt={seed}
                      className="h-10 w-10 rounded-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Flame size={20} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">{stats.streakDays} Days</span>
              <p className="text-[11px] font-medium text-muted-foreground">Max Streak</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Gem size={20} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">{stats.xp} XP</span>
              <p className="text-[11px] font-medium text-muted-foreground">Overall XP</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">{totalCompletedModules}</span>
              <p className="text-[11px] font-medium text-muted-foreground">Modules Completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
              <Bookmark size={20} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">{bookmarksCount} Words</span>
              <p className="text-[11px] font-medium text-muted-foreground">Favorites Saved</p>
            </div>
          </div>
        </div>

        {/* Course Progress Breakdown Section */}
        <div className="flex flex-col gap-3">
          <SectionHeader title="Course Breakdown" />
          <div className="flex flex-col gap-3 bg-card border border-border rounded-3xl p-5 shadow-e2">
            {[
              { id: 'general', title: 'General Conversational Marathi', total: 60 },
              { id: 'travel', title: 'Travelling & Railway Station Marathi', total: 8 },
              { id: 'rickshaw', title: 'Auto-Rickshaw Driver Marathi', total: 8 },
              { id: 'watchman', title: 'Watchman / Security Guard', total: 8 },
              { id: 'office', title: 'Government Office Marathi', total: 8 }
            ].map((course) => {
              const cp = courseProgresses[course.id] || { xp: 0, streakDays: 0, completedModules: [] };
              const completedCount = cp.completedModules?.length || 0;
              const percent = (completedCount / course.total) * 100;
              
              return (
                <div key={course.id} className="flex flex-col gap-2 p-3 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-black text-foreground truncate">{course.title}</h4>
                      <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span>{cp.xp || 0} XP</span>
                        <span>•</span>
                        <span>{cp.streakDays || 0} Day Streak</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary shrink-0">
                      {completedCount} / {course.total} Completed
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-saffron rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="flex flex-col gap-3">
          <SectionHeader
            title={`Achievements (${unlockedAchievements.length}/${achievements.length})`}
          />

          <div className="flex flex-col gap-2.5">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all shadow-e1",
                  ach.unlocked
                    ? "border-primary/30 bg-primary-soft/30 text-foreground"
                    : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl font-bold text-base",
                    ach.unlocked ? "gradient-saffron text-white shadow-glow" : "bg-muted text-muted-foreground"
                  )}>
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">{ach.title}</h4>
                    <p className="text-xs font-medium text-muted-foreground">{ach.desc}</p>
                  </div>
                </div>

                {ach.unlocked ? (
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success border border-success/30">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BOLA Marathi" },
      { name: "description", content: "Your XP, streaks, badges, completed modules, and learning stats." },
      { property: "og:title", content: "Profile — BOLA Marathi" },
      { property: "og:description", content: "XP, streaks, badges, completed modules, and learning stats." },
    ],
  }),
  component: Profile,
});
