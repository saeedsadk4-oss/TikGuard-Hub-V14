'use strict';

const Database = require('better-sqlite3');
const fs = require('fs');
const http = require('http');

const DB_PATH = 'server/tikguard.db';

function healthCheck() {
  return new Promise(resolve => {
    const req = http.get(
      'http://127.0.0.1:3000/api/health',
      res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            online: res.statusCode === 200,
            status: res.statusCode,
            response: data
          });
        });
      }
    );

    req.setTimeout(4000, () => {
      req.destroy();
      resolve({online: false, error: 'Timeout'});
    });

    req.on('error', error =>
      resolve({online: false, error: error.message})
    );
  });
}

async function main() {
  console.log('\n====== TIKGUARD HUB V14 MONITOR ======\n');

  const health = await healthCheck();
  console.log('SERVER:', health.online ? 'ONLINE' : 'OFFLINE');
  console.log('RESPONSE:', health.response || health.error || '');

  if (!fs.existsSync(DB_PATH)) {
    console.log('\nDATABASE: NOT FOUND');
    process.exitCode = 1;
    return;
  }

  const db = new Database(DB_PATH, {readonly: true});

  try {
    console.log('\nDATABASE INTEGRITY:');
    console.log(db.pragma('integrity_check'));

    console.log('\nTABLE STATISTICS:');

    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

    for (const table of tables) {
      const name = table.name;
      const count = db.prepare(
        `SELECT COUNT(*) AS total FROM "${name}"`
      ).get();

      console.log(`${name}: ${count.total}`);
    }
  } finally {
    db.close();
  }

  const stats = fs.statSync(DB_PATH);
  console.log('\nDATABASE SIZE:',
    (stats.size / 1024).toFixed(2), 'KB');

  console.log('\n====== MONITOR COMPLETE ======\n');
}

main().catch(error => {
  console.error('MONITOR ERROR:', error.message);
  process.exitCode = 1;
});
