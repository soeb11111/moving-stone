'use client';

import React, { useRef, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { FORMATS } from '@/lib/portfolio/defaults';

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(item.videoUrl);
  const canPlayInline = Boolean(item.videoUrl) && !isEmbed;

  function start() {
    if (!canPlayInline) return;
    setPlaying(true);
    videoRef.current?.play().catch(() => setPlaying(false));
  }

  function stop() {
    if (!canPlayInline) return;
    setPlaying(false);
    videoRef.current?.pause();
  }

  return (
    <article
      className="pf-card"
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{ aspectRatio: FORMATS[item.format].aspectRatio, background: item.gradient }}
    >
      {item.imageUrl && (
        <img className="pf-media" src={item.imageUrl} alt={item.title} loading="lazy" />
      )}

      {canPlayInline && (
        <video
          ref={videoRef}
          className="pf-media"
          src={item.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}

      {item.duration && <span className="pf-badge">{item.duration}</span>}

      <div className="pf-meta">
        <span className="pf-category">{item.category}</span>
        <h3 className="pf-title">{item.title}</h3>
        {item.client && <p className="pf-client">{item.client}</p>}
      </div>
    </article>
  );
}
