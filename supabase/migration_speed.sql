-- Speed to Lead cache table
-- Stores computed metrics, refreshed at 8am/6pm CST by Netlify function
CREATE TABLE IF NOT EXISTS speed_cache (
  id TEXT PRIMARY KEY DEFAULT 'current',
  reps JSONB NOT NULL DEFAULT '[]',
  personal_bests JSONB NOT NULL DEFAULT '{}',
  prev_week JSONB DEFAULT NULL,
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speed raw data — accumulated from PAVE queries over time
-- Each row = one job's speed data point
CREATE TABLE IF NOT EXISTS speed_raw (
  job_id TEXT PRIMARY KEY,
  rep TEXT NOT NULL,
  job_name TEXT,
  task_date DATE,       -- first task scheduled date
  estimate_date DATE,   -- first customerOrder pending date
  speed_days INTEGER,   -- computed days excluding Sundays
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_speed_raw_rep ON speed_raw(rep);
