#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const pages = {
  "about.html": ["AboutPage", "About The AI Post"],
  "contact.html": ["ContactPage", "Contact The AI Post"],
  "cookie-policy.html": ["WebPage", "Cookie Policy — The AI Post"],
  "editorial-policy.html": ["WebPage", "Editorial Policy — The AI Post"],
  "privacy-policy.html": ["WebPage", "Privacy Policy — The AI Post"],
  "terms.html": ["WebPage", "Terms of Use — The AI Post"]
};
for (const [file, [type, name]] of Object.entries(pages)) {
  const target = path.join(root, "ai-post", file);
  let html = fs.readFileSync(target, "utf8");
  const url = `https://aitoolspak.tech/ai-post/${file}`;
  if (!/name="referrer"/.test(html)) html = html.replace(/(<meta name="description"[^>]*>)/, '$1\n<meta name="referrer" content="strict-origin-when-cross-origin">');
  if (!/property="og:image"/.test(html)) html = html.replace(/(<meta property="og:url"[^>]*>)/, '$1\n<meta property="og:image" content="https://aitoolspak.tech/og-image.png">');
  if (!/application\/ld\+json/.test(html)) {
    const schema = { "@context": "https://schema.org", "@type": type, name, url, isPartOf: { "@type": "WebSite", name: "The AI Post", url: "https://aitoolspak.tech/ai-post/" }, dateModified: "2026-08-22" };
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
  }
  fs.writeFileSync(target, html, "utf8");
}
console.log(`AI Post static metadata enhanced: ${Object.keys(pages).length} pages`);

const incomeLabDir = path.join(root, "ai-income-lab");
let incomeLabEnhanced = 0;
for (const file of fs.readdirSync(incomeLabDir).filter((name) => name.endsWith(".html"))) {
  const target = path.join(incomeLabDir, file);
  let html = fs.readFileSync(target, "utf8");
  if (!/name="referrer"/.test(html)) {
    html = html.replace(/(<meta name="description"[^>]*>)/, '$1\n<meta name="referrer" content="strict-origin-when-cross-origin">');
    fs.writeFileSync(target, html, "utf8");
    incomeLabEnhanced += 1;
  }
}
console.log(`AI Income Lab referrer metadata enhanced: ${incomeLabEnhanced} pages`);
