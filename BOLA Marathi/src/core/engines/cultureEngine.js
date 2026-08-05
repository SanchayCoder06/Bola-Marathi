/**
 * BOLA Marathi — Culture Engine
 * Core Engine Layer
 * 
 * Manages regional cultural milestones and checks XP checkpoint unlock statuses.
 */

export const CultureEngine = (() => {
  let _cultureCards = [];

  async function init() {
    if (_cultureCards.length > 0) return;
    try {
      const res = await fetch('data/culture/culture.json');
      if (res.ok) {
        const data = await res.json();
        _cultureCards = data.cultureCards || [];
      }
    } catch (e) {
      console.warn("Failed to load culture logs config:", e);
    }
  }

  function getCultureCards(playerXp) {
    return _cultureCards.map(card => ({
      ...card,
      isUnlocked: playerXp >= card.unlockXp
    }));
  }

  return {
    init,
    getCultureCards
  };
})();
