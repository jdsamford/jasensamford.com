(() => {
  // Very simple local auth for private sharing pages.
  // Not secure against determined attackers, but good enough for “keep honest people honest”.

  const STORAGE_KEY = "tancc_auth_v1";
  const PASSWORD = "Fondudes"; // <-- change this if you want

  const now = () => Date.now();

  function setAuthed() {
    // store a timestamp so you can expire it later if you want
    const payload = { authed: true, ts: now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function clearAuthed() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function isAuthed() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data?.authed) return false;

      // Optional: expire after 30 days
      const ageMs = now() - (data.ts || 0);
      const days30 = 30 * 24 * 60 * 60 * 1000;
      if (ageMs > days30) {
        clearAuthed();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  function checkPassword(pw) {
    return String(pw || "") === PASSWORD;
  }

  // Expose a tiny API
  window.TANCCAuth = {
    isAuthed,
    checkPassword,
    login(password) {
      if (!checkPassword(password)) return false;
      setAuthed();
      return true;
    },
    logout() {
      clearAuthed();
    },
  };
})();
