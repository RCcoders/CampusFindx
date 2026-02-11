
CREATE TABLE rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  payer_user_id INTEGER NOT NULL,
  receiver_user_id INTEGER,
  status TEXT NOT NULL DEFAULT 'escrowed',
  released_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rewards_item_id ON rewards(item_id);
CREATE INDEX idx_rewards_status ON rewards(status);
CREATE INDEX idx_rewards_payer_user_id ON rewards(payer_user_id);
