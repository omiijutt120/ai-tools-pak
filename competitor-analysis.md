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
