/**
 * BOLA Marathi — IndexedDB Database Layer with Timeout Protection
 * Ported for Lovable React + TypeScript Frontend
 */

export const DBService = (() => {
  const DB_NAME = 'bola_marathi_db';
  const DB_VERSION = 2;
  let _db: IDBDatabase | null = null;

  function open(): Promise<IDBDatabase> {
    if (_db) return Promise.resolve(_db);

    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('IndexedDB open operation timed out'));
      }, 2500);

      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

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
          if (!db.objectStoreNames.contains('courses')) {
            db.createObjectStore('courses', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('modules')) {
            db.createObjectStore('modules', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('sentences')) {
            db.createObjectStore('sentences', { keyPath: 'id' });
          }
        };

        request.onsuccess = (event: Event) => {
          clearTimeout(timer);
          _db = (event.target as IDBOpenDBRequest).result;
          resolve(_db);
        };

        request.onerror = (event: Event) => {
          clearTimeout(timer);
          reject((event.target as IDBOpenDBRequest).error || new Error('IndexedDB open error'));
        };
      } catch (err) {
        clearTimeout(timer);
        reject(err);
      }
    });
  }

  async function get<T = any>(storeName: string, key: string): Promise<T | undefined> {
    try {
      const db = await open();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn(`DBService.get failed for store ${storeName}:`, e);
      return undefined;
    }
  }

  async function getAll<T = any>(storeName: string): Promise<T[]> {
    try {
      const db = await open();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn(`DBService.getAll failed for store ${storeName}:`, e);
      return [];
    }
  }

  async function put(storeName: string, value: any): Promise<IDBValidKey> {
    try {
      const db = await open();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn(`DBService.put failed for store ${storeName}:`, e);
      return '';
    }
  }

  async function remove(storeName: string, key: string): Promise<void> {
    try {
      const db = await open();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn(`DBService.remove failed for store ${storeName}:`, e);
    }
  }

  return {
    open,
    get,
    getAll,
    put,
    remove
  };
})();
