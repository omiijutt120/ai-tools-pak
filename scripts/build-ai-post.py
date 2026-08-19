#!/usr/bin/env python3
"""Build The AI Post static site from content/articles.json.
Generates: article pages, category pages, index, search index, RSS, news sitemap, updates main sitemap + llms.txt."""
import json, os, re, html, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
POST = os.path.join(os.path.dirname(ROOT), "ai-post")   # ai-post/
DATA = json.load(open(os.path.join(POST, "content", "articles.json")))
SITE = DATA["site"]; CATS = DATA["categories"]; ARTS = DATA["articles"]
BASE = SITE["url"].rstrip("/")
WA = "https://wa.me/923714549245?text=" + "Hi!%20I%20want%20an%20AI%20voice%20agent%20for%20my%20business"
CAT_BY_KEY = {c["key"]: c for c in CATS}

def esc(s): return html.escape(s, quote=True)
def slugify(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def header(active=""):
    def _link(c):
        on = ' class="on"' if active == c["key"] else ""
        return f'<a href="{BASE}/{c["key"]}/"{on}>{c["icon"]} {c["label"]}</a>'
    links = "".join(_link(c) for c in CATS)
    return f"""<header><div class="container nav">
  <a class="logo" href="{BASE}/"><span class="dot"></span>The AI Post</a>
  <nav class="nav-links">{links}</nav>
  <div class="nav-right">
    <button id="searchBtn">🔍 <span style="color:var(--muted)">Search…</span></button>
    <button id="themeToggle" title="Dark mode">🌙</button>
  </div>
</div>
<div id="searchOverlay"><div class="search-box">
  <input id="searchInput" placeholder="Search articles… (press Esc to close)">
  <div class="search-results" id="searchResults"><div style="padding:14px;color:var(--muted);font-size:14px">Type to search articles…</div></div>
</div></div></header>"""

def footer():
    return f"""<footer><div class="container">
  <div class="foot">
    <div class="brand">The AI Post</div>
    <div><a href="{BASE}/about.html">About</a> · <a href="{BASE}/editorial-policy.html">Editorial Policy</a> · <a href="{BASE}/terms.html">Terms</a> · <a href="{BASE}/privacy-policy.html">Privacy</a> · <a href="{BASE}/cookie-policy.html">Cookies</a> · <a href="{BASE}/contact.html">Contact</a></div>
  </div>
  <p class="disc">© {datetime.date.today().year} The AI Post. Independent AI &amp; technology publication. Content is educational — not financial advice. Advertising may appear on this site; ads are clearly labelled.</p>
</div></footer>
<div id="bmBar"><button id="bmBtn" title="Bookmark">🔖</button></div>
<script src="{BASE}/assets/app.js"></script></body></html>"""

def head(title, desc, url, schema=None, canonical=None, og_img=None):
    s = f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(canonical or url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(url)}">
<meta property="og:image" content="{esc(og_img) if og_img else ''}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{esc(og_img) if og_img else ''}">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700;8..60,800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{BASE}/assets/style.css">
"""
    if schema: s += '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False) + "</script>\n"
    return s + "</head>\n<body>\n"

def card(a, big=False):
    c = CAT_BY_KEY.get(a["category"], {"label":"Article","icon":"📄"})
    cls = "card big-card" if big else "card"
    img = cover_img(a)
    return f"""<a class="{cls}" href="{BASE}/{a['slug']}.html">
  <div class="thumb"><span class="tag">{c['icon']} {c['label']}</span>{img}</div>
  <div class="body"><h3>{esc(a['title'])}</h3><p>{esc(a['excerpt'])}</p>
  <span class="meta">📅 {a['date']} · 📖 {a['readMins']} min</span></div></a>"""

import os as _os
def cover_img(a, alt=None):
    """Prefer generated JPG cover; fall back to SVG art; else emoji."""
    jpg = _os.path.join(POST, "covers", a["slug"] + ".jpg")
    svg = _os.path.join(POST, "covers", a["slug"] + ".svg")
    alt = alt or a["title"]
    # Explicit dimensions prevent CLS (layout shift) while images load.
    if _os.path.exists(jpg):
        return (f'<img class="timg" src="{BASE}/covers/{a["slug"]}.jpg" '
                f'alt="{esc(alt)}" width="1024" height="576" loading="lazy">')
    if _os.path.exists(svg):
        return (f'<img class="timg" src="{BASE}/covers/{a["slug"]}.svg" '
                f'alt="{esc(alt)}" width="1200" height="630" loading="lazy">')
    return f'<span style="font-size:52px">{a["cover"]}</span>'

def body_blocks(a):
    out = []
    for b in a["body"]:
        for k, v in b.items():
            if k == "h2":
                out.append(f'<h2 id="{slugify(v)}">{esc(v)}</h2>')
            elif k == "h3":
                out.append(f"<h3>{esc(v)}</h3>")
            elif k == "p":
                out.append(f"<p>{esc(v)}</p>")
            elif k == "ul":
                out.append("<ul>" + "".join(f"<li>{esc(x)}</li>" for x in v) + "</ul>")
            elif k == "ol":
                out.append("<ol>" + "".join(f"<li>{esc(x)}</li>" for x in v) + "</ol>")
            elif k == "quote":
                out.append(f"<blockquote>{esc(v)}</blockquote>")
            elif k == "table":
                th = "".join(f"<th>{esc(h)}</th>" for h in v["head"])
                tr = "".join("<tr>" + "".join(f"<td>{esc(x)}</td>" for x in row) + "</tr>" for row in v["rows"])
                out.append(f'<table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>')
            elif k == "cta":
                out.append(f'<div class="cta-box"><h3>🤖 Get it built for your business</h3><p>{esc(v)}</p><a href="{WA}" target="_blank" rel="noopener">💬 Chat on WhatsApp</a></div>')
            elif k == "faq":
                items = "".join(
                    f'<details><summary>{esc(q)}</summary><p>{esc(ans)}</p></details>'
                    for q, ans in v
                )
                out.append(f'<h2 id="faq">Frequently asked questions</h2><div class="faq">{items}</div>')
    return "\n".join(out)

def article_page(a):
    c = CAT_BY_KEY.get(a["category"], {"label": "Article", "icon": "📄", "key": "ai-news"})
    url = f"{BASE}/{a['slug']}.html"
    h2s = [b["h2"] for b in a["body"] if "h2" in b]
    toc = '<div class="toc" id="toc"></div>' if h2s else ""
    related = [x for x in ARTS if x["slug"] != a["slug"]]
    related = sorted(related, key=lambda x: (x["category"] == a["category"], x["date"]), reverse=True)[:3]
    rel = '<div class="related">' + "".join(f'<a class="card" href="{BASE}/{x["slug"]}.html"><div class="body"><h3>{esc(x["title"])}</h3><span class="meta">{esc(x["date"])} · {x["readMins"]} min</span></div></a>' for x in related) + "</div>"
    faq_blocks = [b for b in a["body"] if "faq" in b]
    schema = {
        "@context": "https://schema.org", "@type": "NewsArticle" if a["category"] == "ai-news" else "Article",
        "headline": a["title"], "description": a["excerpt"], "datePublished": a["date"] + "T09:00:00+05:00",
        "dateModified": a["date"] + "T09:00:00+05:00", "mainEntityOfPage": url,
        "image": f"{BASE}/covers/{a['slug']}.jpg",
        "author": {"@type": "Person", "name": "Muhammad Umar", "url": "https://www.linkedin.com/in/umar-jutt",
                   "sameAs": ["https://github.com/omiijutt120", "https://www.linkedin.com/in/umar-jutt"]},
        "publisher": {"@type": "Organization", "name": "The AI Post", "url": BASE,
                      "logo": {"@type": "ImageObject", "url": "https://aitoolspak.tech/logo.png"}},
        "articleSection": c["label"], "wordCount": len(a["body"]) * 90,
        "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".post h1", ".post .lede", ".post p:first-of-type"]}}
    if faq_blocks:
        schema["@graph"] = [{"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": ans}}
            for b in faq_blocks for q, ans in b["faq"]]}]
    bread = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
        {"@type": "ListItem", "position": 2, "name": c["label"], "item": f'{BASE}/{c["key"]}/'},
        {"@type": "ListItem", "position": 3, "name": a["title"], "item": url}]}
    pg = head(a["title"], a["excerpt"], url, [schema, bread], og_img=f"{BASE}/covers/{a['slug']}.jpg") + header(c["key"]) + f"""
<article class="post">
  <span class="tag">{c['icon']} {c['label']}</span>
  <h1>{esc(a['title'])}</h1>
  <div class="meta">📅 {a['date']} · <span id="readTime"></span> · By <a href="{BASE}/authors/muhammad-umar.html" rel="author">Muhammad Umar</a></div>
  <div class="cover">{cover_img(a)}</div>
  {toc}
  {body_blocks(a)}
  <div class="share">
    <button id="copyLink">🔗 Copy link</button>
    <button id="twShare">🐦 Share on X</button>
  </div>
  <div class="author"><div class="av">MU</div><div><b><a href="{BASE}/authors/muhammad-umar.html" rel="author">Muhammad Umar</a></b><p>Founder of AI Tools Pak. BS Artificial Intelligence student building AI agents, voice systems and automation for real businesses. <a href="{BASE}/about.html">Read the editorial policy</a>.</p></div></div>
  <h3 style="font-family:var(--serif);font-size:21px">📚 Related reading</h3>
  {rel}
</article>
""" + footer()
    open(os.path.join(POST, a["slug"] + ".html"), "w").write(pg)
    return url

def category_page(c):
    arts = [a for a in ARTS if a["category"] == c["key"]]
    url = f'{BASE}/{c["key"]}/'
    cards = '<div class="grid">' + "".join(card(a) for a in arts) + "</div>"
    pg = head(f"{c['label']} — The AI Post", f"All {c['label'].lower()} articles from The AI Post.", url) + header(c["key"]) + f"""
<div class="container" style="padding-top:34px">
  <div class="sec-head"><h2>{c['icon']} {c['label']}</h2><span style="font-size:13px;color:var(--muted)">{len(arts)} articles</span></div>
  {cards}
</div>""" + footer()
    os.makedirs(os.path.join(POST, c["key"]), exist_ok=True)
    open(os.path.join(POST, c["key"], "index.html"), "w").write(pg)

def index_page():
    url = BASE + "/"
    news = [a for a in ARTS if a["category"] == "ai-news"][:2]
    featured = ARTS[:1]
    rest = ARTS[1:]
    news_grid = '<div class="grid news">' + "".join(card(a) for a in news) + "</div>" if news else ""
    feat = '<div class="grid">' + "".join(card(a, big=(i == 0)) for i, a in enumerate(featured + rest)) + "</div>"
    topics = "".join(f'<a class="topic" href="{BASE}/{c["key"]}/">{c["icon"]} {c["label"]}</a>' for c in CATS)
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "name": "The AI Post", "url": url,
         "potentialAction": {"@type": "SearchAction", "target": url + "?q={search_term_string}", "query-input": "required name=search_term_string"}},
        {"@type": "CollectionPage", "name": "The AI Post — AI News, Tutorials, Comparisons & Tools", "url": url,
         "isPartOf": {"@type": "WebSite", "name": "The AI Post", "url": url}},
        {"@type": "ItemList", "name": "Latest AI articles", "url": url,
         "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{BASE}/{a['slug']}.html",
                              "name": a["title"]} for i, a in enumerate(ARTS[:25])]}]}
    pg = head("The AI Post — AI News, Tutorials, Comparisons & Tools, Daily", SITE["tagline"], url, schema) + header() + f"""
<section class="hero"><div class="container">
  <span class="kicker">⚡ Daily AI publication</span>
  <h1>AI news, tutorials &amp; tools — <b>without the hype.</b></h1>
  <p>Fresh AI news, hands-on tutorials, honest comparisons and free tools. Written by people who actually build AI systems.</p>
  <div class="hero-actions">
    <a class="btn blue" href="{BASE}/{ARTS[0]['slug']}.html">📰 Read today's top story</a>
    <a class="btn ghost" href="{BASE}/free-ai-tools/">🧰 Free AI tools</a>
  </div>
  <div class="hero-strip">
    <div><b>{len(ARTS)}+</b>Articles</div>
    <div><b>6</b>Categories</div>
    <div><b>Daily</b>Updates</div>
    <div><b>100%</b>Original content</div>
  </div>
</div></section>
<div class="container">
  <section><div class="sec-head"><h2>📰 Latest news</h2><a href="{BASE}/ai-news/">All news →</a></div>{news_grid}</section>
  <section><div class="sec-head"><h2>🔥 All articles</h2></div>{feat}</section>
  <section><div class="sec-head"><h2>🧩 Categories</h2></div><div class="topics">{topics}</div></section>
  <section class="newsletter">
    <h2>📬 The AI Post newsletter</h2>
    <p>One email a week: the 3 AI stories that matter + one tool worth trying. No spam.</p>
    <form onsubmit="nlSub(event)"><input type="email" id="nlEmail" placeholder="you@email.com" required><button type="submit">Subscribe</button></form>
  </section>
</div>
""" + footer().replace("</body>", """<script>function nlSub(e){e.preventDefault();alert('✅ Subscribed! Check your inbox soon.');}</script></body>""")
    open(os.path.join(POST, "index.html"), "w").write(pg)

def search_index():
    idx = [{"t": a["title"], "e": a["excerpt"], "c": CAT_BY_KEY.get(a["category"], {}).get("label", ""), "d": a["date"], "u": f'{BASE}/{a["slug"]}.html'} for a in ARTS]
    os.makedirs(os.path.join(POST, "data"), exist_ok=True)
    json.dump(idx, open(os.path.join(POST, "data", "search-index.json"), "w"))

def rss():
    items = "".join(f"""<item><title>{esc(a['title'])}</title><link>{BASE}/{a['slug']}.html</link><guid>{BASE}/{a['slug']}.html</guid><description>{esc(a['excerpt'])}</description><pubDate>{a['date']} 09:00:00 +0500</pubDate><category>{CAT_BY_KEY.get(a['category'],{}).get('label','')}</category></item>""" for a in ARTS)
    xml = f"""<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>
<title>The AI Post</title><link>{BASE}/</link><description>{SITE['tagline']}</description><language>en</language>
{items}</channel></rss>"""
    open(os.path.join(POST, "feed.xml"), "w").write(xml)

def news_sitemap():
    news = [a for a in ARTS if a["category"] == "ai-news"]
    urls = "".join(f"""<url><loc>{BASE}/{a['slug']}.html</loc><news:news><news:publication><news:name>The AI Post</news:name><news:language>en</news:language></news:publication><news:publication_date>{a['date']}T09:00:00+05:00</news:publication_date><news:title>{esc(a['title'])}</news:title></news:news></url>""" for a in news)
    open(os.path.join(POST, "sitemap-news.xml"), "w").write(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">{urls}</urlset>')

def main_sitemap_and_llms():
    repo = os.path.dirname(POST)
    sm = os.path.join(repo, "sitemap.xml")
    urls = [BASE + "/"] + [f"{BASE}/{c['key']}/" for c in CATS] + [f"{BASE}/{a['slug']}.html" for a in ARTS] + [
        f"{BASE}/about.html", f"{BASE}/contact.html", f"{BASE}/privacy-policy.html",
        f"{BASE}/terms.html", f"{BASE}/cookie-policy.html", f"{BASE}/editorial-policy.html"]
    urls_xml = "".join(f'\n  <url>\n    <loc>{u}</loc>\n    <lastmod>2026-08-07</lastmod>\n  </url>' for u in urls)
    s = open(sm).read()
    # Drop any previously-generated ai-post <url> blocks, then append the fresh
    # block before </urlset>. Other entries (products, blog, news) are untouched.
    s = re.sub(r'\n  <url>\n    <loc>' + re.escape(BASE) + r'/[^<]*</loc>\n    <lastmod>[^<]*</lastmod>\n  </url>', "", s)
    s = s.replace("</urlset>", urls_xml + "\n</urlset>")
    open(sm, "w").write(s)
    ll = os.path.join(repo, "llms.txt")
    l = open(ll).read()
    section = "\n\n## The AI Post (AI publication)\n\nThe AI Post covers AI news, tutorials, comparisons, reviews and free tools. Articles are original and practical.\n\n- Home: " + BASE + "/\n" + "".join(f"- {a['title']}: {BASE}/{a['slug']}.html\n" for a in ARTS)
    if "## The AI Post (AI publication)" in l:
        l = l[:l.find("## The AI Post (AI publication)")].rstrip() + "\n"
    l += section
    open(ll, "w").write(l)

def author_page():
    url = f"{BASE}/authors/muhammad-umar.html"
    schema = {"@context": "https://schema.org", "@type": "Person", "name": "Muhammad Umar",
              "url": url, "jobTitle": "Founder, AI Tools Pak",
              "sameAs": ["https://github.com/omiijutt120", "https://www.linkedin.com/in/umar-jutt", WA],
              "knowsAbout": ["Artificial Intelligence", "Machine Learning", "NLP", "AI agents", "automation"]}
    arts = "".join(f'<li><a href="{BASE}/{a["slug"]}.html">{esc(a["title"])}</a> <span class="meta">· {a["date"]}</span></li>' for a in sorted(ARTS, key=lambda x: x["date"], reverse=True))
    pg = head("Muhammad Umar — Author, The AI Post", "Muhammad Umar is the founder of AI Tools Pak and writes AI news, tutorials and comparisons for The AI Post.", url, schema) + header() + f"""
<div class="container" style="padding-top:34px">
  <div class="sec-head"><h2>✍️ Muhammad Umar</h2></div>
  <p>Founder of <a href="https://aitoolspak.tech">AI Tools Pak</a> — cheap AI subscriptions in Pakistan (PKR prices, WhatsApp support). BS Artificial Intelligence student building AI agents, voice systems and workflow automation for real businesses.</p>
  <p>Links: <a href="https://github.com/omiijutt120" rel="me">GitHub</a> · <a href="https://www.linkedin.com/in/umar-jutt" rel="me">LinkedIn</a> · <a href="{WA}">WhatsApp</a></p>
  <div class="sec-head" style="margin-top:28px"><h3>📝 Articles by Muhammad Umar</h3></div>
  <ul>{arts}</ul>
</div>""" + footer()
    os.makedirs(os.path.join(POST, "authors"), exist_ok=True)
    open(os.path.join(POST, "authors", "muhammad-umar.html"), "w").write(pg)

if __name__ == "__main__":
    built = []
    for a in ARTS:
        built.append(article_page(a))
    for c in CATS:
        category_page(c)
    index_page()
    author_page()
    search_index()
    rss()
    news_sitemap()
    main_sitemap_and_llms()
    print(f"built {len(built)} articles, {len(CATS)} categories, index, author, search, rss, news-sitemap")
