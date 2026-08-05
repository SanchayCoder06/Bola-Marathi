import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Code, ShieldCheck, FileText, ExternalLink, Globe, Heart, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui-kit/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BOLA Marathi" },
      { name: "description", content: "About BOLA Marathi application, build version, open source licenses, and terms." },
      { property: "og:title", content: "About — BOLA Marathi" },
      { property: "og:description", content: "Learn about BOLA Marathi app details, developers, and licenses." },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <AppShell title="About BOLA Marathi" subtitle="App Version & Licenses" back={true}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[28px] gradient-saffron p-6 text-white shadow-glow flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-md shadow-e2 mb-3">
          <Sparkles size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">BOLA Marathi</h2>
        <p className="mt-1 text-xs text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Learn Marathi the RPG Way across Maharashtra</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          Version 1.4.0 · Build 2026.07.22
        </span>
      </div>

      {/* App Details Section */}
      <SectionHeader title="Application info" />
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-e1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Version</span>
          <span className="font-semibold text-foreground">1.4.0 (Production)</span>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-border pt-3">
          <span className="text-muted-foreground">Build Number</span>
          <span className="font-semibold text-foreground font-mono">2026.07.22.RELEASE</span>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-border pt-3">
          <span className="text-muted-foreground">Developer</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            BOLA Team & Google DeepMind <Heart size={12} className="text-secondary fill-secondary" />
          </span>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-border pt-3">
          <span className="text-muted-foreground">Official Website</span>
          <a
            href="https://bolamarathi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
          >
            bolamarathi.app <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Legal & Licenses Section */}
      <SectionHeader title="Legal & Licenses" />
      <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-primary" />
            <div>
              <p className="text-xs font-bold text-foreground">Privacy Policy</p>
              <p className="text-[11px] text-muted-foreground">Local storage encryption & user data protection</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary">Compliant</span>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-primary" />
            <div>
              <p className="text-xs font-bold text-foreground">Terms of Service</p>
              <p className="text-[11px] text-muted-foreground">Usage guidelines for BOLA Marathi RPG suite</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">v1.4</span>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Code size={18} className="text-primary" />
            <div>
              <p className="text-xs font-bold text-foreground">Open Source Libraries</p>
              <p className="text-[11px] text-muted-foreground">React 18, TanStack Router, Vite, Lucide, TailwindCSS</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">MIT License</span>
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
