
CREATE TABLE handovers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  claim_id INTEGER NOT NULL,
  owner_user_id INTEGER NOT NULL,
  finder_user_id INTEGER NOT NULL,
  authority_user_id INTEGER NOT NULL,
  owner_confirmed_at DATETIME,
  authority_confirmed_at DATETIME,
  is_complete BOOLEAN DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_handovers_item_id ON handovers(item_id);
CREATE INDEX idx_handovers_claim_id ON handovers(claim_id);
CREATE INDEX idx_handovers_is_complete ON handovers(is_complete);
