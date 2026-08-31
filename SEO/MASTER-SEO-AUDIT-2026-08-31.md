# Master SEO + GEO + AEO Audit — 2026-08-31

## Outcome

Fresh live technical health: **84/100**. The live crawl found 226 URLs (223 HTML), all 200, with complete titles/descriptions/canonicals and no invalid JSON-LD. Local implementation fixes the confirmed 31-vs-32 homepage Product-schema defect, sitemap omissions, an orphaned comparison hub and generic product-guide anchors. Deployment-dependent results are explicitly marked **NOT VERIFIED LIVE**.

## Scorecard

| Area | Score | Evidence |
|---|---:|---|
| Crawlability | 94 | 223/223 sitemap URLs returned 200; robots references sitemap |
| Indexability | 88 | Canonicals sound; 10 self-canonical pages absent from live sitemap |
| On-page metadata | 96 | 0 missing titles, descriptions or canonicals in fresh live crawl |
| Structured data | 90 | 0 invalid JSON-LD; live homepage has 31/32 Product nodes |
| Content / E-E-A-T | 82 | Strong buyer-safety and product facts; thin utility/category pages remain |
| Internal linking | 76 | 14 live zero-inbound URLs and generic anchors; local remediation completed for priority pages |
| Performance | 70 | Mobile Lighthouse lab: LCP 2.58s, TBT 1,067ms, CLS 0.010; INP unavailable |
| Security | 62 | HSTS present; normal responses lack CSP and other defense headers |
| GEO/AEO readiness | 91 | Strong machine files and passage-ready facts; FAQ rich-result markup intentionally absent |

## Critical evidence

- Live catalog data and all 32 generated product pages match source fields for name, PKR price, duration, access, canonical and Product schema.
- Before fix: homepage source=32, local/live Product schema=31, Runway ML Max absent.
- After fix: local Product schema=32 with 32 unique URLs and Runway ML Max present; live remains 31. **NOT VERIFIED LIVE**.
- Live crawler: 226/226 status 200; 0 invalid JSON-LD; 0 missing title/description/canonical; 14 orphans; 19 thin pages.
- Duplicate title/description is limited to `/` and `/index.html`; canonical consolidation exists, but an edge 301 is preferred.

## Implemented changes

### 1. Product/schema source-of-truth correction

Changed files: `scripts/generate-products.js`, `index.html`, 32 generated product pages and `sitemap.xml`.

The homepage JSON-LD updater now handles the actual top-level JSON array containing `@graph`. It regenerates the ItemList and all Product nodes from `data/products.csv`, eliminating the omitted Runway Max node. A parity checker now compares source, generated pages and live pages.

Verification command: `node scripts/check-seo-source-live-parity.js`

Actual output:

```text
source/generated/live parity: 32 products checked; 0 pages with mismatches
homepage products: source=32 local-schema=32/32 unique live-schema=31/31 unique
Runway ML Max: local=true live=false
```

Regression check: source/generated page parity passes; live homepage acceptance **NOT VERIFIED / expected failure until deploy**.

### 2. Internal-link architecture

Changed files: `index.html`, `scripts/generate-products.js`, `scripts/generate-comparisons.js`, 32 product pages and 7 comparison pages.

Homepage navigation now exposes the comparison hub, an additional-guides section links formerly orphaned commercial/supporting pages, comparison breadcrumbs link the hub, and product templates use descriptive exact-topic anchors.

Verification command: `node scripts/generate-products.js && node scripts/generate-comparisons.js`

Actual output:

```text
valid products imported: 32
comparison pages written: 7
```

Regression check: generator-owned pages regenerated successfully; live graph **NOT VERIFIED until deploy and recrawl**.

### 3. Sitemap completeness

Changed files: `scripts/generate-products.js`, `sitemap.xml`.

The author profile and nine self-canonical AI Income Lab documents were added to the sitemap source list. This resolves the observed mismatch without changing their indexability policy.

Verification command: `node scripts/generate-products.js`

Actual output: `valid products imported: 32` and sitemap regenerated.

Regression check: local sitemap validation included in the final command suite; Search Console discovery **NOT VERIFIED until deploy/submission**.

### 4. Reproducible live audit artifact

Changed files: `scripts/generate-live-seo-audit.js`, `SEO/LIVE-SEO-AUDIT-2026-08-31.csv`, `SEO/LIVE-SEO-AUDIT-2026-08-31.json`.

Verification command: `node scripts/generate-live-seo-audit.js`

Actual output:

