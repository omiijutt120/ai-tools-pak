#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "products-data.js"), "utf8");
const match = raw.match(/window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;/);
if (!match) throw new Error("Run scripts/generate-products.js first.");
const products = JSON.parse(match[1]);
const generic = /confirm|availability|delivery details|whatsapp|pk pricing|before ordering|subscription access/gi;
const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;

function score(product) {
  const pagePath = path.join(root, product.guideUrl, "index.html");
  const generated = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, "utf8").replace(/<[^>]+>/g, " ") : "";
  const text = `${product.shortDescription} ${product.fullDescription} ${generated}`;
  let points = 0;
  const missing = [];
  const checks = [
    [product.planTier && new RegExp(product.planTier.split(/\s+/)[0], "i").test(text), "specific plan/tier"],
    [product.creditsOrUsageLimit && text.toLowerCase().includes(product.creditsOrUsageLimit.toLowerCase()), "credits or usage limit"],
    [product.keyFeatures.split(";").filter((f) => text.toLowerCase().includes(f.trim().toLowerCase())).length >= 2, "two product-specific features"],
    [text.replace(generic, "").split(/\s+/).length >= 24, "substantive unique description"],
    [!/(listed for buyers|with PKR pricing|confirm current)/i.test(product.fullDescription) || text.split(/\s+/).length >= 35, "workflow-specific value" ]
  ];
  for (const [ok, label] of checks) { if (ok) points += 2; else missing.push(label); }
  return { points, missing: missing[0] || "none" };
}
const rows = products.map((product) => { const result = score(product); return [product.name, result.points, result.missing]; });
const out = ["product,score_0_to_10,top_missing_element", ...rows.map((row) => row.map(quote).join(","))].join("\n") + "\n";
fs.writeFileSync(path.join(root, "PRODUCT-GENERICNESS-SCORE.csv"), out, "utf8");
console.log(`genericness report written: ${rows.length} products; below 6: ${rows.filter((row) => row[1] < 6).length}`);
