const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','public','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/);
if(!js)throw new Error('No inline script found');
new Function(js[1]);
console.log('Client script syntax OK');
