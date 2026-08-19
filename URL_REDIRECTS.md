# Canonical URL redirects

GitHub Pages does not provide repository-level server-side 301 redirects. The
product generator therefore writes minimal `noindex,follow` HTML redirect pages
for retired product URLs. These paths are deliberately excluded from the XML
sitemap; the destination is the only canonical, indexable product URL.

| Retired path | Canonical destination | Reason |
| --- | --- | --- |
| `/veo-3-pakistan/` | `/veo-3-extension-pakistan/` | Legacy generic Veo guide consolidated into the active extension plan. |
| `/grok-subscription-pakistan/` | `/supergrok-pakistan/` | Legacy Grok guide consolidated into the active SuperGrok listing. |
| `/veo-3-ultra-extension-pakistan/` | `/veo-3-extension-pakistan/` | Duplicate Veo extension naming consolidated into one plan. |
| `/elevenlabs-130k-credits-pakistan/` | `/elevenlabs-creator-pakistan/` | Duplicate ElevenLabs plan consolidated into the canonical Creator listing. |
| `/lovable-pro-1-month-pakistan/` | `/lovable-ai-pro-pakistan/` | Duplicate Lovable monthly plan consolidated into one canonical listing. |

The authoritative map is `RETIRED_PRODUCT_REDIRECTS` in
`scripts/generate-products.js`. Update that map and this document together;
then run `node scripts/generate-products.js` and the validation suite.
