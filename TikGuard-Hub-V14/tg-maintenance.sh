#!/data/data/com.termux/files/usr/bin/bash
set -u

cd "$HOME/TikGuard-Hub-V14" || exit 1

mkdir -p backups logs

echo "================================"
echo " TikGuard Hub V14 Maintenance"
echo "================================"

echo
echo "[1] Project version"
node -p "require('./package.json').version"

echo
echo "[2] Syntax validation"
npm run check || exit 1

echo
echo "[3] Automated tests"
npm test || exit 1

echo
echo "[4] Server health"
if curl -fsS --max-time 4 \
  http://127.0.0.1:3000/api/health; then
  echo
  echo "SERVER ONLINE"
else
  echo
  echo "SERVER OFFLINE - requires startup"
fi

echo
echo "[5] Database backup"

DB="server/tikguard.db"

if [ -f "$DB" ]; then
  BACKUP="backups/tikguard-$(date +%Y%m%d-%H%M%S).db"

  node - "$DB" "$BACKUP" <<'NODE'
const Database = require('better-sqlite3');
const [src, dst] = process.argv.slice(2);

const db = new Database(src, { readonly: true });

db.backup(dst)
  .then(() => {
    console.log('Backup completed:', dst);
    db.close();
  })
  .catch(err => {
    console.error('Backup failed:', err.message);
    db.close();
    process.exit(1);
  });
NODE

  if [ $? -ne 0 ]; then
    echo "Backup failed"
    exit 1
  fi
else
  echo "Database not found - backup skipped"
fi

echo
echo "[6] Backup files"
ls -lh backups

echo
echo "Maintenance finished."
