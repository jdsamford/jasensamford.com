// Last Waltz set list results: combine everyone's saved orders into a consensus and flag disagreements
(function () {
  var wrap = document.querySelector(".lw-results");
  if (!wrap || !window.LastWaltz) return;
  var escapeHtml = window.LastWaltz.escapeHtml;
  var status = wrap.querySelector(".form-status");
  var output = wrap.querySelector(".lw-output");

  // Spread (latest slot minus earliest) that counts as agreement vs. needing a talk
  var AGREED_MAX = 2;
  var CLOSE_MAX = 5;

  window.LastWaltz.gate(function (tracks) {
    wrap.hidden = false;
    window.LastWaltz.rpc("lastwaltz_results")
      .then(function (rows) { show(tracks, rows || []); })
      .catch(function () {
        status.classList.add("is-error");
        status.textContent = "Couldn't load the results. Try refreshing.";
      });
  });

  function verdict(spread) {
    if (spread <= AGREED_MAX) return { key: "agreed", label: "Agreed" };
    if (spread <= CLOSE_MAX) return { key: "close", label: "Close" };
    return { key: "discuss", label: "Discuss" };
  }

  function show(tracks, rows) {
    if (!rows.length) {
      status.innerHTML = 'No one has sent an order yet. <a href="/lastwaltz/">Be the first</a>.';
      return;
    }
    status.textContent = "";

    // Each person's slot (1-based) for each song, by title
    var people = rows.map(function (row) {
      var slots = {};
      row.track_order.forEach(function (title, i) { slots[title] = i + 1; });
      return { name: row.name, slots: slots, notes: row.notes, updated: row.updated_at };
    });

    var songs = tracks.map(function (t, i) {
      var positions = people
        .map(function (p) { return p.slots[t.title]; })
        .filter(function (pos) { return pos !== undefined; });
      var avg = positions.length
        ? positions.reduce(function (a, b) { return a + b; }, 0) / positions.length
        : i + 1;
      var spread = positions.length ? Math.max.apply(null, positions) - Math.min.apply(null, positions) : 0;
      return { track: t, current: i + 1, avg: avg, spread: spread, verdict: verdict(spread) };
    });

    var consensus = songs.slice().sort(function (a, b) { return a.avg - b.avg || a.current - b.current; });
    var discuss = songs
      .filter(function (s) { return s.verdict.key === "discuss"; })
      .sort(function (a, b) { return b.spread - a.spread; });
    var agreedCount = songs.filter(function (s) { return s.verdict.key === "agreed"; }).length;

    var html = "";

    html += '<div class="lw-summary">' +
      stat(people.length, people.length === 1 ? "person has weighed in" : "people have weighed in") +
      stat(agreedCount, (agreedCount === 1 ? "song" : "songs") + " agreed (within " + AGREED_MAX + " slots)") +
      stat(discuss.length, (discuss.length === 1 ? "song" : "songs") + " to discuss") +
      "</div>";
    html += '<p class="card-muted">From: ' + people.map(function (p) { return escapeHtml(p.name); }).join(", ") + "</p>";

    if (discuss.length) {
      html += '<section class="lw-section"><h2>Talk about these</h2>' +
        "<p>Songs where people's picks are more than " + CLOSE_MAX + " slots apart, biggest disagreement first.</p>" +
        '<ul class="lw-discuss-list">' +
        discuss.map(function (s) {
          var picks = people
            .filter(function (p) { return p.slots[s.track.title] !== undefined; })
            .sort(function (a, b) { return a.slots[s.track.title] - b.slots[s.track.title]; });
          var first = picks[0].slots[s.track.title];
          var last = picks[picks.length - 1].slots[s.track.title];
          var who = picks.map(function (p) { return escapeHtml(p.name) + " #" + p.slots[s.track.title]; }).join(", ");
          return "<li><strong>" + escapeHtml(s.track.title) + "</strong> " +
            '<span class="lw-chip lw-discuss">#' + first + "&ndash;#" + last + "</span>" +
            '<div class="who">' + who + "</div></li>";
        }).join("") +
        "</ul></section>";
    }

    html += '<section class="lw-section"><h2>Combined order</h2>' +
      "<p>Songs sorted by their average slot across everyone. Shaded cells show where someone's pick is far from the group.</p>" +
      '<div class="lw-table-wrap"><table class="lw-table"><thead><tr>' +
      '<th class="num">#</th><th>Song</th><th class="num">Now</th><th class="num">Avg</th><th>Status</th>' +
      people.map(function (p) { return '<th class="num">' + escapeHtml(p.name) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      consensus.map(function (s, i) {
        return "<tr>" +
          '<td class="num"><strong>' + (i + 1) + "</strong></td>" +
          '<td class="song">' + escapeHtml(s.track.title) +
            "<small>" + escapeHtml(s.track.guests) + (s.track.horns ? " &middot; Horns" : "") + "</small></td>" +
          '<td class="num">' + s.current + "</td>" +
          '<td class="num">' + s.avg.toFixed(1) + "</td>" +
          '<td><span class="lw-chip lw-' + s.verdict.key + '">' + s.verdict.label + "</span></td>" +
          people.map(function (p) {
            var pos = p.slots[s.track.title];
            if (pos === undefined) return '<td class="pos">&ndash;</td>';
            var off = Math.abs(pos - s.avg);
            var cls = off <= 2 ? "" : off <= 4 ? " off-1" : off <= 8 ? " off-2" : " off-3";
            return '<td class="pos' + cls + '">' + pos + "</td>";
          }).join("") +
          "</tr>";
      }).join("") +
      "</tbody></table></div></section>";

    var withNotes = people.filter(function (p) { return p.notes; });
    if (withNotes.length) {
      html += '<section class="lw-section"><h2>Notes</h2><div class="lw-notes">' +
        withNotes.map(function (p) {
          return "<blockquote><cite>" + escapeHtml(p.name) + "</cite>" + escapeHtml(p.notes) + "</blockquote>";
        }).join("") +
        "</div></section>";
    }

    output.innerHTML = html;
  }

  function stat(value, label) {
    return '<div class="lw-stat"><strong>' + value + "</strong><span>" + label + "</span></div>";
  }
})();
