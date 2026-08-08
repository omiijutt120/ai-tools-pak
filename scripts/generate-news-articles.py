#!/usr/bin/env python3
"""Generate AI-news article pages for the aitoolspak.tech blog from data/news-articles.json.

Produces for each article:
  - blog/<slug>/index.html  (full page: head/meta/canonical/OG + body + Article/WebPage/FAQPage JSON-LD)
  - blog/<slug>/cover.svg   (branded OG thumbnail, 1200x630)
Also writes:
  - blog/_news-cards.html       (post-card <li> fragments, newest first, for blog index)
  - blog/_news-blogposting.json (BlogPosting JSON-LD fragment for the Blog schema list)
Usage: python3 scripts/generate-news-articles.py
"""
import json, os, re, html, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = json.load(open(os.path.join(ROOT, "data", "news-articles.json")))
ARTS = DATA["articles"]
BASE = "https://aitoolspak.tech"
PUB = datetime.date.today().isoformat()
PUB_LABEL = datetime.date.today().strftime("%B %-d, %Y")

def esc(s): return html.escape(s, quote=True)

def md(s):
    """Convert markdown [text](url) to <a> tags (escaped first)."""
    s = esc(s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2" rel="noopener">\1</a>', s)
    return s

def header():
    return """<header class="simple-header">
      <nav class="simple-nav" aria-label="Primary navigation">
        <a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <div class="simple-links">
          <a href="../../#product-guides">Products</a>
          <a href="../../blog/" aria-current="page">Blog</a>
          <a href="../../about-us/">About</a>
          <a href="../../contact-us/">Contact</a>
          <a href="../../frequently-asked-questions/">FAQ</a>
        </div>
      </nav>
    </header>"""

def footer():
    return """<footer class="footer" role="contentinfo">
      <div>
        <a class="brand" href="../../"><img class="brand-logo" src="../../logo.png" alt="AI Tools Pak" width="32" height="32"><span>AI Tools Pak</span></a>
        <p>Business name: AI Tools Pak<br>WhatsApp: +92 371 454 9245<br>Email: support@aitoolspak.com<br>Support: 11:00 AM - 11:00 PM Pakistan time</p>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="../../#product-guides">Products</a>
        <a href="../../blog/">Blog</a>
        <a href="../../about-us/">About</a>
        <a href="../../contact-us/">Contact</a>
        <a href="../../privacy-policy/">Privacy</a>
        <a href="../../terms-and-conditions/">Terms</a>
        <a href="../../refund-policy/">Refunds</a>
        <a href="../../delivery-policy/">Delivery</a>
        <a href="../../frequently-asked-questions/">FAQ</a>
      </nav>
    </footer>"""

def head(title, desc, url, schema):
    s = f"""<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{esc(title)} | AI Tools Pak</title>
    <meta name="description" content="{esc(desc)}">
    <meta name="author" content="AI Tools Pak">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://www.gstatic.com; connect-src 'self'; form-action 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#202a36">
    <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{esc(url)}">
    <meta property="og:locale" content="en_PK">
    <meta property="og:title" content="{esc(title)} | AI Tools Pak">
    <meta property="og:description" content="{esc(desc)}">
    <meta property="og:image" content="{esc(url)}cover.svg">
    <meta property="og:image:type" content="image/svg+xml">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="AI Tools Pak">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{esc(title)} | AI Tools Pak">
    <meta name="twitter:description" content="{esc(desc)}">
    <meta name="twitter:image" content="{esc(url)}cover.svg">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="canonical" href="{esc(url)}">
  </head>
  <body>
"""
    for sch in schema:
        s += '    <script type="application/ld+json">' + json.dumps(sch, ensure_ascii=False) + "</script>\n"
    return s

def blocks_html(blocks):
    out = []
    for b in blocks:
        for k, v in b.items():
            if k == "p":
                out.append(f"<p>{md(v)}</p>")
            elif k == "ul":
                out.append("<ul>" + "".join(f"<li>{md(x)}</li>" for x in v) + "</ul>")
            elif k == "ol":
                out.append("<ol>" + "".join(f"<li>{md(x)}</li>" for x in v) + "</ol>")
            elif k == "quote":
                out.append(f"<blockquote>{md(v)}</blockquote>")
            elif k == "table":
                th = "".join(f"<th>{esc(h)}</th>" for h in v["head"])
                tr = "".join("<tr>" + "".join(f"<td>{md(x)}</td>" for x in row) + "</tr>" for row in v["rows"])
                out.append(f'<table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>')
    return "\n          ".join(out)

def page(a):
    slug = a["slug"]
    url = f"{BASE}/blog/{slug}/"
    body_parts = []
    for s in a["sections"]:
        body_parts.append(f"<h2>{esc(s['h2'])}</h2>")
        body_parts.append(blocks_html(s["blocks"]))
    # DEEPER DIVE
    dd = a.get("deepDive", [])
    if dd:
        body_parts.append("<h2>DEEPER DIVE</h2>")
        body_parts.append("<ul>" + "".join(f'<li><a href="{esc(d["url"])}" rel="noopener noreferrer" target="_blank">{esc(d["label"])}</a></li>' for d in dd) + "</ul>")
    # FAQ
    faq = a.get("faq", [])
    if faq:
        body_parts.append("<h2>Frequently asked questions</h2>")
        for item in faq:
            body_parts.append(f"<p><strong>{esc(item['q'])}</strong><br>{md(item['a'])}</p>")
    # Related pages
    body_parts.append("<h2>Related pages</h2>")
    body_parts.append("""<ul>
<li><a href="../../enterprise-ai-api-credits/">Enterprise AI API Credits in Pakistan</a></li>
<li><a href="../../ai-automation-services/">AI Automation Services in Pakistan</a></li>
<li><a href="../../#product-guides">All AI tool subscriptions with PKR prices</a></li>
<li><a href="../">More AI news and guides</a></li>
</ul>""")
    body = "\n          ".join(body_parts)
    article_schema = {
        "@context": "https://schema.org", "@type": "Article",
        "headline": a["title"],
        "description": a["meta"],
        "image": url + "cover.svg",
        "datePublished": a["date"],
        "dateModified": a["date"],
        "author": {"@type": "Organization", "name": "AI Tools Pak"},
        "publisher": {"@type": "Organization", "name": "AI Tools Pak", "logo": {"@type": "ImageObject", "url": BASE + "/og-image.png"}},
        "mainEntityOfPage": url,
        "articleSection": "AI News",
    }
    web_schema = {
        "@context": "https://schema.org", "@type": "WebPage",
        "@id": url + "#webpage", "url": url,
        "name": f"{a['title']} | AI Tools Pak",
        "description": a["meta"],
        "isPartOf": {"@id": BASE + "/#website"},
        "about": {"@id": BASE + "/#organization"},
        "reviewedBy": {"@id": BASE + "/#organization"},
        "dateModified": a["date"], "inLanguage": "en-PK",
    }
    faq_schema = {"@context": "https://schema.org", "@type": "FAQPage",
                  "mainEntity": [{"@type": "Question", "name": item["q"],
                                  "acceptedAnswer": {"@type": "Answer", "text": item["a"]}} for item in faq]}
    return (head(a["title"], a["meta"], url, [article_schema, web_schema, faq_schema])
            + header()
            + f"""<main>
      <section class="page-hero">
        <p class="page-kicker">AI News</p>
        <h1>{esc(a['title'])}</h1>
        <p class="hero-copy">{md(a['hero'])}</p>
        <p class="date-note">Published: {PUB_LABEL}, 2026. News date: {esc(a['newsDate'])}. Reviewed by AI Tools Pak Editorial.</p>
      </section>
      <section class="page-layout">
        <article class="glass-panel page-card article-body">
          {body}
        </article>
        <aside class="page-side">
          <div class="glass-panel page-card">
            <h3>Safe buying reminder</h3>
            <p>Confirm price, duration, access model, delivery estimate and refund terms before payment. Do not share your email password.</p>
          </div>
          <div class="glass-panel page-card">
            <h3>Need help choosing?</h3>
            <p>Ask on WhatsApp and get a price and delivery answer in Pakistan time, 11:00 AM to 11:00 PM.</p>
          </div>
        </aside>
      </section>
    </main>
"""
            + footer()
            + """    <a class="floating-whatsapp" href="https://wa.me/923714549245?text=Hi%20AI%20Tools%20Pak%2C%20I%20need%20help%20choosing%20an%20AI%20tool." target="_blank" rel="noopener noreferrer" aria-label="Contact AI Tools Pak on WhatsApp">
      <span>WhatsApp</span>
    </a>
  </body>
</html>
""")

def cover_svg(a, idx):
    slug = a["slug"]
    title = a["title"]
    # wrap title into lines of ~34 chars
    words, lines, cur = title.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > 34:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur: lines.append(cur)
    if len(lines) > 5:
        lines = lines[:5]
    accents = ["#16a34a", "#22c55e", "#0ea5e9", "#f59e0b", "#a855f7"]
    accent = accents[idx % len(accents)]
    y = 250
    tspans = "".join(f'<tspan x="80" dy="{38 if i else 0}">{esc(l)}</tspan>' for i, l in enumerate(lines))
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">{esc(title)}</title>
  <desc id="desc">AI Tools Pak — AI news for Pakistan</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#202a36"/>
      <stop offset="1" stop-color="#0f1722"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{accent}"/>
      <stop offset="1" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.10">
    <path d="M0 126H1200M0 252H1200M0 378H1200M0 504H1200" stroke="#ffffff" stroke-width="1"/>
    <path d="M150 0V630M300 0V630M450 0V630M600 0V630M750 0V630M900 0V630M1050 0V630" stroke="#ffffff" stroke-width="1"/>
  </g>
  <circle cx="1050" cy="120" r="160" fill="{accent}" opacity="0.12"/>
  <circle cx="1080" cy="150" r="90" fill="#16a34a" opacity="0.10"/>
  <rect x="80" y="84" width="150" height="10" rx="5" fill="url(#bar)"/>
  <text x="80" y="150" fill="#16a34a" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="4">AI NEWS</text>
  <text x="80" y="{y}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800" letter-spacing="-1">{tspans}</text>
  <text x="80" y="520" fill="#8b949e" font-family="Inter, Arial, sans-serif" font-size="24">AI TOOLS PAK</text>
  <text x="80" y="556" fill="#5b6570" font-family="Inter, Arial, sans-serif" font-size="20">AI news, tools and prices for Pakistan · aitoolspak.tech</text>
</svg>
"""

def main():
    os.makedirs(os.path.join(ROOT, "blog"), exist_ok=True)
    cards, blogposting = [], []
    for idx, a in enumerate(sorted(ARTS, key=lambda x: x["date"], reverse=True)):
        slug = a["slug"]
        d = os.path.join(ROOT, "blog", slug)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w") as f:
            f.write(page(a))
        with open(os.path.join(d, "cover.svg"), "w") as f:
            f.write(cover_svg(a, idx))
        url = f"{BASE}/blog/{slug}/"
        cards.append(f"""            <li class="post-card">
              <h3><a href="{slug}/">{esc(a['title'])}</a></h3>
              <p>{esc(a['meta'])}</p>
              <p class="date-note">Published: {PUB_LABEL}, 2026. News date: {esc(a['newsDate'])}.</p>
            </li>""")
        blogposting.append(f"""    {{
      "@type": "BlogPosting",
      "headline": {json.dumps(a['title'])},
      "url": "{url}",
      "datePublished": "{a['date']}",
      "dateModified": "{a['date']}"
    }}""")
        print(f"generated blog/{slug}/")
    with open(os.path.join(ROOT, "blog", "_news-cards.html"), "w") as f:
        f.write("\n".join(cards) + "\n")
    with open(os.path.join(ROOT, "blog", "_news-blogposting.json"), "w") as f:
        f.write(",\n".join(blogposting) + "\n")
    print(f"OK: {len(ARTS)} articles, cards + blogposting fragments written")

if __name__ == "__main__":
    main()
