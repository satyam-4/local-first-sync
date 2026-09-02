import type { Note } from './noteStorage.js';

export function getOutbox(): Note[] {
    return JSON.parse(localStorage.getItem('outbox') || '[]');
}

export function addToOutbox(note: Note): void {
    const outbox = getOutbox();
    outbox.push(note);
    localStorage.setItem('outbox', JSON.stringify(outbox));
}

export function clearOutbox(): void {
    localStorage.setItem('outbox', JSON.stringify([]));
}

export function setOutbox(outbox: Note[]): void {
    localStorage.setItem('outbox', JSON.stringify(outbox));
}