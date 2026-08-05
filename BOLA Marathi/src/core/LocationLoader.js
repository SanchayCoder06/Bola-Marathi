/**
 * Location Loader for BOLA Marathi RPG Language Learning Game
 * Loads location data for a specific district from JSON files.
 */
class LocationLoader {
  /**
   * @typedef {Object} Location
   * @property {string} id - Unique identifier
   * @property {string} name - Display name
   * @property {string} description - Location description
   * @property {string} image - Main image path
   * @property {string} thumbnail - Thumbnail image path
   * @property {string|Array<string>} ambientSound - Ambient sound identifiers
   * @property {string|Array<string>} backgroundMusic - Background music identifiers
   * @property {string} difficulty - Difficulty level (e.g., beginner, intermediate)
   * @property {number} requiredLevel - Minimum player level to access
   * @property {number} xpReward - XP reward for completing
   * @property {number} coinReward - Coin reward for completing
   * @property {Array<string>} npcIds - List of NPC IDs present
   * @property {Array<string>} questIds - List of quest IDs available
   * @property {Array<string>} discoverableItems - List<string>} discoverableItems - List of item IDs that can be discovered
   * @property {Array<string>} vocabulary - List of vocabulary words to learn
   * @property {Array<string>} grammarTopics - List of grammar topics covered
   * @property {Array<string>} cultureFacts - List of culture facts to discover
   * @property {Array<string>} tags - Tags for categorization
   * @property {Object} coordinates - Map coordinates
   * @property {number} coordinates.latitude
   * @property {number} coordinates.longitude
   * @property {'active'|'locked'|'completed'|'discovered'} status - Current status
   */

  constructor() {
    /** @private @type {Map<string, Array<Location>>} */
    this.cache = new Map();
  }

  /**
   * Load all locations for a given city and district.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district
   * @returns {Promise<Array<Location>>} Promise that resolves to an array of location objects
   */
  async loadLocations(cityId, districtId) {
    const cacheKey = `${cityId}:${districtId}`;

    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Load locations from file
    const locations = await this._loadLocationsForDistrict(cityId, districtId);
    this.cache.set(cacheKey, locations);
    return locations;
  }

  /**
   * Get a specific location by ID for a city and district.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district
   * @param {string} locationId - The ID of the location to retrieve
   * @returns {Promise<Location|null>} Promise that resolves to the location object or null if not found
   */
  async getLocation(cityId, districtId, locationId) {
    const locations = await this.loadLocations(cityId, districtId);
    return locations.find(loc => loc.id === locationId) || null;
  }

  /**
   * Get locations filtered by difficulty for a city and district.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district
   * @param {string} difficulty - The difficulty level to filter by
   * @returns {Promise<Array<Location>>} Promise that resolves to matching locations
   */
  async getLocationsByDifficulty(cityId, districtId, difficulty) {
    const locations = await this.loadLocations(cityId, districtId);
    return locations.filter(loc => loc.difficulty === difficulty);
  }

  /**
   * Get nearby locations (same district) - placeholder for future spatial queries.
   * Currently returns all locations in the district.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district
   * @returns {Promise<Array<Location>>} Promise that resolves to locations in the district
   */
  async getNearbyLocations(cityId, districtId) {
    // For now, nearby means same district (same as loadLocations)
    // Future: could use coordinates for distance-based filtering
    return this.loadLocations(cityId, districtId);
  }

  /**
   * Search locations by keyword in name or description.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district
   * @param {string} keyword - The search term
   * @returns {Promise<Array<Location>>} Promise that resolves to matching locations
   */
  async searchLocations(cityId, districtId, keyword) {
    const locations = await this.loadLocations(cityId, districtId);
    const lowerKeyword = keyword.toLowerCase();
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(lowerKeyword) ||
      loc.description.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Clear the loader's cache.
   * Forces reload of all location data on next request.
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * @private
   * @param {string} cityId
   * @param {string} districtId
   * @returns {Promise<Array<Location>>}
   */
  async _loadLocationsForDistrict(cityId, districtId) {
    try {
      const url = new URL(`../data/cities/${cityId}/${districtId}/locations.json`, window.location.href);
      const response = await fetch(url);

      // If file not found or other HTTP error, return empty array
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Location file not found for city ${cityId}, district ${districtId}`);
        } else {
          console.warn(`Failed to load locations for city ${cityId}, district ${districtId}: HTTP ${response.status}`);
        }
        return [];
      }

      const data = await response.json();

      // Expect data to be an object with a "locations" array
      const locationsArray = Array.isArray(data.locations) ? data.locations : [];

      // Validate each location and filter out invalid ones
      const validLocations = locationsArray.filter(location => this._isValidLocation(location));

      // Log warnings for invalid locations
      const invalidCount = locationsArray.length - validLocations.length;
      if (invalidCount > 0) {
        console.warn(`Skipped ${invalidCount} invalid location(s) for city ${cityId}, district ${districtId}`);
      }

      return validLocations;
    } catch (error) {
      console.error(`Error loading locations for city ${cityId}, district ${districtId}:`, error);
      return [];
    }
  }

  /**
   * @private
   * @param {Object} location - The location object to validate
   * @returns {boolean}
   */
  _isValidLocation(location) {
    return location &&
           typeof location.id === 'string' && location.id.trim() !== '' &&
           typeof location.name === 'string' && location.name.trim() !== '' &&
           typeof location.description === 'string' && location.description.trim() !== '' &&
           typeof location.image === 'string' && location.image.trim() !== '' &&
           typeof location.thumbnail === 'string' && location.thumbnail.trim() !== '' &&
           (typeof location.ambientSound === 'string' || Array.isArray(location.ambientSound)) &&
           (typeof location.backgroundMusic === 'string' || Array.isArray(location.backgroundMusic)) &&
           typeof location.difficulty === 'string' && location.difficulty.trim() !== '' &&
           typeof location.requiredLevel === 'number' && !isNaN(location.requiredLevel) &&
           typeof location.xpReward === 'number' && !isNaN(location.xpReward) &&
           typeof location.coinReward === 'number' && !isNaN(location.coinReward) &&
           Array.isArray(location.npcIds) && location.npcIds.every(id => typeof id === 'string') &&
           Array.isArray(location.questIds) && location.questIds.every(id => typeof id === 'string') &&
           Array.isArray(location.discoverableItems) && location.discoverableItems.every(id => typeof id === 'string') &&
           Array.isArray(location.vocabulary) && location.vocabulary.every(word => typeof word === 'string') &&
           Array.isArray(location.grammarTopics) && location.grammarTopics.every(topic => typeof topic === 'string') &&
           Array.isArray(location.cultureFacts) && location.cultureFacts.every(fact => typeof fact === 'string') &&
           Array.isArray(location.tags) && location.tags.every(tag => typeof tag === 'string') &&
           typeof location.coordinates === 'object' && location.coordinates !== null &&
           typeof location.coordinates.latitude === 'number' && !isNaN(location.coordinates.latitude) &&
           typeof location.coordinates.longitude === 'number' && !isNaN(location.coordinates.longitude) &&
           (location.status === 'active' || location.status === 'locked' || location.status === 'completed' || location.status === 'discovered');
  }
}

// Export a singleton instance
const locationLoader = new LocationLoader();
export { locationLoader };

// Also export the class for direct instantiation if needed
export { LocationLoader };