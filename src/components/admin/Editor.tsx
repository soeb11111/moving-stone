'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { emptyItem } from '@/lib/portfolio/defaults';
import { parseDraft } from '@/lib/portfolio/draft';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { ItemForm } from './ItemForm';
import { ItemList } from './ItemList';

const DRAFT_KEY = 'ms_portfolio_draft';

type Status = { kind: 'idle' | 'saving' | 'ok' | 'error'; message?: string };

export function Editor({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [loaded, setLoaded] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<PortfolioItem[] | null>(null);
  const [otherTabChanged, setOtherTabChanged] = useState(false);

  // Detect any unpublished draft from this browser, but don't apply it yet.
  useEffect(() => {
    const items = parseDraft(localStorage.getItem(DRAFT_KEY));
    if (items) {
      setPendingDraft(items);
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
    setLoaded(true);
  }, []);

  // Notice (but don't auto-apply) changes written by another tab.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === DRAFT_KEY) {
        setOtherTabChanged(true);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Autosave, debounced. Never write while an undecided draft is pending —
  // doing so would overwrite the very draft the owner is being asked about.
  useEffect(() => {
    if (!loaded || pendingDraft !== null) return;
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ items, savedAt: Date.now() }));
    }, 500);
    return () => clearTimeout(t);
  }, [items, loaded, pendingDraft]);

  // Clear a stale "published" message as soon as the owner makes a new edit.
  useEffect(() => {
    if (!loaded) return;
    setStatus((prev) => (prev.kind === 'ok' ? { kind: 'idle' } : prev));
  }, [items, loaded]);

  function useDraft() {
    if (pendingDraft) {
      setItems(pendingDraft);
      setSelectedId(pendingDraft[0]?.id ?? null);
    }
    setPendingDraft(null);
  }

  function discardDraft() {
    setPendingDraft(null);
    localStorage.removeItem(DRAFT_KEY);
  }

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  function patch(changes: Partial<PortfolioItem>) {
    setItems((prev) =>
      prev.map((i) => (i.id === selectedId ? { ...i, ...changes } : i)),
    );
  }

  function add() {
    const item = emptyItem();
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  }

  function move(id: string, direction: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    if (id === selectedId) setSelectedId(next[0]?.id ?? null);
  }

  async function publish() {
    setStatus({ kind: 'saving' });
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        localStorage.removeItem(DRAFT_KEY);
        setStatus({ kind: 'ok', message: 'Published — your changes are live.' });
      } else {
        setStatus({ kind: 'error', message: data.error ?? 'Could not publish. Try again.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server. Check your connection.' });
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify({ items }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function signOut() {
    localStorage.removeItem(DRAFT_KEY);
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch {
      // Even if the request fails, still sign the user out locally.
    }
    location.reload();
  }

  const showBanner = pendingDraft !== null || otherTabChanged;

  return (
    <div>
      {showBanner && (
        <div className="ad-draft-banner">
          {pendingDraft !== null && (
            <>
              <span>You have unsaved changes from an earlier visit.</span>
              <span>
                <button type="button" onClick={useDraft}>Use these changes</button>
                <button type="button" onClick={discardDraft}>Discard them</button>
              </span>
            </>
          )}
          {otherTabChanged && (
            <span>This page was changed in another tab. Reload to see the latest.</span>
          )}
        </div>
      )}
      <div className="ad-shell">
        <aside className="ad-side">
          <ItemList
            items={items} selectedId={selectedId} onSelect={setSelectedId}
            onMove={move} onDelete={remove} onAdd={add}
          />
        </aside>

        <main className="ad-main">
          {selected ? (
            <ItemForm item={selected} onChange={patch} />
          ) : (
            <div className="ad-blank">
              <h2>Nothing here yet</h2>
              <p className="ad-hint">Add your first project to get started.</p>
              <button className="btn btn-light" onClick={add}>Add your first project</button>
            </div>
          )}
        </main>

        <aside className="ad-preview-pane">
          <span className="ad-label">Preview</span>
          {selected && <PortfolioCard item={selected} />}

          <div className="ad-actions">
            <button className="btn btn-light" onClick={publish} disabled={status.kind === 'saving'}>
              {status.kind === 'saving' ? 'Publishing…' : 'Publish'}
            </button>
            {status.message && (
              <p className={status.kind === 'ok' ? 'ad-ok' : 'ad-error'}>{status.message}</p>
            )}
            <button className="ad-remove" onClick={download}>Download a backup copy</button>
            <button className="ad-remove" onClick={signOut}>Sign out</button>
            <p className="ad-hint">Sign out if you are on a shared computer.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
