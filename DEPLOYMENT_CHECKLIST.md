# Deployment Checklist

Generated: 2026-07-19

## Pre-deploy checks

- [x] Product catalog check passed.
- [x] Social media service check passed.
- [x] Internal link/button check passed across 43 HTML files.
- [x] SEO audit passed across 43 sitemap URLs.
- [x] JSON-LD parsed successfully.
- [x] FAQPage questions match visible FAQ content.
- [x] JavaScript syntax checks passed.

## Deploy

- [ ] Copy this folder's contents to the GitHub Pages repository root.
- [ ] Keep `CNAME` unchanged.
- [ ] Do not upload old ZIP files, browser debug folders or runtime captures.
- [ ] Confirm the homepage, `/blog/`, three new guides and `/social-media-services/` return HTTP 200.
- [ ] Confirm `robots.txt`, `sitemap.xml` and `llms.txt` return HTTP 200.

## Google Search Console after deploy

- [ ] Resubmit `https://aitoolspak.tech/sitemap.xml`.
- [ ] Request indexing for `/`, `/blog/`, the three new guides and `/social-media-services/`.
- [ ] Inspect canonical selection and rendered HTML.
- [ ] Record baseline impressions, clicks, CTR and indexed URL count.
