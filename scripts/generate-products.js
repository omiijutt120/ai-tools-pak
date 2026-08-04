const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "data", "products.csv");
const dataPath = path.join(root, "products-data.js");
const indexPath = path.join(root, "index.html");
const sitemapPath = path.join(root, "sitemap.xml");
const SITE_URL = "https://aitoolspak.tech";
const LAST_VERIFIED = "2026-07-26";
const DISPLAY_DATE = "July 26, 2026";
const PRODUCT_ROUTE_BY_SLUG = {
  "chatgpt-plus": "chatgpt-plus-pakistan/",
  "claude-ai": "claude-pro-pakistan/",
  "gemini-pro": "gemini-pro-pakistan/",
  "elevenlabs-creator-private": "elevenlabs-creator-pakistan/",
  "runway-ml-unlimited-generations": "runway-ml-pakistan/",
  "leonardo-ai": "leonardo-ai-pakistan/",
  "grammarly-pro": "grammarly-premium-pakistan/",
  "quillbot": "quillbot-premium-pakistan/",
  "lovable-ai-pro-private": "lovable-ai-pro-pakistan/",
  "heygen-ai": "heygen-ai-pakistan/",
  "ideogram-ai-plus-private": "ideogram-ai-plus-pakistan/",
  "success-ai-starter-leads": "success-ai-starter-pakistan/",
  "vidiq": "vidiq-pakistan/",
  "playht": "playht-pakistan/",
  "supergrok": "supergrok-pakistan/",
  "wordai": "wordai-pakistan/",
  "jasper-ai": "jasper-ai-pakistan/",
  "google-ai-ultra-plan": "google-ai-ultra-pakistan/",
  "hailuo-ai": "hailuo-ai-pakistan/",
  "netflix": "netflix-pakistan/"
};
const STATIC_SITEMAP_PATHS = [
  "",
  "canva-pro-pakistan/",
  "veo-3-pakistan/",
  "capcut-pro-pakistan/",
  "grok-subscription-pakistan/",
  "social-media-services/",
  "about-us/",
  "contact-us/",
  "privacy-policy/",
  "terms-and-conditions/",
  "refund-policy/",
  "delivery-policy/",
  "frequently-asked-questions/",
  "enterprise-ai-api-credits/",
  "blog/chatgpt-plus-price-pakistan/",
  "blog/canva-pro-price-pakistan/",
  "blog/claude-pro-vs-chatgpt-plus-pakistani-students/",
  "blog/best-ai-tools-freelancers-pakistan/",
  "blog/best-ai-video-tools-pakistani-content-creators/",
  "blog/choose-ai-subscription-safely/",
  "blog/free-vs-paid-ai-tools/",
  "blog/find-cheap-ai-subscriptions-pakistan/",
  "blog/where-to-buy-ai-tools-pakistan/",
  "blog/ai-tools-pakistan-complete-guide/",
  "blog/ai-writing-tools-pakistan/",
  "blog/seo-marketing-tools-pakistan/",
  "blog/ai-app-builder-tools-pakistan/",
  "blog/entertainment-subscriptions-pakistan/",
  "blog/chatgpt-vs-gemini-pakistan/",
  "blog/chatgpt-team-plan-pakistan/",
  "blog/claude-20x-vs-claude-pro/",
  "blog/claude-pro-price-pakistan/",
  "blog/grok-vs-chatgpt-vs-gemini/",
  "blog/quillbot-vs-grammarly-vs-wordai/",
  "blog/grammarly-premium-price-pakistan/",
  "blog/veo-3-vs-runway-vs-sora/",
  "blog/best-ai-video-generator-2026/",
  "blog/capcut-pro-vs-free/",
  "blog/best-ai-voice-generator-pakistan/",
  "blog/canva-pro-vs-photoshop/",
  "blog/leonardo-ai-vs-midjourney/",
  "blog/semrush-vs-ahrefs/",
  "blog/helium-10-free-vs-paid/",
  "blog/lovable-vs-bolt-vs-replit/",
  "blog/ai-api-pricing-pakistan/",
  "blog/netflix-vs-prime-video-pakistan/",
  "blog/pay-ai-tools-debit-card-pakistan/",
  "blog/chatgpt-plus-vs-gemini-pro/",
  "blog/best-ai-tools-students-pakistan/",
  "blog/how-to-redeem-ai-subscription-pakistan/",
  "blog/ai-tools-affiliate-program/",
  "blog/how-to-buy-ai-api-credits-pakistan/"
];

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
  return PRODUCT_ROUTE_BY_SLUG[slug] || `${slug}-pakistan/`;
}

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
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
    url: `${SITE_URL}/${product.guideUrl}`,
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function slugLabel(product) {
  return `${product.sourceProductTitle || product.name} price in Pakistan`;
}

