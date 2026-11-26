'use strict';

const Database = require('better-sqlite3');

const db = new Database('server/tikguard.db');

db.exec(`
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

const insert = db.prepare(`
  INSERT INTO activity_log (username, action, details)
  VALUES (?, ?, ?)
`);

function record(username, action, details = '') {
  if (!username || !action) {
    throw new Error('Username and action are required');
  }

  return insert.run(username, action, details);
}

function latest(limit = 20) {
  return db.prepare(`
    SELECT id, username, action, details, created_at
    FROM activity_log
    ORDER BY id DESC
    LIMIT ?
  `).all(limit);
}

if (require.main === module) {
  record('system', 'monitoring_started', 'Activity log initialized');

  console.log('===== ACTIVITY LOG =====');
  console.log(latest());
  console.log('Activity log ready.');
  db.close();
}

module.exports = { record, latest };
