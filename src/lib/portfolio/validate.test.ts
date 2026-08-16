import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePortfolio } from './validate.ts';

const valid = {
  id: 'a1', title: 'Film One', client: 'Acme', category: 'Commercial',
  format: 'reel', duration: '0:30', imageUrl: '', videoUrl: '',
  gradient: 'linear-gradient(135deg, #ff5500, #ffaa00)', year: '2026',
};

test('accepts a well-formed list', () => {
  const result = parsePortfolio({ items: [valid] });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].title, 'Film One');
  }
});

test('accepts an empty list', () => {
  const result = parsePortfolio({ items: [] });
  assert.equal(result.ok, true);
});

test('rejects a non-object', () => {
  assert.equal(parsePortfolio(null).ok, false);
  assert.equal(parsePortfolio('nope').ok, false);
});

test('rejects a missing items array', () => {
  const result = parsePortfolio({});
  assert.equal(result.ok, false);
});

test('rejects an unknown format and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, format: 'banana' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /format/i);
});

test('rejects an unknown category and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, category: 'Nope' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /category/i);
});

test('rejects a missing title and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, title: 123 }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /title/i);
});

test('strips unexpected properties', () => {
  const result = parsePortfolio({ items: [{ ...valid, sneaky: 'x' }] });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal('sneaky' in result.items[0], false);
});

test('rejects format "toString" (prototype-chain bug)', () => {
  const result = parsePortfolio({ items: [{ ...valid, format: 'toString' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /format/i);
});

test('rejects format "constructor" (prototype-chain bug)', () => {
  const result = parsePortfolio({ items: [{ ...valid, format: 'constructor' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /format/i);
});
