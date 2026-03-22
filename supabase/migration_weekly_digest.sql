-- Run this in Supabase SQL Editor
-- Stores weekly coaching digests generated every Monday

create table if not exists weekly_digests (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  week_of date not null,
  quizzes_passed integer default 0,
  quizzes_total integer default 15,
  accuracy integer default 0,
  quizzes_this_week integer default 0,
  analyses_this_week integer default 0,
  analysis_grades jsonb,
  weakest_step text,
  weakest_step_avg text,
  active boolean default false,
  tip text,
  created_at timestamptz default now(),
  unique(user_name, week_of)
);

alter table weekly_digests enable row level security;
create policy "Allow all reads on digests" on weekly_digests for select using (true);
create policy "Allow all inserts on digests" on weekly_digests for insert with check (true);
create policy "Allow all updates on digests" on weekly_digests for update using (true);
create index if not exists idx_digests_user on weekly_digests(user_name);
create index if not exists idx_digests_week on weekly_digests(user_name, week_of);
