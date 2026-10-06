import { getDeviceId } from "../engine/deviceId.js";
import { addToOutbox } from "../engine/outbox.js";
import { getAllRecords, saveAllRecords } from "../engine/storage.js";
import type { SyncRecord } from "../engine/types.js";

export interface Note {
    text: string;
}

const COLLECTION = 'notes';

export async function createNote(text: string): Promise<string> {
    const id = crypto.randomUUID();
    await saveNote(id, text);
    return id;
}

export async function saveNote(id: string, text: string): Promise<SyncRecord<Note>> {
    const records: Record<string, SyncRecord<Note>> = await getAllRecords<Note>(COLLECTION);
    const versionId = crypto.randomUUID();
    const record = {
        id,
        versionId,
        collection: COLLECTION,
        data: { text },
        updatedAt: Date.now(),
        deviceId: getDeviceId(),
        deleted: false
    }
    await saveAllRecords(COLLECTION, records);
    await addToOutbox(record);
    return record;
}

export async function getAllNotes(): Promise<Record<string, SyncRecord<Note>>> {
    return await getAllRecords<Note>(COLLECTION);
}