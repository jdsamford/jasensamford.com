// /TANCC/auth.js
// Simple client-side gate (not “secure” security—just keeps casual visitors out)

(() => {
  const STORAGE_KEY = "tancc_auth_v1";
  const TANCC_PASSWORD = "Fondudes"; // <-- change this to whatever you want

  function getStored() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch { return null; }
  }

  function setStored(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function clearStored() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function isAuthed() {
    const data = getStored();
    if (!data || data.ok !== true) return false;

    // optional expiry (30 days)
    if (typeof data.ts === "number") {
      const ageMs = Date.now() - data.ts;
      const maxAgeMs = 30 * 24 * 60 * 60 * 1000;
      if (ageMs > maxAgeMs) {
        clearStored();
        return false;
      }
    }
    return true;
  }

  function login(pw) {
    const input = (pw || "").trim();
    const ok = input === TANCC_PASSWORD;
    if (ok) setStored({ ok: true, ts: Date.now() });
    return ok;
  }

  function logout() {
    clearStored();
  }

  function requireAuth(redirectTo = "./index.html") {
    if (!isAuthed()) {
      location.replace(redirectTo);
      return false;
    }
    return true;
  }

  window.TANCCAuth = { isAuthed, login, logout, requireAuth };
})();
