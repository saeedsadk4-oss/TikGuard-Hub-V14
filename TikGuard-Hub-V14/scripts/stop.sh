#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/TikGuard-Hub-V14" || exit 1

PIDFILE="$HOME/TikGuard-Hub-V14/server.pid"

if [ ! -f "$PIDFILE" ]; then
  echo "No PID file found."
  exit 0
fi

PID=$(cat "$PIDFILE")

if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  echo "Stop signal sent to PID: $PID"
else
  echo "Server is not running."
fi

rm -f "$PIDFILE"

if command -v termux-wake-unlock >/dev/null 2>&1; then
  termux-wake-unlock
fi
