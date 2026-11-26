import { and, eq, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getDb } from '@/src/db';
import { sessions, users } from '@/src/db/schema';
import { hashSessionToken } from './crypto';
export const sessionCookieName='saloon_session';
export async function getCurrentUser(){
 const token=(await cookies()).get(sessionCookieName)?.value;
 if(!token)return null;
 const [row]=await getDb().select({id:users.id,role:users.role,name:users.displayName,phone:users.phone,sessionId:sessions.id}).from(sessions).innerJoin(users,eq(sessions.userId,users.id)).where(and(eq(sessions.tokenHash,hashSessionToken(token)),gt(sessions.expiresAt,new Date()),eq(users.isActive,true))).limit(1);
 return row??null;
}
