import { cn } from "@/lib/utils";

export function XPRing({
  value,
  size = 72,
  stroke = 8,
  label,
  sublabel,
  className,
}: {
  value: number; // 0-1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = c * (1 - clamped);
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="xp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="60%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke}
          stroke="url(#xp-grad)"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <span className="font-display text-base font-bold leading-none">{label}</span>}
        {sublabel && <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({ value, className, tone = "primary" }: { value: number; className?: string; tone?: "primary" | "success" | "accent" }) {
  const clamped = Math.max(0, Math.min(1, value));
  const toneClass = tone === "success" ? "bg-success" : tone === "accent" ? "bg-accent" : "gradient-saffron";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted/70", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", toneClass)}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

export function Chip({ children, tone = "muted", className }: { children: React.ReactNode; tone?: "muted" | "primary" | "success" | "accent" | "secondary" | "info"; className?: string }) {
  const map = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    success: "bg-success/15 text-success",
    accent: "bg-accent/25 text-accent-foreground",
    secondary: "bg-secondary/15 text-secondary",
    info: "bg-info/15 text-info",
  } as const;
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.005em]", map[tone], className)}>{children}</span>;
}

export function SectionHeader({ title, action, className }: { title: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3 mt-7 flex items-end justify-between", className)}>
      <h2 className="text-[15px] font-display font-semibold tracking-tight">{title}</h2>
      {action && <div className="text-xs font-semibold text-primary transition-opacity hover:opacity-80">{action}</div>}
    </div>
  );
}
