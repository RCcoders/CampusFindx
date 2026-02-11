
CREATE TABLE reputation_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  points_awarded INTEGER NOT NULL,
  item_id INTEGER,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reputation_events_user_id ON reputation_events(user_id);
CREATE INDEX idx_reputation_events_event_type ON reputation_events(event_type);
