import type { Note } from './noteStorage.js';
import type { SyncRecord } from './types.js';

export function getOutbox(): SyncRecord[] {
    return JSON.parse(localStorage.getItem('outbox') || '[]');
}

export function addToOutbox(record: SyncRecord): void {
    const outbox = getOutbox();
    outbox.push(record);
    localStorage.setItem('outbox', JSON.stringify(outbox));
}

export function clearOutbox(): void {
    localStorage.setItem('outbox', JSON.stringify([]));
}

export function setOutbox(outbox: SyncRecord[]): void {
    localStorage.setItem('outbox', JSON.stringify(outbox));
}