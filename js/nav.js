// Shared navigation loader: fetches nav.html, marks the current page, wires the mobile menu
(function () {
  fetch("/nav.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var nav = document.getElementById("nav");
      if (!nav) return;
      nav.innerHTML = html;

      var path = window.location.pathname.replace(/\/+$/, "") || "/";
      nav.querySelectorAll("a").forEach(function (link) {
        if (link.classList.contains("brand") || link.classList.contains("nav-cta")) return;
        var href = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/";
        if (href === path) {
          link.classList.add("is-current");
          link.setAttribute("aria-current", "page");
        }
      });

      var toggle = nav.querySelector(".nav-toggle");
      var links = nav.querySelector(".nav-links");
      if (!toggle || !links) return;

      function setOpen(open) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        links.classList.toggle("is-open", open);
      }

      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          toggle.focus();
        }
      });
      links.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    });

  // Dynamic copyright year in footer
  var yearEl = document.querySelector(".js-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
