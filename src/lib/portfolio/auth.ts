import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'ms_session';
/** Eight hours, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 8;

/** Constant-time password comparison. Length differences do not throw. */
export function checkPassword(supplied: string, actual: string): boolean {
  if (!supplied || !actual) return false;
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(actual, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** Token format: "<issuedAtMs>.<hmac>" */
export function signSession(secret: string, issuedAt: number = Date.now()): string {
  const ts = String(issuedAt);
  return `${ts}.${sign(`session:${ts}`, secret)}`;
}

export function verifySession(
  token: string | undefined,
  secret: string,
  now: number = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [ts, mac] = parts;
  if (!/^\d+$/.test(ts)) return false;

  const expected = sign(`session:${ts}`, secret);
  const a = Buffer.from(mac, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const age = (now - Number(ts)) / 1000;
  return age >= 0 && age < SESSION_MAX_AGE;
}
