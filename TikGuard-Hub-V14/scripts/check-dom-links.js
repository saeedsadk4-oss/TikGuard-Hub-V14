'use strict';

const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');

const ids = new Set(
  [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1])
);

const references = [
  ...html.matchAll(
    /(?:getElementById|querySelector)\s*\(\s*['"]#?([^'" )]+)['"]\s*\)/g
  )
].map(m => m[1].replace(/^#/, ''));

const missing = [...new Set(references)].filter(id => !ids.has(id));

console.log('=== DOM LINK AUDIT ===');
console.log('IDs found:', ids.size);
console.log('References found:', references.length);
console.log('Missing references:', missing.length);

if (missing.length) {
  missing.forEach(id => console.log('MISSING:', id));
  process.exitCode = 1;
} else {
  console.log('All statically detected DOM references exist.');
}
