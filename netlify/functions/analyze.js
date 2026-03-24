export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { transcript, userName } = await req.json();

    if (!transcript || transcript.trim().length < 50) {
      return new Response(JSON.stringify({ error: 'Transcript too short. Paste at least a few exchanges.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a Sandler Selling System expert coaching North Shore Masonry reps. NSM is a 47-year family masonry business, ~27 crews across Chicago, Milwaukee, Dallas, Indianapolis.

We sell: residential chimney repair, tuckpointing, steps, retaining walls, foundations ($5K-$50K) and commercial facade restoration, waterproofing, structural repair ($25K-$500K+). We compete on quality and process, not price.

Analyze this sales appointment transcript. Return ONLY valid JSON.

{"grade":"C+","summary":"One sentence max 15 words direct assessment","wentWell":[{"label":"2-4 words","detail":"What they did right max 20 words","quote":"Exact words from transcript or null"},{"label":"2-4 words","detail":"Max 20 words","quote":"Exact words or null"}],"wentPoorly":[{"label":"2-4 words","detail":"What went wrong max 20 words","quote":"Exact words showing the problem or null"},{"label":"2-4 words","detail":"Max 20 words","quote":"Exact words or null"}],"actionItem":"One specific thing to do at the NEXT appointment. Max 20 words. Concrete.","expanded":{"scorecard":[{"step":"Bonding & Rapport","grade":"B+","detail":"2-3 sentences with specific examples from transcript"},{"step":"Up-Front Contract","grade":"F","detail":"2-3 sentences"},{"step":"Pain / Pain Funnel","grade":"D","detail":"2-3 sentences"},{"step":"Budget","grade":"D+","detail":"2-3 sentences"},{"step":"Decision","grade":"C","detail":"2-3 sentences"},{"step":"Fulfillment","grade":"B-","detail":"2-3 sentences"},{"step":"Post-Sell","grade":"C","detail":"2-3 sentences"}],"missedOpportunities":["Specific moment they should have said X but didn't","Another missed moment"],"scriptToPractice":"Exact words to say next time. 2-3 sentences."}}

RULES: wentWell and wentPoorly EXACTLY 2 items each. Include actual quotes from transcript. Grades: A/A-/B+/B/B-/C+/C/C-/D+/D/D-/F. Be direct. No soft language. Return ONLY JSON.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Transcript from ${userName}:\n\n${transcript}` }],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text());
      return new Response(JSON.stringify({ error: 'AI analysis failed. Try again.' }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const rawText = data.content.map((b) => b.text || '').join('');

    let analysis;
    try {
      analysis = JSON.parse(rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim());
    } catch (e) {
      return new Response(JSON.stringify({ analysis: { grade: '?', summary: 'Analysis complete', wentWell: [], wentPoorly: [], actionItem: 'Review transcript manually', expanded: null, raw: rawText } }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ analysis }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/analyze' };
