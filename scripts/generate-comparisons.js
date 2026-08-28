#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const SITE = "https://aitoolspak.tech";
const catalogMeta = JSON.parse(fs.readFileSync(path.join(root, "data", "catalog-meta.json"), "utf8"));
const displayDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${catalogMeta.last_verified}T00:00:00Z`));

const guides = [
  { path: "chatgpt-plus-vs-claude-pro-pakistan", slugs: ["chatgpt-plus", "claude-ai"], title: "ChatGPT Plus vs Claude Pro in Pakistan" },
  { path: "chatgpt-plus-vs-gemini-pro-pakistan", slugs: ["chatgpt-plus", "gemini-pro"], title: "ChatGPT Plus vs Gemini Pro in Pakistan" },
  { path: "claude-pro-vs-gemini-pro-pakistan", slugs: ["claude-ai", "gemini-pro"], title: "Claude Pro vs Gemini Pro in Pakistan" },
  { path: "grammarly-vs-quillbot-vs-wordai-pakistan", slugs: ["grammarly-pro", "quillbot", "wordai"], title: "Grammarly vs QuillBot vs WordAI in Pakistan" },
  { path: "capcut-pro-vs-runway-ml-pakistan", slugs: ["capcut-pro", "runway-ml-unlimited-generations"], title: "CapCut Pro vs Runway ML in Pakistan" },
  { path: "elevenlabs-vs-playht-pakistan", slugs: ["elevenlabs-creator-private", "playht"], title: "ElevenLabs vs PlayHT in Pakistan" },
  { path: "helium10-vs-semrush-vs-vidiq-pakistan", slugs: ["helium-10-platinum", "semrush-pro", "vidiq"], title: "Helium 10 vs SEMrush Pro vs vidIQ in Pakistan" }
];

const raw = fs.readFileSync(path.join(root, "products-data.js"), "utf8");
const match = raw.match(/window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (!match) throw new Error("Run scripts/generate-products.js before comparisons.");
const products = JSON.parse(match[1]);
const bySlug = new Map(products.map((product) => [product.slug, product]));
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function recommendation(product) {
  const feature = product.keyFeatures.split(";").slice(0, 2).map((item) => item.trim().toLowerCase()).join(" and ");
  return `Pick ${product.name} when your main workflow needs ${feature}. Its catalog listing is ${product.subscriptionDuration}, ${product.accessType.toLowerCase()}, with ${product.creditsOrUsageLimit.toLowerCase()}. Confirm the exact limits before payment.`;
}

function page(guide, items) {
  const canonical = `${SITE}/comparisons/${guide.path}/`;
  const names = items.map((item) => item.name).join(" vs ");
  const description = `Compare ${names} in Pakistan using catalog-sourced PKR price, duration, access, usage limits and workflow features.`;
  const rows = items.map((item) => `<tr><th scope="row"><a href="../../${item.guideUrl}">${esc(item.name)}</a></th><td>PKR ${item.sellingPricePkr.toLocaleString("en-PK")}</td><td>${esc(item.subscriptionDuration)}</td><td>${esc(item.accessType)}</td><td>${esc(item.creditsOrUsageLimit)}</td><td>${esc(item.keyFeatures)}</td></tr>`).join("\n");
  const picks = items.map((item) => `<section><h3>Choose ${esc(item.name)} if…</h3><p>${esc(recommendation(item))}</p><p><a href="../../${item.guideUrl}">Check ${esc(item.name)} price and ordering details</a></p></section>`).join("\n");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: guide.title,
        description,
        image: `${SITE}/og-image.png`,
        datePublished: catalogMeta.last_verified,
        dateModified: catalogMeta.last_verified,
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` }
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: guide.title,
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE}/comparisons/` },
          { "@type": "ListItem", position: 3, name: guide.title, item: canonical }
        ]
      }
    ]
  };
  return `<!doctype html>
<html lang="en-PK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(guide.title)} | AI Tools Pak</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self'; upgrade-insecure-requests"><meta name="referrer" content="strict-origin-when-cross-origin"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../../styles.css"><meta property="og:type" content="article"><meta property="og:title" content="${esc(guide.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}/og-image.png"><meta name="twitter:card" content="summary_large_image"></head>
<body><header class="simple-header"><nav class="simple-nav" aria-label="Primary navigation"><a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a><div class="simple-links"><a href="../../#catalog">AI tools</a><a href="../../blog/">Blog</a><a href="../../about-us/">About</a><a href="../../contact-us/">Contact</a></div></nav></header>
<main><nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../">Home</a><span>/</span><span>Comparisons</span><span>/</span><span>${esc(guide.title)}</span></nav><section class="page-hero"><p class="page-kicker">Pakistan buying comparison</p><h1>${esc(guide.title)}</h1><p class="hero-copy">${esc(description)} Prices and plan facts below come from <a href="../../data/products.csv">the catalog dataset</a>; confirm availability and final terms on WhatsApp before paying.</p><p class="date-note">Last updated: ${displayDate}.</p></section>
<section class="page-layout"><article class="glass-panel page-card article-body"><h2>Side-by-side comparison</h2><div style="overflow-x:auto"><table class="comparison-table"><thead><tr><th>Tool</th><th>Listed PKR price</th><th>Duration</th><th>Access</th><th>Usage limit</th><th>Catalog features</th></tr></thead><tbody>${rows}</tbody></table></div><p>The cheapest row is not automatically the best choice: durations, credits, access models and workflows differ. Prices are local catalog listings, not claims about official vendor pricing.</p><h2>Who should pick which?</h2>${picks}<h2>Before you pay from Pakistan</h2><p>International cards can be declined and foreign-currency charges can change the final total. AI Tools Pak confirms the PKR price, duration, access model, activation route and refund condition on WhatsApp before payment. Never share your email password.</p><h2>Method</h2><p>This page is generated from <a href="../../data/products.csv">data/products.csv</a>. No unlisted feature, price, benchmark, review or competitor statistic has been added. When a listing says “confirm before ordering,” verify it with support before relying on it.</p></article><aside class="page-side"><div class="glass-panel page-card"><h3>Quick rule</h3><p>Choose by workflow first, then compare duration, credits, access and price like-for-like.</p><a class="button primary" href="https://wa.me/923714549245?text=${encodeURIComponent(`Hi AI Tools Pak, please help me compare ${names}.`)}" target="_blank" rel="noopener noreferrer">Compare on WhatsApp</a></div></aside></section></main>
<footer class="footer"><div><a class="brand" href="../../"><span>AI Tools Pak</span></a><p>PKR prices and safer pre-payment checks for Pakistani buyers.</p></div><nav class="footer-links"><a href="../../refund-policy/">Refunds</a><a href="../../delivery-policy/">Delivery</a><a href="../../contact-us/">Contact</a></nav></footer><script type="application/ld+json">${JSON.stringify(schema)}</script></body></html>`;
}

for (const guide of guides) {
  const items = guide.slugs.map((slug) => bySlug.get(slug));
  if (items.some((item) => !item)) throw new Error(`Missing catalog product for ${guide.path}`);
  const dir = path.join(root, "comparisons", guide.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(guide, items), "utf8");
}
console.log(`comparison pages written: ${guides.length}`);
