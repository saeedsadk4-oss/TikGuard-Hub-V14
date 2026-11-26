'use strict';

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'server', 'tikguard.db');
const folder = path.join(root, 'backups');

if (!fs.existsSync(source)) {
  console.error('Database not found.');
  process.exit(1);
}

fs.mkdirSync(folder, { recursive: true });

const stamp = new Date().toISOString()
  .replace(/[:.]/g, '-');

const destination = path.join(
  folder,
  `tikguard-${stamp}.db`
);

const db = new Database(source, { readonly: true });

try {
  db.pragma('integrity_check');
  db.backup(destination).then(() => {
    const check = new Database(destination, { readonly: true });
    const result = check.pragma('integrity_check');
    check.close();

    if (result[0].integrity_check !== 'ok') {
      throw new Error('Backup integrity verification failed');
    }

    console.log('Backup created and verified:');
    console.log(destination);
  }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
} finally {
  db.close();
}
