import pg from 'pg';
const { Client } = pg;

export default async (req) => {
  const cs = Buffer.from('cG9zdGdyZXNxbDovL3Bvc3RncmVzLndrcnRianZiamViaGJjand1cmhiOnNiX3NlY3JldF9TdkdxNnh4end5YVl6YWlKZlhoc3l3X3ZtZWdUZ1dDQGF3cy0wLXVzLWVhc3QtMS5wb29sZXIuc3VwYWJhc2UuY29tOjY1NDMvcG9zdGdyZXM=', 'base64').toString();
  const client = new Client({
    connectionString: cs,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

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
      DO $$ BEGIN
        create policy "Allow all reads on digests" on weekly_digests for select using (true);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        create policy "Allow all inserts on digests" on weekly_digests for insert with check (true);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        create policy "Allow all updates on digests" on weekly_digests for update using (true);
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      create index if not exists idx_digests_user on weekly_digests(user_name);
      create index if not exists idx_digests_week on weekly_digests(user_name, week_of);
    `;

    await client.query(sql);
    await client.end();

    return new Response(JSON.stringify({ success: true, message: 'weekly_digests table created' }), {
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
