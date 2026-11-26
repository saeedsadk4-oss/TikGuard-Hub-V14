'use strict';

const fs = require('fs');

const files = [
  'server/index.js',
  'server/create-admin.js'
];

const checks = [
  {
    name: 'Request body access',
    pattern: /req\.body/g
  },
  {
    name: 'Request parameter access',
    pattern: /req\.params/g
  },
  {
    name: 'Request query access',
    pattern: /req\.query/g
  },
  {
    name: 'Length validation candidates',
    pattern: /\.length\s*(?:>|<|===|>=|<=)/g
  },
  {
    name: 'Type validation candidates',
    pattern: /typeof\s+/g
  },
  {
    name: 'SQL parameter placeholders',
    pattern: /\?/g
  },
  {
    name: 'JSON body size configuration',
    pattern: /express\.json\s*\(\s*\{[^}]*limit/g
  }
];

console.log('=== INPUT VALIDATION REVIEW ===');

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log('\n[SKIP]', file);
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');

  console.log('\nFILE:', file);

  for (const check of checks) {
    const matches = source.match(check.pattern) || [];
    console.log(`${check.name}: ${matches.length}`);
  }
}

console.log('\nReview these indicators manually.');
console.log('A match does not prove that validation is correct.');
