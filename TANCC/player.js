(() => {
  // GATE
  if (!window.TANCCAuth || !window.TANCCAuth.isAuthed()) {
    location.replace("./login.html");
    return;
  }

  // Clean URL (hide player.html)
  try {
    if (location.pathname.endsWith("/player.html")) {
      history.replaceState(null, "", "./" + location.search + location.hash);
    }
  } catch {}

  // CONFIG
  const ZIP_URL = "https://github.com/jdsamford/jasensamford.com/releases/download/tancc-zip-v1/KAH-TANCC.zip";

  const CREDITS_ALL = [
    "Kye Alfred Hillig: vocals, guitar",
    "Yoswa Grimgold: bass",
    "David Bilbrey: guitar",
    "Bill Nordwall: piano, organ",
    "Jasen Samford: drums, percussion",
    "Recorded and mixed by Ryan Leyva at ExEx Audio",
    "Mastered by Rachel Field at Resonant Mastering",
    "All music and lyrics by Kye Alfred Hillig"
  ].join("\n");

  const CREDITS_EXTRA_BY_TITLE = {
    "Ezekiel Bobbing For Apples": ["Annie Jantzer: background vocals"],
    "Don't Cancel The Fair": ["Annie Jantzer: background vocals"],
    "Jules Can You See Me?": ["Annie Jantzer: background vocals"],
    "Something is Different": ["Annie Jantzer: background vocals"],
    "The Mouth That Will Not Speak": ["Annie Jantzer: background vocals"],
  };

  // Insert Annie’s credit after Kye’s line
function creditsForTitle(title) {
  const extra = CREDITS_EXTRA_BY_TITLE[title] || [];
  if (!extra.length) return CREDITS_ALL;

  const lines = CREDITS_ALL.split("\n");
  const head = lines.slice(0, 1); // Kye line
  const tail = lines.slice(1);    // everyone else
  return [...head, ...extra, ...tail].join("\n");
}

  // NOTES
  const NOTES_BY_TITLE = {
    // Example:
    // "Pain": "This one was written after...\n\nSecond paragraph here."
  };

  const NOTES_PLACEHOLDER = "Track notes go here.\n\nReplace this placeholder later.";

  // TRACKS
  const tracks = [
    { n: 1, title: "The Horrible Truth", file: "01 The Horrible Truth.mp3" },
    { n: 2, title: "Ezekiel Bobbing For Apples", file: "02 Ezekiel Bobbing For Apples.mp3" },
    { n: 3, title: "Divorce of Course of Course", file: "03 Divorce of Course of Course.mp3" },
    { n: 4, title: "Don't Cancel The Fair", file: "04 Don't Cancel The Fair.mp3" },
    { n: 5, title: "How Desperate We Are", file: "05 How Desperate We Are.mp3" },
    { n: 6, title: "Jules Can You See Me?", file: "06 Jules Can You See Me_.mp3" },
    { n: 7, title: "Something is Different", file: "07 Something is Different.mp3" },
    { n: 8, title: "Our Remaining Pig", file: "08 Our Remaining Pig.mp3" },
    { n: 9, title: "The Mouth That Will Not Speak", file: "09 The Mouth That Will Not Speak.mp3" },
    { n: 10, title: "Pain", file: "10 Pain.mp3" },
    { n: 11, title: "We Were Right ('Til We Were Wrong)", file: "11 We Were Right ('Til We Were Wrong).mp3" },
    { n: 12, title: "Cut Off All Your Hair", file: "12 Cut Off All Your Hair.mp3" }
  ];

  // LYRICS
  const lyricsByTitle = {
    // trimmed for brevity — keep your full set here exactly as before
    "The Horrible Truth": `Ran some errands

Made a friend call back,
But we never made love today
Never said goodbye to my old friend Matt
He went to bed,
But he couldn’t awake

Hold the door
Hold my whole damn life
I guess it was never really mine
God forgave, but he never gave back
The paint flaking off with time

You can’t escape it, dear
So I might as well confess to you
What’s so hard to hear
All this horrible truth`,
  };

  // HELPERS
  const $ = (sel) => document.querySelector(sel);
  const list = $("#trackList");
  const audio = $("#audio");
  const nowPlaying = $("#nowPlaying");
  const playBtn = $("#playPauseBtn");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const zipBtn = $("#zipBtn");

  if (zipBtn) zipBtn.href = ZIP_URL;

  $("#logoutBtn")?.addEventListener("click", () => {
    window.TANCCAuth.logout();
    location.replace("./login.html");
  });

  // MODALS
  const trackModal = $("#trackModal");
  const trackModalKicker = $("#trackModalKicker");
  const trackModalTitle = $("#trackModalTitle");
  const trackModalBody = $("#trackModalBody");
  const trackModalCloseBtn = $("#trackModalCloseBtn");
  const bioModal = $("#bioModal");
  const bioCloseBtn = $("#bioCloseBtn");

  function openModal(modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => modal.querySelector("button")?.focus(), 0);
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function openTrackModal(kind, title, body) {
    trackModalKicker.textContent = kind;
    trackModalTitle.textContent = title;
    trackModalBody.textContent = body;
    openModal(trackModal);
  }

  trackModalCloseBtn?.addEventListener("click", () => closeModal(trackModal));
  bioCloseBtn?.addEventListener("click", () => closeModal(bioModal));
  $("#bioBtn")?.addEventListener("click", () => openModal(bioModal));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (trackModal.classList.contains("open")) closeModal(trackModal);
      if (bioModal.classList.contains("open")) closeModal(bioModal);
    }
    if (!document.body.classList.contains("modal-open")) {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        playBtn.click();
      }
      if (e.key === "ArrowRight") nextBtn.click();
      if (e.key === "ArrowLeft") prevBtn.click();
    }
  });

  // AUDIO + PLAYBACK
  function fileUrl(file) {
    return "./audio/" + encodeURIComponent(file);
  }

  let currentIndex = 0;

  function ensureSrc(idx) {
    if (!audio) return;
    if (audio.dataset.srcIndex === String(idx) && audio.src) return;
    audio.src = fileUrl(tracks[idx].file);
    audio.dataset.srcIndex = String(idx);
  }

  function isPlaying() {
    return audio && !audio.paused && !audio.ended;
  }

  function updateNowPlaying() {
    const t = tracks[currentIndex];
    nowPlaying.textContent = (isPlaying() ? "Now playing: " : "Ready: ") + `${String(t.n).padStart(2,"0")}. ${t.title}`;
  }

  function highlightActive() {
    document.querySelectorAll(".track-row").forEach((r) => {
      r.classList.toggle("active", Number(r.dataset.index) === currentIndex);
    });
  }

  function setCurrent(idx, autoplay) {
    currentIndex = idx;
    highlightActive();
    updateNowPlaying();
    if (autoplay) {
      ensureSrc(idx);
      audio.play().catch(()=>{});
    }
  }

  prevBtn?.addEventListener("click", () => setCurrent(Math.max(0, currentIndex - 1), isPlaying()));
  nextBtn?.addEventListener("click", () => setCurrent(Math.min(tracks.length - 1, currentIndex + 1), isPlaying()));
  playBtn?.addEventListener("click", () => {
    ensureSrc(currentIndex);
    if (isPlaying()) audio.pause(); else audio.play().catch(()=>{});
  });

  audio?.addEventListener("play", () => { playBtn.textContent = "Pause"; updateNowPlaying(); });
  audio?.addEventListener("pause", () => { playBtn.textContent = "Play"; updateNowPlaying(); });
  audio?.addEventListener("ended", () => {
    const next = Math.min(tracks.length - 1, currentIndex + 1);
    if (next !== currentIndex) setCurrent(next, true);
  });

  // DRAWERS
  function closeAllDrawers(except) {
    document.querySelectorAll(".track-row").forEach((r) => {
      if (r === except) return;
      r.classList.remove("open");
      const c = r.querySelector(".caret");
      if (c) c.textContent = "▾";
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".track-row")) closeAllDrawers();
  });

  // DOWNLOAD
  function downloadFile(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // RENDER
  function render() {
    if (!list) return;
    list.innerHTML = "";

    tracks.forEach((t, idx) => {
      const row = document.createElement("li");
      row.className = "track-row";
      row.dataset.index = idx;

      const left = document.createElement("button");
      left.className = "track-main";
      left.innerHTML = `
        <div class="track-title">
          <span class="track-num">${String(t.n).padStart(2,"0")}.</span>
          <span>${escapeHtml(t.title)}</span>
        </div>
        <div class="track-sub muted">click to play</div>`;
      left.addEventListener("click", () => setCurrent(idx, true));

      const caretBtn = document.createElement("button");
      caretBtn.className = "caret-btn";
      caretBtn.innerHTML = `<span class="caret">▾</span>`;
      caretBtn.addEventListener("click", () => {
        const willOpen = !row.classList.contains("open");
        closeAllDrawers(willOpen ? row : null);
        row.classList.toggle("open");
        caretBtn.querySelector(".caret").textContent = row.classList.contains("open") ? "▴" : "▾";
      });

      const drawer = document.createElement("div");
      drawer.className = "drawer";
      drawer.innerHTML = `
        <div class="drawer-buttons">
          <button class="action-btn" data-action="lyrics">Lyrics</button>
          <button class="action-btn" data-action="credits">Credits</button>
          <button class="action-btn" data-action="notes">Notes</button>
          <button class="action-btn action-download" data-action="download">Download track</button>
        </div>`;

      drawer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === "download") return downloadFile(fileUrl(t.file), t.file);
        closeAllDrawers();

        if (action === "credits") openTrackModal("Credits", `${t.n.toString().padStart(2,"0")}. ${t.title}`, creditsForTitle(t.title));
        if (action === "notes") openTrackModal("Notes", `${t.n.toString().padStart(2,"0")}. ${t.title}`, NOTES_BY_TITLE[t.title] || NOTES_PLACEHOLDER);
        if (action === "lyrics") openTrackModal("Lyrics", `${t.n.toString().padStart(2,"0")}. ${t.title}`, lyricsByTitle[t.title] || "Lyrics go here.");
      });

      const right = document.createElement("div");
      right.className = "track-actions";
      right.appendChild(caretBtn);

      row.appendChild(left);
      row.appendChild(right);
      row.appendChild(drawer);
      list.appendChild(row);
    });

    highlightActive();
    updateNowPlaying();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  render();
})();
