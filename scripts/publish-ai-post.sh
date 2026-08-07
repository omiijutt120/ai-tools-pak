#!/bin/bash
# publish-ai-post.sh — rebuild The AI Post, commit, push (main+master), IndexNow
set -e
cd /home/ubuntu/ai-tools-pak
MSG="${1:-chore: ai-post daily content update}"

python3 scripts/build-ai-post.py
git add ai-post/ sitemap.xml llms.txt
git commit -q -m "$MSG" || echo "nothing to commit"
git push -q origin main
git push -q origin main:master

# IndexNow (Bing) — submit all ai-post URLs
KEY=$(cat /tmp/indexnow_key.txt 2>/dev/null || echo "")
if [ -n "$KEY" ]; then
  python3 - <<'EOF'
import json, urllib.request, glob, re
key = open('/tmp/indexnow_key.txt').read().strip()
base = 'https://aitoolspak.tech'
urls = [base + '/ai-post/']
urls += [base + '/ai-post/' + f.split('/')[-1] for f in glob.glob('ai-post/*.html')]
urls += [base + '/ai-post/' + f.split('/')[-2] + '/' for f in glob.glob('ai-post/*/index.html')]
data = json.dumps({"host": "aitoolspak.tech", "key": key, "urlList": urls}).encode()
req = urllib.request.Request('https://api.indexnow.org/indexnow', data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
try:
    r = urllib.request.urlopen(req, timeout=30)
    print('IndexNow:', r.status, '| urls:', len(urls))
except urllib.error.HTTPError as e:
    print('IndexNow HTTP', e.code, e.read()[:200])
except Exception as e:
    print('IndexNow err:', e)
EOF
fi
echo "publish done"
