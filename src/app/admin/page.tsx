'use client';

import React, { useEffect, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { Editor } from '@/components/admin/Editor';
import { PasswordGate } from '@/components/admin/PasswordGate';

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [items, setItems] = useState<PortfolioItem[] | null>(null);

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setUnlocked(Boolean(d.signedIn)))
      .catch(() => setUnlocked(false))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, [unlocked]);

  if (checkingSession) return <div className="ad-gate"><p className="ad-hint">Loading…</p></div>;
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  if (!items) return <div className="ad-gate"><p className="ad-hint">Loading…</p></div>;
  return <Editor initialItems={items} />;
}
