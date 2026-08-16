import type { PortfolioItem } from './types.ts';
import { CATEGORIES, FORMATS } from './defaults.ts';

function isValidItem(entry: unknown): entry is PortfolioItem {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.format === 'string' &&
    Object.prototype.hasOwnProperty.call(FORMATS, e.format) &&
    typeof e.category === 'string' &&
    (CATEGORIES as string[]).includes(e.category) &&
    typeof e.gradient === 'string'
  );
}

export function parseDraft(raw: string | null): PortfolioItem[] | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const items = (parsed as Record<string, unknown>).items;
    if (!Array.isArray(items)) return null;
    if (items.length === 0) return null;
    if (!items.every(isValidItem)) return null;
    return items;
  } catch {
    return null;
  }
}
