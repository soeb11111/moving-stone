import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FORMATS, GRADIENTS, CATEGORIES, emptyItem } from './defaults.ts';

test('every format has a label and a CSS aspect ratio', () => {
  const keys = Object.keys(FORMATS);
  assert.deepEqual(keys, ['reel', 'post', 'carousel', 'poster', 'film']);
  for (const key of keys) {
    const f = FORMATS[key as keyof typeof FORMATS];
    assert.ok(f.label.length > 0);
    assert.match(f.aspectRatio, /^\d+ \/ \d+$/);
  }
});

test('reel is portrait and film is landscape', () => {
  assert.equal(FORMATS.reel.aspectRatio, '9 / 16');
  assert.equal(FORMATS.film.aspectRatio, '16 / 9');
});

test('there are six gradient presets, each a CSS gradient', () => {
  assert.equal(GRADIENTS.length, 6);
  for (const g of GRADIENTS) {
    assert.ok(g.name.length > 0);
    assert.match(g.value, /gradient\(/);
  }
});

test('emptyItem produces a unique id and safe defaults', () => {
  const a = emptyItem();
  const b = emptyItem();
  assert.notEqual(a.id, b.id);
  assert.equal(a.title, '');
  assert.equal(a.format, 'reel');
  assert.equal(a.gradient, GRADIENTS[0].value);
  assert.ok(CATEGORIES.includes(a.category));
});
