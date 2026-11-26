import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
let pool: Pool | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
 if(!database) {
  const connectionString=process.env.DATABASE_URL;
  if(!connectionString) throw new Error('DATABASE_URL is required to handle booking requests');
  pool=new Pool({connectionString});
  database=drizzle(pool,{schema});
 }
 return database;
}
export function getPool() { return pool; }
