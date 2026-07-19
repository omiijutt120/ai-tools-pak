const fs = require("fs");
const path = require("path");

global.window = {};
require("../products-data.js");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://aitoolspak.tech";
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const errors = [];
const seen = { title: new Map(), description: new Map(), canonical: new Map() };

function htmlPath(url) {
  const pathname = new URL(url).pathname;
  return path.join(root, pathname, "index.html");
}

function first(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

function hasMeta(html, pattern) {
  return pattern.test(html);
}

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/\s([\w:-]+)(?:=(["'])(.*?)\2)?/g)].map((match) => [match[1].toLowerCase(), match[3] || ""]));
}

function metaContent(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = attrs(match[0]);
    if ((tag[key] || "").toLowerCase() === value.toLowerCase()) return tag.content || "";
  }
  return "";
}

function linkHref(html, relValue) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = attrs(match[0]);
    const rels = new Set((tag.rel || "").toLowerCase().split(/\s+/).filter(Boolean));
    if (rels.has(relValue.toLowerCase())) return tag.href || "";
  }
  return "";
}

function record(type, value, file) {
  if (!value) return;
  const list = seen[type].get(value) || [];
  list.push(file);
  seen[type].set(value, list);
}

for (const url of urls) {
  if (!url.startsWith(`${siteUrl}/`)) errors.push(`Non-production URL in sitemap: ${url}`);
  const file = htmlPath(url);
  if (!fs.existsSync(file)) {
    errors.push(`Missing sitemap file: ${url}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = first(html, /<title>([\s\S]*?)<\/title>/i);
  const description = metaContent(html, "name", "description");
  const canonical = linkHref(html, "canonical");
  const h1 = first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ");
  const robots = metaContent(html, "name", "robots");

  if (!title) errors.push(`Missing title: ${url}`);
  if (!description) errors.push(`Missing meta description: ${url}`);
  if (!canonical) errors.push(`Missing canonical: ${url}`);
  if (canonical && canonical !== url) errors.push(`Canonical mismatch: ${url} -> ${canonical}`);
  if (!h1) errors.push(`Missing H1: ${url}`);
  if (/noindex/i.test(robots)) errors.push(`Sitemap URL is noindex: ${url}`);
  if (!metaContent(html, "property", "og:title")) errors.push(`Missing og:title: ${url}`);
  if (!metaContent(html, "property", "og:description")) errors.push(`Missing og:description: ${url}`);
  if (!metaContent(html, "property", "og:image")) errors.push(`Missing og:image: ${url}`);
  if (!metaContent(html, "name", "twitter:card")) errors.push(`Missing twitter:card: ${url}`);
  if (/"@type"\s*:\s*"(FAQPage|HowTo)"/i.test(html)) errors.push(`Deprecated Google rich-result schema present: ${url}`);
  if (!html.includes('type="application/ld+json"') && !url.includes("/privacy-policy/") && !url.includes("/terms-and-conditions/")) {
    errors.push(`No JSON-LD on important page: ${url}`);
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]*"/i.test(image[0])) errors.push(`Image missing alt text: ${url}: ${image[0].slice(0, 120)}`);
  }

  for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      errors.push(`Invalid JSON-LD: ${url}: ${error.message}`);
    }
  }

  record("title", title, url);
  record("description", description, url);
  record("canonical", canonical, url);
}

for (const [type, map] of Object.entries(seen)) {
  for (const [value, pages] of map) {
    if (pages.length > 1) errors.push(`Duplicate ${type}: ${value} -> ${pages.join(", ")}`);
  }
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const product of window.AI_TOOLS_PRODUCTS || []) {
  if (!product.guideUrl) errors.push(`Missing guideUrl for ${product.name}`);
  if (product.guideUrl && !fs.existsSync(path.join(root, product.guideUrl, "index.html"))) {
    errors.push(`Missing product page for ${product.name}: ${product.guideUrl}`);
  }
  if (product.guideUrl && !home.includes(`href="${product.guideUrl}"`)) {
    errors.push(`Homepage does not link ${product.name}: ${product.guideUrl}`);
  }
}

if (errors.length) throw new Error(errors.join("\n"));
console.log(`seo audit ok: ${urls.length} sitemap URLs, metadata/schema/canonicals/product links checked`);
