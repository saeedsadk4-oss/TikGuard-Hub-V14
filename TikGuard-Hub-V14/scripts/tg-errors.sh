#!/data/data/com.termux/files/usr/bin/bash

ROOT="$HOME/TikGuard-Hub-V14"

echo "===== TikGuard Error Review ====="

if [ -f "$ROOT/logs/server.log" ]; then
  echo "===== SERVER ERRORS ====="
  grep -inE 'error|exception|failed|fatal' \
    "$ROOT/logs/server.log" | tail -30 || true
else
  echo "No server.log found."
fi

echo
echo "===== MONITOR LOG ====="
if [ -f "$ROOT/logs/monitor.log" ]; then
  tail -30 "$ROOT/logs/monitor.log"
else
  echo "No monitor log found."
fi

echo
echo "===== TEST STATUS ====="
cd "$ROOT" || exit 1
npm test
