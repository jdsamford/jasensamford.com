// Last Waltz set list: password gate, then drag-and-drop (or arrow buttons) to reorder and submit via Web3Forms
(function () {
  var STORAGE_KEY = "lastwaltz_pw";
  var gate = document.querySelector(".setlist-gate");
  var form = document.querySelector(".setlist-form");
  if (!gate || !form || !window.SETLIST_DATA) return;

  function fromB64(s) {
    return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); });
  }

  // The track list is AES-encrypted with a key derived from the password
  // (see scripts/lastwaltz-data.js), so a wrong password simply fails to decrypt.
  function unlock(password) {
    var blob = window.SETLIST_DATA;
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) return Promise.reject(new Error("no crypto"));
    return subtle
      .importKey("raw", new TextEncoder().encode(password.trim().toLowerCase()), "PBKDF2", false, ["deriveKey"])
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

  function show(tracks, password) {
    try { localStorage.setItem(STORAGE_KEY, password); } catch (e) { /* private mode */ }
    gate.hidden = true;
    form.hidden = false;
    start(tracks);
  }

  var gateStatus = gate.querySelector(".form-status");
  gate.addEventListener("submit", function (e) {
    e.preventDefault();
    var password = gate.elements.namedItem("password").value;
    var button = gate.querySelector('button[type="submit"]');
    button.disabled = true;
    gateStatus.classList.remove("is-error");
    gateStatus.textContent = "Checking...";
    unlock(password)
      .then(function (tracks) { show(tracks, password); })
      .catch(function () {
        gateStatus.classList.add("is-error");
        gateStatus.textContent = "That password didn't work.";
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

  function start(TRACKS) {
    var form = document.querySelector(".setlist-form");
    var list = form.querySelector(".setlist");
    var status = form.querySelector(".form-status");

    function buildItem(track, index) {
      var li = document.createElement("li");
      li.className = "track";
      li.dataset.index = String(index);
      li.innerHTML =
        '<button type="button" class="track-handle" aria-label="Drag to reorder ' + escapeHtml(track.title) + '">&#8942;&#8942;</button>' +
        '<span class="track-num"></span>' +
        '<span class="track-info">' +
          '<span class="track-title">' + escapeHtml(track.title) + ' <span class="track-was"></span></span>' +
          '<span class="track-guests">' + escapeHtml(track.guests) + '</span>' +
        '</span>' +
        (track.horns
          ? '<span class="horns horns-yes">Horns</span>'
          : '<span class="horns horns-no">No horns</span>') +
        '<span class="track-moves">' +
          '<button type="button" class="move-up" aria-label="Move ' + escapeHtml(track.title) + ' up">&#9650;</button>' +
          '<button type="button" class="move-down" aria-label="Move ' + escapeHtml(track.title) + ' down">&#9660;</button>' +
        '</span>';
      return li;
    }

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function render() {
      list.innerHTML = "";
      TRACKS.forEach(function (t, i) { list.appendChild(buildItem(t, i)); });
      update();
    }

    // Songs that keep their relative order (longest increasing run of original
    // positions) count as unmoved, so dragging one song only flags that song.
    function stayedPut(order) {
      var tails = [], prev = [], keep = {};
      order.forEach(function (v, i) {
        var lo = 0, hi = tails.length;
        while (lo < hi) {
          var mid = (lo + hi) >> 1;
          if (order[tails[mid]] < v) lo = mid + 1; else hi = mid;
        }
        prev[i] = lo > 0 ? tails[lo - 1] : -1;
        tails[lo] = i;
      });
      for (var k = tails.length ? tails[tails.length - 1] : -1; k >= 0; k = prev[k]) keep[order[k]] = true;
      return keep;
    }

    // Renumber, mark moved songs, and serialize the order into the hidden fields
    function update() {
      var items = list.querySelectorAll(".track");
      var order = Array.prototype.map.call(items, function (li) { return Number(li.dataset.index); });
      var keep = stayedPut(order);
      var lines = [];
      var changes = [];
      items.forEach(function (li, pos) {
        var orig = Number(li.dataset.index);
        var t = TRACKS[orig];
        var moved = !keep[orig];
        li.querySelector(".track-num").textContent = pos + 1;
        li.querySelector(".track-was").textContent = moved ? "(was " + (orig + 1) + ")" : "";
        li.classList.toggle("is-moved", moved);
        li.querySelector(".move-up").disabled = pos === 0;
        li.querySelector(".move-down").disabled = pos === items.length - 1;
        lines.push((pos + 1) + ". " + t.title + ": " + t.guests + (t.horns ? " [horns]" : "") + (moved ? "  (was " + (orig + 1) + ")" : ""));
        if (moved) changes.push(t.title + ": " + (orig + 1) + " → " + (pos + 1));
      });
      form.elements.namedItem("Proposed set list").value = "\n" + lines.join("\n");
      form.elements.namedItem("Changes").value = changes.length ? "\n" + changes.join("\n") : "No changes to the order";
    }

    // Arrow buttons
    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".move-up, .move-down");
      if (!btn) return;
      var li = btn.closest(".track");
      if (btn.classList.contains("move-up") && li.previousElementSibling) {
        list.insertBefore(li, li.previousElementSibling);
      } else if (btn.classList.contains("move-down") && li.nextElementSibling) {
        list.insertBefore(li.nextElementSibling, li);
      }
      update();
      var same = li.querySelector(btn.classList.contains("move-up") ? ".move-up" : ".move-down");
      (same.disabled ? li.querySelector(".track-handle") : same).focus();
    });

    // Keyboard on the handle: arrow keys move the song
    list.addEventListener("keydown", function (e) {
      if (!e.target.classList.contains("track-handle")) return;
      var li = e.target.closest(".track");
      if (e.key === "ArrowUp" && li.previousElementSibling) {
        list.insertBefore(li, li.previousElementSibling);
      } else if (e.key === "ArrowDown" && li.nextElementSibling) {
        list.insertBefore(li.nextElementSibling, li);
      } else {
        return;
      }
      e.preventDefault();
      update();
      e.target.focus();
    });

    // Pointer-based dragging so it works with mouse and touch alike
    var dragging = null;

    list.addEventListener("pointerdown", function (e) {
      var handle = e.target.closest(".track-handle");
      if (!handle || e.button > 0) return;
      e.preventDefault();
      dragging = handle.closest(".track");
      dragging.classList.add("is-dragging");
      handle.setPointerCapture(e.pointerId);
    });

    list.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var siblings = Array.prototype.filter.call(list.children, function (el) { return el !== dragging; });
      var before = null;
      for (var i = 0; i < siblings.length; i++) {
        var rect = siblings[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) { before = siblings[i]; break; }
      }
      if (before !== dragging.nextElementSibling) {
        list.insertBefore(dragging, before);
        update();
      }
      autoScroll(e.clientY);
    });

    function endDrag() {
      if (!dragging) return;
      dragging.classList.remove("is-dragging");
      dragging = null;
      update();
    }
    list.addEventListener("pointerup", endDrag);
    list.addEventListener("pointercancel", endDrag);

    function autoScroll(y) {
      var edge = 60;
      if (y < edge) window.scrollBy(0, -12);
      else if (y > window.innerHeight - edge) window.scrollBy(0, 12);
    }

    form.querySelector(".setlist-reset").addEventListener("click", function () {
      render();
      status.textContent = "";
    });

    // Submit in place so the band member stays on the page
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      update();
      var name = form.elements.namedItem("name").value.trim();
      form.elements.namedItem("subject").value = "Last Waltz set list suggestion from " + name;
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      status.classList.remove("is-error");
      status.textContent = "Sending...";

      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || "Submission failed");
          status.textContent = "Thanks, " + name + "! Your suggestion was sent.";
        })
        .catch(function () {
          status.classList.add("is-error");
          status.textContent = "Something went wrong sending that. Please try again, or text Jasen your order.";
        })
        .then(function () { submit.disabled = false; });
    });

    render();
  }
})();
