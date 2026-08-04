#!/usr/bin/env node
/**
 * generate-blog-ai-tools-guide.js
 * Rebuilds /blog/ai-tools-pakistan-complete-guide/index.html — a massive
 * data-rich guide listing ALL AI Tools Pak products (with PKR prices and
 * buy links) plus a large AI API Credits section.
 * Sources of truth: products-data.js (no drift).
 *
 * Usage: node scripts/generate-blog-ai-tools-guide.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const SITE_URL = "https://aitoolspak.tech";
const WA = "923714549245";
const SLUG = "ai-tools-pakistan-complete-guide";
const URL = `${SITE_URL}/blog/${SLUG}/`;

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8");
}

const data = read("products-data.js");
const arr = data.match(/window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (!arr) throw new Error("products-data.js parse failed");
const products = JSON.parse(arr[1]);

const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const pkr = (n) => (n ? "PKR " + Number(n).toLocaleString("en-PK") : "");
const waOrder = (name, price) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(
    "Hi AI Tools Pak, I want to order " +
      name +
      (price ? " (" + pkr(price) + ")" : "") +
      ". Please confirm availability."
  )}`;

// Group products by category
const categories = {};
for (const p of products) {
  (categories[p.category] = categories[p.category] || []).push(p);
}

// ---- Build product directory HTML ----------------------------------------
let directory = "";
for (const [cat, items] of Object.entries(categories)) {
  directory += `          <article class="glass-panel page-card">
            <h2>${esc(cat)}</h2>
            <ul class="tool-directory">\n`;
  for (const p of items) {
    directory += `              <li class="tool-entry">
                <h3><a href="../../${p.guideUrl}">${esc(p.name)}</a></h3>
                <ul class="tool-facts">
                  <li><strong>Price:</strong> ${pkr(p.sellingPricePkr)}${p.compareAtPricePkr ? ` (was ${pkr(p.compareAtPricePkr)}, ${p.discountPercent || 0}% off)` : ""} ${esc(p.subscriptionDuration || (p.durationMonths ? p.durationMonths + " month(s)" : ""))}</li>
                  <li><strong>Access:</strong> ${esc(p.accessType)} · <strong>Delivery:</strong> ${esc(p.deliveryMethod)}</li>
                  <li><strong>Features:</strong> ${esc(p.keyFeatures)}</li>
                  <li><strong>About:</strong> ${esc(p.shortDescription)}</li>
                </ul>
                <p class="tool-buy">
                  <a class="button small" href="../../${p.guideUrl}">View details &amp; buy</a>
                  <a class="button small accent" target="_blank" rel="noopener noreferrer" href="${waOrder(p.name, p.sellingPricePkr)}">Order on WhatsApp</a>
                </p>
              </li>\n`;
  }
  directory += `            </ul>
          </article>\n`;
}

// ---- API Credits section (based on the real enterprise page, expanded) ----
const apiCreditsSection = `          <article class="glass-panel page-card">
            <h2>AI API Credits for Businesses &amp; Developers</h2>
            <p>Beyond ready-made subscriptions, AI Tools Pak also supplies <a href="../../enterprise-ai-api-credits/">AI API credits at wholesale pricing</a> for teams that build their own AI applications. API credits let your software call hosted AI models directly, instead of using consumer apps.</p>
            <h3>What are AI API credits?</h3>
            <p>AI API credits are prepaid usage for calling hosted AI models over an API. Instead of logging into ChatGPT or Claude as a user, your application sends requests to the model and pays per token / per request. AI Tools Pak supplies bulk token packages at competitive wholesale pricing, with custom quotes based on your monthly token usage, chosen models, throughput and long-term requirements.</p>
            <h3>API providers available</h3>
            <div class="table-scroll">
              <table class="comparison-table">
                <caption>Supported AI API providers</caption>
                <thead><tr><th>Provider</th><th>Model families</th></tr></thead>
                <tbody>
                  <tr><td>OpenAI</td><td>GPT-4 and newer GPT chat models, o-series reasoning models</td></tr>
                  <tr><td>Anthropic</td><td>Claude (Opus, Sonnet, Haiku) API models</td></tr>
                  <tr><td>Google</td><td>Gemini Flash and Gemini Pro API models</td></tr>
                  <tr><td>DeepSeek</td><td>DeepSeek Chat and DeepSeek Reasoner</td></tr>
                  <tr><td>xAI</td><td>Grok API models</td></tr>
                  <tr><td>Meta</td><td>Llama API models</td></tr>
                  <tr><td>Alibaba</td><td>Qwen API models</td></tr>
                </tbody>
              </table>
            </div>
            <p class="plan-note">Model names, access methods and availability can change. Confirm the exact current model list and regional availability on WhatsApp before payment.</p>
            <h3>How bulk API credit pricing works</h3>
            <p>We do not publish one fixed price because API credits are quoted around your usage. Your quote depends on:</p>
            <ul>
              <li>Monthly token usage (from modest to multi-billion token scale)</li>
              <li>Selected AI models and providers</li>
              <li>Required throughput and concurrency</li>
              <li>Long-term supply and recurring order needs</li>
            </ul>
            <p>Message us on WhatsApp with your expected monthly usage and the models you need, and we will send a custom quote and delivery timeline.</p>
            <h3>Built for large-scale AI</h3>
            <p>AI API credits are a fit for teams building: AI SaaS platforms, AI chatbots and customer support, AI agents and automation, coding assistants, and content generation or research systems. We support requirements from millions of tokens to multi-billion token usage depending on your project and agreement, and we avoid misleading "unlimited" promises because real AI providers set usage limits.</p>
            <h3>Why choose AI Tools Pak for API credits</h3>
            <ul>
              <li>Bulk API token packages at competitive wholesale pricing</li>
              <li>Multiple AI providers through one supplier</li>
              <li>Custom packages matched to recurring order needs</li>
              <li>Fast delivery after order confirmation</li>
              <li>Direct WhatsApp support in Pakistan time</li>
              <li>Written order confirmation with price, tokens and timeline</li>
            </ul>
            <h3>How to order API credits</h3>
            <ol>
              <li>Tell us your AI model and expected monthly token usage.</li>
              <li>Receive a custom quote with pricing and delivery.</li>
              <li>Confirm the order on WhatsApp.</li>
              <li>Start using your API credits.</li>
            </ol>
            <p><a class="button primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi AI Tools Pak, I want a quote for AI API credits.")}">Request Custom API Credit Quote</a></p>
          </article>`;

// ---- General FAQ ----------------------------------------------------------
const faqs = [
  ["How do I buy AI tools in Pakistan from AI Tools Pak?", "Browse the directory below, open any product page to see details, then order on WhatsApp. Confirm the current PKR price, duration, access model and delivery estimate before payment."],
  ["Do you offer AI subscriptions with PKR prices?", "Yes. AI Tools Pak lists PKR prices for every subscription on each product page, and all orders can be confirmed and paid after a WhatsApp conversation."],
  ["What is the best cheap AI tool subscription in Pakistan?", "It depends on your need. ChatGPT Plus is a strong all-round choice. For long writing and research, Claude Pro is popular. See the directory below and the product pages for full details."],
  ["Can I buy AI API credits instead of a subscription?", "Yes. If you are a developer or business building your own AI application, AI Tools Pak supplies bulk AI API credits for OpenAI, Claude, Gemini, DeepSeek, Grok, Llama and Qwen at wholesale pricing."],
  ["How do I order AI API credits?", "Message us on WhatsApp with your models and expected monthly token usage for a custom quote, then confirm the order and delivery timeline."],
  ["Are the listed AI Tools Pak prices current?", "Prices update as availability and the exchange rate change. Always confirm the exact current PKR amount on WhatsApp before paying."],
];
let faqHtml = "";
for (const [q, a] of faqs) {
  faqHtml += `            <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>\n`;
}

// ---- Schema JSON-LD -------------------------------------------------------
const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "All AI tools available in Pakistan",
  description: "Complete directory of AI tool subscriptions sold by AI Tools Pak with PKR prices.",
  numberOfItems: products.length,
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: `${SITE_URL}/${p.guideUrl}`,
  })),
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([n, a]) => ({
    "@type": "Question",
    name: n,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Tools in Pakistan 2026: Complete Directory of All Subscriptions, PKR Prices & API Credits",
  description: "The complete AI Tools Pak directory: every AI subscription with its PKR price, features and buy links, plus a large guide to AI API credits for businesses.",
  image: `${SITE_URL}/og-image.png`,
  datePublished: "2026-08-04",
  dateModified: "2026-08-04",
  author: { "@type": "Organization", name: "AI Tools Pak" },
  publisher: { "@type": "Organization", name: "AI Tools Pak", logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` } },
  mainEntityOfPage: URL,
};

const pageHtml = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI Tools in Pakistan 2026: Complete Directory of All Subscriptions, PKR Prices &amp; API Credits</title>
    <meta name="description" content="Complete AI Tools Pak directory 2026: every AI subscription with PKR price, features and buy links, plus a full guide to AI API credits (OpenAI, Claude, Gemini, DeepSeek) for businesses.">
    <meta name="author" content="AI Tools Pak">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#202a36">
    <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${URL}">
    <meta property="og:title" content="AI Tools in Pakistan 2026: Complete Directory of All Subscriptions, PKR Prices &amp; API Credits">
    <meta property="og:description" content="Every AI subscription with PKR price, features and buy links, plus a full guide to AI API credits for businesses.">
    <meta property="og:image" content="https://aitoolspak.tech/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="AI Tools Pak">
    <meta name="twitter:image:alt" content="AI Tools Pak - Complete AI tools directory in Pakistan with PKR pricing">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="${URL}">
  </head>
  <body>
    <header class="simple-header">
      <nav class="simple-nav" aria-label="Primary navigation">
        <a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <div class="simple-links">
          <a href="../../#product-guides">Products</a>
          <a href="../../#catalog">All AI tools</a>
          <a href="../../social-media-services/">Social services</a>
          <a href="../../blog/">Blog</a>
          <a href="../../about-us/">About</a>
          <a href="../../contact-us/">Contact</a>
        </div>
      </nav>
    </header>
    <main>
      <section class="page-hero">
        <p class="page-kicker">Complete directory</p>
        <h1>AI Tools in Pakistan 2026: Full Directory of All Subscriptions, PKR Prices &amp; API Credits</h1>
        <p class="hero-copy">Every AI subscription sold by AI Tools Pak in one place, with current PKR prices, features and direct buy links &#8212; plus a complete guide to AI API credits for businesses and developers.</p>
        <p class="date-note">Published: August 4, 2026. Last updated: August 4, 2026. Reviewed by AI Tools Pak Editorial.</p>
      </section>
      <section class="page-layout">
        <div class="page-main">
          <article class="glass-panel page-card">
            <h2>Browse all AI tools with PKR prices</h2>
            <p>Every tool below is orderable in Pakistan at a confirmed PKR price by WhatsApp. Open any product page for full plan details, safety checks and FAQs, or order directly from the list.</p>
          </article>
${directory}
${apiCreditsSection}
          <article class="glass-panel page-card">
            <h2>Buying AI tools in Pakistan safely</h2>
            <ul>
              <li>Always confirm the final payable amount in PKR before paying.</li>
              <li>Confirm the access model (private, shared, account-based or activation-based).</li>
              <li>Confirm the plan duration and delivery estimate.</li>
              <li>Keep the confirmed terms in WhatsApp so the price, duration and warranty are in writing.</li>
              <li>Never share your email password.</li>
              <li>Treat exaggerated "lifetime unlimited" or "official reseller" claims without proof with caution.</li>
            </ul>
          </article>
          <article class="glass-panel page-card faq">
            <h2>Frequently asked questions about AI tools in Pakistan</h2>
${faqHtml}          </article>
          <article class="glass-panel page-card">
            <h2>Related pages</h2>
            <ul>
              <li><a href="../../#catalog">Browse the full AI tools catalog</a></li>
              <li><a href="../../enterprise-ai-api-credits/">Enterprise AI API credits</a></li>
              <li><a href="../../social-media-services/">Social media services in Pakistan</a></li>
              <li><a href="../../blog/">All buying guides</a></li>
              <li><a href="../../frequently-asked-questions/">General FAQ</a></li>
            </ul>
          </article>
        </div>
        <aside class="page-side">
          <div class="glass-panel page-card">
            <h3>Order any tool</h3>
            <p>Send us the tool you need on WhatsApp and we will confirm the current PKR price, duration and delivery before you pay.</p>
          </div>
          <a class="button primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi AI Tools Pak, I want to order an AI tool.")}">Order on WhatsApp</a>
          <div class="glass-panel page-card">
            <h3>Non-affiliation note</h3>
            <p>AI Tools Pak does not claim official partnership or authorization from OpenAI, Anthropic, Google, Meta, Alibaba, Canva or other owners unless written authorization exists. Product and model names are the property of their respective owners.</p>
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
        <a href="../../#catalog">AI tools</a>
        <a href="../../social-media-services/">Social media services</a>
        <a href="../../about-us/">About</a>
        <a href="../../contact-us/">Contact</a>
        <a href="../../privacy-policy/">Privacy</a>
        <a href="../../terms-and-conditions/">Terms</a>
        <a href="../../refund-policy/">Refunds</a>
        <a href="../../delivery-policy/">Delivery</a>
        <a href="../../frequently-asked-questions/">FAQ</a>
      </nav>
    </footer>
    <a class="floating-whatsapp" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi AI Tools Pak, I need help choosing an AI tool.")}" target="_blank" rel="noopener noreferrer" aria-label="Contact AI Tools Pak on WhatsApp">
      <span>WhatsApp</span>
    </a>
    <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(itemList)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  </body>
</html>
`;

const outPath = path.join(root, "blog", SLUG, "index.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, pageHtml, "utf8");
console.log(
  `Wrote blog/${SLUG}/index.html: ${products.length} products, ` +
    `page ${(pageHtml.length / 1024).toFixed(1)} KB, ` +
    `API credits section ${(apiCreditsSection.length / 1024).toFixed(1)} KB`
);