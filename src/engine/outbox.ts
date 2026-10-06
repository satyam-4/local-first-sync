import { getStorageAdapter } from './storage.js';
import type { SyncRecord } from './types.js';

const OUTBOX_KEY = 'outbox';

export async function getOutbox(): Promise<SyncRecord[]> {
    return await getStorageAdapter().getItem<SyncRecord[]>(OUTBOX_KEY) ?? []
}

export async function addToOutbox(record: SyncRecord): Promise<void> {
    const outbox = await getOutbox();
    outbox.push(record);
    await getStorageAdapter().saveItem<SyncRecord[]>(OUTBOX_KEY, outbox);
}

export async function clearOutbox(): Promise<void> {
    await getStorageAdapter().saveItem<[]>(OUTBOX_KEY, []);
}

export async function setOutbox(outbox: SyncRecord[]): Promise<void> {
    await getStorageAdapter().saveItem<SyncRecord[]>(OUTBOX_KEY, outbox);
}