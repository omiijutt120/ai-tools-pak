import json, sys, urllib.request, urllib.parse, time

def get(url, headers=None, timeout=40):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

def psi(url, strategy):
    api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode({"url": url, "strategy": strategy})
    try:
        d = json.loads(get(api, timeout=120))
        lr = d.get("lighthouseResult", {})
        cats = lr.get("categories", {})
        audits = lr.get("audits", {})
        def score(k):
            c = cats.get(k)
            return round(c["score"] * 100) if c and c.get("score") is not None else None
        def val(k):
            a = audits.get(k, {})
            return a.get("displayValue")
        out = {
            "url": url, "strategy": strategy,
            "performance": score("performance"), "seo": score("seo"),
            "accessibility": score("accessibility"), "best_practices": score("best-practices"),
            "LCP": val("largest-contentful-paint"), "CLS": val("cumulative-layout-shift"),
            "TBT": val("total-blocking-time"), "INP": val("interaction-to-next-paint"),
            "FCP": val("first-contentful-paint"), "TTFB": val("server-response-time"),
        }
        return out
    except Exception as e:
        return {"url": url, "strategy": strategy, "error": str(e)[:200]}

def ddg(q, n=10):
    url = "https://html.duckduckgo.com/html/?" + urllib.parse.urlencode({"q": q})
    try:
        html = get(url)
        results = []
        # crude parse: result links appear as <a rel="nofollow" class="result__a" href="...">Title</a>
        import re
        for m in re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', html, re.S):
            link, title = m.group(1), re.sub(r"<[^>]+>", "", m.group(2)).strip()
            link = urllib.parse.unquote(link)
            m2 = re.search(r"uddg=([^&]+)", link)
            if m2:
                link = urllib.parse.unquote(m2.group(1))
            results.append({"title": title, "url": link})
            if len(results) >= n:
                break
        return results
    except Exception as e:
        return [{"error": str(e)[:200]}]

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "psi"
    if mode == "psi":
        for url in sys.argv[2:]:
            for strat in ["mobile", "desktop"]:
                r = psi(url, strat)
                print(json.dumps(r))
                time.sleep(1)
    elif mode == "ddg":
        q = sys.argv[2]
        for r in ddg(q):
            print(json.dumps(r))
