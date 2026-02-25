(function () {
  const AUDIO_ID = "fd-header-music-audio";
  const SOURCE_URL = "https://pixe1ran9e.oss-cn-hangzhou.aliyuncs.com/IfICanStopOneHeartFromBreaking.mp3";

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
      btn.textContent = "♪";
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
      });
    }

    syncButtons(audio);
  }

  function init(root) {
    unlockTabs(root);

    const audio = ensureAudio();
    ensureButton(root, audio);

    if (audio.dataset.bound !== "true") {
      audio.dataset.bound = "true";
      audio.addEventListener("play", function () {
        syncButtons(audio);
      });
      audio.addEventListener("pause", function () {
        syncButtons(audio);
      });
      audio.addEventListener("ended", function () {
        syncButtons(audio);
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
    document$.subscribe(function ({ body }) {
      init(body);
    });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      init(document);
    });
  }
})();
