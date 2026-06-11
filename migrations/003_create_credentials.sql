CREATE TABLE IF NOT EXISTS credentials (
  id TEXT PRIMARY KEY,
  holder_id TEXT NOT NULL,
  credential_data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'suspended')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_credentials_holder_id ON credentials(holder_id);
CREATE INDEX idx_credentials_status ON credentials(status);
CREATE INDEX idx_credentials_created_at ON credentials(created_at);
