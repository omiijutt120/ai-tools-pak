const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skip = new Set(['.git', 'node_modules', '.deploy-ai-tools-pak']);
const deprecated = new Set(['FAQPage', 'HowTo']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name) || entry.name.startsWith('.chrome-')) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : (entry.name.endsWith('.html') ? [full] : []);
  });
}

function isDeprecatedNode(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const type = value['@type'];
  if (typeof type === 'string') return deprecated.has(type);
  return Array.isArray(type) && type.some((item) => deprecated.has(item));
}

function clean(value) {
  if (Array.isArray(value)) return value.filter((item) => !isDeprecatedNode(item)).map(clean);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (isDeprecatedNode(item)) continue;
    result[key] = clean(item);
  }
  return result;
}

let changedFiles = 0;
let removedBlocks = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  html = html.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (full, raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return full; }
    const before = JSON.stringify(data);
    if (isDeprecatedNode(data)) {
      changed = true;
      removedBlocks += 1;
      return '';
    }
    const afterData = clean(data);
    const after = JSON.stringify(afterData);
    if (before === after) return full;
    changed = true;
    return `<script type="application/ld+json">\n${JSON.stringify(afterData, null, 2)}\n</script>`;
  });
  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    changedFiles += 1;
  }
}

console.log(`deprecated rich-result schema removed: ${changedFiles} HTML files updated, ${removedBlocks} standalone blocks removed`);
