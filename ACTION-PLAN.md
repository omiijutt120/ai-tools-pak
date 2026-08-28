# AI Tools Pak — SEO Action Plan

## Completed in this audit

- Removed ineligible commercial FAQ structured data and added regression protection.
- Enriched Product and comparison structured data without inventing ratings or vendor facts.
- Fixed AI Post byline/schema consistency and archive H1s.
- Removed an unsupported reseller-authorization claim.
- Improved homepage transactional CTA, safety proof, navigation and GEO answer block.
- Added a comparison hub.
- Expanded sitemap coverage from 200 to 223 URLs.
- Re-ran catalog, social-service, link, schema, canonical, product and syntax checks.

## Critical — requires owner evidence or deployment access

1. **Differentiate product pages.** Add verified product-specific activation tests, limitations, screenshots, ideal/not-ideal audiences and official-source comparisons to `data/products.csv` and `data/product-intros.json`. Start with the highest-similarity pairs: NordVPN/Surfshark, Adobe 1-year/2-month, Canva EDU/Leonardo Essential and Replit variants.
2. **Configure edge security headers.** At Cloudflare, test then deploy CSP with `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`; add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive Permissions-Policy.
3. **Add clean URL redirects.** Configure a 301 edge rule from `*/index.html` to the equivalent trailing-slash URL. Do not attempt this with client-side redirects.

## High — next 7 days

1. Connect Google Search Console and GA4; submit the 223-URL sitemap and inspect homepage, blog hub, price index and top product URLs.
2. Verify CrUX p75 LCP/INP/CLS. Optimize the actual LCP resource if field LCP is above 2.5s.
3. Decide whether `ai-income-lab/` is part of the main brand. Either integrate and sitemap it or add intentional noindex/canonical handling.
4. Add a verified `vendor_brand` field to the product dataset and use it in Product schema.
5. Add original, permitted product screenshots and a visible test/update methodology.
6. Link the price index prominently from relevant articles and use it as the primary outreach asset.

## Medium — next 30 days

1. Use GSC queries and CTR to shorten priority titles/descriptions; do not mass-truncate headlines.
2. Create article-to-product and product-to-comparison link matrices, then add contextual links in source generators.
3. Add truthful per-page last-modified data to the sitemap generator.
4. Add Bing Webmaster and Moz API access; import GSC Links before scoring backlink health.
5. Reduce mobile hero height, ensure 44px touch targets, and test the floating WhatsApp safe-area spacing on 320–380px screens.
6. Establish drift baselines for homepage, price index, blog hub, refund policy and top five product pages after deployment.

## Low / ongoing

1. Review evergreen content annually and product pages whenever plan details change.
2. Build Pakistan-relevant editorial links from tech publications, universities, freelancer communities and creator/e-commerce resources using branded or natural anchors.
3. Add unique price-history and fulfillment-time data only when records can be substantiated.
4. Keep visible FAQs, but do not restore FAQPage markup for Google rich-result purposes.

## Success metrics

- 100% of intended indexable pages submitted and canonical in GSC.
- No soft 404, duplicate canonical, schema parse or internal-link validation failures.
- Field CWV passing at p75: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- Product-template similarity decreases as unique evidence is added.
- Growth in non-brand impressions, product-guide CTR, WhatsApp clicks and verified referring domains.
