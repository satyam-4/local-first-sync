import type { StorageAdapter } from "../storageAdapter.js";

const DB_NAME = 'sync-engine-db';
const DB_VERSION = 1;
const STORE_NAME = 'keyValueStore';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}

export const indexedDbAdapter: StorageAdapter = {
    async getItem<T>(key: string): Promise<T | null> {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror= () => reject(request.error);
        });
    },
    async saveItem<T>(key: string, value: T): Promise<void> {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put(value, key);
            
            tx.oncomplete = () => resolve();
            tx.onerror= () => reject(tx.error);
        });
    }
};