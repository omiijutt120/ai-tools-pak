# UPDATE 2026-08-15 (competitor watch crawl)

## What Changed on Enemy Sites (2026-08-11 → 2026-08-15)

- **aitoolspakistan.pro**: ADDED mini llms-full.txt (4.2KB, same content as their llms.txt); prices now detectable (12 PKR mentions, was 0); og:title now bare (title tag empty — Shopify); schema still weak (WebSite+SearchAction+ListItem+BreadcrumbList only). LOW/GEO catch-up.
- **allpremiumtools.com**: Title gained "- APT" suffix; sitemap.xml STILL serves HTML (172KB, text/html, 0 <loc> tags) — fake sitemap remains unresolved; llms.txt still 172KB full-dump. LOW (their bug persists).
- **digitaltools.com.pk**: No material change: 33 wa.me, weak schema (WebSite+SearchAction+WebPage only), llms-full 404, 162 hrefs/64 abs internal. NONE.
- **digiskool.pk**: NEW ENTRY — identified as DIGITAL MARKETING TRAINING INSTITUTE (Lahore), not AI tools reseller. Different business model → low direct threat. 0 wa.me, no llms.txt.
- **aiwala.pk**: No change: still NO llms.txt (404), 0 wa.me CTAs, weak title. NONE.

## Scoreboard 2026-08-15 (live crawl)

|| metric | us (aitoolspak.tech) | aisp.pro | apt | dtt.pk | digiskool | aiwala |
|---|---|---|---|---|---|---|
|| Product schema | 31 ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
|| FAQPage schema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
|| Person schema | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
|| Org/Article schema | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
|| llms.txt | ✅ 16.4KB | ✅ 4.2KB | ✅ 172KB | ✅ 6.6KB | ❌ | ❌ |
|| llms-full.txt | ✅ 318KB | ✅ 4.2KB | ✅ 172KB | ❌ 404 | ❌ | ❌ |
|| sitemap URLs | 193 ✅ | 4 | ~10 | ~15 | ~10 | ~10 |
|| wa.me CTAs | 37 ✅ | 2 | 10 | 33 | 0 | 0 |
|| prices visible | ✅ 253 hits | 9 | ❌ 0 | ✅ 13 | 18 (course fees) | 1 |
|| internal links (href) | 167 (69 unique) | 44 | 87 | 232 | 196 | 94 |

## Evidence (crawl 2026-08-15, HTTP 200 all six homepages)

- curl -A browser, --max-time 20; schema via ld+json @type counts; wa.me via grep -c; llms/sitemap via HTTP status + content check (apt sitemap confirmed text/html, 0 loc tags).
- aisp.pro added mini llms-full (4.2KB); digiskool identified as training institute (not tools reseller); apt sitemap still HTML; aiwala still no llms.txt.
- sitemap 193 URLs, llms-full 318KB verified all 200.
## UPDATE 2026-08-17 (SEO Indexing Fix)

- Fixed P0 indexing issue: ai-income-lab section (9 pages + hub) missing from sitemap.xml and llms.txt
- Added ai-income-lab paths to STATIC_SITEMAP_PATHS in generate-products.js
- Added AI Income Lab section to generate-llms-txt.js with proper formatting
- Verified fix: sitemap.xml now contains 10 ai-income-lab URLs (was 0)
- Verified fix: llms.txt now contains AI Income Lab section with 9 links
- All other audit scripts (site-links, catalog, social-services) continue to pass
- seo-audit.js now reports pre-existing SEO issues on ai-income-lab pages (expected - pages now indexable)

## Files Changed
- scripts/generate-products.js
- scripts/generate-llms-txt.js

## Result
- ai-income-lab pages are now discoverable by search engines via sitemap
- llms.txt now includes AI Income Lab section for AI crawlers

## Next Action
- Monitor indexing status in Google/Bing (when accessible)
- Consider separate optimization task for ai-income-lab SEO quality (OG tags, JSON-LD, etc.)


---
UPDATE 2026-08-18 (autonomous SEO operator)

## Website Health
- Homepage: 200 OK
- sitemap.xml: 200 OK (191 URLs including ai-income-lab)
- robots.txt: 200 OK
- llms.txt: 200 OK (184 lines, AI Income Lab section present)
- llms-full.txt: 200 OK (5543 lines, 318KB)
- All product/service pages: 200 OK

## Indexing Status
- ai-income-lab: 10 URLs in sitemap.xml (was 0 before 2026-08-17 fix)
- AI Income Lab section present in llms.txt (9 links)
- All ai-income-lab pages now indexable (P0 indexing fix from 2026-08-17 implemented)

## Search Performance
- DDG ranks: chatgpt_plus rank 2 (blog), rank 7 (product) - monitor
- claude_pro rank 8 - stable
- gemini_pro unverifiable (DDG captcha throttling)
- Social service prices tracked but throttled

## Top Opportunities
1. **ai-income-lab SEO quality** - Pages are now indexable but have missing og:description, og:image, twitter:card on individual pages; no JSON-LD on contact.html and privacy-policy.html (addressed in this run)
2. **social-services-data.js 358KB > 100KB** - Persistent performance flag; consider optimization
3. **GSC verification** - Not available on machine (owner action required)

## Changes Made
- `ai-income-lab/contact.html`: Added Open Graph meta tags (og:title, og:description, og:type, og:url, og:image, twitter:card) and JSON-LD FAQPage schema
- `ai-income-lab/privacy-policy.html`: Added Open Graph meta tags (og:title, og:description, og:type, og:url, og:image, twitter:card) and JSON-LD WebPage schema
- Git commit: "SEO: add Open Graph schema and JSON-LD to ai-income-lab contact & privacy pages"
- Git push: origin main + origin main:master
- IndexNow submission: /ai-income-lab/contact.html and /ai-income-lab/privacy-policy.html

## Changes Not Made
- Did not reorganize sitemap.xml (pre-existing change from generate-products.js, not my intentional change)
- Did not modify llms.txt (pre-existing change from generate-llms-txt.js, not my intentional change)
- Did not touch payment/checkout/auth pages (per safety rules)
- Did not change models/providers/config (owner-managed, free models only)
- Did not make any competitor-copying changes or churn pages to mirror competitor structure (per master prompt §19, §25 — evidence does not justify random daily changes)

## Git
- Branch: main (ahead of origin/main by 1 commit)
- Commit: d0a53db SEO: add Open Graph schema and JSON-LD to ai-income-lab contact & privacy pages
- Push: origin main + origin main:master verified via deployments API (200)

## Risks
- Low risk: changes are additive (adding meta tags and schema, not modifying existing content structure)
- Rollback possible by reverting commit d0a53db
- No payment/checkout/auth changes

## Monitoring
- Metric to improve: ai-income-lab page CTR in search results and social shares
- When: Check after next Google crawl (typically 3-7 days)
- Also monitor: IndexNow submission confirmation, DDG rank stability, social-services-data.js size
