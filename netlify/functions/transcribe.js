// Transcribes audio files using OpenAI Whisper API
// Requires OPENAI_API_KEY env var in Netlify

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Audio transcription not configured. Paste your transcript text instead.' }), {
      status: 501, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward to OpenAI Whisper
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, audioFile.name || 'audio.m4a');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('response_format', 'text');
    whisperForm.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: whisperForm,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Whisper error:', err);
      return new Response(JSON.stringify({ error: 'Transcription failed. Try pasting the transcript text instead.' }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    const transcript = await response.text();

    return new Response(JSON.stringify({ transcript }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Transcribe error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Try pasting the transcript text instead.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/transcribe' };
