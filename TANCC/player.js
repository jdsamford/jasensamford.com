(() => {
  // Gate
  if (!window.TANCCAuth || !window.TANCCAuth.isAuthed()) {
    location.replace("./login.html");
    return;
  }

  // Clean URL (hide /index.html if someone lands there directly)
  try {
    if (location.pathname.endsWith("/index.html")) {
      history.replaceState(null, "", "./" + location.search + location.hash);
    }
  } catch {}

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

  // Per-track extra credits
  const CREDITS_EXTRA_BY_TITLE = {
    "Ezekiel Bobbing For Apples": ["Annie Jantzer: background vocals"],
    "Don't Cancel The Fair": ["Annie Jantzer: background vocals"],
    "Jules Can You See Me?": ["Annie Jantzer: background vocals"],
    "Something is Different": ["Annie Jantzer: background vocals"],
    "The Mouth That Will Not Speak": ["Annie Jantzer: background vocals"]
  };

  // Insert Annie (and any other extras) directly after Kye
  function creditsForTitle(title) {
    const extra = CREDITS_EXTRA_BY_TITLE[title] || [];
    if (!extra.length) return CREDITS_ALL;

    const lines = CREDITS_ALL.split("\n");
    const head = lines.slice(0, 1); // Kye line
    const tail = lines.slice(1);
    return [...head, ...extra, ...tail].join("\n");
  }

  // Notes (paste Kye's per-track notes here later)
  // Keys must match the track titles exactly.
  const NOTES_BY_TITLE = {
    "The  Truth": "",
    "Ezekiel Bobbing For Apples": "",
    "Divorce of Course of Course": "",
    "Don't Cancel The Fair": "",
    "How Desperate We Are": "",
    "Jules Can You See Me?": "",
    "Something is Different": "",
    "Our Remaining Pig": "",
    "The Mouth That Will Not Speak": "",
    "Pain": "",
    "We Were Right ('Til We Were Wrong)": "",
    "Cut Off All Your Hair": ""
  };

  const NOTES_PLACEHOLDER = "No notes yet.";

  const tracks = [
    { n: 1,  title: "The Horrible Truth", file: "01 The Horrible Truth.mp3" },
    { n: 2,  title: "Ezekiel Bobbing For Apples", file: "02 Ezekiel Bobbing For Apples.mp3" },
    { n: 3,  title: "Divorce of Course of Course", file: "03 Divorce of Course of Course.mp3" },
    { n: 4,  title: "Don't Cancel The Fair", file: "04 Don't Cancel The Fair.mp3" },
    { n: 5,  title: "How Desperate We Are", file: "05 How Desperate We Are.mp3" },
    { n: 6,  title: "Jules Can You See Me?", file: "06 Jules Can You See Me_.mp3" },
    { n: 7,  title: "Something is Different", file: "07 Something is Different.mp3" },
    { n: 8,  title: "Our Remaining Pig", file: "08 Our Remaining Pig.mp3" },
    { n: 9,  title: "The Mouth That Will Not Speak", file: "09 The Mouth That Will Not Speak.mp3" },
    { n: 10, title: "Pain", file: "10 Pain.mp3" },
    { n: 11, title: "We Were Right ('Til We Were Wrong)", file: "11 We Were Right ('Til We Were Wrong).mp3" },
    { n: 12, title: "Cut Off All Your Hair", file: "12 Cut Off All Your Hair.mp3" }
  ];

  const lyricsByTitle = {
    "The Horrible Truth":
`Ran some errands
Made a friend call back
But we never made love today
Never said goodbye to my old friend Matt
He went to bed
But he couldn’t wake

Hold the door
Hold my whole damn life
I guess it was never really mine
God forgave, but he never gave back
The paint flaking off with time

You can’t escape it, dear
So I might as well confess to you
What’s so hard to hear
All this horrible truth

Down to the cellar
Fill the washing machine
But I never got out your stains
What’s the point of laundry if it never comes clean?
Or a love that’s dying and grey?

It’s the hope that makes you feel foolish
The stupid way I chased you around
All the wasted days I tried so hard to prove it
Like the lost could ever be found

You can’t escape it, dear
So I might as well confess to you
What’s so hard to hear
All this horrible truth

Stepping out
Got an obligation
A phone call you’ve gotta take
It’s my fault
I should have made an appointment
You’re probably busy anyway

After a while all you’ve got is strangers
Two actors putting on a play
Taking bows and catching all the roses
But the curtain’s falling on the stage

You can’t escape it, dear
So I might as well confess to you
What’s so hard to hear
All this horrible truth`,

    "Our Remaining Pig":
`There is a place in this world calling out my name
It might be love, it might be death, it might be pain
But there’s no way I’m staying here treading this water
We must slaughter our remaining pig

Forward, forward
Darling, I loved you
Deep in the wreckage, honey
That’s the truth
Twisted and broken,
But it’s the only way through
And it kills me to kill you
But that’s what we do
That’s what we do

Don’t know how long you starved me, but here is the bones
You can see them in the museum, but the animal is gone
And it ain’t your fault 
It’s just this wicked world won’t quit breaking everything 
And it broke my heart with it

Forward, forward
Darling, I loved you
Deep in the wreckage, honey
That’s the truth
Twisted and broken,
But it’s the only way through
And it kills me to kill you
But that’s what we do
That’s what we do

Drift away now
You’ve got to be free
I pray and I shout that good things come to me
Can good things come to me?
Will good things come to me?

Forward, forward
Darling, I loved you
Deep in the wreckage, honey
That’s the truth
Twisted and broken
But it’s the only way through
And it kills me to kill you
But that’s what we do
That’s what we do`,

    "Divorce of Course of Course":
`Love me in these shackles fit for justice
Show me how my heart can break
Meet me on the map of Nova Scotia, hoping for a holiday
Crasser than life when you go down on me
Choking like there’s nothing wrong
Just a million little birds on a dead dog's fur
Trying to make a corpse their home

And oh we often get it wrong
But so what move on
So what move on!

Trying to stand apart from other women
Acrylic and styrofoam
A capital bridge to leap to laughter
Before you left my heart alone
Calling out my name like it don’t mean nothing
Like a hooker in my dressing room
Taking back what you said to the man on the ledge hoping for a honeymoon

And oh we often get it wrong
But so what move on
So what move on!

Music in the way we held each other
Blood boiling in the kitchen sink
Now we’re on this earth like a stolen purse
Trying to find the missing keys
Tell me of your sadness ‘cause it sounds like glory
Like the pieces that I try to hide
But we’re giving birth to a life that hurts
And it’s really alright to cry

And oh we often get it wrong
But so what move on
So what move on!`,

    "Jules Can You See Me?":
`Jules, can you see me?
I’m right before your eyes
Here lonely, sick, & haunted
Wishing for a different life
And I don’t know how you missed me
I’ve been waving my arms around
Like a fool, sad & desperate
Wishing I was with you now

Was with you now…
Can you see me? Am I here?
With you now…
How can I reappear? Reappear…

Jules, can you see me?
I’m right in plain sight
I’ve been sitting here in solitude for most of my life
Can you tell me am I someone?
Am I worth your time at all?
Or would you block my number if I got brave enough to call?

Brave enough to call…
Can you see me? Am I here?
Enough to call…
How can I reappear? Reappear…

And all night I’m waiting to be seen
And alright you’ve got me walking in a dream of you and me

Jules, can you see me?
Have I disappeared again?
I know you came here to be social with some of your closest friends
But I’m walking right up to you
Flashing my pearly whites
Oh please take me with you
Off into this sunken night

This drunken night…
Can you see me? Am I here?
This drunken night…
How can I reappear? Reappear…

And all night I’m waiting to be seen
And alright you’ve got me walking in a dream of you and me

Jules, can you see me?
They’re locking up the doors
Tell me where are we going
Is it my place or yours?
But you broke off towards the theater
And I turned off towards the park
But in a sense you took me with you
Jules, you took my heart

You took my heart…
Can you see me? Am I here?
You took my heart…
How can I reappear? Reappear?`,

    "How Desperate We Are":
`How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, and bars

You say the road is heading south
Like there’s another way to go
Every mother is hand-to-mouth
But you’re so lucky not to know
If you want to find me, stranger
There’s a holy boat we could share
But if it feels like spinning wheels 
While we continue only to drown
Then you must excuse me if I steal
The remaining jewels from your crown

How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, and bars

How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, and bars`,

    "We Were Right ('Til We Were Wrong)":
`It happens slow
The dying flame
And where it goes there’s no escape
And we’re just whores
Hearts made for rape
The angel’s harp only played mistakes

I thought we’d be forever
I guess I’m just that dumb
And I said no to tomorrow
Like I could turn my back and run
We once adored these old oak floors
But the luster now is gone
And it’s true the shine just fades with time
We were right ‘till we were wrong

Turn out the lights
Deny the sun
Turn on our phones
We’ll call this love
Maybe in your youth
With bright blue eyes
Before the truth stole surprise 

I thought we’d be forever
I guess I’m just that dumb
And I said no to tomorrow
Like I could turn my back and run
We once adored these old oak floors
But the luster now is gone
And it’s true the shine just fades with time
We were right ‘till we were wrong

I thought we’d be forever
I guess I’m just that dumb
And I said no to tomorrow
Like I could turn my back and run
We once adored these old oak floors
But the luster now is gone
And it’s true the shine just fades with time
We were right ‘till we were wrong`,

    "Ezekiel Bobbing For Apples":
`Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Peace on Earth and all that shit
But none of it comes true
Open up our hearts for nothing
That is what we do

Open up those country doors
Let the caged birds go free
But where they’ve flown there’s nothing grown
Perched in a fruitless tree
And I was looking in the mirror
Just as you were walking away from me
But what I saw would be hard to draw
It didn’t look like anything

Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Peace on Earth and all that shit
But none of it comes true
Open up our hearts for nothing
That is what we do

Down the road I saw a home
Without windows or a wife
I went indoors, just walked the floors
No, I couldn’t sleep that night
In the morning the sun rose high
And I let it kiss my face
But it weren’t your lips
Just a counterfeit 
Some things you can’t replace 

Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Peace on Earth and all that shit
But none of it comes true
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do…`,

    "Pain":
`What do you do with your pain?
What do you do with your troubled mind?
Do you just look away?
Or do you pull out your eyes?

Pain
Pain
Pain

What do you do with your past?
What do you do when the day replays?
Can you escape its grasp?
Can you send it packing the way that it came?

Pain
Pain
Pain

What do you do with your lust?
What do you do with your hungry eyes?
Do you just want too much?
Do you really want another life?

Pain
Pain
Pain

PAIN!
PAIN!
PAIN!`,

    "Don't Cancel The Fair":
`Don’t cancel the fair
I don’t know what we’re gonna do come Spring
Just sit around and drink?
And lay off all the clowns?
And leave the bulls out in the fields for now
We gotta figure this out

And what are we gonna do with ourselves come June?
Alone with our thoughts in the quiet of this room
I hope there’s a thousand people there
Please don’t cancel the fair

Don’t take the giant pumpkins home
I want the bright blue jackets of the FFA
I want the grange displays
And a burger as big as your head
And an old man dragging his oxygen tank down past the carnival games

And what are we gonna do with ourselves come June?
Alone with our thoughts in the quiet of this room
I hope there’s a thousand people there
Please don’t cancel the fair

Don’t turn off all the lights
Close the gates, and send the country singers home
To sing sad songs alone
And that little boy by the slide?
Looks like me back when I was his age
Oh please just let him stay

And what are we gonna do with ourselves come June?
Alone with our thoughts in the quiet of this room
I hope there’s a thousand people there
Please don’t cancel the fair`,

    "Something is Different":
`Something went missing from your eyes
And I’ve been looking for it ever since
The years we spent building memories
May be all that we get

Something is different
Something is different
Something is different
And something’s gotta change

Whatever pulled me close to you
A lover’s serenade 
Has fallen quiet despite my demands
And the band they just won’t play

Something is different
Something is different
Something is different
And something’s gotta change

When we met and fell madly in love
The first time you touched my hand
Now that it’s fading nothing’s enough
And I just don’t know who I am

Something is different
Something is different
Something is different
And something’s gotta change

Everybody told me that it would never last
And I was sure they were wrong
It breaks my heart how right they were
And how love evaporates like fog

And…
Something is different
Something is different
Something is different
And something’s gotta change`,

    "The Mouth That Will Not Speak":
`Thought I heard a voice once before
Oh I thought it was yours
Thought I heard a voice once before
Oh I thought it was yours

Have at you!
I could tear you apart
In very little time I could own your heart
I’m made of teeth
You can wait and see
But you’re looking at a mouth that will not speak

You’re looking at a mouth that will not speak
You’re coming into town to ask after me
But I’m out the door
I’m down the street
You keep looking into my eyes like there’s something to see

I don’t need a vacation
I just want to believe
That there’s more out there that my hands can reach
Another falling curtain
Another dimming light
A dog on the runway’s had the time of his life
And I just woke up in these dirty sheets
Waiting on the mouth that will not speak

You’re looking at a mouth that will not speak
You’re coming into town to ask after me
But I’m out the door
I’m down the street
You keep looking into my eyes like there’s something to see

Thought I heard a voice once before…`,

    "Cut Off All Your Hair":
`Thought I could outrun every wild dog
Cover myself in clouds & hide in the fog
Thought if I left you’d forget my name
Even though the splinter was stuck in my paw
I refused to flinch
Just kept on walking

It’s I that drives the stake
And it’s not like I didn’t know what I needed to do
I just said no

Watch me stop the world from spin
It’s never been my way to ask for help
Though I needed it bad
I kept it to myself
That way no one could let me down

And would you please cut off all your hair?
And stand by my side though I can get so scared?
And would you leave as I just start to care?
‘Cause there’s a beggar in me that wants nothing but you, dear

Danced my way right out of the spotlight 
Jitterbug to the grave ‘till the bulbs glow hot white
Thought I’d just let go of your hand
Whatever became of that brand new feeling
That just never came back despite all my wishing
Blew out the candles on the cake

Countless nights of endless drinking
They gave away love without even thinking
They sell it at the corner store
And God only lasts in the moment you hold it
Man, it gets away fast with nothing to show for it
Hold this picture of my life

And would you please cut off all your hair?
And stand by my side though i can get so scared?
And would you leave as i just start to care?
‘Cause there’s a beggar in me that wants nothing but you, dear`
  };

  // Helpers
  const $ = (sel) => document.querySelector(sel);

  const list = $("#trackList");
  const audio = $("#audio");
  const nowPlaying = $("#nowPlaying");

  const playBtn = $("#playPauseBtn");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");

  const seekBar = $("#seekBar");
  const curTimeEl = $("#curTime");
  const durTimeEl = $("#durTime");

  const zipBtn = $("#zipBtn");
  if (zipBtn) zipBtn.href = ZIP_URL;

  $("#logoutBtn")?.addEventListener("click", () => {
    window.TANCCAuth.logout();
    location.replace("./login.html");
  });

  // Track modal
  const trackModal = $("#trackModal");
  const trackModalKicker = $("#trackModalKicker");
  const trackModalTitle = $("#trackModalTitle");
  const trackModalBody = $("#trackModalBody");
  const trackModalCloseBtn = $("#trackModalCloseBtn");
  const trackModalBodyWrap = trackModal ? trackModal.querySelector(".modal-body") : null;

  function openTrackModal(kind, title, body) {
    if (!trackModal) return;

    trackModalKicker.textContent = kind;
    trackModalTitle.textContent = title;
    trackModalBody.textContent = body;

    trackModal.classList.add("open");
    trackModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (trackModalBodyWrap) trackModalBodyWrap.scrollTop = 0;
    setTimeout(() => trackModalCloseBtn?.focus(), 0);
  }

  function closeTrackModal() {
    if (!trackModal) return;
    trackModal.classList.remove("open");
    trackModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  trackModalCloseBtn?.addEventListener("click", closeTrackModal);
  trackModal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) closeTrackModal();
  });

  // Bio modal
  const bioModal = $("#bioModal");
  const bioCloseBtn = $("#bioCloseBtn");
  const bioBodyWrap = bioModal ? bioModal.querySelector(".modal-body") : null;

  function openBioModal() {
    if (!bioModal) return;
    bioModal.classList.add("open");
    bioModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (bioBodyWrap) bioBodyWrap.scrollTop = 0;
    setTimeout(() => bioCloseBtn?.focus(), 0);
  }

  function closeBioModal() {
    if (!bioModal) return;
    bioModal.classList.remove("open");
    bioModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  $("#bioBtn")?.addEventListener("click", openBioModal);
  bioCloseBtn?.addEventListener("click", closeBioModal);
  bioModal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) closeBioModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (trackModal?.classList.contains("open")) closeTrackModal();
    if (bioModal?.classList.contains("open")) closeBioModal();
  });

  function fileUrl(file) {
    return "./audio/" + encodeURIComponent(file);
  }

  function labelForTrack(idx) {
    const t = tracks[idx];
    return `${String(t.n).padStart(2, "0")}. ${t.title}`;
  }

  function formatLyrics(raw) {
    const s = String(raw || "").replace(/\r\n/g, "\n");
    // Always add one blank line before the first lyric line
    return "\n" + s.replace(/^\n+/, "").trimEnd();
  }

  let currentIndex = 0;

  function ensureSrc(idx) {
    if (!audio) return;
    if (audio.dataset.srcIndex === String(idx) && audio.src) return;
    const t = tracks[idx];
    audio.src = fileUrl(t.file);
    audio.dataset.srcIndex = String(idx);
    resetSeekUI();
  }

  function isActuallyPlaying() {
    return audio && !audio.paused && !audio.ended;
  }

  function svgPlay() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7L8 5z"></path></svg>`;
  }

  function svgPause() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5h3v14H7V5zm7 0h3v14h-3V5z"></path></svg>`;
  }

  function setPlayPauseIcon(playing) {
    if (!playBtn) return;
    playBtn.innerHTML = playing ? svgPause() : svgPlay();
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function formatTime(secs) {
    const s = Math.max(0, Math.floor(Number(secs) || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    return `${m}:${String(ss).padStart(2, "0")}`;
  }

  function resetSeekUI() {
    if (seekBar) {
      seekBar.value = "0";
      seekBar.max = "1";
      seekBar.disabled = true;
    }
    if (curTimeEl) curTimeEl.textContent = "0:00";
    if (durTimeEl) durTimeEl.textContent = "0:00";
  }

  function updateNowPlaying() {
    if (!nowPlaying) return;
    const t = tracks[currentIndex];
    if (!t) {
      nowPlaying.textContent = "";
      return;
    }
    nowPlaying.textContent = (isActuallyPlaying() ? "Now playing: " : "Ready: ") + labelForTrack(currentIndex);
  }

  function highlightActive() {
    document.querySelectorAll(".track-row").forEach((row) => {
      row.classList.toggle("active", Number(row.dataset.index) === currentIndex);
    });
  }

  function setCurrent(idx, autoplay) {
    currentIndex = idx;
    highlightActive();
    updateNowPlaying();
    syncTimeUI();

    if (autoplay) {
      ensureSrc(idx);
      audio.play().catch(() => {});
    }
  }

// Back button behavior:
// - Single click: restart track if you're past 1s
// - If within the first 1s: go to previous track (common player behavior)
// - Double-click: go to previous track
let lastPrevClickTs = 0;

function goPrev(autoplay) {
  const prev = Math.max(0, currentIndex - 1);
  setCurrent(prev, autoplay);
}

prevBtn?.addEventListener("click", () => {
  const wasPlaying = isActuallyPlaying();
  ensureSrc(currentIndex);

  const now = Date.now();
  const isDouble = now - lastPrevClickTs < 350;
  lastPrevClickTs = now;

  const t = Number(audio?.currentTime || 0);

  if (isDouble || t <= 1) {
    goPrev(wasPlaying);
    return;
  }

  try { audio.currentTime = 0; } catch {}
  syncTimeUI();
  if (wasPlaying) audio.play().catch(() => {});
});


  nextBtn?.addEventListener("click", () => {
    const next = Math.min(tracks.length - 1, currentIndex + 1);
    setCurrent(next, isActuallyPlaying());
  });

  playBtn?.addEventListener("click", () => {
    ensureSrc(currentIndex);

    if (isActuallyPlaying()) {
      audio.pause();
      return;
    }
    audio.play().catch(() => {});
  });

  // Seek bar
  let isScrubbing = false;

  function syncDurationUI() {
    if (!audio) return;
    const d = audio.duration;
    if (!isFinite(d) || d <= 0) return;

    if (seekBar) {
      seekBar.max = String(d);
      seekBar.disabled = false;
    }
    if (durTimeEl) durTimeEl.textContent = formatTime(d);
  }

  function syncTimeUI() {
    if (!audio) return;
    const t = audio.currentTime || 0;

    if (curTimeEl) curTimeEl.textContent = formatTime(t);
    if (seekBar && !isScrubbing) seekBar.value = String(t);
  }

  audio?.addEventListener("loadedmetadata", syncDurationUI);
  audio?.addEventListener("durationchange", syncDurationUI);
  audio?.addEventListener("timeupdate", syncTimeUI);

  seekBar?.addEventListener("pointerdown", () => { isScrubbing = true; });
  window.addEventListener("pointerup", () => { isScrubbing = false; });

  seekBar?.addEventListener("input", () => {
    ensureSrc(currentIndex);
    const v = Number(seekBar.value || 0);
    if (curTimeEl) curTimeEl.textContent = formatTime(v);
    try { audio.currentTime = v; } catch {}
  });

  audio?.addEventListener("play", () => {
    setPlayPauseIcon(true);
    updateNowPlaying();
  });

  audio?.addEventListener("pause", () => {
    setPlayPauseIcon(false);
    updateNowPlaying();
  });

  audio?.addEventListener("ended", () => {
    const next = Math.min(tracks.length - 1, currentIndex + 1);
    if (next !== currentIndex) setCurrent(next, true);
  });

  // One-open-at-a-time drawers
  function closeAllDrawers(exceptRow = null) {
    document.querySelectorAll(".track-row").forEach((row) => {
      if (exceptRow && row === exceptRow) return;
      row.classList.remove("open");
      const icon = row.querySelector(".caret");
      if (icon) icon.textContent = "☰";
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".track-row")) closeAllDrawers();
  });

  function downloadFile(url, filename) {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  function render() {
    if (!list) return;
    list.innerHTML = "";

    tracks.forEach((t, idx) => {
      const row = document.createElement("li");
      row.className = "track-row";
      row.dataset.index = String(idx);

      const left = document.createElement("button");
      left.type = "button";
      left.className = "track-main";
      left.innerHTML = `
        <div class="track-title">
          <span class="track-num">${String(t.n).padStart(2, "0")}.<\/span>
          <span>${escapeHtml(t.title)}<\/span>
        </div>
      `;
      left.addEventListener("click", () => setCurrent(idx, true));

      const caretBtn = document.createElement("button");
      caretBtn.type = "button";
      caretBtn.className = "caret-btn";
      caretBtn.setAttribute("aria-label", "Open track actions");
      caretBtn.innerHTML = `<span class="caret">☰<\/span>`;
      caretBtn.addEventListener("click", () => {
  const isOpen = row.classList.contains("open");

  if (isOpen) {
    // already open — close it
    row.classList.remove("open");
    caretBtn.querySelector(".caret").textContent = "☰";
  } else {
    // open this one and close others
    closeAllDrawers(row);
    row.classList.add("open");
    caretBtn.querySelector(".caret").textContent = "✕";
  }
});


      const drawer = document.createElement("div");
      drawer.className = "drawer";
      drawer.innerHTML = `
        <div class="drawer-buttons">
          <button class="action-btn" data-action="lyrics">Lyrics<\/button>
          <button class="action-btn" data-action="credits">Credits<\/button>
          <button class="action-btn" data-action="notes">Notes<\/button>
          <button class="action-btn action-download" data-action="download">Download<\/button>
        </div>
      `;

      drawer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const action = btn.dataset.action;

        if (action === "download") {
          downloadFile(fileUrl(t.file), t.file);
          return;
        }

        closeAllDrawers();

        if (action === "credits") {
          openTrackModal("Credits", labelForTrack(idx), creditsForTitle(t.title));
          return;
        }

        if (action === "notes") {
          const raw = NOTES_BY_TITLE[t.title] || "";
          const notes = raw.trim() ? raw : NOTES_PLACEHOLDER;
          openTrackModal("Notes", labelForTrack(idx), notes);
          return;
        }

        if (action === "lyrics") {
          const lyrRaw = lyricsByTitle[t.title] || "Lyrics go here.";
          openTrackModal("Lyrics", labelForTrack(idx), formatLyrics(lyrRaw));
          return;
        }
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
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  resetSeekUI();
  setPlayPauseIcon(false);
  render();
})();
