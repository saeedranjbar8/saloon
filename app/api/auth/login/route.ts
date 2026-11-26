import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDb } from '@/src/db';
import { sessions, users } from '@/src/db/schema';
import { hashSessionToken, newSessionToken, verifyPassword } from '@/src/modules/auth/crypto';
import { sessionCookieName } from '@/src/modules/auth/session';
export async function POST(request:Request){
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:'درخواست نامعتبر است.'},{status:400});}
 const phone=typeof body.phone==='string'?body.phone.trim():'';const password=typeof body.password==='string'?body.password:'';
 if(!phone||password.length<8)return NextResponse.json({error:'شمارهٔ همراه و رمز عبور معتبر وارد کن.'},{status:400});
 try{
  const db=getDb();const [user]=await db.select().from(users).where(and(eq(users.phone,phone),eq(users.isActive,true))).limit(1);
  if(!user?.passwordHash||!await verifyPassword(password,user.passwordHash))return NextResponse.json({error:'شمارهٔ همراه یا رمز عبور درست نیست.'},{status:401});
  const token=newSessionToken();await db.insert(sessions).values({userId:user.id,tokenHash:hashSessionToken(token),expiresAt:new Date(Date.now()+7*24*60*60*1000)});
  const response=NextResponse.json({role:user.role,redirect:user.role==='athlete'?'/athlete':user.role==='facility_manager'?'/manager':'/office'});
  response.cookies.set(sessionCookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*24*60*60});return response;
 }catch(error){console.error('Login failed',error);return NextResponse.json({error:'ورود در حال حاضر ممکن نیست.'},{status:500});}
}

