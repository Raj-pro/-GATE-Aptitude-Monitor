/**
 * 5-Minute Silent Background Auto-Sync Engine
 * Keeps Google Sheets and Google Drive seamlessly synced every 5 minutes without prompt
 */

class BackgroundSyncEngine {
  constructor() {
    this.SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes (300,000 ms)
    this.timer = null;
    this.countdownTimer = null;
    this.secondsRemaining = 300;
    this.isSyncing = false;
    this.isRestoring = false;
    this.hasInitialRestoreCompleted = false;
    this.lastSyncTime = null;
    this.syncStatus = 'idle'; // 'idle', 'syncing', 'success', 'error', 'offline'
    this.listeners = [];

    this.init();
  }

  init() {
    this.startCountdown();
    this.startInterval();

    // Listen to Auth changes
    if (window.googleAuth) {
      window.googleAuth.subscribe((event) => {
        if (event === 'login_success') {
          this.restoreFromCloud(true);
        }
      });
    }

    // Also auto-sync on Day completed or major milestones
    if (window.lectureTracker) {
      window.lectureTracker.subscribe((event) => {
        if (event === 'day_completed' && this.hasInitialRestoreCompleted) {
          this.performSync(false); // Quick background sync on milestone
        }
      });
    }
  }

  startInterval() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.performSync(true);
    }, this.SYNC_INTERVAL_MS);
  }

  startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.secondsRemaining = 300;

    this.countdownTimer = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        this.secondsRemaining = 300;
      }
      this.notify('countdown_tick', {
        remainingFormatted: this.formatCountdown(this.secondsRemaining),
        remainingSeconds: this.secondsRemaining
      });
    }, 1000);
  }

  resetCountdown() {
    this.secondsRemaining = 300;
  }

  formatCountdown(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Restore progress from Google Sheets or Google Drive
  async restoreFromCloud(force = false) {
    if (this.isRestoring) return false;
    this.isRestoring = true;
    this.setSyncStatus('syncing');

    try {
      console.log('Attempting cloud restore from Google Sheets / Drive...');

      let cloudData = null;

      // 1. If Google OAuth is authenticated, check Google Drive backup first
      if (window.googleAuth && window.googleAuth.isAuthenticated() && window.googleDrive) {
        try {
          cloudData = await window.googleDrive.loadStateFromDrive();
        } catch (e) {
          console.warn('Drive restore attempt failed:', e);
        }
      }

      // 2. Load from Google Sheets (via Serverless Proxy, Webhook, or direct GViz JSONP)
      if (!cloudData && window.googleSheets) {
        cloudData = await window.googleSheets.loadFromGoogleSheet();
      }

      if (cloudData) {
        // Safely merge cloud progress with local progress
        window.lectureTracker.mergeState(cloudData);
        this.lastSyncTime = new Date();
        const seenCount = window.lectureTracker.state.stats.totalVideosSeen;

        this.setSyncStatus('success', {
          timestamp: this.lastSyncTime,
          formattedTime: this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          restored: true,
          seenVideos: seenCount
        });

        console.log(`Cloud restore completed successfully! Restored ${seenCount} lectures.`);
        return { success: true, seenVideos: seenCount };
      } else {
        console.log('No cloud progress found or sheet was empty.');
        this.setSyncStatus('idle');
        return { success: false, reason: 'empty_or_unavailable' };
      }
    } catch (err) {
      console.error('Cloud restore failed:', err);
      this.setSyncStatus('error', { error: err.message });
      return { success: false, error: err.message };
    } finally {
      this.isRestoring = false;
      this.hasInitialRestoreCompleted = true;
    }
  }

  // Initial cloud restore or push upon login
  async triggerInitialCloudSync() {
    return this.restoreFromCloud(true);
  }

  // Perform the background sync to Google Sheets & Drive
  async performSync(silent = false) {
    if (this.isSyncing || this.isRestoring) return;

    // Safety guard: Never auto-sync empty state until initial restore has run
    if (!this.hasInitialRestoreCompleted) {
      if (silent) {
        console.log('Skipping silent auto-sync until initial restore completes');
        return;
      }
      // If manual sync was clicked, run restore first
      await this.restoreFromCloud();
    }

    const hasServerSync = Boolean(window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable);
    const hasWebAppUrl = Boolean(window.googleSheets && (window.googleSheets.webAppUrl || (window.envConfig && window.envConfig.config && window.envConfig.config.webAppUrl)));
    const hasOAuth = Boolean(window.googleAuth && window.googleAuth.isAuthenticated());

    if (!hasServerSync && !hasWebAppUrl && !hasOAuth) {
      this.setSyncStatus('offline');
      this.notify('sync_skipped', { reason: 'not_authenticated' });
      return;
    }

    this.isSyncing = true;
    this.setSyncStatus('syncing');

    try {
      const currentState = window.lectureTracker.state;

      // 1. Sync to Google Sheets (Via Serverless Backend Proxy, Apps Script Webhook, OR OAuth)
      const sheetResult = await window.googleSheets.syncToGoogleSheet(currentState);

      // 2. Sync to Google Drive backup (if OAuth available)
      if (hasOAuth && window.googleDrive) {
        await window.googleDrive.saveToDrive(currentState);
      }

      this.lastSyncTime = new Date();
      window.lectureTracker.setLastSynced(this.lastSyncTime.toISOString());
      this.resetCountdown();

      this.setSyncStatus('success', {
        timestamp: this.lastSyncTime,
        formattedTime: this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      console.log('Sync to Google Sheets & Drive Completed Successfully!');
    } catch (err) {
      console.error('Background sync failed:', err);
      this.setSyncStatus('error', { error: err.message });
    } finally {
      this.isSyncing = false;
    }
  }

  setSyncStatus(status, data = {}) {
    this.syncStatus = status;
    this.notify('status_change', { status, ...data });
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notify(event, data) {
    this.listeners.forEach(cb => {
      try {
        cb(event, data);
      } catch (e) {
        console.error('Sync engine listener error:', e);
      }
    });
  }
}

window.syncEngine = new BackgroundSyncEngine();
