import { getOutbox, setOutbox } from './outbox.js';
import { getAllRecords, saveAllRecords } from './storage.js';
import type { SyncRecord } from './types.js';

const SERVER_URL = 'http://localhost:3000';

function getLastSyncedAt(): number {
    return Number(localStorage.getItem(`lastSyncedAt`) || 0);
}

function setLastSyncedAt(ts: number): void {
    localStorage.setItem(`lastSyncedAt`, String(ts));
}

let syncInProgress = false;

/*
    pull changes will return something like this:
    {
        collection_name: [
            {
                id: record_id;
                collection: collection_name;
                data: data;
                ...
            },...
        ],...
    }
*/
export async function pullChanges(): Promise<void> {
    if (syncInProgress) return;
    syncInProgress = true;

    try {
        const since = getLastSyncedAt();
        const res = await fetch(`${SERVER_URL}/sync/since/${since}`); 
        if (!res.ok) {
            throw new Error(`Pull failed: ${res.status} ${res.statusText}`);
        }      
        const incomingChanges: Record<string, SyncRecord[]> = await res.json();
        const collections: [string, SyncRecord[]][] = Object.entries(incomingChanges);

        let maxTimestamp = since;

        for (const [collection, incomingRecords] of collections) {
            const localRecords = getAllRecords(collection);
            for (const record of incomingRecords) {
                const existing: SyncRecord | undefined = localRecords[record.id];
                const incomingUpdatedAt: number = record.updatedAt;
                const isNewer = !existing || incomingUpdatedAt > existing.updatedAt;

                if (isNewer) {
                    if (record.deleted) {
                        delete localRecords[record.id];
                    } else {
                        localRecords[record.id] = record;
                    }
                }
                maxTimestamp = Math.max(maxTimestamp, record.updatedAt);
            }
            saveAllRecords(collection, localRecords);
        }
        setLastSyncedAt(maxTimestamp);
    } finally {
        syncInProgress = false;
    }
}

export async function syncOutbox(): Promise<void> {
    const outbox: SyncRecord[] = getOutbox();
    if (outbox.length === 0) return;
    
    try {
        const res = await fetch(`${SERVER_URL}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(outbox)
        });
        if (!res.ok) {
            throw new Error(`Push failed: ${res.status}`);
        }
        setOutbox([]);
    } catch (error) {
        console.log('sync outbox failed');
    }
}

// export function startAutoSync(intervalMs: number = 5000): void {
//     window.addEventListener('online', syncOutbox);
//     window.addEventListener('online', pullChanges);
//     setInterval(syncOutbox, intervalMs);
//     setInterval(pullChanges, intervalMs);
// }