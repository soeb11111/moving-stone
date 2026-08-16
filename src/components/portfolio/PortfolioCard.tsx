'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { FORMATS } from '@/lib/portfolio/defaults';

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tokenRef = useRef(0);
  const mountedRef = useRef(true);
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(item.videoUrl);
  const canPlayInline = Boolean(item.videoUrl) && !isEmbed;
  const aspectRatio = FORMATS[item.format]?.aspectRatio ?? FORMATS.reel.aspectRatio;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function start() {
    if (!canPlayInline) return;
    const token = ++tokenRef.current;
    setPlaying(true);
    videoRef.current?.play().catch(() => {
      if (mountedRef.current && tokenRef.current === token) setPlaying(false);
    });
  }

  function stop() {
    if (!canPlayInline) return;
    ++tokenRef.current;
    setPlaying(false);
    videoRef.current?.pause();
  }

  function toggle() {
    if (playing) stop();
    else start();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      toggle();
    }
  }

  const interactiveProps = canPlayInline
    ? {
        onClick: toggle,
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        'aria-label': `Play ${item.title}`,
      }
    : {};

  return (
    <article
      className="pf-card"
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{ aspectRatio, background: item.gradient }}
      {...interactiveProps}
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
