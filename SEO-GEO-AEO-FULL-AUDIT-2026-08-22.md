# SEO, GEO and AEO Full Audit — 22 August 2026

## Executive result

The repository-level audit covers all 222 sitemap URLs and 220 local HTML documents. After remediation, there are no P0/P1 findings, no orphan pages, no unreachable sitemap pages, and the maximum homepage click depth is two. The remaining 154 findings are P2 snippet-length opportunities; title and meta-description length are editorial heuristics, not indexing blockers.

Evidence labels used below: **Measured** = directly checked in the repository or live response; **Repo-recorded** = supplied by an existing project record; **Estimated** = judgement from the documented scoring rubric; **N/A** = the required private data or tool was unavailable.

## Technical SEO

Estimated technical score: **90/100**. This is a diagnostic score, not a Search Console or ranking score.

| Area | Result | Evidence |
|---|---|---|
| Crawlability and indexation | Pass | Measured: robots.txt allows general and named AI crawlers; sitemap is declared; 222 canonical sitemap URLs; no missing local sitemap targets. |
| HTTP availability | Pass | Measured: 11 representative live endpoints returned HTTP 200, including homepage, product, comparison, blog, AI Post, Income Lab, robots, sitemap and both LLM text files. |
| Canonicals and duplicate index URLs | Pass after fix | Measured: canonical coverage passes; duplicate `/ai-income-lab/index.html` sitemap entry retired. |
| HTTPS and transport | Pass | Measured live: HTTPS and HSTS `max-age=31556952`. |
| Mobile basics | Pass | Measured: viewport and language checks pass across audited templates. |
| Structured data | Pass after fix | Measured: missing AI Post collection/static schemas added; automated JSON-LD presence checks pass. |
| Social metadata | Pass after fix | Measured: AI Post and Income Lab OG/Twitter gaps repaired. |
| Core Web Vitals | N/A | PageSpeed API returned HTTP 429. LCP, INP and CLS were not guessed; validate in Search Console field data. |
| Server log crawl analysis | N/A | GitHub Pages access logs were not available. |
| Monitoring | Partial | Local production validation exists; Search Console/Bing alert data was not available. |

## Site architecture and internal links

Estimated structure score: **90/100**.

- Measured: 3,224 internal links across 220 HTML pages, average 14.7 links per page.
- Measured: zero orphan pages, zero sitemap pages unreachable from the homepage, maximum click depth two.
- Measured: product, comparison, editorial, price-index and AI-resource hubs are connected from site navigation/footer paths.
- Estimated deduction: average internal-link volume is above the skill's 3–10 hub/spoke target. This is not a defect by itself, but future templates should avoid adding repetitive low-value links.

## On-page SEO

Portfolio status: **no critical structural failures**. Every audited sitemap HTML page has the required title, description, H1, canonical, social metadata and structured-data baseline enforced by the audit.

There are 154 P2 snippet-length opportunities, concentrated in long-form blog/news titles and descriptions plus intentionally short policy/category snippets. Google may rewrite snippets, so these are backlog items rather than release blockers. Prioritize pages with impressions in Search Console instead of mechanically padding or truncating every page.

Implemented fixes include AI Post category H1s, CollectionPage/ItemList schema, static-page WebPage/AboutPage/ContactPage schema, default share images, referrer metadata, and a missing Coursera guide link from the blog hub.

## GEO and AEO

| Capability | Status | Evidence |
|---|---|---|
| Machine-readable discovery | Strong | Measured: `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, robots AI-crawler rules and product data are live. |
| Direct-answer product content | Strong | Measured: product guides expose PKR price, duration, activation, access model, safety checks and FAQs. |
| Entity and relationship markup | Strong | Measured: Product/Offer, FAQ, Article, Breadcrumb, Organization/WebSite and collection markup exist by template. |
| Comparison and decision support | Strong | Measured: eight comparison pages and a Pakistan price-index hub provide answer-oriented decision paths. |
| Citation safety | Improved | Unsupported fixed-percentage productivity and earnings claims in AI Income Lab were removed or reframed as measurable/illustrative ranges. |
| Provenance and freshness | Partial | Dates, author/editorial pages and source links exist, but every volatile news/tool claim still requires periodic source review. |
| External AI citation visibility | N/A | No ChatGPT, Gemini, Perplexity or AI Overview citation export/API was available. |

AEO readiness is strongest on product and comparison templates because the answer, price, conditions and FAQ are visible in page text and reflected in structured data. Continue keeping visible FAQ wording aligned with FAQPage JSON-LD, and never put a price in schema that differs from `products-data.js`/`llms.txt`.

## Content quality and E-E-A-T gate

`score_state: NOT_SCORED`

`score_confidence: not_scored`

`status: NEEDS_INPUT`
`verdict: UNDECIDED`

The installed standalone content-quality runtime does not include its deterministic CORE-EEAT scorer, so an 80-item score was not hand-calculated. The repository does provide useful trust foundations: named contact channels, refund and buyer-safety information, editorial pages, author presentation, product conditions and source links. The most material content risk found was unsupported Income Lab performance/earnings language; the clearest claims were rewritten to require the reader's own measurements and to state that earnings are not guaranteed.

## Domain authority and off-site signals

`CITE score_state: NOT_SCORED`

`score_confidence: not_scored`
`verdict: UNDECIDED`

- Repo-recorded (`SEO/BACKLINK-REPORT.md`, 19 August 2026): 0 acquired and verified backlinks recorded in the outreach tracker; 22 prospects, 11 qualified/ready and 5 unsent drafts.
- N/A: current total referring-domain universe, live backlink quality, anchor distribution and toxic-link assessment. A GSC Links export or Ahrefs/Semrush/Majestic export is required.
- Measured web-search spot check: an exact-brand query did not surface a clear independent brand mention in the returned sample. This is a discovery signal, not a complete backlink census.
- N/A: GA4/GSC/log-based ChatGPT, Perplexity, Gemini and other AI-referral sessions and conversions.

Do not submit a disavow file from this evidence. First obtain a complete backlink export, verify suspicious links manually, and reserve disavowal for a documented manual-action or strong manipulation case.

## Remaining owner actions

1. Submit/confirm the sitemap in Google Search Console and Bing Webmaster Tools, then inspect indexed/not-indexed reasons.
2. Export GSC Performance, Pages and Links data; prioritize the 154 P2 snippet opportunities by impressions and CTR.
3. Export 90 days of GA4 referral sessions and conversions to establish an AI-referral baseline.
4. Run PageSpeed Insights/Search Console CWV when quota is available; record mobile LCP, INP and CLS by template.
5. Execute the already prepared backlink outreach manually and update the tracker only after each placement is verified live.

## Reproduction

Run `node scripts/full-seo-audit.js` for the portfolio report in `SEO-GEO-AEO-AUDIT.json`, and `node scripts/validate.js` for the full production validation pipeline.
