import { localStorageAdapter } from "./adapters/localStorageAdapter.js";
import type { StorageAdapter } from "./storageAdapter.js";
import type { SyncRecord } from "./types.js";

let adapter: StorageAdapter = localStorageAdapter;
const LAST_SYNCED_AT_KEY = 'lastSyncedAt';

export function getStorageAdapter() {
    return adapter;
}

export function storageKey(collection: string): string {
    return `record:${collection}`;
}

export async function getAllRecords<T>(collection: string): Promise<Record<string, SyncRecord<T>>> {
    const result = await adapter.getItem<Record<string, SyncRecord<T>>>(storageKey(collection));
    return result ?? {};
}

export async function saveAllRecords<T>(collection: string, records: Record<string, SyncRecord<T>>): Promise<void> {
    await adapter.saveItem<Record<string, SyncRecord<T>>>(storageKey(collection), records);
}

export async function saveLastSyncedAt(ts: number) {
    await adapter.saveItem<number>(LAST_SYNCED_AT_KEY, ts);
}

export async function getLastSyncedAt(): Promise<number> {
    const timestamp = await adapter.getItem<number>(LAST_SYNCED_AT_KEY);
    return timestamp ?? 0;
}