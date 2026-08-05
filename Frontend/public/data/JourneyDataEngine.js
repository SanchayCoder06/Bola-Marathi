// BOLA Marathi - Journey Data Engine
// This demonstrates how the game would load and use the JSON data files

class JourneyDataEngine {
  constructor() {
    this.cache = new Map();
    this.basePath = 'data/';
  }

  // Load JSON data with caching
  async loadData(filename) {
    // Check cache first
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`${this.basePath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(filename, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  // Get city data by ID
  async getCity(cityId) {
    const citiesData = await this.loadData('cities.json');
    return citiesData.cities.find(city => city.id === cityId) || null;
  }

  // Get district data by ID
  async getDistrict(districtId) {
    const districtsData = await this.loadData('districts.json');
    return districtsData.districts.find(district => district.id === districtId) || null;
  }

  // Get location data by ID
  async getLocation(locationId) {
    const locationsData = await this.loadData('locations.json');
    return locationsData.locations.find(loc => loc.id === locationId) || null;
  }

  // Get NPC data by ID
  async getNPC(npcId) {
    const npcsData = await this.loadData('npcs.json');
    return npcsData.npcs.find(npc => npc.id === npcId) || null;
  }

  // Get quest data by ID
  async getQuest(questId) {
    const questsData = await this.loadData('quests.json');
    return questsData.quests.find(quest => quest.id === questId) || null;
  }

  // Get dialogue data by ID
  async getDialogue(dialogueId) {
    try {
      const dialogueData = await this.loadData(`dialogues/${dialogueId}.json`);
      return dialogueData.dialogue || null;
    } catch (error) {
      console.warn(`Dialogue file not found: ${dialogueId}`, error);
      return null;
    }
  }

  // Get vocabulary by category and/or difficulty
  async getVocabulary(filters = {}) {
    const vocabData = await this.loadData('vocabulary.json');
    let words = vocabData.vocabulary;

    // Filter by category if specified
    if (filters.category && words[filters.category]) {
      words = words[filters.category];
    }

    // Filter by difficulty if specified
    if (filters.difficulty) {
      // Flatten all categories and filter by difficulty
      const allWords = Object.values(vocabData.vocabulary).flat();
      words = allWords.filter(word => word.difficulty === filters.difficulty);
    }

    return words;
  }

  // Get culture data by type
  async getCulture(type) {
    const cultureData = await this.loadData('culture.json');
    return cultureData.culture[type] || [];
  }

  // Get all cities
  async getAllCities() {
    const citiesData = await this.loadData('cities.json');
    return citiesData.cities;
  }

  // Get all districts for a city
  async getDistrictsByCity(cityId) {
    const districtsData = await this.loadData('districts.json');
    return districtsData.districts.filter(district => district.cityId === cityId);
  }

  // Get all locations for a district
  async getLocationsByDistrict(districtId) {
    const locationsData = await this.loadData('locations.json');
    return locationsData.locations.filter(location => location.districtId === districtId);
  }

  // Get all NPCs for a location
  async getNPCsByLocation(locationId) {
    const npcsData = await this.loadData('npcs.json');
    return npcsData.npcs.filter(npc =>
      npc.districtId === locationId ||
      (npc.city && npc.city === locationId) // Handle case where NPC is city-level
    );
  }

  // Get available quests for a player based on progress
  async getAvailableQuests(playerState) {
    const questsData = await this.loadData('quests.json');
    const allQuests = questsData.quests;

    return allQuests.filter(quest => {
      // Check prerequisites
      if (quest.prerequisites && quest.prerequisites.length > 0) {
        const hasPrereqs = quest.prerequisites.every(prereq =>
          playerState.completedQuests.includes(prereq)
        );
        if (!hasPrereqs) return false;
      }

      // Check unlock requirements
      if (quest.unlockRequirement) {
        // Implementation would depend on requirement type
        // For now, assuming quests are available if prerequisites met
      }

      // Check daily limits
      if (quest.dailyLimit && playerState.dailyQuestCounts[quest.id] >= quest.dailyLimit) {
        return false;
      }

      return true;
    });
  }

  // Clear cache (useful for development or language switching)
  clearCache() {
    this.cache.clear();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JourneyDataEngine };
}

// Example usage documentation:
// const dataEngine = new JourneyDataEngine();
//
// // Get Pune city info
// const pune = await dataEngine.getCity('pune');
//
// // Get all districts in Pune
// const puneDistricts = await dataEngine.getDistrictsByCity('pune');
//
// // Get Shaniwar Wada district
// const shaniwarWada = await dataEngine.getDistrict('pune-shaniwar-wada');
//
// // Get locations in Shaniwar Wada district
// const swLocations = await dataEngine.getLocationsByDistrict('pune-shaniwar-wada');
//
// // Get beginner vocabulary
// const beginnerVocab = await dataEngine.getVocabulary({ difficulty: 'beginner' });
//
// // Get culture facts
// const facts = await dataEngine.getCulture('facts');
//
// // Get available quests for player
// const availableQuests = await dataEngine.getAvailableQuests({
//   completedQuests: ['pune-quest-cutting-chai-order'],
//   dailyQuestCounts: { 'pune-quest-cutting-chai-order': 0 }
// });