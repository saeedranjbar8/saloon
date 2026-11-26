import { and, eq, gt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDb } from '@/src/db';
import { bookings } from '@/src/db/schema';
import { createBookingRequest } from '@/src/modules/bookings/service';
import { getCurrentUser } from '@/src/modules/auth/session';

export async function POST(request: Request) {
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:'برای رزرو ابتدا وارد حساب شو.'},{status:401});
 if(user.role!=='athlete')return NextResponse.json({error:'این عملیات فقط برای ورزشکار است.'},{status:403});
 let input;
 try { input=createBookingRequest({...await request.json(),athleteId:user.id}); }
 catch(error) { return NextResponse.json({error:error instanceof Error?error.message:'Invalid JSON body'},{status:400}); }
 try {
  const db=getDb();
  const [prior]=await db.select().from(bookings).where(eq(bookings.idempotencyKey,input.idempotencyKey)).limit(1);
  if(prior) return NextResponse.json({booking:prior},{status:200});
  const booking=await db.transaction(async(tx)=>{
   const now=new Date();
   await tx.update(bookings).set({status:'expired'}).where(sql`${bookings.status} = 'pending_payment' and ${bookings.holdExpiresAt} <= ${now}`);
   const [pending]=await tx.select({id:bookings.id}).from(bookings).where(and(eq(bookings.athleteId,input.athleteId),eq(bookings.status,'pending_payment'),gt(bookings.holdExpiresAt,now))).limit(3);
   const pendingCount=await tx.select({id:bookings.id}).from(bookings).where(and(eq(bookings.athleteId,input.athleteId),eq(bookings.status,'pending_payment'),gt(bookings.holdExpiresAt,now)));
   if(pending && pendingCount.length>=3) throw new Error('PENDING_LIMIT');
   const [created]=await tx.insert(bookings).values({...input,holdExpiresAt:new Date(now.getTime()+10*60*1000)}).onConflictDoNothing().returning();
   return created;
  });
  if(booking) return NextResponse.json({booking},{status:201});
  const [priorAfterConflict]=await db.select().from(bookings).where(eq(bookings.idempotencyKey,input.idempotencyKey)).limit(1);
  if(priorAfterConflict) return NextResponse.json({booking:priorAfterConflict},{status:200});
  return NextResponse.json({error:'Slot is already held or booked'},{status:409});
 } catch(error) {
  if(error instanceof Error && error.message==='PENDING_LIMIT') return NextResponse.json({error:'You already have three bookings waiting for payment'},{status:409});
  console.error('Booking request failed',error);
  return NextResponse.json({error:'Booking could not be created'},{status:500});
 }
}


