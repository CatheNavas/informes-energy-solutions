export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
 
  const { system, user } = req.body;
 
  if (!system || !user) {
    return res.status(400).json({ error: 'Faltan parámetros system o user' });
  }
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // ← Key oculta en Vercel
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: system,
        messages: [{ role: 'user', content: user }],
      }),
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Error en Claude API' });
    }
 
    return res.status(200).json({ texto: data.content[0].text });
 
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
