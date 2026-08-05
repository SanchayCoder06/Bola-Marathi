import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalkthroughStep {
  title: string;
  description: string;
  targetHint: string;
}

const steps: WalkthroughStep[] = [
  {
    title: "Continue Your Lesson",
    description: "Tap here anytime to resume your active RPG location mission in Maharashtra.",
    targetHint: "👉 Continue your lesson here."
  },
  {
    title: "RPG Journey & Cities",
    description: "Explore 4 iconic cities: Mumbai, Pune, Nashik, and Nagpur with 20 unique location missions.",
    targetHint: "👉 Journey contains cities and missions."
  },
  {
    title: "AI Practice with Meera",
    description: "Practice real conversational scenarios, ask grammar questions, and get voice feedback.",
    targetHint: "👉 Practice with AI here."
  },
  {
    title: "Vocabulary Dictionary",
    description: "Look up Marathi words, hear audio pronunciations, and view your saved bookmarks.",
    targetHint: "👉 Dictionary stores learned words."
  },
  {
    title: "Learning Profile",
    description: "Track your total XP, streak days, level progress, and unlocked badges.",
    targetHint: "👉 Profile tracks your progress."
  },
  {
    title: "App Settings",
    description: "Toggle dark theme, adjust audio playback speed, and download offline lesson packs.",
    targetHint: "👉 Settings lets you customize your experience."
  }
];

export function FirstTimeWalkthrough() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    try {
      const completed = localStorage.getItem("bola_walkthrough_completed");
      if (!completed) {
        // Delay 800ms after home mount to show smooth guide
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleFinish = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("bola_walkthrough_completed", "true");
    } catch {}
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isVisible) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in sm:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-primary/40 bg-card p-5 shadow-e3 text-left">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
            <Sparkles size={12} /> Step {currentStepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={handleFinish}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Skip Guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pointer Tag */}
        <div className="mt-4 rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs font-bold text-primary">
          {currentStep.targetHint}
        </div>

        {/* Content */}
        <h3 className="mt-3 font-display text-xl font-bold text-foreground">{currentStep.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{currentStep.description}</p>

        {/* Dots Indicator */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentStepIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-2">
          {currentStepIndex > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-2xl gradient-saffron px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-95 active:scale-95 transition-transform"
          >
            <span>{currentStepIndex === steps.length - 1 ? "Done" : "Next"}</span>
            {currentStepIndex === steps.length - 1 ? <Check size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
