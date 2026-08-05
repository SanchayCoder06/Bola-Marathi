import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  stepText: string;
  topActionText?: string;
  onTopAction?: () => void;
  slideIndex?: number;
  totalSlides?: number;
  heroContent?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
  isSubmitting?: boolean;
  isForm?: boolean;
  onSubmitForm?: (e: React.FormEvent) => void;
}

export function OnboardingLayout({
  stepText,
  topActionText,
  onTopAction,
  slideIndex = 0,
  totalSlides = 3,
  heroContent,
  title,
  description,
  children,
  buttonText,
  onButtonClick,
  isSubmitting = false,
  isForm = false,
  onSubmitForm,
}: OnboardingLayoutProps) {
  const innerContent = (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col justify-between px-5 pb-8 pt-[max(env(safe-area-inset-top),24px)]">
      {/* Top Header Navigation */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">{stepText}</span>
          {topActionText && (
            <button
              type="button"
              onClick={onTopAction}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {topActionText}
            </button>
          )}
        </div>

        {/* Centered Progress Indicator */}
        {totalSlides > 0 && (
          <div className="mt-3 flex w-full gap-1.5 justify-center">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i === slideIndex ? "gradient-saffron shadow-glow" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="my-auto flex w-full flex-col gap-5 pt-4 pb-4">
        {/* Hero Card Area */}
        {heroContent && <div className="w-full">{heroContent}</div>}

        {/* Title and Description */}
        <div className="w-full text-left">
          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Form Fields / Extra Content */}
        {children && <div className="w-full">{children}</div>}
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full">
        <button
          type={isForm ? "submit" : "button"}
          onClick={!isForm ? onButtonClick : undefined}
          disabled={isSubmitting}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl gradient-saffron text-base font-semibold text-white shadow-glow active:scale-[0.98] disabled:opacity-75 transition-transform"
        >
          <span>{buttonText}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  if (isForm) {
    return (
      <form onSubmit={onSubmitForm} className="w-full min-h-screen">
        {innerContent}
      </form>
    );
  }

  return innerContent;
}
