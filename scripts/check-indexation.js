#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const input = process.argv[2];
const output = path.join(root, "GSC-INDEXATION-STATUS.csv");

function parseCsv(text) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i], next = text[i + 1];
    if (quoted && c === '"' && next === '"') { cell += '"'; i += 1; }
    else if (c === '"') quoted = !quoted;
    else if (!quoted && c === ",") { row.push(cell); cell = ""; }
    else if (!quoted && /[\r\n]/.test(c)) { if (c === "\r" && next === "\n") i += 1; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const normalize = (value) => String(value || "").trim().replace(/\/$/, "").toLowerCase();

if (!input) {
  console.error("Usage: node scripts/check-indexation.js <gsc-pages-export.csv>\nDownload the Pages export from Google Search Console, then pass its CSV path here.");
  process.exit(1);
}
if (!fs.existsSync(input)) throw new Error(`GSC export not found: ${input}`);
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
const table = parseCsv(fs.readFileSync(input, "utf8").replace(/^\uFEFF/, ""));
const headers = table.shift().map((h) => h.trim());
const urlIndex = headers.findIndex((h) => /^(url|page|examples?)$/i.test(h) || /url/i.test(h));
const statusIndex = headers.findIndex((h) => /(status|reason|coverage|validation)/i.test(h));
if (urlIndex < 0 || statusIndex < 0) throw new Error(`Could not identify URL/status columns. Headers: ${headers.join(", ")}`);
const statuses = new Map(table.map((row) => [normalize(row[urlIndex]), row[statusIndex] || "Unknown"]));
const classify = (status) => {
  const s = status.toLowerCase();
  if (/indexed|submitted and indexed/.test(s) && !/not indexed/.test(s)) return "indexed";
  if (/crawled.*not indexed/.test(s)) return "crawled-not-indexed";
  if (/discovered.*not crawled|discovered.*not indexed/.test(s)) return "discovered-not-crawled";
  if (/excluded|duplicate|redirect|blocked|noindex|not found|soft 404/.test(s)) return "excluded";
  return "not-present-in-export";
};
const rows = sitemapUrls.map((url) => { const raw = statuses.get(normalize(url)) || "Not present in GSC export"; return [url, classify(raw), raw]; });
fs.writeFileSync(output, ["url,indexation_group,gsc_status", ...rows.map((row) => row.map(quote).join(","))].join("\n") + "\n", "utf8");
const counts = rows.reduce((acc, row) => { acc[row[1]] = (acc[row[1]] || 0) + 1; return acc; }, {});
console.log(`indexation report written: ${path.basename(output)} (${rows.length} sitemap URLs)`);
for (const [name, count] of Object.entries(counts)) console.log(`${name}: ${count}`);
