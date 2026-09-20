/**
 * Vercel Serverless Function: /api/config
 * Exposes environment variables configured in Vercel to the frontend client.
 */

export default function handler(req, res) {
  // Set CORS and Cache-Control headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const config = {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY',
    serverSyncAvailable: Boolean(process.env.GOOGLE_WEBAPP_URL),
    webAppUrl: process.env.GOOGLE_WEBAPP_URL || '',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    playlistId: process.env.YOUTUBE_PLAYLIST_ID || 'PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS'
  };

  return res.status(200).json(config);
}
