#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const site = "https://aitoolspak.tech";
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());

function fileFor(url) {
  const pathname = new URL(url).pathname.replace(/^\//, "");
  if (!pathname) return path.join(root, "index.html");
  const exact = path.join(root, pathname);
  if (path.extname(pathname)) return exact;
  return path.join(exact, "index.html");
}
function one(html, re) { return (html.match(re) || [])[1] || ""; }
function clean(value) { return value.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
function pageType(url) {
  const p = new URL(url).pathname;
  if (p.startsWith("/blog/")) return "blog";
  if (p.startsWith("/comparisons/")) return "comparison";
  if (p.startsWith("/ai-income-lab/")) return "income-lab";
  if (/-pakistan\/$/.test(p)) return "product";
  if (p.startsWith("/social-media-services/")) return "social";
  return "utility";
}
function normalizeUrl(value, base) {
  try {
    const u = new URL(value, base);
    if (u.origin !== site || /^(mailto:|tel:|javascript:)/i.test(value)) return null;
    u.hash = ""; u.search = "";
    return u.href;
  } catch { return null; }
}

const issues = [];
const pages = new Map();
for (const url of urls) {
  const file = fileFor(url);
  if (!fs.existsSync(file)) { issues.push({ severity: "P0", url, issue: "sitemap target missing locally" }); continue; }
  if (!/\.html$/i.test(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const title = clean(one(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = one(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || one(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = one(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || one(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => clean(m[1]));
  const schemas = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const links = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)/gi)].map((m) => normalizeUrl(m[1], url)).filter(Boolean);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const checks = [
    [!title, "P0", "missing title"], [title.length && (title.length < 30 || title.length > 65), "P2", `title length ${title.length}`],
    [!description, "P1", "missing meta description"], [description.length && (description.length < 110 || description.length > 165), "P2", `meta description length ${description.length}`],
    [h1.length !== 1, "P1", `H1 count ${h1.length}`], [!canonical, "P0", "missing canonical"], [canonical && canonical !== url, "P1", `canonical mismatch: ${canonical}`],
    [!/<meta[^>]+property=["']og:title["']/i.test(html), "P2", "missing og:title"], [!/<meta[^>]+property=["']og:description["']/i.test(html), "P2", "missing og:description"],
    [!/<meta[^>]+property=["']og:image["']/i.test(html), "P2", "missing og:image"], [!/<meta[^>]+name=["']twitter:card["']/i.test(html), "P2", "missing twitter:card"],
    [schemas.length === 0, "P1", "missing JSON-LD"], [!/<meta[^>]+name=["']viewport["']/i.test(html), "P1", "missing viewport"],
    [!/<html[^>]+lang=/i.test(html), "P2", "missing html lang"], [!/<meta[^>]+name=["']referrer["']/i.test(html), "P2", "missing referrer policy"],
    [images.some((img) => !/\balt=["'][^"']*["']/i.test(img)), "P1", "image missing alt"],
    [images.some((img) => !/\bwidth=["']?\d+/i.test(img) || !/\bheight=["']?\d+/i.test(img)), "P2", "image missing dimensions"]
  ];
  for (const [bad, severity, issue] of checks) if (bad) issues.push({ severity, url, issue });
  for (const schema of schemas) { try { JSON.parse(schema[1]); } catch { issues.push({ severity: "P0", url, issue: "invalid JSON-LD" }); } }
  pages.set(url, { url, type: pageType(url), title, description, links: [...new Set(links)] });
}

const inbound = new Map([...pages.keys()].map((u) => [u, 0]));
for (const page of pages.values()) for (const link of page.links) if (inbound.has(link)) inbound.set(link, inbound.get(link) + 1);
const depth = new Map([[`${site}/`, 0]]); const queue = [`${site}/`];
while (queue.length) { const u = queue.shift(); const page = pages.get(u); if (!page) continue; for (const link of page.links) if (pages.has(link) && !depth.has(link)) { depth.set(link, depth.get(u) + 1); queue.push(link); } }
for (const url of pages.keys()) {
  if (url !== `${site}/` && (inbound.get(url) || 0) === 0) issues.push({ severity: "P1", url, issue: "orphan: zero sitemap-page inlinks" });
  if (!depth.has(url)) issues.push({ severity: "P1", url, issue: "not reachable from homepage crawl graph" });
  else if (depth.get(url) > 3) issues.push({ severity: "P2", url, issue: `click depth ${depth.get(url)}` });
}
const duplicate = (field) => {
  const grouped = new Map();
  for (const page of pages.values()) { const value = page[field]; if (!value) continue; if (!grouped.has(value)) grouped.set(value, []); grouped.get(value).push(page.url); }
  for (const [value, list] of grouped) if (list.length > 1) for (const url of list) issues.push({ severity: "P1", url, issue: `duplicate ${field}: ${value}` });
};
duplicate("title"); duplicate("description");
const summary = {
  observed: "2026-08-22", sitemapUrls: urls.length, htmlPagesAudited: pages.size,
  byType: [...pages.values()].reduce((a, p) => ((a[p.type] = (a[p.type] || 0) + 1), a), {}),
  totalInternalLinks: [...pages.values()].reduce((n, p) => n + p.links.filter((u) => pages.has(u)).length, 0),
  averageInternalLinksPerPage: Number(([...pages.values()].reduce((n, p) => n + p.links.filter((u) => pages.has(u)).length, 0) / Math.max(pages.size, 1)).toFixed(1)),
  orphanPages: [...inbound].filter(([u, n]) => u !== `${site}/` && n === 0).length,
  unreachablePages: [...pages.keys()].filter((u) => !depth.has(u)).length,
  maxClickDepth: Math.max(0, ...depth.values()),
  issuesBySeverity: issues.reduce((a, i) => ((a[i.severity] = (a[i.severity] || 0) + 1), a), {})
};
const result = { summary, issues: issues.sort((a, b) => a.severity.localeCompare(b.severity) || a.url.localeCompare(b.url)) };
fs.writeFileSync(path.join(root, "SEO-GEO-AEO-AUDIT.json"), JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(JSON.stringify(summary, null, 2));
for (const issue of result.issues.slice(0, 100)) console.log(`${issue.severity}\t${issue.url}\t${issue.issue}`);
if (issues.some((issue) => issue.severity === "P0")) process.exitCode = 1;
