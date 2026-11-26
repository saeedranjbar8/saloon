import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { Pool } from 'pg';
const io=createInterface({input:stdin,output:stdout});
const phone=(await io.question('Phone: ')).trim();
const displayName=(await io.question('Display name: ')).trim();
const role=(await io.question('Role (facility_manager/sports_administration): ')).trim();
const password=await io.question('Password (at least 12 characters): ');
io.close();
if(!phone||!displayName||!['facility_manager','sports_administration'].includes(role)||password.length<12)throw new Error('Invalid account details.');
const salt=randomBytes(16).toString('hex');
const hash=scryptSync(password,salt,64).toString('hex');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
try{const result=await pool.query('INSERT INTO users(phone,display_name,role,password_hash) VALUES($1,$2,$3,$4) RETURNING id,role',[phone,displayName,role,`scrypt:${salt}:${hash}`]);console.log(`Created ${result.rows[0].role} account ${result.rows[0].id}`);}finally{await pool.end();}

