// SIMPLE STATIC GATE (not real security).
// Anyone who can view source can bypass it.
// If you need real protection, use Cloudflare Access or host-level auth.

const TANCC_PASSWORD = "Fondudes!";
const TANCC_STORAGE_KEY = "tancc_authed";

function isAuthed() {
  return localStorage.getItem(TANCC_STORAGE_KEY) === "1";
}

function requireAuthOnPlayerPage() {
  const path = location.pathname.toLowerCase();
  const onPlayer = path.endsWith("/tancc/player.html") || path.endsWith("/player.html");
  if (onPlayer && !isAuthed()) {
    location.replace("./index.html");
  }
}

function setupAuthForm() {
  const form = document.getElementById("authForm");
  if (!form) return;

  const pw = document.getElementById("pw");
  const msg = document.getElementById("authMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (pw.value || "").trim();

    if (val === TANCC_PASSWORD) {
      localStorage.setItem(TANCC_STORAGE_KEY, "1");
      msg.textContent = "ok.";
      msg.className = "msg good";
      location.assign("./player.html");
      return;
    }

    msg.textContent = "nope. try again.";
    msg.className = "msg bad";
    pw.focus();
    pw.select();
  });
}

function setupLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem(TANCC_STORAGE_KEY);
    location.assign("./index.html");
  });
}

requireAuthOnPlayerPage();
setupAuthForm();
setupLogout();