```text
live seo audit: 226 URLs crawled; 223 HTML; 0 non-200; 0 invalid JSON-LD; 14 zero-inbound URLs
```

Regression check: CSV is generated from fresh network responses, not historical cache.

### 5. AI Income Lab index readiness

Changed files: nine `ai-income-lab/*.html` documents and `sitemap.xml`.

All nine self-canonical documents are now in the sitemap. Missing OG image/Twitter card metadata was added; article OG descriptions were completed; About, Contact and Privacy now carry appropriate JSON-LD page types.

Verification command: `node scripts/seo-audit.js`

Actual output: `seo audit ok: 233 sitemap URLs, metadata/schema/canonicals/product links checked`

Regression check: local metadata/schema gate passes. Live index discovery is **NOT VERIFIED until deployment and sitemap submission**.

## Technical audit details

- Redirects: HTTP and `www` use one-hop 301 to HTTPS apex. Slashless product routes redirect to trailing slash.
- Canonicals: every indexable full document has one self-matching canonical; three legacy aliases are intentional `noindex,follow`.
- Robots: allows the site, blocks implementation/data files, explicitly permits major AI crawlers and exposes sitemap/machine files.
- Hreflang: only six pages use it and no alternate language versions exist. Low priority: remove partial markup or standardize sitewide only when genuine localized alternatives exist.
- Schema: 335 local JSON-LD blocks parse. `Dataset` on the subscription price index remains valid Schema.org semantics but has no expected Google rich-result benefit after retirement.
- FAQ markup was not added: current Google FAQ rich-result eligibility is restricted, so visible FAQs remain preferable to unsupported schema inflation.

## Performance and security actions requiring infrastructure

1. Self-host/subset WOFF2 fonts, preload only above-fold fonts and keep a system fallback.
2. Inline minimal critical CSS, defer noncritical styles/scripts and reduce initial product-grid layout work without removing crawlable links.
3. Run three mobile Lighthouse samples and use the median; connect PSI/CrUX before claiming p75 CWV or INP.
4. At Cloudflare/CDN, test then add CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and clickjacking protection. GitHub Pages does not provide these normal-page headers.
5. Add an exact edge 301 from `/*/index.html` to the directory URL, excluding genuine standalone `.html` articles.

These infrastructure changes are **UNVERIFIED and not applied in this repository**.

## Content, GEO and AEO

- Keep prices, duration, access model, last-verified date, delivery checkpoints and refund caveats together in concise answer passages.
- Preserve explicit “no official partnership claimed without proof” language.
- Machine-readable resources are a differentiator; regenerate them from source whenever product facts change.
- Do not invent ratings, reviews, inventory, guarantees, partner status, search volume, traffic, rankings, backlinks or AI citations.
- Prioritize workflow hubs and the factual order/access-model guide identified in the competitor gap report.

## Priority roadmap

### P0 — before deployment

- Run the full regression suite and review the generated homepage diff.
- Deploy the 32-product schema and internal-link changes together.
- Recrawl live and confirm 32/32 homepage schema, comparison-hub inbound links and sitemap inclusion.

### P1 — next sprint

- Improve font/render/layout cost and collect field CWV.
- Configure edge security headers and `/index.html` redirects.
- Publish the ordering/access-model hub and three workflow category hubs.

### P2/P3

- Link the remaining AI Post orphan editorially.
- Decide partial hreflang and deprecated Dataset semantics.
- Monitor query/page pairs in GSC for cannibalization rather than merging distinct intents pre-emptively.

## Supporting artifacts

- `SEO/LIVE-SEO-AUDIT-2026-08-31.csv`
- `SEO/LIVE-SEO-AUDIT-2026-08-31.json`
- `SEO/STALE-DATA-VALIDATION-BEFORE-2026-08-31.json`
- `SEO/STALE-DATA-VALIDATION-2026-08-31.json`
- `SEO/COMPETITOR-GAP-ANALYSIS-2026-08-31.md`
- `SEO/INTERNAL-LINK-AUDIT-2026-08-31.md`

## Final regression result

Passing locally: JavaScript syntax checks, 32-product pipeline, catalog rendering, 487 social-service rows and WhatsApp totals, internal links/buttons across 191 checked HTML files, 233-URL SEO metadata/schema/canonical audit, `ads.txt`, and `git diff --check`.

External backlink checker returned several `LOST_OR_UNVERIFIED` and two provider `CHECK_FAILED` results. These are evidence gaps, not fabricated backlink losses; they require a reliable backlink provider or manual verification. The source/live parity command remains an expected non-zero result only because the corrected homepage has not been deployed.
