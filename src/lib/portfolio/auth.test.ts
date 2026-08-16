import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPassword, signSession, verifySession, SESSION_MAX_AGE } from './auth.ts';

test('accepts the correct password', () => {
  assert.equal(checkPassword('hunter2', 'hunter2'), true);
});

test('rejects a wrong password', () => {
  assert.equal(checkPassword('wrong', 'hunter2'), false);
});

test('rejects passwords of differing length without throwing', () => {
  assert.equal(checkPassword('short', 'a-much-longer-password'), false);
});

test('rejects an empty supplied password', () => {
  assert.equal(checkPassword('', 'hunter2'), false);
});

test('a freshly signed session verifies', () => {
  const now = Date.now();
  const token = signSession('secret', now);
  assert.equal(verifySession(token, 'secret', now), true);
});

test('a session signed with another secret fails', () => {
  const now = Date.now();
  const token = signSession('secret-a', now);
  assert.equal(verifySession(token, 'secret-b', now), false);
});

test('an expired session fails', () => {
  const issued = Date.now();
  const token = signSession('secret', issued);
  const later = issued + (SESSION_MAX_AGE + 60) * 1000;
  assert.equal(verifySession(token, 'secret', later), false);
});

test('a tampered session fails', () => {
  const now = Date.now();
  const token = signSession('secret', now);
  const [ts] = token.split('.');
  assert.equal(verifySession(`${ts}.deadbeef`, 'secret', now), false);
});

test('malformed tokens fail without throwing', () => {
  assert.equal(verifySession('', 'secret'), false);
  assert.equal(verifySession('no-dot', 'secret'), false);
  assert.equal(verifySession('a.b.c', 'secret'), false);
});
