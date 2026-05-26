import urllib.request
import re

url = "https://liaisoncapital.online/nfts"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print("Fetched HTML successfully!")
        
        # Find index.js
        match = re.search(r'src="(/assets/index-.*?\.js)"', html)
        if match:
            js_path = match.group(1)
            js_url = f"https://liaisoncapital.online{js_path}"
            print(f"Found JS: {js_url}")
            
            js_req = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(js_req) as js_response:
                js_content = js_response.read().decode('utf-8')
                print("Fetched JS successfully!")
                
                # Check for the key
                key = "99d8e558b39dc7344e215cecdb453693"
                if key in js_content:
                    print("SUCCESS: The key is in the live JS bundle!")
                else:
                    print("FAILURE: The key is NOT in the live JS bundle. Old build is running.")
        else:
            print("Could not find index JS in HTML!")
except Exception as e:
    print(f"Error: {e}")
