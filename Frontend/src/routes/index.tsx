import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BOLA Marathi — Learn Marathi the RPG way" },
      { name: "description", content: "Story-driven Marathi learning for tourists, students, and professionals." },
      { property: "og:title", content: "BOLA Marathi" },
      { property: "og:description", content: "Learn Marathi through story missions and real conversations." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full gradient-saffron opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "20px 20px" }} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-between px-6 py-16">
        <div />
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="relative mb-6 grid h-28 w-28 place-items-center rounded-[32px] gradient-saffron shadow-glow">
            <span className="font-mr text-5xl font-bold text-white">ब</span>
            <span className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-e2">
              <Sparkles size={16} />
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">BOLA Marathi</h1>
          <p className="mt-2 max-w-[260px] text-sm text-muted-foreground">
            Learn Marathi through stories, culture, and real conversations.
          </p>
        </div>

        <div className="w-full">
          {ready ? (
            <Link
              to="/onboarding"
              className="flex h-14 w-full items-center justify-center rounded-2xl gradient-saffron text-base font-semibold text-white shadow-glow transition-transform active:scale-[0.98]"
            >
              Begin your journey
            </Link>
          ) : (
            <div className="mx-auto h-1.5 w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 gradient-saffron animate-[slide-in-right_1.2s_ease-in-out_infinite]" />
            </div>
          )}
          <p className="mt-4 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
            मराठी शिका · Est. 2026
          </p>
        </div>
      </div>
    </div>
  );
}
