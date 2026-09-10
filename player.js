(function (global) {
  'use strict';

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    maximize: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    minimize: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
    pip: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2zm-2 0H3V5h18v14z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.61 3.61 0 0 1 8.4 12c0-1.98 1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
    speed: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 12h-2a5 5 0 0 1-5-5V5a7 7 0 0 0 7 7zm0-7V3a9.99 9.99 0 0 0-7 16.53V17a8 8 0 0 1 7-8z"/></svg>',
    rewind: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
    forward: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
    subtitle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4V6zm6 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>',
    spinner: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    cc: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm-1 8a7 7 0 0 0 7 7 7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5zm0-2h2a5 5 0 0 1 10 0h2a7 7 0 0 0-14 0h0z"/></svg>',
    screenshot: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
  };

  const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  class HdoPlayer {
    constructor(containerEl, options = {}) {
      this.container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
      if (!this.container) return;

      this.options = Object.assign({
        autoplay: false,
        poster: '',
        proxyPrefix: '/proxy-stream',
        history: null,
        startTime: 0,
        streams: [],
        onNext: null,
        onPrev: null
      }, options);

      this.hls = null;
      this.startSettings = { volume: 1, muted: false, speed: 1 };
      this._recovering = false;
      this._quality = -1;
      this._levels = [];
      this._subtitles = [];
      this._subIndex = -1;
      this._isBuffering = false;
      this._destroyed = false;
      this._clickTimer = null;
      this._autoHideDelay = 4000;
      this._loop = false;
      this._prevSpeed = 1;
      this._longPressTimer = null;
      this._longPressActive = false;
      this._spaceHeld = false;

      this._build();
      this._bindEvents();
      this._loadSettings();
      this._initMiniPlayer();
      this._initNetworkMonitor();
      if (this.options.streams.length) {
        this.streams = this.options.streams;
        this.selectStream(0);
      } else {
        this.streams = [];
      }
    }

    // ============ BUILD UI ============
    _build() {
      const opts = this.options;
      this.container.classList.add('hdo-player');
      this.container.innerHTML = `
        <video class="hdo-video" playsinline webkit-playsinline preload="auto" ${opts.poster ? `poster="${opts.poster}"` : ''}></video>

        <div class="hdo-poster" ${opts.poster ? `style="background-image:url('${opts.poster}')"` : ''}></div>

        <div class="hdo-buffering"><span class="hdo-spinner">${ICONS.spinner}</span></div>

        <div class="hdo-error">
          <div class="hdo-error-msg">Không thể phát video</div>
          <button type="button" class="hdo-error-retry">Thử lại</button>
        </div>

        <div class="hdo-big-play">${ICONS.play}</div>

        

        <div class="hdo-seek-indicator hdo-seek-left">
          <span class="hdo-seek-ico">${ICONS.rewind}</span>
          <span class="hdo-seek-text">10</span>
        </div>
        <div class="hdo-seek-indicator hdo-seek-right">
          <span class="hdo-seek-text">10</span>
          <span class="hdo-seek-ico">${ICONS.forward}</span>
        </div>

        <div class="hdo-center-indicator">
          <span class="hdo-center-icon hdo-center-play">${ICONS.play}</span>
          <span class="hdo-center-icon hdo-center-pause">${ICONS.pause}</span>
        </div>

        <div class="hdo-longpress-overlay"><span>2x</span></div>

        <div class="hdo-controls">
          <div class="hdo-progress">
            <div class="hdo-progress-buffer"></div>
            <div class="hdo-progress-played"></div>
            <div class="hdo-progress-hover">
              <span class="hdo-tooltip">0:00</span>
            </div>
            <input type="range" class="hdo-seek" min="0" max="1000" step="0.1" value="0" aria-label="Seek">
          </div>

          <div class="hdo-controls-bar">
            <div class="hdo-bar-left">
              <button type="button" class="hdo-btn hdo-play" aria-label="Phát">${ICONS.play}</button>
              <div class="hdo-vol-wrap">
                <button type="button" class="hdo-btn hdo-mute" aria-label="Âm lượng">${ICONS.volume}</button>
                <div class="hdo-vol-slider">
                  <div class="hdo-vol-fill"></div>
                  <input type="range" class="hdo-vol-input" min="0" max="100" step="1" value="100">
                </div>
              </div>
              <span class="hdo-net-speed" style="display:none;"></span>
              <span class="hdo-time"><span class="hdo-current">0:00</span><span class="hdo-sep"> / </span><span class="hdo-duration">0:00</span></span>
            </div>

            <div class="hdo-bar-right">
              ${document.pictureInPictureEnabled ? `<button type="button" class="hdo-btn hdo-pip-btn" aria-label="Mini player">${ICONS.pip}</button>` : ''}
              ${this._fullscreenEnabled() ? `<button type="button" class="hdo-btn hdo-fullscreen" aria-label="Toàn màn hình">${ICONS.maximize}</button>` : ''}
            </div>
          </div>
        </div>

        <div class="hdo-yt-settings">
          <button type="button" class="hdo-btn hdo-yt-gear" aria-label="Cài đặt">${ICONS.settings}</button>

            <div class="hdo-yt-panel hdo-yt-panel-main">
              <div class="hdo-yt-header">
                <span class="hdo-yt-title">Cài đặt</span>
              </div>
              <div class="hdo-yt-items">
                <button type="button" class="hdo-yt-item" data-sub="quality" aria-label="Chất lượng">
                  <span class="hdo-yt-name">Chất lượng</span>
                  <span class="hdo-yt-value hdo-yt-quality-val">Auto</span>
                  <span class="hdo-yt-chev">&rsaquo;</span>
                </button>
                <button type="button" class="hdo-yt-item" data-sub="speed" aria-label="Tốc độ phát">
                  <span class="hdo-yt-name">Tốc độ phát</span>
                  <span class="hdo-yt-value hdo-yt-speed-val">${this.startSettings.speed}x</span>
                  <span class="hdo-yt-chev">&rsaquo;</span>
                </button>
                <div class="hdo-yt-divider"></div>
                <button type="button" class="hdo-yt-item hdo-yt-loop-item" aria-label="Lặp lại">
                  <span class="hdo-yt-name">Lặp lại</span>
                  <span class="hdo-yt-check hdo-yt-loop-check"></span>
                </button>
                <button type="button" class="hdo-yt-item hdo-yt-shot-item" aria-label="Chụp màn hình">
                  <span class="hdo-yt-name">Chụp màn hình</span>
                </button>
              </div>
            </div>

            <div class="hdo-yt-panel hdo-yt-panel-sub hdo-yt-sub-speed">
              <div class="hdo-yt-header">
                <button type="button" class="hdo-yt-back" aria-label="Quay lại">&lsaquo;</button>
                <span class="hdo-yt-title">Tốc độ phát</span>
              </div>
              <div class="hdo-yt-list hdo-yt-speed-list"></div>
            </div>

            <div class="hdo-yt-panel hdo-yt-panel-sub hdo-yt-sub-quality">
              <div class="hdo-yt-header">
                <button type="button" class="hdo-yt-back" aria-label="Quay lại">&lsaquo;</button>
                <span class="hdo-yt-title">Chất lượng</span>
              </div>
              <div class="hdo-yt-list hdo-yt-quality-list"></div>
            </div>
          </div>

        <div class="hdo-mini-player">
          <div class="hdo-mini-header">
            <span class="hdo-mini-title">Đang phát</span>
            <div class="hdo-mini-header-btns">
              <button type="button" class="hdo-mini-play-btn">${ICONS.pause}</button>
              <button type="button" class="hdo-mini-full-btn">${ICONS.maximize}</button>
              <button type="button" class="hdo-mini-close-btn">${ICONS.close}</button>
            </div>
          </div>
          <div class="hdo-mini-video-wrap"></div>
        </div>
      `;

      this.video = this.container.querySelector('.hdo-video');
      this.posterEl = this.container.querySelector('.hdo-poster');
      this.bufferingEl = this.container.querySelector('.hdo-buffering');
      this.errorEl = this.container.querySelector('.hdo-error');
      this.errorMsg = this.container.querySelector('.hdo-error-msg');
      this.bigPlay = this.container.querySelector('.hdo-big-play');
      this.seekIndLeft = this.container.querySelector('.hdo-seek-left');
      this.seekIndRight = this.container.querySelector('.hdo-seek-right');
      this.seekIcoLeft = this.seekIndLeft.querySelector('.hdo-seek-ico');
      this.seekIcoRight = this.seekIndRight.querySelector('.hdo-seek-ico');
      this.seekTextLeft = this.seekIndLeft.querySelector('.hdo-seek-text');
      this.seekTextRight = this.seekIndRight.querySelector('.hdo-seek-text');
      this.centerIndicator = this.container.querySelector('.hdo-center-indicator');
      this.centerPlayIcon = this.container.querySelector('.hdo-center-play');
      this.centerPauseIcon = this.container.querySelector('.hdo-center-pause');
      this.controls = this.container.querySelector('.hdo-controls');
      this.progress = this.container.querySelector('.hdo-progress');
      this.bufferBar = this.container.querySelector('.hdo-progress-buffer');
      this.playedBar = this.container.querySelector('.hdo-progress-played');
      this.seek = this.container.querySelector('.hdo-seek');
      this.curTimeEl = this.container.querySelector('.hdo-current');
      this.durTimeEl = this.container.querySelector('.hdo-duration');
      this.playBtn = this.container.querySelector('.hdo-play');
      this.muteBtn = this.container.querySelector('.hdo-mute');
      this.volInput = this.container.querySelector('.hdo-vol-input');
      this.volFill = this.container.querySelector('.hdo-vol-fill');
      this.fullBtn = this.container.querySelector('.hdo-fullscreen');
      this.pipBtn = this.container.querySelector('.hdo-pip-btn');
      this.ytSettings = this.container.querySelector('.hdo-yt-settings');
      this.ytGear = this.container.querySelector('.hdo-yt-gear');
      this.ytQualityList = this.container.querySelector('.hdo-yt-quality-list');
      this.ytSpeedList = this.container.querySelector('.hdo-yt-speed-list');
      this.ytQualityVal = this.container.querySelector('.hdo-yt-quality-val');
      this.ytSpeedVal = this.container.querySelector('.hdo-yt-speed-val');
      this.ytLoopItem = this.container.querySelector('.hdo-yt-loop-item');
      this.ytLoopCheck = this.container.querySelector('.hdo-yt-loop-check');
      this.ytShotItem = this.container.querySelector('.hdo-yt-shot-item');
      this.ytPanelMain = this.container.querySelector('.hdo-yt-panel-main');
      this.streamList = this.ytQualityList;
      this.speedList = this.ytSpeedList;
      this.speedLabel = this.ytSpeedVal;
      this.streamLabel = this.ytQualityVal;
      this.settingsLoopCheck = this.ytLoopCheck;
      this.longPressOverlay = this.container.querySelector('.hdo-longpress-overlay');
      this.netSpeedEl = this.container.querySelector('.hdo-net-speed');
      this.miniPlayer = this.container.querySelector('.hdo-mini-player');
      this.miniPlayBtn = this.container.querySelector('.hdo-mini-play-btn');
      this.miniFullBtn = this.container.querySelector('.hdo-mini-full-btn');
      this.miniCloseBtn = this.container.querySelector('.hdo-mini-close-btn');

      this._buildSpeedList();
      this._applyVolume(this.startSettings.volume, this.startSettings.muted);
      this._setSpeed(this.startSettings.speed, false);
      this._applyTheme();
    }

    _applyTheme() {
      const root = document.documentElement;
      const dark = root.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      this.container.classList.toggle('hdo-light', !dark);
      this.container.classList.toggle('hdo-dark', !!dark);
      if (!this._themeWired) {
        this._themeWired = true;
        const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        const sync = () => this._applyTheme();
        if (mq) {
          if (mq.addEventListener) mq.addEventListener('change', sync);
          else if (mq.addListener) mq.addListener(sync);
        }
        if (window.MutationObserver) {
          const obs = new MutationObserver(sync);
          obs.observe(root, { attributes: true, attributeFilter: ['class'] });
          this._themeObserver = obs;
        }
      }
    }

    _buildSpeedList() {
      this.ytSpeedList.innerHTML = '';
      const cur = this.video && this.video.playbackRate != null ? this.video.playbackRate : this.startSettings.speed;
      SPEEDS.forEach(s => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'hdo-yt-list-item' + (s === cur ? ' active' : '');
        item.textContent = s + 'x';
        item.addEventListener('click', () => {
          this._setSpeed(s, true);
          this._backToMain();
        });
        this.ytSpeedList.appendChild(item);
      });
    }

    _buildQualityList() {
      this.ytQualityList.innerHTML = '';
      const items = [];
      if (this._levels && this._levels.length > 1) {
        items.push({ label: 'Auto', value: -1 });
        this._levels.forEach((l, i) => {
          items.push({ label: (l.height ? l.height + 'p' : 'SD'), value: i });
        });
      } else if (this._levels && this._levels.length === 1) {
        items.push({ label: this._levels[0] && this._levels[0].height ? this._levels[0].height + 'p' : 'Auto', value: 0 });
      } else {
        items.push({ label: 'Auto', value: -1 });
      }
      items.forEach(item => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'hdo-yt-list-item' + (item.value === this._quality ? ' active' : '');
        el.textContent = item.label;
        el.addEventListener('click', () => {
          this._setLevel(item.value);
        });
        this.ytQualityList.appendChild(el);
      });
    }

    _updateSettingsLoop() {
      this.ytLoopCheck.textContent = this._loop ? '\u2713' : '';
    }

    // ============ STREAMS (multi-server/quality) ============
    set streams(list) {
      this._streams = Array.isArray(list) ? list : [];
    }
    get streams() { return this._streams; }

    selectStream(idx) {
      const s = this._streams[idx];
      if (!s) return;
      this._activeStreamIdx = idx;
      const src = s.url;
      this.load(src, s.startTime || 0, s.poster || this.options.poster);
      return s;
    }

    // ============ LOAD / HLS ============
    load(url, startTime = 0, poster = '') {
      if (this._destroyed) return;
      if (poster) { this.options.poster = poster; this.video.poster = poster; }
      this._targetTime = startTime;
      this._seekedOnce = false;
      this._recovering = false;
      this._triedRaw = false;
      this._rawUrl = url;
      this._hideError();
      this._isHls = /\.m3u8($|\?)/i.test(url) || /application\/x-mpegurl|application\/vnd\.apple\.mpegurl/i.test(url);

      if (this._isHls) {
        this._startVideo(url);
      } else {
        this._destroyHls();
        this.video.src = this._abs(url);
        this._showBuffering();
      }
      this._maybeShowPoster();
    }

    _abs(url) {
      try { return new URL(url, location.href).href; } catch (e) { return url; }
    }

    _proxied(url) {
      return this._abs(`${this.options.proxyPrefix}?url=${encodeURIComponent(url)}`);
    }

    _startVideo(url) {
      if (window.Hls && Hls.isSupported()) {
        this._loadHlsClear(url);
      } else if (this._supportsNativeHls()) {
        this._destroyHls();
        this.video.src = this._proxied(url);
        this.video.addEventListener('loadedmetadata', () => this._onReady(), { once: true });
      } else {
        this._ensureHls((ok) => {
          if (this._destroyed) return;
          if (ok) this._loadHlsClear(url);
          else this._showError('Không tải được thư viện phát video (hls.js). Vui lòng kiểm tra kết nối mạng.');
        });
      }
    }

    _supportsNativeHls() {
      return isSafari || isIOS || !!(document.createElement('video').canPlayType && document.createElement('video').canPlayType('application/vnd.apple.mpegurl').replace(/no/, ''));
    }

    _ensureHls(cb) {
      if (window.Hls) { cb && cb(true); return; }
      const sources = [
        'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js',
        'https://unpkg.com/hls.js@1/dist/hls.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js'
      ];
      const tryNext = (i) => {
        if (i >= sources.length) { cb && cb(false); return; }
        if (window.Hls) { cb && cb(true); return; }
        const s = document.createElement('script');
        s.src = sources[i];
        s.onload = () => { cb && cb(!!window.Hls); };
        s.onerror = () => tryNext(i + 1);
        document.head.appendChild(s);
      };
      tryNext(0);
    }

    _newHls() {
      return new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        fragLoadingMaxRetry: 3,
        manifestLoadingMaxRetry: 3,
        levelLoadingMaxRetry: 3,
        capLevelToPlayerSize: false,
        startLevel: this._quality >= 0 ? this._quality : -1
      });
    }

    _loadHlsClear(url) {
      const proxied = this._proxied(url);
      this._destroyHls();
      const hls = this._newHls();
      this.hls = hls;
      this._hlsPri = proxied;
      this._hlsFallback = url;

      hls.loadSource(proxied);
      hls.attachMedia(this.video);
      hls.startLoad();

      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        this._levels = data.levels || [];
        this._renderLevels();
        this._onReady();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        if (data.level >= 0 && this._levels[data.level]) {
          this._quality = data.level;
          this.streamLabel.textContent = this._levels[data.level].height ? this._levels[data.level].height + 'p' : 'Auto';
          this._buildQualityList();
        }
      });

      hls.on(Hls.Events.ERROR, (_e, data) => this._onHlsError(data));
      hls.on(Hls.Events.FRAG_BUFFERING_STARTED, () => this._showBuffering());
      hls.on(Hls.Events.BUFFER_APPENDED, () => this._hideBuffering());
      hls.on(Hls.Events.FRAG_LOADED, () => this._hideBuffering());
    }

    _loadHlsRaw(url) {
      this._destroyHls();
      const hls = this._newHls();
      this.hls = hls;
      this._hlsPri = url;
      this._hlsFallback = null;

      hls.loadSource(url);
      hls.attachMedia(this.video);
      hls.startLoad();

      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        this._levels = data.levels || [];
        this._renderLevels();
        this._onReady();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        if (data.level >= 0 && this._levels[data.level]) {
          this._quality = data.level;
          this.streamLabel.textContent = this._levels[data.level].height ? this._levels[data.level].height + 'p' : 'Auto';
          this._buildQualityList();
        }
      });
      hls.on(Hls.Events.ERROR, (_e, data) => this._onHlsError(data));
      hls.on(Hls.Events.FRAG_BUFFERING_STARTED, () => this._showBuffering());
      hls.on(Hls.Events.BUFFER_APPENDED, () => this._hideBuffering());
      hls.on(Hls.Events.FRAG_LOADED, () => this._hideBuffering());
    }

    _fallbackToRaw() {
      if (this._triedRaw || !this._rawUrl) {
        this._showError();
        return;
      }
      this._triedRaw = true;
      console.warn('[HDOPlayer] Proxy stream thất bại, chuyển sang phát trực tiếp nguồn HLS:', this._rawUrl);
      this._hideError();
      this._maybeShowPoster();
      this._loadHlsRaw(this._rawUrl);
    }

    _onHlsError(data) {
      if (!data.fatal) { this._hideBuffering(); return; }
      console.error('[HDOPlayer] Lỗi HLS:', data.type, data.details || '', data.error || '');
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          this._showBuffering();
          if (!this._recovering) {
            this._recovering = true;
            setTimeout(() => {
              this._recovering = false;
              if (this.hls) {
                if (this._hlsPri === this._hlsFallback) { this._showError(); return; }
                this.hls.startLoad();
                setTimeout(() => { if (this.hls && this.video.readyState === 0) this._fallbackToRaw(); }, 4000);
              }
            }, 800);
          } else {
            this._fallbackToRaw();
          }
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this._showBuffering();
          if (!this._recovering) {
            this._recovering = true;
            this.hls && this.hls.recoverMediaError();
            setTimeout(() => {
              this._recovering = false;
              if (this.hls && this.hls.media) {
                if (this.hls.media.error) this._fallbackToRaw();
              }
            }, 500);
          } else {
            this._fallbackToRaw();
          }
          break;
        default:
          this._fallbackToRaw();
          break;
      }
    }

    _renderLevels() {
      const list = [];
      if (this._levels.length > 1) {
        list.push({ label: 'Auto', value: -1 });
        this._levels.forEach((l, i) => {
          list.push({ label: (l.height ? l.height + 'p' : 'SD'), value: i });
        });
      } else {
        list.push({ label: this._levels[0] && this._levels[0].height ? this._levels[0].height + 'p' : 'Auto', value: 0 });
      }

      const active = list.find(i => i.value === this._quality);
      if (active && active.value !== -1) this.streamLabel.textContent = active.label;
      this._buildQualityList();
    }

    _setLevel(level) {
      this._quality = level;
      if (this.hls) {
        if (level === -1) {
          this.hls.currentLevel = -1;
          this.streamLabel.textContent = 'Auto';
        } else {
          this.hls.currentLevel = level;
          this.streamLabel.textContent = this._levels[level] ? this._levels[level].height + 'p' : 'SD';
        }
        this._renderLevels();
      }
      this._backToMain();
    }

    // ============ READY / SEEK / PLAY ============
    _onReady() {
      this._hideBuffering();
      this._maybeShowPoster();
      if (!this._seekedOnce && this._targetTime > 0) {
        try { this.video.currentTime = this._targetTime; } catch (e) {}
        this._seekedOnce = true;
      }
      const shouldAutoplay = this.options.autoplay && !isIOS;
      if (shouldAutoplay && !this._userPaused) {
        this.video.play().catch(() => this._showIdle());
      } else {
        this._showIdle();
      }
    }

    _showIdle() {
      this.bigPlay.classList.add('show');
      this.bigPlay.innerHTML = this.video.ended ? ICONS.replay : ICONS.play;
      this.playBtn.innerHTML = ICONS.play;
      this.container.classList.add('controls-show');
    }

    _maybeShowPoster() {
      if (!this.video.currentSrc) { this.posterEl.style.display = 'flex'; return; }
      this.posterEl.style.display = 'none';
    }

    _showBuffering() { this.bufferingEl.classList.add('show'); this._isBuffering = true; }
    _hideBuffering() { this.bufferingEl.classList.remove('show'); this._isBuffering = false; }
    _showError(msg) {
      this.errorEl.classList.add('show');
      this.errorMsg.textContent = msg || 'Không thể phát video';
      this.bigPlay.style.display = 'none';
    }
    _hideError() { this.errorEl.classList.remove('show'); }

    // ============ EVENTS ============
    _bindEvents() {
      const v = this.video;
      const { container } = this;

      this._onPlay = () => {
        container.classList.add('playing');
        this.playBtn.innerHTML = ICONS.pause;
        this.bigPlay.classList.remove('show');
        this.posterEl.style.display = 'none';
        this._scheduleHide();
        this._syncCenterIndicator();
        if (this.netSpeedEl) this.netSpeedEl.style.display = '';
      };
      this._onPause = () => {
        container.classList.remove('playing');
        this.playBtn.innerHTML = ICONS.play;
        if (v.ended) {
          this.bigPlay.innerHTML = ICONS.replay;
          this.bigPlay.classList.add('show');
        }
        this._syncCenterIndicator();
        if (this.netSpeedEl) this.netSpeedEl.style.display = 'none';
        this._stopMiniPlayer();
      };
      this._onEnded = () => {
        this.playBtn.innerHTML = ICONS.replay;
        this.bigPlay.innerHTML = ICONS.replay;
        this.bigPlay.classList.add('show');
        this._showControls(false);
        this._syncCenterIndicator();
        if (this.netSpeedEl) this.netSpeedEl.style.display = 'none';
        this._stopMiniPlayer();
      };
      this._onTimeUpdate = () => this._updateProgress();
      this._onLoadedMeta = () => {
        this.durTimeEl.textContent = this._format(v.duration);
        this._maybeShowPoster();
      };
      this._onWaiting = () => this._showBuffering();
      this._onPlaying = () => {
        this._hideBuffering();
        this._syncMiniVideo();
      };
      this._onProgress = () => this._updateBuffer();
      this._onError = () => { if (!this.errorEl.classList.contains('show')) this._showError(); };

      v.addEventListener('play', this._onPlay);
      v.addEventListener('pause', this._onPause);
      v.addEventListener('ended', this._onEnded);
      v.addEventListener('timeupdate', this._onTimeUpdate);
      v.addEventListener('loadedmetadata', this._onLoadedMeta);
      v.addEventListener('waiting', this._onWaiting);
      v.addEventListener('playing', this._onPlaying);
      v.addEventListener('progress', this._onProgress);
      v.addEventListener('error', this._onError);

      // ============ CONTROLS VISIBILITY (YouTube-like) ============
      this._hideTimer = null;

      this._showControls = (autoHide) => {
        const wasHidden = !container.classList.contains('controls-show');
        container.classList.add('controls-show');
        if (wasHidden) this._syncCenterIndicator();
        this._resetHideTimer(autoHide !== false);
      };

      this._hideControls = () => {
        container.classList.remove('controls-show');
        if (this.centerIndicator) this.centerIndicator.classList.remove('animate');
        clearTimeout(this._hideTimer);
      };

      this._resetHideTimer = (shouldHide) => {
        clearTimeout(this._hideTimer);
        this._hideTimer = null;
        if (shouldHide && !v.paused && !v.ended && !this._isSettingsOpen()) {
          this._hideTimer = setTimeout(() => {
            if (!v.paused && !v.ended && !this._isSettingsOpen()) this._hideControls();
          }, this._autoHideDelay);
        }
      };

      this._scheduleHide = () => {
        this._resetHideTimer(true);
      };

      this._toggleControls = () => {
        if (container.classList.contains('controls-show')) {
          this._hideControls();
        } else {
          this._showControls(true);
        }
      };

      // ============ TAP / CLICK HANDLER (YouTube-like) ============
      let lastTapTime = 0;
      let lastTapSide = null;
      let gestureWillShow = null;
      let singleTimer = null;

      const DOUBLE_TAP_WINDOW = 300;

      let isTouchGesture = false;
      const captureWillShow = () => {
        gestureWillShow = !container.classList.contains('controls-show');
      };
      container.addEventListener('touchstart', () => {
        isTouchGesture = true;
        captureWillShow();
      }, { passive: true });
      container.addEventListener('mousedown', () => {
        if (!isTouchGesture) captureWillShow();
      });

      container.addEventListener('click', (e) => {
        isTouchGesture = false;
        if (this._miniVisible && e.target.closest('.hdo-mini-player')) return;
        if (this._isUiTarget(e.target)) return;
        if (this._isControlsArea(e.target)) return;

        const rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const relX = (e.clientX - rect.left) / rect.width;
        const now = Date.now();
        const tapSide = relX < 0.35 ? 'left' : relX > 0.65 ? 'right' : 'center';

        if (now - lastTapTime < DOUBLE_TAP_WINDOW && lastTapSide === tapSide) {
          clearTimeout(singleTimer);
          singleTimer = null;
          lastTapTime = 0;
          lastTapSide = null;
          if (tapSide === 'center') {
            this._toggleFullscreen();
          } else {
            const dir = tapSide === 'left' ? -1 : 1;
            const step = 10 * dir;
            const before = this.video.currentTime;
            const target = isNaN(this.video.duration) ? before : Math.max(0, Math.min(this.video.duration, before + step));
            if (target !== before) this.video.currentTime = target;
            this._seekAccum = (this._seekAccum || 0) + (target - before);
            this._showSeekIndicator(dir);
          }
          return;
        }

        clearTimeout(singleTimer);
        const willShow = gestureWillShow == null ? !container.classList.contains('controls-show') : gestureWillShow;
        singleTimer = setTimeout(() => {
          singleTimer = null;
          if (willShow) {
            this._showControls(true);
          } else {
            this._hideControls();
          }
        }, DOUBLE_TAP_WINDOW);

        lastTapTime = now;
        lastTapSide = tapSide;
      });

      // Big play button
      this.bigPlay.addEventListener('click', (e) => { e.stopPropagation(); this._togglePlay(); });
      this.centerIndicator.addEventListener('click', (e) => { e.stopPropagation(); this._togglePlay(); });

      // Error retry
      const retryBtn = this.container.querySelector('.hdo-error-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._recovering = false;
          this._triedRaw = false;
          if (this._rawUrl) this.load(this._rawUrl, this.video.currentTime || 0);
        });
      }

      // Mouse movement -> show controls
      container.addEventListener('mousemove', () => {
        this._showControls(true);
      });
      container.addEventListener('mouseleave', () => {
        if (!v.paused && v.readyState >= 2) {
          this._resetHideTimer(true);
        }
      });

      // Hover on controls bar -> keep visible
      this.controls.addEventListener('mouseenter', () => clearTimeout(this._hideTimer));
      this.controls.addEventListener('mouseleave', () => {
        if (!v.paused && v.readyState >= 2) {
          this._resetHideTimer(true);
        }
      });

      // Touch on UI elements -> reset auto-hide
      container.addEventListener('touchend', (e) => {
        if (this._isUiTarget(e.target)) {
          this._resetHideTimer(true);
        }
      });

      // Touch move -> show controls (like mouse move)
      container.addEventListener('touchmove', () => {
        this._showControls(true);
      });

      // Play button
      this.playBtn.addEventListener('click', (e) => { e.stopPropagation(); this._togglePlay(); });

      // Mute / Volume
      this.muteBtn.addEventListener('click', (e) => { e.stopPropagation(); this._toggleMute(); });
      this.volInput.addEventListener('input', () => {
        const val = this.volInput.value / 100;
        this.video.volume = val;
        this.video.muted = val === 0;
        this._updateMuteIcon();
        this.volFill.style.height = val * 100 + '%';
      });
      this.volWrap = this.container.querySelector('.hdo-vol-wrap');
      this._addHover(this.volWrap, () => this.volWrap.classList.add('open'), () => this.volWrap.classList.remove('open'));

      // Seek
      this._addHover(this.progress, () => this.progress.classList.add('hover'), () => this.progress.classList.remove('hover'));
      this.seek.addEventListener('input', () => {
        if (!isNaN(v.duration)) {
          const ratio = this.seek.value / 1000;
          const t = ratio * v.duration;
          this.playedBar.style.width = ratio * 100 + '%';
          this.curTimeEl.textContent = this._format(t);
        }
      });
      this.seek.addEventListener('change', () => {
        if (!isNaN(v.duration)) {
          const ratio = this.seek.value / 1000;
          v.currentTime = ratio * v.duration;
        }
      });

      // Fullscreen
      if (this.fullBtn) this.fullBtn.addEventListener('click', (e) => { e.stopPropagation(); this._toggleFullscreen(); });

      // PiP
      if (this.pipBtn) this.pipBtn.addEventListener('click', (e) => { e.stopPropagation(); this._togglePip(); });

      // YouTube-style settings (gear top-right)
      this.ytGear.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleSettings();
        this._showControls(true);
      });

      // Settings nav items (open submenu)
      this.ytSettings.querySelectorAll('.hdo-yt-item[data-sub]').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this._openSettings();
          this._openSub(item.getAttribute('data-sub'));
        });
      });

      // Loop toggle in settings
      if (this.ytLoopItem) {
        this.ytLoopItem.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleLoop();
        });
      }

      // Screenshot in settings
      if (this.ytShotItem) {
        this.ytShotItem.addEventListener('click', (e) => {
          e.stopPropagation();
          this._hideSettingsPanel();
          this._screenshot();
        });
      }

      // Submenu back buttons
      this.ytSettings.querySelectorAll('.hdo-yt-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._backToMain();
        });
      });

      // Click outside settings to close
      container.addEventListener('click', (e) => {
        if (this._isSettingsOpen() && !e.target.closest('.hdo-yt-settings')) {
          this._hideSettingsPanel();
        }
      });

      // Fullscreen change
      document.addEventListener('fullscreenchange', () => this._updateFullIcon());
      document.addEventListener('webkitfullscreenchange', () => this._updateFullIcon());

      // Keyboard
      document.addEventListener('keydown', (e) => {
        const inContainer = container.contains(document.activeElement) || container === document.activeElement;
        if (!inContainer && !this._isFullscreen()) return;
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        switch (e.key) {
          case ' ':
          case 'k': e.preventDefault(); this._togglePlay(); this._showControls(true); break;
          case 'ArrowLeft': e.preventDefault(); this._seekBy(-10); this._showControls(true); break;
          case 'ArrowRight': e.preventDefault(); this._seekBy(10); this._showControls(true); break;
          case 'ArrowUp': e.preventDefault(); this._changeVolume(0.1); this._showControls(true); break;
          case 'ArrowDown': e.preventDefault(); this._changeVolume(-0.1); this._showControls(true); break;
          case 'm': case 'M': this._toggleMute(); break;
          case 'f': case 'F': this._toggleFullscreen(); break;
          case 'Escape': if (this._isSettingsOpen()) { this._hideSettingsPanel(); e.preventDefault(); } break;
          case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
            e.preventDefault(); this._seekToPercent(parseInt(e.key) * 10); this._showControls(true); break;
          case '[': e.preventDefault(); this._stepSpeed(-1); this._showControls(true); break;
          case ']': e.preventDefault(); this._stepSpeed(1); this._showControls(true); break;
          case 'c': case 'C': e.preventDefault(); this._screenshot(); break;
          case 'l': case 'L': e.preventDefault(); this._toggleLoop(); break;
          case 'n': case 'N': e.preventDefault(); if (this.options.onNext) this.options.onNext(); break;
          case 'p': case 'P': e.preventDefault(); if (this.options.onPrev) this.options.onPrev(); break;
          case 'Space':
            if (!this._spaceHeld) {
              this._spaceHeld = true;
              this._longPressStart();
            }
            break;
          default: break;
        }
      });

      document.addEventListener('keyup', (e) => {
        if (e.key === 'Space' && this._spaceHeld) {
          this._spaceHeld = false;
          this._longPressEnd();
        }
      });

      // Long press touch events
      this._initLongPress();

      // History
      if (this.options.history && typeof this.options.history === 'object') {
        this.history = this.options.history;
        let lastSave = 0;
        const save = () => {
          if (v.duration && !isNaN(v.duration)) {
            this.history.onProgress({
              currentTime: v.currentTime,
              duration: v.duration
            });
          }
        };
        v.addEventListener('timeupdate', () => {
          const now = Date.now();
          if (now - lastSave > 3000) { lastSave = now; save(); }
        });
        v.addEventListener('pause', save);
        const unload = () => save();
        window.addEventListener('beforeunload', unload);
        this._unloadHandler = unload;
      }
    }

    _isUiTarget(el) {
      return !!(el.closest('.hdo-btn') || el.closest('.hdo-yt-settings') || el.closest('.hdo-seek') || el.closest('.hdo-vol-wrap') || el.closest('.hdo-progress') || el.closest('.hdo-big-play'));
    }

    _isControlsArea(el) {
      return !!el.closest('.hdo-controls');
    }

    _addHover(el, on, off) {
      el.addEventListener('mouseenter', on);
      el.addEventListener('mouseleave', off);
    }

    _togglePlay() {
      if (this.video.paused || this.video.ended) {
        this.video.play().catch(() => {});
        this.bigPlay.classList.remove('show');
      } else {
        this.video.pause();
      }
    }

    // ============ TAP VISUAL FEEDBACK ============
    _showCenterIndicator(isPlay) {
      if (!this.centerIndicator) return;
      this.centerPlayIcon.style.display = isPlay ? '' : 'none';
      this.centerPauseIcon.style.display = isPlay ? 'none' : '';
      this.centerIndicator.classList.add('animate');
    }

    _syncCenterIndicator() {
      if (!this.centerIndicator) return;
      if (this.container.classList.contains('controls-show')) {
        this._showCenterIndicator(this.video.paused || this.video.ended);
      } else {
        this.centerIndicator.classList.remove('animate');
      }
    }

    _showSeekIndicator(dir) {
      const ind = dir < 0 ? this.seekIndLeft : this.seekIndRight;
      const text = dir < 0 ? this.seekTextLeft : this.seekTextRight;
      const v = this._seekAccum || 0;
      text.textContent = (v > 0 ? '+' : '') + Math.round(v);
      ind.classList.remove('animate');
      void ind.offsetHeight;
      ind.classList.add('animate');
      clearTimeout(this._seekIndTimer);
      this._seekIndTimer = setTimeout(() => {
        this.seekIndLeft.classList.remove('animate');
        this.seekIndRight.classList.remove('animate');
        this._seekAccum = 0;
      }, 800);
    }

    // ============ CONTROLS ============
    _toggleMute() {
      this.video.muted = !this.video.muted;
      this._updateMuteIcon();
    }

    _changeVolume(delta) {
      let vol = this.video.muted ? 0 : this.video.volume;
      vol = Math.max(0, Math.min(1, vol + delta));
      this.video.muted = vol === 0;
      this.video.volume = vol;
      this.volInput.value = vol * 100;
      this.volFill.style.height = vol * 100 + '%';
      if (vol > 0) this._updateMuteIcon();
    }

    _applyVolume(vol, muted) {
      this.video.volume = vol;
      this.video.muted = muted;
      this.volInput.value = vol * 100;
      this.volFill.style.height = vol * 100 + '%';
      this._updateMuteIcon();
    }

    _updateMuteIcon() {
      if (this.video.muted || this.video.volume === 0) this.muteBtn.innerHTML = ICONS.mute;
      else this.muteBtn.innerHTML = ICONS.volume;
    }

    _setSpeed(speed, save) {
      this.video.playbackRate = speed;
      this.speedLabel.textContent = speed + 'x';
      if (save) {
        try { localStorage.setItem('hdo_player_speed', String(speed)); } catch (e) {}
      }
      const items = this.ytSpeedList.querySelectorAll('.hdo-yt-list-item');
      items.forEach(it => it.classList.toggle('active', parseFloat(it.textContent) === speed));
    }

    _seekBy(sec) {
      if (isNaN(this.video.duration)) return;
      this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + sec));
    }

    _seekToPercent(pct) {
      if (isNaN(this.video.duration)) return;
      this.video.currentTime = this.video.duration * (pct / 100);
    }

    _stepSpeed(dir) {
      const cur = this.video.playbackRate;
      let idx = SPEEDS.indexOf(cur);
      if (idx === -1) {
        let closest = 0;
        let minDiff = Infinity;
        SPEEDS.forEach((s, i) => {
          const diff = Math.abs(s - cur);
          if (diff < minDiff) { minDiff = diff; closest = i; }
        });
        idx = closest;
      }
      idx = Math.max(0, Math.min(SPEEDS.length - 1, idx + dir));
      this._setSpeed(SPEEDS[idx], true);
    }

    _updateProgress() {
      const v = this.video;
      if (isNaN(v.duration) || v.duration === 0) {
        this.curTimeEl.textContent = this._format(0);
        return;
      }
      const ratio = v.currentTime / v.duration;
      this.seek.value = ratio * 1000;
      this.playedBar.style.width = ratio * 100 + '%';
      this.curTimeEl.textContent = this._format(v.currentTime);
    }

    _updateBuffer() {
      const v = this.video;
      if (!v.buffered.length || isNaN(v.duration) || v.duration === 0) return;
      const end = v.buffered.end(v.buffered.length - 1);
      this.bufferBar.style.width = (end / v.duration * 100) + '%';
    }

    // ============ SETTINGS POPUP (YouTube-like: don't pause video) ============
    _isSettingsOpen() {
      return this.ytSettings.classList.contains('open');
    }

    _openSettings() {
      this.ytSettings.classList.add('open');
      this._positionSettingsPanel();
      this._buildQualityList();
      this._buildSpeedList();
      clearTimeout(this._hideTimer);
    }

    _toggleSettings() {
      if (this._isSettingsOpen()) {
        this._hideSettingsPanel();
      } else {
        this._openSettings();
      }
    }

    _openSub(name) {
      this.ytSettings.querySelectorAll('.hdo-yt-panel-sub').forEach(p => p.classList.remove('active'));
      const sub = this.ytSettings.querySelector('.hdo-yt-sub-' + name);
      if (sub) sub.classList.add('active');
      this.ytPanelMain.classList.add('hidden');
    }

    _backToMain() {
      this.ytSettings.querySelectorAll('.hdo-yt-panel-sub').forEach(p => p.classList.remove('active'));
      this.ytPanelMain.classList.remove('hidden');
    }

    _hideSettingsPanel() {
      this.ytSettings.classList.remove('open');
      this._backToMain();
      this._clearSettingsPosition();
      if (!this.video.paused) {
        this._resetHideTimer(true);
      }
    }

    _positionSettingsPanel() {
      const rect = this.ytGear.getBoundingClientRect();
      const isSmall = containerWidth => containerWidth < 260;
      const sizeThis = this;
      const update = () => {
        const gear = sizeThis.ytGear.getBoundingClientRect();
        const panelW = isSmall(sizeThis.container.clientWidth) ? 190 : 210;
        const top = Math.max(8, gear.bottom + 8);
        const right = Math.max(8, window.innerWidth - gear.right - 8);
        const maxH = Math.min(window.innerHeight - top - 8, 400);
        sizeThis.ytSettings.querySelectorAll('.hdo-yt-panel').forEach(p => {
          p.style.position = 'fixed';
          p.style.top = top + 'px';
          p.style.right = right + 'px';
          p.style.left = 'auto';
          p.style.width = panelW + 'px';
          p.style.maxHeight = Math.max(120, maxH) + 'px';
        });
      };
      update();
      this._onSettingsReposition = () => update();
      window.addEventListener('resize', this._onSettingsReposition);
      window.addEventListener('scroll', this._onSettingsReposition, true);
      if (this._settingsResizeObserver) this._settingsResizeObserver.disconnect();
      this._settingsResizeObserver = new ResizeObserver(() => update());
      this._settingsResizeObserver.observe(this.container);
    }

    _clearSettingsPosition() {
      if (this._onSettingsReposition) {
        window.removeEventListener('resize', this._onSettingsReposition);
        window.removeEventListener('scroll', this._onSettingsReposition, true);
        this._onSettingsReposition = null;
      }
      if (this._settingsResizeObserver) {
        this._settingsResizeObserver.disconnect();
        this._settingsResizeObserver = null;
      }
      this.ytSettings.querySelectorAll('.hdo-yt-panel').forEach(p => {
        p.style.position = '';
        p.style.top = '';
        p.style.right = '';
        p.style.left = '';
        p.style.width = '';
        p.style.maxHeight = '';
      });
    }

    // ============ FULLSCREEN / PIP ============
    _fullscreenEnabled() {
      return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    }
    _isFullscreen() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    _toggleFullscreen() {
      if (this._isFullscreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        this._stopMiniPlayer();
        this._showControls(true);
        const el = this.container;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      }
    }
    _updateFullIcon() {
      if (this._isFullscreen()) this._stopMiniPlayer();
      if (!this.fullBtn) return;
      this.fullBtn.innerHTML = this._isFullscreen() ? ICONS.minimize : ICONS.maximize;
    }

    _togglePip() {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      } else {
        this.video.requestPictureInPicture().catch(() => {});
      }
    }

    // ============ SCREENSHOT ============
    _screenshot() {
      const v = this.video;
      if (!v || !v.src || isNaN(v.duration) || v.readyState < 2) return;
      const canvas = document.createElement('canvas');
      canvas.width = v.videoWidth || v.clientWidth;
      canvas.height = v.videoHeight || v.clientHeight;
      const ctx = canvas.getContext('2d');
      try {
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        this._showToast('Không thể chụp màn hình');
        return;
      }
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const time = this._format(v.currentTime).replace(/:/g, '-');
        a.download = `screenshot_${time}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        this._showFlash();
        this._showToast('Đã chụp màn hình');
      }, 'image/png');
    }

    _showFlash() {
      const flash = document.createElement('div');
      flash.className = 'hdo-screenshot-flash';
      this.container.appendChild(flash);
      requestAnimationFrame(() => {
        flash.classList.add('animate');
        setTimeout(() => flash.remove(), 500);
      });
    }

    // ============ LOOP ============
    _toggleLoop() {
      this._loop = !this._loop;
      this.video.loop = this._loop;
      this._updateSettingsLoop();
      this._showToast(this._loop ? 'Lặp lại: Bật' : 'Lặp lại: Tắt');
    }

    // ============ LONG PRESS ============
    _initLongPress() {
      let longPressTimer = null;
      let longPressActive = false;
      const v = this.video;

      const onStart = (e) => {
        if (this._isUiTarget(e.target) || this._isControlsArea(e.target) || this._miniVisible) return;
        longPressActive = false;
        longPressTimer = setTimeout(() => {
          longPressActive = true;
          this._longPressStart();
        }, 500);
      };

      const onEnd = () => {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        if (longPressActive) {
          longPressActive = false;
          this._longPressEnd();
        }
      };

      const onMove = (e) => {
        if (!longPressActive) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      };

      v.addEventListener('touchstart', onStart, { passive: true });
      v.addEventListener('touchend', onEnd, { passive: true });
      v.addEventListener('touchcancel', onEnd, { passive: true });
      v.addEventListener('touchmove', onMove, { passive: true });
    }

    _longPressStart() {
      if (this._longPressActive) return;
      this._longPressActive = true;
      this._prevSpeed = this.video.playbackRate;
      this.video.playbackRate = 2;
      if (this.longPressOverlay) {
        this.longPressOverlay.classList.add('show');
      }
    }

    _longPressEnd() {
      if (!this._longPressActive) return;
      this._longPressActive = false;
      this.video.playbackRate = this._prevSpeed;
      if (this.longPressOverlay) {
        this.longPressOverlay.classList.remove('show');
      }
    }

    // ============ MINI PLAYER ============
    _initMiniPlayer() {
      this._miniVisible = false;
      this._miniHover = false;
      this._miniHideTimer = null;

      const rect = this.container.getBoundingClientRect();

      const header = this.miniPlayer.querySelector('.hdo-mini-header');
      const miniWrap = this.miniPlayer.querySelector('.hdo-mini-video-wrap');
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const r = this.miniPlayer.getBoundingClientRect();
        dragOffsetX = e.clientX - r.left;
        dragOffsetY = e.clientY - r.top;
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging || !this._miniVisible) return;
        this.miniPlayer.style.left = (e.clientX - dragOffsetX) + 'px';
        this.miniPlayer.style.top = (e.clientY - dragOffsetY) + 'px';
        this.miniPlayer.style.right = 'auto';
        this.miniPlayer.style.bottom = 'auto';
      });

      document.addEventListener('mouseup', () => { isDragging = false; });

      header.addEventListener('touchstart', (e) => {
        isDragging = true;
        const r = this.miniPlayer.getBoundingClientRect();
        const touch = e.touches[0];
        dragOffsetX = touch.clientX - r.left;
        dragOffsetY = touch.clientY - r.top;
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging || !this._miniVisible) return;
        const touch = e.touches[0];
        this.miniPlayer.style.left = (touch.clientX - dragOffsetX) + 'px';
        this.miniPlayer.style.top = (touch.clientY - dragOffsetY) + 'px';
        this.miniPlayer.style.right = 'auto';
        this.miniPlayer.style.bottom = 'auto';
      }, { passive: true });

      document.addEventListener('touchend', () => { isDragging = false; });

      miniWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._isFullscreen()) return;
        this._stopMiniPlayer();
        this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      this.miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._togglePlay();
        this._syncMiniVideo();
      });

      this.miniFullBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleFullscreen();
      });

      this.miniCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.video.pause();
        this._stopMiniPlayer();
      });

      this.miniPlayer.addEventListener('mouseenter', () => {
        this._miniHover = true;
        clearTimeout(this._miniHideTimer);
        this.miniPlayer.classList.remove('auto-hide');
      });

      this.miniPlayer.addEventListener('mouseleave', () => {
        this._miniHover = false;
        this._startMiniHideTimer();
      });

      this.miniPlayer.style.display = 'none';

      window.addEventListener('scroll', () => this._checkMiniPlayerScroll(), { passive: true });
    }

    _checkMiniPlayerScroll() {
      if (this._destroyed) return;
      if (this._isFullscreen()) { this._stopMiniPlayer(); return; }
      if (this.video.paused || this.video.ended) { this._stopMiniPlayer(); return; }

      const rect = this.container.getBoundingClientRect();
      const past = rect.bottom < 0;

      if (past && !this._miniVisible) {
        this._startMiniPlayer();
      } else if (!past && this._miniVisible) {
        this._stopMiniPlayer();
      }
    }

    _startMiniPlayer() {
      if (this._miniVisible || this._isFullscreen() || this.video.paused || this.video.ended) return;
      this._miniVisible = true;
      this.miniPlayer.style.display = 'block';
      this.miniPlayer.style.right = '12px';
      this.miniPlayer.style.bottom = '12px';
      this.miniPlayer.style.left = 'auto';
      this.miniPlayer.style.top = 'auto';
      const wrap = this.miniPlayer.querySelector('.hdo-mini-video-wrap');
      if (this.video.parentElement !== wrap) {
        wrap.appendChild(this.video);
      }
      this._syncMiniPlayerUi();
      this._startMiniHideTimer();
    }

    _stopMiniPlayer() {
      if (!this._miniVisible) return;
      this._miniVisible = false;
      this.miniPlayer.style.display = 'none';
      this.miniPlayer.classList.remove('auto-hide');
      clearTimeout(this._miniHideTimer);
      const wrap = this.miniPlayer.querySelector('.hdo-mini-video-wrap');
      if (wrap && this.video.parentElement === wrap) {
        this.container.insertBefore(this.video, this.container.firstChild);
      }
    }

    _syncMiniVideo() {
      if (!this._miniVisible) return;
      const wrap = this.miniPlayer.querySelector('.hdo-mini-video-wrap');
      if (wrap && this.video.parentElement !== wrap) {
        wrap.appendChild(this.video);
      }
      this._syncMiniPlayerUi();
    }

    _syncMiniPlayerUi() {
      if (this.video.paused) {
        this.miniPlayBtn.innerHTML = ICONS.play;
      } else {
        this.miniPlayBtn.innerHTML = ICONS.pause;
      }
    }

    _startMiniHideTimer() {
      clearTimeout(this._miniHideTimer);
      this._miniHideTimer = setTimeout(() => {
        if (this._miniVisible && !this._miniHover) {
          this.miniPlayer.classList.add('auto-hide');
        }
      }, 10000);
    }

    // ============ NETWORK SPEED MONITOR ============
    _initNetworkMonitor() {
      this._netLastBytes = 0;
      this._netLastTime = 0;
      this._netTimer = null;

      this._netTimer = setInterval(() => this._updateNetSpeed(), 2000);
    }

    _updateNetSpeed() {
      if (this._destroyed) {
        clearInterval(this._netTimer);
        return;
      }
      if (this.video.paused || this.video.ended || !this.netSpeedEl) {
        return;
      }

      try {
        const entries = performance.getEntriesByType('resource');
        if (!entries.length) return;

        let totalBytes = 0;
        let latestTime = 0;
        entries.forEach(e => {
          if (e.transferSize && e.transferSize > 0) {
            totalBytes += e.transferSize;
            if (e.responseEnd > latestTime) latestTime = e.responseEnd;
          }
        });

        if (this._netLastTime === 0) {
          this._netLastBytes = totalBytes;
          this._netLastTime = latestTime;
          return;
        }

        const bytesDelta = totalBytes - this._netLastBytes;
        const timeDelta = (latestTime - this._netLastTime) / 1000;

        this._netLastBytes = totalBytes;
        this._netLastTime = latestTime;

        if (timeDelta <= 0 || bytesDelta < 0) return;

        const speed = bytesDelta / timeDelta;

        let speedStr;
        if (speed >= 1048576) {
          speedStr = (speed / 1048576).toFixed(1) + ' MB/s';
        } else {
          speedStr = Math.round(speed / 1024) + ' KB/s';
        }

        let bufferStr = '';
        if (this.video.buffered.length && this.video.duration && !isNaN(this.video.duration)) {
          const bufEnd = this.video.buffered.end(this.video.buffered.length - 1);
          const bufPct = Math.round((bufEnd / this.video.duration) * 100);
          bufferStr = ' | ' + bufPct + '%';
        }

        this.netSpeedEl.textContent = speedStr + bufferStr;
      } catch (e) {}
    }

    // ============ TOAST ============
    _showToast(msg, duration) {
      duration = duration || 2000;
      const existing = this.container.querySelector('.hdo-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'hdo-toast';
      toast.textContent = msg;
      this.container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    // ============ HELPERS ============
    _format(sec) {
      if (!isFinite(sec) || sec < 0) sec = 0;
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const pad = n => String(n).padStart(2, '0');
      return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
    }

    _loadSettings() {
      try {
        const speed = localStorage.getItem('hdo_player_speed');
        if (speed && SPEEDS.includes(parseFloat(speed))) this.startSettings.speed = parseFloat(speed);
      } catch (e) {}
    }

    _destroyHls() {
      if (this.hls) {
        try { this.hls.destroy(); } catch (e) {}
        this.hls = null;
      }
    }

    destroy() {
      this._destroyed = true;
      this._destroyHls();
      this.video.pause();
      this.video.removeAttribute('src');
      this.video.load();
      if (this._unloadHandler) window.removeEventListener('beforeunload', this._unloadHandler);
      clearInterval(this._netTimer);
      this._stopMiniPlayer();
      clearTimeout(this._longPressTimer);
      this.container.innerHTML = '';
    }
  }

  // ============ INJECT STYLES ============
  const CSS = `
  .hdo-player {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .hdo-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
    cursor: pointer;
  }
  .hdo-poster {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    display: none;
    z-index: 1;
    pointer-events: none;
  }

  /* Big play button */
  .hdo-big-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(229, 9, 20, 0.9);
    color: #fff;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    z-index: 3;
    box-shadow: 0 6px 24px rgba(0,0,0,.4);
    transition: transform .15s ease;
  }
  .hdo-big-play:hover { transform: translate(-50%, -50%) scale(1.08); }
  .hdo-big-play.show { display: flex; }
  .hdo-big-play svg { width: 32px; height: 32px; }
  .hdo-big-play.show svg { margin-left: 4px; }

  /* Center play/pause indicator */
  .hdo-center-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    display: none;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 7;
  }
  .hdo-center-indicator.animate {
    display: flex;
    pointer-events: auto;
    animation: hdo-center-pop 0.35s ease-out;
  }
  .hdo-center-icon {
    position: absolute;
    color: #fff;
    width: 34px;
    height: 34px;
    display: none;
  }
  .hdo-center-indicator.animate .hdo-center-icon {
    display: block;
  }
  @keyframes hdo-center-pop {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    30% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    60% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  /* Seek indicators (YouTube-style, left/right positioned) */
  .hdo-seek-indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    align-items: center;
    gap: 8px;
    color: #fff;
    pointer-events: none;
    z-index: 7;
  }
  .hdo-seek-left { left: 12%; }
  .hdo-seek-right { right: 12%; }
  .hdo-seek-indicator.animate {
    display: flex;
    animation: hdo-seek-pop 0.8s ease-out forwards;
  }
  .hdo-seek-ico svg { width: 28px; height: 28px; }
  .hdo-seek-text {
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 24px;
    text-align: center;
  }
  @keyframes hdo-seek-pop {
    0% { opacity: 0; transform: translateY(-50%) scale(0.6); }
    15% { opacity: 1; transform: translateY(-50%) scale(1.05); }
    30% { transform: translateY(-50%) scale(1); }
    70% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-50%) scale(1); }
  }

  /* Buffering spinner */
  .hdo-buffering {
    position: absolute;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
  }
  .hdo-buffering.show { display: flex; }
  .hdo-spinner { width: 56px; height: 56px; color: rgba(255,255,255,.9); animation: hdo-spin .9s linear infinite; }
  .hdo-spinner svg { width: 100%; height: 100%; }
  @keyframes hdo-spin { to { transform: rotate(360deg); } }

  /* Error overlay */
  .hdo-error {
    position: absolute;
    inset: 0;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 4;
    background: rgba(0,0,0,.7);
    color: #fff;
  }
  .hdo-error.show { display: flex; }
  .hdo-error-msg { font-size: 16px; text-align: center; padding: 0 16px; }
  .hdo-error-retry {
    padding: 10px 24px;
    background: #e50914;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
  }
  .hdo-error-retry:hover { background: #f6121d; }

  /* Controls overlay */
  .hdo-controls {
    position: absolute;
    inset: auto 0 0 0;
    background: linear-gradient(transparent, rgba(0,0,0,.8));
    padding: 14px 12px 8px;
    opacity: 0;
    z-index: 5;
    overflow: visible;
    container-type: inline-size;
    container-name: hdo-controls;
  }
  .hdo-player.controls-show .hdo-controls { opacity: 1; }
  .hdo-player.controls-show .hdo-big-play.hdo-big-play { display: none; }

  /* Progress bar */
  .hdo-progress {
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .hdo-progress-buffer,
  .hdo-progress-played {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    border-radius: 2px;
    pointer-events: none;
    transition: height .1s ease;
  }
  .hdo-progress-buffer { background: rgba(255,255,255,.3); width: 0; }
  .hdo-progress-played { background: #e50914; width: 0; }
  .hdo-progress:hover .hdo-progress-buffer,
  .hdo-progress:hover .hdo-progress-played { height: 6px; }
  .hdo-seek {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }
  .hdo-progress-hover {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e50914;
    z-index: 1;
    display: none;
    pointer-events: none;
  }
  .hdo-progress:hover .hdo-progress-hover { display: block; }
  .hdo-tooltip {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,.85);
    color: #fff;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    display: none;
  }
  .hdo-progress:hover .hdo-tooltip { display: block; }

  /* Controls bar */
  .hdo-controls-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    margin-top: 4px;
    min-width: 0;
    overflow: hidden;
  }
  .hdo-bar-left,
  .hdo-bar-right {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    flex-shrink: 1;
  }
  .hdo-bar-right {
    flex-shrink: 1;
  }
  .hdo-btn {
    position: relative;
    background: transparent;
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background .15s;
    flex-shrink: 1;
    padding: 0;
  }
  .hdo-btn:hover { background: rgba(255,255,255,.15); }
  .hdo-btn svg { width: 22px; height: 22px; min-width: 0; }
  .hdo-btn-label {
    font-size: 11px;
    font-weight: 700;
    margin-left: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 36px;
  }
  .hdo-time { font-size: 13px; color: #fff; margin-left: 6px; font-variant-numeric: tabular-nums; white-space: nowrap; flex-shrink: 1; min-width: 0; overflow: hidden; }

  /* YouTube-style settings popup (gear top-right) */
  .hdo-yt-settings {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 12;
    opacity: 0;
    pointer-events: none;
  }
  .hdo-player.controls-show .hdo-yt-settings,
  .hdo-yt-settings.open { opacity: 1; pointer-events: auto; }
  .hdo-yt-gear {
    background: transparent;
    border: none;
    color: #fff;
    width: 38px;
    height: 38px;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background .15s;
    margin: 8px 8px 0 0;
  }
  .hdo-yt-gear:hover { background: rgba(255,255,255,.15); }
  .hdo-yt-gear svg { width: 22px; height: 22px; }
  .hdo-yt-panel {
    position: absolute;
    top: 8px;
    right: 52px;
    width: 210px;
    background: rgba(28, 28, 28, .96);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,.6);
    overflow: hidden;
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
    max-height: min(60vh, 400px);
    overflow-y: auto;
  }
  .hdo-yt-settings.open .hdo-yt-panel-main:not(.hidden) { opacity: 1; transform: none; pointer-events: auto; }
  .hdo-yt-settings.open .hdo-yt-panel-sub.active { opacity: 1; transform: none; pointer-events: auto; }
  .hdo-yt-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(255,255,255,.1);
    position: sticky;
    top: 0;
    background: rgba(28,28,28,.98);
    z-index: 1;
  }
  .hdo-yt-title { font-size: 13px; font-weight: 700; color: #fff; }
  .hdo-yt-back {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    line-height: 1;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background .15s;
  }
  .hdo-yt-back:hover { background: rgba(255,255,255,.15); }
  .hdo-yt-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 11px 14px;
    background: none;
    border: none;
    color: #ddd;
    font-size: 13px;
    cursor: pointer;
    transition: background .1s;
  }
  .hdo-yt-item:hover { background: rgba(255,255,255,.1); color: #fff; }
  .hdo-yt-item svg { width: 18px; height: 18px; flex-shrink: 0; }
  .hdo-yt-name {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    white-space: nowrap;
  }
  .hdo-yt-value { font-size: 12px; font-weight: 600; color: #aaa; margin-left: auto; white-space: nowrap; }
  .hdo-yt-chev { color: #888; font-size: 16px; flex-shrink: 0; }
  .hdo-yt-check { color: #e50914; font-size: 15px; font-weight: 700; min-width: 16px; text-align: right; }
  .hdo-yt-divider { height: 1px; background: rgba(255,255,255,.08); margin: 4px 10px; }
  .hdo-yt-list { padding: 6px 0; }
  .hdo-yt-list-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 14px;
    background: none;
    border: none;
    color: #ddd;
    font-size: 13px;
    cursor: pointer;
    transition: background .1s;
  }
  .hdo-yt-list-item:hover { background: rgba(255,255,255,.1); color: #fff; }
  .hdo-yt-list-item.active { color: #e50914; font-weight: 700; }
  .hdo-yt-list-item.active::after { content: '\\2713'; margin-left: 8px; }

  /* Light theme (follows site dark/light) */
  .hdo-player.hdo-light .hdo-yt-panel {
    background: rgba(255, 255, 255, .97);
    box-shadow: 0 8px 32px rgba(0,0,0,.18);
  }
  .hdo-player.hdo-light .hdo-yt-header {
    background: rgba(255,255,255,.99);
    border-bottom: 1px solid rgba(0,0,0,.08);
  }
  .hdo-player.hdo-light .hdo-yt-title,
  .hdo-player.hdo-light .hdo-yt-back { color: #111; }
  .hdo-player.hdo-light .hdo-yt-back:hover { background: rgba(0,0,0,.08); }
  .hdo-player.hdo-light .hdo-yt-item { color: #333; }
  .hdo-player.hdo-light .hdo-yt-item:hover { background: rgba(0,0,0,.06); color: #000; }
  .hdo-player.hdo-light .hdo-yt-value { color: #555; }
  .hdo-player.hdo-light .hdo-yt-chev { color: #777; }
  .hdo-player.hdo-light .hdo-yt-divider { background: rgba(0,0,0,.1); }
  .hdo-player.hdo-light .hdo-yt-list-item { color: #333; }
  .hdo-player.hdo-light .hdo-yt-list-item:hover { background: rgba(0,0,0,.06); color: #000; }
  .hdo-player.hdo-light .hdo-yt-list-item.active { color: #e50914; }
  .hdo-player.hdo-light .hdo-yt-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,.3); }

  /* Volume */
  .hdo-vol-wrap { position: relative; display: flex; align-items: center; flex-shrink: 0; }
  .hdo-vol-slider {
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
    width: 40px;
    height: 110px;
    background: rgba(20,20,20,.95);
    border-radius: 8px;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    box-shadow: 0 4px 16px rgba(0,0,0,.5);
  }
  .hdo-vol-wrap.open .hdo-vol-slider { display: flex; }
  .hdo-vol-input {
    writing-mode: vertical-lr;
    direction: rtl;
    width: 100%;
    height: 80px;
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
    margin: 0;
  }
  .hdo-vol-fill { position: absolute; bottom: 14px; width: 22px; background: #e50914; pointer-events: none; }

  /* Network speed badge */
  .hdo-net-speed {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255,255,255,.8);
    background: rgba(0,0,0,.4);
    padding: 1px 5px;
    border-radius: 4px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: 4px;
    line-height: 1.4;
  }

  /* Screenshot flash */
  .hdo-screenshot-flash {
    position: absolute;
    inset: 0;
    background: #fff;
    z-index: 20;
    pointer-events: none;
    opacity: 0;
  }
  .hdo-screenshot-flash.animate {
    animation: hdo-flash 0.5s ease-out forwards;
  }
  @keyframes hdo-flash {
    0% { opacity: 0.8; }
    100% { opacity: 0; }
  }

  /* Long press overlay */
  .hdo-longpress-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 8;
    pointer-events: none;
  }
  .hdo-longpress-overlay.show {
    display: flex;
    animation: hdo-longpress-pop 0.2s ease-out;
  }
  .hdo-longpress-overlay span {
    color: #fff;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
  }
  @keyframes hdo-longpress-pop {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  /* Toast notification */
  .hdo-toast {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: rgba(0, 0, 0, .8);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: 8px;
    z-index: 25;
    pointer-events: none;
    opacity: 0;
    transition: opacity .3s, transform .3s;
    white-space: nowrap;
  }
  .hdo-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* Mini player */
  .hdo-mini-player {
    position: fixed;
    width: 300px;
    z-index: 9999;
    background: #000;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.7);
    overflow: hidden;
    opacity: 1;
    transition: opacity .3s;
    touch-action: none;
  }
  .hdo-mini-player.auto-hide {
    opacity: 0;
    pointer-events: none;
  }
  .hdo-mini-player.auto-hide:hover {
    opacity: 1;
    pointer-events: auto;
  }
  .hdo-mini-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    background: rgba(28, 28, 28, .95);
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }
  .hdo-mini-header:active { cursor: grabbing; }
  .hdo-mini-title {
    font-size: 11px;
    font-weight: 600;
    color: #aaa;
  }
  .hdo-mini-header-btns {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .hdo-mini-header-btns button {
    background: none;
    border: none;
    color: #fff;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background .15s;
  }
  .hdo-mini-header-btns button:hover { background: rgba(255,255,255,.15); }
  .hdo-mini-header-btns button svg { width: 16px; height: 16px; }
  .hdo-mini-video-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    cursor: pointer;
  }

  /* Container query: scale controls for small player */
  @container hdo-controls (max-width: 280px) {
    .hdo-controls { padding: 6px 4px 4px; }
    .hdo-controls-bar { gap: 2px; margin-top: 2px; }
    .hdo-btn { width: 26px; height: 26px; }
    .hdo-btn svg { width: 16px; height: 16px; }
    .hdo-btn-label { font-size: 9px; margin-left: 1px; max-width: 28px; }
    .hdo-time { font-size: 10px; margin-left: 3px; }
    .hdo-bar-left,
    .hdo-bar-right { gap: 1px; }
    .hdo-progress { height: 18px; }
    .hdo-big-play { width: 44px; height: 44px; }
    .hdo-big-play svg { width: 22px; height: 22px; }
    .hdo-spinner { width: 36px; height: 36px; }
    .hdo-vol-slider { width: 32px; height: 80px; }
    .hdo-vol-input { height: 60px; }
    .hdo-yt-settings { top: 4px; right: 4px; }
    .hdo-yt-gear { width: 30px; height: 30px; margin: 4px 4px 0 0; }
    .hdo-yt-gear svg { width: 18px; height: 18px; }
    .hdo-yt-panel { right: 40px; width: 180px; top: 6px; }
  }
  @container hdo-controls (max-width: 200px) {
    .hdo-controls { padding: 4px 3px 3px; }
    .hdo-controls-bar { gap: 1px; margin-top: 1px; }
    .hdo-btn { width: 22px; height: 22px; border-radius: 4px; }
    .hdo-btn svg { width: 13px; height: 13px; }
    .hdo-btn-label { font-size: 8px; margin-left: 0; max-width: 22px; }
    .hdo-time { font-size: 9px; margin-left: 2px; }
    .hdo-progress { height: 14px; }
    .hdo-big-play { width: 36px; height: 36px; }
    .hdo-big-play svg { width: 18px; height: 18px; }
    .hdo-seek-ico svg { width: 16px; height: 16px; }
    .hdo-seek-text { font-size: 14px; min-width: 16px; }
    .hdo-spinner { width: 28px; height: 28px; }
    .hdo-vol-slider { width: 28px; height: 70px; }
    .hdo-vol-input { height: 50px; }
    .hdo-yt-settings { top: 2px; right: 2px; }
    .hdo-yt-gear { width: 26px; height: 26px; margin: 2px 2px 0 0; }
    .hdo-yt-gear svg { width: 15px; height: 15px; }
    .hdo-yt-panel { right: 34px; width: 160px; top: 4px; }
  }

  @media (max-width: 640px) {
    .hdo-big-play { width: 58px; height: 58px; }
    .hdo-btn { width: 32px; height: 32px; }
    .hdo-btn svg { width: 19px; height: 19px; }
    .hdo-time { font-size: 12px; }
    .hdo-seek-left { left: 8%; }
    .hdo-seek-right { right: 8%; }
    .hdo-controls-bar { gap: 3px; }
  }
  `;

  let styleEl = document.getElementById('hdo-player-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'hdo-player-style';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = CSS;

  global.HdoPlayer = HdoPlayer;
})(window);
