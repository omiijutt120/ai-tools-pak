#!/usr/bin/env node
/**
 * generate-llms-full-txt.js
 * Rebuilds /llms-full.txt — the full plain-text site documentation for AI
 * crawlers (GPTBot, ClaudeBot, PerplexityBot, ...). Follows the llmstxt.org
 * convention: llms.txt is the index, llms-full.txt is the full content.
 *
 * Usage: node scripts/generate-llms-full-txt.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const SITE_URL = "https://aitoolspak.tech";

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8");
}

// --- products -------------------------------------------------------------
const data = read("products-data.js");
const arrMatch = data.match(/window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (!arrMatch) {
  console.error("Could not parse products-data.js");
  process.exit(1);
}
const products = JSON.parse(arrMatch[1]);

// --- plain-text extraction from an HTML file ------------------------------
function htmlToText(html, maxChars) {
  let text = html
    // keep headings/paragraphs/list items as lines
    .replace(/<h1[^>]*>/gi, "\n# ")
    .replace(/<h2[^>]*>/gi, "\n## ")
    .replace(/<h3[^>]*>/gi, "\n### ")
    .replace(/<h4[^>]*>/gi, "\n#### ")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "\u2013")
    .replace(/&#8217;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  if (maxChars && text.length > maxChars) {
    text = text.slice(0, maxChars) + "\n[...]";
  }
  return text;
}

function pageMainText(relPath, maxChars) {
  const html = read(relPath);
  // prefer the article/main content; fall back to whole body
  let core = html.match(/<main>([\s\S]*?)<\/main>/i) || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const body = html.match(/<body>([\s\S]*?)<\/body>/i);
  const src = core ? core[1] : body ? body[1] : html;
  return htmlToText(src, maxChars);
}

// --- build -----------------------------------------------------------------
const out = [];
out.push("# AI Tools Pak — Full Site Documentation");
out.push("");
out.push("AI Tools Pak is a Pakistan-focused catalog for AI tool subscriptions and social media services with PKR pricing, WhatsApp order support, buyer safety checks, refund terms and delivery information.");
out.push("");
out.push(`Website: ${SITE_URL}`);
out.push("WhatsApp support: +92 371 454 9245");
out.push("Email: support@aitoolspak.com");
out.push("Support hours: 11:00 AM to 11:00 PM Pakistan time");
out.push("");
out.push("## Core Pages");
out.push("");
for (const [name, rel] of [
  ["Home", "index.html"],
  ["AI tools catalog", "index.html#catalog"],
  ["Social media services", "social-media-services/index.html"],
  ["About", "about-us/index.html"],
  ["Contact", "contact-us/index.html"],
  ["FAQ", "frequently-asked-questions/index.html"],
  ["Enterprise AI API credits", "enterprise-ai-api-credits/index.html"],
  ["Refund policy", "refund-policy/index.html"],
  ["Delivery policy", "delivery-policy/index.html"],
  ["Blog index", "blog/index.html"],
]) {
  out.push(`- ${name}: ${SITE_URL}/${rel.replace(/index\.html$/, "").replace(/#catalog$/, "#catalog")}`);
}
out.push("");

out.push("## All Products (Current PKR Prices)");
out.push("");
for (const p of products) {
  const url = `${SITE_URL}/${p.guideUrl}`;
  const dur = p.subscriptionDuration || `${p.durationMonths} month(s)`;
  out.push(`### ${p.name}`);
  out.push(`- Price: PKR ${p.sellingPricePkr.toLocaleString("en-US")} (${dur})${p.compareAtPricePkr ? `, was PKR ${p.compareAtPricePkr.toLocaleString("en-US")}` : ""}`);
  out.push(`- Category: ${p.category} | Access: ${p.accessType} | Delivery: ${p.deliveryMethod}`);
  out.push(`- Key features: ${p.keyFeatures}`);
  out.push(`- Description: ${p.shortDescription} ${p.fullDescription}`);
  out.push(`- URL: ${url}`);
  out.push("");
}

out.push("## Blog Guides (Full Text)");
out.push("");
const blogPosts = [
  "blog/ai-tools-pakistan-complete-guide/index.html",
  "blog/canva-pro-price-pakistan/index.html",
  "blog/chatgpt-plus-price-pakistan/index.html",
  "blog/claude-pro-vs-chatgpt-plus-pakistani-students/index.html",
  "blog/find-cheap-ai-subscriptions-pakistan/index.html",
  "blog/where-to-buy-ai-tools-pakistan/index.html",
  "blog/best-ai-tools-freelancers-pakistan/index.html",
  "blog/best-ai-video-tools-pakistani-content-creators/index.html",
  "blog/choose-ai-subscription-safely/index.html",
  "blog/free-vs-paid-ai-tools/index.html",
  "blog/grok-price-pakistan/index.html",
  "blog/gemini-pro-price-pakistan/index.html",
  "blog/chatgpt-free-vs-plus-pakistan/index.html",
  "blog/cursor-vs-copilot-pakistan/index.html",
  "blog/best-ai-coding-tools-pakistan/index.html",
  "blog/vidiq-vs-tubebuddy/index.html",
  "blog/best-ai-tools-youtube-pakistan/index.html",
  "blog/best-ai-image-generators-pakistan/index.html",
  "blog/veo-3-price-pakistan/index.html",
  "blog/capcut-pro-price-pakistan/index.html",
  "blog/ai-tools-for-businesses-pakistan/index.html",
  "blog/cheap-ai-api-credits-pakistan/index.html",
  "blog/claude-api-credits-pakistan/index.html",
  "blog/claude-vs-gemini-pakistan/index.html",
  "blog/ai-automation-for-small-business-pakistan/index.html",
  "blog/gemini-vs-gpt-5/index.html",
  "blog/deepseek-vs-chatgpt/index.html",
  "blog/perplexity-vs-chatgpt-search/index.html",
  "blog/midjourney-vs-dalle/index.html",
  "blog/gpt-5-vs-claude-sonnet/index.html",
  "blog/top-20-ai-tools-2026/index.html",
  "blog/best-ai-chatbots-for-students/index.html",
  "blog/best-ai-agents-2026/index.html",
  "blog/best-ai-tools-for-teachers-pakistan/index.html",
  "blog/best-ai-tools-for-ecommerce-pakistan/index.html",
  "blog/midjourney-price-pakistan/index.html",
  "blog/deepseek-api-price-pakistan/index.html",
  "blog/github-copilot-price-pakistan/index.html",
  "blog/how-to-build-n8n-automations-pakistan/index.html",
  "blog/how-to-earn-money-with-ai-pakistan/index.html",
  "blog/buy-openai-api-credits-pakistan/index.html",
  "blog/api-credits-wholesale-pakistan/index.html",
  "blog/elevenlabs-vs-playht/index.html",
  "blog/heygen-vs-synthesia/index.html",
  "blog/ideogram-vs-midjourney/index.html",
  "blog/best-free-ai-tools-pakistan/index.html",
  "blog/best-ai-tools-for-social-media-pakistan/index.html",
  "blog/best-ai-design-tools-2026/index.html",
  "blog/best-ai-tools-for-whatsapp-business-pakistan/index.html",
  "blog/gemini-pro-vs-google-ai-ultra/index.html",
  "blog/elevenlabs-price-pakistan/index.html",
  "blog/jasper-price-pakistan/index.html",
  "blog/perplexity-pro-price-pakistan/index.html",
  "blog/quillbot-premium-price-pakistan/index.html",
  "blog/how-to-automate-whatsapp-with-ai-pakistan/index.html",
  "blog/chatgpt-unlimited-free-text-chats/index.html",
  "blog/openai-astra-security-pause/index.html",
  "blog/openai-smart-speaker-price/index.html",
  "blog/cloudflare-kitesurf-ai-browser/index.html",
  "blog/google-maps-agentic-ordering/index.html",
  "blog/meta-muse-code/index.html",
  "blog/suno-audio-watermarking/index.html",
  "blog/rippling-ai-spend-console/index.html",
  "blog/airbnb-ai-60-percent-faster/index.html",
  "blog/malachyte-spotify-ai-ecommerce/index.html",
  "blog/mirendil-google-cloud-100m/index.html",
  "blog/omilia-67m-voice-support/index.html",
  "blog/deepseek-v4-flash-0731/index.html",
  "blog/doe-genesis-open-models/index.html",
  "blog/oracle-bans-ai-code-openjdk/index.html",
  "blog/deepseek-api-price-increase/index.html",
  "blog/openai-acquires-nextslide/index.html",
  "blog/meta-ai-model-escaped-containment/index.html",
  "blog/kimi-k3-sandbox-escape/index.html",
  "blog/hassabis-steps-down-alphabet-chief-scientist/index.html",
  "blog/openai-gpt-live-voice-models/index.html",
  "blog/hugging-face-hack-ai-agents/index.html",
  "blog/apple-alibaba-qwen-china/index.html",
  "blog/time-magazine-agent-ads-geo/index.html",
  "blog/claude-code-auto-mode-default/index.html",
  "blog/claude-opus-5-wipes-home-directory/index.html",
  "blog/anthropic-custom-ai-chips-samsung/index.html",
  "blog/openai-codex-micro-keyboard/index.html",
  "blog/amazon-data-center-climate/index.html",
];
for (const rel of blogPosts) {
  if (!fs.existsSync(path.join(root, rel))) continue;
  const slug = rel.replace("blog/", "").replace("/index.html", "");
  const text = pageMainText(rel, 3500);
  out.push(`### ${slug.replace(/-/g, " ").replace(/\bcheap\b/gi, "affordable")}`);
  out.push(text.replace(/^# /, ""));
  out.push("");
  out.push(`Source: ${SITE_URL}/blog/${slug}/`);
  out.push("");
}

out.push("## Product Comparisons (Full Text)");
out.push("");
const comparisonRoot = path.join(root, "comparisons");
if (fs.existsSync(comparisonRoot)) {
  for (const slug of fs.readdirSync(comparisonRoot).sort()) {
    const rel = `comparisons/${slug}/index.html`;
    if (!fs.existsSync(path.join(root, rel))) continue;
    out.push(`### ${slug.replace(/-/g, " ")}`);
    out.push(pageMainText(rel, 5000));
    out.push("");
    out.push(`Source: ${SITE_URL}/comparisons/${slug}/`);
    out.push("");
  }
}

out.push("## Utility Pages");
out.push("");
for (const rel of [
  "privacy-policy/index.html",
  "terms-and-conditions/index.html",
  "delivery-policy/index.html",
  "refund-policy/index.html",
]) {
  const slug = rel.replace("/index.html", "");
  const text = pageMainText(rel, 1200);
  out.push(`### ${slug.replace(/-/g, " ")}`);
  out.push(text.replace(/^# /, "").split("\n").slice(0, 12).join("\n"));
  out.push("");
  out.push(`Source: ${SITE_URL}/${slug}/`);
  out.push("");
}

const finalText = out.join("\n");
fs.writeFileSync(path.join(root, "llms-full.txt"), finalText, "utf8");
console.log(`llms-full.txt written: ${finalText.split("\n").length} lines, ${(finalText.length / 1024).toFixed(1)} KB`);
