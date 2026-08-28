# AI Tools Pak — Full SEO Audit

Audit date: 2026-08-28
Target: https://aitoolspak.tech/
Business type: Pakistan-wide online AI subscription catalog and publisher
Post-fix SEO health score: **75/100**

## Executive summary

The site is technically crawlable and already has unusually strong machine-readable coverage for a small catalog: HTTPS works, all sitemap URLs return 200, canonical tags and metadata pass the repository validator, product prices are data-backed, AI crawlers are allowed, and `/llms.txt` is extensive. Fresh Lighthouse mobile lab data scored 91 for Performance and 100 for SEO, with LCP 2.7s, TBT 0ms and CLS 0.000088.

The largest remaining ranking risk is content quality, not crawl failure. Product pages share too much template language, first-hand evidence is limited, many editorial titles are long, and authority/backlink evidence is weak. This audit fixed the highest-confidence structural issues without inventing testimonials, reviews, vendor relationships, prices, performance field data or author credentials.

## Scores

| Category | Score | Evidence |
|---|---:|---|
| Technical SEO | 82 | 223 sitemap URLs; HTTPS/redirect/robots/canonical checks; live crawl |
| Content quality / E-E-A-T | 54 | 234-file content scan; product-template similarity; trust and authorship review |
| On-page SEO | 74 | Titles, descriptions, H1s, internal links and intent alignment |
| Schema | 82 | JSON-LD parse checks plus eligibility and completeness review |
| Performance / CWV | 86 | Lighthouse lab data; no CrUX/GSC field data |
| AI search readiness | 78 | robots, llms resources, server-rendered answer content and identity signals |
| Images | 97 | Width/height and size checks; no oversized-image problem |

Weighted score: **75/100**. Scores combine measured evidence and clearly labelled estimates. No INP result is claimed because real-user field data was unavailable.

## What was fixed

1. Removed `FAQPage` JSON-LD from 133 commercial/editorial pages while preserving the visible FAQ content. Google FAQ rich results are generally restricted to authoritative government and healthcare sites.
2. Added a repeatable cleanup script and validator rule so commercial FAQ schema cannot silently return.
3. Improved Product JSON-LD with SKU, canonical seller entity, return-policy reference and delivery details already present in the catalog model.
4. Aligned AI Post visible bylines with the Person author schema and added H1 headings to category archives.
5. Replaced an unsupported “authorized reseller” statement with neutral, verifiable catalog language.
6. Reconciled visible founder information with the existing author page and public identity links.
7. Added a direct WhatsApp purchase CTA, visible buyer-safety link, price example and a self-contained answer block to the homepage.
8. Simplified the desktop primary navigation from ten links to six intent-focused destinations.
9. Added a dedicated comparison hub with crawlable links and CollectionPage/Breadcrumb schema.
10. Improved comparison Article schema with author, publisher, image, dates, WebPage and BreadcrumbList entities.
11. Expanded the sitemap from 200 to 223 URLs, including the blog hub, price index, comparison hub, AI phone agent, current standalone product pages and omitted editorial content.
12. Preserved the three correct noindex/canonical redirect stubs outside the sitemap.

## Technical findings

### Passed

- HTTP apex and `www` consolidate to the HTTPS apex in one redirect.
- All audited sitemap entries return 200.
- Robots references the sitemap and permits major search and AI crawlers.
- Canonical, metadata, image-alt, JSON-LD parsing, product-link and internal-link checks pass locally.
- Static HTML contains critical SEO content; the site is not dependent on a JavaScript framework for indexable page copy.
- Mobile viewport and responsive breakpoints are present.
- HSTS is live; no mixed HTTP resources were detected.

### Remaining

- GitHub Pages does not provide the desired global CSP, `X-Content-Type-Options`, frame protection, Referrer-Policy and Permissions-Policy response headers. Configure them at Cloudflare or another edge proxy; meta CSP is not an equivalent replacement.
- `/route/index.html` remains accessible alongside `/route/`. Add an edge 301 rule from `*/index.html` to the clean trailing-slash URL.
- Decide whether the separate `ai-income-lab/` microsite belongs in the primary index. It should be added deliberately or noindexed; it should not remain strategically ambiguous.
- Only four last-modified values cover most sitemap URLs. A future generator revision should derive truthful content modification dates from the source records or version history.
- IndexNow submission exists for AI Post publishing but the production key/cron cannot be verified from this workspace. Expand submission to all changed canonical URLs after deployment.

