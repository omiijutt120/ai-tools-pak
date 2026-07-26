# AI Tools Pak

Static GitHub Pages website for `https://aitoolspak.tech/`.

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
