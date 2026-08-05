#!/usr/bin/env node
/**
 * generate-llms.txt.js
 * Rebuilds /llms.txt for LLM/AI-crawler discoverability (GEO).
 * Sources of truth:
 *   - PRODUCT_ROUTE_BY_SLUG extracted live from generate-products.js (no drift)
 *   - product prices from the generated products-data.js
 *
 * Usage: node scripts/generate-llms-txt.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const SITE_URL = "https://aitoolspak.tech";

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8");
}

// Extract the authoritative slug -> route map from generate-products.js
const genSrc = read("scripts/generate-products.js");
const mapMatch = genSrc.match(/PRODUCT_ROUTE_BY_SLUG\s*=\s*\{([\s\S]*?)\n\s*\};/);
if (!mapMatch) {
  console.error("Could not find PRODUCT_ROUTE_BY_SLUG in scripts/generate-products.js");
  process.exit(1);
}
const ROUTE_BY_SLUG = {};
for (const line of mapMatch[1].split("\n")) {
  const m = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)",?\s*$/);
  if (m) ROUTE_BY_SLUG[m[1]] = m[2];
}

function guideUrl(slug) {
  return ROUTE_BY_SLUG[slug] || `${slug}-pakistan/`;
}

const data = read("products-data.js");
const arrMatch = data.match(/window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (!arrMatch) {
  console.error("Could not parse products-data.js");
  process.exit(1);
}
const products = JSON.parse(arrMatch[1]);

const lines = [];
lines.push("# AI Tools Pak");
lines.push("");
lines.push(
  "AI Tools Pak is a Pakistan-focused catalog for AI tool subscriptions and social media services with PKR pricing, WhatsApp order support, buyer safety checks, refund terms and delivery information."
);
lines.push("");
lines.push("## Core Pages");
lines.push("");
lines.push(`- Home: ${SITE_URL}/`);
lines.push(`- AI tools catalog: ${SITE_URL}/#catalog`);
lines.push(`- Social media services: ${SITE_URL}/social-media-services/`);
lines.push(`- About: ${SITE_URL}/about-us/`);
lines.push(`- Contact: ${SITE_URL}/contact-us/`);
lines.push(`- FAQ: ${SITE_URL}/frequently-asked-questions/`);
lines.push(`- Refund policy: ${SITE_URL}/refund-policy/`);
lines.push(`- Delivery policy: ${SITE_URL}/delivery-policy/`);
lines.push(`- Enterprise AI API credits: ${SITE_URL}/enterprise-ai-api-credits/`);
lines.push(`- Blog index: ${SITE_URL}/blog/`);
lines.push("");
lines.push("## Current PKR Prices");
lines.push("");
lines.push("Current selling prices in PKR from the AI Tools Pak catalog, per plan duration.");
lines.push("");
for (const p of products) {
  const url = `${SITE_URL}/${guideUrl(p.slug)}`;
  const dur = p.subscriptionDuration || `${p.durationMonths} month(s)`;
  lines.push(`- ${p.name}: PKR ${p.sellingPricePkr.toLocaleString("en-US")} (${dur}) - ${url}`);
}
lines.push("");
lines.push("## Main Guides");
lines.push("");
lines.push(`- ChatGPT Plus price in Pakistan: ${SITE_URL}/blog/chatgpt-plus-price-pakistan/`);
lines.push(`- Cheap AI subscriptions in Pakistan (PKR prices): ${SITE_URL}/blog/find-cheap-ai-subscriptions-pakistan/`);
lines.push(`- Where to buy AI tools in Pakistan (safe sellers): ${SITE_URL}/blog/where-to-buy-ai-tools-pakistan/`);
lines.push(`- Claude Pro vs ChatGPT Plus for Pakistani students: ${SITE_URL}/blog/claude-pro-vs-chatgpt-plus-pakistani-students/`);
lines.push(`- Best AI tools for freelancers in Pakistan: ${SITE_URL}/blog/best-ai-tools-freelancers-pakistan/`);
lines.push(`- Best AI video tools for Pakistani content creators: ${SITE_URL}/blog/best-ai-video-tools-pakistani-content-creators/`);
lines.push(`- How to choose an AI subscription safely: ${SITE_URL}/blog/choose-ai-subscription-safely/`);
lines.push(`- Free vs paid AI tools: ${SITE_URL}/blog/free-vs-paid-ai-tools/`);
lines.push(`- Canva Pro price in Pakistan: ${SITE_URL}/blog/canva-pro-price-pakistan/`);
lines.push(`- Complete AI tools directory in Pakistan (all PKR prices + API credits): ${SITE_URL}/blog/ai-tools-pakistan-complete-guide/`);
lines.push(`- Best AI writing tools in Pakistan (PKR guide): ${SITE_URL}/blog/ai-writing-tools-pakistan/`);
lines.push(`- SEO & marketing tools in Pakistan (PKR guide): ${SITE_URL}/blog/seo-marketing-tools-pakistan/`);
lines.push(`- AI app builders & developer tools in Pakistan: ${SITE_URL}/blog/ai-app-builder-tools-pakistan/`);
lines.push(`- Entertainment subscriptions in Pakistan (PKR): ${SITE_URL}/blog/entertainment-subscriptions-pakistan/`);
lines.push(`- ChatGPT vs Gemini in Pakistan: ${SITE_URL}/blog/chatgpt-vs-gemini-pakistan/`);
lines.push(`- Claude Pro price in Pakistan (PKR): ${SITE_URL}/blog/claude-pro-price-pakistan/`);
lines.push(`- Veo 3 vs Runway ML vs Sora (AI video): ${SITE_URL}/blog/veo-3-vs-runway-vs-sora/`);
lines.push(`- Best AI video generator 2026 for Pakistan: ${SITE_URL}/blog/best-ai-video-generator-2026/`);
lines.push(`- Best AI voice generator in Pakistan (PKR): ${SITE_URL}/blog/best-ai-voice-generator-pakistan/`);
lines.push(`- Semrush vs Ahrefs for Pakistani marketers: ${SITE_URL}/blog/semrush-vs-ahrefs/`);
lines.push(`- Best AI tools for students in Pakistan (PKR): ${SITE_URL}/blog/best-ai-tools-students-pakistan/`);
lines.push(`- How to pay for AI tools with a debit card in Pakistan: ${SITE_URL}/blog/pay-ai-tools-debit-card-pakistan/`);
lines.push(`- Grok price in Pakistan (SuperGrok PKR): ${SITE_URL}/blog/grok-price-pakistan/`);
lines.push(`- Gemini Pro price in Pakistan (PKR): ${SITE_URL}/blog/gemini-pro-price-pakistan/`);
lines.push(`- ChatGPT free vs Plus in Pakistan: ${SITE_URL}/blog/chatgpt-free-vs-plus-pakistan/`);
lines.push(`- Cursor vs GitHub Copilot for Pakistani developers: ${SITE_URL}/blog/cursor-vs-copilot-pakistan/`);
lines.push(`- Best AI coding tools in Pakistan (PKR): ${SITE_URL}/blog/best-ai-coding-tools-pakistan/`);
lines.push(`- vidIQ vs TubeBuddy for Pakistani YouTubers: ${SITE_URL}/blog/vidiq-vs-tubebuddy/`);
lines.push(`- Best AI tools for YouTube creators in Pakistan: ${SITE_URL}/blog/best-ai-tools-youtube-pakistan/`);
lines.push(`- Best AI image generators in Pakistan (PKR): ${SITE_URL}/blog/best-ai-image-generators-pakistan/`);
lines.push(`- Veo 3 price in Pakistan (PKR): ${SITE_URL}/blog/veo-3-price-pakistan/`);
lines.push(`- CapCut Pro price in Pakistan (PKR): ${SITE_URL}/blog/capcut-pro-price-pakistan/`);
lines.push(`- Best AI tools for small businesses in Pakistan: ${SITE_URL}/blog/ai-tools-for-businesses-pakistan/`);
lines.push(`- Cheap AI API credits in Pakistan (PKR): ${SITE_URL}/blog/cheap-ai-api-credits-pakistan/`);
lines.push(`- Claude API credits in Pakistan (PKR): ${SITE_URL}/blog/claude-api-credits-pakistan/`);
lines.push(`- Claude vs Gemini in Pakistan: ${SITE_URL}/blog/claude-vs-gemini-pakistan/`);
lines.push(`- AI automation for small businesses in Pakistan: ${SITE_URL}/blog/ai-automation-for-small-business-pakistan/`);
lines.push(`- Enterprise AI API credits in Pakistan: ${SITE_URL}/enterprise-ai-api-credits/`);
lines.push(`- AI automation services in Pakistan: ${SITE_URL}/ai-automation-services/`);
lines.push("");
lines.push("## Full documentation");
lines.push("");
lines.push(`Full site text for AI models: ${SITE_URL}/llms-full.txt`);
lines.push("");
lines.push("## Contact");
lines.push("");
lines.push("WhatsApp support: +92 371 454 9245");
lines.push("Email: support@aitoolspak.com");
lines.push("Support hours: 11:00 AM to 11:00 PM Pakistan time");
lines.push("");

const out = lines.join("\n");
fs.writeFileSync(path.join(root, "llms.txt"), out, "utf8");
console.log(`llms.txt written: ${products.length} products, ${out.split("\n").length} lines`);
