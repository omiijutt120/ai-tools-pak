# AI Tools Pak attachment audit

Audited: 2026-07-19  
Evidence: `AiTools-SEO-fixed.zip`, DOCX/PDF audit dated 2026-07-18  
Scope: packaged source, all 39 sitemap URLs, generators/checks, schema, content, and deployment artifacts

## Verdict

The ZIP fixes Claude Pro: its homepage listing, page copy, WhatsApp link, and Product/Offer schema all use PKR 2,800. ChatGPT Plus is consistently PKR 2,200. The package's four Node checks pass.

The handoff is still not production-clean. Its largest risks are deployment ambiguity, missing referenced assets, nearly duplicated product copy, inconsistent legacy product pages, and a price source that silently adds 20% during generation.

Estimated source-package SEO health: **61/100**. This is not a live ranking or Google indexation score.

## Critical / high findings

1. **The ZIP is polluted and ambiguous to deploy.** It contains 5,536 archive entries, including 15 Chrome-profile directories, 2,962 browser-profile files (~162.5 MB extracted), a nested `.deploy-ai-tools-pak` copy, and an embedded `.git` repository. Six runtime/debug HTML captures are also present. A clean release should contain one deploy root only.
2. **The root ZIP has no `CNAME`; only the nested deploy copy does.** A root-folder deployment can lose the GitHub Pages custom-domain mapping, depending on the deployment method.
3. **All six blog Article schemas and OG tags reference `/og-image.png`, but the ZIP contains only `og-image.svg`.** This creates broken article/social/schema images unless the PNG exists independently on the live host.
4. **The product data source does not contain the displayed prices.** All 20 CSV `price_pkr` values are multiplied by `1.2` in `scripts/generate-products.js`. Example: Claude 2,333 becomes 2,800; ChatGPT 1,833 becomes 2,200. The field name hides the markup and makes regeneration/double-markup mistakes likely.
5. **Product content is heavily duplicated.** Seven paragraphs are verbatim across all 20 generated pages; measured vocabulary similarity reaches 98.5%. Pages lack first-hand testing, original screenshots, case studies, named reviewers, and precise plan/limits citations.
6. **Four indexable product-intent pages remain on a legacy/quote-only template:** Canva Pro, CapCut Pro, Grok, and Veo 3. They lack visible numeric prices and Product/Offer schema. Canva and CapCut also lack official-provider citations. Decide whether these are real purchasable products; then align the template/schema or keep them clearly quote-only.

## Medium findings

- Product-page Offer schema omits `shippingDetails` and `hasMerchantReturnPolicy`, although homepage Offers contain them.
- All 20 Product schemas use Google's favicon service as the product `image`; use crawlable first-party product artwork instead.
- All 20 Product nodes lack `sku`, `mpn`, or `gtin`. This is a recommended-property warning, not a validity failure.
- Six blog pages have Article schema but no BreadcrumbList.
- The homepage BreadcrumbList models sibling sections as a hierarchy (`Home > Catalog > Categories > Contact > FAQ`); remove it or use a truthful path.
- Every sitemap URL has the same `lastmod` date. Keep it accurate per URL rather than changing all entries mechanically.
- The IndexNow workflow runs only when `sitemap.xml` changes, so ordinary page edits do not trigger it unless their sitemap metadata changes too.
- Official citations generally point to vendor homepages, not the exact official pricing, plan, or limits documentation.
- About/Article trust signals are weak: no named founder, qualified reviewer, author biography, original evidence, or real customer proof.
- Readability is difficult for a general audience (average Flesch score about 46). Runway and ElevenLabs titles are also longer than the usual SERP-safe range.

## Claims in the supplied audit that need correction

- `site:aitoolspak.tech` showing zero results is a clue, not authoritative proof of zero indexed URLs. Use Search Console's Page Indexing and URL Inspection reports.
- Search Console submission is useful but is not itself a ranking or indexing guarantee. The report states this causal link too confidently.
- “No backlinks anywhere — confirmed” is unsupported without a named backlink data source and coverage limits.
- FAQ rich results were restricted mainly to authoritative government and health sites in 2023; the report's claim that Google retired FAQ rich results in May 2026 is inaccurate. HowTo rich results were deprecated in 2023. Omitting FAQ/HowTo markup here is still reasonable, but the stated history is wrong.
- Passing the repository's checks does not establish “zero technical SEO errors.” Those checks do not test live HTTP status, redirects, headers, crawl behavior, Core Web Vitals, actual asset availability, or Google index state.

## Verified passes

- 39 sitemap URLs map to 39 production pages; no sitemap/canonical omissions or extras.
- 39/39 production JSON-LD blocks parse successfully.
- Titles, descriptions, canonical URLs, one H1, viewport, robots meta, OG/Twitter tags, and internal links pass the package checks.
- No `noindex` or robots rule in the package explains non-indexation.
- All 20 generated products match homepage/page/schema prices; Claude is fixed in this ZIP.
- Critical content and schema are present in initial HTML, not dependent on client rendering.

## Minimum action order

1. Build a clean deploy ZIP containing one site root; exclude `.chrome-*`, `.deploy-ai-tools-pak`, nested `.git`, runtime captures, logs, and local audit artifacts. Put `CNAME` in that deploy root if GitHub Pages requires it.
2. Add the missing `og-image.png` or change every reference to a supported existing image, then test all six blog URLs.
3. Make the CSV price field explicit (`base_price_pkr`) or store the actual selling price directly; add one check asserting source, visible, WhatsApp, and schema prices.
4. Decide and align the four quote-only product pages.
5. Replace duplicated product boilerplate with product-specific evidence and exact official documentation links.
6. Deploy once from the clean root, then verify live Claude/ChatGPT prices, CNAME/domain, robots, sitemap, images, status codes, and redirects.
7. Use Google Search Console for property verification, sitemap submission, URL Inspection, Page Indexing, and manual-action checks. Record GSC evidence before claiming the indexation cause is known.

## Test evidence

```text
seo audit ok: 39 sitemap URLs, metadata/schema/canonicals/product links checked
site links/buttons ok: 39 HTML files checked
catalog render ok: 20 products searchable, prices and durations verified
social services ok: 487 priced services, min/max quantities valid, WhatsApp totals working
```

