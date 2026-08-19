global.window = { location: { search: "" }, open() {} };
require("../products-data.js");
const fs = require("fs");
const path = require("path");
const elements = new Map();
function element() {
  return {
    innerHTML: "", textContent: "", value: "", hidden: false, href: "", dataset: {}, listeners: {},
    classList: { toggle() {}, remove() {}, contains() { return false; } },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    setAttribute() {}, scrollIntoView() {}, focus() {}, close() {}, showModal() {}
  };
}
for (const selector of [
  "#productGrid", "#categoryGrid", "#searchInput", "#cartCount", "#detailDialog", "#dialogContent",
  "#finderForm", "#finderResult", "#requestForm", "#requestInput", "[data-clear-category]",
  "[data-product-count]", "[data-floating-whatsapp]", "[data-contact-whatsapp]", "[data-mobile-menu]",
  "[data-menu-toggle]", "#catalog"
]) elements.set(selector, element());
global.document = {
  querySelector(selector) { return elements.get(selector) || element(); },
  querySelectorAll() { return []; },
  addEventListener() {}
};
global.localStorage = { getItem() { return "[]"; }, setItem() {} };
global.FormData = class { get(key) { return key === "need" ? "writing" : "2500"; } };
require("../script.js");

const products = window.AI_TOOLS_PRODUCTS;
const productGrid = elements.get("#productGrid");
const categoryGrid = elements.get("#categoryGrid");
const searchInput = elements.get("#searchInput");
const fullCatalogHtml = productGrid.innerHTML;
const homeHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const stylesHtml = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
function assert(condition, message) { if (!condition) throw new Error(message); }

const productCount = products.length;
assert(productCount >= 1, "Catalog must contain at least one product");
assert((productGrid.innerHTML.match(/class="glass-panel product-card"/g) || []).length === productCount, `Expected ${productCount} rendered product cards`);
assert((categoryGrid.innerHTML.match(/class="glass-panel category-card"/g) || []).length === new Set(products.map((product) => product.category)).size, "Category buttons do not match catalog categories");
assert(homeHtml.indexOf('id="social-media-services"') < homeHtml.indexOf('id="catalog"'), "Social media services promo must appear above tools catalog");
assert(homeHtml.indexOf('id="catalog"') < homeHtml.indexOf('class="trust-strip"'), "Catalog section must appear before trust/info sections");
assert(/\.nav-shell\s*\{[\s\S]*?overflow:\s*visible;/.test(stylesHtml), "Mobile menu is clipped because nav shell overflow is not visible");
assert(!/<img[^>]*src="[^"]*logo\.svg/i.test(homeHtml) && homeHtml.includes('src="logo.png"'), "Homepage logo image not updated");

for (const product of products) {
  assert(Number.isFinite(product.sellingPricePkr) && product.sellingPricePkr > 0, `Invalid selling price for ${product.slug}`);
  assert(product.sellingPricePkr === Math.round(product.basePricePkr), `Selling price must match the CSV final price for ${product.slug}`);
  if (product.compareAtPricePkr) {
    const expectedDiscount = product.compareAtPricePkr > product.sellingPricePkr
      ? Math.round(((product.compareAtPricePkr - product.sellingPricePkr) / product.compareAtPricePkr) * 100)
      : null;
    assert(product.discountPercent === expectedDiscount, `Incorrect discount percentage for ${product.slug}`);
  }
  assert(fullCatalogHtml.includes(product.name), `Rendered catalog missing ${product.name}`);
  assert(fullCatalogHtml.includes(`data-add="${product.slug}"`), `Cart button does not use slug for ${product.slug}`);
  assert(fullCatalogHtml.includes(`data-details="${product.slug}"`), `Details button does not use slug for ${product.slug}`);
  searchInput.value = product.name;
  searchInput.listeners.input();
  assert(productGrid.innerHTML.includes(product.name), `Search cannot find ${product.name}`);
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
console.log(`catalog render ok: ${productCount} products searchable, final prices and discounts verified`);
