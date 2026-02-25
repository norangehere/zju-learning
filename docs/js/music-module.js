function initMusicModule(root) {
  const host = root.querySelector("#fd-music-module");
  if (!host || host.dataset.initialized === "true") return;
  host.dataset.initialized = "true";

  const handle = host.querySelector("#fd-music-handle");
  const audio = host.querySelector("#fd-music-audio");
  const playBtn = host.querySelector("#fd-music-play");
  const progress = host.querySelector("#fd-music-progress");
  const volume = host.querySelector("#fd-music-volume");
  const time = host.querySelector("#fd-music-time");

  if (!handle || !audio || !playBtn || !progress || !volume || !time) return;

  const lsKeyCollapse = "fd_music_collapsed";
  const lsKeyVolume = "fd_music_volume";

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function refreshTime() {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
    time.textContent = formatTime(cur) + " / " + formatTime(dur);
    if (dur > 0) {
      progress.value = String((cur / dur) * 100);
    } else {
      progress.value = "0";
    }
  }

  function setCollapsed(collapsed) {
    host.classList.toggle("is-collapsed", collapsed);
    handle.setAttribute("aria-expanded", String(!collapsed));
    handle.textContent = collapsed ? "Music" : "Music -";
    localStorage.setItem(lsKeyCollapse, collapsed ? "1" : "0");
  }

  const savedVolume = localStorage.getItem(lsKeyVolume);
  if (savedVolume !== null) {
    const volumeValue = Math.min(1, Math.max(0, Number(savedVolume)));
    if (Number.isFinite(volumeValue)) {
      audio.volume = volumeValue;
      volume.value = String(volumeValue);
    }
  } else {
    audio.volume = Number(volume.value);
  }

  setCollapsed(localStorage.getItem(lsKeyCollapse) !== "0");

  handle.addEventListener("click", function () {
    setCollapsed(!host.classList.contains("is-collapsed"));
  });

  playBtn.addEventListener("click", async function () {
    try {
      if (audio.paused) {
        await audio.play();
        playBtn.textContent = "Pause";
      } else {
        audio.pause();
        playBtn.textContent = "Play";
      }
    } catch (e) {
      playBtn.textContent = "Play";
    }
  });

  audio.addEventListener("play", function () {
    playBtn.textContent = "Pause";
  });

  audio.addEventListener("pause", function () {
    playBtn.textContent = "Play";
  });

  audio.addEventListener("timeupdate", refreshTime);
  audio.addEventListener("loadedmetadata", refreshTime);
  audio.addEventListener("ended", refreshTime);

  progress.addEventListener("input", function () {
    if (!audio.duration || !Number.isFinite(audio.duration)) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    refreshTime();
  });

  volume.addEventListener("input", function () {
    const v = Math.min(1, Math.max(0, Number(volume.value)));
    audio.volume = v;
    localStorage.setItem(lsKeyVolume, String(v));
  });

  refreshTime();
}

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(function ({ body }) {
    initMusicModule(body);
  });
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initMusicModule(document);
  });
}
