/**
 * Vercel Serverless Function: /api/sync
 * Secure backend sync handler using server-side environment variables.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const webAppUrl = process.env.GOOGLE_WEBAPP_URL;

  if (!webAppUrl) {
    return res.status(400).json({
      success: false,
      error: 'GOOGLE_WEBAPP_URL is not configured in Vercel Environment Variables.'
    });
  }

  try {
    if (req.method === 'POST') {
      const payload = req.body;
      const response = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof payload === 'string' ? payload : JSON.stringify(payload)
      });

      const responseText = await response.text();
      return res.status(200).json({
        success: true,
        message: 'Synced to Google Sheets successfully via Vercel backend proxy!',
        upstreamResponse: responseText
      });
    }

    if (req.method === 'GET') {
      const response = await fetch(webAppUrl);
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Vercel sync proxy error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
