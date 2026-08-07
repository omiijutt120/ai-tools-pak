#!/usr/bin/env python3
"""Generate deterministic, original SVG cover images for every AI Post article.
Category-based color schemes + geometric art derived from slug hash.
100% offline/free — no LLM, no API, no billing."""
import json, os, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
POST = os.path.join(os.path.dirname(ROOT), "ai-post")
COVERS = os.path.join(POST, "covers")
os.makedirs(COVERS, exist_ok=True)

DATA = json.load(open(os.path.join(POST, "content", "articles.json")))
ARTS = DATA["articles"]
CATS = {c["key"]: c for c in DATA["categories"]}

# Category color schemes: (bg1, bg2, accent, glow)
SCHEMES = {
    "ai-news":      ("#0f172a", "#1e3a8a", "#60a5fa", "#2563eb"),
    "tutorials":    ("#052e16", "#14532d", "#4ade80", "#16a34a"),
    "comparisons":  ("#2e1065", "#6d28d9", "#a78bfa", "#7c3aed"),
    "reviews":      ("#431407", "#9a3412", "#fb923c", "#ea580c"),
    "free-ai-tools":("#083344", "#155e75", "#22d3ee", "#0891b2"),
    "prompt-library":("#500724", "#9d174d", "#f472b6", "#db2777"),
}
DEFAULT = ("#0f172a", "#1e3a8a", "#60a5fa", "#2563eb")

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def wrap_title(title, max_chars=34):
    """Wrap title into lines of roughly max_chars (word-aware)."""
    words, lines, cur = title.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > max_chars and cur:
            lines.append(cur); cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur: lines.append(cur)
    return lines[:5]

def cover_svg(a):
    cat = CATS.get(a["category"], {})
    scheme = SCHEMES.get(a["category"], DEFAULT)
    bg1, bg2, accent, glow = scheme
    icon = cat.get("icon", "📄")
    h = hashlib.md5(a["slug"].encode()).hexdigest()
    seed = int(h[:8], 16)
    # deterministic pseudo-random geometric params
    r1 = 60 + seed % 120          # big circle radius
    cx = 15 + (seed >> 4) % 70    # circle x
    cy = 12 + (seed >> 8) % 55    # circle y
    rot = seed % 360
    lines_t = wrap_title(a["title"])
    n = len(lines_t)
    # typography: bigger first line, smaller rest
    y_start = 235 - n * 20
    text = ""
    for i, ln in enumerate(lines_t):
        fs = 52 if i == 0 and n > 1 else (58 if n == 1 else 34)
        text += (f'<text x="40" y="{y_start + i*44}" font-family="Inter,Arial,sans-serif" '
                 f'font-size="{fs}" font-weight="800" fill="#ffffff">{esc(ln)}</text>\n')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.8" cy="0.15" r="0.75">
    <stop offset="0" stop-color="{glow}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="{glow}" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M60 0H0V60" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
  </pattern>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<rect width="1200" height="630" fill="url(#grid)"/>
<circle cx="{cx*10}" cy="{cy*10}" r="{r1*2.2}" fill="none" stroke="{accent}" stroke-opacity="0.25" stroke-width="2.5" transform="rotate({rot} {cx*10} {cy*10})"/>
<circle cx="{1200-cx*8}" cy="{630-cy*7}" r="{r1}" fill="{accent}" fill-opacity="0.16"/>
<circle cx="{1200-cx*8}" cy="{630-cy*7}" r="{r1*0.55}" fill="{accent}" fill-opacity="0.2"/>
<rect x="40" y="34" width="52" height="52" rx="14" fill="{accent}" opacity="0.9"/>
<text x="66" y="70" font-size="30" text-anchor="middle">{"⚡" if not icon else ""}</text>
<text x="112" y="70" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700" fill="{accent}" letter-spacing="2">{esc((cat.get("label") or "ARTICLE").upper())}</text>
<text x="40" y="102" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="600" fill="#ffffff" fill-opacity="0.45" letter-spacing="3">THE AI POST</text>
{text}
<rect x="40" y="556" width="90" height="5" rx="2.5" fill="{accent}"/>
<text x="40" y="594" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="600" fill="#ffffff" fill-opacity="0.6">{esc(a["date"])} · {a["readMins"]} min read · aitoolspak.tech</text>
</svg>'''

count = 0
for a in ARTS:
    svg = cover_svg(a)
    path = os.path.join(COVERS, a["slug"] + ".svg")
    with open(path, "w") as f:
        f.write(svg)
    count += 1
print(f"Generated {count} SVG covers in {COVERS}")
