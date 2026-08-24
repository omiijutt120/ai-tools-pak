# Competitor Analysis — 4 Enemies (2026-08-07)
## vs https://aitoolspak.tech

## 1. aitoolspakistan.pro (exact-match domain threat!)
- Title: "ai tools pakistan – AI tools Pakistan" (exact-match keyword in title + domain)
- Schema: BreadcrumbList, WebSite, SearchAction — WEAK (no Product/FAQ/Person)
- FAQ: 0 | Prices: NONE visible | wa.me: 2 | links: 35
- GEO: llms.txt ✅ 4.2KB, robots ✅ 3.6KB, sitemap ✅ 764B
- THREAT: exact-match domain "ai tools pakistan" — authority + backlinks + time needed to beat
- OUR EDGE: way better schema, prices visible, 145-URL sitemap, llms-full 267KB

## 2. allpremiumtools.com
- Title: "All Premium Tools Upto 90% OFF | Claim Your Offer Now" (offer hook)
- Schema: ImageObject×3, Organization, WebSite, SearchAction, WebPage, Person, Article — GOOD
- FAQ: 0 | Prices: NONE | wa.me: 10 | links: 114
- GEO: llms.txt ✅ (172KB = full site dump!), robots ✅, sitemap ❌ (172KB = serves HTML, not XML!)
- LEARNED: "Upto 90% OFF" hook + Person schema + 10 CTAs
- STATUS: we now have Person schema too + 35 wa.me CTAs + 77→110+ links

## 3. digitaltools.com.pk (STRONGEST internal linking + CTAs)
- Title: "All-in-One Digital Tools Marketplace in Pakistan"
- Schema: ImageObject×2, WebSite, SearchAction, WebPage — WEAK
- FAQ: 0 | Prices: YES (PKR 399 etc) | wa.me: **33** | links: **278** (highest!)
- GEO: llms.txt ✅ 6.6KB, robots ✅, sitemap ✅ 939B
- LEARNED: massive WhatsApp CTA density + internal linking
- STATUS: we added 32 card buy buttons + request-bar CTA; our links 77→~110 (still lower — future: add more internal cross-links)

## 4. aiwala.pk
- Title: "Home - AI Wala" (WEAK title)
- Schema: ImageObject×3, Organization, WebSite, SearchAction, WebPage, Person, Article — GOOD
- FAQ: 0 | Prices: NONE | wa.me: **0** (!) | links: 95
- GEO: llms.txt ❌ MISSING (fails GEO!), robots ✅ 2.2KB, sitemap ✅ 880B
- LEARNED: WhatsApp Automation positioning, Person schema
- STATUS: we beat them on GEO (they have NO llms.txt), CTAs (they have 0 wa.me!)

## Scoreboard (2026-08-07 after our fixes)
| metric | us | aisp.pro | apt | dtt.pk | aiwala |
|---|---|---|---|---|---|
| Product schema | 31 ✅ | 0 | 0 | 0 | 0 |
| FAQ schema | ✅ | ❌ | ❌ | ❌ | ❌ |
| Person schema | ✅ (new) | ❌ | ✅ | ❌ | ✅ |
| llms.txt | ✅ 12.5KB | ✅ | ✅ | ✅ | ❌ |
| llms-full | ✅ 267KB | ❌ | ✅ | ❌ | ❌ |
| sitemap URLs | 145 ✅ | ~10 | ~10 | ~15 | ~10 |
| wa.me CTAs | ~35 ✅ | 2 | 10 | 33 | 0 |
| prices visible | ✅ | ❌ | ❌ | ✅ | ❌ |
| internal links | ~110 | 35 | 114 | 278 | 95 |

## Our remaining gaps (future work)
1. internal links: digitaltools has 278, we have ~110 — add more blog↔product cross-links
2. Title hook: allpremium's "Upto 90% OFF" style — we have OFF badges already
3. exact-match domain: aitoolspakistan.pro owns "ai tools pakistan" — need authority/backlinks/time
4. Monitor: daily cron 5c73fb34fc89 does this automatically at 06:00

---

# UPDATE 2026-08-11 (competitor watch cron crawl)

## What changed on enemy sites (vs 2026-08-07 baseline)
| site | change | severity |
|---|---|---|
| aitoolspakistan.pro | ADDED llms-full.txt (200, text/markdown, 4.2KB — same content as their llms.txt, mini not full dump); prices now detectable (9 PKR mentions, was 0); og:title now bare "ai tools pakistan" (title tag itself empty — Shopify). Schema still weak: WebSite+SearchAction+ListItem+BreadcrumbList only | LOW/GEO catch-up |
| allpremiumtools.com | Title gained "- APT" suffix; sitemap.xml STILL serves HTML (172KB, text/html, 0 `<loc>`) — fake sitemap unresolved; llms.txt still 172KB full-dump | LOW (their bug persists) |
| digitaltools.com.pk | No material change: 33 wa.me, weak schema (WebSite+SearchAction+WebPage only), llms-full 404, 232 hrefs/60 abs internal | NONE |
| aiwala.pk | No change: still NO llms.txt (404), 0 wa.me CTAs, weak title | NONE |
| digiskool.pk | NEW ENTRY — not previously analyzed! It is a DIGITAL MARKETING TRAINING INSTITUTE (Lahore), not an AI-tools reseller: "Digital Marketing Institute in Lahore | DigiSkool", 36×"Digital Marketing"/26×"courses" vs 11×ChatGPT. Template schema (Org/Person/Article), 0 wa.me, no llms.txt. Different business model → low direct threat to a tools store | INFO (scope clarification) |

## Scoreboard 2026-08-11 (live crawl)
| metric | us | aisp.pro | apt | dtt.pk | digiskool | aiwala |
|---|---|---|---|---|---|---|
| Product schema | 31 ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| FAQPage schema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Person schema | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Org/Article schema | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| llms.txt | ✅ 16.4KB | ✅ 4.2KB | ✅ 172KB | ✅ 6.6KB | ❌ | ❌ |
| llms-full.txt | ✅ 318KB | ✅ 4.2KB (new) | ✅ 172KB | ❌ 404 | ❌ | ❌ |
| sitemap URLs | 191 ✅ | ~10 | ❌ (HTML!) | ~15 | ~10 | ~10 |
| wa.me CTAs | 37 ✅ | 2 | 10 | 33 | 0 | 0 |
| prices visible | ✅ 253 hits | 9 | ❌ 0 | ✅ 13 | 18 (course fees) | 1 |
| internal links (href) | 167 (69 unique product/blog URLs) | 44 | 87 | 232 | 196 | 94 |

## Gap verdict: NO CHANGES REQUIRED
- No schema type exists on competitors that we lack. We alone have Product×31 + FAQPage + ItemList + BreaadcrumbList + MerchantReturnPolicy + Offer routing.
- aisp.pro's llms-full addition closed a GEO gap on THEIR side; ours is 318KB vs their 4.2KB — no catch-up needed from us.
- digitaltools still leads raw href count (232 vs 167) — known backlog item (blog↔product cross-links), not a new gap; our DOM-rendered cards add more links post-JS.
- No broken robots/sitemap issue on our side (sitemap 191 URLs, llms 200s all verified).
- Nothing copied, no churn. Next watch: check if aisp.pro/aiwala add Product/FAQ schema.

## Evidence (crawl 2026-08-11, HTTP 200 all six homepages)
- curl -A browser, --max-time 20; schema via ld+json @type counts; wa.me via grep -c; llms/sitemap via HTTP status + content check (apt sitemap confirmed text/html, 0 loc tags).
