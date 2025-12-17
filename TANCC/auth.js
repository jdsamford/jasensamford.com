const TANCC_PASSWORD = "Fondudes"; // change this

(function boot() {
  // already authed? go straight in.
  if (sessionStorage.getItem("tancc_authed") === "1") {
    window.location.href = "player.html";
    return;
  }

  const pw = document.getElementById("pw");
  const btn = document.getElementById("enterBtn");
  const msg = document.getElementById("msg");

  function fail(text) {
    msg.textContent = text;
    msg.classList.add("bad");
  }

  function ok() {
    msg.textContent = "";
    msg.classList.remove("bad");
  }

  function attempt() {
    ok();
    const val = (pw.value || "").trim();
    if (!val) return fail("enter a password.");
    if (val !== TANCC_PASSWORD) return fail("nope. try again.");

    sessionStorage.setItem("tancc_authed", "1");
    window.location.href = "player.html";
  }

  btn.addEventListener("click", attempt);
  pw.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attempt();
  });

  pw.focus();
})();
