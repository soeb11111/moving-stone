'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { emptyItem } from '@/lib/portfolio/defaults';
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

  // Restore any unpublished draft from this browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (Array.isArray(draft?.items)) {
          setItems(draft.items);
          setSelectedId(draft.items[0]?.id ?? null);
        }
      }
    } catch {
      // A corrupt draft is not worth surfacing — fall back to published content.
    }
    setLoaded(true);
  }, []);

  // Autosave, debounced.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ items }));
    }, 500);
    return () => clearTimeout(t);
  }, [items, loaded]);

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
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (id === selectedId) setSelectedId(next[0]?.id ?? null);
      return next;
    });
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

  return (
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
        </div>
      </aside>
    </div>
  );
}
