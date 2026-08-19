#!/bin/bash
# Competitor watch crawl — one site per call: $1 = URL, $2 = label
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
URL="$1"
LABEL="$2"
DIR="/tmp/cw-${LABEL}"
mkdir -p "$DIR"

echo "=== $LABEL ($URL) ==="

# Homepage
curl -sL -A "$UA" --max-time 20 "$URL" -o "$DIR/home.html" -w "home_http:%{http_code}\n" 2>/dev/null || echo "home_http:FAILED"
HOME_SIZE=$(wc -c < "$DIR/home.html" 2>/dev/null || echo 0)

# Title
TITLE=$(grep -oiP '<title[^>]*>.*?</title>' "$DIR/home.html" 2>/dev/null | head -1 | sed 's/<[^>]*>//g' | cut -c1-120)
echo "title:${TITLE:-EMPTY}"
echo "home_size:$HOME_SIZE"

# Schema types
echo -n "schema_types:"
grep -o '"@type"\s*:\s*"[^"]*"' "$DIR/home.html" 2>/dev/null | sed 's/"@type"\s*:\s*"//;s/"//' | sort | uniq -c | sort -rn | tr '\n' ';' || echo -n "NONE"
echo ""
echo -n "ldjson_blocks:"
grep -o 'application/ld+json' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "Product_schema:"
grep -o '"@type"\s*:\s*"Product"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "FAQPage_schema:"
grep -o '"@type"\s*:\s*"FAQPage"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "Organization_schema:"
grep -o '"@type"\s*:\s*"Organization"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "Person_schema:"
grep -o '"@type"\s*:\s*"Person"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "ItemList_schema:"
grep -o '"@type"\s*:\s*"ItemList"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "NewsArticle_schema:"
grep -o '"@type"\s*:\s*"NewsArticle"' "$DIR/home.html" 2>/dev/null | wc -l

# WhatsApp CTAs
echo -n "wa_me:"
grep -o "wa.me" "$DIR/home.html" 2>/dev/null | wc -l
echo -n "api_whatsapp:"
grep -o "api.whatsapp.com" "$DIR/home.html" 2>/dev/null | wc -l

# Internal links (href=)
echo -n "href_count:"
grep -o 'href="[^"]*"' "$DIR/home.html" 2>/dev/null | wc -l
echo -n "unique_hrefs:"
grep -o 'href="[^"]*"' "$DIR/home.html" 2>/dev/null | sort -u | wc -l

# PKR price mentions
echo -n "pkr_mentions:"
grep -o -iE '(PKR|Rs\.?|₨)' "$DIR/home.html" 2>/dev/null | wc -l

# llms.txt
LLMS=$(curl -sL -A "$UA" --max-time 20 -o "$DIR/llms.txt" -w "%{http_code}" "$URL/llms.txt" 2>/dev/null)
LLMS_SIZE=$(wc -c < "$DIR/llms.txt" 2>/dev/null || echo 0)
echo "llms_txt:${LLMS} size:${LLMS_SIZE}"

# llms-full.txt
LLMSF=$(curl -sL -A "$UA" --max-time 20 -o "$DIR/llms-full.txt" -w "%{http_code}" "$URL/llms-full.txt" 2>/dev/null)
LLMSF_SIZE=$(wc -c < "$DIR/llms-full.txt" 2>/dev/null || echo 0)
echo "llms_full:${LLMSF} size:${LLMSF_SIZE}"

# sitemap
SM=$(curl -sL -A "$UA" --max-time 20 -o "$DIR/sitemap.xml" -w "%{http_code}" "$URL/sitemap.xml" 2>/dev/null)
SM_TYPE=$(file -b --mime-type "$DIR/sitemap.xml" 2>/dev/null)
SM_LOCS=$(grep -o '<loc>' "$DIR/sitemap.xml" 2>/dev/null | wc -l)
echo "sitemap:${SM} type:${SM_TYPE} locs:${SM_LOCS}"

# robots.txt
RB=$(curl -sL -A "$UA" --max-time 20 -o "$DIR/robots.txt" -w "%{http_code}" "$URL/robots.txt" 2>/dev/null)
echo "robots:${RB}"
