import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT NOW()
        )
    `);
    
    const files = readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const { rows } = await pool.query(
            'SELECT 1 FROM schema_migrations WHERE filename = $1',
            [file]
        );

        if (rows.length > 0) {
            console.log(`Skipping ${file} (already applied)`);
            continue;
        }

        console.log(`Applying ${file}...`);
        const sql = readFileSync(
            path.join(migrationsDir, file), 
            'utf-8'
        );
        await pool.query(sql);
        await pool.query(
            `INSERT INTO schema_migrations (filename) values ($1)`,
            [file]
        );
    }
    console.log('All migrations applied.');
    await pool.end();
}

migrate();