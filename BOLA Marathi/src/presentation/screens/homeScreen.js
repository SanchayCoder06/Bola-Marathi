/**
 * BOLA Marathi — HomeScreen Component
 * Final Precision Polish matching exact design specification
 */

import { AppState } from '../../application/state/appState.js';
import { Router } from '../../application/state/router.js';

/* Helper: time-based greeting */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/* Helper: format number with commas */
const formatNumber = (num) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* Helper: get user name from AppState */
/* Helper: get user name from AppState */
const getUserName = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    // Since there's no user.name in state, return a default or derive from something else
    // For now, return a friendly default - this could be enhanced with actual user profiles later
    return 'Learner';
  } catch {
    return 'Learner';
  }
};

/* Helper: get stats from AppState */
const getStats = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    return state?.stats || { xp: 0, streak: 0, coins: 0, todayMinutes: 0 };
  } catch {
    return { xp: 0, streak: 0, coins: 0, todayMinutes: 0 };
  }
};

/* Helper: get current theme */
const getTheme = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    return state?.settings?.theme || 'light';
  } catch {
    return 'light';
  }
};

/* Helper: get current lesson data */
const getCurrentLesson = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    // Try to get current lesson from progress or lessons data
    // For now, return a default - this should be enhanced to track actual current lesson
    return {
      id: 'lesson-1',
      title: 'Basic Greetings & Namaskar',
      progress: 0 // Default to 0, should be calculated from actual progress
    };
  } catch {
    return {
      id: 'lesson-1',
      title: 'Basic Greetings & Namaskar',
      progress: 0
    };
  }
};

/* Helper: get daily goal XP stats */
const getDailyGoal = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    // Calculate daily goal based on today's minutes or fetch from goals/settings
    const todayMinutes = state?.stats?.todayMinutes || 0;
    const dailyGoal = Math.min(60, Math.max(15, todayMinutes + 30)); // Dynamic goal based on progress
    return { today: todayMinutes, goal: dailyGoal };
  } catch {
    return { today: 0, goal: 30 };
  }
};

/* Helper: get recent lessons */
const getRecentLessons = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    // Get recently completed lessons/chapters from state
    const completedChapters = state?.rpg?.completedChapters || [];
    const completedScenarios = state?.rpg?.completedScenarios || [];

    // Convert completed items to lesson format for display
    const recentItems = [];

    // Add recently completed chapters (limit to 3 most recent)
    const recentChapters = completedChapters.slice(-3).map((chapterId, index) => ({
      id: `chapter-${chapterId}`,
      title: chapterId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      completed: true,
      progress: 100
    }));

    // Add recently completed scenarios
    const recentScenarios = completedScenarios.slice(-3).map((scenarioId, index) => ({
      id: `scenario-${scenarioId}`,
      title: scenarioId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      completed: true,
      progress: 100
    }));

    // Combine and sort by most recent (simple approach: just take last 3 from each)
    const allRecent = [...recentChapters, ...recentScenarios].slice(-3);

    // If we don't have enough recent items, add some defaults
    if (allRecent.length === 0) {
      return [
        { id: 'r1', title: 'Numbers 1–10 (संख्या)', completed: false, progress: 0 },
        { id: 'r2', title: 'Food & Dining (जेवण)', completed: false, progress: 0 },
        { id: 'r3', title: 'Transport & Auto Rickshaw (वाहन)', completed: false, progress: 0 }
      ];
    }

    return allRecent;
  } catch {
    return [
      { id: 'r1', title: 'Numbers 1–10 (संख्या)', completed: false, progress: 0 },
      { id: 'r2', title: 'Food & Dining (जेवण)', completed: false, progress: 0 },
      { id: 'r3', title: 'Transport & Auto Rickshaw (वाहन)', completed: false, progress: 0 }
    ];
  }
};

