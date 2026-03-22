import pg from 'pg';
const { Client } = pg;

export default async (req) => {
  const cs = Buffer.from('cG9zdGdyZXNxbDovL3Bvc3RncmVzLndrcnRianZiamViaGJjand1cmhiOkRpZWdvRGFrb3RhMzc0MiFAYXdzLTEtdXMtZWFzdC0yLnBvb2xlci5zdXBhYmFzZS5jb206NjU0My9wb3N0Z3Jlcw==', 'base64').toString();
  const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    await client.query(`
      create table if not exists user_profiles (
        id uuid default gen_random_uuid() primary key,
        user_name text unique not null,
        avatar text,
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
    `);
    await client.end();
    return new Response(JSON.stringify({ success: true, message: 'user_profiles table created' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    try { await client.end(); } catch(e) {}
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/migrate' };
