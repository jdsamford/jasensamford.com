const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), "utf-8");
}

// Pages that should have full SEO meta tags (exclude 404, nav, TANCC)
const seoPages = [
  "index.html",
  "about/index.html",
  "services/index.html",
  "faq/index.html",
  "checklist/index.html",
  "privacy/index.html",
];

// All pages that should have basic structure
const allPages = [
  "index.html",
  "about/index.html",
  "services/index.html",
  "faq/index.html",
  "checklist/index.html",
  "privacy/index.html",
  "404.html",
];

describe("Page structure", () => {
  test.each(allPages)("%s has DOCTYPE declaration", (file) => {
    const html = readFile(file);
    expect(html.trim().toLowerCase()).toMatch(/^<!doctype html>/);
  });

  test.each(allPages)("%s has lang attribute on html element", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<html\s[^>]*lang="en"/);
  });

  test.each(allPages)("%s has charset meta tag", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*charset="utf-8"/i);
  });

  test.each(allPages)("%s has viewport meta tag", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*name="viewport"/);
  });

  test.each(allPages)("%s has a title element", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<title>[^<]+<\/title>/);
  });

  test.each(allPages)("%s has a main element with id", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<main\s[^>]*id="main"/);
  });

  test.each(allPages)("%s has a skip-to-content link", (file) => {
    const html = readFile(file);
    expect(html).toContain('class="skip-link"');
    expect(html).toContain('href="#main"');
  });

  test.each(allPages)("%s includes nav.js", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/src=["'][^"']*nav\.js/);
  });

  test.each(allPages)("%s has a nav container div", (file) => {
    const html = readFile(file);
    expect(html).toContain('id="nav"');
  });

  test.each(allPages)("%s has a footer element", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toMatch(/<\/footer>/);
  });
});

describe("SEO meta tags", () => {
  test.each(seoPages)("%s has a meta description", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*name="description"\s[^>]*content="[^"]+"/);
  });

  test.each(seoPages)("%s has a canonical link", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<link\s[^>]*rel="canonical"\s[^>]*href="[^"]+"/);
  });

  test.each(seoPages)("%s has a favicon link", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<link\s[^>]*rel="icon"/);
  });

  test.each(seoPages)("%s has stylesheet link", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<link\s[^>]*rel="stylesheet"\s[^>]*href="[^"]*style\.css"/);
  });
});

describe("Open Graph tags", () => {
  const ogPages = seoPages.filter((f) => f !== "privacy/index.html");

  test.each(ogPages)("%s has og:title", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*property="og:title"\s[^>]*content="[^"]+"/);
  });

  test.each(ogPages)("%s has og:description", (file) => {
    const html = readFile(file);
    expect(html).toMatch(
      /<meta\s[^>]*property="og:description"\s[^>]*content="[^"]+"/
    );
  });

  test.each(ogPages)("%s has og:image", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*property="og:image"\s[^>]*content="[^"]+"/);
  });

  test.each(ogPages)("%s has og:url", (file) => {
    const html = readFile(file);
    expect(html).toMatch(/<meta\s[^>]*property="og:url"\s[^>]*content="[^"]+"/);
  });
});

describe("Accessibility attributes", () => {
  test("nav.html has aria-label on nav element", () => {
    const html = readFile("nav.html");
    expect(html).toMatch(/<nav\s[^>]*aria-label=/);
  });

  test("external links in nav.html have rel=noopener", () => {
    const html = readFile("nav.html");
    const externalLinks = html.match(/<a\s[^>]*target="_blank"[^>]*>/g) || [];
    for (const link of externalLinks) {
      expect(link).toContain("noopener");
    }
  });

  test.each(allPages)(
    "%s external links have rel=noopener",
    (file) => {
      const html = readFile(file);
      const externalLinks = html.match(/<a\s[^>]*target="_blank"[^>]*>/g) || [];
      for (const link of externalLinks) {
        expect(link).toContain("noopener");
      }
    }
  );

  test("index.html images have alt attributes", () => {
    const html = readFile("index.html");
    const imgs = html.match(/<img\s[^>]*>/g) || [];
    for (const img of imgs) {
      expect(img).toMatch(/alt="[^"]*"/);
    }
  });

  test("index.html images have width and height attributes", () => {
    const html = readFile("index.html");
    const imgs = html.match(/<img\s[^>]*>/g) || [];
    for (const img of imgs) {
      expect(img).toMatch(/width="/);
      expect(img).toMatch(/height="/);
    }
  });
});

describe("Internal link consistency", () => {
  test("nav.html links point to existing pages", () => {
    const html = readFile("nav.html");
    const hrefMatches = html.match(/href="(\/[^"]*?)"/g) || [];
    const internalPaths = hrefMatches
      .map((h) => h.match(/href="([^"]+)"/)[1])
      .filter((p) => p.startsWith("/"));

    for (const href of internalPaths) {
      const diskPath = href.endsWith("/")
        ? path.join(root, href, "index.html")
        : path.join(root, href);
      expect(fs.existsSync(diskPath)).toBe(true);
    }
  });

  test("sitemap.xml references match existing pages", () => {
    const xml = readFile("sitemap.xml");
    const locs = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    const paths = locs.map((l) =>
      l.replace(/<\/?loc>/g, "").replace("https://jasensamford.com", "")
    );

    for (const p of paths) {
      const diskPath = p.endsWith("/")
        ? path.join(root, p, "index.html")
        : path.join(root, p);
      expect(fs.existsSync(diskPath)).toBe(true);
    }
  });

  test("footer links in index.html point to existing pages", () => {
    const html = readFile("index.html");
    const footer = html.slice(html.lastIndexOf("<footer"));
    const hrefMatches = footer.match(/href="(\/[^"]*?)"/g) || [];
    const internalPaths = hrefMatches
      .map((h) => h.match(/href="([^"]+)"/)[1])
      .filter((p) => p.startsWith("/"));

    for (const href of internalPaths) {
      const diskPath = href.endsWith("/")
        ? path.join(root, href, "index.html")
        : path.join(root, href);
      expect(fs.existsSync(diskPath)).toBe(true);
    }
  });
});

describe("CSS", () => {
  test("style.css exists and is non-empty", () => {
    const css = readFile("style.css");
    expect(css.length).toBeGreaterThan(100);
  });

  test("style.css defines CSS custom properties", () => {
    const css = readFile("style.css");
    expect(css).toContain(":root");
    expect(css).toContain("--accent");
    expect(css).toContain("--text");
    expect(css).toContain("--bg");
  });

  test("style.css has dark mode media query", () => {
    const css = readFile("style.css");
    expect(css).toContain("prefers-color-scheme: dark");
  });

  test("style.css has reduced-motion media query", () => {
    const css = readFile("style.css");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  test("style.css has responsive breakpoints", () => {
    const css = readFile("style.css");
    expect(css).toMatch(/@media\s*\(max-width/);
    expect(css).toMatch(/@media\s*\(min-width/);
  });
});

describe("Required files exist", () => {
  const requiredFiles = [
    "index.html",
    "404.html",
    "nav.html",
    "style.css",
    "js/nav.js",
    "js/theme.js",
    "robots.txt",
    "sitemap.xml",
    "favicon.png",
    "CNAME",
  ];

  test.each(requiredFiles)("%s exists", (file) => {
    const filePath = path.join(root, file);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
