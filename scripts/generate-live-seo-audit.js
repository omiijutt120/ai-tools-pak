#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://aitoolspak.tech";
const OUTPUT = path.join(ROOT, "SEO", "LIVE-SEO-AUDIT-2026-08-31.csv");
const SUMMARY = path.join(ROOT, "SEO", "LIVE-SEO-AUDIT-2026-08-31.json");
const TIMEOUT_MS = 30000;
const CONCURRENCY = 5;

const decode = (value = "") => value
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const strip = (html = "") => decode(html.replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
const first = (html, regex) => decode(html.match(regex)?.[1] || "");
const csv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

function normalizeUrl(raw, base = `${ORIGIN}/`) {
  try {
    const url = new URL(raw, base);
    url.hash = "";
    if (url.origin !== ORIGIN) return null;
    if (url.pathname !== "/" && !path.posix.extname(url.pathname) && !url.pathname.endsWith("/")) url.pathname += "/";
    return url.href;
  } catch { return null; }
}

function seedUrls() {
  const urls = new Set();
  const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const normalized = normalizeUrl(match[1]);
    if (normalized) urls.add(normalized);
  }
  for (const name of ["llms.txt", "llms-full.txt"]) {
    const text = fs.readFileSync(path.join(ROOT, name), "utf8");
    for (const match of text.matchAll(/https:\/\/aitoolspak\.tech\/[^\s)\]>'"]*/g)) {
      const normalized = normalizeUrl(match[0].replace(/[.,;:]+$/, ""));
      if (normalized) urls.add(normalized);
    }
  }
  urls.add(`${ORIGIN}/`);
  return urls;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "AI-Tools-Pak-SEO-Audit/2026-08-31" } });
    return { status: response.status, finalUrl: response.url, headers: Object.fromEntries(response.headers), body: await response.text(), error: "" };
  } catch (error) {
    return { status: 0, finalUrl: url, headers: {}, body: "", error: error.message };
  } finally { clearTimeout(timer); }
}

function schemaTypes(value, output = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => schemaTypes(item, output));
  else if (value && typeof value === "object") {
    const type = value["@type"];
    (Array.isArray(type) ? type : [type]).filter(Boolean).forEach((item) => output.add(item));
    Object.values(value).forEach((item) => schemaTypes(item, output));
  }
  return output;
}

