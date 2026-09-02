export interface NoteVersionRow {
    version_id: string;
    note_id: string;
    text: string;
    updated_at: string;   
    device_id: string;
    deleted: boolean;
}

export interface PushNoteRequest {
    id: string;
    text: string;
    updatedAt: number;
    deviceId: string;
    deleted: boolean;
}