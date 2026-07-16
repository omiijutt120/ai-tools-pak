const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "data", "products.csv");
const dataPath = path.join(root, "products-data.js");
const indexPath = path.join(root, "index.html");

const required = [
  "product_id",
  "sku",
  "product_name",
  "source_product_title",
  "slug",
  "category",
  "plan_tier",
  "subscription_duration",
  "duration_months",
  "access_type",
  "delivery_method",
  "credits_or_usage_limit",
  "key_features",
  "short_description",
  "full_description",
  "price_pkr",
  "compare_at_price_pkr",
  "discount_percent",
  "image_url",
  "image_alt_text",
  "source_product_url",
  "source_rating_count",
  "data_verification_status",
  "requires_supplier_confirmation"
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.length)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value.length)) rows.push(row);
  }
  return rows;
}

function duplicateValues(rows, key) {
  const seen = new Set();
  const duplicates = new Set();
  for (const row of rows) {
    if (seen.has(row[key])) duplicates.add(row[key]);
    seen.add(row[key]);
  }
  return [...duplicates];
}

function numberOrNull(value) {
  if (String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function guideUrl(slug) {
  return {
    "chatgpt-plus": "chatgpt-plus-pakistan/",
    "claude-ai": "claude-pro-pakistan/"
  }[slug] || "";
}

function offer(product) {
  return {
    "@type": "Offer",
    price: product.sellingPricePkr,
    priceCurrency: "PKR",
    availability: product.requiresSupplierConfirmation ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "AI Tools Pak"
    },
    url: `https://aitoolspak.tech/#product-${product.slug}`,
    itemCondition: "https://schema.org/NewCondition",
    hasMerchantReturnPolicy: {
      "@id": "https://aitoolspak.tech/refund-policy/#digital-access-policy"
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "PK"
      },
      shippingRate: {
        "@type": "MonetaryAmount",
        value: 0,
        currency: "PKR"
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 2,
          unitCode: "DAY"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY"
        }
      }
    }
  };
}

function replaceJsonLd(html, predicate, value) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, raw) => {
    try {
      const data = JSON.parse(raw);
      return predicate(data) ? `<script type="application/ld+json">\n${JSON.stringify(value, null, 2)}\n    </script>` : match;
    } catch {
      return match;
    }
  });
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const headers = rows.shift();
const missingHeaders = required.filter((field) => !headers.includes(field));
if (missingHeaders.length) throw new Error(`Missing CSV headers: ${missingHeaders.join(", ")}`);

const records = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
const duplicateIds = duplicateValues(records, "product_id");
const duplicateSkus = duplicateValues(records, "sku");
const duplicateSlugs = duplicateValues(records, "slug");
const missingNames = records.filter((row) => !row.product_name.trim()).map((row) => row.product_id || row.sku || "(unknown)");
const invalidPrices = records.filter((row) => !Number.isFinite(Number(row.price_pkr)) || Number(row.price_pkr) <= 0).map((row) => row.product_id);
const missingImages = records.filter((row) => !row.image_url.trim()).map((row) => row.product_id);

const errors = [
  duplicateIds.length && `Duplicate product IDs: ${duplicateIds.join(", ")}`,
  duplicateSkus.length && `Duplicate SKUs: ${duplicateSkus.join(", ")}`,
  duplicateSlugs.length && `Duplicate slugs: ${duplicateSlugs.join(", ")}`,
  missingNames.length && `Missing names: ${missingNames.join(", ")}`,
  invalidPrices.length && `Invalid prices: ${invalidPrices.join(", ")}`,
  missingImages.length && `Missing image URLs: ${missingImages.join(", ")}`
].filter(Boolean);

console.log(`total rows read: ${records.length}`);
console.log(`duplicate product IDs: ${duplicateIds.length || 0}`);
console.log(`duplicate SKUs: ${duplicateSkus.length || 0}`);
console.log(`duplicate slugs: ${duplicateSlugs.length || 0}`);
console.log(`missing names: ${missingNames.length || 0}`);
console.log(`invalid prices: ${invalidPrices.length || 0}`);
console.log(`missing image URLs: ${missingImages.length || 0}`);

if (errors.length) throw new Error(errors.join("\n"));

const products = records.map((row) => {
  const basePricePkr = Number(row.price_pkr);
  const sellingPricePkr = Math.round(basePricePkr * 1.2);
  const compareAtPricePkr = numberOrNull(row.compare_at_price_pkr);
  return {
    productId: row.product_id,
    sku: row.sku,
    name: row.product_name,
    sourceProductTitle: row.source_product_title,
    slug: row.slug,
    category: row.category,
    planTier: row.plan_tier,
    subscriptionDuration: row.subscription_duration,
    durationMonths: numberOrNull(row.duration_months),
    accessType: row.access_type,
    deliveryMethod: row.delivery_method,
    creditsOrUsageLimit: row.credits_or_usage_limit,
    keyFeatures: row.key_features,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    basePricePkr,
    sellingPricePkr,
    compareAtPricePkr,
    discountPercent: numberOrNull(row.discount_percent),
    imageUrl: row.image_url,
    imageAltText: row.image_alt_text,
    sourceProductUrl: row.source_product_url,
    sourceRatingCount: numberOrNull(row.source_rating_count),
    dataVerificationStatus: row.data_verification_status,
    requiresSupplierConfirmation: /^yes$/i.test(row.requires_supplier_confirmation),
    initials: initials(row.product_name),
    guideUrl: guideUrl(row.slug)
  };
});

console.log(`valid products imported: ${products.length}`);
if (products.length !== 19) throw new Error(`Expected 19 products, found ${products.length}`);

fs.writeFileSync(
  dataPath,
  `window.AI_TOOLS_PRODUCTS = ${JSON.stringify(products, null, 2)};\n`,
  "utf8"
);

let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/<span><strong[^>]*>[^<]+<\/strong>\s*tools listed<\/span>/, `<span><strong data-product-count>${products.length}</strong> AI tools listed</span>`);
index = index.replace(/<ul class="noscript-products">[\s\S]*?<\/ul>/, `<ul class="noscript-products">\n${products.map((product) => `            <li>${product.name} - PKR ${product.sellingPricePkr.toLocaleString("en-PK")}</li>`).join("\n")}\n          </ul>`);

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI tools available in Pakistan",
  description: "Browse AI tool subscriptions available for purchase in Pakistan with PKR pricing.",
  numberOfItems: products.length,
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: `https://aitoolspak.tech/#product-${product.slug}`
  }))
};

const productGraph = {
  "@context": "https://schema.org",
  "@graph": products.map((product) => ({
    "@type": "Product",
    name: `${product.name} Subscription Pakistan`,
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: product.sourceProductTitle
    },
    category: product.category,
    url: `https://aitoolspak.tech/#product-${product.slug}`,
    offers: offer(product),
    image: product.imageUrl
  }))
};

index = replaceJsonLd(index, (data) => data["@type"] === "ItemList", itemList);
index = replaceJsonLd(index, (data) => Array.isArray(data["@graph"]) && data["@graph"].some((item) => item["@type"] === "Product"), productGraph);
fs.writeFileSync(indexPath, index, "utf8");
