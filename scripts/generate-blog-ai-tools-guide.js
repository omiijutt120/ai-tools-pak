#!/usr/bin/env node
/**
 * generate-blog-ai-tools-guide.js
 * Rebuilds /blog/ai-tools-pakistan-complete-guide/index.html — a massive
 * data-rich guide listing ALL AI Tools Pak products (full descriptions, PKR
 * prices, plan details, buy links) plus comparison tables, a full price
 * index, an expanded AI API Credits section, glossary and large FAQ.
 * Source of truth: products-data.js (no drift).
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
const catNames = Object.keys(categories).sort();
const allPrices = products.map((p) => p.sellingPricePkr || 0);
const minPrice = Math.min(...allPrices);
const maxPrice = Math.max(...allPrices);
const avgPrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);

// ---- 1) FULL product directory (every field) ------------------------------
let directory = "";
for (const cat of catNames) {
  const items = categories[cat].sort((a, b) => a.sellingPricePkr - b.sellingPricePkr);
  directory += `          <article class="glass-panel page-card">
            <h2>${esc(cat)} <span class="tool-count">(${items.length} tools)</span></h2>
            <ul class="tool-directory">\n`;
  for (const p of items) {
    directory += `              <li class="tool-entry">
                <h3><a href="../../${p.guideUrl}">${esc(p.name)}</a></h3>
                <p class="tool-sku">SKU: ${esc(p.sku)} · ${esc(p.planTier || "Standard plan")} · ${esc(p.dataVerificationStatus || "Verified")}</p>
                <ul class="tool-facts">
                  <li><strong>Price:</strong> ${pkr(p.sellingPricePkr)}${p.compareAtPricePkr ? ` <s>${pkr(p.compareAtPricePkr)}</s> (${p.discountPercent || 0}% off)` : ""}${p.basePricePkr ? ` · base ${pkr(p.basePricePkr)}` : ""}</li>
                  <li><strong>Duration:</strong> ${esc(p.subscriptionDuration || (p.durationMonths ? p.durationMonths + " month(s)" : ""))}${p.durationMonths ? ` (${p.durationMonths} month${p.durationMonths > 1 ? "s" : ""})` : ""}</li>
                  <li><strong>Access &amp; delivery:</strong> ${esc(p.accessType)} · ${esc(p.deliveryMethod)}</li>
                  <li><strong>Credits / usage:</strong> ${esc(p.creditsOrUsageLimit || "Standard usage")}</li>
                  <li><strong>Key features:</strong> ${esc(p.keyFeatures)}</li>
                  <li><strong>Good for:</strong> ${esc(p.fullDescription || p.shortDescription)}</li>
                  <li><strong>Official source:</strong> <a href="${esc(p.sourceProductUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.sourceProductUrl.replace(/^https?:\/\/(www\.)?/, ""))}</a></li>
                </ul>
                <p class="tool-buy">
                  <a class="button small" href="../../${p.guideUrl}">View full details &amp; buy</a>
                  <a class="button small accent" target="_blank" rel="noopener noreferrer" href="${waOrder(p.name, p.sellingPricePkr)}">Order ${esc(p.name)} on WhatsApp</a>
                </p>
              </li>\n`;
  }
  directory += `            </ul>
          </article>\n`;
}

// ---- 2) Category at a glance ----------------------------------------------
let catGlance = "";
for (const cat of catNames) {
  const items = categories[cat];
  const cMin = Math.min(...items.map((p) => p.sellingPricePkr));
  const cMax = Math.max(...items.map((p) => p.sellingPricePkr));
  catGlance += `              <li class="cat-chip"><strong>${esc(cat)}</strong><span>${items.length} tool${items.length > 1 ? "s" : ""} · ${pkr(cMin)}–${pkr(cMax)}</span></li>\n`;
}

// ---- 3) AI Assistants comparison table ------------------------------------
const assistants = (categories["AI Assistants"] || []).sort((a, b) => a.sellingPricePkr - b.sellingPricePkr);
let asstTable = "";
for (const p of assistants) {
  asstTable += `                  <tr><td><a href="../../${p.guideUrl}">${esc(p.name)}</a></td><td>${pkr(p.sellingPricePkr)}</td><td>${esc(p.subscriptionDuration || "")}</td><td>${esc(p.creditsOrUsageLimit || "Standard")}</td><td>${esc(p.keyFeatures)}</td><td><a class="button small" href="../../${p.guideUrl}">Buy</a></td></tr>\n`;
}

// ---- 4) Full price index (all tools, low -> high) --------------------------
const sorted = [...products].sort((a, b) => a.sellingPricePkr - b.sellingPricePkr);
let priceIndex = "";
sorted.forEach((p, i) => {
  priceIndex += `                  <tr><td>${i + 1}</td><td><a href="../../${p.guideUrl}">${esc(p.name)}</a></td><td>${esc(p.category)}</td><td>${pkr(p.sellingPricePkr)}</td><td>${esc(p.subscriptionDuration || "")}</td><td><a href="../../${p.guideUrl}">Details</a></td></tr>\n`;
});

// ---- 5) Voice / coding snapshots (if categories exist) --------------------
function catTable(catName) {
  const items = (categories[catName] || []).sort((a, b) => a.sellingPricePkr - b.sellingPricePkr);
  if (!items.length) return "";
  let rows = "";
  for (const p of items) {
    rows += `                  <tr><td><a href="../../${p.guideUrl}">${esc(p.name)}</a></td><td>${pkr(p.sellingPricePkr)}</td><td>${esc(p.subscriptionDuration || "")}</td><td>${esc(p.creditsOrUsageLimit || "Standard")}</td><td>${esc(p.keyFeatures)}</td></tr>\n`;
  }
  return `<article class="glass-panel page-card">
            <h2>${esc(catName)} at a glance</h2>
            <div class="table-scroll">
              <table class="comparison-table">
                <thead><tr><th>Tool</th><th>PKR price</th><th>Duration</th><th>Credits / usage</th><th>Key features</th></tr></thead>
                <tbody>
${rows}                </tbody>
              </table>
            </div>
          </article>
`;
}
const voiceSnapshot = catTable("AI Voice");
const codingSnapshot = catTable("Development and Coding");

const bestPicks = `          <article class="glass-panel page-card">
            <h2>Best AI tool by use case in Pakistan</h2>
            <p>Not sure which tool you need? Match your goal to the right subscription sold by AI Tools Pak.</p>
            <div class="table-scroll">
              <table class="comparison-table">
                <thead><tr><th>Use case</th><th>Recommended tool</th><th>Why it fits</th></tr></thead>
                <tbody>
                  <tr><td>All-round everyday assistant</td><td>ChatGPT Plus</td><td>Covers writing, research, coding help, brainstorming and study in one capable assistant.</td></tr>
                  <tr><td>Long writing and careful research</td><td>Claude Pro</td><td>Known for structured output, long-document help, rewriting and code explanation.</td></tr>
                  <tr><td>Software developers and coders</td><td>Claude Pro / DeepSeek</td><td>Claude for code review and reasoning, DeepSeek as a budget-friendly coding and Chat choice.</td></tr>
                  <tr><td>Podcasters and voice creators</td><td>ElevenLabs Creator</td><td>AI voice, narration, dubbing and speech content with clear credit limits.</td></tr>
                  <tr><td>Social media and influencers</td><td>CapCut Pro / social services</td><td>CapCut Pro for editing; AI Tools Pak social media services for growth on Instagram, TikTok and YouTube.</td></tr>
                  <tr><td>Designers and marketers</td><td>Canva Pro</td><td>The most widely-used design subscription, with Pro features and team tools.</td></tr>
                  <tr><td>SEO and content teams</td><td>Semrush Pro</td><td>Keyword research, site audit and competitor analysis without a big budget.</td></tr>
                  <tr><td>Writers and students</td><td>Grammarly / QuillBot</td><td>Grammar correction, paraphrasing and tone polish for academic and content writing.</td></tr>
                  <tr><td>Video and avatar creators</td><td>HeyGen</td><td>AI avatar video and talking-head content at accessible pricing.</td></tr>
                  <tr><td>Image-generation creators</td><td>Leonardo AI</td><td>Affordable AI image generation for creatives and content teams.</td></tr>
                  <tr><td>Businesses building their own AI app</td><td>AI API credits</td><td>Wholesale token packages for OpenAI, Claude, Gemini, DeepSeek, Grok, Llama and Qwen.</td></tr>
                </tbody>
              </table>
            </div>
          </article>`;

const howToChoose = `          <article class="glass-panel page-card">
            <h2>How to choose the right AI subscription</h2>
            <p>Follow these four questions to pick the plan that fits you — then use the price index to stay within budget.</p>
            <ol class="steps">
              <li><strong>What will you use it for?</strong> Writing, coding, voice, video, design or research — different tools specialise in different work.</li>
              <li><strong>Which features do you need?</strong> Check the "Key features" and "Credits / usage" fields on each product page.</li>
              <li><strong>What is your budget?</strong> Use the full price index (most affordable to most expensive) to shortlist plans you can afford in PKR.</li>
              <li><strong>Private or business use?</strong> Individuals need a subscription; teams building software should ask about AI API credits.</li>
            </ol>
            <p>If you are still unsure, message AI Tools Pak on WhatsApp with your goal and budget and we will recommend a match — and confirm the current PKR price before you pay.</p>
          </article>`;

// ---- 7) API Credits mega section ------------------------------------------
const apiCreditsSection = `          <article class="glass-panel page-card">
            <h2>AI API Credits for Businesses &amp; Developers (Complete Guide)</h2>
            <p>Beyond ready-made subscriptions, AI Tools Pak also supplies <a href="../../enterprise-ai-api-credits/">AI API credits at wholesale pricing</a> for teams that build their own AI applications. API credits let your software call hosted AI models directly, instead of using consumer apps. This section explains what API credits are, how tokens and pricing work, which providers are available, who should buy them and exactly how to order in Pakistan.</p>

            <h3>What are AI API credits?</h3>
            <p>AI API credits are prepaid usage for calling hosted AI models over an API (Application Programming Interface). Instead of logging into ChatGPT or Claude as a user, your application sends requests to the model over the internet and pays per token or per request. AI Tools Pak supplies bulk token packages at competitive wholesale pricing, with custom quotes based on your monthly token usage, chosen models, throughput and long-term requirements.</p>

            <h3>What is a token?</h3>
            <p>A token is the unit AI models use to measure text. A model reads and writes text in tokens: roughly 1 token is about 3/4 of a word in English, so 1,000 tokens is roughly 750 words. Every API request consumes input tokens (the prompt) and output tokens (the answer). Larger prompts, longer answers and bigger models consume more tokens. Your monthly token volume is therefore the main driver of API credit pricing.</p>

            <h3>How bulk API credit pricing works</h3>
            <p>We do not publish one fixed price because API credits are quoted around your usage. Your quote depends on:</p>
            <ul>
              <li><strong>Monthly token usage</strong> — from modest to multi-billion token scale</li>
              <li><strong>Selected AI models and providers</strong> — different models have different cost profiles</li>
              <li><strong>Required throughput and concurrency</strong> — how many parallel requests your app makes</li>
              <li><strong>Long-term supply and recurring order needs</strong> — committed volume gets better terms</li>
            </ul>
            <p>Message us on WhatsApp with your expected monthly usage and the models you need, and we will send a custom quote and delivery timeline.</p>

            <h3>API providers and model families available</h3>
            <div class="table-scroll">
              <table class="comparison-table">
                <caption>Supported AI API providers</caption>
                <thead><tr><th>Provider</th><th>Model families</th><th>Typical use</th></tr></thead>
                <tbody>
                  <tr><td>OpenAI</td><td>GPT-4 and newer GPT chat models, o-series reasoning models</td><td>General assistants, chat apps, agents, content generation</td></tr>
                  <tr><td>Anthropic</td><td>Claude (Opus, Sonnet, Haiku) API models</td><td>Long writing, careful reasoning, coding, document analysis</td></tr>
                  <tr><td>Google</td><td>Gemini Flash and Gemini Pro API models</td><td>Multimodal input, high-volume tasks, cost-sensitive apps</td></tr>
                  <tr><td>DeepSeek</td><td>DeepSeek Chat and DeepSeek Reasoner</td><td>Coding support and budget-friendly high-volume workloads</td></tr>
                  <tr><td>xAI</td><td>Grok API models</td><td>Real-time and conversational AI features</td></tr>
                  <tr><td>Meta</td><td>Llama API models</td><td>Open-model applications, custom fine-tuning projects</td></tr>
                  <tr><td>Alibaba</td><td>Qwen API models</td><td>Multilingual apps and cost-efficient chat systems</td></tr>
                </tbody>
              </table>
            </div>
            <p class="plan-note">Model names, access methods and availability can change. Confirm the exact current model list and regional availability on WhatsApp before payment.</p>

            <h3>Who should buy AI API credits</h3>
            <p>AI API credits are a fit for teams building:</p>
            <ul>
              <li><strong>AI SaaS platforms</strong> — product features powered by AI models</li>
              <li><strong>AI chatbots and customer support</strong> — answering customers at scale</li>
              <li><strong>AI agents and automation</strong> — autonomous workflows, data processing pipelines</li>
              <li><strong>Coding assistants</strong> — code completion, review and generation tools</li>
              <li><strong>Content generation and research systems</strong> — articles, summaries, translation, analysis</li>
              <li><strong>Education and e-commerce</strong> — tutoring bots, product descriptions, recommendation engines</li>
            </ul>
            <p>We support requirements from millions of tokens to multi-billion token usage depending on your project and agreement. We avoid misleading "unlimited" promises because real AI providers set usage limits; we quote honest, workable capacity for your use case.</p>

            <h3>Why choose AI Tools Pak for API credits</h3>
            <ul>
              <li>Bulk API token packages at competitive wholesale pricing</li>
              <li>Multiple AI providers through one supplier</li>
              <li>Custom packages matched to recurring order needs</li>
              <li>Fast delivery after order confirmation</li>
              <li>Direct WhatsApp support in Pakistan time (11:00 AM – 11:00 PM)</li>
              <li>Written order confirmation with price, tokens and timeline</li>
              <li>Startups, small teams and enterprises all supported</li>
              <li>Invoices available on request for business orders</li>
            </ul>

            <h3>How to order API credits</h3>
            <ol class="steps">
              <li>Tell us your AI model and expected monthly token usage.</li>
              <li>Receive a custom quote with pricing and delivery.</li>
              <li>Confirm the order on WhatsApp.</li>
              <li>Start using your API credits.</li>
            </ol>
            <p><a class="button primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi AI Tools Pak, I want a quote for AI API credits.")}">Request Custom API Credit Quote</a></p>
          </article>`;

// ---- 7) How to buy in Pakistan ---------------------------------------------
const howToBuy = `          <article class="glass-panel page-card">
            <h2>How to buy AI tools in Pakistan from AI Tools Pak</h2>
            <p>Every tool on this page is sold by AI Tools Pak for customers in Pakistan, with support available every day from 11:00 AM to 11:00 PM Pakistan time.</p>
            <ol class="steps">
              <li><strong>Pick your tool</strong> from the directory above or the price index below.</li>
              <li><strong>Open its product page</strong> for the full plan description, safety notes and FAQs.</li>
              <li><strong>Order on WhatsApp</strong> using the button on any product page — the message is pre-filled with the tool name.</li>
              <li><strong>Confirm the details</strong>: final payable amount in PKR, plan duration, access model and delivery estimate.</li>
              <li><strong>Complete payment</strong> after written confirmation on WhatsApp.</li>
              <li><strong>Receive delivery</strong> according to the confirmed method (WhatsApp activation or account-based delivery).</li>
            </ol>
            <p>Keep the confirmed terms in WhatsApp so the price, duration and any warranty are in writing. For business or bulk needs — including AI API credits — ask for a custom quote and invoice.</p>
          </article>`;

// ---- 8) Glossary ------------------------------------------------------------
const glossary = [
  ["API", "Application Programming Interface — the way software talks to an AI model over the internet."],
  ["API credits", "Prepaid usage for calling hosted AI models; consumed per token or per request."],
  ["Token", "The text unit AI models measure usage in; roughly 1 token equals about 3/4 of an English word."],
  ["LLM", "Large Language Model — an AI model trained on huge text data that generates and understands language."],
  ["Prompt", "The text or instructions you send to an AI model."],
  ["Subscription", "A recurring plan (usually monthly) that gives access to an AI service."],
  ["Private access", "A subscription accessed by you alone, with your own credentials."],
  ["WhatsApp activation", "Delivery method where your plan is activated and set up via WhatsApp."],
  ["Throughput", "How many API requests your application can make in a given time."],
  ["Concurrency", "How many parallel API requests run at the same time."],
  ["Multimodal", "Models that can process text, images, audio and other input types."],
  ["Reasoning model", "A model that works through a problem step by step before answering."],
  ["Fine-tuning", "Customising a base model on your own data for a specific task."],
  ["Wholesale pricing", "Bulk pricing for larger volumes of tokens or services."],
];
let glossaryHtml = "";
for (const [t, d] of glossary) {
  glossaryHtml += `              <li class="gloss-item"><strong>${esc(t)}</strong> — ${esc(d)}</li>\n`;
}

// ---- 9) Large FAQ ------------------------------------------------------------
const faqs = [
  ["How do I buy AI tools in Pakistan from AI Tools Pak?", "Browse the directory above, open any product page to see the full plan details, then order on WhatsApp. Confirm the current PKR price, duration, access model and delivery estimate before payment."],
  ["What is the best affordable AI tool subscription in Pakistan?", "It depends on your need. ChatGPT Plus is a strong all-round assistant. Claude Pro suits long writing and research. For design, Canva Pro is the popular choice. Use the full price index below to compare every tool from lowest to highest PKR price."],
  ["Are the listed AI Tools Pak prices in PKR?", "Yes. Every product page shows the current PKR price, and this directory repeats them. Exchange-rate movements can change prices, so always confirm the exact final amount on WhatsApp before paying."],
  ["Do you sell AI subscriptions with private access?", "Many of our plans are private access with your own credentials, delivered by WhatsApp activation. Each product page states its access type and delivery method."],
  ["Can I buy AI API credits instead of a subscription?", "Yes. If you are a developer or business building your own AI application, AI Tools Pak supplies bulk AI API credits for OpenAI, Claude, Gemini, DeepSeek, Grok, Llama and Qwen at wholesale pricing."],
  ["How do I order AI API credits?", "Message us on WhatsApp with your models and expected monthly token usage for a custom quote, then confirm the order and delivery timeline. Startups, small teams and enterprises are all supported."],
  ["How many tokens can I get with API credits?", "Requirements can range from millions of tokens to multi-billion token scale, subject to availability and agreement. We quote honest, workable capacity rather than unrealistic 'unlimited' promises."],
  ["Do you provide invoices for business orders?", "Yes. Invoices are available on request for business orders, including API credit purchases."],
  ["How is delivery done?", "Delivery is confirmed per order on WhatsApp, most commonly by WhatsApp activation of the plan. The exact method and estimate are confirmed before payment."],
  ["What are your support hours?", "Support runs from 11:00 AM to 11:00 PM Pakistan time, every day, on WhatsApp."],
  ["Is it safe to buy AI tools online in Pakistan?", "Buy from sellers who confirm the price, duration and access model in writing before payment, keep the conversation as proof, and never share your email password. See the safety checklist below."],
  ["What payment methods do you accept?", "Payment details are confirmed on WhatsApp after the order is agreed, with the amount fixed in PKR."],
  ["Can I compare all tools by price?", "Yes — the full price index below ranks every tool from lowest to highest PKR price, so you can find the most affordable AI subscription in Pakistan at a glance."],
  ["Do you sell social media services too?", "Yes. AI Tools Pak also runs 487 priced social media services (Instagram, TikTok, YouTube, Facebook and more). See the social media services page for the full menu."],
  ["What is the difference between a subscription and API credits?", "A subscription gives you access to a consumer app (like ChatGPT Plus) for a fixed period. API credits give your own software the ability to call AI models directly, billed by usage."],
  ["Are you official resellers of OpenAI, Anthropic or Google?", "No. AI Tools Pak does not claim official partnership or authorization from OpenAI, Anthropic, Google, Meta, Alibaba or other owners unless written authorization exists. Product names belong to their owners."],
  ["Which AI assistant is best for students in Pakistan?", "For study, writing and exam prep, ChatGPT Plus is the most balanced all-round assistant. Claude Pro is a strong alternative for long essays and careful research. Compare both on their product pages."],
  ["What is the most affordable AI tool on this page?", "Use the full price index below — it ranks all 31 tools from lowest to highest PKR price, so the most affordable option is visible at a glance."],
  ["Can I buy more than one tool at once?", "Yes. Order each tool on WhatsApp, or send one message listing several tools for a combined quote and one delivery conversation."],
  ["Do you offer student discounts?", "Prices and any offers are confirmed on WhatsApp at order time. Mention your use case and we will confirm the current rate."],
  ["What happens if I have trouble with my plan after delivery?", "Contact us on WhatsApp during support hours (11:00 AM – 11:00 PM PKT) with your order details. Keep your written order confirmation for reference."],
  ["Is Gemini Pro the same as Gemini Advanced?", "The product page uses the official Google plan naming. Check the product page for the exact plan tier and duration before ordering."],
  ["Do AI API credits work with my existing code?", "Yes — you integrate the API credits into your application the same way you would use a provider API key. Confirm the exact integration and access method on WhatsApp before paying."],
  ["What is the biggest AI API package I can buy?", "Requirements from millions of tokens to multi-billion token scale can be supported subject to availability and agreement. Ask for a custom quote with your monthly usage."],
  ["How fast is delivery?", "Delivery estimates are confirmed per order on WhatsApp after payment. Most activation-based deliveries complete quickly during support hours."],
];
let faqHtml = "";
for (const [q, a] of faqs) {
  faqHtml += `            <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>\n`;
}

// ---- 10) Blog guides list ----------------------------------------------------
const blogGuides = [
  ["chatgpt-plus-price-pakistan", "ChatGPT Plus Price in Pakistan"],
  ["claude-pro-vs-chatgpt-plus-pakistani-students", "Claude vs ChatGPT for Students"],
  ["where-to-buy-ai-tools-pakistan", "Where to Buy AI Tools in Pakistan"],
  ["find-cheap-ai-subscriptions-pakistan", "affordable AI Subscriptions in Pakistan"],
  ["canva-pro-price-pakistan", "Canva Pro Price in Pakistan"],
  ["choose-ai-subscription-safely", "How to Choose an AI Subscription Safely"],
  ["free-vs-paid-ai-tools", "Free vs Paid AI Tools"],
];
let blogGuidesHtml = "";
for (const [slug, title] of blogGuides) {
  blogGuidesHtml += `              <li><a href="../../blog/${slug}/">${esc(title)}</a></li>\n`;
}

// ---- Schema ---------------------------------------------------------------
const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "All AI tools available in Pakistan",
  description: "Complete directory of AI tool subscriptions sold by AI Tools Pak with PKR prices.",
  numberOfItems: products.length,
  itemListElement: sorted.map((p, i) => ({
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
  description: "The complete AI Tools Pak directory: every AI subscription with its full description, PKR price, features and buy links, plus a large guide to AI API credits for businesses.",
  image: `${SITE_URL}/og-image.png`,
  datePublished: "2026-08-04",
  dateModified: "2026-08-04",
  author: { "@type": "Organization", name: "AI Tools Pak" },
  publisher: { "@type": "Organization", name: "AI Tools Pak", logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` } },
  mainEntityOfPage: URL,
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
    { "@type": "ListItem", position: 3, name: "Complete AI tools directory", item: URL },
  ],
};

const pageHtml = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI Tools in Pakistan 2026: Complete Directory of All Subscriptions, PKR Prices &amp; API Credits</title>
    <meta name="description" content="Complete AI Tools Pak directory 2026: all ${products.length} AI subscriptions with full details, PKR prices, comparison tables, price index and buy links, plus a large guide to AI API credits (OpenAI, Claude, Gemini, DeepSeek) for businesses.">
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
    <meta property="og:description" content="All ${products.length} AI subscriptions with full details, PKR prices, comparison tables and buy links, plus a full guide to AI API credits.">
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
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../">Home</a><span>/</span><a href="../../blog/">Blog</a><span>/</span><span>Complete AI tools directory</span></nav>
      <section class="page-hero">
        <p class="page-kicker">Complete directory · ${products.length} tools · ${Object.keys(categories).length} categories</p>
        <h1>AI Tools in Pakistan 2026: Full Directory of All Subscriptions, PKR Prices &amp; API Credits</h1>
        <p class="hero-copy">Every AI subscription sold by AI Tools Pak in one place — ${products.length} tools across ${Object.keys(categories).length} categories, with full descriptions, current PKR prices (${pkr(minPrice)} to ${pkr(maxPrice)}, average ${pkr(avgPrice)}), comparison tables, a complete price index and direct buy links — plus a large guide to AI API credits for businesses and developers.</p>
        <p class="date-note">Published: August 4, 2026. Last updated: August 4, 2026. Reviewed by AI Tools Pak Editorial.</p>
      </section>
      <section class="page-layout">
        <div class="page-main">
          <article class="glass-panel page-card">
            <h2>What is on this page</h2>
            <p>This is the single largest reference for AI tools in Pakistan on this site. It contains: (1) the complete product directory with every tool's full details, (2) category overviews, (3) an AI assistants comparison table, (4) the full price index of all ${products.length} tools, (5) a step-by-step buying guide for Pakistan, (6) a complete guide to AI API credits, (7) a glossary of AI terms, and (8) a ${faqs.length}-question FAQ. Every price is in PKR and every tool links to its product page and WhatsApp order button.</p>
          </article>
          <article class="glass-panel page-card">
            <h2>Categories at a glance</h2>
            <ul class="cat-grid">
${catGlance}            </ul>
          </article>
${directory}
          <article class="glass-panel page-card">
            <h2>AI assistants compared: ChatGPT Plus, Claude Pro, Gemini Pro &amp; more</h2>
            <p>Which assistant fits you? Compare the AI assistant plans sold by AI Tools Pak side by side.</p>
            <div class="table-scroll">
              <table class="comparison-table">
                <thead><tr><th>Tool</th><th>PKR price</th><th>Duration</th><th>Credits / usage</th><th>Key features</th><th></th></tr></thead>
                <tbody>
${asstTable}                </tbody>
              </table>
            </div>
          </article>
${voiceSnapshot}${codingSnapshot}
          <article class="glass-panel page-card">
            <h2>Full price index: all ${products.length} AI tools from most affordable to most expensive</h2>
            <p>Compare every AI tool sold in Pakistan by AI Tools Pak, ranked from the lowest PKR price to the highest.</p>
            <div class="table-scroll">
              <table class="comparison-table">
                <thead><tr><th>#</th><th>Tool</th><th>Category</th><th>PKR price</th><th>Duration</th><th></th></tr></thead>
                <tbody>
${priceIndex}                </tbody>
              </table>
            </div>
          </article>
${bestPicks}
${howToChoose}
${apiCreditsSection}
${howToBuy}
          <article class="glass-panel page-card">
            <h2>Buying AI tools in Pakistan safely</h2>
            <ul>
              <li>Always confirm the final payable amount in PKR before paying.</li>
              <li>Confirm the access model (private, shared, account-based or activation-based).</li>
              <li>Confirm the plan duration and delivery estimate.</li>
              <li>Keep the confirmed terms in WhatsApp so the price, duration and warranty are in writing.</li>
              <li>Never share your email password.</li>
              <li>Treat exaggerated "lifetime unlimited" or "official reseller" claims without proof with caution.</li>
              <li>Prefer sellers who respond during stated support hours and give written order confirmations.</li>
            </ul>
          </article>
          <article class="glass-panel page-card">
            <h2>Glossary of AI terms</h2>
            <ul class="gloss-list">
${glossaryHtml}            </ul>
          </article>
          <article class="glass-panel page-card faq">
            <h2>Frequently asked questions about AI tools in Pakistan</h2>
${faqHtml}          </article>
          <article class="glass-panel page-card">
            <h2>Related pages and guides</h2>
            <ul>
              <li><a href="../../#catalog">Browse the full AI tools catalog</a></li>
              <li><a href="../../enterprise-ai-api-credits/">Enterprise AI API credits</a></li>
              <li><a href="../../social-media-services/">Social media services in Pakistan</a></li>
              <li><a href="../../frequently-asked-questions/">General FAQ</a></li>
              <li><a href="../../about-us/">About AI Tools Pak</a></li>
              <li><a href="../../contact-us/">Contact AI Tools Pak</a></li>
              <li><a href="../../delivery-policy/">Delivery policy</a></li>
            </ul>
            <h3>Buying guides</h3>
            <ul>
${blogGuidesHtml}            </ul>
          </article>
        </div>
        <aside class="page-side">
          <div class="glass-panel page-card">
            <h3>Order any tool</h3>
            <p>Send us the tool you need on WhatsApp and we will confirm the current PKR price, duration and delivery before you pay.</p>
          </div>
          <a class="button primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi AI Tools Pak, I want to order an AI tool.")}">Order on WhatsApp</a>
          <div class="glass-panel page-card">
            <h3>Quick stats</h3>
            <ul class="tool-facts">
              <li><strong>Tools listed:</strong> ${products.length}</li>
              <li><strong>Categories:</strong> ${Object.keys(categories).length}</li>
              <li><strong>Price range:</strong> ${pkr(minPrice)} – ${pkr(maxPrice)}</li>
              <li><strong>Average price:</strong> ${pkr(avgPrice)}</li>
              <li><strong>Social services:</strong> 487 priced services</li>
              <li><strong>Support hours:</strong> 11:00 AM – 11:00 PM PKT</li>
            </ul>
          </div>
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
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(itemList)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  </body>
</html>
`;

const outPath = path.join(root, "blog", SLUG, "index.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, pageHtml, "utf8");
const words = pageHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(
  `Wrote blog/${SLUG}/index.html: ${products.length} products, page ${(pageHtml.length / 1024).toFixed(1)} KB (~${words} visible words), API credits section ${(apiCreditsSection.length / 1024).toFixed(1)} KB`
);