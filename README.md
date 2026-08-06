# AI Tools Pak

> Pakistan's AI tools store — 30+ AI subscriptions with transparent PKR pricing, instant WhatsApp ordering, plus AI phone agents, WhatsApp bots and n8n automations for local businesses.

**Live site:** https://aitoolspak.tech

- 🛒 **AI tools store** — ChatGPT Plus, Claude Pro, Canva Pro, ElevenLabs, HeyGen, Grammarly, Semrush and 25+ more, priced in PKR, delivered via WhatsApp.
- 🤖 **AI Automation Services** — AI phone agents (Urdu + English, 24/7), WhatsApp auto-reply bots, appointment booking, lead follow-up sequences and n8n automations for real estate, clinics, schools and e-commerce. See https://aitoolspak.tech/ai-automation-services/
- 💬 **Ordering** — DM us on WhatsApp: https://wa.me/923714549245
- 🔍 **SEO-ready** — full sitemap, llms.txt, structured data, hreflang (en-PK).

## Tech

Static GitHub Pages site (HTML/CSS/JS, no build step). Catalog data in `data/`, generated with scripts in `scripts/`.

## Generate Catalog Data

```bash
node scripts/generate-products.js
node scripts/generate-social-services.js
```

## Checks

```bash
node scripts/check-catalog.js
node scripts/check-social-services.js
node scripts/check-site-links.js
node scripts/seo-audit.js
node --check script.js
node --check social-media-services/social-services.js
```

The social media catalog is generated from `data/social-media-services-source.csv`. If the source file has no rate, minimum or maximum quantity columns, the public page must show `Confirm price on WhatsApp` instead of inventing prices.

## Deployment

Push to `main` → GitHub Pages auto-deploys to https://aitoolspak.tech.
