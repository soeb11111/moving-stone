'use client';

import React from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { CATEGORIES, GRADIENTS } from '@/lib/portfolio/defaults';
import { UploadField } from './UploadField';
import { FormatPicker } from './FormatPicker';

interface Props {
  item: PortfolioItem;
  onChange: (patch: Partial<PortfolioItem>) => void;
}

export function ItemForm({ item, onChange }: Props) {
  return (
    <div>
      <div className="ad-field">
        <label className="ad-label" htmlFor="f-title">Title</label>
        <p className="ad-hint">The name of the project, shown on the card.</p>
        <input
          id="f-title" className="ad-input" value={item.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="ad-field">
        <label className="ad-label" htmlFor="f-client">Client</label>
        <p className="ad-hint">Who it was made for. Leave blank for personal work.</p>
        <input
          id="f-client" className="ad-input" value={item.client}
          onChange={(e) => onChange({ client: e.target.value })}
        />
      </div>

      <div className="ad-field">
        <label className="ad-label" htmlFor="f-category">Category</label>
        <p className="ad-hint">Which filter button this appears under.</p>
        <select
          id="f-category" className="ad-select" value={item.category}
          onChange={(e) => onChange({ category: e.target.value as PortfolioItem['category'] })}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <FormatPicker value={item.format} onChange={(format) => onChange({ format })} />

      <UploadField
        label="Cover image" kind="image" value={item.imageUrl}
        hint="The still picture shown on the card."
        onChange={(imageUrl) => onChange({ imageUrl })}
      />

      <UploadField
        label="Video" kind="video" value={item.videoUrl}
        hint="Plays when someone hovers over the card. Optional."
        onChange={(videoUrl) => onChange({ videoUrl })}
      />

      <details className="ad-details">
        <summary>Or use a YouTube or Vimeo link instead</summary>
        <p className="ad-hint" style={{ marginTop: '0.75rem' }}>
          Best for anything longer than about 30 seconds.
        </p>
        <input
          className="ad-input" value={item.videoUrl} placeholder="Paste the link here"
          onChange={(e) => onChange({ videoUrl: e.target.value })}
        />
      </details>

      <div className="ad-field">
        <label className="ad-label">Background colour</label>
        <p className="ad-hint">Shown when there is no cover image.</p>
        <div className="ad-swatches">
          {GRADIENTS.map((g) => (
            <button
              key={g.name} type="button" title={g.name}
              className={`ad-swatch${item.gradient === g.value ? ' is-active' : ''}`}
              style={{ background: g.value }}
              onClick={() => onChange({ gradient: g.value })}
            />
          ))}
        </div>
      </div>

      <div className="ad-row">
        <div className="ad-field" style={{ flex: 1 }}>
          <label className="ad-label" htmlFor="f-duration">Length</label>
          <p className="ad-hint">Such as 0:30. Optional.</p>
          <input
            id="f-duration" className="ad-input" value={item.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </div>
        <div className="ad-field" style={{ flex: 1 }}>
          <label className="ad-label" htmlFor="f-year">Year</label>
          <p className="ad-hint">When it was made.</p>
          <input
            id="f-year" className="ad-input" value={item.year}
            onChange={(e) => onChange({ year: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
