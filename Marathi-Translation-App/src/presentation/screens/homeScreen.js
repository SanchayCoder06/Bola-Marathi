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
const getUserName = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    return state?.user?.name || 'Learner';
  } catch {
    return 'Learner';
  }
};

/* Helper: get stats from AppState */
const getStats = () => {
  try {
    const state = AppState?.getState() || window.AppState?.getState();
    return state?.stats || { xp: 523, streak: 7, lessonsCompleted: 12, wordsLearned: 48 };
  } catch {
    return { xp: 523, streak: 7, lessonsCompleted: 12, wordsLearned: 48 };
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
const getCurrentLesson = () => ({
  id: 'lesson-1',
  title: 'Basic Greetings & Namaskar',
  progress: 65
});

/* Helper: get daily goal XP stats */
const getDailyGoal = () => ({ today: 120, goal: 200 });

/* Helper: get recent lessons */
const getRecentLessons = () => [
  { id: 'r1', title: 'Numbers 1–10 (संख्या)', completed: true, progress: 100 },
  { id: 'r2', title: 'Food & Dining (जेवण)', completed: true, progress: 100 },
  { id: 'r3', title: 'Transport & Auto Rickshaw (वाहन)', completed: false, progress: 45 }
];

export const HomeScreen = {
  async render(container) {
    if (!container) return;

    // Inject Precision Polish Scoped CSS
    if (!document.getElementById('home-screen-precision-style')) {
      const style = document.createElement('style');
      style.id = 'home-screen-precision-style';
      style.textContent = `
        /* Master Layout Container */
        .hs-container {
          width: 100%;
          min-height: 100vh;
          background: #FFF8F2;
          color: #1E293B;
          padding: 20px 16px 40px;
          font-family: var(--font-ui, 'Outfit', 'Poppins', sans-serif);
          box-sizing: border-box;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .theme-dark .hs-container {
          background: #0B1020;
          color: #F8FAFC;
        }

        .hs-wrapper {
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .fade-in {
          animation: hsFadeIn 0.4s ease-out forwards;
        }

        @keyframes hsFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 1. HERO BANNER */
        .hs-hero-banner {
          position: relative;
          width: 100%;
          height: 250px;
          border-radius: 28px;
          overflow: hidden;
          background: url('assets/illustrations/home/hero-maharashtra.png?v=99') center/cover no-repeat;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 32px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }

        .hs-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255, 248, 242, 0.98) 0%, rgba(255, 248, 242, 0.85) 45%, rgba(255, 248, 242, 0) 95%);
          z-index: 1;
        }

        .theme-dark .hs-hero-overlay {
          background: linear-gradient(90deg, rgba(11, 16, 32, 0.98) 0%, rgba(11, 16, 32, 0.85) 45%, rgba(11, 16, 32, 0) 95%);
        }

        .hs-hero-badge {
          position: relative;
          z-index: 2;
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 138, 0, 0.3);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #FF8A00;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .theme-dark .hs-hero-badge {
          background: rgba(15, 23, 42, 0.85);
          border-color: rgba(255, 138, 0, 0.35);
        }

        .hs-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FF8A00;
          box-shadow: 0 0 8px #FF8A00;
        }

        .hs-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hs-hero-title {
          font-size: 36px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.2;
          margin: 0;
          font-family: 'Poppins', var(--font-ui), sans-serif;
        }

        .theme-dark .hs-hero-title { color: #FFFFFF; }

        .hs-highlight {
          color: #FF8A00;
        }

        .hs-hero-subtitle {
          font-size: 15px;
          color: #64748B;
          margin: 2px 0 12px 0;
          line-height: 1.4;
        }

        .theme-dark .hs-hero-subtitle { color: rgba(255, 255, 255, 0.75); }

        .hs-btn-hero {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 52px;
          padding: 0 26px;
          background: linear-gradient(135deg, #FF8A00 0%, #FF6B35 100%);
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(255, 138, 0, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hs-btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(255, 138, 0, 0.48);
        }

        .hs-btn-hero:active {
          transform: scale(0.96);
        }

        /* 2. DAILY PROGRESS CARD */
        .hs-daily-card {
          background: #FFFFFF;
          border-radius: 28px;
          padding: 24px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-sizing: border-box;
        }

        .theme-dark .hs-daily-card {
          background: #151C2E;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .hs-daily-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 16px;
        }

        .theme-dark .hs-daily-header {
          border-bottom-color: rgba(255, 255, 255, 0.06);
        }

        .hs-daily-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hs-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          background: #FFF8E7;
          border: 1px solid rgba(255, 194, 51, 0.3);
        }

        .theme-dark .hs-icon-badge {
          background: rgba(255, 194, 51, 0.15);
          border-color: rgba(255, 194, 51, 0.25);
        }

        .hs-illustration-icon {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .hs-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .theme-dark .hs-card-title { color: #FFFFFF; }

        .hs-card-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        .theme-dark .hs-card-subtitle { color: rgba(255, 255, 255, 0.55); }

        .hs-streak-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #FFF3E0;
          border: 1px solid rgba(255, 138, 0, 0.2);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          color: #FF8A00;
        }

        .theme-dark .hs-streak-pill {
          background: rgba(255, 138, 0, 0.15);
          border-color: rgba(255, 138, 0, 0.3);
        }

        .hs-daily-stats-row {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .hs-progress-ring-container {
          position: relative;
          width: 100px;
          height: 100px;
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
          stroke: #F1F5F9;
          stroke-width: 8;
        }

        .theme-dark .hs-ring-bg {
          stroke: rgba(255, 255, 255, 0.08);
        }

        .hs-ring-fill {
          fill: none;
          stroke: #FF8A00;
          stroke-width: 8;
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
          font-size: 18px;
          font-weight: 800;
          color: #1E293B;
        }

        .theme-dark .hs-ring-val { color: #FFFFFF; }

        .hs-ring-lbl {
          font-size: 10px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        .theme-dark .hs-ring-lbl { color: rgba(255, 255, 255, 0.5); }

        .hs-daily-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hs-detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hs-detail-label {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }

        .theme-dark .hs-detail-label { color: rgba(255, 255, 255, 0.5); }

        .hs-detail-value {
          font-size: 15px;
          font-weight: 700;
          color: #1E293B;
        }

        .theme-dark .hs-detail-value { color: #FFFFFF; }

        .hs-text-saffron {
          color: #FF8A00;
        }

        .hs-progress-bar-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hs-flex-grow {
          flex: 1;
        }

        .hs-progress-bar-track {
          flex: 1;
          height: 10px;
          background: #F1F5F9;
          border-radius: 10px;
          overflow: hidden;
        }

        .theme-dark .hs-progress-bar-track {
          background: rgba(255, 255, 255, 0.08);
        }

        .hs-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
          border-radius: 10px;
          transition: width 0.5s ease-out;
        }

        .hs-progress-pct {
          font-size: 13px;
          font-weight: 700;
          color: #22C55E;
        }

        /* 3. QUICK ACTIONS GRID */
        .hs-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hs-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hs-section-title {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          margin: 0;
          font-family: 'Poppins', var(--font-ui), sans-serif;
        }

        .theme-dark .hs-section-title { color: #FFFFFF; }

        .hs-link-btn {
          background: none;
          border: none;
          color: #FF8A00;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
        }

        .hs-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .hs-quick-btn {
          height: 116px;
          border-radius: 24px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .hs-quick-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }

        .hs-quick-btn:active {
          transform: scale(0.96);
        }

        .hs-quick-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 16px;
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
          background: #151C2E;
        }
        .theme-dark .hs-quick-learn { border-color: rgba(255, 138, 0, 0.25); }
        .theme-dark .hs-quick-learn .hs-quick-label { color: #FFFFFF; }
        .theme-dark .hs-quick-learn .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-dict { border-color: rgba(139, 92, 246, 0.25); }
        .theme-dark .hs-quick-dict .hs-quick-label { color: #FFFFFF; }
        .theme-dark .hs-quick-dict .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-practice { border-color: rgba(46, 213, 115, 0.25); }
        .theme-dark .hs-quick-practice .hs-quick-label { color: #FFFFFF; }
        .theme-dark .hs-quick-practice .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .theme-dark .hs-quick-explore { border-color: rgba(0, 210, 255, 0.25); }
        .theme-dark .hs-quick-explore .hs-quick-label { color: #FFFFFF; }
        .theme-dark .hs-quick-explore .hs-quick-sub { color: rgba(255, 255, 255, 0.6); }

        .hs-quick-label {
          font-size: 18px;
          font-weight: 700;
        }

        .hs-quick-sub {
          font-size: 13px;
          font-weight: 500;
        }

        /* 4. CONTINUE LEARNING CARD */
        .hs-continue-card {
          background: #FFFFFF;
          border-radius: 28px;
          padding: 20px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
        }

        .theme-dark .hs-continue-card {
          background: #151C2E;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .hs-continue-inner {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .hs-continue-media {
          width: 90px;
          height: 90px;
          border-radius: 18px;
          background: #FFF5EB;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 138, 0, 0.2);
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
          gap: 8px;
        }

        .hs-continue-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hs-pill-badge {
          align-self: flex-start;
          padding: 3px 10px;
          background: #FFF3E0;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          color: #FF8A00;
          text-transform: uppercase;
        }

        .hs-continue-title {
          font-size: 18px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .theme-dark .hs-continue-title { color: #FFFFFF; }

        .hs-continue-desc {
          font-size: 15px;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        .theme-dark .hs-continue-desc { color: rgba(255, 255, 255, 0.65); }

        .hs-continue-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .hs-btn-accent {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 48px;
          padding: 0 22px;
          background: linear-gradient(135deg, #FF8A00 0%, #FF6B35 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(255, 138, 0, 0.32);
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .hs-btn-accent:hover { transform: translateY(-2px); }
        .hs-btn-accent:active { transform: scale(0.96); }

        /* 5. EXPLORE MAHARASHTRA CARD (SPLIT LAYOUT) */
        .hs-explore-split-card {
          display: flex;
          align-items: center;
          background: #FFF8F0;
          border-radius: 28px;
          border: 1px solid rgba(255, 138, 0, 0.15);
          padding: 24px;
          gap: 18px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
          transition: background 0.3s ease;
        }

        .theme-dark .hs-explore-split-card {
          background: #151C2E;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
        }

        .hs-explore-split-content {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hs-explore-title {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          margin: 0;
          font-family: 'Poppins', var(--font-ui), sans-serif;
        }

        .theme-dark .hs-explore-title { color: #FFFFFF; }

        .hs-explore-desc {
          font-size: 15px;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        .theme-dark .hs-explore-desc { color: rgba(255, 255, 255, 0.65); }

        .hs-btn-explore {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          height: 48px;
          padding: 0 22px;
          background: #FFFFFF;
          color: #FF8A00;
          border: 1.5px solid rgba(255, 138, 0, 0.3);
          font-size: 15px;
          font-weight: 700;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 138, 0, 0.12);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .theme-dark .hs-btn-explore {
          background: rgba(255, 255, 255, 0.05);
          color: #FF8A00;
          border-color: rgba(255, 138, 0, 0.3);
        }

        .hs-btn-explore:hover {
          transform: translateY(-2px);
          background: #FFF5EB;
        }

        .hs-explore-split-media {
          flex: 1;
          height: 140px;
          border-radius: 18px;
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
          gap: 12px;
        }

        .hs-recent-row {
          height: 68px;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #F1F5F9;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }

        .theme-dark .hs-recent-row {
          background: #151C2E;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }

        .hs-recent-row:hover {
          transform: translateX(4px);
        }

        .hs-recent-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 14px;
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
          gap: 3px;
        }

        .hs-recent-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .theme-dark .hs-recent-title { color: #FFFFFF; }

        .hs-recent-status {
          font-size: 13px;
          font-weight: 600;
        }

        .hs-status-complete { color: #22C55E; }
        .hs-status-active { color: #FF8A00; }

        .hs-recent-action {
          color: #94A3B8;
        }

        /* FLOATING DAY / NIGHT MODE THEME TOGGLE FAB */
        .hs-theme-fab {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background 0.3s ease;
          color: #FF8A00;
        }

        .theme-dark .hs-theme-fab {
          background: #151C2E;
          border-color: rgba(255, 255, 255, 0.15);
          color: #FFC233;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
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