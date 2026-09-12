CREATE TABLE IF NOT EXISTS records (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id UUID NOT NULL,
    collection TEXT NOT NULL,
    data JSONB NOT NULL,
    updated_at BIGINT NOT NULL,
    device_id UUID NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_records_collection_id
    ON records(collection, id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_records_updated_at
    ON records(updated_at);