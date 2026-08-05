/**
 * BOLA Marathi — Database Layer Data Models
 * Defines type-safe schemas for User, Progress, Lessons, Journey, Settings, and Achievements.
 */

export interface UserModel {
  id: string;
  name: string;
  email: string;
  avatar: string;
  handle: string;
  learningGoal?: string;
  currentLevel?: string;
  dailyGoalMins?: number;
  onboardingCompleted?: boolean;
  createdAt: string;
}

export interface CourseProgressModel {
  courseId: string;
  xp: number;
  streakDays: number;
  completedModules: string[];
  lastActiveDate: string;
}

export interface ProgressModel {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  coins: number;
  hearts: number;
  dailyGoal: number;
  dailyProgress: number;
  lastActiveDate: string;
  activeCourseId?: string;
  courseProgresses?: Record<string, CourseProgressModel>;
}

export interface LessonModel {
  id: string;
  title: string;
  subtitle: string;
  chapter: number;
  minutes: number;
  progress: number;
  isCompleted: boolean;
  phrases?: { marathi: string; english: string; transliteration: string }[];
}

export interface LandmarkModel {
  id: string;
  name: string;
  marathiName: string;
  type: string;
  dialogueId?: string;
  isCompleted?: boolean;
}

export interface JourneyModel {
  cityId: string;
  cityName: string;
  marathiName: string;
  region: string;
  description: string;
  unlockXp: number;
  isUnlocked: boolean;
  coords: { x: number; y: number };
  landmarks: LandmarkModel[];
}

export interface SettingsModel {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  dailyGoalTarget: number;
  notificationsEnabled: boolean;
}

export interface AchievementModel {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  unlockedAt?: string | null;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
}
