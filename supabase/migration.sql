-- ============================================================
-- Portfolio Database Schema
-- ============================================================

-- 1. profile
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  bio_en text NOT NULL,
  bio_ar text NOT NULL,
  location text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  github_url text,
  linkedin_url text,
  facebook_url text,
  cv_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. projects
CREATE TABLE IF NOT EXISTS projects (
  id text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  number text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  complexity text NOT NULL CHECK (complexity IN ('High', 'Critical', 'Advanced')),
  technologies jsonb NOT NULL DEFAULT '[]',
  highlights jsonb NOT NULL DEFAULT '[]',
  image_url text,
  link_url text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id, locale)
);

-- 3. skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  category text NOT NULL,
  icon text NOT NULL,
  description text NOT NULL,
  technologies jsonb NOT NULL DEFAULT '[]'
);

-- 4. services
CREATE TABLE IF NOT EXISTS services (
  id text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  pricing text NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, locale)
);

-- 5. experience
CREATE TABLE IF NOT EXISTS experience (
  id text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  year text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  achievements jsonb NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, locale)
);

-- 6. stats
CREATE TABLE IF NOT EXISTS stats (
  id text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  value text NOT NULL,
  label text NOT NULL,
  suffix text,
  PRIMARY KEY (id, locale)
);

-- 7. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'ar')),
  sort_order int NOT NULL DEFAULT 0,
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  content text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  avatar_url text,
  PRIMARY KEY (id, locale)
);

-- 8. contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message_type text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio tables
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- Public insert for contact_messages (anyone can submit)
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Only service_role can write/update portfolio tables
CREATE POLICY "Service role manage profile" ON profile USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage projects" ON projects USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage skills" ON skills USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage services" ON services USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage experience" ON experience USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage stats" ON stats USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage testimonials" ON testimonials USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage contact" ON contact_messages USING (auth.role() = 'service_role');

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_locale_sort ON projects (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_locale_sort ON skills (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_locale_sort ON services (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_locale_sort ON experience (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_stats_locale_sort ON stats (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_locale_sort ON testimonials (locale, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages (created_at DESC);
