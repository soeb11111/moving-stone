import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uploadErrorMessage } from './upload-errors.ts';

test('reports an expired session for auth failures', () => {
  assert.equal(
    uploadErrorMessage(new Error('Not signed in.')),
    'Your session has ended. Please sign in again.',
  );
});

test('reports a size problem for a 413', () => {
  assert.equal(
    uploadErrorMessage(new Error('Request failed with status 413')),
    'That file is too big to upload.',
  );
});

test('reports an unsupported file kind for a 415', () => {
  assert.equal(
    uploadErrorMessage(new Error('Request failed with status 415')),
    'That kind of file is not supported. Try a photo or a video.',
  );
});

test('reports storage not set up for a 503', () => {
  assert.equal(
    uploadErrorMessage(new Error('Storage is not connected yet.')),
    'Storage is not set up yet. Ask your developer to finish setup.',
  );
});

test('falls back to the generic message for unrecognized errors', () => {
  assert.equal(
    uploadErrorMessage(new Error('Network request failed')),
    'That upload did not go through. Check your connection and try again.',
  );
});

test('falls back to the generic message for a non-Error value', () => {
  assert.equal(
    uploadErrorMessage(undefined),
    'That upload did not go through. Check your connection and try again.',
  );
});

test('reports a possibly ended session for the client-token error (double space)', () => {
  assert.equal(
    uploadErrorMessage(new Error('Failed to  retrieve the client token')),
    'Could not start the upload. Your session may have ended — try signing in again.',
  );
});

test('reports a possibly ended session for the client-token error (single space)', () => {
  assert.equal(
    uploadErrorMessage(new Error('Failed to retrieve the client token')),
    'Could not start the upload. Your session may have ended — try signing in again.',
  );
});

test('the explicit auth branch still wins over the client-token branch', () => {
  assert.equal(
    uploadErrorMessage(new Error('Not signed in.')),
    'Your session has ended. Please sign in again.',
  );
});
