import { pool } from '../db/pool.js';
import type { NoteVersionRow, PushNoteRequest } from '../types/note.js';

export async function insertNoteVersion(note: PushNoteRequest): Promise<void> {
    await pool.query(
        `INSERT INTO note_versions (note_id, text, updated_at, device_id, deleted)
         VALUES ($1, $2, $3, $4, $5)`,
        [note.id, note.text, note.updatedAt, note.deviceId, note.deleted]
    );
}

export async function getChangesSince(since: number): Promise<NoteVersionRow[]> {
    const result = await pool.query<NoteVersionRow>(
        `SELECT DISTINCT ON (note_id) *
         FROM note_versions
         WHERE updated_at > $1
         ORDER BY note_id, updated_at DESC`,
        [since]
    );
    return result.rows;
}