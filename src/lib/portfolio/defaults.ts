import type { Category, Format, PortfolioItem } from './types.ts';

export const FORMATS: Record<Format, { label: string; aspectRatio: string }> = {
  reel:     { label: 'Reel',     aspectRatio: '9 / 16' },
  post:     { label: 'Post',     aspectRatio: '1 / 1'  },
  carousel: { label: 'Carousel', aspectRatio: '4 / 5'  },
  poster:   { label: 'Poster',   aspectRatio: '2 / 3'  },
  film:     { label: 'Film',     aspectRatio: '16 / 9' },
};

export const GRADIENTS: { name: string; value: string }[] = [
  { name: 'Ember',    value: 'linear-gradient(135deg, #ff5500, #ffaa00)' },
  { name: 'Violet',   value: 'linear-gradient(135deg, #7e6ba8, #3a2f5c)' },
  { name: 'Slate',    value: 'linear-gradient(135deg, #3a3a3a, #111111)' },
  { name: 'Sea',      value: 'linear-gradient(135deg, #1e6f7a, #0d2b33)' },
  { name: 'Rose',     value: 'linear-gradient(135deg, #d1495b, #5c1a24)' },
  { name: 'Sand',     value: 'linear-gradient(135deg, #c9a227, #6b5310)' },
];

export const CATEGORIES: Category[] = [
  'Commercial',
  'Music Video',
  'Documentary',
  'Branded',
  'Personal',
];

export function emptyItem(): PortfolioItem {
  return {
    id: crypto.randomUUID(),
    title: '',
    client: '',
    category: 'Commercial',
    format: 'reel',
    duration: '',
    imageUrl: '',
    videoUrl: '',
    gradient: GRADIENTS[0].value,
    year: String(new Date().getFullYear()),
  };
}
