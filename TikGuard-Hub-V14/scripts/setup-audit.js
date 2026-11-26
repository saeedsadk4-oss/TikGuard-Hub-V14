'use strict';

const Database = require('better-sqlite3');
const fs = require('fs');

const dbPath = 'server/tikguard.db';

if (!fs.existsSync(dbPath)) {
  console.error('Database not found. Aborting.');
  process.exit(1);
}

const db = new Database(dbPath);

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs(created_at);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
    ON audit_logs(user_id);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action);
  `);

  console.log('Audit table created/verified successfully.');

  const schema = db.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type='table' AND name='audit_logs'
  `).get();

  console.log(schema.sql);
} catch (error) {
  console.error('Audit setup failed:', error.message);
  process.exitCode = 1;
} finally {
  db.close();
}
