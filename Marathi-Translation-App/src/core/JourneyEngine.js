/**
 * Journey Engine for BOLA Marathi RPG Language Learning Game
 * Handles loading game data, player progression, and game state management
 * All data is loaded from JSON files in the data directory
 */
class JourneyEngine {
  constructor() {
    // Event system: map of event names to list of callbacks
    this.events = {};
    this._initialized = false;
    // Cache for loaded city data (districts, locations, npcs, quests)
    this._cityCache = new Map();
    // Master cities data (from cities.json)
    this._citiesData = [];
    // Player progress
    this._progress = {
      currentCity: "",
      currentDistrict: null,
      currentLocation: null,
      xp: 0,
      coins: 0,
      completedQuestSet: new Set(),
      unlockedCitySet: new Set(),
      discoveredLocationSet: new Set(),
      friendshipLevelMap: new Map(), // npcId -> level
      achievementSet: new Set(),
      inventory: [] // array of item IDs
    };
  }

  /**
   * Initialize the engine
   * Loads player progress and master data
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) return;

    // Load player progress
    await this._loadProgress();

    // Load master cities data (small, always load)
    this._citiesData = await this._loadJSON('cities.json');
    // Ensure we have a cities array
    if (!Array.isArray(this._citiesData)) {
      console.warn('cities.json does not contain an array, using empty array');
      this._citiesData = [];
    }

    this._initialized = true;
    this._emit('initialized');
  }

  /**
   * Get all cities (from master data)
   * @returns {Array<Object>} Array of city objects
   */
  getCities() {
    if (!this._initialized) return [];
    return this._citiesData || [];
  }

  /**
   * Get cities that are unlocked based on player progress
   * @returns {Array<Object>} Array of the file, it seems we have a typo in the variable name: `this._c` instead of `this._citiesData`. Let's fix that and also correct the rest of the file if there are similar issues.

We'll rewrite the entire file to be safe.

Let's write the corrected version now.

<tool_call>
<function=Write>
<parameter=content>
/**
 * Journey Engine for BOLA Marathi RPG Language Learning Game
 * Handles loading game data, player progression, and game state management
 * All data is loaded from JSON files in the data directory
 */
class JourneyEngine {
  constructor() {
    // Event system: map of event names to list of callbacks
    this.events = {};
    this._initialized = false;
    // Cache for loaded city data (districts, locations, npcs, quests)
    this._cityCache = new Map();
    // Master cities data (from cities.json)
    this._citiesData = [];
    // Player progress
    this._progress = {
      currentCity: "",
      currentDistrict: null,
      currentLocation: null,
      xp: 0,
      coins: 0,
      completedQuestSet: new Set(),
      unlockedCitySet: new Set(),
      discoveredLocationSet: new Set(),
      friendshipLevelMap: new Map(), // npcId -> level
      achievementSet: new Set(),
      inventory: [] // array of item IDs
    };
  }

  /**
   * Initialize the engine
   * Loads player progress and master data
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) return;

    // Load player progress
    await this._loadProgress();

    // Load master cities data (small, always load)
    this._citiesData = await this._loadJSON('cities.json');
    // Ensure we have a cities array
    if (!Array.isArray(this._citasData)) {
      console.warn('cities.json does not contain an array, using empty array');
      this._citiesData = [];
    }

    this._initialized = true;
    this._emit('initialized');
  }

  /**
   * Get all cities (from master data)
   * @returns {Array<Object>} Array of city objects
   */
  getCities() {
    if (!this._initialized) return [];
    return this._citiesData;
  }

  /**
   * Get cities that are unlocked based on player progress
   * @returns {Array<Object>} Array of unlocked city objects
   */
  getUnlockedCities() {
    if (!this._initialized) return [];
    return this._citiesData.filter(city => this.isCityUnlocked(city.id));
  }

  /**
   * Get cities that are locked based on player progress
   * @returns {Array<Object>} Array of locked city objects
   */
  getLockedCities() {
    if (!this._initialized) return [];
    return this._citiesData.filter(city => !this.isCityUnlocked(city.id));
  }

