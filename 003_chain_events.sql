CREATE TABLE IF NOT EXISTS chain_events(
  id BIGSERIAL PRIMARY KEY,
  anchor_id NUMERIC NOT NULL,
  document_hash TEXT NOT NULL,
  slug TEXT NOT NULL,
  language TEXT NOT NULL,
  version NUMERIC NOT NULL,
  submitter TEXT NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  block_number BIGINT NOT NULL,
  block_timestamp BIGINT NOT NULL,
  contract_address TEXT NOT NULL,
  indexed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chain_events_hash ON chain_events(document_hash);
