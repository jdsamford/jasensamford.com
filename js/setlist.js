// Last Waltz set list: drag-and-drop (or arrow buttons) to reorder, then save to the shared results
(function () {
  var form = document.querySelector(".setlist-form");
  if (!form || !window.LastWaltz) return;
  var escapeHtml = window.LastWaltz.escapeHtml;

  window.LastWaltz.gate(function (tracks) {
    form.hidden = false;
    start(tracks);
  });

  function start(TRACKS) {
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

    // order: optional list of titles (a saved submission); unknown titles are skipped
    // and songs it doesn't mention go at the end in their current order.
    function render(order) {
      var indexes = TRACKS.map(function (t, i) { return i; });
      if (order) {
        var byTitle = {};
        TRACKS.forEach(function (t, i) { byTitle[t.title] = i; });
        var picked = order.filter(function (title) { return title in byTitle; }).map(function (title) { return byTitle[title]; });
        indexes = picked.concat(indexes.filter(function (i) { return picked.indexOf(i) === -1; }));
      }
      list.innerHTML = "";
      indexes.forEach(function (i) { list.appendChild(buildItem(TRACKS[i], i)); });
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

    function currentOrder() {
      return Array.prototype.map.call(list.querySelectorAll(".track"), function (li) {
        return TRACKS[Number(li.dataset.index)].title;
      });
    }

    // Returning band members get their saved order back when they enter their name
    var saved = {};
    window.LastWaltz.rpc("lastwaltz_results").then(function (rows) {
      (rows || []).forEach(function (row) { saved[row.name.trim().toLowerCase()] = row; });
    }).catch(function () { /* results page will show errors; the form still works */ });

    form.elements.namedItem("name").addEventListener("change", function (e) {
      var row = saved[e.target.value.trim().toLowerCase()];
      if (!row) return;
      render(row.track_order);
      if (row.notes && !form.elements.namedItem("message").value) form.elements.namedItem("message").value = row.notes;
      status.classList.remove("is-error");
      status.textContent = "Loaded the order you sent on " + new Date(row.updated_at).toLocaleDateString() + ". Sending again replaces it.";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      update();
      var name = form.elements.namedItem("name").value.trim();
      var notes = form.elements.namedItem("message").value;
      var order = currentOrder();
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      status.classList.remove("is-error");
      status.textContent = "Sending...";

      window.LastWaltz.rpc("lastwaltz_submit", { p_name: name, p_order: order, p_notes: notes })
        .then(function () {
          saved[name.toLowerCase()] = { name: name, track_order: order, notes: notes, updated_at: new Date().toISOString() };
          status.innerHTML = "Thanks, " + escapeHtml(name) + "! Your order is saved. " +
            '<a href="/lastwaltz/results/">See how everyone\'s lines up</a>.';
          // Email Jasen a copy too; the saved order is what counts, so ignore failures here
          form.elements.namedItem("subject").value = "Last Waltz set list suggestion from " + name;
          fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }).catch(function () {});
        })
        .catch(function () {
          status.classList.add("is-error");
          status.textContent = "Something went wrong saving that. Please try again, or text Jasen your order.";
        })
        .then(function () { submit.disabled = false; });
    });

    render();
  }
})();
