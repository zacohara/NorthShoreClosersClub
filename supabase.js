import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Load all quiz results for all users
 * Returns: { "Zac": { 0: { score, total, passed, trail, ts }, ... }, ... }
 */
export async function loadAllProgress() {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Load failed:', error);
    return {};
  }

  const progress = {};
  for (const row of data) {
    if (!progress[row.user_name]) progress[row.user_name] = {};
    progress[row.user_name][row.quiz_index] = {
      score: row.score,
      total: row.total,
      passed: row.passed,
      trail: row.trail,
      ts: new Date(row.updated_at).getTime(),
    };
  }
  return progress;
}

/**
 * Save a quiz result (upsert — insert or update)
 * Only overwrites if: new pass, or not previously passed
 */
export async function saveQuizResult(userName, quizIndex, result) {
  const { error } = await supabase
    .from('quiz_results')
    .upsert(
      {
        user_name: userName,
        quiz_index: quizIndex,
        score: result.score,
        total: result.total,
        passed: result.passed,
        trail: result.trail,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_name,quiz_index' }
    );

  if (error) {
    console.error('Save failed:', error);
    return false;
  }
  return true;
}

/**
 * Load all blind spot analyses for a user
 */
export async function loadAnalyses(userName) {
  const { data, error } = await supabase
    .from('blind_spot_analyses')
    .select('*')
    .eq('user_name', userName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Load analyses failed:', error);
    return [];
  }
  return data || [];
}

/**
 * Load all analyses for all users (admin)
 */
export async function loadAllAnalyses() {
  const { data, error } = await supabase
    .from('blind_spot_analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Load all analyses failed:', error);
    return [];
  }
  return data || [];
}

/**
 * Save a blind spot analysis
 */
export async function saveAnalysis(userName, transcript, analysis, overallGrade) {
  const { error } = await supabase
    .from('blind_spot_analyses')
    .insert({
      user_name: userName,
      transcript: transcript,
      analysis: analysis,
      overall_grade: overallGrade || null,
    });

  if (error) {
    console.error('Save analysis failed:', error);
    return false;
  }
  return true;
}

/**
 * Load the most recent weekly digest for a user
 */
export async function loadLatestDigest(userName) {
  const { data, error } = await supabase
    .from('weekly_digests')
    .select('*')
    .eq('user_name', userName)
    .order('week_of', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Load digest failed:', error);
    return null;
  }
  return data?.[0] || null;
}

/**
 * Load a single user profile
 */
export async function loadProfile(userName) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_name', userName)
    .limit(1);
  if (error) { console.error('Load profile failed:', error); return null; }
  return data?.[0] || null;
}

/**
 * Load all user profiles (for login screen avatars)
 */
export async function loadAllProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');
  if (error) { console.error('Load all profiles failed:', error); return {}; }
  const map = {};
  (data || []).forEach(p => { map[p.user_name] = p; });
  return map;
}

/**
 * Save/update a user profile (upsert)
 */
export async function saveProfile(userName, updates) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert(
      { user_name: userName, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'user_name' }
    );
  if (error) { console.error('Save profile failed:', error); return false; }
  return true;
}

/**
 * Update streak for a user (call on each login/activity)
 */
export async function updateStreak(userName) {
  const today = new Date().toISOString().split('T')[0];
  const profile = await loadProfile(userName);
  if (!profile) {
    await saveProfile(userName, { streak_current: 1, streak_best: 1, last_active_date: today });
    return { current: 1, best: 1 };
  }
  if (profile.last_active_date === today) {
    return { current: profile.streak_current || 0, best: profile.streak_best || 0 };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = profile.last_active_date === yesterday ? (profile.streak_current || 0) + 1 : 1;
  let newBest = Math.max(newStreak, profile.streak_best || 0);
  await saveProfile(userName, { streak_current: newStreak, streak_best: newBest, last_active_date: today });
  return { current: newStreak, best: newBest };
}
