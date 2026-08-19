/* Validates the authoritative catalog source, its generated output and core product-link graph. */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "data", "products.csv");
const required = [
  "product_id", "sku", "product_name", "source_product_title", "slug", "category", "plan_tier",
  "subscription_duration", "duration_months", "access_type", "delivery_method", "credits_or_usage_limit",
  "key_features", "short_description", "full_description", "price_pkr", "compare_at_price_pkr",
  "discount_percent", "image_url", "image_alt_text", "source_product_url", "source_rating_count",
  "data_verification_status", "requires_supplier_confirmation"
];

function parseCsv(text) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]; const next = text[i + 1];
    if (quoted && char === '"' && next === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === ",") { row.push(cell); cell = ""; }
    else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); if (row.some(Boolean)) rows.push(row); }
  return rows;
}

function duplicates(values) {
  const seen = new Set(); const duplicate = new Set();
  for (const value of values) { if (seen.has(value)) duplicate.add(value); seen.add(value); }
  return [...duplicate];
}

const generatorSource = fs.readFileSync(path.join(root, "scripts", "generate-products.js"), "utf8");
const routeSection = generatorSource.match(/PRODUCT_ROUTE_BY_SLUG\s*=\s*\{([\s\S]*?)\n\};/);
if (!routeSection) throw new Error("Unable to read PRODUCT_ROUTE_BY_SLUG from generator");
const routes = Object.fromEntries([...routeSection[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
function guideUrl(slug) { return routes[slug] || `${slug}-pakistan/`; }

function identity(row) {
  const normalize = (value) => String(value || "").toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
  return [row.source_product_title, row.plan_tier, row.subscription_duration, row.access_type]
    .map(normalize).join(" | ");
}

function validImage(file) {
  const data = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  if (!data.length) return false;
  if (ext === ".png") return data.length > 24 && data.subarray(1, 4).toString() === "PNG";
  if (ext === ".jpg" || ext === ".jpeg") return data.length > 4 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (ext === ".svg") return data.toString("utf8").includes("<svg");
  if (ext === ".ico") return data.length > 4 && data[0] === 0 && data[1] === 0;
  return false;
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, ""));
const headers = rows.shift();
const errors = [];
for (const field of required) if (!headers.includes(field)) errors.push(`Missing CSV column: ${field}`);
const products = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, (row[index] || "").trim()])));

for (const field of ["product_id", "sku", "slug"]) {
  const repeated = duplicates(products.map((row) => row[field]));
  if (repeated.length) errors.push(`Duplicate ${field}: ${repeated.join(", ")}`);
}
const identityDuplicates = duplicates(products.map(identity));
if (identityDuplicates.length) errors.push(`Duplicate product identity: ${identityDuplicates.join("; ")}`);

for (const product of products) {
  const label = product.slug || product.product_id || "unknown product";
  for (const field of ["product_name", "category", "plan_tier", "access_type", "delivery_method", "key_features", "short_description", "full_description", "image_url", "image_alt_text"]) {
    if (!product[field]) errors.push(`${label}: missing ${field}`);
  }
  const price = Number(product.price_pkr);
  const compare = product.compare_at_price_pkr ? Number(product.compare_at_price_pkr) : null;
  if (!Number.isFinite(price) || price <= 0) errors.push(`${label}: invalid selling price`);
  if (compare !== null && (!Number.isFinite(compare) || compare <= price)) errors.push(`${label}: compare-at price must exceed selling price`);
  if (product.duration_months && (!Number.isFinite(Number(product.duration_months)) || Number(product.duration_months) < 0)) errors.push(`${label}: invalid duration_months`);
  if (!product.subscription_duration && !product.duration_months && !/(credit|license key)/i.test(product.credits_or_usage_limit)) errors.push(`${label}: missing duration`);
  if (!/^https:\/\/[^\s]+$/i.test(product.source_product_url)) errors.push(`${label}: malformed source_product_url`);
  const image = path.join(root, product.image_url.replace(/^\//, ""));
  if (!fs.existsSync(image)) errors.push(`${label}: missing image ${product.image_url}`);
  else if (!validImage(image)) errors.push(`${label}: invalid image file ${product.image_url}`);
  const page = path.join(root, guideUrl(product.slug), "index.html");
  if (!fs.existsSync(page)) errors.push(`${label}: missing generated product page`);
}

global.window = {};
require(path.join(root, "products-data.js"));
const generated = global.window.AI_TOOLS_PRODUCTS || [];
const csvSlugs = new Set(products.map((product) => product.slug));
const generatedSlugs = new Set(generated.map((product) => product.slug));
for (const slug of csvSlugs) if (!generatedSlugs.has(slug)) errors.push(`CSV product absent from generated data: ${slug}`);
for (const slug of generatedSlugs) if (!csvSlugs.has(slug)) errors.push(`Generated product absent from CSV: ${slug}`);
if (generated.length !== products.length) errors.push(`CSV/generated count mismatch: ${products.length}/${generated.length}`);

const htmlFiles = fs.readdirSync(root, { withFileTypes: true });
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const product of products) {
  const url = guideUrl(product.slug);
  if (!home.includes(`href="${url}"`)) errors.push(`${product.slug}: no incoming homepage link`);
}

if (errors.length) throw new Error(errors.join("\n"));
console.log(`product pipeline ok: ${products.length} CSV products, generated data parity, unique identities, images and incoming product links verified`);
