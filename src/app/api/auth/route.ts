import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  signSession,
} from '@/lib/portfolio/auth';
import { requireSession } from '@/lib/portfolio/session';

export async function GET() {
  const signedIn = await requireSession();
  return Response.json({ signedIn }, { status: 200 });
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return Response.json(
      { error: 'The studio is not set up yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 400 });
  }

  if (!checkPassword(password, secret)) {
    return Response.json({ error: 'That password is not right.' }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
