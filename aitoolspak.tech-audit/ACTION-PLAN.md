# SEO Action Plan: aitoolspak.tech

## Phase 1: Critical Fixes (Week 1)

### 1. Sync local files with live site
- **File:** `index.html` lines 6-7, line 100-102
- **Live:** Title = "Cheap AI Tools Pakistan | AI Tools Sale & PKR Prices"
- **Local:** Title = "AI Tools Pak | AI Tools Subscriptions in Pakistan"
- **Fix:** Update local `index.html` to match live content (or vice versa)

### 2. Fix alt text on product card images
- **File:** `script.js` (product card rendering function)
- **Issue:** `<img>` tags rendered via JS lack `alt` attribute
- **Fix:** Add `alt={product.imageAltText}` to JS template

### 3. Update sitemap
- **File:** `sitemap.xml`
- **Missing:** `/canva-pro-pakistan/`, products 23-31, blog index `/blog/`
- **Fix:** Add all missing URLs

### 4. Sync product count
- **File:** `index.html` line 109: `data-product-count` shows 31
- **Live shows:** 20
- **Fix:** Match to actual inventory

### 5. Add FAQPage schema
- **File:** `index.html` — after footer
- **Fix:** Add JSON-LD with `@type: FAQPage`, `mainEntity` array

## Phase 2: High-Impact (Weeks 2-3)

- Add author names to product pages
- Convert PNG icons to WebP
- Add `loading="lazy"` to product card images
- Expand product page content (unique descriptions)
- Add hreflang to all subpages

## Phase 3: Content & Authority (Month 2)

- Longer blog posts (1000+ words)
- FAQPage schema
- BlogPosting schema
- Related-product cross-links
- Real testimonials/reviews

## Phase 4: Ongoing

- Monitor Core Web Vitals
- Track keyword rankings
- Build Pakistan-focused backlinks
- Regular sitemap updates
- Add `llms-full.txt`
