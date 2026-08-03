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
