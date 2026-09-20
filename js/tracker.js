/**
 * State & Progress Tracker for GATE Aptitude Monitor
 * Handles 4-lecture milestone batches, seen/unseen toggles, streaks, and local persistence.
 */

class LectureTracker {
  constructor() {
    this.STORAGE_KEY = 'gate_aptitude_tracker_v1';
    this.state = this.loadInitialState();
    this.listeners = [];
  }

  // Initial state template
  loadInitialState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return this.normalizeState(parsed);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default state:', e);
    }

    return this.createDefaultState();
  }

  createDefaultState() {
    const videoStates = {};
    PLAYLIST_DATA.forEach(item => {
      videoStates[item.id] = {
        id: item.id,
        seen: false,
        percent: 0,
        currentTime: 0,
        duration: item.duration,
        lastWatchedAt: null
      };
    });

    const dayStates = {};
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      dayStates[d] = {
        day: d,
        completed: false,
        completedAt: null,
        videosWatched: 0
      };
    }

    return {
      version: 1,
      currentActiveDay: 1,
      currentVideoId: PLAYLIST_DATA[0]?.id || 'vid_1',
      videos: videoStates,
      days: dayStates,
      stats: {
        totalVideosSeen: 0,
        totalSecondsWatched: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedDaysCount: 0
      },
      lastSyncedAt: null,
      lastModifiedAt: new Date().toISOString()
    };
  }

  normalizeState(parsed) {
    const defaultState = this.createDefaultState();
    const mergedVideos = { ...defaultState.videos, ...(parsed.videos || {}) };
    const mergedDays = { ...defaultState.days, ...(parsed.days || {}) };

    // Recalculate stats for consistency
    let seenCount = 0;
    let totalSecs = 0;
    Object.values(mergedVideos).forEach(v => {
      if (v.seen) seenCount++;
      if (v.currentTime) totalSecs += v.currentTime;
    });

    let completedDays = 0;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const dayLecs = getLecturesForDay(d);
      const watched = dayLecs.filter(l => mergedVideos[l.id]?.seen).length;
      const isComplete = dayLecs.length > 0 && watched === dayLecs.length;
      
      mergedDays[d] = {
        day: d,
        completed: isComplete,
        completedAt: mergedDays[d]?.completedAt || (isComplete ? new Date().toISOString() : null),
        videosWatched: watched
      };
      if (isComplete) completedDays++;
    }

    // Determine active day
    let activeDay = parsed.currentActiveDay;
    if (!activeDay) {
      for (let d = 1; d <= TOTAL_DAYS; d++) {
        if (!mergedDays[d].completed) {
          activeDay = d;
          break;
        }
      }
    }
    if (!activeDay) activeDay = 1;

    // Determine current video ID (first unseen of active day or first unseen overall)
    let currentVideoId = parsed.currentVideoId;
    if (!currentVideoId || !mergedVideos[currentVideoId] || (mergedVideos[currentVideoId].seen && seenCount < PLAYLIST_DATA.length)) {
      const activeLecs = getLecturesForDay(activeDay);
      const firstUnseenInDay = activeLecs.find(l => !mergedVideos[l.id]?.seen);
      if (firstUnseenInDay) {
        currentVideoId = firstUnseenInDay.id;
      } else {
        const anyUnseen = PLAYLIST_DATA.find(l => !mergedVideos[l.id]?.seen);
        currentVideoId = anyUnseen ? anyUnseen.id : (PLAYLIST_DATA[0]?.id || 'vid_1');
      }
    }

    return {
      version: 1,
      currentActiveDay: activeDay,
      currentVideoId: currentVideoId,
      videos: mergedVideos,
      days: mergedDays,
      stats: {
        totalVideosSeen: seenCount,
        totalSecondsWatched: totalSecs,
        streakDays: parsed.stats?.streakDays || 1,
        lastActiveDate: parsed.stats?.lastActiveDate || new Date().toISOString().split('T')[0],
        completedDaysCount: completedDays
      },
      lastSyncedAt: parsed.lastSyncedAt || new Date().toISOString(),
      lastModifiedAt: parsed.lastModifiedAt || new Date().toISOString()
    };
  }

  // Subscribe to changes
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, payload) {
    this.saveToStorage();
    this.listeners.forEach(cb => {
      try {
        cb(event, payload, this.state);
      } catch (err) {
        console.error('Error in tracker listener:', err);
      }
    });
  }

  saveToStorage() {
    try {
      this.state.lastModifiedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  // Toggle or set video seen status
  setVideoSeen(videoId, isSeen, autoTriggerCelebration = true) {
    const vid = this.state.videos[videoId];
    if (!vid) return;

    const previousSeen = vid.seen;
    vid.seen = Boolean(isSeen);
    if (isSeen) {
      vid.percent = 100;
      vid.lastWatchedAt = new Date().toISOString();
    } else {
      vid.percent = 0;
    }

    this.recalculateDayAndStats(videoId, autoTriggerCelebration, previousSeen !== isSeen);
  }

  toggleVideoSeen(videoId) {
    const vid = this.state.videos[videoId];
    if (!vid) return;
    this.setVideoSeen(videoId, !vid.seen);
  }

  // Update real-time playback progress
  updateVideoProgress(videoId, currentTime, duration) {
    const vid = this.state.videos[videoId];
    if (!vid) return;

    const dur = duration || vid.duration || 1;
    const percent = Math.min(100, Math.round((currentTime / dur) * 100));
    
    vid.currentTime = Math.round(currentTime);
    vid.duration = Math.round(dur);
    vid.percent = percent;
    vid.lastWatchedAt = new Date().toISOString();

    // Auto mark seen if watched > 90%
    if (percent >= 90 && !vid.seen) {
      this.setVideoSeen(videoId, true, true);
      return;
    }

    this.state.lastModifiedAt = new Date().toISOString();
    this.notify('video_progress', { videoId, currentTime, percent });
  }

  // Select current video
  setCurrentVideo(videoId) {
    if (this.state.videos[videoId]) {
      this.state.currentVideoId = videoId;
      const targetLec = PLAYLIST_DATA.find(l => l.id === videoId);
      if (targetLec && targetLec.day !== this.state.currentActiveDay) {
        // optionally update active day
      }
      this.notify('current_video_changed', { videoId });
    }
  }

  setCurrentActiveDay(dayNumber) {
    if (dayNumber >= 1 && dayNumber <= TOTAL_DAYS) {
      this.state.currentActiveDay = dayNumber;
      this.notify('active_day_changed', { dayNumber });
    }
  }

  // Recalculate Day completion, milestones and study streaks
  recalculateDayAndStats(triggeringVideoId, canCelebrate = true, statusChanged = false) {
    const triggeringLecture = PLAYLIST_DATA.find(l => l.id === triggeringVideoId);
    const targetDay = triggeringLecture ? triggeringLecture.day : this.state.currentActiveDay;

    let totalSeen = 0;
    let totalSecs = 0;
    Object.values(this.state.videos).forEach(v => {
      if (v.seen) totalSeen++;
      if (v.currentTime) totalSecs += v.currentTime;
    });
    this.state.stats.totalVideosSeen = totalSeen;
    this.state.stats.totalSecondsWatched = totalSecs;

    // Check Day completion for targetDay
    const dayLecs = getLecturesForDay(targetDay);
    const dayWatchedCount = dayLecs.filter(l => this.state.videos[l.id]?.seen).length;
    const dayState = this.state.days[targetDay];
    const wasAlreadyCompleted = dayState.completed;
    const isNowCompleted = (dayLecs.length > 0 && dayWatchedCount === dayLecs.length);

    dayState.videosWatched = dayWatchedCount;
    dayState.completed = isNowCompleted;

    if (isNowCompleted && !wasAlreadyCompleted) {
      dayState.completedAt = new Date().toISOString();
      this.updateStreak();
      
      // Unlock next day automatically
      if (this.state.currentActiveDay === targetDay && targetDay < TOTAL_DAYS) {
        this.state.currentActiveDay = targetDay + 1;
      }

      this.notify('day_completed', {
        day: targetDay,
        celebrate: canCelebrate,
        nextDay: this.state.currentActiveDay
      });
    } else {
      if (!isNowCompleted) {
        dayState.completedAt = null;
      }
      this.notify('state_updated', { videoId: triggeringVideoId, statusChanged });
    }

    // Update completedDays count
    this.state.stats.completedDaysCount = Object.values(this.state.days).filter(d => d.completed).length;
  }

  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.state.stats.lastActiveDate;

    if (lastDate !== today) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.state.stats.streakDays += 1;
      } else if (diffDays > 1) {
        this.state.stats.streakDays = 1;
      }
      this.state.stats.lastActiveDate = today;
    }
  }

  // Get active day data
  getActiveDayData() {
    return this.getDayData(this.state.currentActiveDay);
  }

  getDayData(dayNumber) {
    const info = getDayInfo(dayNumber);
    const dayState = this.state.days[dayNumber] || { completed: false, videosWatched: 0 };
    const lecturesWithProgress = info.lectures.map(lec => ({
      ...lec,
      progress: this.state.videos[lec.id] || { seen: false, percent: 0, currentTime: 0 }
    }));

    return {
      ...info,
      ...dayState,
      lectures: lecturesWithProgress,
      progressPercent: Math.round((dayState.videosWatched / (info.lectureCount || 1)) * 100)
    };
  }

  // Overall statistics
  getOverallStats() {
    const totalVideos = PLAYLIST_DATA.length;
    const seenVideos = this.state.stats.totalVideosSeen;
    const overallPercent = totalVideos > 0 ? Math.round((seenVideos / totalVideos) * 100) : 0;
    const completedDays = this.state.stats.completedDaysCount;

    return {
      totalVideos,
      seenVideos,
      unseenVideos: Math.max(0, totalVideos - seenVideos),
      overallPercent,
      completedDays,
      totalDays: TOTAL_DAYS,
      currentActiveDay: this.state.currentActiveDay,
      streakDays: this.state.stats.streakDays,
      totalSecondsWatched: this.state.stats.totalSecondsWatched,
      totalTimeFormatted: formatDuration(this.state.stats.totalSecondsWatched)
    };
  }

  // Export full JSON representation
  exportJson() {
    return JSON.stringify(this.state, null, 2);
  }

  // Merge incoming cloud state with local state safely
  mergeState(cloudState) {
    if (!cloudState || typeof cloudState !== 'object') return false;

    // Check if local has no progress
    const localSeenCount = this.state.stats?.totalVideosSeen || 0;
    const cloudVideos = cloudState.videos || {};
    let cloudSeenCount = 0;
    Object.values(cloudVideos).forEach(v => {
      if (v.seen) cloudSeenCount++;
    });

    // If local has 0 progress or cloud has more progress, merge union of seen lectures
    const mergedVideos = { ...this.state.videos };
    Object.keys(cloudVideos).forEach(vidId => {
      const localVid = mergedVideos[vidId] || {};
      const cloudVid = cloudVideos[vidId] || {};

      const isSeen = Boolean(localVid.seen || cloudVid.seen);
      const maxTime = Math.max(localVid.currentTime || 0, cloudVid.currentTime || 0);
      const maxPercent = isSeen ? 100 : Math.max(localVid.percent || 0, cloudVid.percent || 0);
      
      let latestDate = localVid.lastWatchedAt || cloudVid.lastWatchedAt || null;
      if (localVid.lastWatchedAt && cloudVid.lastWatchedAt) {
        latestDate = new Date(localVid.lastWatchedAt) > new Date(cloudVid.lastWatchedAt) ? localVid.lastWatchedAt : cloudVid.lastWatchedAt;
      }

      mergedVideos[vidId] = {
        ...localVid,
        ...cloudVid,
        seen: isSeen,
        percent: maxPercent,
        currentTime: maxTime,
        lastWatchedAt: latestDate
      };
    });

    const candidateState = {
      ...this.state,
      ...cloudState,
      videos: mergedVideos,
      currentActiveDay: cloudState.currentActiveDay || this.state.currentActiveDay,
      stats: {
        ...this.state.stats,
        streakDays: Math.max(this.state.stats?.streakDays || 1, cloudState.stats?.streakDays || 1)
      }
    };

    this.state = this.normalizeState(candidateState);
    this.state.lastSyncedAt = new Date().toISOString();
    this.saveToStorage();
    this.notify('state_imported', { source: 'cloud_merge', seenVideos: this.state.stats.totalVideosSeen });
    return true;
  }

  // Import JSON from Google Drive / Sheets backup
  importState(newState) {
    if (!newState || typeof newState !== 'object') return false;
    this.state = this.normalizeState(newState);
    this.state.lastSyncedAt = new Date().toISOString();
    this.saveToStorage();
    this.notify('state_imported', { source: 'cloud', seenVideos: this.state.stats.totalVideosSeen });
    return true;
  }

  // Mark sync timestamp
  setLastSynced(timestamp = new Date().toISOString()) {
    this.state.lastSyncedAt = timestamp;
    this.saveToStorage();
    this.notify('sync_updated', { lastSyncedAt: timestamp });
  }

  resetAllProgress() {
    this.state = this.createDefaultState();
    this.saveToStorage();
    this.notify('progress_reset', {});
  }
}

// Global instance
window.lectureTracker = new LectureTracker();
