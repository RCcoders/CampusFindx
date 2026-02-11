
-- Add private_proof to items
ALTER TABLE items ADD COLUMN private_proof TEXT;

-- Create claims table
CREATE TABLE claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  claimant_id INTEGER NOT NULL,
  proof_description TEXT NOT NULL,
  proof_image_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (claimant_id) REFERENCES users(id)
);

CREATE INDEX idx_claims_item_id ON claims(item_id);
CREATE INDEX idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX idx_claims_status ON claims(status);

-- Create transactions table for escrow/rewards
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  payer_id INTEGER NOT NULL, -- The user who set the reward (owner)
  payee_id INTEGER, -- The finder (initially null until handover)
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'held', -- held, released, refunded
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (payer_id) REFERENCES users(id),
  FOREIGN KEY (payee_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_item_id ON transactions(item_id);
