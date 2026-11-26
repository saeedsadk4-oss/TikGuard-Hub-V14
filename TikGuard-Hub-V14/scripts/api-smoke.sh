#!/data/data/com.termux/files/usr/bin/bash

BASE="http://127.0.0.1:3000"

echo "=== TikGuard API Smoke Test ==="

echo
echo "[1] Health endpoint"
curl -sS --max-time 5 -w "\nHTTP: %{http_code}\n" "$BASE/api/health" || echo "Health request failed"

echo
echo "[2] Home page"
curl -sS --max-time 5 -o /dev/null -w "HTTP: %{http_code}\n" "$BASE/" || echo "Home page request failed"

echo
echo "[3] Response headers"
curl -sS --max-time 5 -I "$BASE/" || echo "Header request failed"

echo
echo "[4] Listening port"
ss -ltn | grep ':3000' || echo "Port 3000 is not listening"

echo
echo "=== Smoke Test Finished ==="
