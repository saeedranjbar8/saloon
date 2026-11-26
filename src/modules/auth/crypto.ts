import { randomBytes, scrypt as callbackScrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt=promisify(callbackScrypt);
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64) as Buffer;return `scrypt:${salt}:${key.toString('hex')}`;}
export async function verifyPassword(password:string,stored:string){const [scheme,salt,hash]=stored.split(':');if(scheme!=='scrypt'||!salt||!hash)return false;const actual=await scrypt(password,salt,64) as Buffer;const expected=Buffer.from(hash,'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);}
export function newSessionToken(){return randomBytes(32).toString('base64url');}
export function hashSessionToken(token:string){return createHash('sha256').update(token).digest('hex');}
