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
  "blog/canva-pro-price-pakistan/index.html",
  "blog/chatgpt-plus-price-pakistan/index.html",
  "blog/claude-pro-vs-chatgpt-plus-pakistani-students/index.html",
  "blog/find-cheap-ai-subscriptions-pakistan/index.html",
  "blog/where-to-buy-ai-tools-pakistan/index.html",
  "blog/best-ai-tools-freelancers-pakistan/index.html",
  "blog/best-ai-video-tools-pakistani-content-creators/index.html",
  "blog/choose-ai-subscription-safely/index.html",
  "blog/free-vs-paid-ai-tools/index.html",
];
for (const rel of blogPosts) {
  if (!fs.existsSync(path.join(root, rel))) continue;
  const slug = rel.replace("blog/", "").replace("/index.html", "");
  const text = pageMainText(rel, 3500);
  out.push(`### ${slug.replace(/-/g, " ")}`);
  out.push(text.replace(/^# /, ""));
  out.push("");
  out.push(`Source: ${SITE_URL}/blog/${slug}/`);
  out.push("");
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
