CREATE TABLE IF NOT EXISTS chain_anchors (
  id BIGSERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  content_hash TEXT NOT NULL,
  tx_hash TEXT,
  block_number BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id)
);
CREATE INDEX IF NOT EXISTS idx_chain_anchors_hash ON chain_anchors(content_hash);
