const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const key = event.queryStringParameters?.key;
  if (key !== 'buildinggreatness') {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );

  // Try to add password column - if it already exists, the upsert will just work
  // Use raw RPC if available, otherwise handle gracefully
  try {
    // Test if password column exists by querying it
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_name')
      .limit(1);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    // Try upserting with password field
    const { error: testError } = await supabase
      .from('user_profiles')
      .upsert({ user_name: '__migration_test__', password: null }, { onConflict: 'user_name' });

    if (testError && testError.message.includes('password')) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ 
          status: 'needs_migration',
          message: 'Password column does not exist yet. Please run: ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password TEXT DEFAULT NULL;'
        })
      };
    }

    // Clean up test row
    await supabase.from('user_profiles').delete().eq('user_name', '__migration_test__');

    return { statusCode: 200, body: JSON.stringify({ status: 'ok', message: 'Password column exists' }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
