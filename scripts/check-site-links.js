const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const skip = new Set([
  ".git",
  ".deploy-ai-tools-pak",
  ".agents",
  ".claude",
  "ai-income-lab",
  "ai-post",
  "claude-seo",
  "audit-input-2026-07-19",
  "audit-site",
  "aitoolspak.tech-audit",
  "fixed-v2-work",
  "release-fixed-v3-deploy",
  "release-fixed-v3-source",
  "node_modules"
]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name) || entry.name.startsWith(".chrome-")) return [];
    if (/-dom\.html$/.test(entry.name) || /runtime-.*\.html$/.test(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : (entry.name.endsWith(".html") && !entry.name.startsWith("_") ? [full] : []);
  });
}

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/\s([\w:-]+)(?:=(["'])(.*?)\2)?/g)].map((match) => [match[1].toLowerCase(), match[3] || ""]));
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function localTarget(file, href) {
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return null;
  const [rawPathWithQuery, hash = ""] = href.split("#");
  const rawPath = rawPathWithQuery.split("?")[0];
  const targetPath = rawPath || path.basename(file);
  let resolved = targetPath.startsWith("/")
    ? path.join(root, targetPath.slice(1))
    : path.resolve(path.dirname(file), targetPath);
  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) resolved = path.join(resolved, "index.html");
  return { resolved, hash };
}

const htmlFiles = walk(root);
const htmlCache = new Map(htmlFiles.map((file) => [file, fs.readFileSync(file, "utf8")]));
const errors = [];
const inboundSources = new Map();
const contextualInboundSources = new Map();

for (const [file, html] of htmlCache) {
  const rel = path.relative(root, file);

  if (!/<meta\s+http-equiv=["']Content-Security-Policy["']/i.test(html)) errors.push(`${rel}: missing Content-Security-Policy meta`);
  if (!/<meta\s+name=["']referrer["']\s+content=["']strict-origin-when-cross-origin["']/i.test(html)) errors.push(`${rel}: missing strict referrer policy`);
  if (/\son[a-z]+\s*=/i.test(html)) errors.push(`${rel}: inline event handler found`);

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const tagAttrs = attrs(match[0]);
    const href = tagAttrs.href;
    if (!href) errors.push(`${rel}: anchor without href`);
    if ((tagAttrs.target || "").toLowerCase() === "_blank") {
      const relTokens = new Set((tagAttrs.rel || "").toLowerCase().split(/\s+/).filter(Boolean));
      if (!relTokens.has("noopener") || !relTokens.has("noreferrer")) errors.push(`${rel}: _blank link missing noopener noreferrer`);
    }
    const target = localTarget(file, href);
    if (!target) continue;
    if (!fs.existsSync(target.resolved)) {
      errors.push(`${rel}: missing href target ${href}`);
      continue;
    }
    if (target.resolved.endsWith("index.html")) {
      if (!inboundSources.has(target.resolved)) inboundSources.set(target.resolved, new Set());
      inboundSources.get(target.resolved).add(file);
      const mainStart = html.search(/<main\b/i);
      const mainEnd = html.search(/<\/main>/i);
      if (mainStart >= 0 && mainEnd > mainStart && match.index > mainStart && match.index < mainEnd) {
        if (!contextualInboundSources.has(target.resolved)) contextualInboundSources.set(target.resolved, new Set());
        contextualInboundSources.get(target.resolved).add(file);
      }
    }
    if (target.hash) {
      const targetHtml = fs.readFileSync(target.resolved, "utf8");
      if (!new RegExp(`\\bid=["']${target.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(targetHtml)) {
        errors.push(`${rel}: missing hash target ${href}`);
      }
    }
  }

  for (const match of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const tagAttrs = attrs(match[0]);
    if (match[1].toLowerCase() === "script" && !tagAttrs.src && (tagAttrs.type || "").toLowerCase() !== "application/ld+json") {
      errors.push(`${rel}: inline executable script found`);
    }
    const href = tagAttrs.src || (tagAttrs.rel === "stylesheet" || tagAttrs.rel === "icon" ? tagAttrs.href : "");
    const target = localTarget(file, href);
    if (target && !fs.existsSync(target.resolved)) errors.push(`${rel}: missing asset ${href}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tagAttrs = attrs(match[0]);
    const target = localTarget(file, tagAttrs.src);
    if (target && !fs.existsSync(target.resolved)) errors.push(`${rel}: missing image ${tagAttrs.src}`);
  }

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tagAttrs = attrs(match[0]);
    const label = tagAttrs["aria-label"] || stripTags(match[1]);
    if (!label) errors.push(`${rel}: button without visible text or aria-label`);
    if (!tagAttrs.type) errors.push(`${rel}: button missing type`);
  }
}

if (errors.length) throw new Error(errors.join("\n"));
const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const guideSection = homeHtml.match(/<section class="section" id="product-guides"[\s\S]*?<\/section>/)?.[0] || "";
const productTargets = [...guideSection.matchAll(/href="([^"]+-pakistan\/)"/g)]
  .map((match) => path.join(root, match[1], "index.html"))
  .filter((file, index, files) => files.indexOf(file) === index && fs.existsSync(file));
const inlinkReport = productTargets.map((file) => ({
  url: `/${path.relative(root, path.dirname(file)).replace(/\\/g, "/")}/`,
  inlinks: inboundSources.get(file)?.size || 0,
  contextualInlinks: contextualInboundSources.get(file)?.size || 0
})).sort((a, b) => a.inlinks - b.inlinks || a.url.localeCompare(b.url));
console.log(`product inlinks: ${inlinkReport.map((item) => `${item.url}=${item.inlinks} (${item.contextualInlinks} contextual)`).join(", ")}`);
console.log(`site links/buttons ok: ${htmlFiles.length} HTML files checked`);
