import { pool } from '../db/pool.js';
import type { RecordRow, PushRecordRequest } from '../types/record.js';

export async function insertRecord(records: PushRecordRequest[]): Promise<void> {
    for (const record of records) {
        await pool.query(
            `INSERT INTO records (id, data, updated_at, device_id, deleted)
             VALUES ($1, $2, $3, $4, $5)`,
            [record.id, record.data, record.updatedAt, record.deviceId, record.deleted]
        );
    }
}

export async function getChangesSince(since: number): Promise<RecordRow[]> {
    const result = await pool.query<RecordRow>(
        `SELECT DISTINCT ON (collection, id) *
         FROM records
         WHERE updated_at > $1
         ORDER BY collection, id, updated_at DESC`,
        [since]
    );
    return result.rows;
}

export function groupByCollection(rows: RecordRow[]): Record<string, RecordRow[]> {
    const grouped: Record<string, RecordRow[]> = {};
    for (const row of rows) {
        if (!grouped[row.collection]) {
            grouped[row.collection] = [];
        }
        grouped[row.collection]?.push(row);
    }
    return grouped;
}