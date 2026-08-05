import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Map, MessagesSquare, BookA, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/course", label: "Course", Icon: BookOpen },
  { to: "/journey", label: "Journey", Icon: Map },
  { to: "/conversation", label: "Practice", Icon: MessagesSquare },
  { to: "/dictionary", label: "Words", Icon: BookA },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),16px)]">
      <div className="pointer-events-auto glass mx-4 flex w-full max-w-md items-center justify-between gap-1 rounded-full px-2 py-2 shadow-e3">
        {items.map(({ to, label, Icon }) => {
          const active = pathname === to || (to !== "/course" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 sm:px-3 py-2 text-[10px] font-semibold",
                "transition-[color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.94]",
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute inset-0 -z-10 rounded-full gradient-saffron shadow-glow animate-scale-in" />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 2}
                className={cn(
                  "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  active && "-translate-y-0.5",
                )}
              />
              <span className={cn("tracking-wide transition-opacity", active ? "opacity-100" : "opacity-75")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
