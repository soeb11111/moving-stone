import { revalidatePath, revalidateTag } from 'next/cache';
import { getPortfolio, savePortfolio } from '@/lib/portfolio/store';
import { parsePortfolio } from '@/lib/portfolio/validate';
import { requireSession } from '@/lib/portfolio/session';

export async function GET() {
  const items = await getPortfolio();
  return Response.json({ items });
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return Response.json({ error: 'Please sign in again.' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Storage is not connected yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 400 });
  }

  const parsed = parsePortfolio(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await savePortfolio(parsed.items);
  } catch {
    return Response.json(
      { error: 'Could not save right now. Check your connection and try again.' },
      { status: 502 },
    );
  }

  revalidateTag('portfolio', { expire: 0 });
  revalidatePath('/work');
  return Response.json({ ok: true });
}
