# Deployment Checklist

Generated: 2026-07-16

## Pre-Deploy Checks

- [x] Product generator passed: `node scripts/generate-products.js`
- [x] Social service generator passed: `node scripts/generate-social-services.js`
- [x] Catalog check passed: `node scripts/check-catalog.js`
- [x] Social service check passed: `node scripts/check-social-services.js`
- [x] Internal link/button check passed: `node scripts/check-site-links.js`
- [x] SEO audit passed: `node scripts/seo-audit.js`
- [x] JavaScript syntax checks passed with `node --check`
- [x] Local HTTP route check passed for all sitemap URLs

## Search Console After Deploy

- [ ] Confirm `https://aitoolspak.tech/robots.txt` returns 200
- [ ] Confirm `https://aitoolspak.tech/sitemap.xml` returns 200
- [ ] Submit or refresh sitemap in Google Search Console
- [ ] Request indexing for homepage, important product pages and the social services page
- [ ] Run live URL inspection for one generated product page and one blog page
- [ ] Re-test Product snippets and Merchant listings after Google recrawls

## Sitemap Policy

- Include only canonical public URLs
- Exclude staging, admin, API, backup, duplicated hash URLs and local files
- Keep `lastmod` equal to the real content update date
- Do not add noindex URLs to the sitemap

## Owner Follow-Up

- Add real social profile links only after the profiles are provided
- Add testimonials/reviews only if real, permissioned and verifiable
- Update official source references when product plans or supplier availability changes
