import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from './auth.ts';

/** True when the caller holds a valid session. Server-only. */
export async function requireSession(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value, secret);
}
