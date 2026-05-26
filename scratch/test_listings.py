import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

api_key = "99d8e558b39dc7344e215cecdb453693"
slug = "liaison-669783293"

headers = {
    "Accept": "application/json",
    "x-api-key": api_key,
    "User-Agent": "Mozilla/5.0"
}

url_listings = f"https://api.opensea.io/api/v2/listings/collection/{slug}/all?limit=5"
req = urllib.request.Request(url_listings, headers=headers)
print("Querying collection listings...")
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read()
        data = json.loads(html.decode('utf-8'))
        print("--- LISTINGS SUCCESS ---")
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"--- LISTINGS ERROR: {e} ---")
