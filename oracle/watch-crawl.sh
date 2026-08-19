#!/bin/bash
# Competitor watch crawler — evidence for scoreboard updates. Read-only.
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
OUT=/tmp/watch-$(date +%Y%m%d)
mkdir -p "$OUT"

crawl() {
  name="$1"; url="$2"
  f="$OUT/$name"
  # homepage
  curl -sL -A "$UA" --max-time 20 -o "$f.html" -w "%{http_code}" "$url" > "$f.status" 2>/dev/null
  # title
  grep -o '<title[^>]*>[^<]*<' "$f.html" | sed -e 's/^<title[^>]*>//' -e 's/<.*$//' | head -1 > "$f.title" 2>/dev/null
  # schema types
  grep -oP '"@type"\s*:\s*"?\[?[^\]",}]+' "$f.html" | tr -d '"@type: []' | sort | uniq -c | sort -rn > "$f.schema" 2>/dev/null
  # wa.me count
  grep -o 'wa\.me' "$f.html" 2>/dev/null | wc -l > "$f.wame"
  # internal links (href count)
  grep -oP 'href="[^"]+"' "$f.html" 2>/dev/null | wc -l > "$f.links"
  # price mentions (PKR / Rs. / ₨)
  grep -oiP '(rs\.?|pkr|₨)\s?\d[\d,.]*' "$f.html" 2>/dev/null | wc -l > "$f.prices"
  # llms.txt
  ll=$(curl -s -A "$UA" --max-time 15 -o "$f.llms" -w "%{http_code}" "$url/llms.txt" 2>/dev/null)
  ls=$(stat -c%s "$f.llms" 2>/dev/null || echo 0)
  echo "$ll $ls" > "$f.llmsstatus"
  # llms-full.txt
  lf=$(curl -s -A "$UA" --max-time 15 -o "$f.llmsfull" -w "%{http_code}" "$url/llms-full.txt" 2>/dev/null)
  lfs=$(stat -c%s "$f.llmsfull" 2>/dev/null || echo 0)
  echo "$lf $lfs" > "$f.llmsfullstatus"
  # sitemap.xml
  sm=$(curl -s -A "$UA" --max-time 15 -o "$f.sitemap" -w "%{http_code}" "$url/sitemap.xml" 2>/dev/null)
  st=$(file -b --mime-type "$f.sitemap" 2>/dev/null)
  locs=$(grep -o '<loc>' "$f.sitemap" 2>/dev/null | wc -l)
  echo "$sm $st locs=$locs $(stat -c%s "$f.sitemap" 2>/dev/null || echo 0)" > "$f.sitemapstatus"
  echo "done: $name"
}

export -f crawl
export UA OUT
crawl us https://aitoolspak.tech &
crawl aisp https://aitoolspakistan.pro &
crawl apt https://allpremiumtools.com &
crawl dtt https://digitaltools.com.pk &
crawl digiskool https://digiskool.pk &
crawl aiwala https://aiwala.pk &
wait
echo "ALL DONE"