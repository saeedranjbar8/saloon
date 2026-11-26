export interface PaymentAdapter { createPayment(input:{bookingId:string;amountRial:number}): Promise<{reference:string;status:'pending'}>; }
export class FakePaymentAdapter implements PaymentAdapter {
 async createPayment(input:{bookingId:string;amountRial:number}) { return {reference:`fake-${input.bookingId}-${input.amountRial}`,status:'pending' as const}; }
}
