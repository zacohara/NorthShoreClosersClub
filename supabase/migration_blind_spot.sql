-- Run this in Supabase SQL Editor after the initial migration
-- Stores Plaud transcript analyses for the Blind Spot Revealer

create table if not exists blind_spot_analyses (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  transcript text not null,
  analysis text not null,
  overall_grade text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table blind_spot_analyses enable row level security;

-- Allow public read/write (internal team app)
create policy "Allow all reads on analyses" on blind_spot_analyses for select using (true);
create policy "Allow all inserts on analyses" on blind_spot_analyses for insert with check (true);

-- Index
create index if not exists idx_analyses_user on blind_spot_analyses(user_name);
