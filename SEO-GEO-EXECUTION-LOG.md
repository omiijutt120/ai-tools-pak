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
