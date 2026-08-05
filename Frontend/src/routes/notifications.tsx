import { createFileRoute } from "@tanstack/react-router";
import { Flame, Trophy, MessagesSquare, Users, BellOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { notifications } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — BOLA Marathi" },
      { name: "description", content: "Streak reminders, achievements, and social updates." },
      { property: "og:title", content: "Notifications" },
      { property: "og:description", content: "Streak reminders, achievements, and updates." },
    ],
  }),
  component: Notifications,
});

const iconMap = { Flame, Trophy, MessagesSquare, Users } as const;
const toneMap: Record<string, string> = {
  primary: "gradient-saffron text-white",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-accent-foreground",
  info: "bg-info text-white",
};

function Notifications() {
  return (
    <AppShell title="Notifications" subtitle="Today" back showNav={false}>
      {notifications.length === 0 ? (
        <div className="mt-24 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <BellOff size={22} />
          </div>
          <p className="mt-3 font-semibold">You're all caught up</p>
          <p className="mt-1 text-xs text-muted-foreground">New updates will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.icon as keyof typeof iconMap];
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-e1">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneMap[n.tone])}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">· {n.time}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
