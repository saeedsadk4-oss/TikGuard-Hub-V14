'use strict';

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const username = process.env.ADMIN_USERNAME || '';
const password = process.env.ADMIN_PASSWORD || '';

if (!/^[A-Za-z0-9._-]{3,60}$/.test(username)) {
  console.error('ERROR: ADMIN_USERNAME is invalid (3-60 characters).');
  process.exit(1);
}

if (password.length < 12) {
  console.error('ERROR: ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

const db = new Database(__dirname + '/tikguard.db');

try {
  const admins = db.prepare(
    "SELECT COUNT(*) AS n FROM users WHERE role='admin'"
  ).get().n;

  if (admins > 0) {
    console.error('BLOCKED: An admin already exists. No changes made.');
    process.exitCode = 1;
  } else {
    const existing = db.prepare(
      'SELECT id FROM users WHERE username=?'
    ).get(username);

    if (existing) {
      console.error('BLOCKED: Username already exists.');
      process.exitCode = 1;
    } else {
      const hash = bcrypt.hashSync(password, 12);
      db.prepare(
        'INSERT INTO users(username,password_hash,role) VALUES(?,?,?)'
      ).run(username, hash, 'admin');

      console.log('SUCCESS: First administrator created.');
      console.log('Username:', username);
      console.log('Password is not displayed.');
    }
  }
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  db.close();
}
