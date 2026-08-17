# SCOREBOARD 2026-08-15 (live crawl)

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

## What Changed on Enemy Sites (2026-08-11 → 2026-08-15)

- **aitoolspakistan.pro**: ADDED mini llms-full.txt (4.2KB, same content as their llms.txt); prices now detectable (12 PKR mentions, was 0); og:title now bare (title tag empty — Shopify); schema still weak (WebSite+SearchAction+ListItem+BreadcrumbList only). LOW/GEO catch-up.
- **allpremiumtools.com**: Title gained "- APT" suffix; sitemap.xml STILL serves HTML (172KB, text/html, 0 <loc> tags) — fake sitemap remains unresolved; llms.txt still 172KB full-dump. LOW (their bug persists).
- **digitaltools.com.pk**: No material change: 33 wa.me, weak schema (WebSite+SearchAction+WebPage only), llms-full 404, 162 hrefs/64 abs internal. NONE.
- **digiskool.pk**: NEW ENTRY — identified as DIGITAL MARKETING TRAINING INSTITUTE (Lahore), not AI tools reseller. Different business model → low direct threat. 0 wa.me, no llms.txt.
- **aiwala.pk**: No change: still NO llms.txt (404), 0 wa.me CTAs, weak title. NONE.

## Gap Verdict: NO CHANGES REQUIRED

- No schema type exists on competitors that we lack. We alone have Product×31 + FAQPage + ItemList + BreadcrumbList + MerchantReturnPolicy + Offer routing.
- aisp.pro's llms-full addition closed a GEO gap on THEIR side; ours is 318KB vs their 4.2KB — no catch-up needed from us.
- digitaltools still leads raw href count (232 vs 167) — known backlog item (blog↔product cross-links), not a new gap; our DOM-rendered cards add more links post-JS.
- No broken robots/sitemap issue on our side (sitemap 193 URLs, llms-full 200s all verified).
- Nothing copied, no churn. Next watch: check if aisp.pro/aiwala add Product/FAQ schema.