const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ignored = new Set([".git", "node_modules", "audit-codex-seo"]);
let changedFiles = 0;
let removedNodes = 0;

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function withoutFaqPage(value) {
  if (Array.isArray(value)) {
    return value.map(withoutFaqPage).filter((item) => item !== null);
  }
  if (!value || typeof value !== "object") return value;
  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (types.includes("FAQPage")) {
    removedNodes += 1;
    return null;
  }
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    const cleaned = withoutFaqPage(child);
    if (cleaned !== null) result[key] = cleaned;
  }
  return result;
}

for (const file of htmlFiles(root)) {
  const source = fs.readFileSync(file, "utf8");
  let fileChanged = false;
  const output = source.replace(
    /\s*<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    (block, jsonText) => {
      if (!jsonText.includes("FAQPage")) return block;
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        throw new Error(`Invalid JSON-LD in ${path.relative(root, file)}`);
      }
      const cleaned = withoutFaqPage(parsed);
      fileChanged = true;
      if (cleaned === null || (Array.isArray(cleaned) && cleaned.length === 0)) return "";
      return `\n    <script type="application/ld+json">\n${JSON.stringify(cleaned, null, 2)}\n    </script>`;
    }
  );
  if (fileChanged) {
    fs.writeFileSync(file, output);
    changedFiles += 1;
  }
}

console.log(`Removed ${removedNodes} commercial FAQPage node(s) from ${changedFiles} HTML file(s).`);
