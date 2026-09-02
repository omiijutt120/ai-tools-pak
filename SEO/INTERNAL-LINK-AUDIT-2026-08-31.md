# Internal Link Audit — 2026-08-31

## Baseline from fresh live crawl

- 226 discovered URLs; 223 HTML pages; average 15.05 distinct internal targets per HTML page.
- 14 zero-inbound URLs: Adobe Creative 1 year, Adobe Creative 2 months, `agents.md`, one AI Post news article, Coursera price guide, Gemini API guide, ChatGPT Apple account, comparison hub, `/index.html`, Manus AI, n8n, Replit 1 year, Windows 11 and YouTube Premium.
- Footer/policy destinations receive roughly 179–189 source-page links each, while Runway Max and Storyblocks had 3, and several commercial pages had only 4–7.
- Repetitive anchors included “Read a relevant AI tools guide” (49), “Details” (32), “View full details & buy” (32) and “More AI news and guides” (29). Baseline anchor-quality score: 6/10.

`/index.html` is an alternate homepage URL and should be handled by an edge 301 rather than given more links. `agents.md` is machine-readable and does not need human navigation.

## Implemented locally

1. Main navigation now links **Compare AI plans** to `/comparisons/`, removing the hub orphan.
2. Homepage “More subscription and payment guides” exposes eight standalone commercial guides plus the Coursera price and Gemini API supporting articles.
3. Comparison breadcrumbs now link their parent label back to `/comparisons/`.
4. The product generator replaces the generic guide anchor with descriptive, product-aware anchors.
5. Exact mappings now connect Coursera, ElevenLabs/PlayHT, SEMrush, vidIQ, both Helium 10 plans, Runway Max, Storyblocks and Google AI Ultra to their most relevant guide/comparison.
6. Regeneration applies the link policy consistently across all 32 CSV-driven product pages.

## Recommended next links

| Source | Target | Suggested anchor |
|---|---|---|
| Enterprise API Credits | Gemini API Credits | Gemini API credits in Pakistan |
| Gemini API Credits | Enterprise API Credits | enterprise AI API credit packages |
| Teacher guide | Coursera and Canva product pages | Coursera Premium / Canva Pro for teachers |
| Social media guide | CapCut, Canva and social services | video and design tools for social teams |
| ChatGPT price article | ChatGPT product page | current ChatGPT Plus listing in PKR |
| Gemini price article | Gemini product page | current Gemini Pro listing in PKR |

## Cannibalization routing

- Homepage owns the broad transactional intent “AI tools in Pakistan”.
- `/blog/ai-tools-pakistan-complete-guide/` owns the comprehensive informational intent.
- `/blog/find-cheap-ai-subscriptions-pakistan/` owns budget discovery.
- `/blog/where-to-buy-ai-tools-pakistan/` owns vendor-selection and buyer-safety intent.
- Each `*-pakistan/` product page owns purchase intent; matching price articles explain pricing and should link to the product rather than duplicate its CTA-focused copy.

## Remaining risks

- Global footer equity is policy-heavy; do not remove legally important links, but add contextual product/category links in body copy instead of expanding the footer.
- The AI Post orphan article still needs an editorially relevant article/category link.
- Workflow category hubs do not yet exist, so product discovery still depends heavily on the homepage.
- Local changes are **not live-verified** until deployment and a fresh crawl.
