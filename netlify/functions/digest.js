// Generates weekly coaching digests for each rep
// Runs on a schedule (Monday 8am CT) or can be triggered manually
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const USERS = ["Devin","Jace","Les","Zac","Luke","Paul","Carlos","BJ"];

export default async (req) => {
  try {
    // Load all quiz results
    const { data: quizData } = await supabase
      .from('quiz_results')
      .select('*')
      .order('updated_at', { ascending: false });

    // Load all blind spot analyses from last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: analysisData } = await supabase
      .from('blind_spot_analyses')
      .select('*')
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: false });

    const digests = [];

    for (const user of USERS) {
      // Quiz progress
      const userQuizzes = (quizData || []).filter(q => q.user_name === user);
      const passed = userQuizzes.filter(q => q.passed).length;
      const totalRight = userQuizzes.reduce((s, q) => s + (q.score || 0), 0);
      const totalAns = userQuizzes.reduce((s, q) => s + (q.total || 0), 0);
      const accuracy = totalAns > 0 ? Math.round(totalRight / totalAns * 100) : 0;

      // Recent quiz activity (last 7 days)
      const recentQuizzes = userQuizzes.filter(q =>
        new Date(q.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      // Blind spot analyses this week
      const userAnalyses = (analysisData || []).filter(a => a.user_name === user);
      const grades = userAnalyses.map(a => a.overall_grade).filter(Boolean);

      // Find weakest Sandler step across all analyses
      const stepScores = {};
      for (const analysis of userAnalyses) {
        let parsed;
        try { parsed = typeof analysis.analysis === 'string' ? JSON.parse(analysis.analysis) : analysis.analysis; }
        catch(e) { continue; }
        if (parsed?.scorecard) {
          for (const s of parsed.scorecard) {
            if (!stepScores[s.step]) stepScores[s.step] = [];
            stepScores[s.step].push(s.grade);
          }
        }
      }

      // Calculate weakest step
      const gradeToNum = (g) => {
        if (!g) return 0;
        const map = {'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0};
        return map[g] || 0;
      };

      let weakestStep = null;
      let weakestAvg = 5;
      for (const [step, grades] of Object.entries(stepScores)) {
        const avg = grades.reduce((s, g) => s + gradeToNum(g), 0) / grades.length;
        if (avg < weakestAvg) {
          weakestAvg = avg;
          weakestStep = step;
        }
      }

      // Build digest
      const digest = {
        user_name: user,
        week_of: new Date().toISOString().split('T')[0],
        quizzes_passed: passed,
        quizzes_total: 15,
        accuracy: accuracy,
        quizzes_this_week: recentQuizzes.length,
        analyses_this_week: userAnalyses.length,
        analysis_grades: grades,
        weakest_step: weakestStep,
        weakest_step_avg: weakestAvg < 5 ? weakestAvg.toFixed(1) : null,
        active: recentQuizzes.length > 0 || userAnalyses.length > 0,
        tip: weakestStep
          ? `Focus on ${weakestStep} this week. Before every call, write down your ${weakestStep.toLowerCase()} game plan.`
          : passed < 15
            ? `You have ${15 - passed} quizzes left. Try to pass one today.`
            : `All quizzes passed! Use the Blind Spot Revealer to keep sharpening.`
      };

      digests.push(digest);
    }

    // Upsert digests to Supabase
    for (const d of digests) {
      await supabase
        .from('weekly_digests')
        .upsert(
          { ...d, created_at: new Date().toISOString() },
          { onConflict: 'user_name,week_of' }
        );
    }

    return new Response(JSON.stringify({ success: true, digests: digests.length }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Digest error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Run every Monday at 8am CT (13:00 UTC in CDT, 14:00 UTC in CST)
export const config = {
  schedule: '0 14 * * 1',
};
