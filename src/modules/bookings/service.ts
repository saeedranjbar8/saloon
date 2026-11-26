export interface BookingRequest {slotId:string;athleteId:string;sportId:string;tariffAmountRial:number;amountRial:number;idempotencyKey:string;}
export function createBookingRequest(value:unknown):BookingRequest {
 if(!value || typeof value!=='object') throw new Error('Booking request must be an object');
 const x=value as Record<string,unknown>;
 for(const key of ['slotId','athleteId','sportId','idempotencyKey']) if(typeof x[key]!=='string'||!x[key]) throw new Error(`${key} is required`);
 for(const key of ['tariffAmountRial','amountRial']) if(!Number.isSafeInteger(x[key])||(x[key] as number)<0) throw new Error(`${key} must be a nonnegative integer in rial`);
 return {slotId:x.slotId as string,athleteId:x.athleteId as string,sportId:x.sportId as string,tariffAmountRial:x.tariffAmountRial as number,amountRial:x.amountRial as number,idempotencyKey:x.idempotencyKey as string};
}
