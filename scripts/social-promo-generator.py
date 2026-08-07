#!/usr/bin/env python3
"""Generate a daily promo image for Instagram/Facebook from AI Tools Pak products."""
import json, os, re, sys
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

REPO = "/home/ubuntu/ai-tools-pak"
OUT_DIR = "/home/ubuntu/social_posts"
LOGO = os.path.join(REPO, "logo.png")
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
WA_NUMBER = "+92 371 454 9245"
SITE = "aitoolspak.tech"

BG_TOP = (43, 54, 68)
BG_BOTTOM = (22, 28, 38)
GREEN = (22, 138, 82)
GREEN_SOFT = (31, 157, 87)
WHITE = (255, 255, 255)
MUTED = (167, 176, 186)
PALE = (215, 219, 225)
LINE = (60, 72, 86)


def load_products():
    with open(os.path.join(REPO, "products-data.js"), "r", encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"window\.AI_TOOLS_PRODUCTS\s*=\s*(\[[\s\S]*?\])\s*;", src)
    if not m:
        raise SystemExit("Could not parse products-data.js")
    return json.loads(m.group(1))


def wrap(draw, text, font, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= maxw:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def make_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)
    return img


def main():
    products = load_products()
    if not products:
        raise SystemExit("No products found")

    day = datetime.now().timetuple().tm_yday
    p = products[day % len(products)]
    slug = p["slug"]
    name = p["name"]
    price = p.get("sellingPricePkr")
    old = p.get("compareAtPricePkr")
    disc = p.get("discountPercent")
    cat = p.get("category", "")
    tier = p.get("planTier", "")
    features = [f.strip() for f in (p.get("keyFeatures") or "").split(";") if f.strip()][:4]
    while len(features) < 4:
        features.append("WhatsApp order support in Pakistan")
    sku = p.get("sku", "")
    guide = p.get("guideUrl", "")

    os.makedirs(OUT_DIR, exist_ok=True)
    date_str = datetime.now().strftime("%Y-%m-%d")
    out_png = os.path.join(OUT_DIR, f"{date_str}-{slug}.png")
    out_json = os.path.join(OUT_DIR, f"{date_str}-{slug}.caption.json")

    W = H = 1080
    img = make_gradient((W, H), BG_TOP, BG_BOTTOM)
    d = ImageDraw.Draw(img)

    f_brand = ImageFont.truetype(FONT_BOLD, 46)
    f_kicker = ImageFont.truetype(FONT_BOLD, 34)
    f_name = ImageFont.truetype(FONT_BOLD, 62)
    f_chip = ImageFont.truetype(FONT_REG, 30)
    f_price = ImageFont.truetype(FONT_BOLD, 118)
    f_old = ImageFont.truetype(FONT_BOLD, 40)
    f_disc = ImageFont.truetype(FONT_BOLD, 38)
    f_h = ImageFont.truetype(FONT_BOLD, 32)
    f_body = ImageFont.truetype(FONT_REG, 32)
    f_cta = ImageFont.truetype(FONT_BOLD, 40)
    f_foot = ImageFont.truetype(FONT_BOLD, 28)

    # top bar
    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA").resize((92, 92), Image.LANCZOS)
        img.paste(logo, (60, 48), logo)
    d.text((176, 70), "AI TOOLS PAK", font=f_brand, fill=WHITE)
    d.text((176, 126), "Daily promotional post", font=f_chip, fill=MUTED)

    y = 240
    d.text((60, y), "TOOL OF THE DAY", font=f_kicker, fill=GREEN_SOFT)
    y += 60

    name_lines = wrap(d, name, f_name, W - 120)
    if len(name_lines) > 3:
        name_lines = name_lines[:3]
        name_lines[-1] = name_lines[-1][:-3] + "..."
    for ln in name_lines:
        d.text((60, y), ln, font=f_name, fill=WHITE)
        y += 76
    y += 6

    chip_txt = f"{cat}  •  {tier}".strip(" •")
    wm = 60 + d.textlength(chip_txt, font=f_chip) + 36
    d.rounded_rectangle([60, y - 6, wm, y + 44], radius=22, fill=(255, 255, 255, 26), outline=LINE, width=2)
    d.text((78, y + 4), chip_txt, font=f_chip, fill=PALE)
    y += 78

    price_txt = f"PKR {price:,}" if price else "Custom PKR price"
    d.text((60, y), price_txt, font=f_price, fill=GREEN_SOFT)
    x_end = 60 + d.textlength(price_txt, font=f_price)
    if old and disc:
        otxt = f"PKR {old:,}"
        d.text((x_end + 30, y + 20), otxt, font=f_old, fill=MUTED)
        w_old = d.textlength(otxt, font=f_old)
        d.line([(x_end + 30, y + 58), (x_end + 30 + w_old, y + 58)], fill=MUTED, width=4)
        dtxt = f"-{disc}%"
        box_w = d.textlength(dtxt, font=f_disc) + 28
        d.rounded_rectangle([x_end + 30 + w_old + 24, y + 14, x_end + 30 + w_old + 24 + box_w, y + 66], radius=20, fill=GREEN)
        d.text((x_end + 30 + w_old + 38, y + 22), dtxt, font=f_disc, fill=WHITE)
    y += 132

    d.line([(60, y), (W - 60, y)], fill=LINE, width=2)
    y += 40

    d.text((60, y), "KEY FEATURES", font=f_h, fill=GREEN_SOFT)
    y += 48
    for f in features:
        d.ellipse([76, y + 14, 86, y + 24], fill=GREEN_SOFT)
        d.text((106, y), f, font=f_body, fill=PALE)
        y += 46
    y += 16

    d.rounded_rectangle([60, y, W - 60, y + 128], radius=24, fill=GREEN)
    d.text((90, y + 18), "ORDER ON WHATSAPP", font=f_cta, fill=WHITE)
    d.text((90, y + 72), WA_NUMBER, font=f_chip, fill=(220, 255, 235))
    y += 160

    d.text((60, H - 88), SITE, font=f_foot, fill=WHITE)
    d.text((60, H - 52), f"SKU {sku}  •  {date_str}", font=f_chip, fill=MUTED)
    hs = "@ai_tools_pak"
    d.text((W - 60 - d.textlength(hs, font=f_foot), H - 88), hs, font=f_foot, fill=WHITE)
    ft = f"Full details: {SITE}/"
    d.text((W - 60 - d.textlength(ft, font=f_chip), H - 52), ft, font=f_chip, fill=MUTED)

    img.save(out_png, "PNG", optimize=True)

    draft = {
        "image": out_png,
        "product": name,
        "price_pkr": price,
        "original_price_pkr": old,
        "discount_percent": disc,
        "category": cat,
        "tier": tier,
        "features": features,
        "guide_url": f"https://{SITE}/{guide}",
        "caption_draft": (
            f"🔥 {name} — now available in Pakistan! 🇵🇰\n\n"
            f"💰 Price: PKR {price:,}" + (f" (was PKR {old:,}, save {disc}%!)" if old and disc else "") + "\n"
            f"📦 {tier} • {cat} • WhatsApp activation\n\n"
            f"✨ {features[0]}.\n\n"
            f"✅ Official pricing in PKR\n✅ Fast WhatsApp delivery\n✅ Support 11 AM – 11 PM\n\n"
            f"📲 Order now on WhatsApp: {WA_NUMBER.replace(' ', '')}\n"
            f"🌐 Full details: https://{SITE}/{guide}\n\n"
            f"#AITools #AIToolsPakistan #AIToolsInPakistan #Pakistan #Tech #" + name.replace(" ", "") + " #ChatGPT #ArtificialIntelligence #DigitalPakistan #OnlineShopping"
        ),
        "hashtags": [
            "AITools", "AIToolsPakistan", "AIToolsInPakistan", "Pakistan",
            "Tech", name.replace(" ", ""), "ArtificialIntelligence", "DigitalPakistan", "OnlineShopping",
        ],
        "keywords": ["ai tools in pakistan", "buy ai tools pakistan", f"{name.lower()} price in pakistan", "cheap ai tools pakistan", "ai tools pakistan 2026"],
    }
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(draft, f, indent=2, ensure_ascii=False)

    kb = os.path.getsize(out_png) / 1024
    print(f"IMAGE: {out_png} ({kb:.0f} KB)")
    print(f"PRODUCT: {name} | PKR {price:,} | {cat}")
    print(f"CAPTION DRAFT: {out_json}")
    print(f"GUIDE URL: https://{SITE}/{guide}")


if __name__ == "__main__":
    main()