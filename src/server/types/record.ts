export interface RecordRow {
    version_id: string;
    id: string;
    collection: string;
    data: unknown;
    updated_at: string;   
    device_id: string;
    deleted: boolean;
}

export interface PushRecordRequest {
    id: string;
    data: unknown,
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}