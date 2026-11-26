'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'server/index.js',
  'server/create-admin.js',
  'public/index.html'
];

let failed = false;

console.log('\n===== TIKGUARD SECURITY AUDIT =====\n');

for (const file of files) {
  const full = path.join(root, file);

  if (!fs.existsSync(full)) {
    console.log('[FAIL] Missing:', file);
    failed = true;
    continue;
  }

  const source = fs.readFileSync(full, 'utf8');
  console.log('[OK] File exists:', file);

  if (file === 'public/index.html') {
    if (source.includes('function esc(')) {
      console.log('[OK] HTML escaping helper exists');
    } else {
      console.log('[WARN] Check HTML escaping');
    }
  }

  if (file === 'server/index.js') {
    for (const pattern of [
      /Authorization/,
      /Bearer/,
      /express\.json/
    ]) {
      if (pattern.test(source)) {
        console.log('[OK] Security-related pattern:', pattern);
      } else {
        console.log('[WARN] Review:', pattern);
      }
    }
  }
}

const pkg = require('../package.json');

console.log('\nNode scripts:');
for (const [name, command] of Object.entries(pkg.scripts || {})) {
  console.log(name + ': ' + command);
}

console.log('\nAudit result:', failed ? 'FAILED' : 'BASIC CHECK PASSED');
process.exitCode = failed ? 1 : 0;
