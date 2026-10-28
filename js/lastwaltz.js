// Shared by the Last Waltz pages: password gate, decrypting the track list, and Supabase calls
(function () {
  var STORAGE_KEY = "lastwaltz_pw";
  var API = "https://houpnxqbxgbbspvduwgo.supabase.co/rest/v1/rpc/";
  var API_KEY = "sb_publishable_J7KWBU2dWi8xFgDwVsWwbg_rVQ5a_kG";
  var password = null;

  function fromB64(s) {
    return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); });
  }

  // The track list is AES-encrypted with a key derived from the password
  // (see scripts/lastwaltz-data.js), so a wrong password simply fails to decrypt.
  function unlock(pw) {
    var blob = window.SETLIST_DATA;
    var subtle = window.crypto && window.crypto.subtle;
    if (!blob || !subtle) return Promise.reject(new Error("unsupported"));
    return subtle
      .importKey("raw", new TextEncoder().encode(pw.trim().toLowerCase()), "PBKDF2", false, ["deriveKey"])
      .then(function (base) {
        return subtle.deriveKey(
          { name: "PBKDF2", salt: fromB64(blob.salt), iterations: blob.iterations, hash: "SHA-256" },
          base,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      })
      .then(function (key) {
        return subtle.decrypt({ name: "AES-GCM", iv: fromB64(blob.iv) }, key, fromB64(blob.data));
      })
      .then(function (plain) {
        return JSON.parse(new TextDecoder().decode(plain));
      });
  }

  // Database functions check the same password server-side (scripts/lastwaltz.sql)
  function rpc(fn, args) {
    var body = Object.assign({ p_password: password }, args || {});
    return fetch(API + fn, {
      method: "POST",
      headers: { apikey: API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      if (!r.ok) throw new Error("Request failed (" + r.status + ")");
      return r.status === 204 ? null : r.json();
    });
  }

  // Wires a .setlist-gate form; calls onUnlock(tracks) once the password works.
  // A password that worked before is remembered on this device.
  function gate(onUnlock) {
    var form = document.querySelector(".setlist-gate");
    if (!form) return;
    var status = form.querySelector(".form-status");

    function show(tracks, pw) {
      password = pw.trim().toLowerCase();
      try { localStorage.setItem(STORAGE_KEY, pw); } catch (e) { /* private mode */ }
      form.hidden = true;
      onUnlock(tracks);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = form.elements.namedItem("password").value;
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.classList.remove("is-error");
      status.textContent = "Checking...";
      unlock(pw)
        .then(function (tracks) { show(tracks, pw); })
        .catch(function () {
          status.classList.add("is-error");
          status.textContent = "That password didn't work.";
          button.disabled = false;
        });
    });

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    if (saved) {
      unlock(saved)
        .then(function (tracks) { show(tracks, saved); })
        .catch(function () {
          try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* private mode */ }
        });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  window.LastWaltz = { gate: gate, rpc: rpc, escapeHtml: escapeHtml };
})();
