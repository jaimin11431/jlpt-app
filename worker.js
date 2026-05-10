export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = 'https://jaimin11431.github.io';
    
    if (origin !== allowedOrigin && origin !== 'http://127.0.0.1:5500' && origin !== 'http://localhost:5500') {
      return new Response('Forbidden', { status: 403 });
    }

    const responseHeaders = {
      'Access-Control-Allow-Origin': origin || allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: responseHeaders });
    }

    try {
      const body = await request.json();

      const groqResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          },
          body: JSON.stringify(body)
        }
      );

      const data = await groqResponse.json();

      return new Response(JSON.stringify(data), {
        status: groqResponse.status,
        headers: {
          ...responseHeaders,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: 500,
        headers: responseHeaders
      });
    }
  }
};
