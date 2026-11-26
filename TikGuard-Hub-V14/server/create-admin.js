'use strict';
const Database=require('better-sqlite3');
const bcrypt=require('bcryptjs');
const readline=require('readline');
const db=new Database(__dirname+'/tikguard.db');
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','editor','reviewer','viewer')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
function ask(q){return new Promise(r=>rl.question(q,r));}
(async()=>{
 try{
  const username=(await ask('Admin username (3-60 characters): ')).trim();
  if(!/^[A-Za-z0-9._-]{3,60}$/.test(username))throw new Error('Username format invalid.');
  const password=await ask('Admin password (minimum 12 characters): ');
  if(password.length<12)throw new Error('Password must be at least 12 characters.');
  const exists=db.prepare('SELECT id FROM users WHERE username=?').get(username);
  if(exists)throw new Error('This username already exists.');
  const hash=await bcrypt.hash(password,12);
  db.prepare('INSERT INTO users(username,password_hash,role) VALUES(?,?,?)').run(username,hash,'admin');
  console.log('Administrator created. Store the password safely and sign in.');
 }catch(e){console.error(e.message);process.exitCode=1;}finally{rl.close();db.close();}
})();
