/**
 * BOLA Marathi — Learning Engine
 * Core Engine Layer
 * 
 * Drives curriculum tracking, lesson content validation, and phrase list indexing.
 */

export const LearningEngine = (() => {
  let _lessonsData = null;

  async function init() {
    if (_lessonsData) return;
    try {
      const res = await fetch('data/lessons/lessons.json');
      if (res.ok) {
        _lessonsData = await res.json();
      }
    } catch (e) {
      console.warn("LearningEngine failed to fetch static lessons data:", e);
    }
  }

  function getModules() {
    return _lessonsData ? _lessonsData.modules : [];
  }

  function getLessonById(moduleId, lessonId) {
    if (!_lessonsData) return null;
    const mod = _lessonsData.modules.find(m => m.id === moduleId);
    if (!mod) return null;
    return mod.lessons.find(l => l.id === lessonId);
  }

  return {
    init,
    getModules,
    getLessonById
  };
})();
