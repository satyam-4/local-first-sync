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

export function createTask(
    title: string,
    description: string,
    done: boolean): string {
    const id = crypto.randomUUID();
    saveTask(id, title, description, done);
    return id;
}

export function saveTask(
    id: string, 
    title: string,
    description: string,
    done: boolean): SyncRecord<Task> {
    const versionId = crypto.randomUUID();
    const records: Record<string, SyncRecord<Task>> = getAllRecords<Task>(COLLECTION);
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
    saveAllRecords(COLLECTION, records);
    addToOutbox(record);
    return record;
}

export function getAllTasks(): Record<string, SyncRecord<Task>> {
    return getAllRecords<Task>(COLLECTION);
}