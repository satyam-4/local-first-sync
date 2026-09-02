import 'dotenv/config';

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    port: Number(process.env.PORT || 3000),
    databaseUrl: requireEnv('DATABASE_URL'),
};