import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Lock, Calendar, Trophy, Flame, ShieldCheck, Mail, MapPin, Award } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui-kit/primitives";
import { user as defaultUser } from "@/lib/data";
import { useAppState } from "@/hooks/useAppState";
import { DatabaseService } from "@/lib/db/databaseService";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — BOLA Marathi" },
      { name: "description", content: "Your BOLA Marathi account details, member status, and credentials." },
      { property: "og:title", content: "Account — BOLA Marathi" },
      { property: "og:description", content: "Your BOLA Marathi account details and member status." },
    ],
  }),
  component: AccountPage,
});

export function AccountPage() {
  const { stats, authUser } = useAppState();
  const [userData, setUserData] = useState({
    name: authUser?.name || defaultUser.name,
    email: authUser?.email || "aarav.sharma@gmail.com",
    avatar: authUser?.avatar || defaultUser.avatar,
    createdAt: "July 2026"
  });

  const [citiesUnlocked, setCitiesUnlocked] = useState(1);
  const [badgesEarned, setBadgesEarned] = useState(3);

  useEffect(() => {
    DatabaseService.getUser().then((u) => {
      setUserData({
        name: authUser?.name || u.name || defaultUser.name,
        email: authUser?.email || u.email || "aarav.sharma@gmail.com",
        avatar: authUser?.avatar || u.avatar || defaultUser.avatar,
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "July 2026"
      });
    });

    DatabaseService.getJourney().then((cities) => {
      const unlockedCount = cities.filter((c) => c.isUnlocked).length;
      setCitiesUnlocked(unlockedCount || 1);
    });

    DatabaseService.getAchievements().then((achievements) => {
      const unlockedCount = achievements.filter((a) => a.unlocked).length;
      setBadgesEarned(unlockedCount || 3);
    });
  }, [authUser]);

  return (
    <AppShell title="Account Details" subtitle="User Credentials & Status" back={true}>
      {/* Account Header Hero Card */}
      <div className="relative overflow-hidden rounded-[28px] gradient-saffron p-5 text-white shadow-glow flex flex-col items-center text-center">
        <img
          src={userData.avatar}
          alt={userData.name}
          loading="lazy"
          decoding="async"
          className="h-20 w-20 rounded-full border-4 border-white/40 bg-card object-cover shadow-e2"
        />
        <h2 className="mt-3 font-display text-2xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{userData.name}</h2>
        <p className="text-xs text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] mt-0.5">{userData.email}</p>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <ShieldCheck size={14} /> Active Student
        </div>
      </div>

      {/* Profile Details Card */}
      <SectionHeader title="Profile Details (Read-only)" />
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <User size={14} className="text-primary" /> Full Name
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate text-xs font-semibold text-foreground">{userData.name}</span>
            <Lock size={12} className="text-muted-foreground shrink-0" title="Read-only" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Mail size={14} className="text-primary" /> Email Address
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate text-xs font-semibold text-foreground max-w-[180px]">{userData.email}</span>
            <Lock size={12} className="text-muted-foreground shrink-0" title="Read-only" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Calendar size={14} className="text-primary" /> Joined Date
          </span>
          <span className="text-xs font-semibold text-foreground">{userData.createdAt}</span>
        </div>
      </div>

      {/* Account Performance Metrics */}
      <SectionHeader title="Account metrics" />
      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-foreground leading-none">Level {stats.level}</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current Level</p>
        </div>

        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-foreground leading-none">{stats.xp} XP</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total XP</p>
        </div>

        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-foreground leading-none">{stats.streakDays} Days</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current Streak</p>
        </div>

        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-foreground leading-none">{citiesUnlocked}/4</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cities Unlocked</p>
        </div>

        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-foreground leading-none">{badgesEarned}</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Badges Earned</p>
        </div>

        <div className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border bg-card p-2.5 text-center shadow-e1">
          <p className="font-display text-lg font-bold text-success leading-none">Active</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
        </div>
      </div>

      <div className="mt-6 pb-6">
        <Link
          to="/settings"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-xs font-semibold text-foreground shadow-e1 hover:bg-muted/40 transition-colors"
        >
          Back to Settings
        </Link>
      </div>
    </AppShell>
  );
}
