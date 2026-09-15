export interface SyncRecord<T = unknown> {
    id: string;
    versionId: string;
    collection: string;
    data: T;
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}

export interface IncomingRecord<T = unknown> {
    id: string;
    version_id: string;
    collection: string;
    data: T;
    updated_at: number;
    device_id: string;
    deleted: boolean;
}

