'use strict';

const fs = require('fs');
const Database = require('better-sqlite3');

console.log('================================');
console.log(' TikGuard Hub V14 SAFE AUDIT');
console.log('================================');

const files = [
  'server/index.js',
  'server/create-admin.js',
  'public/index.html',
  'package.json',
  'server/tikguard.db'
];

console.log('\n[1] Files');
for (const file of files) {
  console.log(`${fs.existsSync(file) ? 'OK' : 'MISSING'}: ${file}`);
}

console.log('\n[2] Database integrity');
if (fs.existsSync('server/tikguard.db')) {
  const db = new Database('server/tikguard.db', { readonly: true });
  try {
    console.log(db.pragma('integrity_check'));

    console.log('\n[3] Tables');
    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `).all();
    console.log(tables.map(t => t.name));

    console.log('\n[4] Task schema');
    const exists = tables.some(t => t.name === 'tasks');
    if (exists) {
      console.log(db.prepare('PRAGMA table_info(tasks)').all()
        .map(c => ({
          name: c.name,
          type: c.type,
          notnull: c.notnull
        })));
      console.log('Task count:', db.prepare('SELECT COUNT(*) AS n FROM tasks').get().n);
    } else {
      console.log('Tasks table missing');
    }

    console.log('\n[5] User account summary');
    if (tables.some(t => t.name === 'users')) {
      console.log(db.prepare(`
        SELECT role, COUNT(*) AS count
        FROM users
        GROUP BY role
      `).all());
    }
  } finally {
    db.close();
  }
} else {
  console.log('Database not found; no changes made.');
}

console.log('\n[6] Audit complete. No data was modified.');
