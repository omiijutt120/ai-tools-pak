#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://aitoolspak.tech";
const OUTPUT = path.join(ROOT, "SEO", "STALE-DATA-VALIDATION-2026-08-31.json");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "products-data.js"), "utf8"), context);
const products = context.window.AI_TOOLS_PRODUCTS || [];

const strip = (html = "") => html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const first = (html, regex) => (html.match(regex)?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const money = (value) => Number(value).toLocaleString("en-PK");

function schemas(html) {
  const values = [];
  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) values.push(JSON.parse(match[1]));
  return values;
}

function collectProducts(value, output = []) {
  if (Array.isArray(value)) value.forEach((item) => collectProducts(item, output));
  else if (value && typeof value === "object") {
    const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
    if (types.includes("Product")) output.push(value);
    Object.values(value).forEach((item) => collectProducts(item, output));
  }
  return output;
}

async function get(url) {
  const response = await fetch(url, { headers: { "user-agent": "AI-Tools-Pak-Parity-Check/2026-08-31" } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

async function main() {
  const homeLocal = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const homeLive = await get(`${SITE}/`);
  const localHomeProducts = collectProducts(schemas(homeLocal));
  const liveHomeProducts = collectProducts(schemas(homeLive));
  const localHomeUrls = new Set(localHomeProducts.map((p) => p.url || p.offers?.url).filter(Boolean));
  const liveHomeUrls = new Set(liveHomeProducts.map((p) => p.url || p.offers?.url).filter(Boolean));
  const rows = [];
  for (const product of products) {
    const localPath = path.join(ROOT, product.guideUrl, "index.html");
    const liveUrl = `${SITE}/${product.guideUrl}`;
    const local = fs.readFileSync(localPath, "utf8");
    const live = await get(liveUrl);
    const localSchema = collectProducts(schemas(local)).find((p) => p.url === liveUrl || p.offers?.url === liveUrl);
    const liveSchema = collectProducts(schemas(live)).find((p) => p.url === liveUrl || p.offers?.url === liveUrl);
    const expected = {
      name: product.name,
      price: String(product.sellingPricePkr),
      duration: product.subscriptionDuration,
      access: product.accessType,
      url: liveUrl
    };
    const check = (html, schema) => ({
      title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i),
      h1: first(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
      canonical: first(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i),
      visible_name: strip(html).includes(product.name),
      visible_price: strip(html).includes(`PKR ${money(product.sellingPricePkr)}`),
      visible_duration: strip(html).includes(product.subscriptionDuration),
      visible_access: strip(html).toLowerCase().includes(product.accessType.toLowerCase()),
      schema_name: schema?.name || null,
      schema_price: String(schema?.offers?.price ?? ""),
      schema_currency: schema?.offers?.priceCurrency || null,
      schema_url: schema?.url || schema?.offers?.url || null,
      schema_sku: schema?.sku || null
    });
    const localResult = check(local, localSchema);
    const liveResult = check(live, liveSchema);
    const mismatches = [];
    for (const key of ["title", "description", "h1", "canonical", "visible_name", "visible_price", "visible_duration", "visible_access", "schema_name", "schema_price", "schema_currency", "schema_url", "schema_sku"]) {
      if (JSON.stringify(localResult[key]) !== JSON.stringify(liveResult[key])) mismatches.push(`local_live_${key}`);
    }
    if (!localResult.visible_name || !localResult.visible_price || !localResult.visible_duration || !localResult.visible_access) mismatches.push("source_generated_visible_fields");
    if (localResult.schema_price !== expected.price || localResult.schema_currency !== "PKR" || localResult.schema_url !== expected.url || localResult.schema_sku !== product.sku) mismatches.push("source_generated_schema_fields");
    rows.push({ slug: product.slug, guide_url: product.guideUrl, expected, generated: localResult, live: liveResult, mismatches: [...new Set(mismatches)] });
  }
  const runway = products.find((p) => /runway-ml-max/i.test(p.slug));
  const result = {
    generated_at: new Date().toISOString(),
    source_product_count: products.length,
    homepage_visible_card_count_local: (homeLocal.match(/class="glass-panel link-card"/g) || []).length,
    homepage_visible_card_count_live: (homeLive.match(/class="glass-panel link-card"/g) || []).length,
    homepage_product_schema_count_local: localHomeProducts.length,
    homepage_product_schema_count_live: liveHomeProducts.length,
    homepage_unique_product_schema_urls_local: localHomeUrls.size,
    homepage_unique_product_schema_urls_live: liveHomeUrls.size,
    runway_ml_max_url: runway ? `${SITE}/${runway.guideUrl}` : null,
    runway_ml_max_in_local_home_schema: runway ? localHomeUrls.has(`${SITE}/${runway.guideUrl}`) : false,
    runway_ml_max_in_live_home_schema: runway ? liveHomeUrls.has(`${SITE}/${runway.guideUrl}`) : false,
    product_pages_checked: rows.length,
    mismatch_pages: rows.filter((row) => row.mismatches.length).map((row) => ({ slug: row.slug, mismatches: row.mismatches })),
    pages: rows
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`);
  const homepageMismatch = [
    result.homepage_visible_card_count_local,
    result.homepage_visible_card_count_live,
    result.homepage_product_schema_count_local,
    result.homepage_product_schema_count_live,
    result.homepage_unique_product_schema_urls_local,
    result.homepage_unique_product_schema_urls_live
  ].some((count) => count !== products.length) || !result.runway_ml_max_in_local_home_schema || !result.runway_ml_max_in_live_home_schema;
  console.log(`source/generated/live parity: ${rows.length} products checked; ${result.mismatch_pages.length} pages with mismatches`);
  console.log(`homepage products: source=${products.length} local-schema=${localHomeProducts.length}/${localHomeUrls.size} unique live-schema=${liveHomeProducts.length}/${liveHomeUrls.size} unique`);
  console.log(`Runway ML Max: local=${result.runway_ml_max_in_local_home_schema} live=${result.runway_ml_max_in_live_home_schema}`);
  console.log(`wrote ${path.relative(ROOT, OUTPUT)}`);
  if (result.mismatch_pages.length || homepageMismatch) process.exitCode = 1;
}

main().catch((error) => { console.error(error.stack || error); process.exit(1); });
