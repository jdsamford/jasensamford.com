// Shared logo switching for dark / light mode (WebP + PNG fallback)
(function () {
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function setLogoVariant(prefix) {
    var base = darkScheme.matches ? "/logo_lt_bg" : "/logo_drk_bg";

    var webp = document.getElementById(prefix + "logo-source-webp");
    var png  = document.getElementById(prefix + "logo-source-png");
    var img  = document.getElementById(prefix + "logo");

    if (webp) webp.srcset = base + ".webp";
    if (png)  png.srcset  = base + ".png";
    if (img)  img.src     = base + ".png";
  }

  function updateLogos() {
    setLogoVariant("");
    setLogoVariant("footer-");
  }

  if (darkScheme.addEventListener) {
    darkScheme.addEventListener("change", updateLogos);
  } else if (darkScheme.addListener) {
    darkScheme.addListener(updateLogos); // older Safari
  }

  updateLogos();
})();
