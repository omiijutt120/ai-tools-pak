const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const skip = new Set([".git", ".deploy-ai-tools-pak", "node_modules"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name) || entry.name.startsWith(".chrome-")) return [];
    if (/-dom\.html$/.test(entry.name) || /runtime-.*\.html$/.test(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : (entry.name.endsWith(".html") ? [full] : []);
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
  const [rawPath, hash = ""] = href.split("#");
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

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tagAttrs = attrs(match[0]);
    const label = tagAttrs["aria-label"] || stripTags(match[1]);
    if (!label) errors.push(`${rel}: button without visible text or aria-label`);
    if (!tagAttrs.type) errors.push(`${rel}: button missing type`);
  }
}

if (errors.length) throw new Error(errors.join("\n"));
console.log(`site links/buttons ok: ${htmlFiles.length} HTML files checked`);
