
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_found_or_lost DATE NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_amount INTEGER DEFAULT 0,
  private_proof TEXT,
  item_condition TEXT,
  unique_item_id TEXT,
  is_deposited_with_authority BOOLEAN DEFAULT 0,
  claimed_count INTEGER DEFAULT 0,
  verified_by_user_id INTEGER,
  verified_at DATETIME,
  returned_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_date ON items(date_found_or_lost);
