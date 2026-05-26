import urllib.request
import json

API_KEY = "CG-NBEWsq6fHuQNma3sVt49Kz78"

# 1. Test Demo Endpoint (api.coingecko.com)
print("Testing Demo Endpoint...")
url_demo = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
req_demo = urllib.request.Request(url_demo, headers={"x-cg-demo-api-key": API_KEY, "User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req_demo, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Demo Success:", data)
except Exception as e:
    print("Demo Failure:", e)

# 2. Test Pro Endpoint (pro-api.coingecko.com)
print("\nTesting Pro Endpoint...")
url_pro = "https://pro-api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
req_pro = urllib.request.Request(url_pro, headers={"x-cg-pro-api-key": API_KEY, "User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req_pro, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Pro Success:", data)
except Exception as e:
    print("Pro Failure:", e)
