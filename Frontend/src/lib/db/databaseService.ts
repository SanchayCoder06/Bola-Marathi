/**
 * BOLA Marathi — Database Service Layer
 * Manages user progress, 60-module Duolingo learning path, settings, and achievements.
 */

import { DBService } from '../services/db';
import {
  user as defaultUser,
  dailyGoal as defaultDailyGoal,
  recentLessons as defaultLessons,
  achievements as defaultAchievements
} from '../data';
import { journeyModulesData, journeyStagesData, type JourneyModule, type JourneyStage } from '../data/journeyData';
import {
  generateAllCoursesModulesAndSentences,
  SITUATIONAL_COURSES,
  type CourseModel,
  type ModuleModel,
  type SentenceModel
} from '../data/coursesData';

import type {
  UserModel,
  ProgressModel,
  LessonModel,
  AchievementModel
} from './models';

// Default initial cache data
const defaultInitialUser: UserModel = {
  id: 'u_default',
  name: defaultUser.name,
  email: 'aarav.sharma@gmail.com',
  avatar: defaultUser.avatar,
  handle: defaultUser.handle,
  createdAt: new Date().toISOString()
};

const defaultInitialProgress: ProgressModel = {
  userId: 'u_default',
  xp: defaultUser.xp,
  level: defaultUser.level,
  streakDays: defaultUser.streak,
  coins: defaultUser.gems,
  hearts: defaultUser.hearts,
  dailyGoal: defaultDailyGoal.total,
  dailyProgress: defaultDailyGoal.current,
  lastActiveDate: new Date().toISOString(),
  activeCourseId: 'general',
  courseProgresses: {
    general: {
      courseId: 'general',
      xp: defaultUser.xp,
      streakDays: defaultUser.streak,
      completedModules: ['mod_general_1'],
      lastActiveDate: new Date().toISOString()
    },
    travel: {
      courseId: 'travel',
      xp: 0,
      streakDays: 0,
      completedModules: [],
      lastActiveDate: ''
    },
    rickshaw: {
      courseId: 'rickshaw',
      xp: 0,
      streakDays: 0,
      completedModules: [],
      lastActiveDate: ''
    },
    watchman: {
      courseId: 'watchman',
      xp: 0,
      streakDays: 0,
      completedModules: [],
      lastActiveDate: ''
    },
    office: {
      courseId: 'office',
      xp: 0,
      streakDays: 0,
      completedModules: [],
      lastActiveDate: ''
    }
  }
};

