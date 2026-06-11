CREATE TABLE IF NOT EXISTS circuit_versions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  constraints INTEGER,
  hash TEXT NOT NULL,
  artifact_path TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_circuit_versions_name_version ON circuit_versions(name, version);
CREATE INDEX idx_circuit_versions_status ON circuit_versions(status);