function parsePage(url, result) {
  const html = result.body;
  const contentType = result.headers["content-type"] || "";
  const isHtml = /text\/html/i.test(contentType) || /<html\b/i.test(html);
  const title = isHtml ? first(html, /<title[^>]*>([\s\S]*?)<\/title>/i) : "";
  const description = isHtml ? first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i) : "";
  const canonical = isHtml ? first(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i) : "";
  const robots = isHtml ? first(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)/i) : "";
  const h1s = isHtml ? [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1])) : [];
  const h2s = isHtml ? [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)] : [];
  const hreflang = isHtml ? [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)/gi)].map((m) => `${m[1]}=${m[2]}`).join("|") : "";
  const schemas = [];
  let invalidJsonLd = 0;
  if (isHtml) for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { schemas.push(JSON.parse(match[1])); } catch { invalidJsonLd += 1; }
  }
  const types = [...schemaTypes(schemas)].sort();
  const links = new Set();
  let outbound = 0;
  if (isHtml) for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)) {
    try {
      const target = new URL(match[1], result.finalUrl || url);
      target.hash = "";
      if (target.origin === ORIGIN) links.add(normalizeUrl(target.href) || target.href);
      else if (/^https?:$/.test(target.protocol)) outbound += 1;
    } catch {}
  }
  const images = isHtml ? [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]) : [];
  const missingAlt = images.filter((tag) => !/\balt=["'][^"']*["']/i.test(tag)).length;
  const text = isHtml ? strip(html.replace(/<nav\b[\s\S]*?<\/nav>/gi, " ").replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")) : "";
  return {
    url, status: result.status, final_url: result.finalUrl, content_type: contentType, error: result.error,
    title, title_length: title.length, meta_description: description, meta_description_length: description.length,
    canonical, hreflang, robots, x_robots_tag: result.headers["x-robots-tag"] || "", h1: h1s.join(" | "), h1_count: h1s.length,
    h2_count: h2s.length, word_count: text ? text.split(/\s+/).filter(Boolean).length : 0,
    json_ld_types: types.join("|"), invalid_json_ld: invalidJsonLd,
    product_schema: types.includes("Product"), faq_schema: types.includes("FAQPage"), howto_schema: types.includes("HowTo"),
    breadcrumb_schema: types.includes("BreadcrumbList"), article_schema: types.includes("Article") || types.includes("NewsArticle") || types.includes("BlogPosting"),
    organization_schema: types.includes("Organization"), internal_links: links.size, outbound_links: outbound,
    image_count: images.length, images_missing_alt: missingAlt,
    og_title: /<meta\s+property=["']og:title["']/i.test(html), og_description: /<meta\s+property=["']og:description["']/i.test(html),
    og_image: /<meta\s+property=["']og:image["']/i.test(html), twitter_metadata: /<meta\s+name=["']twitter:/i.test(html),
    thin_content: isHtml && text.split(/\s+/).filter(Boolean).length < 300,
    internal_targets: [...links]
  };
}

async function main() {
  const queue = [...seedUrls()];
  const seen = new Set(queue);
  const pages = [];
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const index = cursor++;
      const url = queue[index];
      const parsed = parsePage(url, await fetchText(url));
      pages.push(parsed);
      for (const target of parsed.internal_targets) {
        if (!seen.has(target) && seen.size < 500 && !/\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|json|xml|csv|pdf|zip)$/i.test(new URL(target).pathname)) {
          seen.add(target); queue.push(target);
        }
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  pages.sort((a, b) => a.url.localeCompare(b.url));

  const inbound = new Map(pages.map((page) => [page.url, 0]));
  for (const page of pages) for (const target of page.internal_targets) if (inbound.has(target)) inbound.set(target, inbound.get(target) + 1);
  const duplicate = (key) => {
    const counts = new Map();
    pages.forEach((p) => p[key] && counts.set(p[key], (counts.get(p[key]) || 0) + 1));
    return counts;
  };
  const titles = duplicate("title"), descriptions = duplicate("meta_description"), h1s = duplicate("h1");
  pages.forEach((page) => {
    page.inbound_internal_links = inbound.get(page.url) || 0;
    page.orphan = page.url !== `${ORIGIN}/` && page.inbound_internal_links === 0;
    page.duplicate_title = page.title && titles.get(page.title) > 1;
    page.duplicate_description = page.meta_description && descriptions.get(page.meta_description) > 1;
    page.duplicate_h1 = page.h1 && h1s.get(page.h1) > 1;
    delete page.internal_targets;
  });
  const fields = Object.keys(pages[0]);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${fields.map(csv).join(",")}\n${pages.map((p) => fields.map((f) => csv(p[f])).join(",")).join("\n")}\n`);
  const summary = {
    generated_at: new Date().toISOString(), source: "fresh live crawl", pages: pages.length,
    statuses: Object.fromEntries([...new Set(pages.map((p) => p.status))].sort().map((s) => [s, pages.filter((p) => p.status === s).length])),
    html_pages: pages.filter((p) => /html/i.test(p.content_type)).length,
    non_200: pages.filter((p) => p.status !== 200).map((p) => p.url),
    missing_title: pages.filter((p) => /html/i.test(p.content_type) && !p.title).map((p) => p.url),
    missing_description: pages.filter((p) => /html/i.test(p.content_type) && !p.meta_description).map((p) => p.url),
    missing_canonical: pages.filter((p) => /html/i.test(p.content_type) && !p.canonical).map((p) => p.url),
    invalid_json_ld: pages.filter((p) => p.invalid_json_ld).map((p) => p.url),
    faq_schema_pages: pages.filter((p) => p.faq_schema).map((p) => p.url),
    howto_schema_pages: pages.filter((p) => p.howto_schema).map((p) => p.url),
    product_schema_pages: pages.filter((p) => p.product_schema).map((p) => p.url),
    orphans: pages.filter((p) => p.orphan).map((p) => p.url),
    thin_pages: pages.filter((p) => p.thin_content).map((p) => p.url),
    duplicate_title_pages: pages.filter((p) => p.duplicate_title).map((p) => p.url),
    duplicate_description_pages: pages.filter((p) => p.duplicate_description).map((p) => p.url),
    duplicate_h1_pages: pages.filter((p) => p.duplicate_h1).map((p) => p.url)
  };
  fs.writeFileSync(SUMMARY, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`live seo audit: ${pages.length} URLs crawled; ${summary.html_pages} HTML; ${summary.non_200.length} non-200; ${summary.invalid_json_ld.length} invalid JSON-LD; ${summary.orphans.length} zero-inbound URLs`);
  console.log(`wrote ${path.relative(ROOT, OUTPUT)}`);
  console.log(`wrote ${path.relative(ROOT, SUMMARY)}`);
}

main().catch((error) => { console.error(error.stack || error); process.exit(1); });
