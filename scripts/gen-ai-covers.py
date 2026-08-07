#!/usr/bin/env python3
"""Generate context-related AI cover images for every AI Post article via
pollinations.ai (free, no API key, no billing). Falls back to SVG if a
generation fails. Images saved to ai-post/covers/<slug>.jpg"""
import json, os, subprocess, time, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
POST = os.path.join(os.path.dirname(ROOT), "ai-post")
COVERS = os.path.join(POST, "covers")
os.makedirs(COVERS, exist_ok=True)

DATA = json.load(open(os.path.join(POST, "content", "articles.json")))
ARTS = DATA["articles"]

# Context-specific prompts per slug — descriptive, image-generator friendly
PROMPTS = {
 "whatsapp-calling-api-for-businesses": "smartphone showing WhatsApp call interface with AI robot assistant, business communication, modern app UI mockup, vibrant blue and green colors, professional tech illustration, high detail",
 "deepseek-v4-free-api-for-developers": "developer coding on laptop with terminal showing AI API code, neural network hologram floating above, dark theme workspace, cyan and purple glow, modern tech illustration",
 "how-to-make-money-with-ai-2026": "golden coins and dollar bills with glowing AI brain hologram rising above laptop, money growth concept, warm golden lighting, professional finance illustration",
 "start-ai-automation-agency": "founder building automation workflow with connected nodes and gears, robot arms assembling business process, startup office background, blue and orange accents, professional illustration",
 "chatgpt-side-hustles-that-pay": "person working on laptop at coffee shop earning money online, ChatGPT logo hologram, coins floating, freelance hustle concept, warm cozy lighting, modern illustration",
 "build-ai-voice-agent-for-business": "voice assistant interface with sound waves and AI headset, call center agent robot, speech recognition waveform, teal and purple gradient, futuristic professional illustration",
 "claude-vs-gpt-vs-gemini-2026": "three AI chatbot logos facing off in comparison arena, robots with glowing icons, split screen versus concept, blue orange and red accents, modern tech illustration",
 "n8n-vs-zapier-review": "workflow automation diagram with connected nodes and triggers, two automation platforms compared side by side, gears and flowcharts, orange and blue colors, clean tech illustration",
 "business-prompt-library": "open book with glowing prompt commands and AI sparkles, library shelves with chat bubbles, knowledge base concept, purple and gold gradient, professional illustration",
 "build-whatsapp-ai-chatbot-business": "WhatsApp chat interface with AI chatbot replying automatically, smartphone with green chat bubbles and robot, customer service automation, green and white colors, modern illustration",
 "free-ai-tools-that-are-actually-free-2026": "treasure chest overflowing with free AI tools icons, gift boxes and sparkles, zero dollar sign, vibrant colorful illustration, generous give away concept, cheerful style",
 "amd-acquires-taalas-inference-silicon": "AMD semiconductor chip closeup with circuit board and glowing red silicon wafer, AI processor hardware, futuristic laboratory, red and dark blue tones, high-tech photography style",
 "cloud-llm-api-vs-local-inference": "cloud server vs local computer comparison, split scene with cloud computing on one side and on-premise server rack on other, network connections, blue and green split lighting, tech illustration",
}

def gen(slug, prompt):
    url = ("https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) +
           "?width=1200&height=630&nologo=true&model=flux")
    out = os.path.join(COVERS, slug + ".jpg")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hermes-ops"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
        if len(data) < 5000:
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
    prompt = PROMPTS.get(slug)
    if not prompt:
        prompt = a["title"] + ", professional technology blog cover illustration, high detail"
    print(f"Generating {slug}...")
    if gen(slug, prompt):
        ok += 1
    else:
        fail += 1
    time.sleep(2)

print(f"\nDone: {ok} images generated, {fail} failed")
