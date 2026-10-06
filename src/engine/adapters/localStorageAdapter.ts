import type { StorageAdapter } from "../storageAdapter.js";

export const localStorageAdapter: StorageAdapter = {
    async getItem<T>(key: string): Promise<T | null> {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },
    async saveItem<T>(key: string, value: T): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    },
};
