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
const productData = fs.readFileSync(path.join(root, "products-data.js"), "utf8");

assert(Array.isArray(services), "Social services data missing");
assert(services.length === 354, `Expected 354 services, found ${services.length}`);
assert(!services.some((service) => service.serviceName === "No service"), "No service placeholder was not excluded");
assert(new Set(services.map((service) => service.catalogId)).size === 354, "Catalog IDs must be unique");
assert(services.every((service) => service.matchStatus === "review" && service.sellingRatePkr === null), "Unverified services must not contain prices");
assert(!services.some((service) => String(service.sellingRatePkr) === service.providerId), "Service ID used as price");
assert(services.some((service) => service.searchText.includes("tiktok")), "Search text does not include service names");
assert(services.some((service) => service.platform === "Instagram"), "Instagram platform filter missing data");
assert(services.some((service) => service.platform === "TikTok"), "TikTok platform filter missing data");
assert(services.some((service) => service.platform === "YouTube"), "YouTube platform filter missing data");
assert(!/type=["']password["']/i.test(socialHtml + socialScript), "Password field found");
assert(window.AI_TOOLS_CONFIG.whatsappNumber === "923714549245", "Wrong WhatsApp number");
assert(/wa\.me\/\$\{whatsappNumber\}/.test(socialScript), "WhatsApp link does not use central number");
assert(/25/.test(socialHtml) && /50/.test(socialHtml) && /100/.test(socialHtml), "Pagination size controls missing");
assert(/window\.AI_TOOLS_PRODUCTS = \[/.test(productData), "AI product data missing");
assert((productData.match(/productId/g) || []).length === 19, "Existing AI products count changed");

console.log("social services ok: 354 services, placeholder excluded, all prices require WhatsApp confirmation");
