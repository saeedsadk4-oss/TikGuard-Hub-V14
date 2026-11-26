#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/TikGuard-Hub-V14" || exit 1

PIDFILE="$HOME/TikGuard-Hub-V14/server.pid"
LOGFILE="$HOME/TikGuard-Hub-V14/logs/server.log"

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "TikGuard Hub is already running. PID: $PID"
    exit 0
  fi
  rm -f "$PIDFILE"
fi

if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock
fi

nohup node server/index.js >> "$LOGFILE" 2>&1 &
PID=$!
echo "$PID" > "$PIDFILE"

sleep 2

if kill -0 "$PID" 2>/dev/null; then
  echo "TikGuard Hub started."
  echo "PID: $PID"
  echo "Log: $LOGFILE"
else
  echo "Server failed to start. Check the log:"
  tail -n 40 "$LOGFILE"
  rm -f "$PIDFILE"
  exit 1
fi
