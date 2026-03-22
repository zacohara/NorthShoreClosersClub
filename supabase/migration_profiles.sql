-- User profiles: avatars, streaks, badges
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_name text unique not null,
  avatar text, -- base64 data URL
  streak_current integer default 0,
  streak_best integer default 0,
  last_active_date date,
  pic_prompts_left integer default 3,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profiles enable row level security;
DO $$ BEGIN create policy "Allow all reads on profiles" on user_profiles for select using (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN create policy "Allow all inserts on profiles" on user_profiles for insert with check (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN create policy "Allow all updates on profiles" on user_profiles for update using (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
create index if not exists idx_profiles_user on user_profiles(user_name);
