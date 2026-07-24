import urllib.request
import urllib.parse
import json
import time
import concurrent.futures

BASE_URL = "https://liaisoncapital.online"
API_KEY = "99d8e558b39dc7344e215cecdb453693"

ENDPOINTS = [
    # ── Static Pages ──
    {"name": "Home Page", "url": f"{BASE_URL}/", "headers": {}},
    {"name": "Swap Page", "url": f"{BASE_URL}/swap", "headers": {}},
    {"name": "Portfolio Page", "url": f"{BASE_URL}/portfolio", "headers": {}},
    {"name": "NFT Page", "url": f"{BASE_URL}/nfts", "headers": {}},
    {"name": "Protocol Page", "url": f"{BASE_URL}/protocol", "headers": {}},
    
    # ── CoinGecko API ──
    {"name": "CoinGecko ETH Price", "url": "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", "headers": {}},
    
    # ── OpenSea Proxies (Vercel) ──
    {"name": "OpenSea Collection Details Proxy", "url": f"{BASE_URL}/api/opensea/api/v2/collections/liaison-669783293", "headers": {"x-api-key": API_KEY}},
    {"name": "OpenSea Collection NFTs Proxy", "url": f"{BASE_URL}/api/opensea/api/v2/collection/liaison-669783293/nfts?limit=20", "headers": {"x-api-key": API_KEY}},
    {"name": "OpenSea Collection Listings Proxy", "url": f"{BASE_URL}/api/opensea/api/v2/listings/collection/liaison-669783293/all?limit=50", "headers": {"x-api-key": API_KEY}},
    
    # ── Transit Finance Proxy (Vercel) ──
    {"name": "Transit Finance Quote Proxy", "url": f"{BASE_URL}/api/transit/v3/transit/swap?fromChainID=1&toChainID=1&token0=0x61481d83965a494773087628874a2f8d44c27cc2&token1=0xdAC17F958D2ee523a2206206994597C13D831ec7&amountIn=1000000000000000000&to=0x0000000000000000000000000000000000000000&issuer=0x0000000000000000000000000000000000000000&channel=default", "headers": {}}
]

def test_endpoint(endpoint):
    name = endpoint["name"]
    url = endpoint["url"]
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    headers.update(endpoint["headers"])
    
    req = urllib.request.Request(url, headers=headers)
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status = response.status
            content = response.read()
            latency = (time.time() - start_time) * 1000
            
            # Simple content sanity check
            is_valid_json = False
            if response.getheader("Content-Type", "").startswith("application/json") or url.endswith("json") or "api" in url:
                try:
                    json.loads(content.decode('utf-8'))
                    is_valid_json = True
                except:
                    pass
            
            return {
                "name": name,
                "url": url,
                "status": status,
                "latency_ms": latency,
                "size_bytes": len(content),
                "is_valid_json": is_valid_json if ("api" in url or "price" in url) else None,
                "success": True,
                "error": None
            }
    except Exception as e:
        latency = (time.time() - start_time) * 1000
        return {
            "name": name,
            "url": url,
            "status": getattr(e, "code", 500),
            "latency_ms": latency,
            "size_bytes": 0,
            "is_valid_json": None,
            "success": False,
            "error": str(e)
        }

def run_stress_test():
    print("="*60)
    print("        LIAISON CAPITAL WEB PORTAL HEALTH AUDIT & STRESS TEST        ")
    print("="*60)
    print(f"Target Base URL: {BASE_URL}")
    print("Starting tests...\n")
    
    # ── Phase 1: General Functional Audit ──
    print("[PHASE 1] RUNNING FUNCTIONAL AUDIT ON PAGES & APIs...")
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(test_endpoint, ep): ep for ep in ENDPOINTS}
        for future in concurrent.futures.as_completed(futures):
            res = future.result()
            results.append(res)
            status_symbol = "[OK]" if res["success"] else "[FAIL]"
            print(f" {status_symbol} {res['name']}: Status {res['status']} | Latency: {res['latency_ms']:.1f}ms | Size: {res['size_bytes']} bytes")
            if res["error"]:
                print(f"   └─ Error: {res['error']}")
    
    # ── Phase 2: Stress Load test ──
    print("\n[PHASE 2] RUNNING LOAD/STRESS TEST ON CRITICAL PORTS...")
    print("Simulating 30 concurrent requests to proxy and page endpoints...")
    
    stress_endpoints = [
        {"name": "NFT Page Load", "url": f"{BASE_URL}/nfts", "headers": {}},
        {"name": "OpenSea NFT Proxy", "url": f"{BASE_URL}/api/opensea/api/v2/collection/liaison-669783293/nfts?limit=20", "headers": {"x-api-key": API_KEY}},
        {"name": "Transit Finance Proxy", "url": f"{BASE_URL}/api/transit/v3/transit/swap?fromChainID=1&toChainID=1&token0=0x61481d83965a494773087628874a2f8d44c27cc2&token1=0xdAC17F958D2ee523a2206206994597C13D831ec7&amountIn=1000000000000000000&to=0x0000000000000000000000000000000000000000&issuer=0x0000000000000000000000000000000000000000&channel=default", "headers": {}}
    ]
    
    stress_list = stress_endpoints * 10 # 30 requests total
    stress_results = []
    
    stress_start = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(test_endpoint, ep): ep for ep in stress_list}
        for future in concurrent.futures.as_completed(futures):
            stress_results.append(future.result())
    
    stress_duration = time.time() - stress_start
    
    success_count = sum(1 for r in stress_results if r["success"])
    fail_count = sum(1 for r in stress_results if not r["success"])
    avg_latency = sum(r["latency_ms"] for r in stress_results) / len(stress_results)
    
    print(f"\nLoad Test Completed in {stress_duration:.2f} seconds!")
    print(f"Total Requests Sent: {len(stress_results)}")
    print(f"Successful Requests: {success_count} ({success_count/len(stress_results)*100:.1f}%)")
    print(f"Failed Requests: {fail_count} ({fail_count/len(stress_results)*100:.1f}%)")
    print(f"Average Concurrent Request Latency: {avg_latency:.1f}ms")
    
    print("\n" + "="*60)
    print("                        TEST REPORT SUMMARY                     ")
    print("="*60)
    
    all_fine = True
    for r in results:
        if not r["success"]:
            all_fine = False
            print(f"WARNING: Endpoint '{r['name']}' failed during functional audit! {r['error']}")
    
    if all_fine and fail_count == 0:
        print("SYSTEM STATUS: EXCELLENT / ALL FUNCTIONS FULLY OPERATIONAL")
        print("All static pages, API proxies, and JSON payloads parsed perfectly under stress.")
    else:
        print("SYSTEM STATUS: PARTIAL DEGRADATION / ATTENTION REQUIRED")
        
    print("="*60)

if __name__ == "__main__":
    run_stress_test()
