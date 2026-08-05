/**
 * Scenario Loader for BOLA Marathi RPG Language Learning Game
 * Loads real-life learning scenarios from JSON files in the data/scenarios directory.
 * Each scenario represents one practical Marathi conversation.
 */
class ScenarioLoader {
  /**
   * @typedef {Object} Scenario
   * @property {string} id - Unique identifier
   * @property {string} title - Scenario title
   * @property {string} description - Scenario description
   * @property {string} city - City ID where the scenario takes place
   * @property {string} district - District ID within the city
   * @property {string} location - Location ID within the district
   * @property {string} difficulty - Difficulty level (e.g., beginner, intermediate)
   * @property {number} estimatedMinutes - Estimated time to complete in minutes
   * @property {number} xpReward - XP reward for completing
   * @property {string} thumbnail - Thumbnail image path
   * @property {string} coverImage - Cover image path
   * @property {string} npc - Primary NPC ID involved
   * @property {string} conversationId - ID of the associated conversation
   * @property {Array<string>} vocabularyIds - List of vocabulary word IDs to learn
   * @property {Array<string>} grammarTopics - List of grammar topics covered
   * @property {Array<string>} cultureNotes - List of cultural notes to discover
   * @property {Array<string>} learningObjectives - List of learning objectives
   * @property {Array<string>} tags - Tags for categorization
   */

  constructor() {
    /** @private @type {Array<Scenario>|null} */
    this._allScenariosCache = null;
    /** @private @type {Map<string, Scenario>} */
    this._scenarioByIdCache = new Map();
  }

  /**
   * Load all scenarios from the data/scenarios directory.
   * @returns {Promise<Array<Scenario>>} Promise that resolves to an array of scenario objects
   */
  async loadScenarios() {
    // Return cached result if available
    if (this._allScenariosCache !== null) {
      return this._allScenariosCache;
    }

    // Start loading and cache the promise
    this._allScenariosCache = this._loadAllScenariosInternal();
    return this._allScenariosCache;
  }

  /**
   * Get a scenario by its ID.
   * @param {string} id - The scenario ID
   * @returns {Promise<Scenario|null>} Promise that resolves to the scenario object or null if not found/invalid
   */
  async getScenario(id) {
    // Return cached result if available
    if (this._scenarioByIdCache.has(id)) {
      return Promise.resolve(this._scenarioByIdCache.get(id));
    }

    // Load the scenario, cache it, and return it
    const scenario = await this._loadScenarioById(id);
    if (scenario) {
      this._scenarioByIdCache.set(id, scenario);
    }
    return scenario || null;
  }

  /**
   * Get all scenarios for a given city.
   * @param {string} cityId - The ID of the city
   * @returns {Promise<Array<Scenario>>} Promise that resolves to matching scenarios
   */
  async getScenariosByCity(cityId) {
    const scenarios = await this.loadScenarios();
    return scenarios.filter(scenario => scenario.city === cityId);
  }

  /**
   * Get all scenarios filtered by difficulty level.
   * @param {string} level - The difficulty level (e.g., beginner, intermediate)
   * @returns {Promise<Array<Scenario>>} Promise that resolves to matching scenarios
   */
  async getScenariosByDifficulty(level) {
    const scenarios = await this.loadScenarios();
    return scenarios.filter(scenario => scenario.difficulty === level);
  }

  /**
   * Search scenarios by keyword in title or description.
   * @param {string} keyword - The search term
   * @returns {Promise<Array<Scenario>>} Promise that resolves to matching scenarios
   */
  async searchScenarios(keyword) {
    const scenarios = await this.loadScenarios();
    const lowerKeyword = keyword.toLowerCase();
    return scenarios.filter(scenario =>
      scenario.title.toLowerCase().includes(lowerKeyword) ||
      scenario.description.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Clear the loader's cache.
   * Forces reload of all scenario data on next request.
   */
  clearCache() {
    this._allScenariosCache = null;
    this._scenarioByIdCache.clear();
  }

  /**
   * @private
   * @returns {Promise<Array<string>>} Promise that resolves to an array of scenario IDs
   */
  async _loadScenarioIdsManifest() {
    try {
      const response = await fetch('../data/scenarios.json');
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Scenario manifest not found: data/scenarios.json');
        } else {
          console.warn(`Failed to load scenario manifest: HTTP ${response.status}`);
        }
        return [];
      }
      const data = await response.json();
      // Expecting manifest to be an array of scenario ID strings
      if (Array.isArray(data)) {
        return data.filter(id => typeof id === 'string' && id.trim() !== '');
      } else {
        console.warn('Scenario manifest is not an array of IDs');
        return [];
      }
    } catch (error) {
      console.error('Error loading scenario manifest:', error);
      return [];
    }
  }

