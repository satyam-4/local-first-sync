import { getDeviceId } from "../engine/deviceId.js";
import { addToOutbox } from "../engine/outbox.js";
import { getAllRecords, saveAllRecords } from "../engine/storage.js";
import type { SyncRecord } from "../engine/types.js";

export interface Task {
    title: string;
    description: string;
    done: boolean;
}

const COLLECTION = 'tasks';

export async function createTask(title: string, description: string, done: boolean): Promise<string> {
    const id = crypto.randomUUID();
    saveTask(id, title, description, done);
    return id;
}

export async function saveTask(id: string, title: string,description: string,done: boolean): Promise<SyncRecord<Task>> {
    const versionId = crypto.randomUUID();
    const records: Record<string, SyncRecord<Task>> = await getAllRecords<Task>(COLLECTION);
    const record = {
        id,
        versionId,
        collection: COLLECTION,
        data: { 
            title,
            description,
            done
        },
        updatedAt: Date.now(),
        deviceId: getDeviceId(),
        deleted: false
    }
    records[id] = record;
    await saveAllRecords(COLLECTION, records);
    await addToOutbox(record);
    return record;
}

export async function getAllTasks(): Promise<Record<string, SyncRecord<Task>>> {
    return await getAllRecords<Task>(COLLECTION);
}