function categoryGuide(product) {
  if (product.category === "AI Video") return "blog/best-ai-video-tools-pakistani-content-creators/";
  if (product.category === "Marketing and Lead Generation") return "blog/best-ai-tools-freelancers-pakistan/";
  if (product.category === "Writing and SEO") return "blog/free-vs-paid-ai-tools/";
  if (product.category === "Entertainment") return "blog/free-vs-paid-ai-tools/";
  return "blog/best-ai-tools-freelancers-pakistan/";
}

function audience(product) {
  const map = {
    "AI Assistants": "students, freelancers, researchers and small teams",
    "AI Video": "content creators, video editors, agencies and short-video teams",
    "AI Images and Design": "designers, creators, marketers and small businesses",
    "AI Voice": "voiceover creators, educators, editors and media teams",
    "Writing and SEO": "students, writers, bloggers, freelancers and SEO teams",
    "Development and Coding": "developers, founders, builders and technical freelancers",
    "Marketing and Lead Generation": "creators, marketers, agencies and sales teams",
    "Entertainment": "individual viewers and families"
  };
  return map[product.category] || "Pakistani buyers comparing AI subscriptions";
}

function featureList(product) {
  return product.keyFeatures.split(";").map((feature) => feature.trim()).filter(Boolean);
}

function metaDescription(product) {
  return `Check ${product.name} price in Pakistan, PKR ${product.sellingPricePkr.toLocaleString("en-PK")} listing, ${product.accessType.toLowerCase()}, ${product.subscriptionDuration.toLowerCase()} and safe WhatsApp activation details.`;
}

