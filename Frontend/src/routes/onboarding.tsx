import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, User, ShieldCheck, Clock } from "lucide-react";
import { AuthService } from "@/lib/services/authService";
import { DatabaseService } from "@/lib/db/databaseService";

function OnboardingPage() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Onboarding/Login (SSR)");
  } else {
    console.log("[Route Load]: Loading Onboarding/Login (Client)");
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();

  // Check if real OAuth credentials exist in environment
  const hasGoogleOAuth = typeof process !== "undefined" && Boolean(process.env?.VITE_GOOGLE_CLIENT_ID);
  const hasFacebookOAuth = typeof process !== "undefined" && Boolean(process.env?.VITE_FACEBOOK_CLIENT_ID);

  useEffect(() => {
    // If logged-in user exists, auto redirect to Home
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.name) {
      nav({ to: "/course" });
    }
  }, [nav]);

  const handleGoogleLogin = async () => {
    if (!hasGoogleOAuth) return;
    setIsSubmitting(true);
    try {
      const user = await AuthService.loginWithGoogle();
      await DatabaseService.updateUser({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      nav({ to: "/course" });
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!hasFacebookOAuth) return;
    setIsSubmitting(true);
    try {
      const user = await AuthService.loginWithFacebook();
      await DatabaseService.updateUser({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      nav({ to: "/course" });
    } catch (err) {
      console.error("Facebook login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    try {
      const user = await AuthService.loginAsGuest();
      await DatabaseService.updateUser({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      nav({ to: "/course" });
    } catch (err) {
      console.error("Guest login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground justify-between p-6">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full gradient-saffron opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-sm flex-col justify-between py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-saffron text-white shadow-glow">
              <span className="font-mr text-xl font-bold">ब</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground">BOLA Marathi</h1>
              <p className="text-[11px] text-muted-foreground font-medium">Conversational Fluency</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <Sparkles size={13} /> Free Learning
          </span>
        </div>

        {/* Hero Illustration & Welcome Title */}
        <div className="my-auto flex flex-col items-center text-center animate-fade-in py-4">
          <div className="relative grid h-24 w-24 place-items-center rounded-3xl gradient-saffron text-white shadow-glow mb-6">
            <span className="font-mr text-5xl font-extrabold drop-shadow">म</span>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Learn Marathi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium max-w-xs leading-relaxed">
            From absolute beginner to conversational fluency. Duolingo-style 60 structured modules.
          </p>

          {/* Clean 3 Login Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3">

            {/* 1. Continue with Google */}
            <button
              disabled={isSubmitting || !hasGoogleOAuth}
              onClick={handleGoogleLogin}
              className="relative flex h-13 w-full items-center justify-between rounded-2xl border border-border bg-card px-4 text-sm font-bold text-foreground shadow-e2 hover:bg-muted/60 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </div>
              {!hasGoogleOAuth && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  <Clock size={10} /> Coming Soon
                </span>
              )}
            </button>

            {/* 2. Continue with Facebook */}
            <button
              disabled={isSubmitting || !hasFacebookOAuth}
              onClick={handleFacebookLogin}
              className="relative flex h-13 w-full items-center justify-between rounded-2xl bg-[#1877F2] px-4 text-sm font-bold text-white shadow-e2 hover:bg-[#166FE5] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </div>
              {!hasFacebookOAuth && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  <Clock size={10} /> Coming Soon
                </span>
              )}
            </button>

            {/* 3. Continue as Guest (Active & Primary) */}
            <button
              disabled={isSubmitting}
              onClick={handleGuestLogin}
              className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl gradient-saffron p-3.5 text-sm font-bold text-white shadow-glow hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <User size={18} className="shrink-0" />
              <span>Continue as Guest</span>
            </button>

          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-muted-foreground font-medium">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-success" /> Guest mode creates a local profile & saves progress
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Sign In — BOLA Marathi" },
      { name: "description", content: "Learn Marathi from absolute beginner to conversational fluency with structured modules." },
      { property: "og:title", content: "Learn Marathi — BOLA Marathi" },
      { property: "og:description", content: "Duolingo-style structured Marathi learning path." },
    ],
  }),
  component: OnboardingPage,
});
