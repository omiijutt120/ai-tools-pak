#!/usr/bin/env python3
"""Regenerate ALL covers at hi-res (1600x900) with better quality settings."""
import json, os, time, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
POST = os.path.join(os.path.dirname(ROOT), "ai-post")
COVERS = os.path.join(POST, "covers")
DATA = json.load(open(os.path.join(POST, "content", "articles.json")))
ARTS = DATA["articles"]

PROMPTS = {
 "whatsapp-calling-api-for-businesses": "crisp professional illustration, smartphone showing WhatsApp call interface with friendly AI robot assistant, modern business app UI, vibrant green and blue colors, sharp details, high resolution",
 "deepseek-v4-free-api-for-developers": "crisp professional illustration, developer coding on laptop with terminal showing AI API code, glowing neural network hologram above, dark theme workspace, cyan and purple glow, sharp details",
 "how-to-make-money-with-ai-2026": "crisp professional illustration, golden coins and dollar bills with glowing AI brain hologram above laptop, money growth concept, warm golden lighting, sharp details",
 "start-ai-automation-agency": "crisp professional illustration, founder building automation workflow with connected nodes and gears, robot arms assembling business process, startup office, blue and orange accents, sharp details",
 "chatgpt-side-hustles-that-pay": "crisp professional illustration, person working on laptop at coffee shop earning money online, AI chat hologram, floating coins, freelance hustle concept, warm cozy lighting, sharp details",
 "build-ai-voice-agent-for-business": "crisp professional illustration, voice assistant interface with sound waves and AI headset, call center robot agent, speech recognition waveform, teal and purple gradient, sharp details",
 "claude-vs-gpt-vs-gemini-2026": "crisp professional illustration, three AI chatbot robots facing off in comparison arena, glowing icons, split screen versus concept, blue orange and red accents, sharp details",
 "n8n-vs-zapier-review": "crisp professional illustration, workflow automation diagram with connected nodes and triggers, two automation platforms compared, gears and flowcharts, orange and blue colors, sharp details",
 "business-prompt-library": "crisp professional illustration, open book with glowing prompt commands and AI sparkles, library shelves with chat bubbles, knowledge base concept, purple and gold gradient, sharp details",
 "build-whatsapp-ai-chatbot-business": "crisp professional illustration, WhatsApp chat interface with AI chatbot replying automatically, smartphone with green chat bubbles and friendly robot, customer service automation, sharp details",
 "free-ai-tools-that-are-actually-free-2026": "crisp professional illustration, treasure chest overflowing with free AI tools icons, gift boxes and sparkles, zero dollar sign, vibrant colorful, cheerful style, sharp details",
 "amd-acquires-taalas-inference-silicon": "crisp professional photo, AMD semiconductor chip closeup with circuit board and glowing red silicon wafer, AI processor hardware, futuristic laboratory, red and dark blue tones, sharp focus",
 "cloud-llm-api-vs-local-inference": "crisp professional illustration, cloud server vs local computer comparison, split scene cloud computing vs on-premise server rack, network connections, blue and green split lighting, sharp details",
}

def gen(slug, prompt):
    url = ("https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) +
           "?width=1600&height=900&nologo=true&model=flux&enhance=true")
    out = os.path.join(COVERS, slug + ".jpg")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hermes-ops"})
        with urllib.request.urlopen(req, timeout=180) as r:
            data = r.read()
        if len(data) < 8000:
            raise ValueError(f"too small: {len(data)}B")
        with open(out, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print(f"  FAIL {slug}: {e}")
        return False

ok = fail = 0
for a in ARTS:
    slug = a["slug"]
    prompt = PROMPTS.get(slug, a["title"] + ", professional technology blog cover illustration, high resolution")
    print(f"Generating hi-res {slug}...")
    if gen(slug, prompt):
        ok += 1
    else:
        fail += 1
    time.sleep(3)

print(f"\nDone: {ok} hi-res images, {fail} failed")
