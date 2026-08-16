import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list, put } from '@vercel/blob';

const BLOB_PATH = 'portfolio.json';

/**
 * Portfolio storage.
 *
 * GET  -> returns the published portfolio JSON (404 when nothing published yet)
 * POST -> replaces it, guarded by the ADMIN_PASSWORD environment variable
 *
 * Returns 501 until Vercel Blob is connected, so the site falls back to the
 * bundled content instead of breaking.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const configured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (!configured) {
    return res.status(501).json({ error: 'Storage not configured. See CMS.md.' });
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
      if (!blobs.length) return res.status(404).json({ error: 'Nothing published yet.' });
      const upstream = await fetch(`${blobs[0].url}?t=${Date.now()}`);
      const data = await upstream.json();
      res.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ error: 'Could not read stored portfolio.' });
    }
  }

  if (req.method === 'POST') {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return res.status(501).json({ error: 'ADMIN_PASSWORD is not set. See CMS.md.' });
    }
    if (req.headers['x-edit-token'] !== expected) {
      return res.status(401).json({ error: 'Unauthorised.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'Expected an array of portfolio items.' });
    }

    try {
      await put(BLOB_PATH, JSON.stringify(body), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return res.status(200).json({ ok: true, count: body.length });
    } catch {
      return res.status(500).json({ error: 'Could not save.' });
    }
  }

  res.setHeader('allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
}
