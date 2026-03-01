/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

describe("nav.js", () => {
  const navScript = fs.readFileSync(path.join(root, "js/nav.js"), "utf-8");

  beforeEach(() => {
    document.body.innerHTML = '<div id="nav"></div><span class="js-year"></span>';
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("injects nav HTML into #nav element", async () => {
    const navHTML = '<nav><a href="/">Home</a><a href="/about/">About</a></nav>';
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve(navHTML),
    });

    // Mock location
    delete window.location;
    window.location = { pathname: "/" };

    eval(navScript);

    // Wait for fetch to resolve
    await new Promise((r) => setTimeout(r, 50));

    const nav = document.getElementById("nav");
    expect(nav.innerHTML).toContain("<nav>");
    expect(nav.innerHTML).toContain("Home");
  });

  test("marks current page link with is-current class", async () => {
    const navHTML = '<nav><a href="/">Home</a><a href="/about/">About</a></nav>';
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve(navHTML),
    });

    delete window.location;
    window.location = { pathname: "/about/" };

    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    const links = document.querySelectorAll("nav a");
    const aboutLink = Array.from(links).find(
      (l) => l.getAttribute("href") === "/about/"
    );
    expect(aboutLink.classList.contains("is-current")).toBe(true);
    expect(aboutLink.getAttribute("aria-current")).toBe("page");
  });

  test("does not mark non-current links", async () => {
    const navHTML = '<nav><a href="/">Home</a><a href="/about/">About</a></nav>';
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve(navHTML),
    });

    delete window.location;
    window.location = { pathname: "/about/" };

    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    const homeLink = document.querySelector('nav a[href="/"]');
    expect(homeLink.classList.contains("is-current")).toBe(false);
  });

  test("sets copyright year to current year", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve("<nav></nav>"),
    });

    delete window.location;
    window.location = { pathname: "/" };

    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    const yearEl = document.querySelector(".js-year");
    expect(yearEl.textContent).toBe(String(new Date().getFullYear()));
  });

  test("handles missing #nav element gracefully", async () => {
    document.body.innerHTML = "";
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve("<nav></nav>"),
    });

    delete window.location;
    window.location = { pathname: "/" };

    expect(() => eval(navScript)).not.toThrow();
    await new Promise((r) => setTimeout(r, 50));
  });
});

describe("theme.js", () => {
  const themeScript = fs.readFileSync(path.join(root, "js/theme.js"), "utf-8");

  let matchMediaListeners;

  beforeEach(() => {
    matchMediaListeners = [];
    document.body.innerHTML = `
      <source id="logo-source-webp" srcset="/logo_drk_bg.webp" />
      <source id="logo-source-png" srcset="/logo_drk_bg.png" />
      <img id="logo" src="/logo_drk_bg.png" />
      <source id="footer-logo-source-webp" srcset="/logo_drk_bg.webp" />
      <source id="footer-logo-source-png" srcset="/logo_drk_bg.png" />
      <img id="footer-logo" src="/logo_drk_bg.png" />
    `;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function setupMatchMedia(prefersDark) {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: prefersDark,
      addEventListener: jest.fn((event, cb) => {
        matchMediaListeners.push(cb);
      }),
    });
  }

  test("sets light-background logos when dark mode is off", () => {
    setupMatchMedia(false);
    eval(themeScript);

    expect(document.getElementById("logo").src).toContain("/logo_drk_bg.png");
    expect(document.getElementById("logo-source-webp").srcset).toContain(
      "/logo_drk_bg.webp"
    );
    expect(document.getElementById("footer-logo").src).toContain(
      "/logo_drk_bg.png"
    );
  });

  test("sets dark-background logos when dark mode is on", () => {
    setupMatchMedia(true);
    eval(themeScript);

    expect(document.getElementById("logo").src).toContain("/logo_lt_bg.png");
    expect(document.getElementById("logo-source-webp").srcset).toContain(
      "/logo_lt_bg.webp"
    );
    expect(document.getElementById("footer-logo").src).toContain(
      "/logo_lt_bg.png"
    );
  });

  test("registers a change listener on matchMedia", () => {
    setupMatchMedia(false);
    eval(themeScript);
    expect(matchMediaListeners.length).toBe(1);
  });

  test("handles missing logo elements gracefully", () => {
    document.body.innerHTML = "";
    setupMatchMedia(false);
    expect(() => eval(themeScript)).not.toThrow();
  });
});
