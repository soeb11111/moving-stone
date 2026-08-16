import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aspectRatioFor } from './defaults.ts';

test('falls back to reel aspect ratio for an invalid format key', () => {
  assert.equal(aspectRatioFor('nonsense'), '9 / 16');
});

test('returns the correct aspect ratio for a valid format key', () => {
  assert.equal(aspectRatioFor('film'), '16 / 9');
});

test('falls back to reel aspect ratio for "toString" (prototype-chain bug)', () => {
  assert.equal(aspectRatioFor('toString'), '9 / 16');
});
