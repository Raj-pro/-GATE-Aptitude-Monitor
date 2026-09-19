/**
 * YouTube IFrame Player Controller & Progress Tracker
 * Integrates with YouTube IFrame API to play Amit Khurana's Aptitude playlist
 * and track playback position, duration, and completion in real time.
 */

class YouTubePlayerController {
  constructor() {
    this.player = null;
    this.isReady = false;
    this.currentVideo = null;
    this.progressInterval = null;
    this.playbackRate = 1.0;
    this.autoplayNext = true;
    this.playlistId = DEFAULT_PLAYLIST_ID;
    this.onStateChangeCallbacks = [];
  }

  init(containerId = 'youtube-player-container') {
    this.containerId = containerId;
    this.loadYouTubeApi();
  }

  loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
      this.createPlayer();
      return;
    }

    // Set global hook for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      this.createPlayer();
    };

    // Inject YouTube IFrame API script if not already present
    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  createPlayer() {
    const defaultVideo = PLAYLIST_DATA[0];
    const initialVideoId = window.lectureTracker ? window.lectureTracker.state.currentVideoId : defaultVideo.id;
    const initialLecture = PLAYLIST_DATA.find(l => l.id === initialVideoId) || defaultVideo;

    this.currentVideo = initialLecture;
    const initialIndex = initialLecture.playlistIndex || 0;

    try {
      this.player = new YT.Player(this.containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: this.playlistId,
          index: initialIndex,
          playsinline: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => this.onPlayerReady(event),
          onStateChange: (event) => this.onPlayerStateChange(event),
          onError: (event) => this.onPlayerError(event)
        }
      });
    } catch (e) {
      console.warn('Failed to initialize YouTube player:', e);
      this.renderFallbackPlayer();
    }
  }

  onPlayerReady(event) {
    this.isReady = true;
    console.log('YouTube Playlist Player is ready');
    this.player.setPlaybackRate(this.playbackRate);

    this.notifyState('ready', { video: this.currentVideo });
  }

  onPlayerStateChange(event) {
    // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    if (event.data === YT.PlayerState.PLAYING) {
      this.startProgressTracking();
      this.notifyState('playing', { video: this.currentVideo });
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.stopProgressTracking();
      this.recordCurrentProgress();
      this.notifyState('paused', { video: this.currentVideo });
    } else if (event.data === YT.PlayerState.ENDED) {
      this.stopProgressTracking();
      this.onVideoEnded();
      this.notifyState('ended', { video: this.currentVideo });
    } else if (event.data === YT.PlayerState.BUFFERING) {
      this.notifyState('buffering', { video: this.currentVideo });
    }
  }

  onPlayerError(event) {
    console.warn('YouTube Player Error:', event.data);
    this.notifyState('error', { error: event.data, video: this.currentVideo });
  }

  startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => {
      this.recordCurrentProgress();
    }, 1000);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  recordCurrentProgress() {
    if (!this.player || !this.isReady || !this.currentVideo) return;
    try {
      const currentTime = this.player.getCurrentTime();
      const duration = this.player.getDuration() || this.currentVideo.duration;
      
      if (currentTime > 0 && duration > 0 && window.lectureTracker) {
        window.lectureTracker.updateVideoProgress(this.currentVideo.id, currentTime, duration);
        this.notifyState('progress', {
          videoId: this.currentVideo.id,
          currentTime,
          duration,
          percent: Math.round((currentTime / duration) * 100)
        });
      }
    } catch (e) {
      // Ignored
    }
  }

  onVideoEnded() {
    if (!this.currentVideo || !window.lectureTracker) return;

    // Mark current video as seen
    window.lectureTracker.setVideoSeen(this.currentVideo.id, true, true);

    // Auto advance to next lecture
    if (this.autoplayNext) {
      const currentIndex = PLAYLIST_DATA.findIndex(l => l.id === this.currentVideo.id);
      if (currentIndex >= 0 && currentIndex < PLAYLIST_DATA.length - 1) {
        const nextLecture = PLAYLIST_DATA[currentIndex + 1];
        setTimeout(() => {
          this.loadVideo(nextLecture, true);
        }, 1500);
      }
    }
  }

  loadVideo(lecture, autoPlay = true) {
    if (!lecture) return;
    this.currentVideo = lecture;

    if (window.lectureTracker) {
      window.lectureTracker.setCurrentVideo(lecture.id);
    }

    const playlistIdx = lecture.playlistIndex !== undefined ? lecture.playlistIndex : 0;

    if (this.isReady && this.player) {
      try {
        if (this.player.playVideoAt) {
          this.player.playVideoAt(playlistIdx);
        } else if (this.player.loadPlaylist) {
          this.player.loadPlaylist({
            list: this.playlistId,
            index: playlistIdx
          });
        }
        this.player.setPlaybackRate(this.playbackRate);
      } catch (err) {
        console.warn('Error loading video by playlist index:', err);
        this.renderFallbackPlayer();
      }
    } else {
      this.renderFallbackPlayer();
    }

    this.notifyState('video_changed', { video: lecture });
  }

  getYouTubeDirectUrl(lecture = this.currentVideo) {
    const lec = lecture || PLAYLIST_DATA[0];
    const pIndex = (lec && lec.playlistIndex !== undefined) ? lec.playlistIndex + 1 : 1;
    return `https://www.youtube.com/watch?list=${this.playlistId}&index=${pIndex}`;
  }

  seek(secondsOffset) {
    if (!this.player || !this.isReady) return;
    try {
      const current = this.player.getCurrentTime();
      this.player.seekTo(Math.max(0, current + secondsOffset), true);
    } catch (e) {
      console.warn('Seek error:', e);
    }
  }

  setRate(rate) {
    this.playbackRate = rate;
    if (this.player && this.isReady && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(rate);
    }
  }

  play() {
    if (this.player && this.isReady && this.player.playVideo) {
      this.player.playVideo();
    }
  }

  pause() {
    if (this.player && this.isReady && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.onStateChangeCallbacks.push(callback);
    }
  }

  notifyState(event, data) {
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(event, data);
      } catch (err) {
        console.error('Player subscriber error:', err);
      }
    });
  }

  renderFallbackPlayer() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    const vid = this.currentVideo || PLAYLIST_DATA[0];
    const pIndex = (vid && vid.playlistIndex !== undefined) ? vid.playlistIndex : 0;
    container.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube-nocookie.com/embed/videoseries?list=${this.playlistId}&index=${pIndex}&enablejsapi=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }
}

window.youtubeController = new YouTubePlayerController();
