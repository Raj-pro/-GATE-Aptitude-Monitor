/**
 * Google Sheets API Integration for Lecture Monitor System
 * Target Spreadsheet: 1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY
 */

class GoogleSheetsManager {
  constructor() {
    this.sheetsReady = false;
    this.DEFAULT_SPREADSHEET_ID = '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY';
    this.webAppUrl = localStorage.getItem('gate_google_webapp_url') || '';
  }

  getSpreadsheetId() {
    return (window.googleAuth && window.googleAuth.config.spreadsheetId) || this.DEFAULT_SPREADSHEET_ID;
  }

  setWebAppUrl(url) {
    this.webAppUrl = (url || '').trim();
    localStorage.setItem('gate_google_webapp_url', this.webAppUrl);
  }

  // Format payload for sync
  prepareSyncPayload(state) {
    const timestamp = new Date().toLocaleString();
    const stats = window.lectureTracker ? window.lectureTracker.getOverallStats() : {};

    // 1. Prepare Daily_Progress data
    const dailyHeaders = ['Day Batch', 'Covered Topics', 'Completion Status', 'Date Completed', 'Videos Watched', 'Total Watch Time', 'Notes'];
    const dailyRows = [dailyHeaders];
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const info = getDayInfo(d);
      const dayState = state.days[d] || { completed: false, videosWatched: 0, completedAt: null };
      const statusText = dayState.completed ? 'COMPLETED ✅' : (dayState.videosWatched > 0 ? 'IN PROGRESS ⏳' : 'NOT STARTED ⭕');
      const completedDate = dayState.completedAt ? new Date(dayState.completedAt).toLocaleString() : '-';

      dailyRows.push([
        `Day ${d}`,
        info.topics,
        statusText,
        completedDate,
        `${dayState.videosWatched} / ${info.lectureCount}`,
        info.totalDurationFormatted,
        dayState.completed ? 'Goal Achieved!' : `Remaining: ${info.lectureCount - dayState.videosWatched}`
      ]);
    }

    // 2. Prepare Video_Logs data
    const videoHeaders = ['Video #', 'Lecture Title', 'Day', 'Status', 'Progress %', 'Watch Time (s)', 'Duration (s)', 'Last Watched At', 'Video ID'];
    const videoRows = [videoHeaders];
    PLAYLIST_DATA.forEach(lec => {
      const vidState = state.videos[lec.id] || { seen: false, percent: 0, currentTime: 0, lastWatchedAt: null };
      const status = vidState.seen ? 'SEEN ✅' : (vidState.percent > 0 ? 'WATCHING ⏳' : 'UNSEEN ⭕');
      const lastWatched = vidState.lastWatchedAt ? new Date(vidState.lastWatchedAt).toLocaleString() : '-';

      videoRows.push([
        lec.index,
        lec.title,
        `Day ${lec.day}`,
        status,
        `${vidState.percent}%`,
        vidState.currentTime || 0,
        lec.duration,
        lastWatched,
        lec.youtubeId
      ]);
    });

    // 3. Prepare System_State data
    const stateRows = [
      ['Metric', 'Value', 'Last Synced At'],
      ['Current Active Day', `Day ${state.currentActiveDay}`, timestamp],
      ['Total Lectures Watched', `${stats.seenVideos || 0} / ${stats.totalVideos || 56}`, timestamp],
      ['Completed Days', `${stats.completedDays || 0} / ${TOTAL_DAYS}`, timestamp],
      ['Overall Progress', `${stats.overallPercent || 0}%`, timestamp],
      ['Study Streak', `${stats.streakDays || 1} Days 🔥`, timestamp],
      ['Total Time Spent', stats.totalTimeFormatted || '0m', timestamp],
      ['Playlist Source', DEFAULT_PLAYLIST_ID, timestamp],
      ['Last System Sync', timestamp, timestamp]
    ];

