/**
 * BOLA Marathi — IndexedDB API Queries Cache
 * Infrastructure Layer
 * 
 * Implements a local IndexedDB cache storing SHA-256 hashed API queries
 * to minimize external token utilization and provide offline fallbacks.
 */

export const QueryCache = (() => {
  const DB_NAME = 'bolaMarathi_api_cache';
  const DB_VERSION = 1;
  const STORE_NAME = 'responses';
  let _db = null;

  /**
   * Initialize IndexedDB database stores
   * @returns {Promise<void>}
   */
  function init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
        }
      };

      request.onsuccess = (e) => {
        _db = e.target.result;
        resolve();
      };

      request.onerror = (e) => {
        console.error("IndexedDB cache open failed:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * Helper to compute SHA-256 hex string client-side
   * @param {string} text - The search/query input
   * @returns {Promise<string>} - Hex hash string
   */
  async function getSha256Hash(text) {
    const msgBuffer = new TextEncoder().encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Fetch cached response from IndexedDB
   * @param {string} type - 'correct' | 'doubt'
   * @param {string} queryText - User sentence or doubt text
   * @returns {Promise<Object|null>} - Returns parsed JSON response or null
   */
  async function get(type, queryText) {
    if (!_db) await init();
    
    const rawKey = `${type}:${queryText.trim().toLowerCase()}`;
    const hash = await getSha256Hash(rawKey);

    return new Promise((resolve) => {
      const transaction = _db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(hash);

      request.onsuccess = (e) => {
        const record = e.target.result;
        resolve(record ? record.response : null);
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  }

  /**
   * Save API response into IndexedDB cache
   * @param {string} type - 'correct' | 'doubt'
   * @param {string} queryText - User sentence or doubt text
   * @param {Object} responseObj - The response JSON payload
   * @returns {Promise<void>}
   */
  async function set(type, queryText, responseObj) {
    if (!_db) await init();

    const rawKey = `${type}:${queryText.trim().toLowerCase()}`;
    const hash = await getSha256Hash(rawKey);

    return new Promise((resolve, reject) => {
      const transaction = _db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record = {
        hash,
        rawKey,
        type,
        timestamp: Date.now(),
        response: responseObj
      };

      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  return {
    init,
    get,
    set
  };
})();
