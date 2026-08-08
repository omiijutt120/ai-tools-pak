# The AI Post — Master SEO / GEO / AEO Blueprint
**Site:** https://aitoolspak.tech/ai-post/ | **Repo:** /home/ubuntu/ai-tools-pak/ai-post/
**Date:** 2026-08-07 | **Auditor:** Autonomous operator
**Based on:** live crawl of TechCrunch, The Decoder, Wired, The Verge, VentureBeat, MarkTechPost + our own site audit

---

## 0. CURRENT-STATE AUDIT (what we have today)

| Item | Status | Notes |
|---|---|---|
| Articles | 20 live HTML | ~756 words avg (THIN for news) |
| NewsArticle schema | ✅ | single block w/ BreadcrumbList |
| News sitemap | ✅ sitemap-news.xml | only 3 URLs listed (stale) |
| Regular sitemap.xml | ❌ MISSING | must add |
| Index schema | ⚠️ WebSite+SearchAction only | needs ItemList/CollectionPage |
| Author entity | ⚠️ "The AI Post Staff" | generic, no author pages |
| FAQ sections | ❌ 0 on article pages | huge AEO miss |
| Images | ⚠️ 1 cover per article | no alt-rich inline images |
| Internal links | ⚠️ 2 related per article | no topic-cluster system |
| wordCount schema | ❌ | TechCrunch has it |
| Speakable schema | ❌ | TechCrunch has it (AEO) |
| ReadAction schema | ❌ | TechCrunch has it |
| H1/H2 structure | ⚠️ 1 H1, 4 H2, 5 H3 | ok but no answer-first block |
| TOC | ✅ 1 | keep |
| Breadcrumbs | ✅ visible + schema | keep |
| OG tags | ✅ | complete |
| Twitter cards | ⚠️ check | verify all articles |
| Author pages | ❌ | needed for E-E-A-T |
| About/editorial/corrections | ✅ about.html, editorial-policy.html | verify linked from footer |
| Discover images | ⚠️ 1024×576 covers | good size, check <1MB |
| Page speed | ✅ static, no JS | excellent baseline |

---

## 1. THE 10 COMPETITORS (research summary)

1. **TechCrunch (AI category)** — techcrunch.com/category/artificial-intelligence/ — DR ~93, huge. Strengths: NewsArticle+SpeakableSpecification+ReadAction+wordCount schema, dated URL structure /2026/08/07/slug/, news sitemap with ISO timestamps, author entities, category CollectionPage schema. LEARN: schema depth, speakable (AEO), dated URLs. DON'T COPY: their volume/rewrites.
2. **The Decoder** — the-decoder.com — DR ~60, German-English AI news. Strengths: rapid-fire daily AI news, topic aggregation, external citations (Bloomberg, Anthropic), clean category pages w/ CollectionPage+BreadcrumbList. LEARN: daily cadence, cite primary sources. DON'T COPY: aggregating others' reporting wholesale.
3. **Wired (AI tag)** — wired.com/tag/artificial-intelligence/ — DR ~95. Strengths: ItemList schema on tag pages (24 ListItems), media-rich, strong OG. LEARN: ItemList schema on category pages. DON'T COPY: paywall + long-form depth we can't match daily.
4. **The Verge (AI)** — theverge.com/ai-artificial-intelligence — DR ~93. Strengths: massive internal linking, platform architecture, breaking-news speed, OG article type. LEARN: breaking-news response speed, internal link density. DON'T COPY: their platform stack.
5. **VentureBeat (AI)** — venturebeat.com/category/ai/ — DR ~78. Strengths: enterprise-AI focus, Transform events, expert quotes, high E-E-A-T. LEARN: expert-quote pattern, enterprise angle. DON'T COPY: event-driven model.
6. **MarkTechPost** — marktechpost.com — DR ~65. Strengths: AI-research-first positioning, paper summaries, large model coverage. LEARN: "AI research explainer" template (summarize paper/model = original value). DON'T COPY: their aggregation-heavy volume.
7. **Ars Technica (AI)** — arstechnica.com — DR ~92. Strengths: deep technical accuracy, primary-source verification, strong E-E-A-T. LEARN: cite arxiv/official blog, technical depth.
8. **MIT Technology Review (AI)** — technologyreview.com/topic/artificial-intelligence/ — DR ~88. Strengths: authority, named authors, original reporting, research access. LEARN: named-author bylines, original analysis.
9. **The Information (AI)** — theinformation.com — DR ~80. Strengths: exclusive reporting, subscriber authority, entity-rich writing. LEARN: entity-rich writing (companies/models as entities).
10. **9to5Google / 9to5Mac** — 9to5google.com — DR ~72. Strengths: rapid product-news cycle, Google ecosystem focus, Discover optimization. LEARN: Discover-friendly short news format, product focus.

