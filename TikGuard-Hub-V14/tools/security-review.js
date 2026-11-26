'use strict';

const fs = require('fs');
const path = require('path');

const files = [
  'server/index.js',
  'server/create-admin.js',
  'public/index.html'
];

const rules = [
  {
    name: 'Dynamic eval',
    pattern: /\beval\s*\(/,
    level: 'REVIEW'
  },
  {
    name: 'Dynamic Function constructor',
    pattern: /\bnew\s+Function\s*\(/,
    level: 'REVIEW'
  },
  {
    name: 'Potential shell execution',
    pattern: /\bexecSync\s*\(|\bexec\s*\(|\bspawn\s*\(/,
    level: 'REVIEW'
  },
  {
    name: 'Potential unsafe HTML injection',
    pattern: /\.innerHTML\s*=/,
    level: 'REVIEW'
  },
  {
    name: 'JWT hardcoded secret candidate',
    pattern: /jwt\.sign\s*\([^]*,\s*['"`][^'"`]+['"`]/,
    level: 'REVIEW'
  },
  {
    name: 'SQL template literal candidate',
    pattern: /\.(?:prepare|get|all|run)\s*\(\s*`/,
    level: 'REVIEW'
  },
  {
    name: 'Wildcard CORS candidate',
    pattern: /origin\s*:\s*['"`]\*['"`]/,
    level: 'REVIEW'
  },
  {
    name: 'Sensitive logging candidate',
    pattern: /console\.(?:log|info|debug)\s*\([^)]*(?:password|token|secret)/i,
    level: 'REVIEW'
  }
];

let total = 0;

console.log('=== TikGuard Hub V14 Security Review ===');

for (const file of files) {
  const full = path.resolve(file);

  if (!fs.existsSync(full)) {
    console.log(`\n[SKIP] ${file} - not found`);
    continue;
  }

  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  console.log(`\n--- ${file} ---`);

  let fileFindings = 0;

  for (let i = 0; i < lines.length; i++) {
    for (const rule of rules) {
      if (rule.pattern.test(lines[i])) {
        console.log(
          `[${rule.level}] ${rule.name} - line ${i + 1}`
        );
        fileFindings++;
        total++;
      }
    }
  }

  if (!fileFindings) {
    console.log('No heuristic matches.');
  }
}

console.log('\n=== SUMMARY ===');
console.log(`Review indicators found: ${total}`);
console.log('These are heuristic matches, not confirmed vulnerabilities.');
console.log('Manual code review and functional security tests are still required.');
