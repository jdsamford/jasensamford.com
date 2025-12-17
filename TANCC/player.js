// ---------- EDIT THESE LATER ----------
const artistBio = `
Kye Alfred Hillig is a songwriter from Tacoma, Washington, drawn to the city’s grand dysfunction and uninterested in seeing it cleaned up for comfort. The stories there are heartbreaking and endless, and it is where he returned after dropping out of art school in the early 2000s. He has spent years working in social services, close to the raw material of modern life, and his songs carry that weight without dressing it up.

It is hard to say exactly what his problem is, but something is always wrong. Maybe it is the daily proximity to other people’s crises. Maybe it is the stubborn grind of trying to make art inside a world that keeps asking you to be smaller. Maybe it is just the divine torture chamber of being alive right now. Whatever dog bit him still has its teeth in the music.

Over the last two decades Hillig has moved through the Puget Sound with a complete disregard for genre, serving as principal songwriter in bands like Destruction Island and Pistol For A Paycheck before stepping out as a solo artist in 2012. His new material sits in the overlap of indie rock, singer-songwriter, and alt-pop. The melodies are immediate, the hooks are sharp, and the point is always the same. Tell the truth, even when it is ugly. With his upcoming release, Hillig delivers his ninth solo album, spanked and screaming.
`;

const tracks = [
  { title: "The Horrible Truth", file: "audio/01 The Horrible Truth.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Ezekiel Bobbing For Apples", file: "audio/02 Ezekiel Bobbing For Apples.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Divorce of Course of Course", file: "audio/03 Divorce of Course of Course.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Don't Cancel The Fair", file: "audio/04 Don't Cancel The Fair.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "How Desperate We Are", file: "audio/05 How Desperate We Are.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Jules Can You See Me?", file: "audio/06 Jules Can You See Me__.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Something is Different", file: "audio/07 Something is Different.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Our Remaining Pig", file: "audio/08 Our Remaining Pig.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "The Mouth That Will Not Speak", file: "audio/09 The Mouth That Will Not Speak.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Pain", file: "audio/10 Pain.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "We Were Right ('Til We Were Wrong)", file: "audio/11 We Were Right ('Til We Were Wrong).mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
  { title: "Cut Off All Your Hair", file: "audio/12 Cut Off All Your Hair.mp3", notes: "(add notes later)", lyrics: "(add lyrics later)", credits: "(add credits later)" },
];
// -------------------------------------

const audio = document.getElementById("audio");
const list = document.getElementById("trackList");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const nowPlaying = document.getElementById("nowPlaying");

let currentIndex = -1;

function urlFor(path) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function setPlayButtonLabel() {
  if (!playPauseBtn) return;
  playPauseBtn.textContent = audio.paused ? "Play" : "Pause";
}

function setNowPlaying() {
  if (!nowPlaying) return;
  nowPlaying.textContent = currentIndex >= 0 ? `Now playing: ${tracks[currentIndex].title}` : "";
}

function setPlayingHighlight(index) {
  [...list.querySelectorAll(".track")].forEach((el, i) => {
    el.classList.toggle("playing", i === index);
  });
}

function playIndex(index) {
  const t = tracks[index];
  if (!t) return;

  currentIndex = index;
  audio.src = urlFor(t.file);
  audio.play().catch(() => {});
  setNowPlaying();
  setPlayingHighlight(index);
  setPlayButtonLabel();
}

function playNext() {
  if (currentIndex < 0) return playIndex(0);
  const next = currentIndex + 1;
  if (next < tracks.length) playIndex(next);
}

function playPrev() {
  if (currentIndex < 0) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = currentIndex - 1;
  if (prev >= 0) playIndex(prev);
}

function togglePlayPause() {
  if (currentIndex < 0) return playIndex(0);
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

// ----- Track modal -----
const trackModal = document.getElementById("trackModal");
const trackModalKicker = document.getElementById("trackModalKicker");
const trackModalTitle = document.getElementById("trackModalTitle");
const trackModalBody = document.getElementById("trackModalBody");
const trackModalCloseBtn = document.getElementById("trackModalCloseBtn");

let lastFocusEl = null;

function openTrackModal(trackTitle, sectionLabel, bodyText) {
  lastFocusEl = document.activeElement;

  trackModalKicker.textContent = sectionLabel;
  trackModalTitle.textContent = trackTitle;
  trackModalBody.textContent = bodyText || "(empty)";

  trackModal.classList.add("open");
  trackModal.setAttribute("aria-hidden", "false");
  trackModalCloseBtn?.focus();
}

function closeTrackModal() {
  trackModal.classList.remove("open");
  trackModal.setAttribute("aria-hidden", "true");
  if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
}

trackModal?.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "1") closeTrackModal();
});
trackModalCloseBtn?.addEventListener("click", closeTrackModal);

