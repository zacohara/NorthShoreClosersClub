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

Analyze this sales call. Return ONLY valid JSON — no markdown, no backticks, nothing outside the JSON object.

{"grade":"C+","summary":"Max 15 words","scorecard":[{"step":"Bonding & rapport","grade":"C+","note":"Max 10 words"},{"step":"Up-front contract","grade":"F","note":"Max 10 words"},{"step":"Pain / pain funnel","grade":"D","note":"Max 10 words"},{"step":"Budget","grade":"D","note":"Max 10 words"},{"step":"Decision","grade":"C-","note":"Max 10 words"},{"step":"Fulfillment","grade":"B-","note":"Max 10 words"},{"step":"Post-sell","grade":"B","note":"Max 10 words"}],"strengths":["Max 15 words each","3-4 bullets"],"blindSpots":[{"label":"2-3 words","detail":"Max 25 words"},{"label":"Label","detail":"Max 25 words"},{"label":"Label","detail":"Max 25 words"}],"fix":{"headline":"Max 15 words","script":"Exact words to say. 2-3 sentences max."}}

Grades: A/A-/B+/B/B-/C+/C/C-/D/F. Be direct. No soft language. Return ONLY the JSON.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
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
      return new Response(JSON.stringify({ analysis: { grade: '?', summary: 'Analysis complete', scorecard: [], strengths: [], blindSpots: [], fix: { headline: 'See details', script: rawText }, raw: rawText } }), {
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
