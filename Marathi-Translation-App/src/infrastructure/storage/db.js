/**
 * BOLA Marathi — IndexedDB Database Layer
 * Infrastructure Layer
 */

export const DBService = (() => {
  const DB_NAME = 'bola_marathi_db';
  const DB_VERSION = 1;
  let _db = null;

  function open() {
    if (_db) return Promise.resolve(_db);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('cities')) {
          db.createObjectStore('cities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('chapters')) {
          db.createObjectStore('chapters', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('stories')) {
          db.createObjectStore('stories', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dialogueTrees')) {
          db.createObjectStore('dialogueTrees', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dictionary')) {
          db.createObjectStore('dictionary', { keyPath: 'word' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('revisionQueue')) {
          db.createObjectStore('revisionQueue', { keyPath: 'word' });
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'word' });
        }
        if (!db.objectStoreNames.contains('aiHistory')) {
          db.createObjectStore('aiHistory', { keyPath: 'timestamp' });
        }
      };

      request.onsuccess = (event) => {
        _db = event.target.result;
        resolve(_db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async function get(storeName, key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAll(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function put(storeName, value) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function remove(storeName, key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function clear(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Seed the database with assets from static JSON if empty
   */
  async function seedIfEmpty() {
    try {
      const db = await open();
      
      console.log("Checking and seeding IndexedDB stores if empty...");

      // Force upgrade of static metadata if seed version mismatch
      const CURRENT_SEED_VERSION = 3;
      const seedStatus = await get('progress', 'seed_version');
      if (!seedStatus || seedStatus.value !== CURRENT_SEED_VERSION) {
        console.log("Static metadata version mismatch. Clearing static caches...");
        await clear('cities');
        await clear('dialogueTrees');
        await clear('dictionary');
        // Initialize the seed version flag
        await put('progress', { key: 'seed_version', value: CURRENT_SEED_VERSION });
      }

      // 1. Seed Cities
      const existingCities = await getAll('cities');
      if (existingCities.length === 0) {
        console.log("Seeding Cities store...");
        const resCities = await fetch('data/cities/cities.json');
        if (resCities.ok) {
          const data = await resCities.json();
          for (const city of data.cities || []) {
            await put('cities', city);
          }
          console.log("Cities store seeded successfully.");
        }
      } else {
        console.log("Cities store already has content, skipping seed.");
      }

      // 2. Seed Dialogue Trees
      const existingDialogues = await getAll('dialogueTrees');
      if (existingDialogues.length === 0) {
        console.log("Seeding Dialogue Trees store...");
        const resConversations = await fetch('data/conversations/conversations.json');
        if (resConversations.ok) {
          const data = await resConversations.json();
          for (const [id, value] of Object.entries(data)) {
            await put('dialogueTrees', { id, ...value });
          }
          console.log("Dialogue Trees store seeded successfully.");
        }
      } else {
        console.log("Dialogue Trees store already has content, skipping seed.");
      }

      // 3. Seed Dictionary
      const existingDict = await getAll('dictionary');
      if (existingDict.length === 0) {
        console.log("Seeding Dictionary store...");
        const resDict = await fetch('data/dictionary/dictionary.json');
        if (resDict.ok) {
          const data = await resDict.json();
          for (const word of data) {
            await put('dictionary', word);
          }
          console.log("Dictionary store seeded successfully.");
        }
      } else {
        console.log("Dictionary store already has content, skipping seed.");
      }

      console.log("IndexedDB seeding checks completed.");
    } catch (e) {
      console.warn("Database seeding failed:", e);
    }
  }

  return {
    open,
    get,
    getAll,
    put,
    remove,
    clear,
    seedIfEmpty
  };
})();