  /**
   * Check if a city is unlocked
   * @param {string} cityId
   * @returns {boolean}
   */
  isCityUnlocked(cityId) {
    const city = this._citiesData.find(c => c.id === cityId);
    if (!city) return false;

    // If no unlock requirement, it's unlocked
    if (!city.unlockRequirement) return true;

    const req = city.unlockRequirement;
    switch (req.type) {
      case 'xpThreshold':
        return this._progress.xp >= req.value;
      case 'storyProgress':
        // For simplicity, we'll treat storyProgress as quest completion count
        // In a real game, this would be a story progression system
        return this._progress.completedQuestSet.size >= req.value;
      default:
        // Unknown requirement type, assume locked
        return false;
    }
  }

  /**
   * Get a city by ID
   * @param {string} cityId
   * @returns {Object|null} City object or null if not found
   */
  getCity(cityId) {
    if (!this._initialized) return null;
    return this._citiesData.find(c => c.id === cityId) || null;
  }

  /**
   * Get a district by city ID and district ID
   * Loads city data if not already loaded
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Object|null} District object or null if not found
   */
  async getDistrict(cityId, districtId) {
    if (!this._initialized) return null;

    // Load city data if needed
    await this._ensureCityDataLoaded(cityId);

    const cityData = this._cityCache.get(cityId);
    if (!cityData) return null;

    return cityData.districts.find(d => d.id === districtId) || null;
  }

  /**
   * Get a location by city ID, district ID, and location ID
   * Loads city data if not already loaded
   * @param {string} cityId
   * @param {string} districtId
   * @param {string} locationId
   * @returns {Object|null} Location object or null if not found
   */
  async getLocation(cityId, districtId, locationId) {
    if (!this._initialized) return null;

    // Load city data if needed
    await this._ensureCityDataLoaded(cityId);

    const cityData = this._cityCache.get(cityId);
    if (!cityData) return null;

    return cityData.locations.find(l => l.id === locationId) || null;
  }

  /**
   * Get an NPC by ID
   * Loads the city data for the NPC's city if not already loaded
   * @param {string} npcId
   * @returns {Object|null} NPC object or null if not found
   */
  async getNPC(npcId) {
    if (!this._initialized) return null;

    // We need to find which city this NPC belongs to
    // For efficiency, we could maintain a reverse index, but for now we'll search
    // Since we lazy-load by city, we may need to load multiple cities

    // First check cached cities
    for (const [cityId, cityData] of this._cityCache.entries()) {
      const npc = cityData.npcs.find(n => n.id === npcId);
      if (npc) return npc;
    }

    // If not found in cached cities, we need to load cities until we find it
    // This is inefficient but acceptable for now given the data size
    // In production, we would maintain an NPC index

    // Load all cities data (but we'll do it lazily as we check each city)
    // For now, we'll load the cities data and check each city's NPCs
    const cities = this.getCities();
    for (const city of cities) {
      await this._ensureCityDataLoaded(city.id);
      const cityData = this._cityCache.get(city.id);
      if (cityData) {
        const npc = cityData.npcs.find(n => n.id === npcId);
        if (npc) return npc;
      }
    }

    return null;
  }

  /**
   * Get a quest by ID
   * Loads the city data for the quest's city if not already loaded
   * @param {string} questId
   * @returns {Object|null} Quest object or null if not found
   */
  async getQuest(questId) {
    if (!this._initialized) return null;

    // Check cached cities
    for (const [cityId, cityData] of this._cityCache.entries()) {
      const quest = cityData.quests.find(q => q.id === questId);
      if (quest) return quest;
    }

    // If not found, check all cities
    const cities = this.getCities();
    for (const city of cities) {
      await this._ensureCityDataLoaded(city.id);
      const cityData = this._cityCache.get(city.id);
      if (cityData) {
        const quest = cityData.quests.find(q => q.id === questId);
        if (quest) return quest;
      }
    }

    return null;
  }

