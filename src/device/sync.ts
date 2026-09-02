export interface IncomingNote {
    note_id: string;
    text: string;
    device_id: string
    updated_at: string;
    deleted: boolean;
}

import type { Note } from './noteStorage.js';
import { getOutbox, setOutbox } from './outbox.js';

const SERVER_URL = 'http://localhost:3000';

function getLastSyncedAt(): number {
    return Number(localStorage.getItem('lastSyncedAt') || 0);
}

function setLastSyncedAt(ts: number): void {
    localStorage.setItem('lastSyncedAt', String(ts));
}

let syncInProgress = false;

export async function pullChanges(): Promise<void> {
    if (syncInProgress) return;
    syncInProgress = true;

    try {
        const since = getLastSyncedAt();
        const res = await fetch(`${SERVER_URL}/notes/since/${since}`); 
        if (!res.ok) {
            throw new Error(`Pull failed: ${res.status} ${res.statusText}`);
        }      
        const changes: IncomingNote[] = await res.json();

        const notesRaw = localStorage.getItem('notes') || '{}';
        const notes: Record<string, Note> = JSON.parse(notesRaw);
        let maxTimestamp = since;

        for (const change of changes) {
            const existing: Note | undefined = notes[change.note_id];
            const incomingUpdatedAt = Number(change.updated_at);

            // if the note either doesn't exist or exists but older than the incoming note, then its newer
            const isNewer = !existing || existing.updatedAt < incomingUpdatedAt;

            if (isNewer) {
                // if the incoming change is that the note is deleted, then we have to delete is from the localstorage, we update the notes object, later we set it to localstorage
                if (change.deleted) {
                    delete notes[change.note_id];
                } else {
                    notes[change.note_id] = {
                        id: change.note_id,
                        text: change.text,
                        deviceId: change.device_id,
                        updatedAt: Number(change.updated_at),
                        deleted: change.deleted
                    };
                }
            }

            maxTimestamp = Math.max(maxTimestamp, incomingUpdatedAt);
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        setLastSyncedAt(maxTimestamp);
    } finally {
        syncInProgress = false;
    }
}

export async function syncOutbox(): Promise<void> {
    const outbox: Note[] = getOutbox();
    const stillPending: Note[] = [];

    for (const note of outbox) {
        try {
            const res = await fetch(`${SERVER_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            });
            if (!res.ok) {
                throw new Error(`Push failed: ${res.status}`);
            }
        } catch (error) {
            stillPending.push(note);
        }
    }

    setOutbox(stillPending);
}

export function startAutoSync(intervalMs: number = 5000): void {
    window.addEventListener('online', syncOutbox);
    window.addEventListener('online', pullChanges);
    setInterval(syncOutbox, intervalMs);
    setInterval(pullChanges, intervalMs);
}