import { DEFAULT_PORTFOLIO, type PortfolioItem } from '../data/portfolio';

const STORAGE_KEY = 'moving-stone:portfolio:v1';
const API_URL = '/api/portfolio';

export type Source = 'published' | 'draft' | 'default';

export interface LoadResult {
  items: PortfolioItem[];
  source: Source;
}

function isValid(value: unknown): value is PortfolioItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        v &&
        typeof v === 'object' &&
        typeof (v as PortfolioItem).id === 'string' &&
        typeof (v as PortfolioItem).title === 'string' &&
        typeof (v as PortfolioItem).category === 'string'
    )
  );
}

/** Live site: published data if a backend is configured, otherwise the bundled default. */
export async function loadPublished(): Promise<LoadResult> {
  try {
    const res = await fetch(API_URL, { headers: { accept: 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (isValid(data)) return { items: data, source: 'published' };
    }
  } catch {
    /* no backend configured — fall through */
  }
  return { items: DEFAULT_PORTFOLIO, source: 'default' };
}

/** Editor: an unpublished local draft wins, so work in progress survives a refresh. */
export async function loadForEditor(): Promise<LoadResult> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValid(parsed)) return { items: parsed, source: 'draft' };
    }
  } catch {
    /* corrupt draft — ignore it */
  }
  return loadPublished();
}

export function saveDraft(items: PortfolioItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}

export interface PublishResult {
  ok: boolean;
  message: string;
}

/** Pushes to the backend. Returns a clear failure when no backend is wired up. */
export async function publish(items: PortfolioItem[], password: string): Promise<PublishResult> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-edit-token': password },
      body: JSON.stringify(items),
    });
    if (res.ok) return { ok: true, message: 'Published. The live site is updated.' };
    if (res.status === 401) return { ok: false, message: 'Session expired — sign in again.' };
    if (res.status === 501)
      return {
        ok: false,
        message: 'No storage configured yet. Export the JSON instead — see CMS.md.',
      };
    return { ok: false, message: `Publish failed (${res.status}).` };
  } catch {
    return {
      ok: false,
      message: 'No backend reachable. Export the JSON and commit it — see CMS.md.',
    };
  }
}

export function download(items: PortfolioItem[]): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function makeId(): string {
  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
