import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Verifies the studio password against the ADMIN_PASSWORD environment variable.
 * The password never ships in the client bundle — the browser only ever learns
 * whether the one it submitted was correct.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(501).json({ error: 'ADMIN_PASSWORD is not set.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  const supplied = typeof body.password === 'string' ? body.password : '';

  if (!safeEqual(supplied, expected)) {
    // Small delay to make guessing tedious.
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  return res.status(200).json({ ok: true });
}

/** Length-independent comparison so timing does not leak the password. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