**Patterns ALL winners share:**
- Dated or entity-rich URL slugs
- NewsArticle + author + publisher schema (TechCrunch adds Speakable/ReadAction/wordCount)
- News sitemap with ISO publication_date (TechCrunch uses full timestamps)
- Category/tag pages with CollectionPage + ItemList schema
- Answer-first lede (first paragraph answers the query)
- Entity-rich writing (company/model names as entities, linked)
- Strong internal linking to related coverage
- Author bylines + author pages (E-E-A-T)
- Freshness: daily (or faster) cadence
- Image with alt text + proper aspect ratio for Discover

---

## 2. KEYWORD STRATEGY (for a NEW site — realistic)

Labels: 🟢 low comp (target now), 🟡 medium (weeks 2-4), 🔴 high (month 2+, authority required). Volumes are ESTIMATES (label, don't invent exact numbers).

### Primary (🔴 high comp, build topical authority over months)
- "AI news" (huge, unrealistic for new site — brand/topical play only)
- "artificial intelligence news" (same)
- "ChatGPT news" / "OpenAI news" (competitive but winnable for specific stories)
- "Gemini news" / "Claude news" / "DeepSeek news" (per-model topics)

### Long-tail (🟢 target WEEK 1)
- "what is [model] and how to use it" — e.g. "what is deepseek v4"
- "[model] price in Pakistan" — ties to aitoolspak.tech money pages! (we already rank 5/8)
- "how to build an AI voice agent for business" (we have this article)
- "whatsapp calling api for businesses" (we have this — already live)
- "free AI tools that are actually free" (we have this)
- "[tool] vs [tool] comparison" — "n8n vs zapier" (we have this)
- "how to make money with AI" (we have this)
- "AI automation agency" starter content
- "[company] acquires [company]" — news queries, low comp for 48h window

### Trending (watch daily; from The Decoder crawl 2026-08-07)
- OpenAI Astra model security news
- Suno AI copyright/spam rules
- Stanford/Arc Institute AI-designed viruses
- GPT-5.6 Sol rollout
- AMD acquires Taalas (we covered it!)
- AI agent browsers (Cloudflare Kitesurf)
- Enterprise AI ROI tools

### Breaking-news keywords (respond within hours)
- "[company] launches [model]"
- "[company] acquires [startup]"
- "[model] [version] release"
- "[company] API price change"
- "[company] layoffs" / "[company] funding"

### Question keywords (AEO gold 🟢)
- "what is X" / "how does X work" / "why did X" / "when will X" / "is X safe" / "which X is best" / "how much does X cost" / "X vs Y"

### Entity keywords
- Models: GPT-5.6 Sol, Claude, Gemini, DeepSeek V4, Llama, Mistral, Grok
- Companies: OpenAI, Anthropic, Google DeepMind, Meta AI, xAI, Microsoft, NVIDIA, AMD
- People: Sam Altman, Demis Hassabis, Dario Amodei, Jensen Huang, Elon Musk
- Technologies: RAG, agents, MCP, diffusion, transformers, inference, fine-tuning

### Keyword → channel mapping (per intent)
| Intent | Best channel | Content type |
|---|---|---|
| Breaking news | Google News + Discover + SEO | news article, publish <24h of event |
| What-is / how-to | AEO + SEO | explainer with answer-first para |
| Comparison | SEO + AEO | comparison table + verdict |
| Price | SEO + GEO | price table (ties to parent site!) |
| Deep research | GEO | research summary, cite arxiv |

---

## 3. TOPICAL AUTHORITY MAP (revised, with our existing articles mapped)

```
AI News (homepage hub)
├── Model News (OPENAI | GEMINI | CLAUDE | DEEPSEEK | META | XAI)   ← per-model pillar
│   ├── [model] release/update (news)
│   ├── [model] vs [model] (comparison)          ← claude-vs-gpt-vs-gemini-2026 ✅
│   └── what is [model] (explainer)
├── AI Agents & Automation                        ← build-ai-voice-agent ✅, whatsapp-ai-chatbot ✅
│   ├── agent frameworks news
│   ├── voice agents
│   └── workflow automation (n8n-vs-zapier ✅)
├── AI Business & Money                           ← make-money-with-ai ✅, side-hustles ✅, agency ✅
│   ├── AI startup funding
│   ├── AI acquisitions (amd-acquires-taalas ✅)
│   └── API pricing (deepseek-v4-free-api ✅, cloud-vs-local ✅)
├── Generative AI (video/image/music/code)
├── AI Research (papers, benchmarks)              ← marktechpost-style
├── AI Policy & Safety (regulation, security)
└── AI Tutorials / Explainers                     ← prompt-library ✅, free-ai-tools ✅
```

**Pillar pages to create (each links down to articles + up to homepage):**
1. "OpenAI news hub" — all OpenAI stories + what-is-GPT explainer
2. "Claude news hub" — Anthropic stories
3. "Google Gemini news hub"
4. "DeepSeek news hub" (we have 1 article; pillar will rank for "deepseek news")
5. "AI Agents guide" — pillar over voice-agent/chatbot articles
6. "Make money with AI hub" — pillar over 3 money articles
7. "AI models explained" — entity hub (GPT/Claude/Gemini/Llama/Mistral/Grok pages)

**Entity pages** (short, evergreen, GEO-gold): one page per major model/company — 300-500 words, answer-first, entity schema. These get cited by AI engines.

---

## 4. GEO OPTIMIZATION (AI answer engines: AI Overviews, ChatGPT, Perplexity, Gemini, Copilot)

**Why it matters:** AI engines read llms.txt + structured data + answer-first content. Our parent site already passes GEO audits; the AI Post must too.

### Exact implementation:
1. **llms.txt for AI Post** — create /ai-post/llms.txt (short index) + /ai-post/llms-full.txt (full plain-text dump) — follow llmstxt.org convention. Parent site has it; subfolder needs its own.
2. **robots.txt** — parent robots.txt already allows GPTBot/ClaudeBot/PerplexityBot/Google-Extended; VERIFY /ai-post/ paths aren't excluded (they aren't — no Disallow on subpaths, but re-check).
3. **Answer-first lede** — every article's FIRST paragraph (after H1) must answer the query in 2-3 sentences: "X is... announced on... by... because...". Never start with fluff.
4. **SpeakableSpecification schema** — add to every article (TechCrunch does this): `"speakable": {"@type": "SpeakableSpecification", "cssSelector": [".article-lede", ".article-summary"]}` — tells Google what to read aloud/quote.
5. **FAQ sections on every article** (3-5 questions, visible + FAQPage schema) — AEO engines pull these directly.
6. **Quotable statements** — include 1-2 standalone "takeaway" pull-quotes per article.
7. **Tables for comparisons/prices** — "Claude vs GPT vs Gemini" table format works in ChatGPT/Perplexity answers.
8. **Entity-rich writing** — bold/link company & model names on first mention; use consistent entity names.
9. **Author + Organization info** — author schema with real name, publisher Organization with logo + URL (already present, improve).
10. **About / editorial / fact-checking** — about.html + editorial-policy.html exist; ADD fact-checking + corrections policy pages, link from footer (E-E-A-T for AI engines too).

