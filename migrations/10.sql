-- Create reputation_events table (if it doesn't strictly exist, simplified check not needed in SQLite usually, checking schema is hard, so just Create If Not Exists)
CREATE TABLE IF NOT EXISTS reputation_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'item_returned', 'claim_rejected', 'bonus', 'redemption'
  points_awarded INTEGER NOT NULL, -- can be negative
  item_id INTEGER,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE INDEX IF NOT EXISTS idx_reputation_user ON reputation_events(user_id);

-- Create Badges tables
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY, -- e.g., 'eagle_eye', 'saint'
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- reference to lucide icon name
  required_points INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id TEXT NOT NULL,
  awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- Create Rewards Store tables
CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  image_url TEXT, -- or icon name
  category TEXT,
  inventory_count INTEGER DEFAULT -1, -- -1 for infinite
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reward_id INTEGER NOT NULL,
  cost_at_time INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, fulfilled, cancelled
  redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

-- Seed Initial Badges
INSERT OR IGNORE INTO badges (id, name, description, icon_name, required_points) VALUES 
('eagle_eye', 'Eagle Eye', 'Reported 5 verified lost items', 'Eye', 100),
('saint', 'Saint', 'Returned 3 items to owners', 'Shield', 300),
('guardian', 'Guardian', 'Maintained high reputation for 3 months', 'Star', 500),
('legend', 'Legend', 'Top 10 leaderboard position', 'Trophy', 1000);

-- Seed Initial Rewards
INSERT OR IGNORE INTO rewards (title, description, cost, category, inventory_count) VALUES 
('Campus Coffee', 'Single drink voucher at Student Center', 50, 'Food & Drink', -1),
('Printing Credits', '50 Pages of B/W Printing', 20, 'Services', -1),
('Library Private Room', '2-hour priority booking', 150, 'Services', 10),
('University Hoodie', 'Limited Edition Karma Hoodie', 500, 'Apparel', 50);
