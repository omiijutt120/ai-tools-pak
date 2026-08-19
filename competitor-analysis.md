# SCOREBOARD 2026-08-19 (live crawl)

||| metric | us (aitoolspak.tech) | aisp.pro | apt | dtt.pk | digiskool | aiwala |
|||---|---|---|---|---|---|---|
||| Product schema | 31 ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
||| FAQPage schema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
||| Person schema | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
||| Org/Article schema | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
||| llms.txt | ✅ 17.8KB | ✅ 4.2KB | ❌ 301 | ✅ 6.7KB | ❌ 404 | ❌ 404 |
||| llms-full.txt | ✅ 318KB | ✅ 4.2KB (new) | ❌ 301 | ❌ 404 | ❌ 404 | ❌ 404 |
||| sitemap URLs | 203 ✅ | 4 | ~0 (301 fake) | ~0 (301 fake) | ~0 (301 fake) | ~0 (301 fake) |
||| wa.me CTAs | 37 ✅ | 2 | 10 | 36 | 0 | 0 |
||| prices visible | ✅ 131 hits | 1 | ❌ 0 | ✅ 7 | 18 (course fees) | 1 |
||| internal links (href) | 167 (69 unique) | 44 | 86 | 247 | 193 | 94 |

## What Changed on Enemy Sites (2026-08-15 → 2026-08-19)

- **aitoolspakistan.pro**: Added mini llms-full.txt (4.2KB, same content as llms.txt); prices now detectable (12 PKR mentions, was 0); og:title now bare (title tag empty — Shopify); schema still weak (WebSite+SearchAction+ListItem+BreadcrumbList only). LOW/GEO catch-up.
- **allpremiumtools.com**: Title gained "- APT" suffix; sitemap.xml STILL serves HTML (172KB, text/html, 0 <loc> tags) — fake sitemap remains unresolved; llms.txt still 172KB full-dump. LOW (their bug persists).
- **digitaltools.com.pk**: wa.me CTAs increased 33→36; internal links increased 232→247; no other material changes. Schema still weak (WebSite+SearchAction+WebPage only); llms-full 404.
- **digiskool.pk**: Confirmed as digital marketing training institute (Lahore), not AI tools reseller. Different business model → low direct threat. 0 wa.me, no llms.txt. No competitive threat.
- **aiwala.pk**: No change: still NO llms.txt (404), 0 wa.me CTAs, weak title. NONE.

## Gap Verdict: NO CHANGES REQUIRED

- No schema type exists on competitors that we lack. We alone have Product×31 + FAQPage + ItemList + BreadcrumbList + MerchantReturnPolicy + Offer routing.
- aisp.pro's llms-full addition (4.2KB) closed a GEO gap on their side; ours is 318KB — no catch-up needed from us.
- digitaltools leads raw href count (247 vs 167) — known backlog item (blog↔product cross-links), not a new gap; our DOM-rendered cards add more links post-JS.
- No broken robots/sitemap issue on our side (sitemap 203 URLs, llms-full 200s all verified).
- Nothing copied, no churn. Next watch: monitor if aisp.pro/aiwala add Product/FAQ schema; track dtt internal-link structure for potential cross-linking (not copying).