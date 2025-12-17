// ---------- EDIT THESE LATER ----------
const artistBio = `
Kye Alfred Hillig is a songwriter from Tacoma, Washington, drawn to the city’s grand dysfunction and uninterested in seeing it cleaned up for comfort. The stories there are heartbreaking and endless, and it is where he returned after dropping out of art school in the early 2000s. He has spent years working in social services, close to the raw material of modern life, and his songs carry that weight without dressing it up.
<br>
It is hard to say exactly what his problem is, but something is always wrong. Maybe it is the daily proximity to other people’s crises. Maybe it is the stubborn grind of trying to make art inside a world that keeps asking you to be smaller. Maybe it is just the divine torture chamber of being alive right now. Whatever dog bit him still has its teeth in the music.
<br>
Over the last two decades Hillig has moved through the Puget Sound with a complete disregard for genre, serving as principal songwriter in bands like Destruction Island and Pistol For A Paycheck before stepping out as a solo artist in 2012. His new material sits in the overlap of indie rock, singer-songwriter, and alt-pop. The melodies are immediate, the hooks are sharp, and the point is always the same. Tell the truth, even when it is ugly. With his upcoming release, Hillig delivers his ninth solo album, spanked and screaming.
`;

const tracks = [
  {
    title: "The Horrible Truth",
    file: "audio/01 The Horrible Truth.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Ezekiel Bobbing For Apples",
    file: "audio/02 Ezekiel Bobbing For Apples.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Divorce of Course of Course",
    file: "audio/03 Divorce of Course of Course.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Don't Cancel The Fair",
    file: "audio/04 Don't Cancel The Fair.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "How Desperate We Are",
    file: "audio/05 How Desperate We Are.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Jules Can You See Me?",
    file: "audio/06 Jules Can You See Me__.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Something is Different",
    file: "audio/07 Something is Different.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Our Remaining Pig",
    file: "audio/08 Our Remaining Pig.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "The Mouth That Will Not Speak",
    file: "audio/09 The Mouth That Will Not Speak.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Pain",
    file: "audio/10 Pain.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "We Were Right ('Til We Were Wrong)",
    file: "audio/11 We Were Right ('Til We Were Wrong).mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
  {
    title: "Cut Off All Your Hair",
    file: "audio/12 Cut Off All Your Hair.mp3",
    notes: "(add track notes later)",
    lyrics: "(add lyrics later)",
    credits: "(add credits later)"
  },
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

function closeAllMenus() {
  document.querySelectorAll(".menu.open").forEach((m) => m.classList.remove("open"));
}

function closeAllDrawers(exceptDrawer = null) {
  document.querySelectorAll(".drawer.open").forEach((d) => {
    if (d !== exceptDrawer) d.classList.remove("open");
  });
  document.querySelectorAll(".caret").forEach((b) => {
    const li = b.closest(".track");
    const drawer = li ? li.querySelector(".drawer") : null;
    b.textContent = drawer && drawer.classList.contains("open") ? "˅" : "›";
  });
}

function renderDrawerContent(li, track, view) {
  const title = li.querySelector(".blocktitle");
  const pre = li.querySelector(".pre");

  if (view === "lyrics") {
    title.textContent = "Lyrics";
    pre.textContent = track.lyrics || "(no lyrics yet)";
    return;
  }

  if (view === "credits") {
    title.textContent = "Credits";
    pre.textContent = track.credits || "(no credits yet)";
    return;
  }

  title.textContent = "Track Notes";
  pre.textContent = track.notes || "(no notes yet)";
}

function toggleDrawer(li, track) {
  const drawer = li.querySelector(".drawer");
  const caretBtn = li.querySelector(".caret");
  const isOpen = drawer.classList.contains("open");

  closeAllMenus();
  closeAllDrawers(isOpen ? null : drawer);

  if (isOpen) {
    drawer.classList.remove("open");
    caretBtn.textContent = "›";
  } else {
    drawer.classList.add("open");
    caretBtn.textContent = "˅";
    renderDrawerContent(li, track, li.dataset.view || "notes");
  }
}

function buildList() {
  list.innerHTML = "";

  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.view = "notes";

    // Top row layout
    const top = document.createElement("div");
    top.className = "track-top";

    // Left: title button (plays)
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

    playBtn.addEventListener("click", () => {
      playIndex(i);
      // open drawer and show current view
      const drawer = li.querySelector(".drawer");
      drawer.classList.add("open");
      closeAllDrawers(drawer);
      li.querySelector(".caret").textContent = "˅";
      renderDrawerContent(li, t, li.dataset.view || "notes");
    });

    left.appendChild(playBtn);

    // Right: Download + caret
    const actions = document.createElement("div");
    actions.className = "track-actions";

    const download = document.createElement("a");
    download.href = urlFor(t.file);
    download.setAttribute("download", "");
    download.textContent = "Download";
    download.className = "downloadbtn";
    download.addEventListener("click", (e) => e.stopPropagation());

    const caret = document.createElement("button");
    caret.type = "button";
    caret.className = "iconbtn caret";
    caret.textContent = "›";
    caret.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDrawer(li, t);
    });

    actions.appendChild(download);
    actions.appendChild(caret);

    top.appendChild(left);
    top.appendChild(actions);

    // Drawer
    const drawer = document.createElement("div");
    drawer.className = "drawer";

    const drawerbar = document.createElement("div");
    drawerbar.className = "drawerbar";

    const hint = document.createElement("div");
    hint.className = "muted tiny";
    hint.textContent = "View";

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    const dropbtn = document.createElement("button");
    dropbtn.type = "button";
    dropbtn.className = "iconbtn dropbtn";
    dropbtn.innerHTML = `<span class="currentView">Track Notes</span><span aria-hidden="true">▾</span>`;
    dropbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
      menu.classList.toggle("open");
    });

    const menu = document.createElement("div");
    menu.className = "menu";

    function setView(key, label) {
      li.dataset.view = key;
      dropbtn.querySelector(".currentView").textContent = label;
      menu.classList.remove("open");
      renderDrawerContent(li, t, key);
    }

    function mkItem(label, key) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        setView(key, label);
      });
      return b;
    }

    menu.appendChild(mkItem("Track Notes", "notes"));
    menu.appendChild(mkItem("Lyrics", "lyrics"));
    menu.appendChild(mkItem("Credits", "credits"));

    dropdown.appendChild(dropbtn);
    dropdown.appendChild(menu);

    drawerbar.appendChild(hint);
    drawerbar.appendChild(dropdown);

    const content = document.createElement("div");
    content.className = "drawercontent";

    const blocktitle = document.createElement("div");
    blocktitle.className = "blocktitle";
    blocktitle.textContent = "Track Notes";

    const pre = document.createElement("p");
    pre.className = "pre";
    pre.textContent = t.notes || "(no notes yet)";

    content.appendChild(blocktitle);
    content.appendChild(pre);

    drawer.appendChild(drawerbar);
    drawer.appendChild(content);

    li.appendChild(top);
    li.appendChild(drawer);

    list.appendChild(li);
  });

  document.addEventListener("click", () => closeAllMenus());
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

// Artist bio modal wiring
const bioBtn = document.getElementById("bioBtn");
const bioModal = document.getElementById("bioModal");
const bioCloseBtn = document.getElementById("bioCloseBtn");
const bioBody = document.getElementById("bioBody");

function openBio() {
  if (!bioModal) return;
  bioBody.textContent = artistBio || "(no bio yet)";
  bioModal.classList.add("open");
  bioModal.setAttribute("aria-hidden", "false");
  bioCloseBtn?.focus();
}

function closeBio() {
  if (!bioModal) return;
  bioModal.classList.remove("open");
  bioModal.setAttribute("aria-hidden", "true");
  bioBtn?.focus();
}

if (bioBtn && bioModal) {
  bioBtn.addEventListener("click", openBio);
  bioCloseBtn?.addEventListener("click", closeBio);

  bioModal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close === "1") closeBio();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bioModal.classList.contains("open")) closeBio();
  });
}

buildList();
setPlayButtonLabel();
setNowPlaying();
