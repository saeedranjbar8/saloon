import { and, eq, gt, notExists, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDb } from '@/src/db';
import { bookableUnits, bookings, slots } from '@/src/db/schema';
export async function GET(request:Request){
 try {
  const db=getDb();const now=new Date();const venueId=new URL(request.url).searchParams.get('venueId');
  const available=await db.select({id:slots.id,startsAt:slots.startsAt,endsAt:slots.endsAt}).from(slots).innerJoin(bookableUnits,eq(slots.bookableUnitId,bookableUnits.id)).where(and(
   eq(bookableUnits.isActive,true),
   venueId?eq(bookableUnits.venueId,venueId):undefined,
   gt(slots.startsAt,now),
   notExists(db.select({id:bookings.id}).from(bookings).where(and(eq(bookings.slotId,slots.id),or(eq(bookings.status,'confirmed'),and(eq(bookings.status,'pending_payment'),gt(bookings.holdExpiresAt,now))))))
  )).orderBy(slots.startsAt).limit(100);
  return NextResponse.json({slots:available});
 } catch(error){console.error('Slot listing failed',error);return NextResponse.json({error:'Slots could not be loaded'},{status:500});}
}
