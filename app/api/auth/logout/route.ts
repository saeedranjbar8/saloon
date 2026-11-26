import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDb } from '@/src/db';
import { sessions } from '@/src/db/schema';
import { hashSessionToken } from '@/src/modules/auth/crypto';
import { sessionCookieName } from '@/src/modules/auth/session';
export async function POST(){const jar=await cookies();const token=jar.get(sessionCookieName)?.value;if(token)try{await getDb().delete(sessions).where(eq(sessions.tokenHash,hashSessionToken(token)));}catch(error){console.error('Logout session removal failed',error);}const response=NextResponse.json({ok:true});response.cookies.delete(sessionCookieName);return response;}

export const GET=POST;

