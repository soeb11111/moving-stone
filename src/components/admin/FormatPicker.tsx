'use client';

import React from 'react';
import type { Format } from '@/lib/portfolio/types';
import { FORMATS } from '@/lib/portfolio/defaults';

const ORDER: Format[] = ['reel', 'post', 'carousel', 'poster', 'film'];

export function FormatPicker({
  value,
  onChange,
}: {
  value: Format;
  onChange: (f: Format) => void;
}) {
  return (
    <div className="ad-field">
      <label className="ad-label">Shape</label>
      <p className="ad-hint">How this piece is framed on the page.</p>
      <div className="ad-formats">
        {ORDER.map((key) => (
          <button
            key={key}
            type="button"
            className={`ad-format${value === key ? ' is-active' : ''}`}
            onClick={() => onChange(key)}
          >
            <span
              className="ad-format-shape"
              style={{ aspectRatio: FORMATS[key].aspectRatio }}
            />
            {FORMATS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}
