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
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY';

  try {
    if (req.method === 'POST') {
      if (!webAppUrl) {
        return res.status(400).json({
          success: false,
          error: 'GOOGLE_WEBAPP_URL is not configured in Vercel Environment Variables.'
        });
      }

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
      // 1. Try Apps Script GET if configured
      if (webAppUrl) {
        try {
          const response = await fetch(webAppUrl);
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (data && (data.videoRows || data.videos || !data.error)) {
              return res.status(200).json(data);
            }
          } catch (jsonErr) {
            // Apps script returned HTML error (e.g. "Script function not found: doGet")
            console.log('Apps Script GET returned non-JSON, falling back to direct GViz query');
          }
        } catch (fetchErr) {
          console.warn('Apps Script GET request error:', fetchErr);
        }
      }

      // 2. Direct GViz Fallback from Google Sheets
      try {
        const [videoRows, dailyRows, stateRows] = await Promise.all([
          fetchGvizSheet(spreadsheetId, 'Video_Logs'),
          fetchGvizSheet(spreadsheetId, 'Daily_Progress'),
          fetchGvizSheet(spreadsheetId, 'System_State')
        ]);

        if (videoRows && videoRows.length > 0) {
          return res.status(200).json({
            success: true,
            source: 'gviz_direct',
            videoRows,
            dailyRows,
            stateRows
          });
        }
      } catch (gvizErr) {
        console.error('GViz sheet fetch error:', gvizErr);
      }

      return res.status(404).json({ success: false, error: 'No sheet data could be retrieved' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Vercel sync proxy error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function fetchGvizSheet(spreadsheetId, sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!match) return [];
  const parsed = JSON.parse(match[1]);
  if (!parsed || !parsed.table || !parsed.table.rows) return [];
  return parsed.table.rows.map(r => 
    r.c.map(cell => (cell ? (cell.f !== undefined ? cell.f : (cell.v !== null ? cell.v : '')) : ''))
  );
}
