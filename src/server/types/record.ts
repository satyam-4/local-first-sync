export interface RecordRow {
    id: string;
    version_id: string;
    collection: string;
    data: unknown;
    updated_at: string;   
    device_id: string;
    deleted: boolean;
}

export interface PushRecordRequest {
    id: string;
    versionId: string;
    collection: string;
    data: unknown;
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}