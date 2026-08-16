import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDraft } from './draft.ts';

test('null input returns null', () => {
  assert.equal(parseDraft(null), null);
});

test('unparseable text returns null', () => {
  assert.equal(parseDraft('not json{'), null);
});

test('empty object returns null', () => {
  assert.equal(parseDraft('{}'), null);
});

test('non-array items returns null', () => {
  assert.equal(parseDraft(JSON.stringify({ items: 'x' })), null);
});

test('empty items array returns null', () => {
  assert.equal(parseDraft(JSON.stringify({ items: [] })), null);
});

test('items array with a null entry returns null', () => {
  assert.equal(parseDraft(JSON.stringify({ items: [null] })), null);
});

test('item with non-string id returns null', () => {
  assert.equal(
    parseDraft(
      JSON.stringify({
        items: [{ id: 1, title: 'a', format: 'reel', category: 'Commercial', gradient: 'linear-gradient(1,2)' }],
      }),
    ),
    null,
  );
});

test('valid single-item draft returns the items array', () => {
  const result = parseDraft(
    JSON.stringify({
      items: [{ id: 'a', title: 'a', format: 'reel', category: 'Commercial', gradient: 'linear-gradient(1,2)' }],
    }),
  );
  assert.ok(result);
  assert.equal(result?.length, 1);
});

test('item with unknown category returns null', () => {
  assert.equal(
    parseDraft(
      JSON.stringify({
        items: [{ id: 'a', title: 'a', format: 'reel', category: 'Nope', gradient: 'linear-gradient(1,2)' }],
      }),
    ),
    null,
  );
});

test('item with format "toString" returns null', () => {
  assert.equal(
    parseDraft(
      JSON.stringify({
        items: [{ id: 'a', title: 'a', format: 'toString', category: 'Commercial', gradient: 'linear-gradient(1,2)' }],
      }),
    ),
    null,
  );
});

test('item with non-string gradient returns null', () => {
  assert.equal(
    parseDraft(
      JSON.stringify({
        items: [{ id: 'a', title: 'a', format: 'reel', category: 'Commercial', gradient: 5 }],
      }),
    ),
    null,
  );
});
