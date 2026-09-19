/**
 * Google Identity Services (GIS) OAuth 2.0 Integration
 * Authenticates user and requests permissions for Google Sheets & Google Drive
 */

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

class GoogleAuthManager {
  constructor() {
    this.DEFAULT_SPREADSHEET_ID = '1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY';
    this.config = this.loadConfig();
    this.tokenClient = null;
    this.accessToken = null;
    this.tokenExpiresAt = null;
    this.userProfile = null;
    this.isGapiLoaded = false;
    this.isGisLoaded = false;
    this.listeners = [];

    this.init();
  }

  loadConfig() {
    return {
      clientId: localStorage.getItem('gate_google_client_id') || '',
      apiKey: localStorage.getItem('gate_google_api_key') || '',
      spreadsheetId: localStorage.getItem('gate_google_sheet_id') || this.DEFAULT_SPREADSHEET_ID
    };
  }

  saveConfig(clientId, apiKey, spreadsheetId) {
    this.config.clientId = (clientId || '').trim();
    this.config.apiKey = (apiKey || '').trim();
    this.config.spreadsheetId = (spreadsheetId || this.DEFAULT_SPREADSHEET_ID).trim();

    localStorage.setItem('gate_google_client_id', this.config.clientId);
    localStorage.setItem('gate_google_api_key', this.config.apiKey);
    localStorage.setItem('gate_google_sheet_id', this.config.spreadsheetId);

    if (this.config.clientId) {
      this.initTokenClient();
    }
    this.notify('config_changed', this.config);
  }

  init() {
    this.loadCachedAuth();
    this.loadGoogleLibraries();
  }

  loadCachedAuth() {
    try {
      const cachedToken = localStorage.getItem('gate_google_access_token');
      const cachedExpires = localStorage.getItem('gate_google_token_expires');
      const cachedProfile = localStorage.getItem('gate_google_user_profile');

      if (cachedToken && cachedExpires && Date.now() < parseInt(cachedExpires, 10)) {
        this.accessToken = cachedToken;
        this.tokenExpiresAt = parseInt(cachedExpires, 10);
        if (cachedProfile) {
          this.userProfile = JSON.parse(cachedProfile);
        }
      }
    } catch (e) {
      console.warn('Error loading cached auth:', e);
    }
  }

  loadGoogleLibraries() {
    // Load GAPI (Google API Client)
    if (!document.getElementById('gapi-script')) {
      const gapiScript = document.createElement('script');
      gapiScript.id = 'gapi-script';
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.onload = () => this.onGapiLoad();
      document.body.appendChild(gapiScript);
    }

    // Load GIS (Google Identity Services)
    if (!document.getElementById('gis-script')) {
      const gisScript = document.createElement('script');
      gisScript.id = 'gis-script';
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => this.onGisLoad();
      document.body.appendChild(gisScript);
    }
  }

  onGapiLoad() {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: this.config.apiKey || undefined,
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
          ]
        });
        this.isGapiLoaded = true;
        if (this.accessToken) {
          gapi.client.setToken({ access_token: this.accessToken });
        }
        console.log('GAPI client initialized');
      } catch (err) {
        console.warn('GAPI client init warning:', err);
      }
    });
  }

  onGisLoad() {
    this.isGisLoaded = true;
    if (this.config.clientId) {
      this.initTokenClient();
    }
  }

  initTokenClient() {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return;
    }

    if (!this.config.clientId) {
      return;
    }

    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: GOOGLE_SCOPES,
        callback: async (resp) => {
          if (resp.error !== undefined) {
            console.error('OAuth error:', resp);
            this.notify('auth_error', resp);
            return;
          }
          await this.handleTokenResponse(resp);
        }
      });
    } catch (e) {
      console.error('Error initializing TokenClient:', e);
    }
  }

  async handleTokenResponse(resp) {
    this.accessToken = resp.access_token;
    const expiresIn = (resp.expires_in ? parseInt(resp.expires_in, 10) : 3600) * 1000;
    this.tokenExpiresAt = Date.now() + expiresIn - 60000; // 1 min buffer

    localStorage.setItem('gate_google_access_token', this.accessToken);
    localStorage.setItem('gate_google_token_expires', this.tokenExpiresAt.toString());

    if (window.gapi && window.gapi.client) {
      window.gapi.client.setToken({ access_token: this.accessToken });
    }

    // Fetch user profile info
    await this.fetchUserProfile();
    this.notify('login_success', { user: this.userProfile, token: this.accessToken });
  }

  async fetchUserProfile() {
    if (!this.accessToken) return;
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (response.ok) {
        this.userProfile = await response.json();
        localStorage.setItem('gate_google_user_profile', JSON.stringify(this.userProfile));
      }
    } catch (e) {
      console.warn('Could not fetch user profile:', e);
    }
  }

  // Request OAuth login
  requestLogin(prompt = '') {
    if (!this.config.clientId) {
      this.notify('need_client_id', {});
      return;
    }

    if (!this.tokenClient) {
      this.initTokenClient();
    }

    if (this.tokenClient) {
      // Prompt user for Google OAuth permission
      this.tokenClient.requestAccessToken({ prompt: prompt });
    } else {
      console.error('Google Identity Client not ready.');
      this.notify('auth_error', { message: 'Google Client not loaded yet. Please try again.' });
    }
  }

  // Check if current token is valid
  isAuthenticated() {
    return Boolean(this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt);
  }

  // Sign out
  signOut() {
    if (this.accessToken && window.google && window.google.accounts && window.google.accounts.oauth2) {
      google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('Token revoked');
      });
    }

    this.accessToken = null;
    this.tokenExpiresAt = null;
    this.userProfile = null;

    localStorage.removeItem('gate_google_access_token');
    localStorage.removeItem('gate_google_token_expires');
    localStorage.removeItem('gate_google_user_profile');

    if (window.gapi && window.gapi.client) {
      window.gapi.client.setToken(null);
    }

    this.notify('logout', {});
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
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  }
}

window.googleAuth = new GoogleAuthManager();
