import { useState, useEffect } from 'react';
import { AuthService, type AuthUser } from '@/lib/services/authService';
import { DatabaseService } from '@/lib/db/databaseService';
import type { ProgressModel } from '@/lib/db/models';

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  coins: number;
  dailyGoal: number;
  dailyProgress: number;
  activeCourseId?: string;
  courseProgresses?: Record<string, any>;
}

const defaultStats: UserStats = {
  xp: 320,
  level: 4,
  streakDays: 7,
  coins: 45,
  dailyGoal: 50,
  dailyProgress: 35,
  activeCourseId: 'general',
  courseProgresses: {}
};

// Singleton Shared State Store to eliminate duplicate memory allocations
let _sharedStats: UserStats = defaultStats;
let _sharedAuthUser: AuthUser | null = AuthService.getCurrentUser();
const _statsSubscribers = new Set<(stats: UserStats) => void>();
const _authSubscribers = new Set<(user: AuthUser | null) => void>();
let _isGlobalInitialized = false;

function notifyStatsSubscribers() {
  _statsSubscribers.forEach((fn) => fn(_sharedStats));
}

function notifyAuthSubscribers() {
  _authSubscribers.forEach((fn) => fn(_sharedAuthUser));
}

async function initGlobalState() {
  if (_isGlobalInitialized) return;
  _isGlobalInitialized = true;

  try {
    const dbProgress = await DatabaseService.getProgress();
    if (dbProgress) {
      _sharedStats = {
        xp: dbProgress.xp,
        level: dbProgress.level,
        streakDays: dbProgress.streakDays,
        coins: dbProgress.coins,
        dailyGoal: dbProgress.dailyGoal,
        dailyProgress: dbProgress.dailyProgress,
        activeCourseId: dbProgress.activeCourseId || 'general',
        courseProgresses: dbProgress.courseProgresses
      };
      notifyStatsSubscribers();
    }
  } catch (e) {
    console.warn("Global state init progress fetch failed:", e);
  }

  AuthService.onAuthStateChanged((user) => {
    _sharedAuthUser = user;
    notifyAuthSubscribers();
  });
}

export function useAppState() {
  const [stats, setStats] = useState<UserStats>(_sharedStats);
  const [authUser, setAuthUser] = useState<AuthUser | null>(_sharedAuthUser);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('bola_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    initGlobalState();

    const updateStatsHandler = (newStats: UserStats) => setStats(newStats);
    const updateAuthHandler = (newUser: AuthUser | null) => setAuthUser(newUser);

    _statsSubscribers.add(updateStatsHandler);
    _authSubscribers.add(updateAuthHandler);

    return () => {
      _statsSubscribers.delete(updateStatsHandler);
      _authSubscribers.delete(updateAuthHandler);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('bola_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addXp = async (amount: number) => {
    try {
      const current = await DatabaseService.getProgress();
      const today = new Date().toISOString().split('T')[0];
      const lastActive = current.lastActiveDate ? current.lastActiveDate.split('T')[0] : '';
      let streakDays = current.streakDays;

      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        streakDays = lastActive === yesterday ? current.streakDays + 1 : current.streakDays + 1;
      }

      const nextXp = current.xp + amount;
      const nextLevel = Math.floor(nextXp / 100) + 1;
      const nextDaily = Math.min(current.dailyGoal, current.dailyProgress + amount);

      const updatedStats: ProgressModel = {
        ...current,
        xp: nextXp,
        level: nextLevel,
        streakDays,
        dailyProgress: nextDaily,
        lastActiveDate: new Date().toISOString()
      };

      await DatabaseService.updateProgress(updatedStats);

      _sharedStats = {
        xp: updatedStats.xp,
        level: updatedStats.level,
        streakDays: updatedStats.streakDays,
        coins: updatedStats.coins,
        dailyGoal: updatedStats.dailyGoal,
        dailyProgress: updatedStats.dailyProgress
      };

      notifyStatsSubscribers();
    } catch (err) {
      console.warn("addXp failed:", err);
    }
  };

  const addCoins = async (amount: number) => {
    try {
      const current = await DatabaseService.getProgress();
      const updatedStats = await DatabaseService.updateProgress({ coins: current.coins + amount });

      _sharedStats = {
        ..._sharedStats,
        coins: updatedStats.coins
      };

      notifyStatsSubscribers();
    } catch (err) {
      console.warn("addCoins failed:", err);
    }
  };

  const setActiveCourse = async (courseId: string) => {
    try {
      const current = await DatabaseService.getProgress();
      const updated = await DatabaseService.updateProgress({ activeCourseId: courseId });
      _sharedStats = {
        ..._sharedStats,
        activeCourseId: updated.activeCourseId,
        courseProgresses: updated.courseProgresses
      };
      notifyStatsSubscribers();
    } catch (err) {
      console.warn("setActiveCourse failed:", err);
    }
  };

  return {
    stats,
    activeCourseId: stats.activeCourseId || 'general',
    courseProgresses: stats.courseProgresses || {},
    setActiveCourse,
    authUser,
    theme,
    toggleTheme,
    setTheme: setThemeState,
    addXp,
    addCoins,
    refreshProgress: initGlobalState
  };
}
