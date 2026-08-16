import { memo, useCallback, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { KIND_LABEL, RATIO, type PortfolioItem } from '../data/portfolio';

interface Props {
  item: PortfolioItem;
}

/** Display-only portfolio card: gradient surface, optional still, optional hover video. */
function PortfolioCard({ item }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const isVideo = Boolean(item.src);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  return (
    <figure
      className={`group relative mb-2 sm:mb-4 w-full overflow-hidden rounded-xl border border-white/10 bg-[#141414] ${
        RATIO[item.kind]
      }`}
      onMouseEnter={isVideo ? start : undefined}
      onMouseLeave={isVideo ? stop : undefined}
    >
      <div className="absolute inset-0" style={{ background: item.surface }} aria-hidden="true" />

      {item.image ? (
        <img
          src={item.image}
          alt={`${item.title} — ${item.client}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grain grain-coarse" aria-hidden="true" />
      )}

      {isVideo ? (
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={item.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      <div
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
        aria-hidden="true"
      />

      <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-black/45 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
        {KIND_LABEL[item.kind]}
        {item.duration ? ` · ${item.duration}` : ''}
      </span>

      {isVideo ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${item.title}` : `Play ${item.title}`}
          className="absolute right-2.5 top-2.5 z-20 grid h-9 w-9 place-items-center rounded-xl bg-black/45 backdrop-blur-md transition-colors hover:bg-black/70"
        >
          <Play size={15} className={playing ? 'text-[#e8702a]' : 'fill-white text-white'} />
        </button>
      ) : null}

      <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#e8702a]">{item.client}</p>
        <h3
          className="mt-1 text-sm leading-tight text-white sm:text-base"
          style={{ letterSpacing: '-0.03em' }}
        >
          {item.title}
        </h3>
      </figcaption>
    </figure>
  );
}

export default memo(PortfolioCard);
