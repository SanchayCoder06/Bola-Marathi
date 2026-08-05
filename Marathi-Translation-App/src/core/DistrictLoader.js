/**
 * District Loader for BOLA Marathi RPG Language Learning Game
 * Loads district data for a specific city from JSON files.
 */
class DistrictLoader {
  /**
   * @typedef {Object} District
   * @property {string} id - Unique identifier
   * @property {string} name - Display name
   * @property {string} description - District description
   * @property {string} image - Image path
   * @property {string|Array<string>} ambientSound - Ambient sound identifiers
   * @property {Object} weather - Weather configuration
   * @property {Array<string>} locations - List of location IDs in this district
   * @property {string} difficulty - Difficulty level (e.g., beginner, intermediate)
   */

  constructor() {
    /** @private @type {Map<string, Array<District>>} */
    this.cache = new Map();
  }

  /**
   * Load all districts for a given city.
   * @param {string} cityId - The ID of the city to load districts for
   * @returns {Promise<Array<District>>} Promise that resolves to an array of district objects
   */
  async loadDistricts(cityId) {
    // Return cached result if available
    if (this.cache.has(cityId)) {
      return this.cache.get(cityId);
    }

    // Load districts from file
    const districts = await this._loadDistrictsForCity(cityId);
    this.cache.set(cityId, districts);
    return districts;
  }

  /**
   * Get a specific district by ID for a city.
   * @param {string} cityId - The ID of the city
   * @param {string} districtId - The ID of the district to retrieve
   * @returns {Promise<District|null>} Promise that resolves to the district object or null if not found
   */
  async getDistrict(cityId, districtId) {
    const districts = await this.loadDistricts(cityId);
    return districts.find(district => district.id === districtId) || null;
  }

  /**
   * Clear the loader's cache.
   * Forces reload of all district data on next request.
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * @private
   * @param {string} cityId
   * @returns {Promise<Array<District>>}
   */
  async _loadDistrictsForCity(cityId) {
    try {
      const url = new URL(`../data/cities/${cityId}/districts.json`, window.location.href);
      const response = await fetch(url);

      // If file not found or other HTTP error, return empty array
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`District file not found for city ${cityId}`);
        } else {
          console.warn(`Failed to load districts for city ${cityId}: HTTP ${response.status}`);
        }
        return [];
      }

      const data = await response.json();

      // Expect data to be an object with a "districts" array
      const districtsArray = Array.isArray(data.districts) ? data.districts : [];

      // Validate each district and filter out invalid ones
      const validDistricts = districtsArray.filter(district => this._isValidDistrict(district));

      // Log warnings for invalid districts
      const invalidCount = districtsArray.length - validDistricts.length;
      if (invalidCount > 0) {
        console.warn(`Skipped ${invalidCount} invalid district(s) for city ${cityId}`);
      }

      return validDistricts;
    } catch (error) {
      console.error(`Error loading districts for city ${cityId}:`, error);
      return [];
    }
  }

  /**
   * @private
   * @param {Object} district - The district object to validate
   * @returns {boolean}
   */
  _isValidDistrict(district) {
    return district &&
           typeof district.id === 'string' && district.id.trim() !== '' &&
           typeof district.name === 'string' && district.name.trim() !== '' &&
           typeof district.description === 'string' && district.description.trim() !== '' &&
           typeof district.image === 'string' && district.image.trim() !== '' &&
           (typeof district.ambientSound === 'string' || Array.isArray(district.ambientSound)) &&
           typeof district.weather === 'object' && district.weather !== null &&
           Array.isArray(district.locations) &&
           typeof district.difficulty === 'string' && district.difficulty.trim() !== '';
  }
}

// Export a singleton instance
const districtLoader = new DistrictLoader();
export { districtLoader };

// Also export the class for direct instantiation if needed
export { DistrictLoader };