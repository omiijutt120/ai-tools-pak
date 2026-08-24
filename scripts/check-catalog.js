global.window = { location: { search: "" }, open() {} };
require("../products-data.js");
const fs = require("fs");
const path = require("path");

const elements = new Map();
function element() {
  return {
    innerHTML: "",
    textContent: "",
    value: "",
    hidden: false,
    href: "",
    dataset: {},
    listeners: {},
    classList: {
      toggle() {},
      remove() {},
      contains() { return false; }
    },
    addEventListener(type, handler) {
      this.listeners[type] = handler;
    },
    setAttribute() {},
    scrollIntoView() {},
    focus() {},
    close() {},
    showModal() {}
  };
}

for (const selector of [
  "#productGrid",
  "#categoryGrid",
  "#searchInput",
  "#cartCount",
  "#detailDialog",
  "#dialogContent",
  "#finderForm",
  "#finderResult",
  "#requestForm",
  "#requestInput",
  "[data-clear-category]",
  "[data-product-count]",
  "[data-floating-whatsapp]",
  "[data-contact-whatsapp]",
  "[data-mobile-menu]",
  "[data-menu-toggle]",
  "#catalog"
]) {
  elements.set(selector, element());
}

global.document = {
  querySelector(selector) {
    return elements.get(selector) || element();
  },
  querySelectorAll() {
    return [];
  },
  addEventListener() {}
};

global.localStorage = {
  getItem() { return "[]"; },
  setItem() {}
};

global.FormData = class {
  get(key) {
    return key === "need" ? "writing" : "2500";
  }
};

require("../script.js");

const products = window.AI_TOOLS_PRODUCTS;
const productGrid = elements.get("#productGrid");
const categoryGrid = elements.get("#categoryGrid");
const searchInput = elements.get("#searchInput");
const fullCatalogHtml = productGrid.innerHTML;
const homeHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const stylesHtml = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
const expected = [
  ["chatgpt-plus", "ChatGPT Plus", 2200, "1 month"],
  ["claude-ai", "Claude Pro", 5500, "1 month"],
  ["gemini-pro", "Gemini Pro", 900, "18 months"],
  ["elevenlabs-creator-private", "ElevenLabs Creator - Private", 3300, "1 month"],
  ["runway-ml-unlimited-generations", "Runway ML - Unlimited Generations", 2520, "1 month"],
  ["leonardo-ai", "Leonardo AI", 1200, "1 month"],
  ["grammarly-pro", "Grammarly Premium", 1000, "1 month"],
  ["quillbot", "QuillBot", 479, "1 month"],
  ["lovable-ai-pro-private", "Lovable AI Pro - Private", 1500, "1 month"],
  ["heygen-ai", "HeyGen AI", 7400, "1 month"],
  ["ideogram-ai-plus-private", "Ideogram AI Plus", 1500, "1 month"],
  ["success-ai-starter-leads", "Success.ai Starter Leads", 2400, "1 month"],
  ["vidiq", "vidIQ", 2159, "1 month"],
  ["playht", "PlayHT", 3960, "1 month"],
  ["supergrok", "SuperGrok", 2500, "1–3 months"],
  ["wordai", "WordAI", 600, "1 month"],
  ["jasper-ai", "Jasper AI", 600, "1 month"],
  ["google-ai-ultra-plan", "Google AI Ultra Plan", 1764, "1 month"],
  ["hailuo-ai", "Hailuo AI", 2040, "1 month"],
  ["netflix", "Netflix", 500, "1 month"],
  ["capcut-pro", "CapCut Pro", 900, "1 month"],
  ["veo-3-extension", "Veo 3 Extension", 3000, "1 month"],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const productCount = products.length;
const displayedCount = Number(homeHtml.match(/data-product-count>(\d+)</)?.[1]);
const guideSection = homeHtml.match(/<section class="section" id="product-guides"[\s\S]*?<\/section>/)?.[0] || "";
const guideCount = (guideSection.match(/class="glass-panel link-card"/g) || []).length;
assert(productCount >= expected.length, `Expected at least ${expected.length} products, found ${productCount}`);
assert(displayedCount === guideCount, `Homepage count mismatch: banner ${displayedCount}, guide cards ${guideCount}`);
assert(guideCount === productCount, `Homepage guide count mismatch: ${guideCount} cards, ${productCount} products`);
assert(!guideSection.includes("Price, plan, activation, safety checks and FAQs."), "Generic product-guide teaser regression detected");
assert((productGrid.innerHTML.match(/class="glass-panel product-card"/g) || []).length === productCount, `Expected ${productCount} rendered product cards`);
assert((categoryGrid.innerHTML.match(/class="glass-panel category-card"/g) || []).length === new Set(products.map((product) => product.category)).size, "Category buttons do not match CSV categories");
assert(homeHtml.indexOf('id="social-media-services"') < homeHtml.indexOf('id="catalog"'), "Social media services promo must appear above tools catalog");
assert(homeHtml.indexOf('id="catalog"') < homeHtml.indexOf('class="trust-strip"'), "Catalog section must appear before trust/info sections");
assert(/\.nav-shell\s*\{[\s\S]*?overflow:\s*visible;/.test(stylesHtml), "Mobile menu is clipped because nav shell overflow is not visible");
assert(!/<img[^>]*src="[^"]*logo\.svg/i.test(homeHtml) && homeHtml.includes('src="logo.png"'), "Homepage logo image not updated");

for (const [slug] of expected) {
  const product = products.find((item) => item.slug === slug);
  assert(product, `Missing product: ${slug}`);
  const name = product.name;
  assert(Number.isFinite(product.sellingPricePkr) && product.sellingPricePkr > 0, `Invalid PKR selling price for ${slug}`);
  assert(product.subscriptionDuration, `Missing duration for ${slug}`);
  assert(fullCatalogHtml.includes(name), `Rendered catalog missing ${name}`);
  assert(fullCatalogHtml.includes(`data-add="${slug}"`), `Cart button does not use slug for ${slug}`);
  assert(fullCatalogHtml.includes(`data-details="${slug}"`), `Details button does not use slug for ${slug}`);
  searchInput.value = name;
  searchInput.listeners.input();
  assert(productGrid.innerHTML.includes(name), `Search cannot find ${name}`);
}

assert(!products.some((product) => !product.imageUrl || !product.imageAltText), "Product image data missing");
for (const product of products) {
  assert(product.imageUrl.startsWith("/assets/product-icons/"), `Image must be in product-icons for ${product.slug}`);
  const imgPath = path.join(__dirname, "..", product.imageUrl.replace(/^\//, ""));
  assert(fs.existsSync(imgPath), `Missing product image file for ${product.slug}: ${product.imageUrl}`);
  assert(fullCatalogHtml.includes(`src="${product.imageUrl}"`), `Rendered catalog missing image for ${product.slug}`);
}
assert(new Set(products.map((product) => product.productId)).size === productCount, "Duplicate product IDs");
assert(new Set(products.map((product) => product.sku)).size === productCount, "Duplicate SKUs");
assert(new Set(products.map((product) => product.slug)).size === productCount, "Duplicate slugs");
assert(fullCatalogHtml.includes("Confirm details before ordering"), "Supplier confirmation notice missing");

console.log(`catalog render ok: ${productCount} products searchable, prices and durations verified`);
