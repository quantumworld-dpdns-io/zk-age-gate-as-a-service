CREATE TABLE IF NOT EXISTS proof_revocations (
  id TEXT PRIMARY KEY,
  proof_id TEXT NOT NULL,
  reason TEXT,
  revoked_by TEXT,
  revoked_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (proof_id) REFERENCES proofs(id)
);

CREATE INDEX idx_proof_revocations_proof_id ON proof_revocations(proof_id);
CREATE INDEX idx_proof_revocations_revoked_at ON proof_revocations(revoked_at);
