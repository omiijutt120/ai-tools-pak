# Broken Link Report

Generated: 2026-07-16

## Result

- Internal links and buttons: PASS
- HTML files checked: 38
- Sitemap URLs checked over local HTTP: 38
- HTTP failures: 0
- Broken internal links found: 0

## Command Evidence

`node scripts/check-site-links.js` returned: `site links/buttons ok: 38 HTML files checked`.

## Notes

External WhatsApp and official-source links are intentionally not treated as broken internal links. They use `target="_blank"` and `rel="noopener"` where appropriate.
