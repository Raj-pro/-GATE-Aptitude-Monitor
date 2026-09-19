# 🎓 GATE Aptitude Master — Lecture Monitor System

A cheerful, modern, and motivating web-based lecture monitor designed specifically for **Amit Khurana's GATE CS/IT Aptitude Playlist** (`PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS`).

---

## 🌟 Key Architecture & Features

```
                         ┌──────────────────────┐
                         │       GitHub         │
                         │                      │
                         │  Source Code         │
                         └──────────┬───────────┘
                                    │ Deploy
                                    ▼
                         ┌──────────────────────┐
                         │   Vercel / Netlify   │
                         │                      │
                         │  HTML / CSS / JS     │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │      Web Browser     │
                         │                      │
                         │   Your Website       │
                         └──────────┬───────────┘
                                    │ Google OAuth 2.0
                                    ▼
                         ┌──────────────────────┐
                         │    Google Account    │
                         │                      │
                         │ Authentication       │
                         └──────────┬───────────┘
                                    │ Authorized API (Silent every 5 min)
                                    ▼
                    ┌─────────────────────────────────┐
                    │          Google APIs             │
                    │                                 │
                    │  Sheets API  &  Drive API       │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
              ┌──────────────────────────────────────────┐
              │             Google Drive                 │
              │                                          │
              │  ┌────────────────────────────────────┐  │
              │  │ gate_aptitude_monitor_backup.json  │  │
              │  └────────────────────────────────────┘  │
              │                                          │
              │  ┌────────────────────────────────────┐  │
              │  │        Google Spreadsheet          │  │
              │  │  ID: 1SrajvQUpS_fp5DkTEmHIgHbHI... │  │
              │  │ ├─ Daily_Progress (Day Batches)    │  │
              │  │ ├─ Video_Logs (All 56 Lectures)    │  │
              │  │ └─ System_State (Overall Progress) │  │
              │  └────────────────────────────────────┘  │
              └──────────────────────────────────────────┘
```

### 1. 🎯 4-Lecture Milestone Goals
- Lectures are grouped into **4-lecture milestone batches** (Day 1: Lec 1–4, Day 2: Lec 5–8, etc.).
- **Flexible Timing**: Milestones are not tied to strict calendar days. Whenever you complete 4 lectures, the system records it as completed, triggers celebration confetti, and unlocks the next Day's goal. You can proceed tomorrow, after 2 days, or whenever you choose.
- **Toggle Seen / Unseen**: Click the checkbox on any lecture or the "Mark as Seen" button at any time.

### 2. 📺 Real-Time YouTube Tracking
- Embedded player for the Amit Khurana playlist with playback speed control (1x, 1.25x, 1.5x, 1.75x, 2x).
- Tracks exact watch seconds and percentage.
- Automatically marks lectures as **Seen** when reaching ≥90% or when the video ends.

### 3. ☁️ 5-Minute Silent Background Sync
- Connects securely using Google Identity Services (OAuth 2.0).
- Runs silently in the background every 5 minutes (`300,000ms`) without any popups.
- Automatically updates:
  1. **Google Spreadsheet** (`1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY`)
     - `Daily_Progress`: Tracks each Day batch's status, completion date, and watch duration.
     - `Video_Logs`: Logs status (`SEEN`, `WATCHING`, `UNSEEN`), percentage watched, watch seconds, and timestamp.
     - `System_State`: High-level summary of active day, completed lectures, and streaks.
  2. **Google Drive Database**:
     - `gate_aptitude_monitor_backup.json`: Complete JSON state backup saved directly to your Drive.

---

## 🚀 Setting Up Google OAuth (One-time Step)

To allow the application to sync to your Google Sheets and Google Drive:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (e.g., `GATE-Aptitude-Monitor`).
3. Enable the following APIs in **APIs & Services > Library**:
   - **Google Sheets API**
   - **Google Drive API**
4. In **APIs & Services > Credentials**:
   - Click **Create Credentials > OAuth client ID**.
   - Application Type: **Web application**.
   - **Authorized JavaScript origins**:
     - `http://localhost:5500` (for local development)
     - `http://127.0.0.1:5500`
     - `https://your-app.vercel.app` (or your Netlify / GitHub Pages domain)
5. Copy your **Client ID** (e.g. `xxxxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com`).
6. In the app:
   - Click the **⚙️ Settings** icon in the header.
   - Paste your **Client ID** and ensure the Spreadsheet ID is set to `1SrajvQUpS_fp5DkTEmHIgHbHI7lw9VBm1SP4QKfk5MY`.
   - Click **Save Settings**.
   - Click **🔐 Google Sign In** to authenticate once!

---

## 🌐 Deploying to Vercel / Netlify / GitHub Pages

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
Drag and drop this project directory into [Netlify Drop](https://app.netlify.com/drop).

### Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages > Branch: main / Root > Save**.
3. Add your GitHub Pages URL to Google Cloud Console Authorized JavaScript origins.
