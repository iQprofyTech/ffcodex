import crypto from 'crypto';
import { config } from '../config.js';

export function verifyTelegramInitData(initData: string, botToken: string): boolean {
  if (!botToken) return false;
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const url = new URLSearchParams(initData);
  const hash = url.get('hash');
  if (!hash) return false;
  url.delete('hash');
  const dataCheckString = Array.from(url.entries())
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return hmac === hash;
}

export function signJwt(payload: any): string {
  // Minimal local signer to avoid runtime @fastify/jwt coupling here
  // Caller should prefer reply.jwtSign, but this helps for simple flows
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${sig}`;
}
