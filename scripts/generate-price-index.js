const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "data", "products.csv");
const destination = path.join(root, "ai-subscription-price-index-pakistan", "index.html");
const SITE = "https://aitoolspak.tech";
const UPDATED = "2026-08-19";

function csv(text) {
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
  const headers = rows.shift();
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function esc(value) { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function route(product) {
  const special = {
    "chatgpt-plus": "chatgpt-plus-pakistan/",
    "claude-ai": "claude-pro-pakistan/",
    "elevenlabs-creator-private": "elevenlabs-creator-pakistan/",
    "lovable-ai-pro-private": "lovable-ai-pro-pakistan/",
    "runway-ml-unlimited-generations": "runway-ml-pakistan/",
    "grammarly-pro": "grammarly-premium-pakistan/",
    "quillbot": "quillbot-premium-pakistan/",
    "google-ai-ultra-plan": "google-ai-ultra-pakistan/",
    "ideogram-ai-plus-private": "ideogram-ai-plus-pakistan/",
    "success-ai-starter-leads": "success-ai-starter-pakistan/"
  };
  return special[product.slug] || `${product.slug}-pakistan/`;
}

const products = csv(fs.readFileSync(source, "utf8")).filter((item) => Number(item.price_pkr) > 0);
const categories = [...new Set(products.map((item) => item.category))];
const rows = products.map((item) => `<tr><td><a href="/${route(item)}">${esc(item.product_name)}</a></td><td>${esc(item.category)}</td><td>${esc(item.subscription_duration)}</td><td>PKR ${Number(item.price_pkr).toLocaleString("en-PK")}</td><td>${esc(item.data_verification_status)}</td><td><a href="${esc(item.source_product_url)}" rel="nofollow noopener noreferrer" target="_blank">Official product site</a></td></tr>`).join("\n");
const categoryRows = categories.map((category) => `<li><strong>${esc(category)}:</strong> ${products.filter((item) => item.category === category).length} listed plans</li>`).join("");

const html = `<!doctype html>
<html lang="en-PK"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Subscription Price Index Pakistan 2026 | AI Tools Pak</title>
<meta name="description" content="A transparent, Pakistan-focused index of ${products.length} AI subscription listings in PKR, with methodology, update date and source links.">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"><meta name="author" content="AI Tools Pak">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests"><meta name="referrer" content="strict-origin-when-cross-origin">
<meta property="og:type" content="article"><meta property="og:url" content="${SITE}/ai-subscription-price-index-pakistan/"><meta property="og:title" content="AI Subscription Price Index Pakistan 2026"><meta property="og:description" content="${products.length} AI subscription listings in PKR with transparent methodology."><meta property="og:image" content="${SITE}/og-image.png"><meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${SITE}/ai-subscription-price-index-pakistan/"><link rel="stylesheet" href="../styles.css"><link rel="icon" href="/favicon.ico">
</head><body>
<header class="simple-header"><nav class="simple-nav" aria-label="Primary navigation"><a class="brand" href="../"><img class="brand-logo" src="../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a><div class="simple-links"><a href="../#product-guides">Products</a><a href="../blog/">Blog</a><a href="../about-us/">About</a><a href="../contact-us/">Contact</a></div></nav></header>
<main><section class="page-hero"><p class="page-kicker">Original data resource</p><h1>AI Subscription Price Index Pakistan — 2026</h1><p class="hero-copy">A citable snapshot of ${products.length} AI subscription listings in PKR for Pakistani buyers, covering ${categories.length} workflow categories.</p><p class="date-note">Last updated: August 19, 2026. Data owner: AI Tools Pak.</p></section>
<section class="page-layout"><article class="glass-panel page-card article-body"><h2>What this index measures</h2><p>This index reports the current PKR prices shown in the AI Tools Pak catalog. It is designed to help researchers, writers and buyers understand the range of locally listed AI subscription options. It does <strong>not</strong> claim to be the official vendor price, an exchange-rate conversion, or a universal market average. Availability, access model and final order details must be confirmed before payment.</p><h2>Coverage</h2><ul>${categoryRows}</ul><h2>Current PKR price index</h2><div style="overflow-x:auto"><table><thead><tr><th>Plan</th><th>Category</th><th>Duration</th><th>Listed price</th><th>Verification</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div><h2>Methodology and citation</h2><ol><li>We use the version-controlled <a href="https://github.com/omiijutt120/ai-tools-pak/blob/main/data/products.csv">catalog dataset</a> as the source of the listed PKR figures.</li><li>Each record has a product-source link for identity verification. Vendor pricing and the listed Pakistan price may differ because plan, duration, delivery and access models differ.</li><li>Rows marked “Confirm before ordering” are not treated as independently verified price claims.</li><li>The index is regenerated when the catalog changes. Cite the page URL and its visible update date, rather than copying a price without context.</li></ol><p><strong>Suggested citation:</strong> “AI Tools Pak, <a href="${SITE}/ai-subscription-price-index-pakistan/">AI Subscription Price Index Pakistan (2026)</a>, accessed August 19, 2026.”</p><h2>Use and corrections</h2><p>Journalists, educators and publishers may link to this page as a source with attribution. To flag a price or plan correction, contact <a href="../contact-us/">AI Tools Pak support</a> with the relevant official source.</p></article><aside class="page-side"><div class="glass-panel page-card"><h3>For publishers</h3><p>Use this source for Pakistan-local listed-price context, and link to the index rather than reproducing a table without its methodology.</p><p><a href="https://github.com/omiijutt120/ai-tools-pak/blob/main/data/products.csv">View the source dataset</a></p></div></aside></section></main>
<footer class="footer"><div><a class="brand" href="../"><img class="brand-logo" src="../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a><p>Pakistan-focused AI subscription catalog with PKR pricing.</p></div><nav class="footer-links"><a href="../#product-guides">Products</a><a href="../blog/">Blog</a><a href="../contact-us/">Contact</a><a href="../frequently-asked-questions/">FAQ</a></nav></footer>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Dataset","name":"AI Subscription Price Index Pakistan — 2026","description":"A transparent snapshot of ${products.length} AI subscription listings in PKR for Pakistan.","url":"${SITE}/ai-subscription-price-index-pakistan/","creator":{"@type":"Organization","name":"AI Tools Pak","url":"${SITE}/"},"dateModified":"${UPDATED}","inLanguage":"en-PK","distribution":{"@type":"DataDownload","encodingFormat":"text/csv","contentUrl":"https://github.com/omiijutt120/ai-tools-pak/blob/main/data/products.csv"}}</script>
</body></html>`;
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, html);
console.log(`Price index written: ${products.length} priced listings across ${categories.length} categories`);
