const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skip = new Set(['.git', 'node_modules', '.deploy-ai-tools-pak']);
const csp = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name) || entry.name.startsWith('.chrome-')) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : (entry.name.endsWith('.html') ? [full] : []);
  });
}

function attrs(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\s([\w:-]+)(?:=(["'])(.*?)\2)?/g)]
      .map((match) => [match[1].toLowerCase(), match[3] || ''])
  );
}

function hasMeta(html, predicate) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].some((match) => predicate(attrs(match[0])));
}

function insertionPoint(html) {
  const viewport = /<meta\b[^>]*name=["']viewport["'][^>]*>\s*/i.exec(html);
  if (viewport) return viewport.index + viewport[0].length;
  const charset = /<meta\b[^>]*(?:charset=|http-equiv=["']content-type["'])[^>]*>\s*/i.exec(html);
  if (charset) return charset.index + charset[0].length;
  const head = /<head[^>]*>\s*/i.exec(html);
  if (head) return head.index + head[0].length;
  return -1;
}

let changed = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const additions = [];
  const hasCsp = hasMeta(html, (a) => (a['http-equiv'] || '').toLowerCase() === 'content-security-policy');
  const hasReferrer = hasMeta(html, (a) => (a.name || '').toLowerCase() === 'referrer' && (a.content || '').toLowerCase() === 'strict-origin-when-cross-origin');

  if (!hasCsp) additions.push(`<meta http-equiv="Content-Security-Policy" content="${csp}">`);
  if (!hasReferrer) additions.push('<meta name="referrer" content="strict-origin-when-cross-origin">');
  if (!additions.length) continue;

  const point = insertionPoint(html);
  if (point < 0) throw new Error(`Cannot find <head> insertion point in ${path.relative(root, file)}`);
  const before = html.slice(0, point);
  const after = html.slice(point);
  const indent = /\n\s*$/.test(before) ? '  ' : '\n  ';
  html = `${before}${additions.map((line) => `${indent}${line}`).join('')}${after.startsWith('\n') ? '' : '\n'}${after}`;
  fs.writeFileSync(file, html, 'utf8');
  changed += 1;
}

console.log(`security meta applied: ${changed} HTML files updated`);
