CREATE TABLE IF NOT EXISTS note_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL,
    text TEXT NOT NULL,
    updated_at BIGINT NOT NULL,
    device_id UUID NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_note_versions_note_id
    ON note_versions(note_id, updated_at DESC);