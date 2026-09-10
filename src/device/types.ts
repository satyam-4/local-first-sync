export interface SyncRecord<T = unknown> {
    id: string;
    collection: string;
    data: T;
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}