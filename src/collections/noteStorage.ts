import { getDeviceId } from "../engine/deviceId.js";
import { addToOutbox } from "../engine/outbox.js";
import { getAllRecords, saveAllRecords } from "../engine/storage.js";
import type { SyncRecord } from "../engine/types.js";

export interface Note {
    text: string;
}

const COLLECTION = 'notes';

export function createNote(text: string): string {
    const id = crypto.randomUUID();
    saveNote(id, text);
    return id;
}

export function saveNote(id: string, text: string): SyncRecord<Note> {
    const records: Record<string, SyncRecord<Note>> = getAllRecords<Note>(COLLECTION);
    const record = {
        id,
        collection: COLLECTION,
        data: { text },
        updatedAt: Date.now(),
        deviceId: getDeviceId(),
        deleted: false
    }
    records[id] = record;
    saveAllRecords(COLLECTION, records);
    addToOutbox(record);
    return record;
}

export function getAllNotes(): Record<string, SyncRecord<Note>> {
    return getAllRecords<Note>(COLLECTION);
}