Daily SEO/GEO/AEO research and site-health audit for https://aitoolspak.tech/ (repo: /home/ubuntu/ai-tools-pak, GitHub: omiijutt120/ai-tools-pak, deployed via GitHub Pages from main). You are running on an Oracle Cloud Ubuntu VM; the system timezone is Asia/Karachi. Your tools are terminal and file.

ENVIRONMENT (Linux): use `python3` (or `python`), plain `curl`, `node`, `git`. For file searches inside the repo use `grep -r` (no search_files tool here). Do not use the clarify tool — this job runs unattended. This machine has Hermes installed at ~/.hermes (that is you). The repo clone lives at /home/ubuntu/ai-tools-pak (branch main); the trend history file is /home/ubuntu/seo_daily_history.json; the reports repo is /home/ubuntu/aitoolspak-seo-reports (a git repo that already has a README; commit reports into its root).

STEP 1 — Pull latest: run `git -C /home/ubuntu/ai-tools-pak pull --ff-only` (if the clone is missing, `git clone https://github.com/omiijutt120/ai-tools-pak.git /home/ubuntu/ai-tools-pak`).

STEP 2 — Live health check: curl these URLs and report any that are NOT 200: https://aitoolspak.tech/ , /blog/ , /sitemap.xml , /robots.txt , /llms.txt , /semrush-pro-pakistan/ , /chatgpt-plus-pakistan/ , /social-media-services/ . Also fetch the homepage title: `curl -s https://aitoolspak.tech/ | grep -o '<title>[^<]*</title>' | head -1` and flag if it contains "Site not found" (Pages domain issue). Record response times with `curl -s -o /dev/null -w "%{http_code} %{time_total}s"`.

STEP 3 — Repo audits (run from /home/ubuntu/ai-tools-pak): `node scripts/seo-audit.js`, `node scripts/check-site-links.js`, `node scripts/check-catalog.js`, `node scripts/check-social-services.js`, `node scripts/generate-llms-txt.js` (this one rewrites llms.txt; if it changes, commit and push it: `git add llms.txt && git commit -m "Regenerate llms.txt" && git push`). Any non-zero exit is a REGRESSION — report it verbatim. If `scripts/generate-products.js` would report "Expected N products" mismatches or data/products.csv is out of sync with products-data.js (compare product counts and selling prices), report the drift — do NOT regenerate pages automatically.

STEP 4 — SERP landscape (DuckDuckGo HTML endpoint, no API key; if DDG throttles, wait 20s between queries and note which queries were throttled — datacenter IPs throttle faster than home IPs). For each query, list the top 8 result domains+titles: "chatgpt plus price in pakistan", "claude pro price in pakistan", "canva pro price in pakistan", "ai tools pakistan", "social media services price in pakistan", "instagram followers price in pakistan". Note whether aitoolspak.tech appears (position) and which competitor domains dominate. Use: `python3 /home/ubuntu/ai-tools-pak/scripts/seo_research.py ddg "QUERY"`. If that script is missing or errors, recreate the DDG fetch inline with urllib: fetch https://html.duckduckgo.com/html/?q=QUERY with a Chrome UA and regex out class="result__a" href/title pairs.

STEP 5 — Indexation check: `python3 /home/ubuntu/ai-tools-pak/scripts/seo_research.py ddg "site:aitoolspak.tech"` and count indexed URLs; compare against yesterday's count from /home/ubuntu/seo_daily_history.json (read it; if missing, create it with today's data; ALWAYS update it with today's numbers: health, audits, SERP ranks, indexation count, asset sizes, notes). Keep the JSON file valid and compact.

STEP 6 — Performance: attempt `python3 /home/ubuntu/ai-tools-pak/scripts/seo_research.py psi "https://aitoolspak.tech/"` (PageSpeed Insights API — expect HTTP 429 from this datacenter IP; if 429, note "PSI rate-limited, skipping" and instead record TTFB + homepage asset sizes via curl HEAD requests (styles.css, script.js, products-data.js, logo.png, social-services-data.js, social-media-services/social-services.js) — flag anything > 100KB or TTFB > 500ms.

STEP 7 — GEO/AEO freshness: fetch https://aitoolspak.tech/llms.txt and confirm the "Current PKR Prices" section exists with ~31 products; fetch https://aitoolspak.tech/semrush-pro-pakistan/ and verify it has application/ld+json containing FAQPage and an Offer with priceCurrency PKR; fetch https://aitoolspak.tech/social-media-services/ and verify it has FAQPage + ItemList schema and the 6 platform price cards.

STEP 8 — Publish: write the full markdown report to /home/ubuntu/aitoolspak-seo-reports/$(date +%F).md (e.g. 2026-08-03.md), then `git -C /home/ubuntu/aitoolspak-seo-reports add -A && git -C /home/ubuntu/aitoolspak-seo-reports commit -m "Daily SEO research $(date +%F)" && git -C /home/ubuntu/aitoolspak-seo-reports push`. If the push fails, say so explicitly in the report.

YOUR FINAL RESPONSE IS THE REPORT — a compact markdown summary:
1. Health: any 404s/regressions/site-down (call these out first, loudly)
2. Audit results (pass/fail each)
3. SERP snapshot: where aitoolspak.tech ranks per keyword + top competitors (compare with history file)
4. Indexation count + trend vs yesterday
5. Performance signals
6. GEO/AEO status
7. Recommended implementations for the next working session, ranked by impact (concrete: exact URLs/keywords/fields). Do NOT make changes beyond the llms.txt regeneration in step 3.
Keep it compact (bullet lists, no fluff). The same text is saved as the daily report file in step 8.
