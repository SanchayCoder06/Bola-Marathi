/**
 * City Loader for BOLA Marathi RPG Language Learning Game
 * Loads city data from JSON files in the data/cities directory.
 */
class CityLoader {
  /**
   * @typedef {Object} City
   * @property {string} id - Unique identifier
   * @property {string} name - Display name
   * @property {string} description - City description
   * @property {Object} coordinates - Latitude and longitude
   * @property {number} coordinates.latitude
   * @property {number} coordinates.longitude
   * @property {string} backgroundImage - Path to background image
   * @property {string} mapImage - Path to map image
   * @property {string} themeColor - Hex color for UI theme
   * @property {Object} unlockRequirement - Unlock condition
   * @property {'xpThreshold'|'storyProgress'} unlockRequirement.type
   * @property {number} unlockRequirement.value
   * @property {string} [unlockRequirement.description] - Description of requirement
   * @property {number} unlockXp - XP required to unlock (duplicate? but keep)
   * @property {Array<string>} districts - List of district IDs in this city
   */

  constructor() {
    /** @private @type {Map<string, City>} */
    this.cache = new Map();
  }

  /**
   * Load all cities from data/cities.
   * @returns {Promise<Array<City>>} Promise that resolves to an array of city objects
   */
  async loadCities() {
    // If we have cached all cities, return them
    if (this._allCitiesCache !== undefined) {
      return this._allCitiesCache;
    }

    try {
      // First, load the manifest to get the list of city IDs (if using cities.json)
      // However requirement says load all cities from data/cities directory.
      // We'll try to read the directory? Not possible via fetch directly.
      // Alternative: Expect a manifest file data/cities.json that lists city IDs.
      // We'll follow the pattern from JourneyEngine: load cities.json which contains a cities array.
      const manifestResponse = await fetch('../data/cities.json');
      if (!manifestResponse.ok) {
        console.warn('Failed to load cities manifest:', manifestResponse.status);
        return [];
      }
      const manifest = await manifestResponse.json();
      const cityIds = Array.isArray(manifest.cities) ? manifest.cities.map(c => c.id) : [];

      // Load each city file
      const cities = await Promise.all(
        cityIds.map(id => this._loadCityFile(id))
      );

      // Filter out null results (failed loads)
      const validCities = cities.filter(Boolean);
      this._allCitiesCache = Promise.resolve(validCities);
      return validCities;
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  }

  /**
   * Load a specific city by ID.
   * @param {string} cityId - The ID of the city to load
   * @returns {Promise<City|null>} Promise that resolves to the city object or null if not found
   */
  async loadCity(cityId) {
    // Check cache first
    if (this.cache.has(cityId)) {
      return this.cache.get(cityId);
    }

    const city = await this._loadCityFile(cityId);
    if (city) {
      this.cache.set(cityId, city);
    }
    return city || null;
  }

  /**
   * Get a city by ID (alias for loadCity).
   * @param {string} cityId
   * @returns {Promise<City|null>}
   */
  async getCity(cityId) {
    return this.loadCity(cityId);
  }

  /**
   * Clear the loader's cache.
   */
  clearCache() {
    this.cache.clear();
    this._allCitiesCache = undefined;
  }

  /**
   * @private
   * @param {string} cityId
   * @returns {Promise<City|null>}
   */
  async _loadCityFile(cityId) {
    try {
      const url = new URL(`../data/cities/${cityId}.json`, window.location.href);
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`City file not found for ${cityId}`);
        } else {
          console.warn(`Failed to load city ${cityId}: HTTP ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      // Validate required fields
      if (this._isValidCity(data)) {
        return data;
      } else {
        console.warn(`Invalid city data for ${cityId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error loading city ${cityId}:`, error);
      return null;
    }
  }

  /**
   * @private
   * @param {Object} city
   * @returns {boolean}
   */
  _isValidCity(city) {
    return city &&
           typeof city.id === 'string' && city.id.trim() !== '' &&
           typeof city.name === 'string' && city.name.trim() !== '' &&
           typeof city.description === 'string' && city.description.trim() !== '' &&
           typeof city.coordinates === 'object' && city.coordinates !== null &&
           typeof city.coordinates.latitude === 'number' &&
           typeof city.coordinates.longitude === 'number' &&
           typeof city.backgroundImage === 'string' && city.backgroundImage.trim() !== '' &&
           typeof city.mapImage === 'string' && city.mapImage.trim() !== '' &&
           typeof city.themeColor === 'string' && city.themeColor.trim() !== '' &&
           typeof city.unlockRequirement === 'object' && city.unlockRequirement !== null &&
           (city.unlockRequirement.type === 'xpThreshold' || city.unlockRequirement.type === 'storyProgress') &&
           typeof city.unlockRequirement.value === 'number' &&
           typeof city.unlockXp === 'number' &&
           Array.isArray(city.districts) &&
           city.districts.every(d => typeof d === 'string');
  }
}

// Export a singleton instance
const cityLoader = new CityLoader();
export { cityLoader };

// Also export the class for direct instantiation if needed
export { CityLoader };