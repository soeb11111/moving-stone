import type { Category, Format, PortfolioItem } from './types.ts';
import { CATEGORIES, FORMATS } from './defaults.ts';

type Result =
  | { ok: true; items: PortfolioItem[] }
  | { ok: false; error: string };

const FIELD_LABELS: Record<string, string> = {
  id: 'identifier',
  title: 'title',
  client: 'client',
  duration: 'length',
  imageUrl: 'cover image',
  videoUrl: 'video',
  gradient: 'background colour',
  year: 'year',
  format: 'shape',
  category: 'category',
};

function str(v: unknown): v is string {
  return typeof v === 'string';
}

export function parsePortfolio(input: unknown): Result {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Expected an object.' };
  }
  const raw = (input as { items?: unknown }).items;
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Expected an "items" array.' };
  }

  const items: PortfolioItem[] = [];

  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    const at = `Item ${i + 1}`;

    if (typeof it !== 'object' || it === null) {
      return { ok: false, error: `${at} is not valid.` };
    }
    const o = it as Record<string, unknown>;

    for (const field of ['id', 'title', 'client', 'duration', 'imageUrl', 'videoUrl', 'gradient', 'year']) {
      if (!str(o[field])) {
        return { ok: false, error: `${at}: "${FIELD_LABELS[field]}" must be text.` };
      }
    }
    if (!str(o.format) || !Object.prototype.hasOwnProperty.call(FORMATS, o.format)) {
      return { ok: false, error: `${at}: "${FIELD_LABELS.format}" is not a known ${FIELD_LABELS.format}.` };
    }
    if (!str(o.category) || !CATEGORIES.includes(o.category as Category)) {
      return { ok: false, error: `${at}: "${FIELD_LABELS.category}" is not a known ${FIELD_LABELS.category}.` };
    }

    items.push({
      id: o.id as string,
      title: o.title as string,
      client: o.client as string,
      category: o.category as Category,
      format: o.format as Format,
      duration: o.duration as string,
      imageUrl: o.imageUrl as string,
      videoUrl: o.videoUrl as string,
      gradient: o.gradient as string,
      year: o.year as string,
    });
  }

  return { ok: true, items };
}
