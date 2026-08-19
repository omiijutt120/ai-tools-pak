const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data", "social-media-services-source.csv");
const pricedCsvPath = path.join(root, "data", "social-media-services-priced.csv");
const reviewCsvPath = path.join(root, "data", "social-media-services-price-review.csv");
const reportPath = path.join(root, "data", "social-media-services-validation-report.txt");
const dataPath = path.join(root, "social-services-data.js");

const USD_TO_PKR = 278.025;
const SOCIAL_SERVICE_MARKUP = 0.30;
const IMPORT_DATE = "2026-07-16";

const slots = [
  { id: "text-center", name: "title", time: "title 2", details: "content" },
  { id: "text-center 2", name: "title 3", time: "title 4", details: "content 2" },
  { id: "text-center 3", name: "title 5", time: "title 6", details: "content 3" },
  { id: "text-center 4", name: "title 7", time: "title 8", details: "content 4" },
  { id: "text-center 5", name: "title 9", time: "title 10", details: "content 5" },
  { id: "text-center 6", name: "title 11", time: "title 12", details: "content 6" }
];

const outputHeaders = [
  "catalog_id",
  "old_service_id",
  "current_provider_id",
  "category",
  "service_name",
  "average_time",
  "details",
  "base_rate_usd",
  "usd_to_pkr",
  "base_rate_pkr",
  "markup_percent",
  "selling_rate_pkr",
  "min_quantity",
  "max_quantity",
  "pricing_basis",
  "match_status",
  "match_confidence",
  "matched_provider_name",
  "price_checked_at"
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

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, rows) {
  const lines = [
    outputHeaders.join(","),
    ...rows.map((row) => outputHeaders.map((header) => csvCell(row[header])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function replaceAffordableTerms(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\bcheapest\b/gi, "most affordable")
    .replace(/\bcheaper\b/gi, "more affordable")
    .replace(/\bcheap\b/gi, "affordable");
}

function normalizeText(value) {
  return replaceAffordableTerms(value)
    .replace(/tik\s*tok/gi, "TikTok")
    .replace(/100\s*k/gi, "100K")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[^\p{L}\p{N}\s/+-]/gu, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function platformFor(serviceName, category) {
  const text = normalizeText(`${category} ${serviceName}`);
  if (text.includes("instagram")) return "Instagram";
  if (text.includes("tiktok")) return "TikTok";
  if (text.includes("youtube")) return "YouTube";
  if (text.includes("facebook") || /\bfb\b/.test(text)) return "Facebook";
  if (text.includes("telegram")) return "Telegram";
  if (text.includes("whatsapp") || text.includes("whats app")) return "WhatsApp";
  if (text.includes("twitter") || text.includes(" x ")) return "Twitter/X";
  if (text.includes("spotify")) return "Spotify";
  return "Other";
}

function pricingBasis(serviceName, details) {
  const text = normalizeText(`${serviceName} ${details}`);
  return /\b(account|accounts|coins|top up|top-up|package|gmail|login|credentials)\b/.test(text)
    ? "per_item"
    : "per_1000";
}

function isSensitive(serviceName, details) {
  return /\b(password|credentials|gmail|login|2fa|two-factor|otp)\b/i.test(`${serviceName} ${details}`);
}

function duplicateCount(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values.filter(Boolean)) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return duplicates.size;
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

const rows = parseCsv(fs.readFileSync(sourcePath, "utf8"));
const headers = rows.shift();
const sourceRows = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
const services = [];
let placeholders = 0;
let sourceMode = "packed-unpriced";

if (headers.includes("rate_pkr") && headers.includes("service_name")) {
  sourceMode = "priced-pkr";
  for (const row of sourceRows) {
    const serviceName = replaceAffordableTerms(row.service_name).trim();
    if (!serviceName || serviceName === "No service") {
      placeholders += 1;
      continue;
    }

    const sellingRatePkr = numberOrNull(row.rate_pkr);
    const baseRatePkr = sellingRatePkr ? round(sellingRatePkr / (1 + SOCIAL_SERVICE_MARKUP), 2) : "";
    const baseRateUsd = sellingRatePkr ? round(baseRatePkr / USD_TO_PKR, 6) : "";

    const catalogId = `SMS-${String(services.length + 1).padStart(4, "0")}`;

    services.push({
      catalog_id: catalogId,
      old_service_id: String(row.id || "").trim(),
      current_provider_id: String(row.id || "").trim(),
      platform: String(row.platform || "").trim(),
      category: String(row.category || "Social Media Services").trim(),
      service_name: serviceName,
      average_time: String(row.average_time || "Confirm on WhatsApp").trim(),
      details: "",
      base_rate_usd: baseRateUsd,
      usd_to_pkr: USD_TO_PKR,
      base_rate_pkr: baseRatePkr,
      markup_percent: SOCIAL_SERVICE_MARKUP,
      selling_rate_pkr: sellingRatePkr || "",
      min_quantity: String(row.min_quantity || "").trim(),
      max_quantity: String(row.max_quantity || "").trim(),
      pricing_basis: String(row.pricing_basis || pricingBasis(serviceName, "")).trim(),
      match_status: sellingRatePkr ? "exact" : "review",
      match_confidence: sellingRatePkr ? "1" : "0",
      matched_provider_name: serviceName,
      price_checked_at: IMPORT_DATE
    });
  }
} else {
  for (const row of sourceRows) {
    for (const slot of slots) {
      const sourceId = String(row[slot.id] || "").trim();
      const serviceName = replaceAffordableTerms(row[slot.name]).trim();
      if (!sourceId && !serviceName) continue;
      if (!serviceName || serviceName === "No service") {
        placeholders += 1;
        continue;
      }

      const catalogId = `SMS-${String(services.length + 1).padStart(4, "0")}`;
      const category = String(row["card-title"] || "Social Media Services").trim();
      const details = String(row[slot.details] || "").trim();
      const averageTime = String(row[slot.time] || "Confirm on WhatsApp").trim();

      services.push({
        catalog_id: catalogId,
        old_service_id: sourceId,
        current_provider_id: sourceId,
        platform: platformFor(serviceName, category),
        category,
        service_name: serviceName,
        average_time: averageTime || "Confirm on WhatsApp",
        details,
        base_rate_usd: "",
        usd_to_pkr: USD_TO_PKR,
        base_rate_pkr: "",
        markup_percent: SOCIAL_SERVICE_MARKUP,
        selling_rate_pkr: "",
        min_quantity: "",
        max_quantity: "",
        pricing_basis: pricingBasis(serviceName, details),
        match_status: "review",
        match_confidence: "0",
        matched_provider_name: "",
        price_checked_at: IMPORT_DATE
      });
    }
  }
}

const missingNames = services.filter((service) => !service.service_name.trim()).length;
const duplicateCatalogIds = duplicateCount(services.map((service) => service.catalog_id));
const duplicateOldIds = duplicateCount(services.map((service) => service.old_service_id));
const exactMatches = services.filter((service) => service.match_status === "exact").length;
const reviewMatches = services.filter((service) => service.match_status === "review").length;
const unmatched = services.filter((service) => service.match_status === "unmatched").length;
const invalidUsdRates = services.filter((service) => service.match_status === "exact" && (!Number.isFinite(Number(service.base_rate_usd)) || Number(service.base_rate_usd) <= 0)).length;
const invalidPkrPrices = services.filter((service) => service.match_status === "exact" && (!Number.isFinite(Number(service.selling_rate_pkr)) || Number(service.selling_rate_pkr) <= 0)).length;

const errors = [
  !services.length && "No services imported",
  duplicateCatalogIds && `Duplicate catalog IDs: ${duplicateCatalogIds}`,
  missingNames && `Missing service names: ${missingNames}`,
  invalidUsdRates && `Invalid USD rates: ${invalidUsdRates}`,
  invalidPkrPrices && `Invalid PKR prices: ${invalidPkrPrices}`
].filter(Boolean);

if (errors.length) throw new Error(errors.join("\n"));

writeCsv(pricedCsvPath, services);
writeCsv(reviewCsvPath, services.filter((service) => service.match_status !== "exact"));

const frontendServices = services.map((service) => ({
  catalogId: service.catalog_id,
  providerId: service.current_provider_id,
  category: service.category,
  serviceName: service.service_name,
  averageTime: service.average_time,
  details: service.details,
  pricingBasis: service.pricing_basis,
  sellingRatePkr: numberOrNull(service.selling_rate_pkr),
  minQuantity: numberOrNull(service.min_quantity),
  maxQuantity: numberOrNull(service.max_quantity),
  matchStatus: service.match_status,
  matchConfidence: Number(service.match_confidence),
  platform: service.platform || platformFor(service.service_name, service.category),
  sensitive: isSensitive(service.service_name, service.details),
  searchText: normalizeText([
    service.catalog_id,
    service.old_service_id,
    service.current_provider_id,
    service.category,
    service.service_name,
    service.details,
    service.average_time
  ].join(" "))
}));

fs.writeFileSync(
  dataPath,
  `window.SOCIAL_MEDIA_SERVICES = ${JSON.stringify(frontendServices, null, 2)};\n`,
  "utf8"
);

const report = [
  `Source mode: ${sourceMode}`,
  `CSV rows read: ${sourceRows.length}`,
  `CSV services read: ${services.length + placeholders}`,
  `Real services imported: ${services.length}`,
  `Exact price matches: ${exactMatches}`,
  `Matches requiring review: ${reviewMatches}`,
  `Unmatched services: ${unmatched}`,
  `Duplicate catalog IDs: ${duplicateCatalogIds}`,
  `Duplicate old IDs: ${duplicateOldIds}`,
  `Missing service names: ${missingNames}`,
  `Invalid USD rates: ${invalidUsdRates}`,
  `Invalid PKR prices: ${invalidPkrPrices}`,
  `No service placeholders excluded: ${placeholders}`,
  `USD to PKR: ${USD_TO_PKR}`,
  `Markup percent: ${SOCIAL_SERVICE_MARKUP}`,
  sourceMode === "priced-pkr"
    ? "Root cause fixed: the new CSV contains final PKR rates with 30% markup, so prices are imported directly and the frontend does not add markup again."
    : "Root cause: the supplied export contains service IDs, names, categories, average times and details, but no rate, minimum or maximum quantity columns. Prices were left for WhatsApp confirmation instead of being guessed."
].join("\n");

fs.writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(report);
