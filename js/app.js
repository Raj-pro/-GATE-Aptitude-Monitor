/**
 * Main Application Logic & UI Controller
 * GATE Aptitude Cheerful Lecture Monitor
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const el = {
    // Header & Auth
    googleLoginBtn: document.getElementById('google-login-btn'),
    userProfileWidget: document.getElementById('user-profile-widget'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    syncPill: document.getElementById('sync-pill'),
    syncStatusText: document.getElementById('sync-status-text'),
    syncTimerBadge: document.getElementById('sync-timer-badge'),
    syncNowBtn: document.getElementById('sync-now-btn'),
    settingsBtn: document.getElementById('settings-btn'),

    // Active 4-Lecture Milestone Goal
    activeGoalCard: document.getElementById('active-goal-card'),
    daySelector: document.getElementById('day-selector'),
    goalDayTitle: document.getElementById('goal-day-title'),
    goalDayTopics: document.getElementById('goal-day-topics'),
    fourLectureTrack: document.getElementById('four-lecture-track'),
    goalProgressText: document.getElementById('goal-progress-text'),
    goalProgressBar: document.getElementById('goal-progress-bar'),
    goalCelebrationBox: document.getElementById('goal-celebration-box'),

    // Video Player Bar
    currentVideoTopic: document.getElementById('current-video-topic'),
    currentVideoTitle: document.getElementById('current-video-title'),
    currentVideoDuration: document.getElementById('current-video-duration'),
    currentVideoProgressText: document.getElementById('current-video-progress-text'),
    watchOnYoutubeBtn: document.getElementById('watch-on-youtube-btn'),
    markSeenBtn: document.getElementById('mark-seen-btn'),
    prevVideoBtn: document.getElementById('prev-video-btn'),
    nextVideoBtn: document.getElementById('next-video-btn'),
    speedBtns: document.querySelectorAll('.speed-btn'),

    // Stats
    statCompletedDays: document.getElementById('stat-completed-days'),
    statSeenVideos: document.getElementById('stat-seen-videos'),
    statStreak: document.getElementById('stat-streak'),
    statTotalTime: document.getElementById('stat-total-time'),
    overallProgressBar: document.getElementById('overall-progress-bar'),
    overallProgressText: document.getElementById('overall-progress-text'),

    // Playlist Drawer & Filters
    playlistSearchInput: document.getElementById('playlist-search-input'),
    filterTags: document.querySelectorAll('.filter-tag'),
    playlistScrollList: document.getElementById('playlist-scroll-list'),
    playlistCountPill: document.getElementById('playlist-count-pill'),

    // Modals
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    envStatusBanner: document.getElementById('env-status-banner'),
    inputWebAppUrl: document.getElementById('input-webapp-url'),
    showScriptCodeBtn: document.getElementById('show-script-code-btn'),
    inputClientId: document.getElementById('input-client-id'),
    inputSheetId: document.getElementById('input-sheet-id'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    importJsonInput: document.getElementById('import-json-input'),
    resetDataBtn: document.getElementById('reset-data-btn'),

    // Celebration Modal
    celebrationModal: document.getElementById('celebration-modal'),
    celebrationCloseBtn: document.getElementById('celebration-close-btn'),
    celebrationNextDayBtn: document.getElementById('celebration-next-day-btn'),
    celebrationDayNum: document.getElementById('celebration-day-num'),

    // Toast Container
    toastContainer: document.getElementById('toast-container'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  let activeFilter = 'all';
  let searchQuery = '';

  // 1. Initialize UI Elements & YouTube Player
  async function initApp() {
    if (window.envConfig) {
      await window.envConfig.loadConfig();
    }

    populateDaySelector();
    renderActiveDayTarget();
    renderPlaylist();
    renderStats();
    setupEventListeners();
    setupAuthListeners();
    setupSyncListeners();
    setupTrackerListeners();
    setupPlayerListeners();

    // Init YouTube Player
    window.youtubeController.init('youtube-player-container');

    // Check if Google Client ID is configured; if so, attempt initial GIS authorization
    if (window.googleAuth.config.clientId) {
      setTimeout(() => {
        if (!window.googleAuth.isAuthenticated()) {
          console.log('Prompting Google login...');
          // Optional prompt if desired
        }
      }, 1000);
    }
  }

  // Populate Day Selector Dropdown (Day 1 to TOTAL_DAYS)
  function populateDaySelector() {
    el.daySelector.innerHTML = '';
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      const isComp = window.lectureTracker.state.days[d]?.completed;
      opt.textContent = `Milestone Day ${d} ${isComp ? '✅' : ''}`;
      if (d === window.lectureTracker.state.currentActiveDay) {
        opt.selected = true;
      }
      el.daySelector.appendChild(opt);
    }
  }

  // Render the 4-Lecture Milestone Target Banner
  function renderActiveDayTarget() {
    const activeDay = window.lectureTracker.state.currentActiveDay;
    const dayData = window.lectureTracker.getDayData(activeDay);

    el.goalDayTitle.textContent = `Day ${activeDay}: 4-Lecture Target`;
    el.goalDayTopics.textContent = `Topics: ${dayData.topics}`;
    el.goalProgressText.textContent = `${dayData.videosWatched} of ${dayData.lectureCount} Completed`;
    el.goalProgressBar.style.width = `${dayData.progressPercent}%`;

    // Celebration box if completed
    if (dayData.completed) {
      el.goalCelebrationBox.style.display = 'flex';
    } else {
      el.goalCelebrationBox.style.display = 'none';
    }

    // Render 4 lecture chips
    el.fourLectureTrack.innerHTML = '';
    dayData.lectures.forEach((lec, idx) => {
      const chip = document.createElement('div');
      const isPlaying = window.lectureTracker.state.currentVideoId === lec.id;
      const isSeen = lec.progress.seen;

      chip.className = `day-lecture-chip ${isPlaying ? 'active' : ''} ${isSeen ? 'completed' : ''}`;
      chip.innerHTML = `
        <div class="chip-top">
          <span class="chip-num">Lec ${lec.index}</span>
          <span class="chip-status-icon">${isSeen ? '✅' : (isPlaying ? '▶️' : '⭕')}</span>
        </div>
        <div class="chip-title">${lec.title.replace(/^Lecture \d+:\s*/, '')}</div>
        <div class="chip-progress-bar">
          <div class="chip-progress-fill" style="width: ${lec.progress.percent || (isSeen ? 100 : 0)}%"></div>
        </div>
      `;

      chip.addEventListener('click', () => {
        window.youtubeController.loadVideo(lec, true);
        renderActiveDayTarget();
        renderPlaylist();
      });

      el.fourLectureTrack.appendChild(chip);
    });

    // Update current video bar
    updateCurrentVideoBar();
  }

  // Update Current Video Bar Details
  function updateCurrentVideoBar() {
    const currentId = window.lectureTracker.state.currentVideoId;
    const currentLecture = PLAYLIST_DATA.find(l => l.id === currentId) || PLAYLIST_DATA[0];
    const vidProgress = window.lectureTracker.state.videos[currentId] || { seen: false, percent: 0, currentTime: 0 };

    el.currentVideoTopic.textContent = currentLecture.topic;
    el.currentVideoTitle.textContent = currentLecture.title;
    el.currentVideoDuration.textContent = `⏱️ ${formatDuration(currentLecture.duration)}`;
    el.currentVideoProgressText.textContent = `${vidProgress.percent}% Watched (${formatTimestamp(vidProgress.currentTime)})`;

    if (el.watchOnYoutubeBtn && window.youtubeController) {
      el.watchOnYoutubeBtn.href = window.youtubeController.getYouTubeDirectUrl(currentLecture);
    }

    if (vidProgress.seen) {
      el.markSeenBtn.classList.add('is-seen');
      el.markSeenBtn.innerHTML = `<span>✅</span> Marked as Seen`;
    } else {
      el.markSeenBtn.classList.remove('is-seen');
      el.markSeenBtn.innerHTML = `<span>⭕</span> Mark as Seen`;
    }
  }

  // Render Playlist Drawer
  function renderPlaylist() {
    const currentId = window.lectureTracker.state.currentVideoId;
    const activeDay = window.lectureTracker.state.currentActiveDay;

    let filtered = PLAYLIST_DATA.filter(lec => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = lec.title.toLowerCase().includes(q) || lec.topic.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Tag filter
      const isSeen = window.lectureTracker.state.videos[lec.id]?.seen;
      const percent = window.lectureTracker.state.videos[lec.id]?.percent || 0;

      if (activeFilter === 'today') return lec.day === activeDay;
      if (activeFilter === 'seen') return isSeen;
      if (activeFilter === 'unseen') return !isSeen;
      if (activeFilter === 'inprogress') return !isSeen && percent > 0;
      return true;
    });

    el.playlistCountPill.textContent = `${filtered.length} Lectures`;
    el.playlistScrollList.innerHTML = '';

    if (filtered.length === 0) {
      el.playlistScrollList.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">
          No lectures found matching the filter.
        </div>
      `;
      return;
    }

    filtered.forEach(lec => {
      const vidProgress = window.lectureTracker.state.videos[lec.id] || { seen: false, percent: 0 };
      const isPlaying = currentId === lec.id;
      const isSeen = vidProgress.seen;

      const item = document.createElement('div');
      item.className = `playlist-item ${isPlaying ? 'playing' : ''} ${isSeen ? 'seen-item' : ''}`;
      item.innerHTML = `
        <button class="item-check-btn ${isSeen ? 'checked' : ''}" title="${isSeen ? 'Mark Unseen' : 'Mark Seen'}">
          ${isSeen ? '✓' : ''}
        </button>
        <div class="item-info">
          <div class="item-title">${lec.title}</div>
          <div class="item-meta">
            <span class="item-day-tag">Day ${lec.day}</span>
            <span>•</span>
            <span>${formatDuration(lec.duration)}</span>
            <span>•</span>
            <span>${vidProgress.percent}%</span>
          </div>
        </div>
      `;

      // Checkbox click
      const checkBtn = item.querySelector('.item-check-btn');
      checkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.lectureTracker.toggleVideoSeen(lec.id);
      });

      // Item click loads video
      item.addEventListener('click', () => {
        window.youtubeController.loadVideo(lec, true);
        renderActiveDayTarget();
        renderPlaylist();
      });

      el.playlistScrollList.appendChild(item);
    });
  }

  // Render Stats & Streaks Dashboard
  function renderStats() {
    const stats = window.lectureTracker.getOverallStats();

    el.statCompletedDays.textContent = `${stats.completedDays} / ${stats.totalDays}`;
    el.statSeenVideos.textContent = `${stats.seenVideos} / ${stats.totalVideos}`;
    el.statStreak.textContent = `${stats.streakDays} Days 🔥`;
    el.statTotalTime.textContent = stats.totalTimeFormatted;

    el.overallProgressBar.style.width = `${stats.overallPercent}%`;
    el.overallProgressText.textContent = `${stats.overallPercent}% Completed`;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Day Selector Change
    el.daySelector.addEventListener('change', (e) => {
      const selectedDay = parseInt(e.target.value, 10);
      window.lectureTracker.setCurrentActiveDay(selectedDay);
      renderActiveDayTarget();
      renderPlaylist();
    });

    // Mark Seen Button
    el.markSeenBtn.addEventListener('click', () => {
      const currentId = window.lectureTracker.state.currentVideoId;
      window.lectureTracker.toggleVideoSeen(currentId);
    });

    // Previous & Next Video Buttons
    el.prevVideoBtn.addEventListener('click', () => {
      const currentId = window.lectureTracker.state.currentVideoId;
      const idx = PLAYLIST_DATA.findIndex(l => l.id === currentId);
      if (idx > 0) {
        window.youtubeController.loadVideo(PLAYLIST_DATA[idx - 1], true);
      }
    });

    el.nextVideoBtn.addEventListener('click', () => {
      const currentId = window.lectureTracker.state.currentVideoId;
      const idx = PLAYLIST_DATA.findIndex(l => l.id === currentId);
      if (idx < PLAYLIST_DATA.length - 1) {
        window.youtubeController.loadVideo(PLAYLIST_DATA[idx + 1], true);
      }
    });

    // Speed Selector Buttons
    el.speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.getAttribute('data-speed'));
        window.youtubeController.setRate(speed);
      });
    });

    // Search Input
    el.playlistSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPlaylist();
    });

    // Filter Tags
    el.filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        el.filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        activeFilter = tag.getAttribute('data-filter');
        renderPlaylist();
      });
    });

    // Manual Save to Drive & Sheets Button
    el.syncNowBtn.addEventListener('click', async () => {
      const isServerSync = Boolean(window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable);
      const isWebApp = Boolean(window.googleSheets && window.googleSheets.webAppUrl);
      const isOAuth = Boolean(window.googleAuth && window.googleAuth.isAuthenticated());

      if (!isServerSync && !isWebApp && !isOAuth) {
        openSettingsModal();
        showToast('Please configure Google Apps Script Webhook or Google Sign In to save to Drive!', 'info');
      } else {
        showToast('Saving progress to Google Sheets & Google Drive...', 'info');
        await window.syncEngine.performSync(false);
      }
    });

    // Google Login / User Profile Click
    el.googleLoginBtn.addEventListener('click', () => {
      if (!window.googleAuth.config.clientId) {
        openSettingsModal();
        showToast('Please enter your Google OAuth Client ID first!', 'info');
      } else {
        window.googleAuth.requestLogin();
      }
    });

    // Settings Modal
    el.settingsBtn.addEventListener('click', openSettingsModal);
    el.closeSettingsBtn.addEventListener('click', closeSettingsModal);
    el.saveSettingsBtn.addEventListener('click', saveSettings);

    // Export & Import JSON
    el.exportJsonBtn.addEventListener('click', () => {
      const json = window.lectureTracker.exportJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gate_aptitude_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Progress exported successfully!', 'success');
    });

    el.importJsonInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          window.lectureTracker.importState(parsed);
          showToast('Progress imported successfully!', 'success');
        } catch (err) {
          showToast('Invalid JSON file format', 'warning');
        }
      };
      reader.readAsText(file);
    });

    // Reset Progress
    el.resetDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your lecture progress?')) {
        window.lectureTracker.resetAllProgress();
        showToast('All progress reset', 'info');
      }
    });

    // Celebration Modal Close / Next Day
    el.celebrationCloseBtn.addEventListener('click', () => {
      el.celebrationModal.classList.remove('open');
    });

    el.celebrationNextDayBtn.addEventListener('click', () => {
      el.celebrationModal.classList.remove('open');
      const nextDay = window.lectureTracker.state.currentActiveDay;
      window.lectureTracker.setCurrentActiveDay(nextDay);
      populateDaySelector();
      renderActiveDayTarget();
      renderPlaylist();
    });
  }

  // Setup Auth Listeners
  function setupAuthListeners() {
    window.googleAuth.subscribe((event, data) => {
      if (event === 'login_success') {
        el.googleLoginBtn.style.display = 'none';
        el.userProfileWidget.style.display = 'flex';
        if (data.user) {
          el.userAvatar.src = data.user.picture || 'https://www.gravatar.com/avatar/?d=mp';
          el.userName.textContent = data.user.name || 'Student';
        }
        showToast('Connected to Google Account!', 'success');
      } else if (event === 'logout') {
        el.googleLoginBtn.style.display = 'inline-flex';
        el.userProfileWidget.style.display = 'none';
      } else if (event === 'need_client_id') {
        openSettingsModal();
        showToast('Please enter your Google OAuth Client ID', 'info');
      }
    });

    // Initial Auth State check
    if (window.googleAuth.isAuthenticated() && window.googleAuth.userProfile) {
      el.googleLoginBtn.style.display = 'none';
      el.userProfileWidget.style.display = 'flex';
      el.userAvatar.src = window.googleAuth.userProfile.picture || 'https://www.gravatar.com/avatar/?d=mp';
      el.userName.textContent = window.googleAuth.userProfile.name || 'Student';
    }
  }

  // Setup Sync Engine Listeners
  function setupSyncListeners() {
    window.syncEngine.subscribe((event, data) => {
      if (event === 'countdown_tick') {
        el.syncTimerBadge.textContent = data.remainingFormatted;
      } else if (event === 'status_change') {
        el.syncPill.className = `sync-pill ${data.status}`;
        if (data.status === 'syncing') {
          el.syncStatusText.textContent = 'Syncing...';
          el.syncNowBtn.innerHTML = `<span class="sync-spinner">🔄</span>`;
        } else if (data.status === 'success') {
          el.syncStatusText.textContent = `Synced at ${data.formattedTime}`;
          el.syncNowBtn.innerHTML = `🔄`;
          showToast('Google Sheets & Drive synced!', 'success');
        } else if (data.status === 'error') {
          el.syncStatusText.textContent = 'Sync Error';
          el.syncNowBtn.innerHTML = `⚠️`;
        } else if (data.status === 'offline') {
          el.syncStatusText.textContent = 'Local (Offline)';
          el.syncNowBtn.innerHTML = `☁️`;
        }
      }
    });
  }

  // Setup Tracker Listeners
  function setupTrackerListeners() {
    window.lectureTracker.subscribe((event, data) => {
      if (event === 'day_completed') {
        renderStats();
        populateDaySelector();
        renderActiveDayTarget();
        renderPlaylist();

        if (data.celebrate) {
          triggerCelebration(data.day);
        }
      } else if (event === 'video_progress') {
        updateCurrentVideoBar();
      } else {
        renderActiveDayTarget();
        renderPlaylist();
        renderStats();
        populateDaySelector();
      }
    });
  }

  // Setup YouTube Controller Listeners
  function setupPlayerListeners() {
    window.youtubeController.subscribe((event, data) => {
      if (event === 'video_changed') {
        renderActiveDayTarget();
        renderPlaylist();
      } else if (event === 'progress') {
        updateCurrentVideoBar();
      }
    });
  }

  // Settings Modal Functions
  function openSettingsModal() {
    const isServerConfigured = Boolean(window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable);
    if (el.envStatusBanner) {
      el.envStatusBanner.style.display = isServerConfigured ? 'block' : 'none';
    }

    el.inputWebAppUrl.value = window.googleSheets.webAppUrl ? '••••••••••••••••' : '';
    el.inputClientId.value = window.googleAuth.config.clientId ? '••••••••••••••••' : '';
    el.inputSheetId.value = (window.envConfig && window.envConfig.config.spreadsheetId) || window.googleAuth.config.spreadsheetId || window.googleSheets.getSpreadsheetId();
    el.settingsModal.classList.add('open');
  }

  function closeSettingsModal() {
    el.settingsModal.classList.remove('open');
  }

  function saveSettings() {
    const webAppUrl = el.inputWebAppUrl.value.trim();
    const clientId = el.inputClientId.value.trim();
    const sheetId = el.inputSheetId.value.trim();

    if (webAppUrl && !webAppUrl.includes('•')) {
      window.googleSheets.setWebAppUrl(webAppUrl);
    }
    if (clientId && !clientId.includes('•')) {
      window.googleAuth.saveConfig(clientId, '', sheetId);
    } else if (sheetId) {
      window.googleAuth.saveConfig(window.googleAuth.config.clientId, '', sheetId);
    }

    closeSettingsModal();

    if (webAppUrl || (window.envConfig && window.envConfig.config.serverSyncAvailable)) {
      el.syncPill.className = 'sync-pill';
      el.syncStatusText.textContent = 'Connected (Direct)';
      window.syncEngine.performSync(false);
      showToast('Connected to Google Sheet!', 'success');
    } else {
      showToast('Settings saved successfully!', 'success');
    }
  }

  // View Apps Script helper
  if (el.showScriptCodeBtn) {
    el.showScriptCodeBtn.addEventListener('click', () => {
      const scriptCode = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById("${el.inputSheetId.value || '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY'}");
    
    // 1. Daily_Progress
    var dailySheet = ss.getSheetByName("Daily_Progress") || ss.insertSheet("Daily_Progress");
    if (data.dailyRows && data.dailyRows.length > 0) {
      dailySheet.clear();
      dailySheet.getRange(1, 1, data.dailyRows.length, data.dailyRows[0].length).setValues(data.dailyRows);
      dailySheet.getRange(1, 1, 1, data.dailyRows[0].length).setFontWeight("bold").setBackground("#e0e7ff");
    }

    // 2. Video_Logs
    var videoSheet = ss.getSheetByName("Video_Logs") || ss.insertSheet("Video_Logs");
    if (data.videoRows && data.videoRows.length > 0) {
      videoSheet.clear();
      videoSheet.getRange(1, 1, data.videoRows.length, data.videoRows[0].length).setValues(data.videoRows);
      videoSheet.getRange(1, 1, 1, data.videoRows[0].length).setFontWeight("bold").setBackground("#e0e7ff");
    }

    // 3. System_State
    var stateSheet = ss.getSheetByName("System_State") || ss.insertSheet("System_State");
    if (data.stateRows && data.stateRows.length > 0) {
      stateSheet.clear();
      stateSheet.getRange(1, 1, data.stateRows.length, data.stateRows[0].length).setValues(data.stateRows);
      stateSheet.getRange(1, 1, 1, data.stateRows[0].length).setFontWeight("bold").setBackground("#fef3c7");
    }

    // 4. Save JSON Database to Google Drive
    var filename = "gate_aptitude_monitor_backup.json";
    var files = DriveApp.getFilesByName(filename);
    var fullJson = JSON.stringify(data.state || data, null, 2);
    if (files.hasNext()) {
      var file = files.next();
      file.setContent(fullJson);
    } else {
      DriveApp.createFile(filename, fullJson, MimeType.PLAIN_TEXT);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", driveSaved: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
      navigator.clipboard.writeText(scriptCode).then(() => {
        showToast('Apps Script code (with Drive save) copied to clipboard!', 'celebrate');
      }).catch(() => {
        prompt('Copy this code into Extensions > Apps Script in your Google Sheet:', scriptCode);
      });
    });
  }

  // Trigger Joyful Celebration & Confetti
  function triggerCelebration(dayNumber) {
    el.celebrationDayNum.textContent = `Day ${dayNumber}`;
    el.celebrationModal.classList.add('open');
    launchConfetti();
    showToast(`🎉 Congratulations! You completed Day ${dayNumber} (4 lectures)!`, 'celebrate');
  }

  // Confetti Particle Engine
  function launchConfetti() {
    const canvas = el.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#6366f1', '#10b981', '#ec4899', '#06b6d4', '#eab308'];
    const particles = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 3,
        dx: (Math.random() - 0.5) * 16,
        dy: (Math.random() - 0.7) * 18,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        dRotation: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.4; // gravity
        p.rotation += p.dRotation;
        p.alpha -= 0.008;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.5);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    animate();
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'celebrate') icon = '🎉';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Start app
  initApp();
});
