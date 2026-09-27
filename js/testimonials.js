// Clamp long testimonials and add a "Read more" toggle
(function () {
  document.querySelectorAll(".testimonial").forEach(function (item) {
    var text = item.querySelector("blockquote p");
    if (!text) return;

    item.classList.add("is-clamped");
    if (text.scrollHeight <= text.clientHeight + 2) {
      item.classList.remove("is-clamped");
      return;
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-more";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var expanded = item.classList.toggle("is-clamped") === false;
      btn.textContent = expanded ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    item.querySelector("blockquote").insertAdjacentElement("afterend", btn);
  });
})();
