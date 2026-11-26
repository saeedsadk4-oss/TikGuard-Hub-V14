#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/TikGuard-Hub-V14" || exit 1

PIDFILE="$HOME/TikGuard-Hub-V14/server.pid"

echo "=== TikGuard Hub V14 Status ==="

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "Process: RUNNING"
    echo "PID: $PID"
  else
    echo "Process: STOPPED (stale PID)"
  fi
else
  echo "Process: UNKNOWN (no PID file)"
fi

echo ""
echo "=== API Health ==="
curl -sS --max-time 3 http://127.0.0.1:3000/api/health || echo "API unavailable"

echo ""
echo "=== Port 3000 ==="
ss -ltn 2>/dev/null | grep ':3000' || echo "Port not listening"

echo ""
echo "=== Recent Logs ==="
tail -n 15 logs/server.log 2>/dev/null || echo "No log file"
