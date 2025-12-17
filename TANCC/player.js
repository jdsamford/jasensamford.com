const AUTH_KEY = 'tancc_authed_v1';

if (localStorage.getItem(AUTH_KEY) !== '1') {
  window.location.href = 'index.html';
}

const CREDITS_ALL = `Kye Alfred Hillig: vocals, guitar
Yoswa Grimgold: bass
David Bilbrey: guitar
Bill Nordwall: piano, organ
Jasen Samford: drums, percussion
Recorded and mixed by Ryan Leyva at ExEx Audio in Seattle, WA
All music and lyrics by Kye Alfred Hilling`;

const tracks = [
  {
    n: 1,
    title: "The Horrible Truth",
    file: "01 The Horrible Truth.mp3",
    lyrics: `
Ran some errands
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
All this horrible truth

Down to the cellar
Fill the washing machine,
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
I should made an appointment
You’re probably busy anyway
After a while all you’ve got is strangers
Two actors putting on a play
Taking bows and catching all the roses,
But the curtain’s falling on the stage

You can’t escape it, dear
So I might as well confess to you
What’s so hard to hear
All this horrible truth`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 2,
    title: "Ezekiel Bobbing For Apples",
    file: "02 Ezekiel Bobbing For Apples.mp3",
    lyrics: `
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Peace on Earth and all that shit,
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
Peace on Earth and all that shit,
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
Peace on Earth and all that shit,
But none of it comes true
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do
Open up our hearts for nothing
That is what we do Open up our hearts for nothing
That is what we do…`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 3,
    title: "Divorce of Course of Course",
    file: "03 Divorce of Course of Course.mp3",
    lyrics: `
Love me in these shackles fit for justice
Show me how my heart can break
Meet me on the map of Nova Scotia, hoping for a holiday
Crasser than life when you go down on me
Choking like there’s nothing wrong
Just a million little birds on a dead dogs fur
Trying to make a corpse their home

And oh we often get it wrong,
But so what move on
So what move on!

Trying to stand apart from other women
Acrylic and styrofoam
A capital bridge to leap to laughter
Before you left my heart alone
Calling out my name like it don’t mean nothing
Like a hooker in my dressing room
Taking back what you said to the man on the ledge hoping for a honeymoon

And oh we often get it wrong,
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

And oh we often get it wrong,
But so what move on
So what move on!`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 4,
    title: "Don’t Cancel The Fair",
    file: "04 Don't Cancel The Fair.mp3",
    lyrics: `
Don’t cancel the fair
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
And an old man dragging his oxygen tank down passed the carnival games

And what are we gonna do with ourselves come June?
Alone with our thoughts in the quiet of this room
I hope there’s a thousand people there
Please don’t cancel the fair

Don’t turn off all the lights,
Close the gates, and send the country singers home
To sing sad songs alone
And that little boy by the slide?
Looks like me back when I was his age
Oh please just let him stay

And what are we gonna do with ourselves come June?
Alone with our thoughts in the quiet of this room
I hope there’s a thousand people there
Please don’t cancel the fair`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 5,
    title: "How Desperate We Are",
    file: "05 How Desperate We Are.mp3",
    lyrics: `
How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, & bars

You say the road is heading south
Like there’s another way to go
Every mother is hand-to-mouth,
But you’re so lucky not to know
If you want to find me, stranger
There’s a holy boat we could share,
But if it feels like spinning wheels
While we continue only to drown
Then you must excuse me if I steal
The remaining jewels from your crown

How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, & bars

How desperate we are
How desperate we are
And if you want to know how close to the bottom
Just count the churches, jails, & bars`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 6,
    title: "Jules Can You See Me?",
    file: "06 Jules Can You See Me_.mp3",
    lyrics: `
Jules, can you see me?
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
And I turned off towards the park,
But in a sense you took me with you
Jules, you took my heart

You took my heart…
Can you see me? Am I here?
You took my heart…
How can I reappear? Reappear?`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 7,
    title: "Something Is Different",
    file: "07 Something is Different.mp3",
    lyrics: `
Something went missing from your eyes
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
And How love evaporates like fog

And...
Something is different
Something is different
Something is different
And something’s gotta change`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 8,
    title: "Our Remaining Pig",
    file: "08 Our Remaining Pig.mp3",
    lyrics: `There is a place in this world calling out my name
It might be love, it might be death, it might be pain
But there’s no way I’m staying here treading this water
We must slaughter our remaining pig

Forward, forward
Darling, I loved you
Deep in the wreckage, honey,
That’s the truth
Twisted and broken,
But it’s the only way through
And it kills me to kill you,
But that’s what we do
That’s what we do

Don’t know how long you starved me, but here is the bones
You can see them in the museum, but the animal is gone
And it ain’t your fault
It’s just this wicked world won’t quit breaking everything
And it broke my heart with it

Forward, forward
Darling, I loved you
Deep in the wreckage, honey,
That’s the truth
Twisted and broken,
But it’s the only way through
And it kills me to kill you,
But that’s what we do
That’s what we do

Drift away now
You’ve got to be free
I pray and I shout that good things come to me
Can good things come to me?
Will good things come to me?

Forward, forward
Darling, I loved you
Deep in the wreckage, honey,
That’s the truth
Twisted and broken,
But it’s the only way through
And it kills me to kill you,
But that’s what we do
That’s what we do`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 9,
    title: "The Mouth That Will Not Speak",
    file: "09 The Mouth That Will Not Speak.mp3",
    lyrics: `
Thought I heard a voice once before
Oh I thought it was yours
Thought I heard a voice once before
Oh I thought it was yours

Have at you!
I could tear you apart
In very little time I could own your heart
I’m made of teeth
You can wait and see,
But you’re looking at a mouth that will not speak

You’re looking at a mouth that will not speak
You’re coming into town to ask after me,
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
You’re coming into town to ask after me,
But I’m out the door
I’m down the street
You keep looking into my eyes like there’s something to see

Thought I heard a voice once before…`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 10,
    title: "Pain",
    file: "10 Pain.mp3",
    lyrics: `
What do you do with your pain?
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
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 11,
    title: "We Were Right ('Til We Were Wrong)",
    file: "11 We Were Right ('Til We Were Wrong).mp3",
    lyrics: `
It happens slow
The dying flame
And where it goes there’s no escape
And we’re just whores
Hearts made for rape
The angel’s harp only played mistakes

I thought we’d be forever
I guess I’m just that dumb
And I said no to tomorrow
Like I could turn my back and run
We once adored these old oak floors,
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
We once adored these old oak floors,
But the luster now is gone
And it’s true the shine just fades with time
We were right ‘till we were wrong

I thought we’d be forever
I guess I’m just that dumb
And I said no to tomorrow
Like I could turn my back and run
We once adored these old oak floors,
But the luster now is gone
And it’s true the shine just fades with time
We were right ‘till we were wrong`,
    notes: "PASTE TRACK NOTES HERE",
  },
  {
    n: 12,
    title: "Cut Off All Your Hair",
    file: "12 Cut Off All Your Hair.mp3",
    lyrics: `
Thought I could outrun every wild dog
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
And stand by my side though I can get so scared?
And would you leave as I just start to care?
‘Cause there’s a beggar in me that wants nothing but you, dear`,
    notes: "PASTE TRACK NOTES HERE",
  },
].map(t => ({ ...t, credits: CREDITS_ALL }));

const $ = (s) => document.querySelector(s);

const audio = $('#audio');
const trackList = $('#trackList');
const nowPlaying = $('#nowPlaying');

const playPauseBtn = $('#playPauseBtn');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');

const logoutBtn = $('#logoutBtn');
const bioBtn = $('#bioBtn');

let currentIndex = -1;
let openRowIndex = -1;

function fileUrl(fileName) {
  // file names include spaces, apostrophes, parens, etc.
  return `audio/${encodeURIComponent(fileName)}`;
}

function setNowPlaying() {
  if (currentIndex < 0) {
    nowPlaying.textContent = '';
    return;
  }
  const t = tracks[currentIndex];
  nowPlaying.textContent = `Now playing: ${String(t.n).padStart(2, '0')}. ${t.title}`;
}

function setPlayingStyles() {
  document.querySelectorAll('.track').forEach((el) => el.classList.remove('playing'));
  if (currentIndex >= 0) {
    const row = document.querySelector(`.track[data-index="${currentIndex}"]`);
    if (row) row.classList.add('playing');
  }
}

function closeAllRows(except = -1) {
  document.querySelectorAll('.navrow').forEach((r) => r.classList.remove('open'));
  document.querySelectorAll('.caretbtn').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    b.textContent = '▾';
  });
  openRowIndex = except;
}

function toggleRow(i) {
  const row = document.getElementById(`navrow-${i}`);
  const btn = document.getElementById(`caret-${i}`);
  const isOpen = row.classList.contains('open');

  closeAllRows(isOpen ? -1 : i);

  if (!isOpen) {
    row.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = '▴';
    openRowIndex = i;
  }
}

function loadAndPlay(i) {
  currentIndex = i;
  audio.src = fileUrl(tracks[i].file);
  audio.play().catch(() => {});
  playPauseBtn.textContent = 'Pause';
  setNowPlaying();
  setPlayingStyles();
}

function playPause() {
  if (currentIndex < 0) {
    loadAndPlay(0);
    return;
  }
  if (audio.paused) {
    audio.play().catch(() => {});
    playPauseBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = 'Play';
  }
}

function next() {
  if (tracks.length === 0) return;
  const i = currentIndex < 0 ? 0 : (currentIndex + 1) % tracks.length;
  loadAndPlay(i);
}

function prev() {
  if (tracks.length === 0) return;
  const i = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
  loadAndPlay(i);
}

function openTrackModal(kind, track) {
  const modal = $('#trackModal');
  const kicker = $('#trackModalKicker');
  const title = $('#trackModalTitle');
  const body = $('#trackModalBody');

  kicker.textContent = kind.toUpperCase();
  title.textContent = `${String(track.n).padStart(2, '0')}. ${track.title}`;

  if (kind === 'lyrics') body.textContent = track.lyrics || 'PASTE LYRICS HERE';
  if (kind === 'credits') body.textContent = track.credits || 'PASTE CREDITS HERE';
  if (kind === 'notes') body.textContent = track.notes || 'PASTE TRACK NOTES HERE';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(whichId) {
  const modal = document.getElementById(whichId);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function wireModal(whichId, closeBtnId) {
  const modal = document.getElementById(whichId);
  document.getElementById(closeBtnId).addEventListener('click', () => closeModal(whichId));
  modal.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-close') === '1') closeModal(whichId);
  });
}

function render() {
  trackList.innerHTML = '';

  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'track';
    li.dataset.index = String(i);

    const top = document.createElement('div');
    top.className = 'track-top';

    const left = document.createElement('button');
    left.className = 'playbtn';
    left.type = 'button';
    left.addEventListener('click', () => loadAndPlay(i));

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = `${String(t.n).padStart(2, '0')}. ${t.title}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = 'click to play';

    left.appendChild(name);
    left.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'track-actions';

    const caret = document.createElement('button');
    caret.className = 'iconbtn caretbtn';
    caret.id = `caret-${i}`;
    caret.type = 'button';
    caret.textContent = '▾';
    caret.setAttribute('aria-expanded', 'false');
    caret.setAttribute('aria-controls', `navrow-${i}`);
    caret.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleRow(i);
    });

    actions.appendChild(caret);

    top.appendChild(left);
    top.appendChild(actions);

    const nav = document.createElement('div');
    nav.className = 'navrow';
    nav.id = `navrow-${i}`;

    const mkBtn = (label, kind) => {
      const b = document.createElement('button');
      b.className = 'navchip';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        openTrackModal(kind, t);
      });
      return b;
    };

    nav.appendChild(mkBtn('Lyrics', 'lyrics'));
    nav.appendChild(mkBtn('Credits', 'credits'));
    nav.appendChild(mkBtn('Notes', 'notes'));

    const dl = document.createElement('a');
    dl.className = 'navchip navchip-link';
    dl.textContent = 'Download';
    dl.href = fileUrl(t.file);
    dl.setAttribute('download', t.file);
    nav.appendChild(dl);

    li.appendChild(top);
    li.appendChild(nav);

    trackList.appendChild(li);
  });
}

playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

audio.addEventListener('ended', () => next());
audio.addEventListener('pause', () => {
  if (!audio.ended) playPauseBtn.textContent = 'Play';
});
audio.addEventListener('play', () => {
  playPauseBtn.textContent = 'Pause';
  setNowPlaying();
  setPlayingStyles();
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
});

bioBtn.addEventListener('click', () => {
  const modal = document.getElementById('bioModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
});

wireModal('trackModal', 'trackModalCloseBtn');
wireModal('bioModal', 'bioCloseBtn');

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('trackModal');
    closeModal('bioModal');
    closeAllRows(-1);
  }
});

document.addEventListener('click', (e) => {
  // click outside rows closes any open caret row
  if (openRowIndex >= 0) {
    const openRow = document.getElementById(`navrow-${openRowIndex}`);
    const openBtn = document.getElementById(`caret-${openRowIndex}`);
    if (openRow && openBtn && !openRow.contains(e.target) && e.target !== openBtn) {
      closeAllRows(-1);
    }
  }
});

render();
