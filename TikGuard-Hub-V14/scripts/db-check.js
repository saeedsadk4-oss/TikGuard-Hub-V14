'use strict';

const Database = require('better-sqlite3');

const db = new Database('server/tikguard.db', {
  readonly: true
});

try {
  console.log('=== DATABASE CHECK ===');

  console.log('Integrity:');
  console.log(db.pragma('integrity_check'));

  console.log('\nTables:');
  console.log(
    db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name
    `).all()
  );

  console.log('\nUsers:');
  console.log(
    db.prepare('SELECT id, username, role FROM users').all()
  );

  console.log('\nTasks count:');
  const taskTable = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='tasks'
  `).get();

  if (taskTable) {
    console.log(db.prepare('SELECT COUNT(*) AS total FROM tasks').get());
    console.log(
      db.prepare('SELECT id, title, status FROM tasks LIMIT 10').all()
    );
  } else {
    console.log('Tasks table not found');
  }

  console.log('\n=== CHECK COMPLETE ===');
} finally {
  db.close();
}
