import json, sys, time, urllib.request, urllib.parse, websocket

def _get(url):
    with urllib.request.urlopen(url, timeout=15) as r:
        return json.loads(r.read().decode())

def cdp(ws, cid, method, params=None):
    ws.send(json.dumps({"id": cid, "method": method, "params": params or {}}))
    while True:
        m = json.loads(ws.recv())
        if m.get("id") == cid:
            return m

def page_ws():
    tabs = _get("http://127.0.0.1:9223/json")
    for t in tabs:
        if t.get("type") == "page":
            return t["webSocketDebuggerUrl"]
    raise RuntimeError("no page")

def run_serp(q, wait=5):
    ws = websocket.create_connection(page_ws(), timeout=90)
    n = 0
    cdp(ws, n:=n+1, "Page.navigate", {"url": "https://www.google.com/search?num=20&hl=en&q=" + urllib.parse.quote(q)})
    time.sleep(wait)
    cdp(ws, n:=n+1, "Runtime.enable")
    expr = ("(function(){"
            "var out=[];"
            "Array.from(document.querySelectorAll('a')).forEach(function(a){"
            "  var h=a.href||'', t=(a.innerText||'').replace(/\\s+/g,' ').trim();"
            "  if(!h.startsWith('http'))return;"
            "  if(/google\\.com\\/(search|url|service|support|intl|preferences|webmasters)|g\\.co|accounts\\.google/.test(h))return;"
            "  if(!t||t.length<10||t.indexOf('Sign in')>=0||a.querySelector('a'))return;"
            "  out.push({t:t.slice(0,130), u:h.split('&ved=')[0]});"
            "});"
            "var seen={},ded=[];"
            "out.forEach(function(r){if(!seen[r.u]){seen[r.u]=1;ded.push(r);}});"
            "return {title:document.title, results:ded.slice(0,25)};"
            "})()")
    r = cdp(ws, n:=n+1, "Runtime.evaluate", {"expression": expr, "returnByValue": True})
    ws.close()
    v = r.get("result", {}).get("result", {}).get("value")
    return v if isinstance(v, dict) else {"title": q, "results": []}

if __name__ == "__main__":
    for q in sys.argv[1:] or ["chatgpt plus price in pakistan"]:
        print("===== QUERY:", q)
        d = run_serp(q)
        print("title:", d.get("title"))
        for i, r in enumerate(d.get("results", []), 1):
            print(f"  {i}. {r.get('t')}\n     {r.get('u')}")
        time.sleep(3)