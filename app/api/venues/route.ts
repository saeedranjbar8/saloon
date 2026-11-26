import { NextResponse } from 'next/server';
import { getDb } from '@/src/db';
import { venues } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
export async function GET(){
 try{return NextResponse.json({venues:await getDb().select().from(venues).where(eq(venues.isActive,true))});}
 catch(error){console.error('Venue listing failed',error);return NextResponse.json({error:'Venues could not be loaded'},{status:500});}
}