    return { dailyRows, videoRows, stateRows, timestamp, state };
  }

  // Ensure sheets and headers exist (OAuth mode)
  async ensureStructure() {
    const spreadsheetId = this.getSpreadsheetId();
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });

      const existingSheets = response.result.sheets.map(s => s.properties.title);
      const requiredSheets = ['Daily_Progress', 'Video_Logs', 'System_State'];
      const missingSheets = requiredSheets.filter(name => !existingSheets.includes(name));

      if (missingSheets.length > 0) {
        const requests = missingSheets.map(title => ({
          addSheet: { properties: { title: title } }
        }));
        await gapi.client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId,
          resource: { requests: requests }
        });
      }
      this.sheetsReady = true;
      return true;
    } catch (err) {
      console.error('Failed to verify Google Sheets structure:', err);
      throw err;
    }
  }

  // Write full sync data to Google Sheets (Supports both Serverless Proxy, WebApp direct sync & OAuth)
  async syncToGoogleSheet(state) {
    const payload = this.prepareSyncPayload(state);

    // Method 1: Secure Serverless Backend Proxy (/api/sync) - Zero keys exposed to browser
    if (window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable) {
      try {
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          console.log('Google Sheets synced securely via Vercel backend /api/sync at', payload.timestamp);
          return { success: true, timestamp: payload.timestamp, mode: 'serverless' };
        }
      } catch (err) {
        console.warn('Vercel backend sync warning:', err);
      }
    }

    // Method 2: If manual Web App URL was entered locally
    if (this.webAppUrl) {
      try {
        const response = await fetch(this.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        });
        console.log('Google Sheets synced via manual webhook at', payload.timestamp);
        return { success: true, timestamp: payload.timestamp, mode: 'webhook' };
      } catch (err) {
        console.warn('Manual webhook error:', err);
      }
    }

    // Method 3: Via Google OAuth 2.0 (GAPI)
    if (window.googleAuth && window.googleAuth.isAuthenticated()) {
      const spreadsheetId = this.getSpreadsheetId();
      try {
        await this.ensureStructure();

        const valueData = [
          {
            range: 'Daily_Progress!A1:G' + payload.dailyRows.length,
            values: payload.dailyRows
          },
          {
            range: 'Video_Logs!A1:I' + payload.videoRows.length,
            values: payload.videoRows
          },
          {
            range: 'System_State!A1:C' + payload.stateRows.length,
            values: payload.stateRows
          }
        ];

        await gapi.client.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: spreadsheetId,
          resource: {
            valueInputOption: 'USER_ENTERED',
            data: valueData
          }
        });

        console.log('Google Sheets synced successfully via OAuth at', payload.timestamp);
        return { success: true, timestamp: payload.timestamp, mode: 'oauth' };
      } catch (err) {
        console.error('OAuth sync error:', err);
        return { success: false, error: err.message };
      }
    }

    return { success: false, error: 'No sync method available' };
  }

  // Restore progress from Google Sheets on initial load
  async loadFromGoogleSheet() {
    if (this.webAppUrl) {
      try {
        const res = await fetch(this.webAppUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.videoRows) {
            return this.parseSheetData(data.videoRows, data.dailyRows);
          }
        }
      } catch (e) {
        console.warn('Could not load from Web App URL:', e);
      }
    }

    if (!window.googleAuth || !window.googleAuth.isAuthenticated()) {
      return null;
    }

    const spreadsheetId = this.getSpreadsheetId();
    try {
      const response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetId,
        ranges: ['Daily_Progress!A2:G', 'Video_Logs!A2:I', 'System_State!A2:B']
      });

      const valueRanges = response.result.valueRanges;
      if (!valueRanges || valueRanges.length < 2) return null;

      const videoRows = valueRanges[1].values || [];
      const dailyRows = valueRanges[0].values || [];
      return this.parseSheetData(videoRows, dailyRows);
    } catch (err) {
      console.warn('Could not restore from Google Sheet:', err);
      return null;
    }
  }

  parseSheetData(videoRows, dailyRows) {
    if (!videoRows || videoRows.length === 0) return null;

    const restoredVideos = {};
    videoRows.forEach(row => {
      const index = parseInt(row[0], 10);
      const lec = PLAYLIST_DATA.find(l => l.index === index);
      if (lec) {
        const isSeen = (row[3] || '').includes('SEEN') || (row[3] || '').includes('✅');
        const percent = parseInt(row[4] || '0', 10);
        const currentTime = parseInt(row[5] || '0', 10);

        restoredVideos[lec.id] = {
          id: lec.id,
          seen: isSeen,
          percent: isSeen ? 100 : percent,
          currentTime: currentTime,
          duration: lec.duration,
          lastWatchedAt: row[7] && row[7] !== '-' ? row[7] : null
        };
      }
    });

    const restoredDays = {};
    (dailyRows || []).forEach((row, i) => {
      const dayNum = i + 1;
      const isComplete = (row[2] || '').includes('COMPLETED') || (row[2] || '').includes('✅');
      const watchedMatch = (row[4] || '').match(/^(\d+)/);
      const watchedCount = watchedMatch ? parseInt(watchedMatch[1], 10) : (isComplete ? 4 : 0);

      restoredDays[dayNum] = {
        day: dayNum,
        completed: isComplete,
        completedAt: row[3] && row[3] !== '-' ? row[3] : null,
        videosWatched: watchedCount
      };
    });

    return {
      videos: restoredVideos,
      days: restoredDays
    };
  }
}

window.googleSheets = new GoogleSheetsManager();
