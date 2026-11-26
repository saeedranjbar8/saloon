export interface SmsAdapter { send(input:{to:string;message:string}): Promise<{messageId:string;status:'queued'}>; }
export class FakeSmsAdapter implements SmsAdapter {
 async send(input:{to:string;message:string}) { return {messageId:`fake-sms-${Date.now()}`,status:'queued' as const}; }
}
