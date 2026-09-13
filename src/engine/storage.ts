import type { SyncRecord } from "./types.js";

export function storageKey(collection: string): string {
    return `record:${collection}`;
}

export function getAllRecords<T>(collection: string): Record<string, SyncRecord<T>> {
    return JSON.parse(localStorage.getItem(storageKey(collection)) || '{}');
}

export function saveAllRecords<T>(collection: string, records: Record<string, SyncRecord<T>>): void {
    localStorage.setItem(storageKey(collection), JSON.stringify(records));
}