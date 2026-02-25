(function () {
  const AUDIO_ID = "fd-header-music-audio";
  const SOURCE_URL = "https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/IfICanStopOneHeartFromBreaking.mp3";
  const STATE_KEY = "fd_header_music_state_v1";

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return null;
      const state = JSON.parse(raw);
      if (!state || state.src !== SOURCE_URL) return null;
      return state;
    } catch (e) {
      return null;
    }
  }

  function saveState(audio) {
    try {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({
          src: SOURCE_URL,
          wanted: !!window.__fdMusicWanted,
          currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
          updatedAt: Date.now()
        })
      );
    } catch (e) {
      // Ignore storage errors.
    }
  }

  function restoreTime(audio, state) {
    if (!state || !Number.isFinite(state.currentTime) || state.currentTime <= 0) return;

    const applyTime = function () {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = Math.min(state.currentTime, Math.max(0, audio.duration - 0.25));
    };

    if (audio.readyState >= 1) {
      applyTime();
    } else {
      audio.addEventListener("loadedmetadata", applyTime, { once: true });
    }
  }

  if (typeof window.__fdMusicWanted !== "boolean") {
    window.__fdMusicWanted = true;
  }

  function unlockTabs(root) {
    const tabs = root.querySelector('[data-md-component="tabs"]');
    if (!tabs) return;

    tabs.removeAttribute("hidden");
    tabs.style.pointerEvents = "auto";

    tabs.querySelectorAll(".md-tabs__list, .md-tabs__link").forEach(function (el) {
      el.style.pointerEvents = "auto";
    });
  }

  function ensureAudio() {
    let audio = document.getElementById(AUDIO_ID);
    if (audio) return audio;

    audio = document.createElement("audio");
    audio.id = AUDIO_ID;
    audio.loop = true;
    audio.preload = "auto";
    audio.style.display = "none";

    const source = document.createElement("source");
    source.src = SOURCE_URL;
    source.type = "audio/mpeg";
    audio.appendChild(source);

    document.body.appendChild(audio);
    return audio;
  }

  function syncButtons(audio) {
    const playing = !audio.paused;
    document.querySelectorAll(".fd-header-music-btn").forEach(function (btn) {
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      btn.title = playing ? "Pause music" : "Play music";
    });
  }

  function ensureButton(root, audio) {
    const palette = root.querySelector('[data-md-component="palette"]');
    if (!palette || !palette.parentElement) return;

    const parent = palette.parentElement;
    let host = parent.querySelector(".fd-header-music");
    let btn;

    if (!host) {
      host = document.createElement("div");
      host.className = "fd-header-music";
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fd-header-music-btn";
      btn.innerHTML = "&#9835;";
      host.appendChild(btn);
      parent.insertBefore(host, palette);
    } else {
      btn = host.querySelector(".fd-header-music-btn");
    }

    if (btn && btn.dataset.bound !== "true") {
      btn.dataset.bound = "true";
      btn.addEventListener("click", function () {
        if (audio.paused) {
          window.__fdMusicWanted = true;
          audio.play().catch(function () {
            syncButtons(audio);
          });
        } else {
          window.__fdMusicWanted = false;
          audio.pause();
        }
        saveState(audio);
      });
    }

    syncButtons(audio);
  }

  function init(root) {
    unlockTabs(root);

    const state = loadState();
    if (state && typeof state.wanted === "boolean") {
      window.__fdMusicWanted = state.wanted;
    }

    const audio = ensureAudio();
    if (audio.dataset.restored !== "true") {
      restoreTime(audio, state);
      audio.dataset.restored = "true";
    }

    ensureButton(root, audio);

    if (audio.dataset.bound !== "true") {
      audio.dataset.bound = "true";
      audio.addEventListener("play", function () {
        syncButtons(audio);
        saveState(audio);
      });
      audio.addEventListener("pause", function () {
        syncButtons(audio);
        saveState(audio);
      });
      audio.addEventListener("ended", function () {
        syncButtons(audio);
        saveState(audio);
      });
      audio.addEventListener("timeupdate", function () {
        saveState(audio);
      });
    }

    if (window.__fdMusicWindowBound !== "true") {
      window.__fdMusicWindowBound = "true";
      const flush = function () {
        saveState(audio);
      };
      window.addEventListener("pagehide", flush);
      window.addEventListener("beforeunload", flush);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") flush();
      });
    }

    if (window.__fdMusicWanted && audio.paused) {
      audio.play().catch(function () {
        syncButtons(audio);
      });
    }

    if (!window.__fdMusicWanted && !audio.paused) {
      audio.pause();
    }

    syncButtons(audio);
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(function (_payload) {
      init(document);
    });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  }
})();