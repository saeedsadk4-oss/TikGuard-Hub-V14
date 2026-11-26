#!/data/data/com.termux/files/usr/bin/bash

ROOT="$HOME/TikGuard-Hub-V14"
LOG="$ROOT/logs/monitor.log"
URL="http://127.0.0.1:3000/api/health"

mkdir -p "$ROOT/logs"

stamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

echo "================================"
echo " TikGuard V14 System Monitor"
echo "================================"

if curl -fsS --max-time 5 "$URL" -o "$ROOT/logs/health-response.json"; then
  echo "[$(stamp)] API: ONLINE" | tee -a "$LOG"
  echo "Response:"
  cat "$ROOT/logs/health-response.json"
  echo
else
  echo "[$(stamp)] API: OFFLINE" | tee -a "$LOG"
fi

if [ -f "$ROOT/server/tikguard.db" ]; then
  echo "[$(stamp)] DATABASE: EXISTS" | tee -a "$LOG"
  ls -lh "$ROOT/server/tikguard.db"
else
  echo "[$(stamp)] DATABASE: MISSING" | tee -a "$LOG"
fi

echo
echo "Recent monitor history:"
tail -15 "$LOG" 2>/dev/null

echo
echo "Monitor complete."
