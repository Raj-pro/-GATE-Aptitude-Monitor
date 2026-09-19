/**
 * Google Drive API Integration for Lecture Monitor System
 * Stores and updates JSON state backup in user's Google Drive.
 */

class GoogleDriveManager {
  constructor() {
    this.BACKUP_FILENAME = 'gate_aptitude_monitor_backup.json';
    this.cachedFileId = localStorage.getItem('gate_drive_backup_file_id') || null;
  }

  // Find or create backup file in Google Drive
  async findBackupFile() {
    if (this.cachedFileId) return this.cachedFileId;

    try {
      const response = await gapi.client.drive.files.list({
        q: `name = '${this.BACKUP_FILENAME}' and trashed = false`,
        fields: 'files(id, name, modifiedTime)',
        spaces: 'drive'
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        this.cachedFileId = files[0].id;
        localStorage.setItem('gate_drive_backup_file_id', this.cachedFileId);
        return this.cachedFileId;
      }
      return null;
    } catch (e) {
      console.warn('Drive search error:', e);
      return null;
    }
  }

  // Upload or update JSON database in Drive
  async saveToDrive(state) {
    // Method 1: If serverless sync or webAppUrl is available, trigger Drive save via webhook
    if (window.googleSheets) {
      try {
        const res = await window.googleSheets.syncToGoogleSheet(state);
        if (res && res.success) {
          console.log('Saved to Google Drive via Apps Script Webhook / Serverless API');
          return { success: true, mode: 'webhook' };
        }
      } catch (e) {
        console.warn('Webhook drive save attempt failed:', e);
      }
    }

    // Method 2: Via Direct OAuth Token (if user signed into Google)
    if (window.googleAuth && window.googleAuth.isAuthenticated()) {
      try {
        const fileId = await this.findBackupFile();
        const content = JSON.stringify(state, null, 2);
        const boundary = '-------314159265358979323846';
        const delimiter = '\r\n--' + boundary + '\r\n';
        const closeDelim = '\r\n--' + boundary + '--';

        const metadata = {
          name: this.BACKUP_FILENAME,
          mimeType: 'application/json',
          description: 'GATE Aptitude Lecture Tracker automated database backup'
        };

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          content +
          closeDelim;

        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        let method = 'POST';

        if (fileId) {
          url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
          method = 'PATCH';
        }

        const accessToken = window.googleAuth.accessToken;
        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartRequestBody
        });

        if (response.ok) {
          const result = await response.json();
          this.cachedFileId = result.id;
          localStorage.setItem('gate_drive_backup_file_id', result.id);
          console.log('Saved backup to Google Drive via OAuth:', result.id);
          return { success: true, fileId: result.id };
        }
      } catch (err) {
        console.error('Google Drive save error:', err);
        return { success: false, error: err.message };
      }
    }

    return { success: false, error: 'Could not save to Drive' };
  }

  // Restore JSON from Google Drive
  async loadFromDrive() {
    if (!window.googleAuth || !window.googleAuth.isAuthenticated()) {
      return null;
    }

    try {
      const fileId = await this.findBackupFile();
      if (!fileId) return null;

      const accessToken = window.googleAuth.accessToken;
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Restored state from Google Drive:', data);
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Failed to load from Drive:', err);
      return null;
    }
  }
}

window.googleDrive = new GoogleDriveManager();
