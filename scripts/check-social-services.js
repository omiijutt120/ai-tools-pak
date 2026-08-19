const fs = require("fs");
const path = require("path");

global.window = {};
require("../site-config.js");
require("../social-services-data.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.resolve(__dirname, "..");
const services = window.SOCIAL_MEDIA_SERVICES;
const socialHtml = fs.readFileSync(path.join(root, "social-media-services", "index.html"), "utf8");
const socialScript = fs.readFileSync(path.join(root, "social-media-services", "social-services.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const productData = fs.readFileSync(path.join(root, "products-data.js"), "utf8");

assert(Array.isArray(services), "Social services data missing");
assert(services.length === 487, `Expected 487 services, found ${services.length}`);
assert(!services.some((service) => service.serviceName === "No service"), "No service placeholder was not excluded");
assert(new Set(services.map((service) => service.catalogId)).size === services.length, "Catalog IDs must be unique");
assert(services.every((service) => service.matchStatus === "exact" && service.sellingRatePkr > 0), "Every service must have an exact PKR price");
assert(services.every((service) => service.minQuantity > 0 && service.maxQuantity >= service.minQuantity), "Every service must have valid min/max quantities");
assert(!services.some((service) => String(service.sellingRatePkr) === service.providerId), "Service ID used as price");
assert(services.some((service) => service.searchText.includes("tiktok")), "Search text does not include service names");
assert(services.some((service) => service.platform === "Instagram"), "Instagram platform filter missing data");
assert(services.some((service) => service.platform === "TikTok"), "TikTok platform filter missing data");
assert(services.some((service) => service.platform === "YouTube"), "YouTube platform filter missing data");
assert(!/type=["']password["']/i.test(socialHtml + socialScript), "Password field found");
assert(window.AI_TOOLS_CONFIG.whatsappNumber === "923714549245", "Wrong WhatsApp number");
assert(/wa\.me\/\$\{whatsappNumber\}/.test(socialScript), "WhatsApp link does not use central number");
assert(/25/.test(socialHtml) && /50/.test(socialHtml) && /100/.test(socialHtml), "Pagination size controls missing");
assert(/@media \(max-width: 640px\)[\s\S]*\.platform-filters[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/.test(styles), "Mobile platform filters are not a clear 2-column grid");
assert(/@media \(max-width: 640px\)[\s\S]*\.platform-chip[\s\S]*white-space: normal/.test(styles), "Mobile platform chips cannot wrap text");
assert(/window\.AI_TOOLS_PRODUCTS = \[/.test(productData), "AI product data missing");
const productCount = (productData.match(/"productId"\s*:/g) || []).length;
assert(productCount >= 1, "AI product data is empty");

const service = services[0];
const fakeDocument = { querySelector() { return null; }, addEventListener() {} };
Function("window", "document", socialScript)(global.window, fakeDocument);
const utils = global.window.SOCIAL_SERVICES_UTILS;

assert(utils.displayPrice(service).startsWith("PKR "), "Price display does not show PKR");
assert(utils.calculateTotal(service, service.minQuantity) > 0, "Calculator did not produce a total");
assert(utils.buildWhatsAppMessage(service, service.minQuantity, "https://example.com").includes("Estimated Total: PKR"), "WhatsApp message missing estimated total");

// Static price-index section must stay in sync with the catalog data (SEO/AEO layer)
const staticPrices = {};
let priceMatch;
const priceRe = /data-platform="([^"]+)"[^>]*>PKR ([0-9,.]+)/g;
while ((priceMatch = priceRe.exec(socialHtml))) {
  staticPrices[priceMatch[1]] = parseFloat(priceMatch[2].replace(/,/g, ""));
}
const platforms = [...new Set(services.map((s) => s.platform))];
const missingPlatforms = platforms.filter((p) => staticPrices[p] === undefined);
assert(missingPlatforms.length === 0, `Static price index missing platform(s): ${missingPlatforms.join(", ")}`);
for (const p of platforms) {
  const minPkr = Math.min(...services.filter((s) => s.platform === p).map((s) => s.sellingRatePkr));
  assert(Math.abs(staticPrices[p] - minPkr) < 0.005, `Static min price for ${p} out of sync: HTML PKR ${staticPrices[p]} vs data PKR ${minPkr}`);
}
assert(/FAQPage/.test(socialHtml), "FAQPage schema missing on social media services page");
assert(/ItemList/.test(socialHtml), "ItemList schema missing on social media services page");
assert(platforms.every((p) => socialHtml.includes(`id="platform-${p.toLowerCase()}"`)), "Platform anchor missing in price index");

console.log(`social services ok: ${services.length} priced services, min/max quantities valid, WhatsApp totals working`);
