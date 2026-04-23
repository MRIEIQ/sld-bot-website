import requests
import json
from datetime import datetime, timezone

# هنا نضع رابط الفحص المباشر للبوت
BOT_HEALTH_URL = "http://185.206.149.12:8071/health"

def fmt_uptime(seconds):
    s = int(seconds)
    d = s // 86400
    h = (s % 86400) // 3600
    m = (s % 3600) // 60
    if d > 0:   return f"{d}d {h}h {m}m"
    elif h > 0: return f"{h}h {m}m"
    elif m > 0: return f"{m}m"
    else:       return "Starting..."

now_iso = datetime.now(timezone.utc).isoformat()

print(f"🔗 Checking Bot Health: {BOT_HEALTH_URL}")

try:
    r = requests.get(BOT_HEALTH_URL, timeout=10)
    r.raise_for_status()
    data = r.json()
    
    uptime_s = data.get("uptime", 0)
    
    status = {
        "online": True,
        "uptime_display": fmt_uptime(uptime_s),
        "last_updated": now_iso
    }
    print(f"✅ Bot is Online! Uptime: {status['uptime_display']}")

except Exception as e:
    print(f"❌ Bot is Offline or Health Check failed: {e}")
    status = {
        "online": False,
        "uptime_display": "Offline",
        "last_updated": now_iso
    }

# حفظ البيانات للموقع
with open("status.json", "w") as f:
    json.dump(status, f, indent=2)

print("\n📄 status.json updated successfully.")
