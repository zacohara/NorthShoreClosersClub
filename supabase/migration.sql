-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- This creates the table and enables public read/write for your internal team app.

-- 1. Create the quiz results table
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  quiz_index integer not null,
  score integer not null,
  total integer not null,
  passed boolean not null default false,
  trail jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_name, quiz_index)
);

-- 2. Enable Row Level Security (required by Supabase)
alter table quiz_results enable row level security;

-- 3. Allow public read/write (this is an internal team app, not public-facing)
create policy "Allow all reads" on quiz_results for select using (true);
create policy "Allow all inserts" on quiz_results for insert with check (true);
create policy "Allow all updates" on quiz_results for update using (true);

-- 4. Index for fast lookups
create index if not exists idx_quiz_results_user on quiz_results(user_name);
create index if not exists idx_quiz_results_lookup on quiz_results(user_name, quiz_index);
