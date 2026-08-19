const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const trackerPath = path.join(root, "SEO", "BACKLINK-TRACKER.csv");
const write = process.argv.includes("--write");

function parseCsv(text) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]; const next = text[i + 1];
    if (quoted && char === '"' && next === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === ",") { row.push(cell); cell = ""; }
    else if (!quoted && (char === "\n" || char === "\r")) { if (char === "\r" && next === "\n") i += 1; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell); if (row.some(Boolean)) rows.push(row); }
  const headers = rows.shift() || [];
  return { headers, records: rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))) };
}

function encodeCsv(value) {
  const text = String(value || "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function request(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "AI-Tools-Pak-backlink-validator/1.0 (+https://aitoolspak.tech/)" } });
    return { status: response.status, html: await response.text() };
  } finally { clearTimeout(timer); }
}

function findLink(html, target) {
  const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const normalizedTarget = target.replace(/\/$/, "");
  for (const [, attributes, text] of links) {
    const href = (attributes.match(/\bhref\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
    if (href.replace(/\/$/, "") === normalizedTarget) {
      const rel = (attributes.match(/\brel\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
      return { found: true, anchor: text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), follow: /\b(nofollow|sponsored|ugc)\b/i.test(rel) ? rel : "follow" };
    }
  }
  return { found: false, anchor: "", follow: "" };
}

async function main() {
  const { headers, records } = parseCsv(fs.readFileSync(trackerPath, "utf8"));
  if (!records.length) { console.log("backlink check: no verified backlinks tracked yet"); return; }
  for (const record of records) {
    const checkedAt = new Date().toISOString().slice(0, 10);
    try {
      const source = await request(record.source_url);
      const target = await request(record.target_url);
      const link = findLink(source.html, record.target_url);
      record.http_status = `${source.status}/${target.status}`;
      record.last_seen = checkedAt;
      record.anchor = link.anchor || record.anchor;
      record.follow_status = link.follow || record.follow_status;
      record.indexable = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(source.html) ? "noindex" : "indexable";
      record.status = source.status >= 200 && source.status < 400 && target.status >= 200 && target.status < 400 && link.found ? "VERIFIED" : "LOST_OR_UNVERIFIED";
      console.log(`${record.source_domain}: ${record.status} (${record.http_status})`);
    } catch (error) {
      record.last_seen = checkedAt;
      record.status = "CHECK_FAILED";
      console.log(`${record.source_domain}: CHECK_FAILED (${error.name})`);
    }
  }
  if (write) {
    const output = [headers.join(","), ...records.map((record) => headers.map((header) => encodeCsv(record[header])).join(","))].join("\n") + "\n";
    fs.writeFileSync(trackerPath, output);
    console.log("backlink check: tracker updated");
  } else console.log("backlink check: dry run (use --write to save verification results)");
}

main().catch((error) => { console.error(error); process.exit(1); });
