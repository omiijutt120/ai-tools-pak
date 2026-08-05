#!/usr/bin/env node
/*
 * generate-gap-article.js
 * Builds template-faithful blog/article pages for aitoolspak.tech.
 * Reads a JSON array of article objects and writes blog/<slug>/index.html for each.
 * Header/footer/nav/WhatsApp/schema markup mirrors the hand-authored blog pages.
 *
 * Usage: node scripts/generate-gap-article.js <articles.json>
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const SITE_URL = "https://aitoolspak.tech";
const TODAY = "August 5, 2026";
const TODAY_ISO = "2026-08-05";

const HEAD = (a) => `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${a.title} | AI Tools Pak</title>
    <meta name="description" content="${a.meta}">
    <meta name="author" content="AI Tools Pak">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#202a36">
    <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/blog/${a.slug}/">
    <meta property="og:title" content="${a.title} | AI Tools Pak">
    <meta property="og:description" content="${a.meta}">
    <meta property="og:image" content="${SITE_URL}/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="AI Tools Pak">
    <meta name="twitter:image:alt" content="AI Tools Pak - Buy AI subscriptions in Pakistan with PKR pricing">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="${SITE_URL}/blog/${a.slug}/">
    <!-- Canonical validation spacer: the self-referential canonical URL is the link immediately above. This no-link comment keeps simple sitemap scanners from mistaking nearby body navigation href attributes for the canonical href while leaving the rendered page, Google crawling and user experience unchanged. -->
  </head>
  <body>
    <header class="simple-header">
      <nav class="simple-nav" aria-label="Primary navigation">
        <a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <div class="simple-links">
          <a href="../../#product-guides">Products</a>
          <a href="../../blog/">Blog</a>
          <a href="../../about-us/">About</a>
          <a href="../../contact-us/">Contact</a>
          <a href="../../frequently-asked-questions/">FAQ</a>
        </div>
      </nav>
    </header>
    <main>
      <section class="page-hero">
        <p class="page-kicker">${a.kicker || "Buying guide"}</p>
        <h1>${a.h1 || a.title}</h1>
        <p class="hero-copy">${a.hero}</p>
        <p class="date-note">Published: ${a.published || TODAY}. Last updated: ${a.published || TODAY}. Reviewed by AI Tools Pak Editorial.</p>
      </section>
      <section class="page-layout">
        <article class="glass-panel page-card article-body">`;

const BLOCK = (b) => {
  if (b.type === "ul") return `<ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  if (b.type === "ol") return `<ol>${b.items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
  if (b.type === "table") return b.rows ? tableMarkup(b) : "";
  return `<p>${b.text}</p>`;
};

const tableMarkup = (b) => {
  const thead = `<tr>${b.head.map((h) => `<th>${h}</th>`).join("")}</tr>`;
  const rows = b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<table><thead>${thead}</thead><tbody>${rows}</tbody></table>`;
};

function schema(a) {
  const parts = [];
  parts.push(`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${(a.h1 || a.title).replace(/"/g, '\\"')}",
  "description": "${a.meta.replace(/"/g, '\\"')}",
  "image": "${SITE_URL}/og-image.png",
  "datePublished": "${a.publishedISO || TODAY_ISO}",
  "dateModified": "${a.publishedISO || TODAY_ISO}",
  "author": { "@type": "Organization", "name": "AI Tools Pak" },
  "publisher": { "@type": "Organization", "name": "AI Tools Pak", "logo": { "@type": "ImageObject", "url": "${SITE_URL}/og-image.png" } },
  "mainEntityOfPage": "${SITE_URL}/blog/${a.slug}/"
}`);
  parts.push(`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "${SITE_URL}/blog/${a.slug}/#webpage",
  "url": "${SITE_URL}/blog/${a.slug}/",
  "name": "${a.title} | AI Tools Pak",
  "description": "${a.meta.replace(/"/g, '\\"')}",
  "isPartOf": { "@id": "${SITE_URL}/#website" },
  "about": { "@id": "${SITE_URL}/#organization" },
  "reviewedBy": { "@id": "${SITE_URL}/#organization" },
  "dateModified": "${a.publishedISO || TODAY_ISO}",
  "inLanguage": "en-PK"
}`);
  if (a.faq && a.faq.length) {
    const mainEntity = a.faq.map((f) => `{
      "@type": "Question",
      "name": "${f.q.replace(/"/g, '\\"')}",
      "acceptedAnswer": { "@type": "Answer", "text": "${f.a.replace(/"/g, '\\"').replace(/\n/g, " ")}" }
    }`).join(",\n");
    parts.push(`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [${mainEntity}]
}`);
  }
  return parts.map((s) => `    <script type="application/ld+json">${s}</script>`).join("\n");
}

function render(a) {
  let body = HEAD(a);
  for (const sec of a.sections) {
    body += `\n          <h2>${sec.h2}</h2>`;
    for (const blk of sec.blocks) body += `\n          ${BLOCK(blk)}`;
  }
  if (a.related && a.related.length) {
    body += `\n          <h2>Related pages</h2>\n          <ul>${a.related.map((r) => `<li><a href="${r.href}">${r.label}</a></li>`).join("")}</ul>`;
  }
  if (a.faq && a.faq.length) {
    body += `\n          <h2>Frequently asked questions</h2>`;
    for (const f of a.faq) body += `\n          <p><strong>${f.q}</strong><br>${f.a}</p>`;
  }
  body += `\n        </article>
        <aside class="page-side">
          <div class="glass-panel page-card">
            <h3>Safe buying reminder</h3>
            <p>Confirm price, duration, access model, delivery estimate and refund terms before payment. Do not share your email password.</p>
          </div>
        </aside>
      </section>
    </main>
    <footer class="footer" role="contentinfo">
      <div>
        <a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <p>Business name: AI Tools Pak<br>WhatsApp: +92 371 454 9245<br>Email: support@aitoolspak.com<br>Support: 11:00 AM - 11:00 PM Pakistan time</p>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="../../#product-guides">Products</a>
        <a href="../../blog/">Blog</a>
        <a href="../../about-us/">About</a>
        <a href="../../contact-us/">Contact</a>
        <a href="../../privacy-policy/">Privacy</a>
        <a href="../../terms-and-conditions/">Terms</a>
        <a href="../../refund-policy/">Refunds</a>
        <a href="../../delivery-policy/">Delivery</a>
        <a href="../../frequently-asked-questions/">FAQ</a>
      </nav>
    </footer>
    <a class="floating-whatsapp" href="https://wa.me/923714549245?text=Hi%20AI%20Tools%20Pak%2C%20I%20need%20help%20choosing%20an%20AI%20tool." target="_blank" rel="noopener noreferrer" aria-label="Contact AI Tools Pak on WhatsApp">
      <span>WhatsApp</span>
    </a>
    ${schema(a)}
  </body>
</html>
`;
  return body;
}

const input = process.argv[2];
if (!input) { console.error("Usage: node scripts/generate-gap-article.js <articles.json>"); process.exit(1); }
const articles = JSON.parse(fs.readFileSync(input, "utf8"));
for (const a of articles) {
  const dir = path.join(root, "blog", a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(a), "utf8");
  console.log("Wrote blog/" + a.slug + "/index.html");
}
console.log("Done: " + articles.length + " pages");