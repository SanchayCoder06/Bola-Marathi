import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Search, ChevronLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  back?: boolean;
  showNav?: boolean;
  showHeader?: boolean;
  right?: ReactNode;
  className?: string;
}

export function AppShell({
  children,
  title,
  subtitle,
  back = false,
  showNav = true,
  showHeader = true,
  right,
  className,
}: AppShellProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        {showHeader && (
          <header className="sticky top-0 z-30 flex items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),16px)] backdrop-blur-md">
            <div className="absolute inset-0 -z-10 bg-background/70" />
            {back ? (
              <Link
                to="/course"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card shadow-e1"
                aria-label="Back"
              >
                <ChevronLeft size={20} />
              </Link>
            ) : null}
            <div className="min-w-0 flex-1">
              {title && <h1 className="truncate text-lg font-display font-semibold leading-tight">{title}</h1>}
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            {right ?? (
              <div className="flex items-center gap-2">
                <Link to="/translator" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-e1" aria-label="Translator">
                  <Search size={18} />
                </Link>
                <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-e1" aria-label="Notifications">
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary ring-2 ring-card" />
                </Link>
              </div>
            )}
          </header>
        )}
        <main className={cn("flex-1 px-5", showNav ? "pb-32" : "pb-8", className)}>{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