---

## 5. AEO FRAMEWORK (Answer Engine Optimization)

**Universal article skeleton (reusable template):**
```
H1: [Entity] [Verb] [What] — [Why it matters]
LEDE (answer-first, 2-3 sentences): What happened + who + when + why it matters.
"What is it?" H2 — definition paragraph (3-4 sentences).
"Why does it matter?" H2 — impact + who's affected.
"What changed?" H2 — before/after.
"When did it happen?" H2 — timeline/date.
"Who announced it?" H2 — org + people (with entity links).
"How does it work?" H2 — mechanism, plain language.
"How much does it cost?" H2 — pricing (ties to parent site's PKR pages!).
"Key features" H2 — bullet list.
"Limitations / risks" H2 — honest caveats (E-E-A-T trust).
"How does it compare?" H2 — comparison table.
"What happens next?" H2 — outlook.
FAQ H3s (3-5 questions matching FAQPage schema).
Sources & references H2 — link primary sources (official blog, arxiv, docs).
Author box — name, bio line, link to author page.
Related articles (3) — internal links.
```

**Answer templates per intent:**
- **What-is:** definition first sentence → origin → how it works → who uses it → FAQ
- **News:** 5W1H lede → what changed → why it matters → reaction → FAQ
- **Comparison:** criteria table first → verdict → deep-dive each → FAQ
- **Price:** price table first (PKR + USD) → what's included → free vs paid → FAQ
- **Tutorial:** result first → prerequisites → steps (numbered) → troubleshooting → FAQ

