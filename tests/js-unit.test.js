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

describe("nav.js mobile menu", () => {
  const navScript = fs.readFileSync(path.join(root, "js/nav.js"), "utf-8");
  const navHTML = fs.readFileSync(path.join(root, "nav.html"), "utf-8");

  beforeEach(() => {
    document.body.innerHTML = '<div id="nav"></div>';
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve(navHTML),
    });
    delete window.location;
    window.location = { pathname: "/services/" };
  });

  test("toggle opens and closes the menu", async () => {
    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(links.classList.contains("is-open")).toBe(true);

    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(links.classList.contains("is-open")).toBe(false);
  });

  test("Escape closes the menu", async () => {
    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    const toggle = document.querySelector(".nav-toggle");
    toggle.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("does not mark the brand or Get started button as current", async () => {
    window.location = { pathname: "/" };
    eval(navScript);
    await new Promise((r) => setTimeout(r, 50));

    expect(document.querySelector(".brand").classList.contains("is-current")).toBe(false);
  });
});

describe("testimonials.js", () => {
  const script = fs.readFileSync(path.join(root, "js/testimonials.js"), "utf-8");

  function setup(scrollHeight) {
    document.body.innerHTML =
      '<figure class="testimonial"><blockquote><p>Quote</p></blockquote><figcaption>Name</figcaption></figure>';
    const p = document.querySelector("blockquote p");
    Object.defineProperty(p, "scrollHeight", { configurable: true, value: scrollHeight });
    Object.defineProperty(p, "clientHeight", { configurable: true, value: 100 });
  }

  test("adds a Read more toggle to long quotes", () => {
    setup(300);
    eval(script);

    const item = document.querySelector(".testimonial");
    const btn = document.querySelector(".read-more");
    expect(item.classList.contains("is-clamped")).toBe(true);
    expect(btn.textContent).toBe("Read more");

    btn.click();
    expect(item.classList.contains("is-clamped")).toBe(false);
    expect(btn.textContent).toBe("Show less");
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });

  test("leaves short quotes alone", () => {
    setup(100);
    eval(script);

    expect(document.querySelector(".read-more")).toBeNull();
    expect(document.querySelector(".testimonial").classList.contains("is-clamped")).toBe(false);
  });
});
