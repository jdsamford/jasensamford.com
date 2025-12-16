const tracks = [
  { title: "The Horrible Truth", file: "audio/01 The Horrible Truth.mp3" },
  { title: "Ezekiel Bobbing For Apples", file: "audio/02 Ezekiel Bobbing For Apples.mp3" },
  { title: "Divorce of Course of Course", file: "audio/03 Divorce of Course of Course.mp3" },
  { title: "Don't Cancel The Fair", file: "audio/04 Don't Cancel The Fair.mp3" },
  { title: "How Desperate We Are", file: "audio/05 How Desperate We Are.mp3" },
  { title: "Jules Can You See Me?", file: "audio/06 Jules Can You See Me__.mp3" },
  { title: "Something is Different", file: "audio/07 Something is Different.mp3" },
  { title: "Our Remaining Pig", file: "audio/08 Our Remaining Pig.mp3" },
  { title: "The Mouth That Will Not Speak", file: "audio/09 The Mouth That Will Not Speak.mp3" },
  { title: "Pain", file: "audio/10 Pain.mp3" },
  { title: "We Were Right ('Til We Were Wrong)", file: "audio/11 We Were Right ('Til We Were Wrong).mp3" },
  { title: "Cut Off All Your Hair", file: "audio/12 Cut Off All Your Hair.mp3" },
];

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

function setPlaying(index) {
  currentIndex = index;

  [...list.querySelectorAll(".track")].forEach((el, i) => {
    el.classList.toggle("playing", i === index);
  });

  if (index >= 0) {
    nowPlaying.textContent = `Now playing: ${tracks[index].title}`;
  } else {
    nowPlaying.textContent = "";
  }
}

function setPlayButtonLabel() {
  playPauseBtn.textContent = audio.paused ? "Play" : "Pause";
}

function playIndex(index) {
  const t = tracks[index];
  if (!t) return;

  audio.src = urlFor(t.file);
  audio.play().catch(() => {});
  setPlaying(index);
  setPlayButtonLabel();
}

function playNext() {
  if (currentIndex < 0) return playIndex(0);
  const next = currentIndex + 1;
  if (next < tracks.length) playIndex(next);
}

function playPrev() {
  if (currentIndex < 0) return;

  // If you're more than 3s in, "Back" restarts the current track
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  const prev = currentIndex - 1;
  if (prev >= 0) playIndex(prev);
}

function togglePlayPause() {
  // If nothing has been played yet, start at track 1
  if (currentIndex < 0) return playIndex(0);

  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function buildList() {
  list.innerHTML = "";

  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track";

    const left = document.createElement("div");
    const btn = document.createElement("button");
    btn.type = "button";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = `${String(i + 1).padStart(2, "0")}. ${t.title}`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = "click to play";

    btn.appendChild(name);
    btn.appendChild(meta);
    btn.addEventListener("click", () => playIndex(i));
    left.appendChild(btn);

    const right = document.createElement("div");
    right.style.textAlign = "right";

    const a = document.createElement("a");
    a.href = urlFor(t.file);
    a.setAttribute("download", "");
    a.textContent = "Download";
    right.appendChild(a);

    li.appendChild(left);
    li.appendChild(right);
    list.appendChild(li);
  });
}

prevBtn.addEventListener("click", playPrev);
nextBtn.addEventListener("click", playNext);
playPauseBtn.addEventListener("click", togglePlayPause);

audio.addEventListener("play", setPlayButtonLabel);
audio.addEventListener("pause", setPlayButtonLabel);

audio.addEventListener("ended", () => {
  const next = currentIndex + 1;
  if (next < tracks.length) playIndex(next);
  else setPlayButtonLabel();
});

buildList();
setPlayButtonLabel();
