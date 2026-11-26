'use strict';

const fs = require('fs');

const file = 'public/index.html';

if (!fs.existsSync(file)) {
  console.error('ERROR: public/index.html not found');
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf8');

console.log('===================================');
console.log(' TikGuard Hub V14 - UI AUDIT');
console.log('===================================');

console.log('\n[1] Forms');
const forms = [...html.matchAll(/<form\b[^>]*>/gi)];
forms.forEach((m, i) => console.log(`${i + 1}. ${m[0]}`));
console.log('Total forms:', forms.length);

console.log('\n[2] Buttons');
const buttons = [...html.matchAll(/<button\b[^>]*>/gi)];
buttons.forEach((m, i) => console.log(`${i + 1}. ${m[0]}`));
console.log('Total buttons:', buttons.length);

console.log('\n[3] IDs');
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)]
  .map(m => m[1]);

const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log('Total IDs:', ids.length);
console.log('Duplicate IDs:', [...new Set(duplicateIds)]);

console.log('\n[4] API routes');
const routes = [...new Set(
  [...html.matchAll(/['"`](\/api\/[^'"`\s]*)['"`]/g)]
    .map(m => m[1])
)];
routes.forEach(route => console.log(route));
console.log('Total detected routes:', routes.length);

console.log('\n[5] Event listeners');
const listeners = [...html.matchAll(/addEventListener\s*\(\s*['"]([^'"]+)['"]/g)]
  .map(m => m[1]);
console.log([...new Set(listeners)]);

console.log('\n[6] Inline event handlers');
const inlineEvents = [...html.matchAll(/\bon(?:click|submit|change|input)\s*=/gi)]
  .map(m => m[0]);
console.log('Total inline event handlers:', inlineEvents.length);

console.log('\n[7] Script blocks');
console.log('Script tags:', (html.match(/<script\b/gi) || []).length);
console.log('External script tags:', (html.match(/<script\b[^>]*\bsrc=/gi) || []).length);

console.log('\n===================================');
console.log(' UI AUDIT FINISHED');
console.log(' This report does not modify files.');
console.log('===================================');
