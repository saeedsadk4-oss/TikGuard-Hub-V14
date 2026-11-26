'use strict';

const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('server/tikguard.db', {
  readonly: true
});

const tables = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
`).all().map(x => x.name);

function count(table) {
  if (!tables.includes(table)) return 'غير متاح';

  return db.prepare(
    `SELECT COUNT(*) AS total FROM "${table}"`
  ).get().total;
}

const report = {
  project: 'TikGuard Hub',
  version: 'V14',
  generated_at: new Date().toISOString(),
  statistics: {
    users: count('users'),
    tasks: count('tasks'),
    content: count('content')
  },
  database_integrity: db.pragma('integrity_check')
};

db.close();

const filename =
  `reports/report-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;

fs.writeFileSync(
  filename,
  JSON.stringify(report, null, 2),
  'utf8'
);

console.log('===== DAILY REPORT =====');
console.log(JSON.stringify(report, null, 2));
console.log('\nSaved:', filename);
