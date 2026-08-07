#!/usr/bin/env python3
"""
social-post-publish.py
Publishes a generated promo image + caption to a Facebook Page and (optionally)
an Instagram Business account via the Meta Graph API v21.0.

Credentials file: ~/.hermes/social_credentials.json
{
  "fb_page_id": "123456789",
  "fb_access_token": "EAA...",
  "ig_user_id": "987654321"        # optional: Instagram Business account id
}

Posting flow (both real and verifiable):
  1. FB: multipart upload photo to /{fb_page_id}/photos -> post id + photo URL
  2. IG: create container /{ig_user_id}/media (image_url = photo URL, caption)
         then publish /{ig_user_id}/media_publish -> media id

Exit codes: 0 = posted, 2 = credentials missing, 1 = API error
"""
import json
import os
import subprocess
import sys

CREDS = os.path.expanduser("~/.hermes/social_credentials.json")
API = "https://graph.facebook.com/v21.0"


def load_creds():
    if not os.path.exists(CREDS):
        return None
    with open(CREDS) as f:
        return json.load(f)


def curl_json(args):
    r = subprocess.run(["curl", "-s", "-m", "60", *args], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except json.JSONDecodeError:
        return {"error": {"message": f"non-JSON response: {r.stdout[:300]}"}}


def main():
    if len(sys.argv) < 3:
        print("usage: social-post-publish.py <image.png> <caption.txt|->")
        return 1

    image = sys.argv[1]
    caption = sys.argv[2] if sys.argv[2] != "-" else sys.stdin.read()
    if not os.path.exists(image):
        print(f"ERROR: image not found: {image}")
        return 1

    creds = load_creds()
    if not creds or not creds.get("fb_access_token") or not creds.get("fb_page_id"):
        print("CREDENTIALS_MISSING")
        print("No Meta credentials found. Create " + CREDS + " with:")
        print('  {"fb_page_id": "<your page id>", "fb_access_token": "<long-lived token>", "ig_user_id": "<optional instagram business id>"}')
        print("Get a token: https://developers.facebook.com/tools/explorer (permissions: pages_manage_posts, pages_read_engagement, instagram_basic, instagram_content_publish)")
        return 2

    tok = creds["fb_access_token"]
    page_id = creds["fb_page_id"]
    ig_id = creds.get("ig_user_id")

    # 1) Facebook: upload photo with caption
    fb = curl_json([
        "-F", f"source=@{image}",
        "-F", f"message={caption}",
        "-F", f"access_token={tok}",
        f"{API}/{page_id}/photos",
    ])
    if "error" in fb:
        print(f"FB_ERROR: {json.dumps(fb['error'])}")
        return 1
    fb_post_id = fb.get("id")
    print(f"FB_POSTED: post id {fb_post_id}")

    # get the hosted photo URL for IG container
    photo_url = None
    if fb_post_id:
        info = curl_json(["-F", f"access_token={tok}", f"{API}/{fb_post_id}?fields=source"])
        if not info.get("error"):
            photo_url = info.get("source")
    print(f"FB_PHOTO_URL: {photo_url}")

    # 2) Instagram: container + publish (only if ig_user_id configured)
    if ig_id:
        if not photo_url:
            print("IG_SKIPPED: no hosted photo URL (IG needs a public image_url)")
        else:
            cont = curl_json([
                "-F", f"image_url={photo_url}",
                "-F", f"caption={caption}",
                "-F", f"access_token={tok}",
                f"{API}/{ig_id}/media",
            ])
            if "error" in cont:
                print(f"IG_CONTAINER_ERROR: {json.dumps(cont['error'])}")
                return 1
            cid = cont.get("id")
            print(f"IG_CONTAINER: {cid}")
            pub = curl_json([
                "-F", f"creation_id={cid}",
                "-F", f"access_token={tok}",
                f"{API}/{ig_id}/media_publish",
            ])
            if "error" in pub:
                print(f"IG_PUBLISH_ERROR: {json.dumps(pub['error'])}")
                return 1
            print(f"IG_POSTED: media id {pub.get('id')}")
    else:
        print("IG_SKIPPED: no ig_user_id in credentials (Facebook only)")

    print("STATUS: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
