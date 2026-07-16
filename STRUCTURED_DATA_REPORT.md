# Structured Data Report

Generated: 2026-07-16

## Current Google-Aligned Decision

Google's current Product documentation separates Product snippets and Merchant listings, and its structured-data guidance prefers fewer complete, accurate properties over incomplete or inaccurate extras. Google has also removed support for FAQ rich results. For that reason, production HTML now avoids FAQPage and HowTo JSON-LD and prioritizes Product, Offer, MerchantReturnPolicy, OfferShippingDetails, BreadcrumbList, Article/BlogPosting, WebPage, WebSite and Organization.

Official references checked:

- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.google.com/search/updates#removing-faq-rich-result
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Validation Summary

- Sitemap URLs scanned: 38
- Invalid JSON-LD blocks: 0
- FAQPage JSON-LD in production HTML: 0
- HowTo JSON-LD in production HTML: 0
- Documents with Product schema: 20
- Documents with fixed visible PKR Offer schema: 20
- Quote-only legacy product pages use WebPage/Breadcrumb instead of fake fixed Product offers.

## Types By URL

- https://aitoolspak.tech/: Organization, Country, ContactPoint, MerchantReturnPolicy, WebSite, SearchAction, BreadcrumbList, ListItem, ItemList, Product, Brand, Offer, OfferShippingDetails, DefinedRegion, MonetaryAmount, ShippingDeliveryTime, QuantitativeValue
- https://aitoolspak.tech/about-us/: AboutPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/blog/best-ai-tools-freelancers-pakistan/: Article, Organization, ImageObject
- https://aitoolspak.tech/blog/best-ai-video-tools-pakistani-content-creators/: Article, Organization, ImageObject
- https://aitoolspak.tech/blog/chatgpt-plus-price-pakistan/: Article, Organization, ImageObject
- https://aitoolspak.tech/blog/choose-ai-subscription-safely/: Article, Organization, ImageObject
- https://aitoolspak.tech/blog/claude-pro-vs-chatgpt-plus-pakistani-students/: Article, Organization, ImageObject
- https://aitoolspak.tech/blog/free-vs-paid-ai-tools/: Article, Organization, ImageObject
- https://aitoolspak.tech/canva-pro-pakistan/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/capcut-pro-pakistan/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/chatgpt-plus-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/claude-pro-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/contact-us/: ContactPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/delivery-policy/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/elevenlabs-creator-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/frequently-asked-questions/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/gemini-pro-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/google-ai-ultra-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/grammarly-premium-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/grok-subscription-pakistan/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/hailuo-ai-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/heygen-ai-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/ideogram-ai-plus-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/jasper-ai-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/leonardo-ai-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/lovable-ai-pro-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/playht-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/privacy-policy/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/quillbot-premium-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/refund-policy/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/runway-ml-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/social-media-services/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/success-ai-starter-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/supergrok-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/terms-and-conditions/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/veo-3-pakistan/: WebPage, WebSite, BreadcrumbList, ListItem
- https://aitoolspak.tech/vidiq-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization
- https://aitoolspak.tech/wordai-pakistan/: BreadcrumbList, ListItem, Product, Brand, Offer, Organization

## Merchant/Product Integrity

No fake reviews, aggregate ratings, review snippets, ratingValue, aggregateRating, or invented review counts are emitted. Offer price and currency values are taken from the visible catalog data where a fixed price exists. Quote-only pages do not invent prices.
