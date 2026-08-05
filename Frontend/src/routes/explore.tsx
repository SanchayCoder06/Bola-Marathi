import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Utensils, PartyPopper, Landmark, Compass } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, SectionHeader } from "@/components/ui-kit/primitives";
import { cities } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Maharashtra — BOLA Marathi" },
      { name: "description", content: "Discover cities, food, festivals, and culture — all with travel phrases." },
      { property: "og:title", content: "Explore Maharashtra" },
      { property: "og:description", content: "Cities, food, festivals, and travel phrases." },
    ],
  }),
  component: Explore,
});

const tabs = [
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "food", label: "Food", icon: Utensils },
  { id: "festivals", label: "Festivals", icon: PartyPopper },
  { id: "culture", label: "Culture", icon: Landmark },
] as const;

function Explore() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("cities");
  return (
    <AppShell title="Explore Maharashtra" subtitle="Learn Marathi through place">
      {/* Featured */}
      <div className="relative overflow-hidden rounded-[28px] shadow-e3">
        <img src={cities[0].img} alt="Mumbai" className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
            <Compass size={10} /> Featured
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight">Mumbai <span className="font-mr text-xl opacity-80">मुंबई</span></h2>
          <p className="mt-1 text-sm text-white/85 line-clamp-2">Learn the phrases you'll actually use on the local train, at Marine Drive, and in the bustling markets.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="hide-scrollbar mt-5 -mx-5 flex gap-2 overflow-x-auto px-5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                active ? "border-primary bg-primary text-primary-foreground shadow-e1" : "border-border bg-card text-foreground",
              )}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      <SectionHeader title="Cities of Maharashtra" action="Map" />
      <div className="grid grid-cols-2 gap-3">
        {cities.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-e1">
            <div className="relative aspect-[4/3]">
              <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-3 bottom-2 text-white">
                <p className="font-mr text-[11px] opacity-80">{c.tag}</p>
                <p className="font-display text-base font-bold leading-tight">{c.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <p className="text-[11px] text-muted-foreground">{c.subtitle}</p>
              <Chip tone="primary">{c.phrases} phrases</Chip>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Travel phrasebook" action="Open" />
      <div className="rounded-2xl border border-border bg-card p-4 shadow-e1">
        {[
          { mr: "हे किती रुपये?", en: "How much is this?" },
          { mr: "स्टेशन कुठे आहे?", en: "Where is the station?" },
          { mr: "मला मदत हवी.", en: "I need help." },
        ].map((p, i, arr) => (
          <div key={p.mr} className={cn("py-3", i < arr.length - 1 && "border-b border-border")}>
            <p className="font-mr text-lg font-semibold">{p.mr}</p>
            <p className="text-xs text-muted-foreground">{p.en}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
