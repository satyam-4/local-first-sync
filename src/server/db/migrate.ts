import { readFileSync } from "node:fs";
import { pool } from "./pool.js";

async function migrate() {
    const sql = readFileSync(new URL('./migrations/001_create_note_versions.sql', import.meta.url), 'utf-8');
    await pool.query(sql);
    console.log('Migration applied');
    await pool.end();
}

migrate();