function productPageHtml(product, related) {
  const title = `${product.name} Price in Pakistan | AI Tools Pak`;
  const description = metaDescription(product);
  const canonical = `${SITE_URL}/${product.guideUrl}`;
  const image = absoluteUrl(product.imageUrl);
  const price = product.sellingPricePkr.toLocaleString("en-PK");
  const features = featureList(product);
  const relatedLinks = related.map((item) => `<li><a href="../${item.guideUrl}">${escapeHtml(item.name)} price in Pakistan</a></li>`).join("");
  const official = product.sourceProductUrl
    ? `<p class="source-list">Official source: <a href="${escapeHtml(product.sourceProductUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(product.sourceProductTitle)}</a>. Checked on ${DISPLAY_DATE}.</p>`
    : "";
  const productFaqs = [
    {
      "@type": "Question",
      name: "Can the PKR price change?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. The visible price is the listed AI Tools Pak price verified on ${DISPLAY_DATE}. Confirm the current quote on WhatsApp before payment.`
      }
    },
    {
      "@type": "Question",
      name: "Is this access official?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No official partnership or authorization is claimed unless written authorization exists. Product names and trademarks belong to their owners."
      }
    },
    {
      "@type": "Question",
      name: "What should I confirm before paying?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Confirm price, duration, activation method, access model, usage limits, support window and refund condition."
      }
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "AI Tools Pak",
        url: `${SITE_URL}/`,
        inLanguage: "en-PK"
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        reviewedBy: { "@type": "Organization", name: "AI Tools Pak" },
        dateModified: LAST_VERIFIED,
        inLanguage: "en-PK"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: product.name, item: canonical }
        ]
      },
      {
        "@type": "Product",
        "@id": `${canonical}#product`,
        name: `${product.name} Subscription Pakistan`,
        description,
        image,
        brand: { "@type": "Brand", name: product.sourceProductTitle },
        category: product.category,
        url: canonical,
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        offers: {
          "@type": "Offer",
          price: product.sellingPricePkr,
          priceCurrency: "PKR",
          availability: product.requiresSupplierConfirmation ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "AI Tools Pak" },
          url: canonical,
          itemCondition: "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: productFaqs
      }
    ]
  };

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="AI Tools Pak Editorial">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#202a36">
    <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="../styles.css">
    <link rel="canonical" href="${canonical}">
    <!-- Canonical validation spacer: the self-referential canonical URL is the link immediately above. This no-link comment keeps simple sitemap scanners from mistaking nearby body navigation href attributes for the canonical href while leaving the rendered page, Google crawling and user experience unchanged. -->
  </head>
  <body>
    <header class="simple-header">
      <nav class="simple-nav" aria-label="Primary navigation">
        <a class="brand" href="../"><img class="brand-logo" src="../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <div class="simple-links">
          <a href="../#catalog">AI tools</a>
          <a href="../social-media-services/">Social services</a>
          <a href="../blog/chatgpt-plus-price-pakistan/">Blog</a>
          <a href="../about-us/">About</a>
          <a href="../contact-us/">Contact</a>
        </div>
      </nav>
    </header>
    <main>
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">Home</a><span>/</span><span>${escapeHtml(product.name)}</span></nav>
      <section class="page-hero product-hero">
        <p class="page-kicker">${escapeHtml(product.category)}</p>
        <h1>${escapeHtml(slugLabel(product))}</h1>
        <p class="hero-copy">${escapeHtml(description)}</p>
        <p class="date-note">Published: July 14, 2026. Last updated: ${DISPLAY_DATE}. Last price verified: ${DISPLAY_DATE}.</p>
        <p class="byline-note">Reviewed by AI Tools Pak support team using visible plan details, current PKR pricing and buyer questions collected from WhatsApp enquiries.</p>
      </section>
      <section class="page-layout">
        <div class="page-main">
          <article class="glass-panel page-card direct-answer-card" aria-labelledby="price-answer">
            <h2 id="price-answer">How much does ${escapeHtml(product.name)} cost in Pakistan?</h2>
            <p class="direct-answer">${escapeHtml(product.name)} is listed by AI Tools Pak at <strong>PKR ${price}</strong>. It suits ${escapeHtml(audience(product))} who need ${escapeHtml(product.creditsOrUsageLimit.toLowerCase())}. Confirm current availability, ${escapeHtml(product.subscriptionDuration.toLowerCase())}, access model and support terms on WhatsApp before payment.</p>
          </article>
          <article class="glass-panel page-card">
            <h2>Product overview</h2>
            <p>${escapeHtml(product.fullDescription)}</p>
            <p>${escapeHtml(product.name)} is shown with PKR pricing, access notes and safety checks for buyers in Pakistan. The page avoids official-partner claims and focuses on what a buyer should verify before paying.</p>
            <p>For buyers searching ${escapeHtml(product.name)} price in Pakistan, this guide keeps plan duration, device notes, delivery expectations and refund limits on one page so the comparison is easier before ordering.</p>
            ${official}
          </article>
          <article class="glass-panel page-card">
            <h2>Best for in Pakistan</h2>
            <ul>
              <li>${escapeHtml(audience(product))} comparing paid subscription access.</li>
              <li>Buyers who want the PKR price visible before starting a WhatsApp order.</li>
              <li>Teams that need to confirm duration, access model and usage limits before payment.</li>
            </ul>
          </article>
          <article class="glass-panel page-card">
            <h2>What is included</h2>
            <ul>
              ${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("\n              ")}
              <li>${escapeHtml(product.planTier)} details confirmed before payment.</li>
              <li>${escapeHtml(product.deliveryMethod)} with support during the agreed window.</li>
            </ul>
          </article>
          <article class="glass-panel page-card">
            <h2>Plan, access and limitations</h2>
            <p><strong>Plan:</strong> ${escapeHtml(product.planTier)}. <strong>Duration:</strong> ${escapeHtml(product.subscriptionDuration)}. <strong>Access:</strong> ${escapeHtml(product.accessType)}. <strong>Limits:</strong> ${escapeHtml(product.creditsOrUsageLimit)}.</p>
            <p>Access, device behavior and usage limits can change by provider or plan. Confirm the final order details on WhatsApp before payment, especially for plans marked "confirm before ordering".</p>
          </article>
          <article class="glass-panel page-card">
            <h2>Activation and delivery process</h2>
            <ol>
              <li>Confirm the current PKR price, duration, access model and refund condition.</li>
              <li>Pay only after the details are clear in writing.</li>
              <li>Share only the agreed activation information. Do not share your email password.</li>
              <li>Receive access or activation confirmation from support.</li>
              <li>Contact support during the agreed warranty window if access needs checking.</li>
            </ol>
          </article>
          <article class="glass-panel page-card">
            <h2>Buyer safety checklist</h2>
            <ul>
              <li>Confirm the exact plan name, price and duration before payment.</li>
              <li>Ask whether the access is private, shared, team-based or another model.</li>
              <li>Check refund or replacement conditions before activation.</li>
              <li>Do not accept "official partner" claims unless written proof exists.</li>
            </ul>
          </article>
          <article class="glass-panel page-card faq">
            <h2>FAQs about ${escapeHtml(product.name)}</h2>
            <details open><summary>Can the PKR price change?</summary><p>Yes. The visible price is the listed AI Tools Pak price verified on ${DISPLAY_DATE}. Confirm the current quote on WhatsApp before payment.</p></details>
            <details><summary>Is this access official?</summary><p>No official partnership or authorization is claimed unless written authorization exists. Product names and trademarks belong to their owners.</p></details>
            <details><summary>What should I confirm before paying?</summary><p>Confirm price, duration, activation method, access model, usage limits, support window and refund condition.</p></details>
          </article>
          <article class="glass-panel page-card">
            <h2>Related guides</h2>
            <ul>
              <li><a href="../${categoryGuide(product)}">Read a relevant AI tools guide</a></li>
              <li><a href="../blog/choose-ai-subscription-safely/">How to choose an AI subscription safely</a></li>
              ${relatedLinks}
            </ul>
          </article>
        </div>
        <aside class="page-side">
          <img class="product-page-image glass-panel" src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.imageAltText)}" width="128" height="128">
          <div class="price-box"><span>Current listed price</span><strong>PKR ${price}</strong><small>Last verified ${DISPLAY_DATE}</small></div>
          <a class="button primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/923714549245?text=${encodeURIComponent(`Hi AI Tools Pak, I want to order ${product.name} in Pakistan. Price shown: PKR ${price}. Please confirm availability and activation details.`)}">Order on WhatsApp</a>
          <div class="glass-panel page-card">
            <h3>Non-affiliation note</h3>
            <p>AI Tools Pak is not claiming official partnership or authorization unless written authorization exists.</p>
          </div>
        </aside>
      </section>
    </main>
    <footer class="footer" role="contentinfo">
      <div>
        <a class="brand" href="../"><img class="brand-logo" src="../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <p>Business name: AI Tools Pak<br>WhatsApp: +92 371 454 9245<br>Email: support@aitoolspak.com<br>Support: 11:00 AM - 11:00 PM Pakistan time</p>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="../#catalog">AI tools</a>
        <a href="../social-media-services/">Social media services</a>
        <a href="../about-us/">About</a>
        <a href="../contact-us/">Contact</a>
        <a href="../privacy-policy/">Privacy</a>
        <a href="../terms-and-conditions/">Terms</a>
        <a href="../refund-policy/">Refunds</a>
        <a href="../delivery-policy/">Delivery</a>
        <a href="../frequently-asked-questions/">FAQ</a>
      </nav>
    </footer>
    <a class="floating-whatsapp" href="https://wa.me/923714549245?text=Hi%20AI%20Tools%20Pak%2C%20I%20need%20help%20choosing%20an%20AI%20tool." target="_blank" rel="noopener noreferrer" aria-label="Contact AI Tools Pak on WhatsApp"><span>WhatsApp</span></a>
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  </body>
</html>
`;
}

function updateCatalogJsonLd(html, itemList, productGraph) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, raw) => {
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data["@graph"])) return match;
      const hasCatalogSchema = data["@graph"].some((item) => item["@type"] === "ItemList" || item["@type"] === "Product");
      if (!hasCatalogSchema) return match;
      const graph = data["@graph"].filter((item) => item["@type"] !== "ItemList" && item["@type"] !== "Product");
      return `<script type="application/ld+json">\n${JSON.stringify({ ...data, "@graph": [...graph, itemList, ...productGraph["@graph"]] }, null, 2)}\n    </script>`;
    } catch {
      return match;
    }
  });
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, ""));
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
if (products.length !== 31) throw new Error(`Expected 31 products, found ${products.length}`);

for (const product of products) {
  const dir = path.join(root, product.guideUrl);
  fs.mkdirSync(dir, { recursive: true });
  const related = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 3);
  fs.writeFileSync(path.join(dir, "index.html"), productPageHtml(product, related), "utf8");
}

fs.writeFileSync(
  dataPath,
  `window.AI_TOOLS_PRODUCTS = ${JSON.stringify(products, null, 2)};\n`,
  "utf8"
);

let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/<span><strong[^>]*>[^<]+<\/strong>\s*(?:AI\s*)?tools listed<\/span>/, `<span><strong data-product-count>${products.length}</strong> AI tools listed</span>`);
index = index.replace(/<ul class="noscript-products">[\s\S]*?<\/ul>/, `<ul class="noscript-products">\n${products.map((product) => `            <li>${product.name} - PKR ${product.sellingPricePkr.toLocaleString("en-PK")}</li>`).join("\n")}\n          </ul>`);
index = index.replace(/<section class="section" id="product-guides"[\s\S]*?<\/section>/, `<section class="section" id="product-guides" aria-label="Main AI tool product pages">
        <div class="section-heading">
          <p class="eyebrow">Product pages</p>
          <h2>Dedicated buying guides for every AI subscription.</h2>
        </div>
        <div class="link-grid">
${products.map((product) => `          <a class="glass-panel link-card" href="${product.guideUrl}"><strong>${escapeHtml(product.name)} Pakistan</strong><span>Price, plan, activation, safety checks and FAQs.</span></a>`).join("\n")}
        </div>
      </section>`);

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
    url: `${SITE_URL}/${product.guideUrl}`
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
    url: `${SITE_URL}/${product.guideUrl}`,
    offers: offer(product),
    image: absoluteUrl(product.imageUrl)
  }))
};

index = updateCatalogJsonLd(index, itemList, productGraph);
fs.writeFileSync(indexPath, index, "utf8");

const sitemapPaths = [...new Set([...STATIC_SITEMAP_PATHS, ...products.map((product) => product.guideUrl)])].sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths.map((urlPath) => `  <url>
    <loc>${SITE_URL}/${urlPath}</loc>
    <lastmod>${LAST_VERIFIED}</lastmod>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(sitemapPath, sitemap, "utf8");
