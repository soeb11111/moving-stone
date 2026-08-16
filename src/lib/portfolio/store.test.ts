import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPortfolioFrom } from './store.ts';

const remote = {
  items: [{
    id: 'r1', title: 'From Storage', client: 'Acme', category: 'Commercial',
    format: 'film', duration: '', imageUrl: '', videoUrl: '',
    gradient: 'linear-gradient(135deg, #ff5500, #ffaa00)', year: '2026',
  }],
};

test('returns remote items when the fetch succeeds', async () => {
  const items = await readPortfolioFrom(async () => remote);
  assert.equal(items[0].title, 'From Storage');
});

test('falls back to bundled content when the fetch throws', async () => {
  const items = await readPortfolioFrom(async () => { throw new Error('offline'); });
  assert.ok(items.length > 0);
  assert.equal(items[0].title, 'Northern Lines');
});

test('falls back when the fetch returns nothing', async () => {
  const items = await readPortfolioFrom(async () => null);
  assert.equal(items[0].title, 'Northern Lines');
});

test('falls back when remote content is malformed', async () => {
  const items = await readPortfolioFrom(async () => ({ items: [{ bad: true }] }));
  assert.equal(items[0].title, 'Northern Lines');
});