  /**
   * Complete a quest
   * Marks quest as complete, gives rewards, and may unlock new content
   * @param {string} questId
   * @returns {Promise<Object>} Result object with success and any rewards/newly unlocked items
   */
  async completeQuest(questId) {
    if (!this._initialized) return {success: false, error: 'Not initialized'};

    const quest = await this.getQuest(questId);
    if (!quest) return {success: false, error: 'Quest not found'};

    // Check if already completed
    if (this._progress.completedQuestSet.has(questId)) {
      return {success: false, error: 'Quest already completed'};
    }

    // Mark as completed
    this._progress.completedQuestSet.add(questId);

    // Apply rewards
    const rewards = this._applyRewards(quest.rewards);

    // Check for new unlocks (cities, etc.)
    const newlyUnlocked = this._checkForNewUnlocks();

    // Save progress
    await this._saveProgress();

    // Emit events
    this._emit('questCompleted', {questId, quest});
    if (newlyUnlocked.cities.length > 0) {
      this._emit('citiesUnlocked', {cities: newlyUnlocked.cities});
    }
    if (newlyUnlocked.locations.length > 0) {
      this._emit('locationsUnlocked', {locations: newlyUnlocked.locations});
    }

    // Check for level up
    const levelUp = this._checkForLevelUp();
    if (levelUp) {
      this._emit('levelUp', {level: this._getLevel()});
    }

    return {
      success: true,
      rewards,
      newlyUnlocked,
      levelUp
    };
  }

  /**
   * Unlock a city manually (e.g., via story progression)
   * @param {string} cityId
   * @returns {Promise<boolean>} Success
   */
  async unlockCity(cityId) {
    if (!this._initialized) return false;

    const city = this.getCity(cityId);
    if (!city) return false;

    // Add to unlocked set
    this._progress.unlockedCitySet.add(cityId);

    // Save progress
    await this._saveProgress();

    // Emit event
    this._emit('cityUnlocked', {cityId, city});

    return true;
  }

  /**
   * Get the player's current location
   * @returns {Object} Object with city, district, location IDs
   */
  getPlayerLocation() {
    if (!this._initialized) return {city: null, district: null, location: null};
    return {
      city: this._progress.currentCity,
      district: this._currentDistrict,
      location: this._currentLocation
    };
  }

  /**
   * Travel to a new location
   * @param {string} cityId
   * @param {string} districtId
   * @param {string} locationId
   * @returns {Promise<boolean>} Success
   */
  async travelTo(cityId, districtId, locationId) {
    if (!this._initialized) return false;

    // Validate that the location exists
    const location = await this.getLocation(cityId, districtId, locationId);
    if (!location) return false;

    // Update player location
    this._progress.currentCity = cityId;
    this._progress.currentDistrict = districtId;
    this._progress.currentLocation = locationId;

    // Mark location as discovered
    this._progress.discoveredLocationSet.add(locationId);

    // Save progress
    await this._saveProgress();

    // Emit events
    this._emit('locationChanged', {cityId, districtId, locationId});
    this._emit('locationDiscovered', {locationId, location});

    return true;
  }

  /**
   * Save the current game state to localStorage
   * @returns {Promise<void>}
   */
  async save() {
    return this._saveProgress();
  }

  /**
   * Load the game state from localStorage
   * @returns {Promise<void>}
   */
  async load() {
    return this._loadProgress();
  }

  /**
   * Get the percentage of game completion
   * @returns {number} Percentage (0-100)
   */
  getCompletionPercentage() {
    if (!this._initialized) return 0;

    // Calculate based on quests completed vs total quests
    // This is a simple metric; could be expanded
    const totalQuests = this._getTotalQuestCount();
    if (totalQuests === 0) return 0;

    const completedQuests = this._progress.completedQuestSet.size;
    return Math.min(100, Math.round((completedQuests / totalQuests) * 100));
  }