// ----- Artist bio modal -----
const bioBtn = document.getElementById("bioBtn");
const bioModal = document.getElementById("bioModal");
const bioCloseBtn = document.getElementById("bioCloseBtn");
const bioBody = document.getElementById("bioBody");

function openBio() {
  lastFocusEl = document.activeElement;
  bioBody.textContent = artistBio || "(no bio yet)";
  bioModal.classList.add("open");
  bioModal.setAttribute("aria-hidden", "false");
  bioCloseBtn?.focus();
}

function closeBio() {
  bioModal.classList.remove("open");
  bioModal.setAttribute("aria-hidden", "true");
  if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
}

bioBtn?.addEventListener("click", openBio);
bioModal?.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "1") closeBio();
});
bioCloseBtn?.addEventListener("click", closeBio);

// global esc closes whichever modal is open
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (trackModal?.classList.contains("open")) closeTrackModal();
  if (bioModal?.classList.contains("open")) closeBio();
});

// ----- Per-track menu rows -----
function closeAllMenus(except = null) {
  document.querySelectorAll(".navrow.open").forEach((row) => {
    if (row !== except) row.classList.remove("open");
  });
  document.querySelectorAll(".menubtn").forEach((b) => {
    const li = b.closest(".track");
    const row = li ? li.querySelector(".navrow") : null;
    b.setAttribute("aria-expanded", row && row.classList.contains("open") ? "true" : "false");
    b.textContent = row && row.classList.contains("open") ? "✕" : "≡";
  });
}

document.addEventListener("click", () => closeAllMenus());

function buildList() {
  list.innerHTML = "";

  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";

    // Row
    const top = document.createElement("div");
    top.className = "track-top";

    // Left: play button
    const left = document.createElement("div");
    const playBtn = document.createElement("button");
    playBtn.type = "button";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = `${String(i + 1).padStart(2, "0")}. ${t.title}`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = "click to play";

    playBtn.appendChild(name);
    playBtn.appendChild(meta);

    playBtn.addEventListener("click", () => playIndex(i));

    left.appendChild(playBtn);

    // Right: download + menu icon
    const actions = document.createElement("div");
    actions.className = "track-actions";

    const download = document.createElement("a");
    download.href = urlFor(t.file);
    download.setAttribute("download", "");
    download.textContent = "Download";
    download.className = "downloadbtn";
    download.addEventListener("click", (e) => e.stopPropagation());

    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "iconbtn menubtn";
    menuBtn.textContent = "≡";
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open track menu");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const row = li.querySelector(".navrow");
      const willOpen = !row.classList.contains("open");
      closeAllMenus(willOpen ? row : null);
      if (willOpen) row.classList.add("open");
      closeAllMenus(willOpen ? row : null); // ensures icon state updates
    });

    actions.appendChild(download);
    actions.appendChild(menuBtn);

    top.appendChild(left);
    top.appendChild(actions);

    // Nav row (buttons)
    const navrow = document.createElement("div");
    navrow.className = "navrow";
    navrow.addEventListener("click", (e) => e.stopPropagation());

    const mkNav = (label, sectionKey) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "navchip";
      b.textContent = label;

      b.addEventListener("click", () => {
        const body =
          sectionKey === "lyrics" ? t.lyrics :
          sectionKey === "credits" ? t.credits :
          t.notes;

        openTrackModal(t.title, label, body);
      });

      return b;
    };

    navrow.appendChild(mkNav("Lyrics", "lyrics"));
    navrow.appendChild(mkNav("Credits", "credits"));
    navrow.appendChild(mkNav("Notes", "notes"));

    li.appendChild(top);
    li.appendChild(navrow);

    list.appendChild(li);
  });

  // set initial icon states
  closeAllMenus();
}

prevBtn?.addEventListener("click", playPrev);
nextBtn?.addEventListener("click", playNext);
playPauseBtn?.addEventListener("click", togglePlayPause);

audio.addEventListener("play", setPlayButtonLabel);
audio.addEventListener("pause", setPlayButtonLabel);
audio.addEventListener("ended", () => {
  const next = currentIndex + 1;
  if (next < tracks.length) playIndex(next);
  else setPlayButtonLabel();
});

buildList();
setPlayButtonLabel();
setNowPlaying();
