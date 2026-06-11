CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TEXT NOT NULL DEFAULT (datetime('now')),
  window_end TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_rate_limits_key_window ON rate_limits(key, window_start);
CREATE INDEX idx_rate_limits_window_end ON rate_limits(window_end);
