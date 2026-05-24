-- CountryScore v2 - Migration 001: Initial Schema
-- Executed in Supabase project: cusvsgnpxlvkwrgslnis
-- Applied via apply_migration (Commit 2)

-- Drop old tables (safe if they don't exist)
DROP TABLE IF EXISTS review_votes CASCADE;
DROP TABLE IF EXISTS review_reports CASCADE;
DROP TABLE IF EXISTS insights_snapshots CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- ─────────────────────────────────────────────
-- COUNTRIES
-- ─────────────────────────────────────────────
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,   -- ISO 3166-1 alpha-2
  region TEXT,
  continent TEXT,
  flag_emoji TEXT,
  population BIGINT,
  capital TEXT,
  currency TEXT,
  languages TEXT[],
  timezone TEXT,
  wikipedia_url TEXT,
  hero_image_url TEXT
);

-- ─────────────────────────────────────────────
-- REVIEWS (correct schema matching frontend)
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Core fields (values match DEFAULT_CATEGORIES and STATUS_LABELS in constants.js)
  country TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'current_resident',
    'former_resident',
    'visited',
    'never_been'
  )),
  category TEXT NOT NULL CHECK (category IN (
    'costOfLiving',
    'safety',
    'jobs',
    'healthcare',
    'education',
    'freedom',
    'lifestyle',
    'infrastructure'
  )),
  subcategory TEXT,
  score NUMERIC NOT NULL CHECK (score >= 1 AND score <= 10),

  -- Review content
  title TEXT NOT NULL CHECK (LENGTH(TRIM(title)) >= 6 AND LENGTH(TRIM(title)) <= 100),
  comment TEXT NOT NULL CHECK (LENGTH(TRIM(comment)) >= 40 AND LENGTH(TRIM(comment)) <= 2000),
  pros TEXT,
  cons TEXT,

  -- Reviewer info
  display_name TEXT DEFAULT 'Anonymous',
  age_range TEXT,
  duration_stayed TEXT,
  time_period TEXT,

  -- Moderation — DEFAULT FALSE, manual approval required
  approved BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  moderated_at TIMESTAMPTZ,

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0
);

-- ─────────────────────────────────────────────
-- REVIEW VOTES
-- ─────────────────────────────────────────────
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  UNIQUE(review_id, voter_fingerprint)
);

-- ─────────────────────────────────────────────
-- REVIEW REPORTS
-- ─────────────────────────────────────────────
CREATE TABLE review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  reporter_fingerprint TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'spam', 'hate_speech', 'misinformation', 'inappropriate', 'duplicate', 'other'
  )),
  details TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- INSIGHTS SNAPSHOTS
-- ─────────────────────────────────────────────
CREATE TABLE insights_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  snapshot_date DATE UNIQUE NOT NULL,
  trending_countries JSONB,
  top_improvers JSONB,
  biggest_declines JSONB,
  trending_topics JSONB,
  total_reviews INTEGER,
  total_countries INTEGER
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX idx_reviews_country ON reviews(country);
CREATE INDEX idx_reviews_category ON reviews(category);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights_snapshots ENABLE ROW LEVEL SECURITY;

-- Countries: public read
CREATE POLICY "Public can read countries"
  ON countries FOR SELECT
  USING (true);

-- Reviews: public read approved only
CREATE POLICY "Public can read approved reviews"
  ON reviews FOR SELECT
  USING (approved = true);

-- Reviews: public insert (lands as unapproved, pending moderation)
CREATE POLICY "Public can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    LENGTH(TRIM(title)) >= 6
    AND LENGTH(TRIM(comment)) >= 40
    AND score >= 1 AND score <= 10
    AND approved = false
  );

-- Votes
CREATE POLICY "Anyone can vote"
  ON review_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read votes"
  ON review_votes FOR SELECT
  USING (true);

-- Reports
CREATE POLICY "Anyone can report"
  ON review_reports FOR INSERT
  WITH CHECK (true);

-- Insights
CREATE POLICY "Public can read insights"
  ON insights_snapshots FOR SELECT
  USING (true);
