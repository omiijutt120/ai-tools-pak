global.window = { location: { search: "" }, open() {} };
require("../products-data.js");

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
const missing = [
  ["vidiq", "vidIQ", 2159],
  ["playht", "PlayHT", 3960],
  ["supergrok", "SuperGrok", 1800],
  ["wordai", "WordAI", 600],
  ["jasper-ai", "Jasper AI", 600],
  ["google-ai-ultra-plan", "Google AI Ultra Plan", 1764],
  ["hailuo-ai", "Hailuo AI", 2040]
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(products.length === 19, `Expected 19 products, found ${products.length}`);
assert((productGrid.innerHTML.match(/class="glass-panel product-card"/g) || []).length === 19, "Expected 19 rendered product cards");
assert((categoryGrid.innerHTML.match(/class="glass-panel category-card"/g) || []).length === new Set(products.map((product) => product.category)).size, "Category buttons do not match CSV categories");

for (const [slug, name, price] of missing) {
  const product = products.find((item) => item.slug === slug);
  assert(product, `Missing product: ${slug}`);
  assert(product.sellingPricePkr === price, `Wrong selling price for ${slug}`);
  assert(product.sellingPricePkr === Math.round(product.basePricePkr * 1.2), `Markup applied incorrectly for ${slug}`);
  assert(fullCatalogHtml.includes(name), `Rendered catalog missing ${name}`);
  assert(fullCatalogHtml.includes(`data-add="${slug}"`), `Cart button does not use slug for ${slug}`);
  assert(fullCatalogHtml.includes(`data-details="${slug}"`), `Details button does not use slug for ${slug}`);
  searchInput.value = name;
  searchInput.listeners.input();
  assert(productGrid.innerHTML.includes(name), `Search cannot find ${name}`);
}

assert(!products.some((product) => !product.imageUrl || !product.imageAltText), "Product image data missing");
assert(new Set(products.map((product) => product.productId)).size === 19, "Duplicate product IDs");
assert(new Set(products.map((product) => product.sku)).size === 19, "Duplicate SKUs");
assert(new Set(products.map((product) => product.slug)).size === 19, "Duplicate slugs");
assert(fullCatalogHtml.includes("Confirm details before ordering"), "Supplier confirmation notice missing");

console.log("catalog render ok: 19 products, 7 missing products searchable, prices marked up once");
