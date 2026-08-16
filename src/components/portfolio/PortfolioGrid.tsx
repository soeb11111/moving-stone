'use client';

import React, { useMemo, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { PortfolioCard } from './PortfolioCard';

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<string>('All');

  const categories = useMemo(() => {
    const present = Array.from(new Set(items.map((i) => i.category)));
    return ['All', ...present];
  }, [items]);

  const shown = active === 'All' ? items : items.filter((i) => i.category === active);

  if (items.length === 0) {
    return <p className="pf-empty">No work has been published yet.</p>;
  }

  return (
    <>
      {categories.length > 2 && (
        <div className="pf-filters">
          {categories.map((c) => (
            <button
              key={c}
              className={`pf-pill${c === active ? ' is-active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="pf-grid">
        {shown.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
