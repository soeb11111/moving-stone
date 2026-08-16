'use client';

import React from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';

interface Props {
  items: PortfolioItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ItemList({ items, selectedId, onSelect, onMove, onDelete, onAdd }: Props) {
  return (
    <div className="ad-list">
      <button type="button" className="ad-add" onClick={onAdd}>+ Add a project</button>

      {items.map((item, i) => (
        <div
          key={item.id}
          className={`ad-row-item${item.id === selectedId ? ' is-active' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Edit ${item.title || 'Untitled project'}`}
          onClick={() => onSelect(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (e.key === ' ') e.preventDefault();
              onSelect(item.id);
            }
          }}
        >
          <span className="ad-row-title">{item.title || 'Untitled project'}</span>
          <span className="ad-row-actions">
            <button
              type="button" aria-label="Move up" disabled={i === 0}
              onClick={(e) => { e.stopPropagation(); onMove(item.id, -1); }}
            >↑</button>
            <button
              type="button" aria-label="Move down" disabled={i === items.length - 1}
              onClick={(e) => { e.stopPropagation(); onMove(item.id, 1); }}
            >↓</button>
            <button
              type="button" aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation();
                const name = item.title || 'this project';
                if (confirm(`Delete ${name}? This cannot be undone.`)) onDelete(item.id);
              }}
            >×</button>
          </span>
        </div>
      ))}
    </div>
  );
}