---

## 6. TECHNICAL SEO CHECKLIST (with our exact gaps)

**IMMEDIATE FIXES (Critical):**
- [ ] **sitemap.xml (regular)** — CREATE at /ai-post/sitemap.xml with ALL 20+ articles + pages. Only news sitemap exists now.
- [ ] **Update sitemap-news.xml** — only 3 URLs; must include ALL news articles with ISO timestamps (TechCrunch pattern: 2026-08-07T22:48:24+00:00).
- [ ] **WordCount + Speakable + ReadAction schema** — add to NewsArticle block on all articles (TechCrunch pattern).
- [ ] **Index page schema upgrade** — add ItemList (one ListItem per article) + CollectionPage (Wired/TheDecoder pattern).
- [ ] **Author pages** — create /ai-post/authors/[name].html for "The AI Post Staff" → better: a real named author (owner Muhammad Umar or editorial name) with bio + byline link from every article.
- [ ] **FAQPage schema** — where FAQ sections are added, must match visible content 1:1.

**High:**
- [ ] Canonical tags — verify every article has self-referencing canonical (check current generator).
- [ ] Twitter/X cards — verify twitter:card/site/creator meta on all articles.
- [ ] Robots.txt — ensure AI Post subpaths crawlable + news sitemap referenced.
- [ ] RSS feed.xml — already exists (feed.xml) — verify valid + referenced in <head>.
- [ ] Internal links — 3+ per article (related + pillar + money page).
- [ ] Breadcrumb — already present; keep ListItem schema consistent.
- [ ] Image alt text — every image needs descriptive alt (currently 1 cover/art).
- [ ] WebP/AVIF — convert covers to WebP (~60% smaller) + keep 1024×576.

**Medium:**
- [ ] 404 page + redirects (post-renames)
- [ ] Hreflang (only if we add non-en versions — not now)
- [ ] Core Web Vitals — static site already fast; verify LCP < 2.5s
- [ ] Lazy loading images (`loading="lazy"` below fold)
- [ ] Article datePublished/dateModified visible on page (not just schema)
- [ ] Entity pages (see topical map)
- [ ] Pagination for growing article index (page 2, 3...)
- [ ] Duplicate/thin content audit — 756-word avg is thin; expand news to 800-1200

---

## 7. GOOGLE NEWS + DISCOVER STRATEGY

**Google News (NewsArticle schema + news sitemap + originality):**
- Publish 1-3 genuine news articles daily (not rewrites — original reporting/angle)
- News sitemap updated EVERY publish with ISO timestamp
- NewsArticle schema with datePublished + dateModified + author + publisher
- Publisher name consistent: "The AI Post"
- Editorial transparency: corrections policy + contact (E-E-A-T requirement for News)
- Headlines: factual, specific, under 70 chars ("AMD Acquires Taalas to Bake AI Models Into Silicon" ✓ pattern)
- Original reporting: add our own angle (Pakistan/PKR angle = differentiation!)
- Language: en (keep), add <news:language>en</news:language> ✓ already

**Google Discover (images + CTR + freshness):**
- **Featured image 1200+px wide, 16:9, <1MB** — our 1024×576 works but upsize or keep; Discover prefers larger
- Bold, curiosity-gap titles but NOT clickbait (Google explicitly demotes clickbait)
- Fresh content daily; Discover loves rapid publishing cadence
- High CTR = more distribution; test title formats
- Author + publisher signals help trust

---

## 8. CONTENT STRATEGY — 90-DAY PUBLISHING PLAN

**Cadence for a new site (realistic):**
- Daily: 1 news article (fresh angle, 800-1200 words) — 7/week
- Weekly: 2 explainers OR comparisons (evergreen, AEO-targeted) — 2/week
- Weekly: 1 "make money / business" article (ties to parent site) — 1/week
- Monthly: 1 original data study or survey (linkable asset) — 1/month

**90-day totals:** ~63 news + ~26 evergreen + ~13 business + 3 data studies ≈ **105 articles**

