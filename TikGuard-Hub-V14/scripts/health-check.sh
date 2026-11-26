#!/data/data/com.termux/files/usr/bin/bash

echo "================================"
echo " TikGuard Hub V14 Health Check"
echo "================================"

echo ""
echo "[1] Project directory"
pwd

echo ""
echo "[2] Node version"
node -v

echo ""
echo "[3] npm version"
npm -v

echo ""
echo "[4] Project files"
ls -la

echo ""
echo "[5] Server syntax"
node --check server/index.js

echo ""
echo "[6] Admin script syntax"
node --check server/create-admin.js

echo ""
echo "[7] Client syntax"
node tests/syntax-client.js

echo ""
echo "[8] Health endpoint"
curl -sS --max-time 5 http://127.0.0.1:3000/api/health || echo "Server is not responding"

echo ""
echo "================================"
echo " Health Check Finished"
echo "================================"