  /**
   * @private
   * @param {string} id - The scenario ID
   * @returns {Promise<Scenario|null>} Promise that resolves to the scenario object or null if not found/invalid
   */
  async _loadScenarioById(id) {
    try {
      const url = new URL(`../data/scenarios/${id}.json`, window.location.href);
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Scenario file not found: ${id}.json`);
        } else {
          console.warn(`Failed to load scenario ${id}: HTTP ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      // Validate required fields
      if (this._isValidScenario(data)) {
        return data;
      } else {
        console.warn(`Invalid scenario data for ${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error loading scenario ${id}:`, error);
      return null;
    }
  }

  /**
   * @private
   * @param {Array<string>} ids - Array of scenario IDs
   * @returns {Promise<Array<Scenario>>} Promise that resolves to an array of scenario objects
   */
  async _loadAllScenariosInternal() {
    try {
      // Load the manifest to get the list of scenario IDs
      const scenarioIds = await this._loadScenarioIdsManifest();
      if (scenarioIds.length === 0) {
        return [];
      }

      // Load each scenario file
      const scenarioPromises = scenarioIds.map(id => this._loadScenarioById(id));
      const scenarios = await Promise.all(scenarioPromises);

      // Filter out any failed loads (null values) and cache valid ones
      const validScenarios = scenarios.filter(scenario => scenario !== null);
      validScenarios.forEach(scenario => {
        this._scenarioByIdCache.set(scenario.id, scenario);
      });

      return validScenarios;
    } catch (error) {
      console.error('Error loading all scenarios:', error);
      return [];
    }
  }

  /**
   * @private
   * @param {Object} scenario - The scenario object to validate
   * @returns {boolean}
   */
  _isValidScenario(scenario) {
    return scenario &&
           typeof scenario.id === 'string' && scenario.id.trim() !== '' &&
           typeof scenario.title === 'string' && scenario.title.trim() !== '' &&
           typeof scenario.description === 'string' && scenario.description.trim() !== '' &&
           typeof scenario.city === 'string' && scenario.city.trim() !== '' &&
           typeof scenario.district === 'string' && scenario.district.trim() !== '' &&
           typeof scenario.location === 'string' && scenario.location.trim() !== '' &&
           typeof scenario.difficulty === 'string' && scenario.difficulty.trim() !== '' &&
           typeof scenario.estimatedMinutes === 'number' && !isNaN(scenario.estimatedMinutes) &&
           typeof scenario.xpReward === 'number' && !isNaN(scenario.xpReward) &&
           typeof scenario.thumbnail === 'string' && scenario.thumbnail.trim() !== '' &&
           typeof scenario.coverImage === 'string' && scenario.coverImage.trim() !== '' &&
           typeof scenario.npc === 'string' && scenario.npc.trim() !== '' &&
           typeof scenario.conversationId === 'string' && scenario.conversationId.trim() !== '' &&
           Array.isArray(scenario.vocabularyIds) && scenario.vocabularyIds.every(id => typeof id === 'string') &&
           Array.isArray(scenario.grammarTopics) && scenario.grammarTopics.every(topic => typeof topic === 'string') &&
           Array.isArray(scenario.cultureNotes) && scenario.cultureNotes.every(note => typeof note === 'string') &&
           Array.isArray(scenario.learningObjectives) && scenario.learningObjectives.every(obj => typeof obj === 'string') &&
           Array.isArray(scenario.tags) && scenario.tags.every(tag => typeof tag === 'string');
  }
}

// Export a singleton instance
const scenarioLoader = new ScenarioLoader();
export { scenarioLoader };

// Also export the class for direct instantiation if needed
export { ScenarioLoader };