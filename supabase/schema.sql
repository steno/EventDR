-- POP Events — Supabase schema (free tier)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS venues (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  emoji TEXT DEFAULT '📍',
  instagram TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  end_date TEXT,
  time TEXT,
  location TEXT NOT NULL,
  venue_slug TEXT REFERENCES venues(slug),
  venue_name TEXT,
  category TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'physical',
  trending BOOLEAN DEFAULT false,
  source_url TEXT,
  source_type TEXT DEFAULT 'seed',
  image_emoji TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'pending',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_slug);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  locale TEXT DEFAULT 'en',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed North Coast venues
INSERT INTO venues (slug, name, city, description, lat, lng, emoji, instagram) VALUES
  ('lax-cabarete', 'LAX Cabarete', 'Cabarete', 'Beachfront bar and live music hub on Cabarete Bay.', 19.7498, -70.4082, '🎵', 'laxcabarete'),
  ('malecon-puerto-plata', 'Malecón de Puerto Plata', 'Puerto Plata', 'Waterfront promenade with concerts, food stalls, and local gatherings.', 19.7934, -70.6884, '🌊', NULL),
  ('kite-beach', 'Kite Beach', 'Cabarete', 'World-famous kite surfing beach and competition grounds.', 19.7512, -70.4150, '🏄', NULL),
  ('el-batey-sosua', 'El Batey', 'Sosúa', 'Nightlife and live music in the heart of Sosúa.', 19.7528, -70.5261, '🎤', NULL),
  ('cowork-cabarete', 'Cowork Cabarete', 'Cabarete', 'Hub for remote workers, meetups, and startup events.', 19.7485, -70.4100, '💼', NULL),
  ('ocean-world', 'Ocean World', 'Puerto Plata', 'Marine park with pool parties and family events.', 19.8267, -70.7100, '🐬', 'oceanworldadventurepark')
ON CONFLICT (slug) DO NOTHING;

-- Allow public read of approved events and venues (anon key)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read venues" ON venues FOR SELECT USING (true);

CREATE POLICY "Public read approved events" ON events
  FOR SELECT USING (status = 'approved');

-- Service role bypasses RLS for writes (API routes use service key)
