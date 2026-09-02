export interface Note {
    id: string;
    text: string;
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}

import { getDeviceId } from "./deviceId.js";
import { addToOutbox } from "./outbox.js";

export function getAllNotes(): Record<string, Note> {
    return JSON.parse(localStorage.getItem('notes') || '{}');
}

export function saveAllNotes(notes: Record<string, Note>): void {
    localStorage.setItem('notes', JSON.stringify(notes));
}

export function saveNote(id: string, text: string): Note {
    const notes = getAllNotes();
    const note: Note = {
        id,
        text, 
        updatedAt: Date.now(),
        deviceId: getDeviceId(),
        deleted: false
    }
    notes[id] = note;
    saveAllNotes(notes);
    addToOutbox(note);

    return note;
}

export function deleteNote(id: string): Note {
    const notes = getAllNotes();
    const existing = notes[id];
    const note: Note = {
        id,
        text: existing?.text ?? '',
        updatedAt: Date.now(),
        deviceId: getDeviceId(),
        deleted: true
    };
    
    delete notes[id];
    saveAllNotes(notes);
    addToOutbox(note);

    return note;
}

export function getNote(id: string): Note | undefined {
    return getAllNotes()[id]
}

export function createNote(text: string): string {
    const id = crypto.randomUUID();
    saveNote(id, text);
    return id;
}