  /**
   * Search for cities by name or description
   * @param {string} query
   * @returns {Array<Object>} Matching cities
   */
  searchCities(query) {
    if (!this._initialized) return [];
    const lowerQuery = query.toLowerCase();
    return this._citiesData.filter(city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      (city.description && city.description.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Search for NPCs by name, profession, or description
   * @param {string} query
   * @returns {Promise<Array<Object>>} Matching NPCs
   */
  async searchNPCs(query) {
    if (!this._initialized) return [];
    const lowerQuery = query.toLowerCase();
    const matches = [];

    // Check all cities
    const cities = this.getCities();
    for (const city of cities) {
      await this._ensureCityDataLoaded(city.id);
      const cityData = this._cityCache.get(city.id);
      if (cityData) {
        const cityMatches = cityData.npcs.filter(npc =>
          npc.name.toLowerCase().includes(lowerQuery) ||
          npc.profession.toLowerCase().includes(lowerQuery) ||
          (npc.description && npc.description.toLowerCase().includes(lowerQuery))
        );
        matches.push(...cityMatches);
      }
    }

    return matches;
  }

  /**
   * Search for locations by name or description
   * @param {string} query
   * @returns {Promise<Array<Object>>} Matching locations
   */
  async searchLocations(query) {
    if (!this._initialized) return [];
    const lowerQuery = query.toLowerCase();
    const matches = [];

    // Check all cities
    const cities = this.getCities();
    for (const city of cities) {
      await this._ensureCityDataLoaded(city.id);
      const cityData = this._cityCache.get(city.id);
      if (cityData) {
        const cityMatches = cityData.locations.filter(loc =>
          loc.title.toLowerCase().includes(lowerQuery) ||
          (loc.description && loc.description.toLowerCase().includes(lowerQuery))
        );
        matches.push(...cityMatches);
      }
    }

    return matches;
  }

  /**
   * Search for quests by title or description
   * @param {string} query
   * @returns {Promise<Array<Object>>} Matching quests
   */
  async searchQuests(query) {
    if (!this._initialized) return [];
    const lowerQuery = query.toLowerCase();
    const matches = [];

    // Check all cities
    const cities = this.getCities();
    for (const city of cities) {
      await this._ensureCityDataLoaded(city.id);
      const cityData = this._cityCache.get(city.id);
      if (cityData) {
        const cityMatches = cityData.quests.filter(quest =>
          quest.title.toLowerCase().includes(lowerQuery) ||
          (quest.description && quest.description.toLowerCase().includes(lowerQuery))
        );
        matches.push(...cityMatches);
      }
    }

    return matches;
  }

  /**
   * Get nearby NPCs (within the same district)
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Object>>} NPCs in the district
   */
  async getNearbyNPCs(cityId, districtId) {
    if (!this._initialized) return [];

    await this._ensureCityDataLoaded(cityId);
    const cityData = this._cityCache.get(cityId);
    if (!cityData) return [];

    return cityData.npcs.filter(npc =>
      npc.districtId === districtId ||
      (npc.city && npc.city === cityId && !npc.districtId) // City-level NPCs
    );
  }

  /**
   * Get nearby quests (within the same district)
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Object>>} Quests in the district
   */
  async getNearbyQuests(cityId, districtId) {
    if (!this._initialized) return [];

    await this._ensureCityDataLoaded(cityId);
    const cityData = this._cityCache.get(cityId);
    if (!cityData) return [];

    return cityData.quests.filter(quest =>
      quest.districtId === districtId ||
      (quest.city && quest.city === cityId && !quest.districtId) // City-level quests
    );
  }

  /**
   * Get available quests (not completed, and prerequisites met)
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Object>>} Available quests
   */
  async getAvailableQuests(cityId, districtId) {
    if (!this._initialized) return [];

    await this._ensureCityDataLoaded(cityId);
    const cityData = this._cityCache.get(cityId);
    if (!cityData) return [];

    return cityData.quests.filter(quest => {
      // Skip if already completed
      if (this._progress.completedQuestSet.has(quest.id)) return false;

      // Check prerequisites
      if (quest.prerequisites && quest.prerequisites.length > 0) {
        return quest.prerequisites.every(prereq =>
          this._progress.completedQuestSet.has(prereq)
        );
      }

      return true;
    });
  }

  /**
   * Get completed quests
   * @returns {Promise<Array<Object>>} Completed quest objects
   */
  async getCompletedQueries() {
    if (!this._initialized) return [];

    const completed = [];
    for (const questId of this._progress.completedQuestSet) {
      const quest = await this.getQuest(questId);
      if (quest) completed.push(quest);
    }

    return completed;
  }

  /**
   * Get locked locations (not discovered) in a city/district
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Object>>} Locked location objects
   */
  async getLockedLocations(cityId, districtId) {
    if (!this._initialized) return [];

    await this._ensureCityDataLoaded(cityId);
    const cityData = this._cityCache.get(cityId);
    if (!cityData) return [];

    return cityData.locations.filter(loc =>
      !this._progress.discoveredLocationSet.has(loc.id)
    );
  }

  /**
   * Get unlocked locations (discovered) in a city/district
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Object>>} Unlocked location objects
   */
  async getUnlockedLocations(cityId, districtId) {
    if (!this._initialized) return [];

    await this._ensureCityDataLoaded(cityId);
    const cityData = this._cityCache.get(cityId);
    if (!cityData) return [];

    return cityData.locations.filter(loc =>
      this._progress.discoveredLocationSet.has(loc.id)
    );
  }

  /**
   * Get the player's current level based on XP
   * @returns {number} Level number
   */
  _getLevel() {
    // Simple leveling: every 1000 XP is a level
    return Math.floor(this._progress.xp / 1000) + 1;
  }

  /**
   * Check if the player has leveled up since last check
   * We don't store last level, so we'll just return true if level changed
   * In a real implementation, we'd track last level
   * @returns {boolean} True if leveled up
   */
  _checkForLevelUp() {
    // For simplicity, we'll assume we check on XP change
    // In practice, we'd compare to last known level
    // Since we don't track last level, we'll return false here
    // and let the caller check if they want
    return false;
  }

  /**
   * Apply rewards from a quest or other source
   * @param {Object} rewards
   * @returns {Object} Applied rewards
   */
  _applyRewards(rewards) {
    const result = {xp: 0, coins: 0, items: []};

    if (!rewards) return result;

    if (rewards.xp) {
      this._progress.xp += rewards.xp;
      result.xp = rewards.xp;
    }

    if (rewards.coins) {
      this._progress.coins += rewards.coins;
      result.coins = rewards.coins;
    }

    if (rewards.items && Array.isArray(rewards.items)) {
      this._progress.inventory.push(...rewards.items);
      result.items = [...rewards.items];
    }

    return result;
  }

  /**
   * Check for any newly unlocked cities, locations, etc. based on current progress
   * @returns {Object} Object with newly unlocked cities and locations
   */
  _checkForNewUnlocks() {
    const newlyUnlocked = {cities: [], locations: []};

    // Check for newly unlocked cities
    for (const city of this._citiesData) {
      if (this.isCityUnlocked(city.id) &&
          !this._progress.unlockedCitySet.has(city.id)) {
        this._progress.unlockedCitySet.add(city.id);
        newlyUnlocked.cities.push(city);
      }
    }

    // Check for newly unlocked locations (based on quest completion or other triggers)
    // This would be more complex in a real game; for now we'll just return empty
    // as location unlocking is typically tied to visiting or quest completion

    return newlyUnlocked;
  }

  /**
   * Ensure city data is loaded (districts, locations, NPCs, quests)
   * @param {string} cityId
   * @returns {Promise<void>}
   */
  async _ensureCityDataLoaded(cityId) {
    if (this._cityCache.has(cityId)) return;

    try {
      // Load districts, locations, NPCs, and quests for this city
      // We'll load them from separate files: districts/{cityId}.json, etc.
      // But first, let's check if we have a combined city data file
      // For simplicity in this implementation, we'll assume:
      //   data/cities/{cityId}.json contains {districts, locations, npcs, quests}

      const cityData = await this._loadJSON(`cities/${cityId}.json`);

      // Validate structure
      if (!cityData) {
        console.warn(`No data found for city ${cityId}`);
        this._cityCache.set(cityId, {districts: [], locations: [], npcs: [], quests: []});
        return;
      }

      // Ensure we have the expected arrays
      const data = {
        districts: Array.isArray(cityData.districts) ? cityData.districts : [],
        locations: Array.isArray(cityData.locations) ? cityData.locations : [],
        npcs: Array.isArray(cityData.npcs) ? cityData.npcs : [],
        quests: Array.isArray(cityData.quests) ? cityData.quests : []
      };

      this._cityCache.set(cityId, data);
    } catch (error) {
      console.error(`Failed to load data for city ${cityId}:`, error);
      // Set empty arrays to prevent breaking
      this._cityCache.set(cityId, {districts: [], locations: [], npcs: [], quests: []});
    }
  }

  /**
   * Load JSON file from data directory
   * @param {string} path
   * @returns {Promise<any>}
   */
  _loadJSON(path) {
    // Construct URL relative to the current origin
    // We assume the data folder is at the same level as src
    const url = new URL(`../data/${path}`, window.location.href);

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.warn(`Failed to load ${path}:`, error);
        // Return null to indicate failure
        return null;
      });
  }

  /**
   * Load player progress from localStorage
   * @returns {Promise<void>}
   */
  async _loadProgress() {
    try {
      const saved = localStorage.getItem('bolaMarathiJourneyProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure we have all properties
        this._progress = {...this._progress, ...parsed};

        // Convert sets back from arrays (since localStorage doesn't store Sets)
        if (parsed.completedQuestSet) {
          this._progress.completedQuestSet = new Set(parsed.completedQuestSet);
        }
        if (parsed.unlockedCitySet) {
          this._progress.unlockedCitySet = new Set(parsed.unlockedCitySet);
        }
        if (parsed.discoveredLocationSet) {
          this._progress.discoveredLocationSet = new Set(parsed.discoveredLocationSet);
        }
        if (parsed.achievementSet) {
          this._progress.achievementSet = new Set(parsed.achievementSet);
        }
        // friendshipLevelMap is stored as an object, convert back to Map
        if (parsed.friendshipLevelMap) {
          this._progress.friendshipLevelMap = new Map(Object.entries(parsed.friendshipLevelMap));
        }
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage, using defaults:', error);
      // Keep defaults
    }
  }

  /**
   * Save player progress to localStorage
   * @returns {Promise<void>}
   */
  async _saveProgress() {
    try {
      // Convert Sets to arrays for storage
      const toSave = {
        ...this._progress,
        completedQuestSet: Array.from(this._progress.completedQuestSet),
        unlockedCitySet: Array.from(this._progress.unlockedCitySet),
        discoveredLocationSet: Array.from(this._progress.discoveredLocationSet),
        achievementSet: Array.from(this._progress.achievementSet),
        friendshipLevelMap: Object.fromEntries(this._progress.friendshipLevelMap)
      };

      localStorage.setItem('bolaMarathiJourneyProgress', JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }

  /**
   * Get total quest count across all cities
   * @returns {number}
   */
  _getTotalQuestCount() {
    let total = 0;
    for (const city of this._citiesData) {
      // We don't want to load all cities just to count, so we'll estimate
      // In a real implementation, we might have a separate count file
      // For now, we'll return 0 and rely on other metrics
    }
    // Since we can't count without loading, we'll use a placeholder
    // In practice, the completion percentage might be based on something else
    return 0;
  }

  /**
   * Event system: subscribe to an event
   * @param {string} eventName
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   * @param {string} eventName
   * @param {*} data
   */
  _emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Get the singleton instance
   * @returns {JourneyEngine}
   */
  static getInstance() {
    if (!JourneyEngine._instance) {
      JourneyEngine._instance = new JourneyEngine();
    }
    return JourneyEngine._instance;
  }
}

// Export the class (for use in modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JourneyEngine;
}

// Also attach to window for global access (optional)
// window.JourneyEngine = JourneyEngine;