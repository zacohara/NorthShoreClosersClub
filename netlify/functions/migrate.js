import pg from 'pg';
const { Client } = pg;

const REF = 'wkrtbjvbjebhbcjwurhb';
const PASS = Buffer.from('RGllZ29EYWtvdGEzNzQyIQ==', 'base64').toString();
const DB = 'postgres';

const HOSTS = [
  `aws-0-us-east-1.pooler.supabase.com`,
  `aws-0-us-east-2.pooler.supabase.com`,
  `aws-0-us-west-1.pooler.supabase.com`,
  `aws-0-us-central-1.pooler.supabase.com`,
  `db.${REF}.supabase.co`,
];

export default async (req) => {
  const sql = `
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
    DO $$ BEGIN create policy "Allow all reads on digests" on weekly_digests for select using (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN create policy "Allow all inserts on digests" on weekly_digests for insert with check (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN create policy "Allow all updates on digests" on weekly_digests for update using (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
    create index if not exists idx_digests_user on weekly_digests(user_name);
    create index if not exists idx_digests_week on weekly_digests(user_name, week_of);
  `;

  const errors = [];
  for (const host of HOSTS) {
    for (const port of [6543, 5432]) {
      const user = host.includes('pooler') ? `postgres.${REF}` : 'postgres';
      const cs = `postgresql://${user}:${encodeURIComponent(PASS)}@${host}:${port}/${DB}`;
      const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      try {
        await client.connect();
        await client.query(sql);
        await client.end();
        return new Response(JSON.stringify({ success: true, host, port, message: 'weekly_digests created' }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        errors.push({ host, port, error: err.message });
        try { await client.end(); } catch(e) {}
      }
    }
  }

  return new Response(JSON.stringify({ error: 'All connection attempts failed', attempts: errors }), {
    status: 500, headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/migrate' };
