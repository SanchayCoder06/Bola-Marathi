/**
 * BOLA Marathi — Game Engine
 * Domain Layer (Pure Business Logic)
 */

import { DBService } from '../../infrastructure/storage/db.js';

export const GameEngine = (() => {
  let _cities = null;

  async function init() {
    if (_cities) return;
    try {
      await DBService.seedIfEmpty();
      const list = await DBService.getAll('cities');
      _cities = {};
      list.forEach(c => {
        _cities[c.id] = c;
      });
    } catch (e) {
      console.warn("Failed to load cities config from IndexedDB:", e);
      _cities = {
        pune: { id: "pune", name: "Pune", nameMarathi: "पुणे", levelRequired: 1, coords: { x: 50, y: 60 }, icon: "🏰", landmarks: [] }
      };
    }
  }

  function isCityUnlocked(cityId, playerLevel) {
    if (!_cities) return false;
    const city = _cities[cityId.toLowerCase()];
    if (!city) return false;
    return playerLevel >= city.levelRequired;
  }

  function getCityMetadata() {
    return _cities || {};
  }

  function isLandmarkUnlocked(landmarkType, isCityActiveCompleted) {
    if (['restaurant', 'market', 'railway_station', 'home'].includes(landmarkType)) {
      return true;
    }
    return isCityActiveCompleted;
  }

  function getCityReputation(state, cityId) {
    if (!state.rpg.cityReputation) {
      state.rpg.cityReputation = { pune: 355, mumbai: 0, nashik: 0 };
    }
    return state.rpg.cityReputation[cityId] || 0;
  }

  function getNpcRelationship(state, npcId) {
    if (!state.rpg.npcRelationships) {
      state.rpg.npcRelationships = { ram: 25, rohan: 10, anil: 0, amit: 0, sunita: 0, baburao: 0 };
    }
    return state.rpg.npcRelationships[npcId] || 0;
  }

  function getReputationRank(cityId, xp) {
    if (!_cities) return 'Outsider';
    const city = _cities[cityId];
    if (!city || !city.reputationLevels) return 'Outsider';
    if (xp < 150) return city.reputationLevels[0];
    if (xp < 250) return city.reputationLevels[1];
    if (xp < 350) return city.reputationLevels[2];
    if (xp < 500) return city.reputationLevels[3];
    return city.reputationLevels[4];
  }

  return {
    init,
    isCityUnlocked,
    getCityMetadata,
    isLandmarkUnlocked,
    getCityReputation,
    getNpcRelationship,
    getReputationRank
  };
})();