## Performance findings

- Mobile Lighthouse: Performance 91, SEO 100.
- FCP: 2.70s; LCP: 2.70s; Speed Index: 3.86s; TBT: 0ms; CLS: 0.000088.
- LCP is just above the 2.5s “good” threshold. Reduce homepage HTML/CSS cost, preload only the actual LCP font/asset, and defer noncritical scripts.
- PSI returned quota/rate-limit responses and CrUX/GSC credentials are absent. Validate p75 LCP, INP and CLS after deployment; do not infer INP from TBT.

## Content and E-E-A-T findings

- Fifty Product-schema pages contain roughly 576–757 words but have high vocabulary overlap. Average pairwise Jaccard similarity in the specialist sample was 0.773; the closest pairs exceeded 0.97.
- Add product-specific evidence: who the plan is and is not for, tested activation steps, actual limitations, Pakistan payment caveats, dated official-source checks and original screenshots. Do not publish fabricated usage tests.
- Trust fundamentals are good: visible phone/email, refund and delivery policies, official-source links, dates, safety copy, and no fake review/aggregateRating markup.
- Authority remains limited because there are few independently verifiable reviews, first-hand screenshots, redacted fulfillment examples or expert reviewer credentials.
- 98 crawled titles exceeded 60 characters and 32 descriptions exceeded 160 characters in the deterministic audit. These are snippet heuristics, not ranking factors. Rewrite priority commercial pages using GSC query/CTR data before mass-changing editorial headlines.

## Schema findings

- All tested JSON-LD parses successfully after the changes.
- Commercial FAQ markup has been removed; visible FAQs remain useful to users and AI systems.
- Product offers now reuse the richer offer model. Do not add GTINs, ratings, reviews or vendor authorization claims without evidence.
- Product `brand` still derives from the source product title because the dataset lacks a verified vendor/manufacturer field. Add a factual `vendor_brand` column before refining Brand markup.
- Comparison pages now expose Article, WebPage and BreadcrumbList entities.

## Images

- All audited image tags have explicit dimensions and alt attributes.
- Asset sizes are small; the largest sampled file was about 66 KB.
- Product pages mostly reuse logos instead of original product evidence. Add permitted, original screenshots or workflow visuals (800px+ with descriptive alt and responsive sources) when real assets are available.
- Keep the actual above-the-fold image eager with high fetch priority; lazy-load below-fold assets.

## GEO / AI search readiness

- `/llms.txt`, `/llms-full.txt`, `agents.md` and server-rendered product guides are strong foundations.
- Robots explicitly permits GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot and PerplexityBot.
- The homepage now has a concise question heading and self-contained answer covering prices, ordering, safety and lack of claimed vendor partnership.
- Add dated primary-source citations beside changing vendor facts and clearly distinguish official vendor facts from AI Tools Pak catalog claims.
- Publish a visible pricing/update methodology and unique price-history or delivery-time data when evidence is available.

## SXO and architecture

- Homepage intent matches a transactional Pakistan catalog, but prior navigation and hero structure diluted the purchase path. The direct WhatsApp CTA, simplified nav and comparison hub address the main structural gap.
- Continue linking every product to one comparison, two related products and one relevant guide; link every editorial article to a relevant commercial next step.
- Do not create city/location pages. This is a national online catalog, and city-swapped pages would create doorway-page risk.

## Off-site limitations

Backlink status is **insufficient data**. Moz, Bing Webmaster, GSC Links and DataForSEO are not configured. The repository tracker currently has no verified acquired backlink, but that does not prove the domain has zero backlinks. Do not disavow links from the available Tier-0 evidence.

## Tool limitations

- No GSC, GA4, CrUX, PageSpeed API key, Moz or Bing Webmaster credentials.
- No DataForSEO or Firecrawl connector was available.
- PDF generation is unavailable because the Windows WeasyPrint native library is missing.
- Local and Maps SEO are not applicable: the site is a Pakistan-wide online catalog without a physical storefront/GBP target.
- Hreflang is optional for this single-language, single-country site; partial `en-PK` markup is not treated as a ranking defect.