export const DatabaseService = (() => {
  let _isInitialized = false;
  let _initPromise: Promise<void> | null = null;
  let _modulesCache: JourneyModule[] = journeyModulesData;
  let _stagesCache: JourneyStage[] = journeyStagesData;
  let _achievementsCache: AchievementModel[] = defaultAchievements as any;
  let _userCache: UserModel = defaultInitialUser;
  let _progressCache: ProgressModel = defaultInitialProgress;
  let _lessonsCache: LessonModel[] = defaultLessons as any;

  let _coursesCache: CourseModel[] = SITUATIONAL_COURSES;
  let _dbModulesCache: ModuleModel[] = [];
  let _dbSentencesCache: SentenceModel[] = [];

  async function init(): Promise<void> {
    if (_initPromise) return _initPromise;

    _initPromise = new Promise<void>((resolve) => {
      setTimeout(async () => {
        try {
          await Promise.race([
            DBService.open(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 1500))
          ]);
          await seedDefaults();
        } catch (e) {
          console.warn("[DatabaseService] Offline/Async fallback active:", e);
        } finally {
          _isInitialized = true;
          resolve();
        }
      }, 0);
    });

    return _initPromise;
  }

  async function seedDefaults(): Promise<void> {
    try {
      // 1. User
      const existingUser = await DBService.get<UserModel>('progress', 'current_user').catch(() => null);
      if (!existingUser) {
        await DBService.put('progress', { key: 'current_user', ...defaultInitialUser }).catch(() => {});
      } else {
        _userCache = existingUser;
      }

      // 2. Progress
      const existingProgress = await DBService.get<ProgressModel>('progress', 'user_stats').catch(() => null);
      if (!existingProgress) {
        await DBService.put('progress', { key: 'user_stats', ...defaultInitialProgress }).catch(() => {});
      } else {
        // Support migration for older schemas missing course-specific progress structure
        _progressCache = {
          ...defaultInitialProgress,
          ...existingProgress,
          courseProgresses: {
            ...defaultInitialProgress.courseProgresses,
            ...(existingProgress.courseProgresses || {})
          }
        };
      }

      // 3. Lessons
      const existingLessons = await DBService.getAll<LessonModel>('chapters').catch(() => []);
      if (existingLessons && existingLessons.length > 0) {
        _lessonsCache = existingLessons;
      }

      // 4. Courses, Modules, Sentences Seeding
      let existingCourses = await DBService.getAll<CourseModel>('courses').catch(() => []);

      // Auto-reseed check: if the new seed data ("अ - अननस") is not present, clear and reseed
      const firstSentence = await DBService.get<SentenceModel>('sentences', 'sent_general_1_0').catch(() => null);
      const needsReseed = !firstSentence || !firstSentence.marathi_text.includes("अननस");

      if (needsReseed && existingCourses.length > 0) {
        console.log("[DatabaseService] Outdated seed data detected. Clearing tables for reseed...");
        try {
          const db = await DBService.open();
          const clearStore = (storeName: string) => {
            return new Promise<void>((resolve, reject) => {
              const tx = db.transaction(storeName, 'readwrite');
              const store = tx.objectStore(storeName);
              const req = store.clear();
              req.onsuccess = () => resolve();
              req.onerror = () => reject(req.error);
            });
          };
          await clearStore('courses');
          await clearStore('modules');
          await clearStore('sentences');
          existingCourses = []; // Force seeding code to run below
        } catch (e) {
          console.error("[DatabaseService] Failed to clear stores for reseed:", e);
        }
      }

      if (!existingCourses || existingCourses.length === 0) {
        console.log("[DatabaseService] Seeding courses, modules, and sentences...");
        const { courses, modules, sentences } = generateAllCoursesModulesAndSentences();
        for (const c of courses) {
          await DBService.put('courses', c).catch(() => {});
        }
        for (const m of modules) {
          await DBService.put('modules', m).catch(() => {});
        }
        for (const s of sentences) {
          await DBService.put('sentences', s).catch(() => {});
        }
        _coursesCache = courses;
        _dbModulesCache = modules;
        _dbSentencesCache = sentences;
      } else {
        _coursesCache = existingCourses;
        _dbModulesCache = await DBService.getAll<ModuleModel>('modules').catch(() => []);
        _dbSentencesCache = await DBService.getAll<SentenceModel>('sentences').catch(() => []);
      }

      evaluateAchievementsSilently();
    } catch (err) {
      console.warn("[DatabaseService] seedDefaults warning:", err);
    }
  }

  // --- AUTOMATIC ACHIEVEMENT EVALUATION ---
  function evaluateAchievementsSilently(): void {
    try {
      const completedModules = _dbModulesCache.filter((m) => m.isCompleted && m.courseId === 'general');
      const completedCount = completedModules.length;

      let updated = false;
      _achievementsCache = _achievementsCache.map((a) => {
        let isUnlocked = a.unlocked;
        if (a.id === "a_first_lesson" && completedCount >= 1) isUnlocked = true;
        if (a.id === "a_first_convo" && completedCount >= 2) isUnlocked = true;
        if (a.id === "a_perfect_pronoun" && completedCount >= 3) isUnlocked = true;
        if (a.id === "a_mumbai_master" && completedCount >= 15) isUnlocked = true;
        if (a.id === "a_vocab_master" && completedCount >= 30) isUnlocked = true;

        if (isUnlocked !== a.unlocked) {
          updated = true;
          return { ...a, unlocked: isUnlocked };
        }
        return a;
      });

      if (updated) {
        DBService.put('stories', { key: 'achievements_list', list: _achievementsCache }).catch(() => {});
      }
    } catch {}
  }

  async function getUser(): Promise<UserModel> {
    init();
    return _userCache;
  }

  async function updateUser(updates: Partial<UserModel>): Promise<UserModel> {
    _userCache = { ..._userCache, ...updates };
    try {
      await DBService.put('progress', { key: 'current_user', ..._userCache }).catch(() => {});
    } catch {}
    return _userCache;
  }

  async function getProgress(): Promise<ProgressModel> {
    init();
    return _progressCache;
  }

  async function updateProgress(updates: Partial<ProgressModel>): Promise<ProgressModel> {
    _progressCache = { ..._progressCache, ...updates };
    try {
      await DBService.put('progress', { key: 'user_stats', ..._progressCache }).catch(() => {});
    } catch {}
    return _progressCache;
  }

  async function addXp(amount: number): Promise<ProgressModel> {
    const activeCourseId = _progressCache.activeCourseId || 'general';
    const progresses = _progressCache.courseProgresses || {};
    const courseProg = progresses[activeCourseId] || {
      courseId: activeCourseId, xp: 0, streakDays: 0, completedModules: [], lastActiveDate: ''
    };

    courseProg.xp += amount;
    courseProg.lastActiveDate = new Date().toISOString();

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = courseProg.lastActiveDate ? courseProg.lastActiveDate.split('T')[0] : '';
    if (lastActiveStr !== todayStr) {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      courseProg.streakDays = lastActiveStr === yesterdayStr ? courseProg.streakDays + 1 : 1;
    }

    progresses[activeCourseId] = courseProg;

    const totalXp = Object.values(progresses).reduce((sum, cp) => sum + cp.xp, 0);
    const maxStreak = Object.values(progresses).reduce((max, cp) => Math.max(max, cp.streakDays), 0);
    const nextLevel = Math.floor(totalXp / 100) + 1;
    const nextDaily = _progressCache.dailyProgress + amount;

    _progressCache = {
      ..._progressCache,
      xp: totalXp,
      level: nextLevel,
      streakDays: maxStreak,
      dailyProgress: nextDaily,
      courseProgresses: progresses,
      lastActiveDate: new Date().toISOString()
    };

    try {
      await DBService.put('progress', { key: 'user_stats', ..._progressCache }).catch(() => {});
      evaluateAchievementsSilently();
    } catch {}
    return _progressCache;
  }

  async function getLessons(): Promise<LessonModel[]> {
    init();
    return _lessonsCache;
  }

  async function updateLessonProgress(lessonId: string, progress: number): Promise<void> {
    _lessonsCache = _lessonsCache.map((l) => {
      if (l.id === lessonId) {
        return { ...l, progress, isCompleted: progress >= 1.0 };
      }
      return l;
    });

    try {
      await DBService.put('chapters', {
        id: lessonId,
        progress,
        isCompleted: progress >= 1.0
      }).catch(() => {});
    } catch {}
  }

  // --- COURSES & SENTENCES API ---
  async function getCourses(): Promise<CourseModel[]> {
    init();
    return _coursesCache;
  }

  async function getModules(courseId?: string): Promise<ModuleModel[]> {
    init();
    const cId = courseId || _progressCache.activeCourseId || 'general';
    return _dbModulesCache.filter(m => m.courseId === cId);
  }

  async function getModuleById(moduleId: string): Promise<ModuleModel | null> {
    init();
    return _dbModulesCache.find(m => m.id === moduleId) || null;
  }

  async function getSentences(moduleId: string): Promise<SentenceModel[]> {
    init();
    return _dbSentencesCache.filter(s => s.moduleId === moduleId);
  }

  // --- 60-MODULE JOURNEY API (STAGE MAP COMPATIBILITY) ---
  async function getJourneyModules(): Promise<JourneyModule[]> {
    init();
    const activeCourseId = _progressCache.activeCourseId || 'general';
    const filtered = _dbModulesCache.filter(m => m.courseId === activeCourseId);

    return filtered.map((m) => {
      // Map to General stages if general, else single stage
      let stageId: 'foundation' | 'conversational' | 'fluency' = 'foundation';
      if (activeCourseId === 'general') {
        stageId = m.moduleNumber <= 15 ? 'foundation' : m.moduleNumber <= 40 ? 'conversational' : 'fluency';
      }
      return {
        id: m.id,
        moduleNumber: m.moduleNumber,
        stageId,
        stageTitle: stageId.charAt(0).toUpperCase() + stageId.slice(1),
        stageHindi: stageId === 'foundation' ? 'आधारशिला' : stageId === 'conversational' ? 'संभाषण' : 'प्रवाह',
        titleEn: m.titleEn,
        titleHindi: m.titleHindi,
        descriptionEn: m.descriptionEn,
        learningObjective: m.learningObjective,
        xp: m.xp,
        isUnlocked: m.isUnlocked,
        isCompleted: m.isCompleted,
        vocabulary: [],
        phrases: [],
        conversationScenario: [],
        estimatedMinutes: m.estimatedMinutes
      };
    });
  }

  async function getJourneyStages(): Promise<JourneyStage[]> {
    init();
    const activeCourseId = _progressCache.activeCourseId || 'general';
    const mods = await getJourneyModules();

    if (activeCourseId === 'general') {
      return [
        {
          id: "foundation",
          title: "Foundation",
          hindiTitle: "आधारशिला (स्वर, शब्द और मूल ज्ञान)",
          description: "Modules 1–15: Alphabet, tricky sounds, family, numbers, yes/no & simple questions.",
          startModule: 1,
          endModule: 15,
          colorTone: "from-amber-500 to-orange-500",
          modules: mods.slice(0, 15)
        },
        {
          id: "conversational",
          title: "Conversational",
          hindiTitle: "प्रारंभिक बातचीत (दैनिक व्यवहार)",
          description: "Modules 16–40: Market, bargaining, rickshaws, weather, medical, bank, work & festivals.",
          startModule: 16,
          endModule: 40,
          colorTone: "from-emerald-500 to-teal-500",
          modules: mods.slice(15, 40)
        },
        {
          id: "fluency",
          title: "Fluency",
          hindiTitle: "उच्च स्तर (औपचारिक, साहित्य और धाराप्रवाह)",
          description: "Modules 41–60: Opinions, past & future narrations, idioms, signs, accents & debate.",
          startModule: 41,
          endModule: 60,
          colorTone: "from-purple-500 to-pink-500",
          modules: mods.slice(40, 60)
        }
      ];
    } else {
      const course = _coursesCache.find(c => c.id === activeCourseId);
      return [
        {
          id: `${activeCourseId}_stage` as any,
          title: course?.title || 'Situational Path',
          hindiTitle: 'विशेष परिस्थिति (व्यावहारिक मराठी)',
          description: course?.description || 'Hyper-practical situational modules.',
          startModule: 1,
          endModule: mods.length || 8,
          colorTone: "from-amber-500 to-orange-500",
          modules: mods
        }
      ];
    }
  }

  async function completeModule(moduleId: string, xpEarned: number = 50): Promise<JourneyModule[]> {
    const activeCourseId = _progressCache.activeCourseId || 'general';

    // 1. Mark module completed in IndexedDB and cache
    _dbModulesCache = _dbModulesCache.map((m) => {
      if (m.id === moduleId) {
        return { ...m, isCompleted: true };
      }
      return m;
    });

    // 2. Unlock the next module in this course
    const completedMod = _dbModulesCache.find(m => m.id === moduleId);
    if (completedMod) {
      const nextNum = completedMod.moduleNumber + 1;
      _dbModulesCache = _dbModulesCache.map((m) => {
        if (m.courseId === activeCourseId && m.moduleNumber === nextNum) {
          return { ...m, isUnlocked: true };
        }
        return m;
      });
    }

    for (const m of _dbModulesCache) {
      await DBService.put('modules', m).catch(() => {});
    }

    // 3. Update course progress details
    const progresses = _progressCache.courseProgresses || {};
    const courseProg = progresses[activeCourseId] || {
      courseId: activeCourseId,
      xp: 0,
      streakDays: 0,
      completedModules: [],
      lastActiveDate: ''
    };

    if (!courseProg.completedModules.includes(moduleId)) {
      courseProg.completedModules.push(moduleId);
    }
    courseProg.xp += xpEarned;
    courseProg.lastActiveDate = new Date().toISOString();

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = courseProg.lastActiveDate ? courseProg.lastActiveDate.split('T')[0] : '';
    if (lastActiveStr !== todayStr) {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      courseProg.streakDays = lastActiveStr === yesterdayStr ? courseProg.streakDays + 1 : 1;
    }

    progresses[activeCourseId] = courseProg;

    const totalXp = Object.values(progresses).reduce((sum, cp) => sum + cp.xp, 0);
    const maxStreak = Object.values(progresses).reduce((max, cp) => Math.max(max, cp.streakDays), 0);
    const nextLevel = Math.floor(totalXp / 100) + 1;

    _progressCache = {
      ..._progressCache,
      xp: totalXp,
      level: nextLevel,
      streakDays: maxStreak,
      courseProgresses: progresses,
      lastActiveDate: new Date().toISOString()
    };

    await DBService.put('progress', { key: 'user_stats', ..._progressCache }).catch(() => {});
    evaluateAchievementsSilently();

    return getJourneyModules();
  }

  async function getAchievements(): Promise<AchievementModel[]> {
    init();
    return _achievementsCache;
  }

  async function unlockAchievement(achievementId: string): Promise<AchievementModel[]> {
    _achievementsCache = _achievementsCache.map((a) => {
      if (a.id === achievementId) {
        return { ...a, unlocked: true };
      }
      return a;
    });

    try {
      await DBService.put('stories', { key: 'achievements_list', list: _achievementsCache }).catch(() => {});
    } catch {}
    return _achievementsCache;
  }

  // Backward compatibility alias
  async function getJourney(): Promise<any> {
    return getJourneyStages();
  }

  return {
    init,
    getUser,
    updateUser,
    getProgress,
    updateProgress,
    addXp,
    getLessons,
    updateLessonProgress,
    getCourses,
    getModules,
    getModuleById,
    getSentences,
    getJourneyModules,
    getJourneyStages,
    completeModule,
    getJourney,
    getAchievements,
    unlockAchievement
  };
  
})();
