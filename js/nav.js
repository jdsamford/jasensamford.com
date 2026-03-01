// Shared navigation loader — fetches nav.html and marks the current page
(function () {
  fetch("/nav.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var nav = document.getElementById("nav");
      if (!nav) return;
      nav.innerHTML = html;

      var path = window.location.pathname.replace(/\/+$/, "") || "/";
      nav.querySelectorAll("a").forEach(function (link) {
        var href = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/";
        if (href === path) {
          link.classList.add("is-current");
          link.setAttribute("aria-current", "page");
        }
      });
    });

  // Dynamic copyright year in footer
  var yearEl = document.querySelector(".js-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