**Priority order (per user's list):**
1. Ranking opportunity (long-tail, low comp) — what-is/model/price queries
2. Search demand — trending news (respond <24h)
3. Topical authority — pillars + entities
4. Freshness — daily cadence
5. AI-search visibility — answer-first + FAQ + speakable
6. New-site competitiveness — long-tail + Pakistan angle + parent-site backlinks

**Pakistan angle = moat:** every price/comparison article links the parent site's PKR product pages (ChatGPT Plus PKR, Claude PKR, Gemini PKR). No global competitor does this. This is our differentiation for BOTH SEO and revenue.

---

## 9. INTERNAL LINKING SYSTEM

**Rules:**
- Every article: **minimum 3 internal links** (1 pillar, 1 related article, 1 money page)
- Related articles block: 3 links, same category, recent-first
- Pillar pages link ALL their child articles (hub-and-spoke)
- Homepage links: latest 10 + top 5 categories
- Breadcrumbs: Home > Category > Article (schema + visible)
- Anchor text: descriptive ("DeepSeek V4 free API pricing" not "click here")
- Orphan prevention: every article reachable ≤3 clicks from homepage
- Topic clusters: each cluster = 1 pillar + 5-10 spokes, all interlinked

**Example architecture:**
```
Home (index.html)
├── OpenAI hub ──┬─ openai-gpt-5-6-sol-explained
│                ├─ openai-astra-security-news
│                └─ gpt-vs-claude-vs-gemini (also in Claude hub)
├── Make money with AI hub ──┬─ make-money-with-ai-2026
│                            ├─ chatgpt-side-hustles
│                            └─ start-ai-automation-agency → wa.me CTA
└── [Article] → related → [Article2] → related → [Article3]
```

---

## 10. E-E-A-T SYSTEM

- **Author pages** (/authors/muhammad-umar.html): real name, photo, bio (BS AI student, ML/NLP, links to github/linkedin), list of articles
- **Byline** on every article: "By Muhammad Umar" linking to author page
- **About page** — exists; expand with editorial mission + team
- **Contact page** — exists ✓
- **Editorial policy** — exists ✓
- **Corrections policy** — ADD page + link in footer
- **Fact-checking policy** — ADD page
- **AI-content policy** — ADD page (transparency: which parts AI-assisted, human-reviewed)
- **Sources** — every article cites primary sources (official blog, arxiv, company docs, reputable outlets) with links
- **Review process** — publish + review within 24h, correct promptly, log corrections
- **Publisher info** — Organization schema with logo, address (Pakistan), contact

---

## 11. BACKLINK + DIGITAL PR (white-hat only)

1. **Linkable assets** (create 1-2/month):
   - "State of AI in Pakistan 2026" data study (survey PKR prices vs USD — unique data)
   - "Free AI tools actually free" ultimate list (have it — promote it)
   - "AI subscription prices worldwide (PKR vs USD)" comparison tables
2. **HARO/Connectively/Featured** — respond to journalist queries on AI topics (source: Muhammad Umar, AI developer Pakistan)
3. **GitHub** — owner's profile README links parent site (pending); add AI Post link too
4. **Community** — Reddit r/artificial r/LocalLLaMA (helpful comments, occasionally cite own analysis), HN (post original analysis), Discord servers (AI dev)
5. **Parent-site synergy** — aitoolspak.tech already gets links; cross-link parent ↔ AI Post (internal sites, not backlinks but authority flow)
6. **Guest contributions** — offer 1-2 guest posts to AI newsletters (e.g. smaller AI newsletters) in exchange for byline + link
7. **Original reporting** — unique interviews/analysis attract organic links (e.g. Pakistan AI startup coverage nobody else has)
8. **NEVER:** PBNs, paid links (incl. the $200 Toolify guest-post we declined), comment spam, article spinning

---

## 12. MASTER BLUEPRINT (consolidated)

**Architecture:** Homepage hub → 7 category pillars → entity pages → news/explainer articles. 3-click depth max.
**URLs:** keep .html static: /ai-post/[slug].html — dated URLs (/ai-post/2026/08/[slug].html) = better for news but BREAKS current links; keep flat slugs, add dates in visible content + schema.
**Schema stack:** WebSite+SearchAction (index) · CollectionPage+ItemList (categories) · NewsArticle+BreadcrumbList+SpeakableSpecification+ReadAction+wordCount (articles) · Person (author pages) · Organization (global, exists) · FAQPage (FAQ sections).
**KPIs:** impressions (GSC), indexed URLs count, AI-citations (ask ChatGPT/Perplexity monthly), Discover clicks, News appearances, organic clicks, parent-site orders attributed to AI Post referrals.

---

## 13. PRIORITIZED ACTION PLAN

### TODAY (Critical — agent can do now)
1. Create /ai-post/sitemap.xml (all articles) — Critical — instant indexation — Low effort
2. Rebuild sitemap-news.xml with all articles + ISO timestamps — Critical — Google News eligibility — Low
3. Add SpeakableSpecification + ReadAction + wordCount to NewsArticle schema in generator — Critical — AEO — Low
4. Add ItemList/CollectionPage schema to index.html — Critical — category SEO — Low
5. Fix author: real byline "Muhammad Umar" + create author page — Critical — E-E-A-T — Medium
6. Verify canonicals + Twitter cards on all articles — High — hygiene — Low
7. Add FAQ section + FAQPage schema to top 5 articles — High — AEO — Medium

### WEEK 1 (High impact)
8. llms.txt + llms-full.txt for /ai-post/ — GEO visibility — Low
9. Answer-first lede rewrite on top 10 articles — AEO — Medium
10. Fact-checking + corrections + AI-content policy pages — E-E-A-T — Low
11. WebP conversion of covers + alt text — speed + image SEO — Medium
12. Expand thin articles (756 → 1000+ words with FAQs) — Medium
13. Publish first data-study linkable asset — backlinks — High effort

### WEEKS 2-4 (Content + technical)
14. 7 pillars + 10 entity pages — topical authority — ongoing
15. Daily news cadence (1/day, <24h response) — freshness — ongoing
16. Internal link audit (3+ links/article, orphan scan) — Medium
17. Category hub pages with CollectionPage schema — Medium

### MONTH 2 (Authority)
18. HARO/Connectively responses (2-3/week) — backlinks — ongoing
19. Original Pakistan-AI reporting (unique angle) — digital PR — ongoing
20. Community participation (Reddit/HN/Discord) — brand — ongoing

### MONTH 3 (Scale)
21. 2-3 articles/day (news + evergreen mix) — scale — ongoing
22. Monthly data studies — link magnets — ongoing
23. Measure AI-citations quarterly; double down on cited topics

---

## 14. TOP 20 THINGS TO IMPLEMENT FIRST (ranked by impact)

1. **sitemap.xml** (regular) — Google can't index what it can't find — Critical
2. **News sitemap update** (all articles + ISO timestamps) — Google News entry — Critical
3. **SpeakableSpecification + ReadAction + wordCount schema** — AEO/Google-assistant citations — Critical
4. **FAQ sections + FAQPage schema** on every article — AEO + rich results — Critical
5. **Answer-first lede** on every article — GEO/AEO fundamental — Critical
6. **Real author byline + author page** — E-E-A-T — Critical
7. **ItemList/CollectionPage schema on index/categories** — category ranking — High
8. **llms.txt + llms-full.txt for /ai-post/** — AI-engine crawling — High
9. **Internal links (3+/article: pillar+related+money)** — authority flow — High
10. **7 pillar hubs** (OpenAI/Claude/Gemini/DeepSeek/Agents/Money/Models) — topical authority — High
11. **Entity pages** (10 major models/companies) — GEO citations — High
12. **Corrections + fact-checking + AI-content policy pages** — E-E-A-T for News — High
13. **Pakistan angle in every price article** (→ parent PKR pages) — differentiation + revenue — High
14. **WebP covers + alt text + lazy loading** — image SEO + speed — Medium
15. **Daily news cadence (1/day, <24h)** — freshness + News — Medium
16. **Data study ("AI prices in Pakistan") linkable asset** — backlinks — Medium
17. **HARO/Connectively expert-source responses** — authority links — Medium
18. **Expand thin articles to 1000+ words** — depth signals — Medium
19. **Canonical + OG + Twitter card audit** — hygiene — Medium
20. **Monthly AI-citation audit (ChatGPT/Perplexity probes)** — measure GEO — Low

*Estimated impact ranking based on Google's documented signals (freshness, E-E-A-T, structured data rich results, indexation) + AI-engine behaviors (llms.txt, answer-first, FAQ). No invented stats.*