export const HomeScreen = {
  async render(container) {
    if (!container) return;

    // Inject Precision Polish Scoped CSS
    if (!document.getElementById('home-screen-precision-style')) {
      const style = document.createElement('style');
      style.id = 'home-screen-precision-style';
      style.textContent = `
        /* Design Tokens */
        :root {
          /* 8-point spacing system */
          --space-0: 0px;
          --space-1: 4px;
          --space-2: 8px;
          --space-3: 12px;
          --space-4: 16px;
          --space-5: 24px;
          --space-6: 32px;
          --space-7: 40px;
          --space-8: 48px;
          --space-9: 56px;
          --space-10: 64px;

          /* Border radius */
          --radius-xs: 8px;
          --radius-sm: 12px;
          --radius-md: 16px;
          --radius-lg: 20px;
          --radius-xl: 24px;
          --radius-2xl: 28px;

          /* Typography */
          --font-size-xs: 0.8125rem; /* 13px */
          --font-size-sm: 0.9375rem; /* 15px */
          --font-size-base: 1.125rem; /* 18px */
          --font-size-lg: 1.5rem; /* 24px */
          --font-size-xl: 2.25rem; /* 36px */
          --font-weight-light: 300;
          --font-weight-normal: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --font-weight-extrabold: 800;
          --font-family-heading: 'Poppins', 'Baloo 2', sans-serif;
          --font-family-body: 'Noto Sans Marathi', sans-serif;
          --font-family-numbers: 'Inter', sans-serif;

          /* Transitions */
          --transition-fast: 0.15s ease;
          --transition-moderate: 0.2s ease;
          --transition-slow: 0.3s ease;
          --transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

          /* Shadows (Material 3 elevation) */
          --shadow-elevation-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          --shadow-elevation-2: 0 2px 4px -1px rgba(0,0,0,0.1), 0 4px 5px 0px rgba(0,0,0,0.14), 0 1px 10px 0px rgba(0,0,0,0.12);
          --shadow-elevation-3: 0 3px 8px -2px rgba(0,0,0,0.1), 0 6px 10px -4px rgba(0,0,0,0.13), 0 1px 5px 0px rgba(0,0,0,0.2);
          --shadow-elevation-4: 0 4px 11px -3px rgba(0,0,0,0.1), 0 8px 16px -6px rgba(0,0,0,0.13), 0 2px 6px 0px rgba(0,0,0,0.2);
          --shadow-elevation-5: 0 5px 14px -4px rgba(0,0,0,0.1), 0 10px 20px -8px rgba(0,0,0,0.14), 0 3px 6px 0px rgba(0,0,0,0.2);

          /* Component transitions */
          --transition-card: transform var(--transition-moderate), box-shadow var(--transition-moderate);
          --transition-button: transform var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast);
          --transition-icon: transform var(--transition-fast), opacity var(--transition-fast);
        }

        /* Color Palette */
        .theme-light {
          --color-bg-page: #FFF8F2;
          --color-bg-card: #FFFFFF;
          --color-bg-overlay: rgba(255, 249, 242, 0.9);
          --color-primary: #FF8A00;
          --color-primary-light: #FFC233;
          --color-secondary: #FF6B35;
          --color-accent: #FFC233;
          --color-success: #22C55E;
          --color-text-primary: #1E293B;
          --color-text-secondary: #64748B;
          --color-border: #F1F5F9;
          --color-ring-bg: #F1F5F9;
          --color-ring-fill: #FF8A00;
          --color-progress-track: #F1F5F9;
          --color-progress-fill: linear-gradient(90deg, #16A34A 0%, #22C55E 100%);
          --color-icon-badge-bg: #FFF5EB;
          --color-icon-badge-border: rgba(255, 138, 0, 0.2);
          --color-streak-pill-bg: #FFF3E0;
          --color-streak-pill-border: rgba(255, 138, 0, 0.2);
          --color-streak-pill-text: #FF8A00;
          --color-quick-learn-bg: #FFF5EB;
          --color-quick-learn-icon-bg: #FFE8D6;
          --color-quick-dict-bg: #F5F3FF;
          --color-quick-dict-icon-bg: #ECE9FE;
          --color-quick-practice-bg: #F0FDF4;
          --color-quick-practice-icon-bg: #DCFCE7;
          --color-quick-explore-bg: #F0F9FF;
          --color-quick-explore-icon-bg: #E0F2FE;
          --color-fab-bg: #FFFFFF;
          --color-fab-icon: #FF8A00;
          --color-fab-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
          --color-shadow-overlay: rgba(0, 0, 0, 0.25);
          --color-hover-overlay: rgba(0, 0, 0, 0.04);
          --color-pressed-overlay: rgba(0, 0, 0, 0.08);
          --color-disabled: rgba(0, 0, 0, 0.26);
        }

        .theme-dark {
          --color-bg-page: #0B1020;
          --color-bg-card: #151C2E;
          --color-bg-overlay: rgba(11, 16, 32, 0.9);
          --color-primary: #FF8A00;
          --color-primary-light: #FFC233;
          --color-secondary: #FF6B35;
          --color-accent: #FFC233;
          --color-success: #22C55E;
          --color-text-primary: #F8FAFC;
          --color-text-secondary: #94A3B8;
          --color-border: rgba(255, 255, 255, 0.08);
          --color-ring-bg: rgba(255, 255, 255, 0.08);
          --color-ring-fill: #FF8A00;
          --color-progress-track: rgba(255, 255, 255, 0.08);
          --color-progress-fill: linear-gradient(90deg, #FF8A00 0%, #FF6B35 100%);
          --color-icon-badge-bg: rgba(255, 194, 51, 0.15);
          --color-icon-badge-border: rgba(255, 194, 51, 0.25);
          --color-streak-pill-bg: rgba(255, 138, 0, 0.15);
          --color-streak-pill-border: rgba(255, 138, 0, 0.3);
          --color-streak-pill-text: #FF8A00;
          --color-quick-learn-bg: #161F33;
          --color-quick-learn-icon-bg: rgba(255, 138, 0, 0.2);
          --color-quick-dict-bg: #161F33;
          --color-quick-dict-icon-bg: rgba(139, 92, 246, 0.2);
          --color-quick-practice-bg: #161F33;
          --color-quick-practice-icon-bg: rgba(22, 163, 74, 0.2);
          --color-quick-explore-bg: #161F33;
          --color-quick-explore-icon-bg: rgba(2, 132, 199, 0.2);
          --color-fab-bg: #1E293B;
          --color-fab-icon: #FFC107;
          --color-fab-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
          --color-shadow-overlay: rgba(0, 0, 0, 0.25);
          --color-hover-overlay: rgba(255, 255, 255, 0.04);
          --color-pressed-overlay: rgba(255, 255, 255, 0.08);
          --color-disabled: rgba(255, 255, 255, 0.26);
        }

        /* Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 16px;
          scroll-behavior: smooth;
        }

        body {
          font-family: var(--font-family-body);
          color: var(--color-text-primary);
          background-color: var(--color-bg-page);
        }

        /* Utility Classes */
        .text-primary { color: var(--color-text-primary); }
        .text-secondary { color: var(--color-text-secondary); }
        .text-primary-content { color: var(--color-primary); }
        .bg-primary { background-color: var(--color-primary); }
        .bg-card { background-color: var(--color-bg-card); }
        .bg-page { background-color: var(--color-bg-page); }

        /* Container & Wrapper */
        .hs-container {
          width: 100%;
          min-height: 100vh;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
          padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
          background-color: var(--color-bg-page);
          color: var(--color-text-primary);
          transition: background-color var(--transition-slow), color var(--transition-slow);
          overflow-x: hidden;
        }

        .theme-dark .hs-container {
          background-color: var(--color-bg-page);
          color: var(--color-text-primary);
        }

        .hs-wrapper {
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
          padding: 0 var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .fade-in {
          animation: fadeIn var(--transition-moderate) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(var(--space-2)); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 1. HERO BANNER */
        .hs-hero-banner {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: url('assets/illustrations/home/hero-maharashtra.png?v=99') center/cover no-repeat;
          box-shadow: var(--shadow-elevation-4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border: 1px solid var(--color-border);
          box-sizing: border-box;
        }

        .hs-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255, 249, 242, 0.96) 0%, rgba(255, 249, 242, 0.8) 42%, rgba(255, 249, 242, 0) 90%);
          z-index: 1;
        }

        .theme-dark .hs-hero-overlay {
          background: linear-gradient(90deg, rgba(11, 16, 32, 0.96) 0%, rgba(11, 16, 32, 0.8) 42%, rgba(11, 16, 32, 0) 90%);
        }

        .hs-hero-badge {
          position: relative;
          z-index: 2;
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: calc(var(--space-1) / 2) var(--space-2);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 138, 0, 0.3);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-extrabold);
          letter-spacing: 0.8px;
          color: var(--color-primary);
          box-shadow: var(--shadow-elevation-1);
        }

        .theme-dark .hs-hero-badge {
          background: rgba(15, 23, 42, 0.85);
          border-color: rgba(255, 138, 0, 0.35);
        }

        .hs-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-primary);
          box-shadow: 0 0 8px var(--color-primary);
        }

        .hs-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .hs-hero-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.2;
          font-family: var(--font-family-heading);
        }

        .theme-dark .hs-hero-title { color: var(--color-text-primary); }

        .theme-dark .hs-hero-banner { border-color: var(--color-border); }

        .hs-highlight {
          color: var(--color-primary);
        }

        .hs-hero-subtitle {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: var(--space-1) 0 var(--space-3) 0;
          line-height: 1.4;
        }

        .theme-dark .hs-hero-subtitle { color: var(--color-text-secondary); }

        .hs-btn-hero {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          height: 3.25rem; /* 52px */
          padding: 0 var(--space-4);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #FFFFFF;
          font-size: 1rem; /* 16px */
          font-weight: var(--font-weight-bold);
          border: none;
          border-radius: 1.125rem; /* 18px */
          cursor: pointer;
          box-shadow: var(--shadow-elevation-3);
          transition: var(--transition-button);
          font-family: var(--font-family-heading);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .hs-btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(255, 138, 0, 0.5);
        }

        .hs-btn-hero:active {
          transform: scale(0.96);
        }

        .hs-btn-hero:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .hs-btn-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          border-radius: inherit;
        }

        .hs-btn-hero:active::after {
          opacity: 0.4;
        }

        /* 2. DAILY PROGRESS CARD */
        .hs-daily-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-2xl);
          padding: var(--space-4);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-elevation-2);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          box-sizing: border-box;
        }

        .theme-dark .hs-daily-card {
          background: var(--color-bg-card);
          border-color: var(--color-border);
          box-shadow: var(--shadow-elevation-4);
        }

        .hs-daily-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding-bottom: var(--space-3);
        }

        .theme-dark .hs-daily-header {
          border-bottom-color: rgba(255, 255, 255, 0.06);
        }

        .hs-daily-title-group {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .hs-icon-badge {
          width: 3rem; /* 48px */
          height: 3rem; /* 48px */
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--color-icon-badge-bg);
          border: 1px solid var(--color-icon-badge-border);
        }

        .theme-dark .hs-icon-badge {
          background: var(--color-icon-badge-bg);
          border-color: var(--color-icon-badge-border);
        }

        .hs-illustration-icon {
          width: 2.125rem; /* 34px */
          height: 2.125rem; /* 34px */
          object-fit: contain;
        }

        .hs-card-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .theme-dark .hs-card-title { color: var(--color-text-primary); }

        .hs-card-subtitle {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          margin: var(--space-1) 0 0 0;
        }

        .theme-dark .hs-card-subtitle { color: var(--color-text-secondary); }

        .hs-streak-pill {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          background: var(--color-streak-pill-bg);
          border: 1px solid var(--color-streak-pill-border);
          border-radius: 1.25rem; /* 20px */
          font-size: 0.82rem;
          font-weight: var(--font-weight-bold);
          color: var(--color-streak-pill-text);
        }

        .theme-dark .hs-streak-pill {
          background: var(--color-streak-pill-bg);
          border-color: var(--color-streak-pill-border);
        }

        .hs-daily-stats-row {
          display: flex;
          align-items: center;
          gap: var(--space-5);
        }

        .hs-progress-ring-container {
          position: relative;
          width: 6.25rem; /* 100px */
          height: 6.25rem; /* 100px */
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hs-progress-ring {
          transform: rotate(-90deg);
        }

        .hs-ring-bg {
          fill: none;
          stroke: var(--color-ring-bg);
          stroke-width: 0.5rem; /* 8px */
        }

        .theme-dark .hs-ring-bg {
          stroke: var(--color-ring-bg);
        }

        .hs-ring-fill {
          fill: none;
          stroke: var(--color-ring-fill);
          stroke-width: 0.5rem; /* 8px */
          stroke-linecap: round;
          stroke-dasharray: 251.2;
          stroke-dashoffset: 251.2;
          transition: stroke-dashoffset 0.8s ease-in-out;
        }

        .hs-progress-ring-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hs-ring-val {
          font-size: 1.125rem; /* 18px */
          font-weight: var(--font-weight-extrabold);
          color: var(--color-text-primary);
        }

        .theme-dark .hs-ring-val { color: var(--color-text-primary); }

        .hs-ring-lbl {
          font-size: 0.65rem;
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
        }

        .theme-dark .hs-ring-lbl { color: var(--color-text-secondary); }

        .hs-daily-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .hs-detail-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-0);
        }

        .hs-detail-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          font-weight: var(--font-weight-medium);
        }

        .theme-dark .hs-detail-label { color: var(--color-text-secondary); }

        .hs-detail-value {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
        }

        .theme-dark .hs-detail-value { color: var(--color-text-primary); }

        .hs-text-saffron {
          color: var(--color-primary);
        }

        .hs-progress-bar-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .hs-flex-grow {
          flex: 1;
        }

        .hs-progress-bar-track {
          flex: 1;
          height: 0.625rem; /* 10px */
          background: var(--color-progress-track);
          border-radius: 0.625rem; /* 10px */
          overflow: hidden;
        }

        .theme-dark .hs-progress-bar-track {
          background: var(--color-progress-track);
        }

        .hs-progress-bar-fill {
          height: 100%;
          background: var(--color-progress-fill);
          border-radius: 0.625rem; /* 10px */
          transition: width 0.5s ease-out;
        }

        .hs-progress-pct {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: var(--color-success);
        }

        /* 3. QUICK ACTIONS GRID */
        .hs-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .hs-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hs-section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-text-primary);
          margin: 0;
          font-family: var(--font-family-heading);
        }

        .theme-dark .hs-section-title { color: var(--color-text-primary); }

        .hs-link-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 0.85rem;
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          transition: opacity var(--transition-fast);
        }

        .hs-link-btn:hover {
          opacity: 0.8;
        }

        .hs-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .hs-quick-btn {
          height: 7.25rem; /* 116px */
          border-radius: var(--radius-xl);
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
          cursor: pointer;
          box-shadow: var(--shadow-elevation-1);
          transition: var(--transition-card);
          box-sizing: border-box;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
        }

        .hs-quick-btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-elevation-2);
        }

        .hs-quick-btn:active {
          transform: scale(0.96);
        }

        .hs-quick-icon-wrapper {
          width: 3.125rem; /* 50px */
          height: 3.125rem; /* 50px */
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Quick Action Tinted Backgrounds (Light Theme) */
        .hs-quick-learn {
          background: #FFF5EB;
          border: 1px solid rgba(255, 138, 0, 0.2);
        }
        .hs-quick-learn .hs-quick-icon-wrapper { background: #FFE8D6; color: #FF8A00; }
        .hs-quick-learn .hs-quick-label { color: #9A3412; }
        .hs-quick-learn .hs-quick-sub { color: #EA580C; }

        .hs-quick-dict {
          background: #F5F3FF;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        .hs-quick-dict .hs-quick-icon-wrapper { background: #ECE9FE; color: #7C3AED; }
        .hs-quick-dict .hs-quick-label { color: #5B21B6; }
        .hs-quick-dict .hs-quick-sub { color: #7C3AED; }

        .hs-quick-practice {
          background: #F0FDF4;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }
        .hs-quick-practice .hs-quick-icon-wrapper { background: #DCFCE7; color: #16A34A; }
        .hs-quick-practice .hs-quick-label { color: #166534; }
        .hs-quick-practice .hs-quick-sub { color: #16A34A; }

        .hs-quick-explore {
          background: #F0F9FF;
          border: 1px solid rgba(2, 132, 199, 0.2);
        }
        .hs-quick-explore .hs-quick-icon-wrapper { background: #E0F2FE; color: #0284C7; }
        .hs-quick-explore .hs-quick-label { color: #075985; }
        .hs-quick-explore .hs-quick-sub { color: #0284C7; }

        /* Dark Mode Action Cards */
        .theme-dark .hs-quick-btn {
          background: var(--color-bg-card);
        }
        .theme-dark .hs-quick-learn { border-color: rgba(255, 138, 0, 0.25); }
        .theme-dark .hs-quick-learn .hs-quick-label { color: var(--color-text-primary); }
        .theme-dark .hs-quick-learn .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-dict { border-color: rgba(139, 92, 246, 0.25); }
        .theme-dark .hs-quick-dict .hs-quick-label { color: var(--color-text-primary); }
        .theme-dark .hs-quick-dict .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-practice { border-color: rgba(46, 213, 115, 0.25); }
        .theme-dark .hs-quick-practice .hs-quick-label { color: var(--color-text-primary); }
        .theme-dark .hs-quick-practice .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-explore { border-color: rgba(0, 210, 255, 0.25); }
        .theme-dark .hs-quick-explore .hs-quick-label { color: var(--color-text-primary); }
        .theme-dark .hs-quick-explore .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .hs-quick-label {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
        }

        .theme-dark .hs-quick-label { color: var(--color-text-primary); }

        .hs-quick-sub {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }

        .theme-dark .hs-quick-sub { color: var(--color-text-secondary); }

        /* 4. CONTINUE LEARNING CARD */
        .hs-continue-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-2xl);
          padding: var(--space-3);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-elevation-1);
          box-sizing: border-box;
        }

        .theme-dark .hs-continue-card {
          background: var(--color-bg-card);
          border-color: var(--color-border);
          box-shadow: var(--shadow-elevation-3);
        }

        .hs-continue-inner {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .hs-continue-media {
          width: 6.25rem; /* 100px */
          height: 6.25rem; /* 100px */
          border-radius: var(--radius-lg);
          background: var(--color-quick-learn-bg);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-icon-badge-border);
        }

        .hs-continue-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hs-continue-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .hs-continue-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-0);
        }

        .hs-pill-badge {
          align-self: flex-start;
          padding: calc(var(--space-1) / 2) var(--space-1);
          background: var(--color-streak-pill-bg);
          border-radius: 0.625rem; /* 10px */
          font-size: 0.7rem;
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
          text-transform: uppercase;
        }

        .hs-continue-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .theme-dark .hs-continue-title { color: var(--color-text-primary); }

        .hs-continue-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.38;
        }

        .theme-dark .hs-continue-desc { color: var(--color-text-secondary); }

        .hs-continue-footer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-1);
        }

        .hs-btn-accent {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          height: 3rem; /* 48px */
          padding: 0 var(--space-3);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #FFFFFF;
          font-size: 0.88rem;
          font-weight: var(--font-weight-bold);
          border: none;
          border-radius: 0.875rem; /* 14px */
          cursor: pointer;
          box-shadow: var(--shadow-elevation-2);
          transition: var(--transition-button);
          white-space: nowrap;
        }

        .hs-btn-accent:hover { transform: translateY(-2px); }
        .hs-btn-accent:active { transform: scale(0.96); }

        /* 5. EXPLORE MAHARASHTRA CARD (SPLIT LAYOUT) */
        .hs-explore-split-card {
          display: flex;
          align-items: center;
          background: var(--color-bg-card);
          border-radius: var(--radius-2xl);
          border: 1px solid rgba(255, 138, 0, 0.15);
          padding: var(--space-4);
          gap: var(--space-4);
          overflow: hidden;
          box-shadow: var(--shadow-elevation-1);
          transition: background var(--transition-slow);
        }

        .theme-dark .hs-explore-split-card {
          background: var(--color-bg-card);
          border-color: var(--color-border);
          box-shadow: var(--shadow-elevation-4);
        }

        .hs-explore-split-content {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .hs-explore-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-text-primary);
          margin: 0;
          font-family: var(--font-family-heading);
        }

        .theme-dark .hs-explore-title { color: var(--color-text-primary); }

        .hs-explore-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .theme-dark .hs-explore-desc { color: var(--color-text-secondary); }

        .hs-btn-explore {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          margin-top: var(--space-0);
          height: 3.25rem; /* 52px */
          padding: 0 var(--space-3);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #FFFFFF;
          border: none;
          font-size: 0.88rem;
          font-weight: var(--font-weight-bold);
          border-radius: 0.875rem; /* 14px */
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 138, 0, 0.12);
          transition: var(--transition-button);
        }

        .theme-dark .hs-btn-explore {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: #FFFFFF;
          border: none;
        }

        .hs-btn-explore:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.05);
        }

        .hs-explore-split-media {
          flex: 1;
          height: 10rem; /* 160px */
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hs-explore-split-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* 6. RECENT LESSONS */
        .hs-recent-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .hs-recent-row {
          height: 4.25rem; /* 68px */
          background: var(--color-bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: 0 var(--space-3);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          cursor: pointer;
          box-shadow: var(--shadow-elevation-1);
          transition: transform var(--transition-fast), background var(--transition-fast);
          box-sizing: border-box;
        }

        .theme-dark .hs-recent-row {
          background: var(--color-bg-card);
          border-color: var(--color-border);
          box-shadow: var(--shadow-elevation-3);
        }

        .hs-recent-row:hover {
          transform: translateX(var(--space-1));
        }

        .hs-recent-icon-badge {
          width: 2.75rem; /* 44px */
          height: 2.75rem; /* 44px */
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hs-badge-completed {
          background: #DCFCE7;
          color: #22C55E;
        }

        .hs-badge-progress {
          background: #FFF5EB;
          color: #FF8A00;
        }

        .hs-recent-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-0);
        }

        .hs-recent-title {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .theme-dark .hs-recent-title { color: var(--color-text-primary); }

        .hs-recent-status {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
        }

        .hs-status-complete { color: #22C55E; }
        .hs-status-active { color: #FF8A00; }

        .hs-recent-action {
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hs-recent-action svg {
          width: 1.25rem; /* 20px */
          height: 1.25rem; /* 20px */
        }

        /* FLOATING DAY / NIGHT MODE THEME TOGGLE FAB */
        .hs-theme-fab {
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
          right: env(safe-area-inset-right) + var(--space-3);
          width: 3.25rem; /* 52px */
          height: 3.25rem; /* 52px */
          border-radius: 50%;
          background: var(--color-fab-bg);
          border: 1px solid var(--color-border);
          box-shadow: var(--color-fab-shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          transition: transform var(--transition-bounce), box-shadow var(--transition-moderate), background var(--transition-moderate);
          color: var(--color-fab-icon);
        }

        .theme-dark .hs-theme-fab {
          background: var(--color-fab-bg);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--color-fab-icon);
          box-shadow: var(--color-fab-shadow);
        }

        .hs-theme-fab:hover {
          transform: scale(1.1) rotate(15deg);
        }

        .hs-theme-fab:active {
          transform: scale(0.95);
        }
      `;
      document.head.appendChild(style);
    }

    const currentTheme = getTheme();
    const greeting = getGreeting();
    const userName = getUserName();
    const stats = getStats();
    const currentLesson = getCurrentLesson();
    const daily = getDailyGoal();
    const recentLessons = getRecentLessons();

    // Apply document theme class
    document.documentElement.className = currentTheme === 'light' ? 'theme-light' : 'theme-dark';

    container.innerHTML = `
      <div class="hs-container fade-in">
        <div class="hs-wrapper">

          <!-- 1. HERO BANNER -->
          <section class="hs-hero-banner">
            <div class="hs-hero-overlay"></div>
            <div class="hs-hero-badge">
              <span class="hs-badge-dot"></span>
              <span>BOLA MARATHI • बोला मराठी</span>
            </div>
            <div class="hs-hero-content">
              <h1 class="hs-hero-title">${greeting}, <span class="hs-highlight">${userName}! 👋</span></h1>
              <p class="hs-hero-subtitle">Master Marathi through real-life RPG story missions.</p>
              <button id="btnHeroContinue" class="hs-btn-hero">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Continue Learning</span>
              </button>
            </div>
          </section>

          <!-- 2. DAILY PROGRESS CARD -->
          <section class="hs-card hs-daily-card">
            <div class="hs-daily-header">
              <div class="hs-daily-title-group">
                <div class="hs-icon-badge">
                  <img src="assets/illustrations/home/daily-goal.png" alt="Daily Goal" class="hs-illustration-icon" />
                </div>
                <div>
                  <h2 class="hs-card-title">Daily Progress</h2>
                  <p class="hs-card-subtitle">Keep up your learning momentum!</p>
                </div>
              </div>
              <div class="hs-streak-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/>
                </svg>
                <span>${stats.streak || 7} Days Streak</span>
              </div>
            </div>

            <div class="hs-daily-body">
              <div class="hs-daily-stats-row">
                <div class="hs-progress-ring-container">
                  <svg class="hs-progress-ring" width="100" height="100" viewBox="0 0 100 100">
                    <circle class="hs-ring-bg" cx="50" cy="50" r="40" />
                    <circle id="dailyProgressCircle" class="hs-ring-fill" cx="50" cy="50" r="40" />
                  </svg>
                  <div class="hs-progress-ring-text">
                    <span id="dailyProgressText" class="hs-ring-val">${daily.today}/${daily.goal}</span>
                    <span class="hs-ring-lbl">XP TODAY</span>
                  </div>
                </div>

                <div class="hs-daily-details">
                  <div class="hs-detail-item">
                    <span class="hs-detail-label">Current Lesson</span>
                    <span class="hs-detail-value">${currentLesson.title}</span>
                  </div>
                  <div class="hs-detail-item">
                    <span class="hs-detail-label">Total XP Earned</span>
                    <span class="hs-detail-value hs-text-saffron">${formatNumber(stats.xp || 523)} XP</span>
                  </div>
                  <div class="hs-detail-item">
                    <span class="hs-detail-label">Lesson Completion</span>
                    <div class="hs-progress-bar-group">
                      <div class="hs-progress-bar-track">
                        <div class="hs-progress-bar-fill" style="width: ${currentLesson.progress}%;"></div>
                      </div>
                      <span class="hs-progress-pct">${currentLesson.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. QUICK ACTIONS GRID -->
          <section class="hs-section">
            <h3 class="hs-section-title">Quick Actions</h3>
            <div class="hs-quick-grid">
              <button id="btnQuickLearn" class="hs-quick-btn hs-quick-learn" data-target="#journey">
                <div class="hs-quick-icon-wrapper">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <span class="hs-quick-label">Learn</span>
                <span class="hs-quick-sub">RPG Missions</span>
              </button>

              <button id="btnQuickDict" class="hs-quick-btn hs-quick-dict" data-target="#dictionary">
                <div class="hs-quick-icon-wrapper">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <span class="hs-quick-label">Dictionary</span>
                <span class="hs-quick-sub">Vocabulary</span>
              </button>

              <button id="btnQuickPractice" class="hs-quick-btn hs-quick-practice" data-target="#practice">
                <div class="hs-quick-icon-wrapper">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <span class="hs-quick-label">Practice</span>
                <span class="hs-quick-sub">Minigames</span>
              </button>

              <button id="btnQuickExplore" class="hs-quick-btn hs-quick-explore" data-target="#journey">
                <div class="hs-quick-icon-wrapper">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <span class="hs-quick-label">Explore</span>
                <span class="hs-quick-sub">Cities & Culture</span>
              </button>
            </div>
          </section>

          <!-- 4. CONTINUE LEARNING CARD -->
          <section class="hs-card hs-continue-card">
            <div class="hs-continue-inner">
              <div class="hs-continue-media">
                <img src="assets/illustrations/home/continue-learning.png" alt="Continue Learning" class="hs-continue-img" />
              </div>
              <div class="hs-continue-info">
                <div class="hs-continue-header">
                  <span class="hs-pill-badge">NEXT STEP</span>
                  <h3 class="hs-continue-title">${currentLesson.title}</h3>
                </div>
                <p class="hs-continue-desc">Master essential Marathi greetings, formal introductions, and polite phrases.</p>
                <div class="hs-continue-footer">
                  <div class="hs-progress-bar-group hs-flex-grow">
                    <div class="hs-progress-bar-track">
                      <div class="hs-progress-bar-fill" style="width: ${currentLesson.progress}%;"></div>
                    </div>
                    <span class="hs-progress-pct">${currentLesson.progress}%</span>
                  </div>
                  <button id="btnContinueCard" class="hs-btn-accent">
                    <span>Continue</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 5. EXPLORE MAHARASHTRA CARD -->
          <section class="hs-explore-split-card">
            <div class="hs-explore-split-content">
              <h3 class="hs-explore-title">Explore Maharashtra</h3>
              <p class="hs-explore-desc">Discover regional lessons, cultural insights, and real-life conversations from Pune, Mumbai, Nashik, and beyond.</p>
              <button id="btnExploreCard" class="hs-btn-explore">
                <span>Start Exploring</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            <div class="hs-explore-split-media">
              <img src="assets/illustrations/explore/explore-maharashtra.png" alt="Explore Maharashtra" class="hs-explore-split-img" />
            </div>
          </section>

          <!-- 6. RECENT LESSONS -->
          <section class="hs-section">
            <div class="hs-section-header">
              <h3 class="hs-section-title">Recent Lessons</h3>
              <button id="btnViewAllLessons" class="hs-link-btn">View All</button>
            </div>
            <div class="hs-recent-list">
              ${recentLessons.map(lesson => `
                <div class="hs-recent-row" data-id="${lesson.id}">
                  <div class="hs-recent-icon-badge ${lesson.completed ? 'hs-badge-completed' : 'hs-badge-progress'}">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      ${lesson.completed
                        ? '<polyline points="20 6 9 17 4 12"></polyline>'
                        : '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline>'}
                    </svg>
                  </div>
                  <div class="hs-recent-main">
                    <h4 class="hs-recent-title">${lesson.title}</h4>
                    <span class="hs-recent-status ${lesson.completed ? 'hs-status-complete' : 'hs-status-active'}">
                      ${lesson.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div class="hs-recent-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

        </div>
      </div>

      <!-- FLOATING DAY / NIGHT MODE THEME TOGGLE FAB -->
      <button id="hsThemeFab" class="hs-theme-fab" title="Toggle Day / Night Mode">
        ${currentTheme === 'light' ? `
          <!-- Moon Icon for switching to Dark Mode -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ` : `
          <!-- Sun Icon for switching to Day Mode -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `}
      </button>
    `;

    // Animate progress ring
    this.initDailyProgress();

    // Bind navigation & button events
    this.bindEvents();
  },

  initDailyProgress() {
    const daily = getDailyGoal();
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (daily.today / daily.goal) * circumference;
    const circle = document.getElementById('dailyProgressCircle');
    if (circle) {
      circle.style.strokeDashoffset = `${offset}`;
    }
  },

  bindEvents() {
    const navTo = (hash) => {
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate(hash);
      } else {
        window.location.hash = hash;
      }
    };

    // Hero Continue button
    document.getElementById('btnHeroContinue')?.addEventListener('click', () => navTo('#journey'));

    // Continue Learning Card button
    document.getElementById('btnContinueCard')?.addEventListener('click', () => navTo('#journey'));

    // Explore Card button
    document.getElementById('btnExploreCard')?.addEventListener('click', () => navTo('#journey'));

    // View All Lessons button
    document.getElementById('btnViewAllLessons')?.addEventListener('click', () => navTo('#journey'));

    // Quick Action buttons
    document.getElementById('btnQuickLearn')?.addEventListener('click', () => navTo('#journey'));
    document.getElementById('btnQuickDict')?.addEventListener('click', () => navTo('#dictionary'));
    document.getElementById('btnQuickPractice')?.addEventListener('click', () => navTo('#practice'));
    document.getElementById('btnQuickExplore')?.addEventListener('click', () => navTo('#journey'));

    // Recent lesson rows
    document.querySelectorAll('.hs-recent-row').forEach(row => {
      row.addEventListener('click', () => navTo('#journey'));
    });

    // Floating Theme Toggle button
    document.getElementById('hsThemeFab')?.addEventListener('click', async () => {
      const currentTheme = getTheme();
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      if (typeof AppState !== 'undefined' && AppState.update) {
        await AppState.update('settings.theme', nextTheme);
      } else {
        document.documentElement.className = nextTheme === 'light' ? 'theme-light' : 'theme-dark';
      }
    });
  }
};