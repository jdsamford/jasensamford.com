// Client-side “password gate” (not true security).
// It’s fine for “private-ish” sharing, but anyone can view the source.

const TANCC_PASSWORD = 'Fondudes'; // <- change this
const AUTH_KEY = 'tancc_authed_v1';

function setMsg(text) {
  document.getElementById('msg').textContent = text || '';
}

function unlock() {
  const val = (document.getElementById('pw').value || '').trim();
  if (val === TANCC_PASSWORD) {
    localStorage.setItem(AUTH_KEY, '1');
    window.location.href = 'player.html';
    return;
  }
  setMsg('nope. try again.');
}

document.getElementById('enterBtn').addEventListener('click', unlock);
document.getElementById('pw').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlock();
});
