const { HtmlValidate } = require("html-validate");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const htmlValidate = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "no-trailing-whitespace": "off",
    "tel-non-breaking": "off",
    "no-inline-style": "off",
    "long-title": "off",
    "void-style": "off",
    "doctype-style": "off",
    "script-type": "off",
    "wcag/h30": "warn",
    "wcag/h32": "warn",
    "wcag/h36": "warn",
    "wcag/h37": "warn",
    "wcag/h67": "warn",
    "wcag/h71": "warn",
  },
});

const htmlFiles = [
  "index.html",
  "about/index.html",
  "services/index.html",
  "faq/index.html",
  "checklist/index.html",
  "privacy/index.html",
  "404.html",
  "nav.html",
  "TANCC/index.html",
  "TANCC/login.html",
];

describe("HTML validation", () => {
  test.each(htmlFiles)("%s is valid HTML", async (file) => {
    const filePath = path.join(root, file);
    const html = fs.readFileSync(filePath, "utf-8");
    const report = await htmlValidate.validateString(html, filePath);

    const errors = report.results
      .flatMap((r) => r.messages)
      .filter((m) => m.severity === 2);

    if (errors.length > 0) {
      const summary = errors
        .map((e) => `  Line ${e.line}: ${e.message} (${e.ruleId})`)
        .join("\n");
      throw new Error(
        `${file} has ${errors.length} validation error(s):\n${summary}`
      );
    }
  });
});
