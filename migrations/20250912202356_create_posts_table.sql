-- Add Posts Table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Images Table
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

