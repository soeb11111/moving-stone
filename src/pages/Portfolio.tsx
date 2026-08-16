import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import PortfolioCard from '../components/PortfolioCard';
import { CATEGORIES, type Category, type PortfolioItem } from '../data/portfolio';
import { loadPublished } from '../lib/store';

type Sort = 'Trending' | 'Newest' | 'Most viewed';
const SORTS: Sort[] = ['Trending', 'Newest', 'Most viewed'];

export default function Portfolio() {
  const [active, setActive] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('Trending');
  const [all, setAll] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadPublished().then(({ items }) => {
      if (cancelled) return;
      setAll(items);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title = 'Portfolio — Moving Stone';
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      'content',
      'Selected work from Moving Stone: AI content, branding, product design, web and app design, video ads, real estate, architecture, fashion, healthcare, ecommerce, beauty, automotive and interiors.'
    );
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter((item) => {
      const inCategory = active === 'All' || item.category === active;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered];
    if (sort === 'Trending') sorted.sort((a, b) => b.trending - a.trending);
    if (sort === 'Newest') sorted.sort((a, b) => b.year - a.year || b.trending - a.trending);
    if (sort === 'Most viewed') sorted.sort((a, b) => b.views - a.views);
    return sorted;
  }, [all, active, query, sort]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    all.forEach((i) => map.set(i.category, (map.get(i.category) ?? 0) + 1));
    map.set('All', all.length);
    return map;
  }, [all]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-24 pt-24 sm:px-8 sm:pt-28">
        <h1
          className="text-4xl font-semibold sm:text-5xl md:text-6xl"
          style={{ letterSpacing: '-0.045em' }}
        >
          Portfolio
        </h1>

        <nav aria-label="Breadcrumb" className="mt-7">
          <ol className="flex list-none items-center gap-2 p-0 text-sm text-white/55">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="flex items-center">
              <ChevronRight size={16} />
            </li>
            <li aria-current="page" className="font-medium text-white">
              Portfolio
            </li>
          </ol>
        </nav>

        {/* Search + sort */}
        <div className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portfolio…"
              aria-label="Search portfolio"
              className="w-full rounded-2xl border border-white/12 bg-[#151515] py-3.5 pl-12 pr-4 text-base text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
            />
          </div>
          <label className="relative shrink-0">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-full cursor-pointer appearance-none rounded-2xl border border-white/12 bg-[#151515] py-3.5 pl-4 pr-10 text-base font-medium text-white focus:border-white/25 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s} className="bg-[#151515]">
                  {s}
                </option>
              ))}
            </select>
            <ChevronRight
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-white/60"
            />
          </label>
        </div>

        {/* Category pills */}
        <div className="mt-6">
          <div
            className="flex flex-wrap gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Portfolio categories"
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? 'border-white/25 bg-[#26262a] text-white'
                      : 'border-white/12 bg-transparent text-white/70 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {cat}
                  <span className="ml-2 text-xs text-white/35">{counts.get(cat) ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-sm text-white/45" aria-live="polite">
          {loading
            ? 'Loading…'
            : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'}${
                active !== 'All' ? ` in ${active}` : ''
              }`}
        </p>

        {/* Masonry grid — mixed aspect ratios flow naturally in CSS columns */}
        {items.length > 0 ? (
          <div className="mt-4 columns-2 gap-2 sm:columns-2 sm:gap-4 md:columns-3 xl:columns-4">
            {items.map((item) => (
              <div key={item.id} className="break-inside-avoid">
                <PortfolioCard item={item} />
              </div>
            ))}
          </div>
        ) : loading ? null : (
          <div className="mt-16 rounded-2xl border border-white/12 py-20 text-center">
            <p className="text-lg text-white/70">Nothing matches that yet.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActive('All');
              }}
              className="mt-5 rounded-full bg-[#e8702a] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d2611f]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
