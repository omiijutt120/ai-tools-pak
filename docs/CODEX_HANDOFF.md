# Codex Handoff — AI Tools Pak SEO/GEO/AEO MVP

## Goal

Deploy this folder as the production root for `https://aitoolspak.tech/` without removing the SEO/GEO/AEO work.

## Already implemented

- Keyword-focused homepage metadata and hero copy.
- Keyword-focused social media services metadata and copy.
- New `/blog/` hub.
- Three new commercial-intent guides.
- Article and FAQPage JSON-LD on blog content.
- FAQPage JSON-LD matching visible questions on the homepage and SMM page.
- Site-wide Blog navigation fixed to `/blog/`.
- Sitemap and `llms.txt` updated.
- Master strategy and deployment checklist included.

## Required Codex actions

1. Treat this directory as the source of truth.
2. Preserve all canonical URLs, metadata, visible FAQs and JSON-LD.
3. Do not add fake reviews, fake ratings, unsupported official-partner claims, fake countdowns or invented prices.
4. Keep all internal links working from the custom-domain root.
5. Run:

```bash
node scripts/check-catalog.js
node scripts/check-social-services.js
node scripts/check-site-links.js
node scripts/seo-audit.js
node --check script.js
node --check social-media-services/social-services.js
```

6. Fix any validation failure before deployment.
7. Deploy the files to the GitHub Pages repository root and confirm the custom domain remains configured.
8. Do not commit `.git`, browser debug folders, runtime DOM captures or old ZIP files.

## Priority public URLs to verify

- `/`
- `/blog/`
- `/blog/cheap-ai-tools-pakistan/`
- `/blog/ai-tools-sale-pakistan/`
- `/blog/cheap-smm-services-pakistan/`
- `/social-media-services/`
- `/sitemap.xml`
- `/llms.txt`
