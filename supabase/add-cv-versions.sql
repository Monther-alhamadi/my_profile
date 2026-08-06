-- ============================================================
-- Migration: Multi-CV Versions Support
-- Run this against your Supabase project to enable
-- multiple CV versions per user.
-- ============================================================

-- 1. Remove the single-CV-per-user constraint
ALTER TABLE cvs DROP CONSTRAINT IF EXISTS cvs_user_id_key;

-- 2. Add version metadata columns
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS version_name TEXT NOT NULL DEFAULT 'Default';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false;

-- 3. Ensure exactly one primary CV per user (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cvs_one_primary_per_user
  ON cvs(user_id) WHERE is_primary = true;

-- 4. Mark existing rows as primary (first CV per user)
UPDATE cvs SET is_primary = true WHERE id IN (
  SELECT DISTINCT ON (user_id) id
  FROM cvs
  ORDER BY user_id, created_at ASC
);

-- 5. Allow public read for the primary CV (for visitor-facing pages)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read primary cv' AND tablename = 'cvs'
  ) THEN
    CREATE POLICY "Public read primary cv" ON cvs
      FOR SELECT USING (is_primary = true);
  END IF;
END
$$;
