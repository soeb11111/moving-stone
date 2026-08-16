import { put } from '@vercel/blob';
import type { PortfolioItem } from './types.ts';
import { parsePortfolio } from './validate.ts';
import bundled from '../../../data/portfolio.json' with { type: 'json' };

export const BLOB_DATA_KEY = 'portfolio/data.json';

export function buildDataUrl(base: string): string {
  const normalized = base.replace(/\/+$/, '');
  return `${normalized}/${BLOB_DATA_KEY}`;
}

function fallbackItems(): PortfolioItem[] {
  const parsed = parsePortfolio(bundled);
  return parsed.ok ? parsed.items : [];
}

/**
 * Reads published content, falling back to the bundled file whenever the
 * remote copy is missing, unreachable, or malformed. Never throws.
 */
export async function readPortfolioFrom(
  fetchJson: () => Promise<unknown>,
): Promise<PortfolioItem[]> {
  try {
    const raw = await fetchJson();
    if (!raw) return fallbackItems();
    const parsed = parsePortfolio(raw);
    return parsed.ok ? parsed.items : fallbackItems();
  } catch {
    return fallbackItems();
  }
}

async function fetchFromBlob(): Promise<unknown> {
  const base = process.env.BLOB_PUBLIC_BASE_URL;
  if (!base) return null;
  const res = await fetch(buildDataUrl(base), {
    next: { tags: ['portfolio'] },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return readPortfolioFrom(fetchFromBlob);
}

export async function savePortfolio(items: PortfolioItem[]): Promise<void> {
  await put(BLOB_DATA_KEY, JSON.stringify({ items }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
