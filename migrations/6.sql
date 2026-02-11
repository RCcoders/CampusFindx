
CREATE TABLE strikes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  item_id INTEGER,
  claim_id INTEGER,
  issued_by_user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_strikes_user_id ON strikes(user_id);
CREATE INDEX idx_strikes_created_at ON strikes(created_at);
