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
          this.triggerInitialCloudSync();
        }
      });
    }

    // Also auto-sync on Day completed or major milestones
    if (window.lectureTracker) {
      window.lectureTracker.subscribe((event) => {
        if (event === 'day_completed') {
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

  // Initial cloud restore or push upon login
  async triggerInitialCloudSync() {
    if (!window.googleAuth || !window.googleAuth.isAuthenticated()) return;

    this.setSyncStatus('syncing');
    try {
      // 1. Try to load from Google Drive / Sheets first
      const driveData = await window.googleDrive.loadStateFromDrive();
      if (driveData) {
        window.lectureTracker.importState(driveData);
      } else {
        const sheetData = await window.googleSheets.loadFromGoogleSheet();
        if (sheetData) {
          window.lectureTracker.importState(sheetData);
        }
      }

      // 2. Perform write sync to ensure cloud is up to date
      await this.performSync(false);
    } catch (e) {
      console.warn('Initial cloud sync warning:', e);
      this.performSync(false);
    }
  }

  // Perform the background sync to Google Sheets & Drive
  async performSync(silent = false) {
    if (this.isSyncing) return;

    const hasServerSync = Boolean(window.envConfig && window.envConfig.config && window.envConfig.config.serverSyncAvailable);
    const hasWebAppUrl = Boolean(window.googleSheets && window.googleSheets.webAppUrl);
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

      // 1. Sync to Google Sheets (Via Apps Script Webhook OR OAuth)
      const sheetResult = await window.googleSheets.syncToGoogleSheet(currentState);

      // 2. Sync to Google Drive backup (if OAuth available)
      if (hasOAuth) {
        await window.googleDrive.saveToDrive(currentState);
      }

      this.lastSyncTime = new Date();
      window.lectureTracker.setLastSynced(this.lastSyncTime.toISOString());
      this.resetCountdown();

      this.setSyncStatus('success', {
        timestamp: this.lastSyncTime,
        formattedTime: this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      console.log('5-Min Background Sync Completed Successfully!');
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
