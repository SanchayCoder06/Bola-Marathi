import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, Bug, Mail, MessageSquare, Star, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — BOLA Marathi" },
      { name: "description", content: "Frequently asked questions, bug reports, and support contacts." },
      { property: "og:title", content: "Help & Support — BOLA Marathi" },
      { property: "og:description", content: "Get support, ask questions, or submit feedback." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I unlock new cities in Maharashtra?",
    a: "Complete all location story missions in your current city to automatically unlock the next city (Mumbai -> Pune -> Nashik -> Nagpur)."
  },
  {
    q: "Does audio speech pronunciation work offline?",
    a: "Yes! BOLA Marathi uses high-performance local Web Speech Synthesis and pre-cached audio utterances for 0ms offline audio playback."
  },
  {
    q: "How do I preserve my daily practice streak?",
    a: "Complete at least 1 lesson, conversation scenario, or daily challenge every 24 hours to keep your streak growing."
  },
  {
    q: "Can I update my email address or avatar?",
    a: "Your account email is read-only after signup for security. You can change your profile avatar anytime from your Profile screen!"
  }
];

export function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [rated, setRated] = useState(false);

  return (
    <AppShell title="Help & Support" subtitle="FAQs & Feedback" back={true}>
      {/* Help Hero Banner */}
      <div className="relative overflow-hidden rounded-[28px] gradient-saffron p-5 text-white shadow-glow flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur-md shadow-e2 mb-2">
          <HelpCircle size={28} />
        </div>
        <h2 className="font-display text-2xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">How can we help?</h2>
        <p className="text-xs text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] mt-0.5">Find answers to common questions or reach out to our team.</p>
      </div>

      {/* Frequently Asked Questions */}
      <SectionHeader title="Frequently Asked Questions" />
      <div className="flex flex-col gap-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div key={idx} className="rounded-2xl border border-border bg-card p-4 shadow-e1 overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-3 text-left font-bold text-xs text-foreground"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={16} className="text-primary shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
              </button>
              {isOpen && (
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground border-t border-border pt-2.5 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Support Actions */}
      <SectionHeader title="Contact & Feedback" />
      <div className="flex flex-col gap-2.5">
        <a
          href="mailto:bugs@bolamarathi.app?subject=BOLA%20Marathi%20Bug%20Report"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-e1 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <Bug size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Report a Bug</p>
              <p className="text-[11px] text-muted-foreground">Let us know if something isn't working right</p>
            </div>
          </div>
        </a>

        <a
          href="mailto:support@bolamarathi.app?subject=BOLA%20Marathi%20Support%20Request"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-e1 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Contact Support</p>
              <p className="text-[11px] text-muted-foreground">Direct email support from the BOLA team</p>
            </div>
          </div>
        </a>

        <a
          href="mailto:feedback@bolamarathi.app?subject=BOLA%20Marathi%20Feature%20Feedback"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-e1 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Send Product Feedback</p>
              <p className="text-[11px] text-muted-foreground">Share ideas for new features or Marathi phrases</p>
            </div>
          </div>
        </a>

        <button
          onClick={() => setRated(true)}
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-e1 hover:border-primary/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/25 text-accent-foreground">
              <Star size={18} className="fill-accent text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Rate BOLA Marathi</p>
              <p className="text-[11px] text-muted-foreground">Support our project with a 5-star rating!</p>
            </div>
          </div>
          {rated ? (
            <span className="flex items-center gap-1 text-xs font-bold text-success">
              <CheckCircle2 size={14} /> Thank you!
            </span>
          ) : (
            <span className="text-xs font-bold text-primary">Rate App</span>
          )}
        </button>
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
