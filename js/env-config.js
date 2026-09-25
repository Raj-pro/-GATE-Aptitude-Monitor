/**
 * Environment Variables & Runtime Config Loader
 * Automatically fetches /api/config on Vercel or reads local environment defaults.
 */

// Local fallback defaults (used when no Vercel backend /api/config is available)
const LOCAL_DEFAULTS = {
  spreadsheetId: '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY',
  webAppUrl: 'https://script.google.com/macros/s/AKfycbxyuhNUFeHBQrbT-YetoOKHPA70WoPmCEDKFVmpYAvvGsrd2YmjqtC-6NWEG8CagHd7_g/exec',
  clientId: '324005170891-06to9aidcaiggnu98s0069r4r0cj3267.apps.googleusercontent.com',
  playlistId: 'PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS'
};

class EnvironmentConfig {
  constructor() {
    this.config = {
      spreadsheetId: LOCAL_DEFAULTS.spreadsheetId,
      webAppUrl: LOCAL_DEFAULTS.webAppUrl,
      clientId: LOCAL_DEFAULTS.clientId,
      playlistId: LOCAL_DEFAULTS.playlistId
    };
    this.isLoaded = false;
  }

  async loadConfig() {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === 'object') {
          if (data.spreadsheetId) this.config.spreadsheetId = data.spreadsheetId;
          if (data.webAppUrl) this.config.webAppUrl = data.webAppUrl;
          if (data.serverSyncAvailable !== undefined) this.config.serverSyncAvailable = data.serverSyncAvailable;
          if (data.clientId) this.config.clientId = data.clientId;
          if (data.playlistId) this.config.playlistId = data.playlistId;

          // Apply to global modules if available
          if (window.googleAuth && data.clientId) {
            window.googleAuth.config.clientId = data.clientId;
            window.googleAuth.initTokenClient();
          }
          if (window.googleSheets) {
            if (data.webAppUrl) window.googleSheets.setWebAppUrl(data.webAppUrl);
            if (data.spreadsheetId) window.googleSheets.DEFAULT_SPREADSHEET_ID = data.spreadsheetId;
          }
          if (window.youtubeController && data.playlistId) {
            window.youtubeController.playlistId = data.playlistId;
          }

          console.log('Loaded runtime environment config from /api/config');
        }
      }
    } catch (err) {
      // Local fallback: running as a static standalone site
      console.log('Static / local mode active. Using local settings.');
    }
    this.isLoaded = true;
    return this.config;
  }
}

window.envConfig = new EnvironmentConfig();
