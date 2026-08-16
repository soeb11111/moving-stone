'use client';

import React, { useState } from 'react';

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onUnlock();
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError('That password is not right.');
        } else if (res.status === 503) {
          setError(data.error ?? 'The studio is not set up yet. Ask your developer to finish setup.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ad-gate">
      <form className="ad-gate-box" onSubmit={submit}>
        <h1 className="ad-gate-title">Studio</h1>
        <p className="ad-hint">Enter your password to manage your work.</p>
        <input
          className="ad-input" type="password" value={password} autoFocus
          onChange={(e) => setPassword(e.target.value)} placeholder="Password"
        />
        <button className="btn btn-light" type="submit" disabled={busy || !password}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        {error && <p className="ad-error">{error}</p>}
      </form>
    </div>
  );
}
