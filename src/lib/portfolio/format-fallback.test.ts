import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FORMATS } from './defaults.ts';

test('falls back to reel aspect ratio for an invalid format key', () => {
  const format = 'nonsense' as unknown as keyof typeof FORMATS;
  const aspectRatio = FORMATS[format]?.aspectRatio ?? FORMATS.reel.aspectRatio;
  assert.equal(aspectRatio, '9 / 16');
});

test('returns the correct aspect ratio for a valid format key', () => {
  const aspectRatio = FORMATS.film?.aspectRatio ?? FORMATS.reel.aspectRatio;
  assert.equal(aspectRatio, '16 / 9');
});
