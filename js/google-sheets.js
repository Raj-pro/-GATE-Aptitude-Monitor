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
    const spreadsheetId = this.getSpreadsheetId();

    // Tier 1: Secure Serverless Backend Proxy (/api/sync)
    if (window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable) {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          if (data && data.state && typeof data.state === 'object') {
            console.log('Progress loaded from /api/sync (state object)');
            return data.state;
          }
          if (data && data.videoRows && data.videoRows.length > 0) {
            const parsed = this.parseSheetData(data.videoRows, data.dailyRows, data.stateRows);
            if (parsed) {
              console.log('Progress loaded from /api/sync (parsed rows)');
              return parsed;
            }
          }
        }
      } catch (e) {
        console.warn('Could not load from /api/sync:', e);
      }
    }

    // Tier 2: Google Apps Script Web App URL (Direct)
    const webAppUrl = this.webAppUrl || (window.envConfig && window.envConfig.config && window.envConfig.config.webAppUrl);
    if (webAppUrl) {
      try {
        const res = await fetch(webAppUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.state && typeof data.state === 'object') {
            console.log('Progress loaded from Web App URL (state object)');
            return data.state;
          }
          if (data && data.videoRows && data.videoRows.length > 0) {
            const parsed = this.parseSheetData(data.videoRows, data.dailyRows, data.stateRows);
            if (parsed) {
              console.log('Progress loaded from Web App URL (parsed rows)');
              return parsed;
            }
          }
        }
      } catch (e) {
        console.warn('Could not load directly from Web App URL:', e);
      }
    }

    // Tier 3: Direct Google Sheets GViz Query (JSONP - works in ANY browser without CORS or login)
    if (spreadsheetId) {
      try {
        const gvizData = await this.loadViaGviz(spreadsheetId);
        if (gvizData) {
          console.log('Progress loaded directly from Google Sheets GViz endpoint');
          return gvizData;
        }
      } catch (e) {
        console.warn('Direct GViz fetch warning:', e);
      }
    }

    // Tier 4: Google OAuth 2.0 (GAPI batchGet if authenticated)
    if (window.googleAuth && window.googleAuth.isAuthenticated()) {
      try {
        const response = await gapi.client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: spreadsheetId,
          ranges: ['Daily_Progress!A2:G', 'Video_Logs!A2:I', 'System_State!A2:C']
        });

        const valueRanges = response.result.valueRanges;
        if (valueRanges && valueRanges.length >= 2) {
          const videoRows = valueRanges[1].values || [];
          const dailyRows = valueRanges[0].values || [];
          const stateRows = valueRanges[2] ? valueRanges[2].values || [] : [];
          const parsed = this.parseSheetData(videoRows, dailyRows, stateRows);
          if (parsed) {
            console.log('Progress loaded via Google OAuth batchGet');
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Could not restore from Google Sheets OAuth:', err);
      }
    }

    return null;
  }

  // Load directly from public Google Sheets using JSONP
  async loadViaGviz(spreadsheetId) {
    try {
      const [videoRows, dailyRows, stateRows] = await Promise.all([
        this.fetchGvizSheetJsonp(spreadsheetId, 'Video_Logs'),
        this.fetchGvizSheetJsonp(spreadsheetId, 'Daily_Progress'),
        this.fetchGvizSheetJsonp(spreadsheetId, 'System_State')
      ]);

      if (videoRows && videoRows.length > 0) {
        return this.parseSheetData(videoRows, dailyRows, stateRows);
      }
    } catch (err) {
      console.warn('loadViaGviz error:', err);
    }
    return null;
  }

  // Fetch sheet table data via dynamic script tag (JSONP avoids CORS blocks)
  fetchGvizSheetJsonp(spreadsheetId, sheetName) {
    return new Promise((resolve) => {
      const cbName = 'gviz_cb_' + Math.random().toString(36).substring(2, 10);
      const script = document.createElement('script');
      let isDone = false;

      const timeout = setTimeout(() => {
        cleanup();
        resolve([]);
      }, 8000);

      function cleanup() {
        if (isDone) return;
        isDone = true;
        clearTimeout(timeout);
        try {
          delete window[cbName];
        } catch (e) {
          window[cbName] = undefined;
        }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[cbName] = (resp) => {
        cleanup();
        if (!resp || !resp.table || !resp.table.rows) {
          resolve([]);
          return;
        }
        const rows = resp.table.rows.map(r => 
          r && r.c ? r.c.map(cell => (cell ? (cell.f !== undefined ? cell.f : (cell.v !== null ? cell.v : '')) : '')) : []
        );
        resolve(rows);
      };

      script.onerror = () => {
        cleanup();
        resolve([]);
      };

      script.src = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=responseHandler:${cbName}&sheet=${encodeURIComponent(sheetName)}`;
      document.head.appendChild(script);
    });
  }

  parseSheetData(videoRows, dailyRows, stateRows = []) {
    if (!videoRows || videoRows.length === 0) return null;

    // Filter out potential header row
    const cleanVideoRows = videoRows.filter(row => {
      const first = String(row[0] || '').trim();
      return first && first !== 'Video #' && !isNaN(parseInt(first, 10));
    });

    if (cleanVideoRows.length === 0) return null;

    const restoredVideos = {};
    cleanVideoRows.forEach(row => {
      const index = parseInt(row[0], 10);
      const youtubeId = String(row[8] || '').trim();
      const lec = PLAYLIST_DATA.find(l => l.index === index) || (youtubeId ? PLAYLIST_DATA.find(l => l.youtubeId === youtubeId) : null);
      if (lec) {
        const statusStr = String(row[3] || '');
        const isSeen = (!statusStr.includes('UNSEEN') && statusStr.includes('SEEN')) || statusStr.includes('✅');
        let percent = parseInt(String(row[4] || '0').replace('%', ''), 10);
        if (isNaN(percent)) percent = 0;
        let currentTime = parseInt(row[5] || '0', 10);
        if (isNaN(currentTime)) currentTime = 0;

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

    // Parse Daily Progress
    const cleanDailyRows = (dailyRows || []).filter(row => {
      const first = String(row[0] || '').trim();
      return first && first !== 'Day Batch' && first.startsWith('Day');
    });

    const restoredDays = {};
    cleanDailyRows.forEach((row, i) => {
      const dayMatch = String(row[0] || '').match(/\d+/);
      const dayNum = dayMatch ? parseInt(dayMatch[0], 10) : (i + 1);
      const isComplete = String(row[2] || '').includes('COMPLETED') || String(row[2] || '').includes('✅');
      const watchedMatch = String(row[4] || '').match(/^(\d+)/);
      const watchedCount = watchedMatch ? parseInt(watchedMatch[1], 10) : (isComplete ? 4 : 0);

      restoredDays[dayNum] = {
        day: dayNum,
        completed: isComplete,
        completedAt: row[3] && row[3] !== '-' ? row[3] : null,
        videosWatched: watchedCount
      };
    });

    // Parse System State (current active day, streak)
    let currentActiveDay = null;
    let streakDays = 1;
    if (Array.isArray(stateRows)) {
      stateRows.forEach(row => {
        const metric = String(row[0] || '').toLowerCase();
        const val = String(row[1] || '');
        if (metric.includes('current active day')) {
          const m = val.match(/\d+/);
          if (m) currentActiveDay = parseInt(m[0], 10);
        } else if (metric.includes('streak')) {
          const m = val.match(/\d+/);
          if (m) streakDays = parseInt(m[0], 10);
        }
      });
    }

    // Determine appropriate active day (advance if currentActiveDay is already completed)
    if (!currentActiveDay || (restoredDays[currentActiveDay] && restoredDays[currentActiveDay].completed)) {
      for (let d = 1; d <= TOTAL_DAYS; d++) {
        if (!restoredDays[d] || !restoredDays[d].completed) {
          currentActiveDay = d;
          break;
        }
      }
    }
    if (!currentActiveDay) currentActiveDay = 1;

    // Determine current video ID (first unseen lecture of currentActiveDay)
    let currentVideoId = null;
    const dayLecs = getLecturesForDay(currentActiveDay);
    const firstUnseenInDay = dayLecs.find(l => !restoredVideos[l.id]?.seen);
    if (firstUnseenInDay) {
      currentVideoId = firstUnseenInDay.id;
    } else {
      const anyUnseen = PLAYLIST_DATA.find(l => !restoredVideos[l.id]?.seen);
      currentVideoId = anyUnseen ? anyUnseen.id : (PLAYLIST_DATA[0]?.id || 'vid_1');
    }

    return {
      version: 1,
      currentActiveDay,
      currentVideoId,
      videos: restoredVideos,
      days: restoredDays,
      stats: {
        streakDays
      }
    };
  }
}

window.googleSheets = new GoogleSheetsManager();
