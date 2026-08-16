import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Download,
  Plus,
  LogOut,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import PortfolioCard from '../components/PortfolioCard';
import StudioLock from '../components/StudioLock';
import { currentSession, signOut } from '../lib/auth';
import {
  CATEGORIES,
  DEFAULT_PORTFOLIO,
  KIND_LABEL,
  type Category,
  type Kind,
  type PortfolioItem,
} from '../data/portfolio';
import {
  clearDraft,
  download,
  loadForEditor,
  makeId,
  publish,
  saveDraft,
  type Source,
} from '../lib/store';

const KINDS: Kind[] = ['reel', 'post', 'carousel', 'poster', 'video'];
const EDITABLE_CATEGORIES = CATEGORIES.filter((c) => c !== 'All') as Exclude<Category, 'All'>[];

const SURFACES = [
  { name: 'Slate', css: 'radial-gradient(120% 100% at 30% 20%, #7B8781, #303B36 55%, #171D1B)' },
  { name: 'Sand', css: 'linear-gradient(150deg,#8E8067,#463C2C 55%,#1B1712)' },
  { name: 'Ember', css: 'linear-gradient(160deg,#e8702a,#7a3712 58%,#241206)' },
  { name: 'Malachite', css: 'radial-gradient(100% 90% at 70% 80%, #4C6E63, #1E2C27 60%, #101614)' },
  { name: 'Steel', css: 'linear-gradient(200deg,#5F6E78,#2A343A 55%,#141A1E)' },
  { name: 'Limestone', css: 'linear-gradient(140deg,#C0BAAC,#6B665A 50%,#232019)' },
];

function blankItem(): PortfolioItem {
  return {
    id: makeId(),
    title: 'Untitled piece',
    client: 'Client name',
    category: 'Branding',
    kind: 'post',
    surface: SURFACES[0].css,
    year: new Date().getFullYear(),
    views: 0,
    trending: 50,
  };
}

const LABEL = 'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-white/45';
const INPUT =
  'w-full rounded-lg border border-white/12 bg-[#151515] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#e8702a] focus:outline-none';

export default function Admin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [source, setSource] = useState<Source>('default');
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [unlocked, setUnlocked] = useState(() => Boolean(currentSession()));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) return;
    document.title = 'Studio — Moving Stone';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    loadForEditor().then(({ items: loaded, source: src }) => {
      setItems(loaded);
      setSource(src);
      setSelectedId(loaded[0]?.id ?? null);
    });
    return () => {
      robots.remove();
    };
  }, [unlocked]);

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  const mutate = useCallback((next: PortfolioItem[]) => {
    setItems(next);
    setDirty(true);
    setStatus('');
  }, []);

  const update = useCallback(
    <K extends keyof PortfolioItem>(key: K, value: PortfolioItem[K]) => {
      if (!selectedId) return;
      mutate(items.map((i) => (i.id === selectedId ? { ...i, [key]: value } : i)));
    },
    [items, mutate, selectedId]
  );

  const addItem = useCallback(() => {
    const item = blankItem();
    mutate([item, ...items]);
    setSelectedId(item.id);
  }, [items, mutate]);

  const duplicate = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id);
      if (!found) return;
      const copy = { ...found, id: makeId(), title: `${found.title} (copy)` };
      const at = items.findIndex((i) => i.id === id);
      const next = [...items];
      next.splice(at + 1, 0, copy);
      mutate(next);
      setSelectedId(copy.id);
    },
    [items, mutate]
  );

  const remove = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id);
      if (!found) return;
      if (!window.confirm(`Delete “${found.title}”? This cannot be undone.`)) return;
      const next = items.filter((i) => i.id !== id);
      mutate(next);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
    },
    [items, mutate, selectedId]
  );

  const move = useCallback(
    (id: string, delta: number) => {
      const at = items.findIndex((i) => i.id === id);
      const to = at + delta;
      if (at < 0 || to < 0 || to >= items.length) return;
      const next = [...items];
      const [moved] = next.splice(at, 1);
      next.splice(to, 0, moved);
      mutate(next);
    },
    [items, mutate]
  );

  const onSaveDraft = useCallback(() => {
    const ok = saveDraft(items);
    setDirty(!ok);
    setSource('draft');
    setStatus(ok ? 'Draft saved in this browser.' : 'Could not save — storage is full or blocked.');
  }, [items]);

  const onPublish = useCallback(async () => {
    const password = currentSession();
    if (!password) {
      setUnlocked(false);
      return;
    }
    setStatus('Publishing…');
    const result = await publish(items, password);
    setStatus(result.message);
    if (result.ok) {
      setDirty(false);
      setSource('published');
    }
  }, [items]);

  const onImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (!Array.isArray(parsed)) throw new Error('not an array');
          mutate(parsed as PortfolioItem[]);
          setSelectedId((parsed as PortfolioItem[])[0]?.id ?? null);
          setStatus(`Imported ${parsed.length} items. Not saved yet.`);
        } catch {
          setStatus('That file is not valid portfolio JSON.');
        }
      };
      reader.readAsText(file);
    },
    [mutate]
  );

  const onReset = useCallback(() => {
    if (!window.confirm('Discard your draft and reload the shipped content?')) return;
    clearDraft();
    mutate(DEFAULT_PORTFOLIO);
    setSelectedId(DEFAULT_PORTFOLIO[0]?.id ?? null);
    setDirty(false);
    setSource('default');
    setStatus('Reset to the shipped content.');
  }, [mutate]);

  if (!unlocked) return <StudioLock onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="mr-auto">
            <h1 className="text-lg font-semibold" style={{ letterSpacing: '-0.03em' }}>
              Portfolio studio
            </h1>
            <p className="text-xs text-white/40">
              {items.length} items · showing {source}
              {dirty ? ' · unsaved changes' : ''}
            </p>
          </div>

          <button type="button" onClick={addItem} className={btn('primary')}>
            <Plus size={15} /> Add
          </button>
          <button type="button" onClick={onSaveDraft} className={btn()}>
            <Check size={15} /> Save draft
          </button>
          <button type="button" onClick={() => download(items)} className={btn()}>
            <Download size={15} /> Export
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className={btn()}>
            <Upload size={15} /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = '';
            }}
          />
          <button type="button" onClick={onReset} className={btn()}>
            <RotateCcw size={15} /> Reset
          </button>
          <Link to="/portfolio" className={btn()}>
            View site
          </Link>
        </div>

        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 pb-3 sm:px-6">
          <button type="button" onClick={onPublish} className={btn('primary')}>
            Publish live
          </button>
          <button
            type="button"
            onClick={() => {
              signOut();
              setUnlocked(false);
            }}
            className={btn()}
          >
            <LogOut size={15} /> Sign out
          </button>
          {status ? <p className="text-xs text-[#e8702a]">{status}</p> : null}
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        {/* List */}
        <aside className="lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
          <ul className="list-none space-y-1.5 p-0">
            {items.map((item, index) => {
              const isSel = item.id === selectedId;
              return (
                <li key={item.id}>
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${
                      isSel
                        ? 'border-[#e8702a]/60 bg-[#e8702a]/10'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm">{item.title}</p>
                      <p className="truncate text-[11px] text-white/40">
                        {item.category} · {KIND_LABEL[item.kind]}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(item.id, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="rounded p-1 text-white/45 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(item.id, 1)}
                        disabled={index === items.length - 1}
                        aria-label="Move down"
                        className="rounded p-1 text-white/45 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicate(item.id)}
                        aria-label="Duplicate"
                        className="rounded p-1 text-white/45 hover:text-white"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label="Delete"
                        className="rounded p-1 text-white/45 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Editor */}
        <main>
          {selected ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="f-title">
                  Title
                </label>
                <input
                  id="f-title"
                  className={INPUT}
                  value={selected.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="f-client">
                  Client
                </label>
                <input
                  id="f-client"
                  className={INPUT}
                  value={selected.client}
                  onChange={(e) => update('client', e.target.value)}
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="f-cat">
                  Category
                </label>
                <select
                  id="f-cat"
                  className={INPUT}
                  value={selected.category}
                  onChange={(e) =>
                    update('category', e.target.value as Exclude<Category, 'All'>)
                  }
                >
                  {EDITABLE_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#151515]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL} htmlFor="f-kind">
                  Format (sets aspect ratio)
                </label>
                <select
                  id="f-kind"
                  className={INPUT}
                  value={selected.kind}
                  onChange={(e) => update('kind', e.target.value as Kind)}
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k} className="bg-[#151515]">
                      {KIND_LABEL[k]} — {ratioHint(k)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL} htmlFor="f-duration">
                  Duration (videos only)
                </label>
                <input
                  id="f-duration"
                  className={INPUT}
                  placeholder="0:24"
                  value={selected.duration ?? ''}
                  onChange={(e) => update('duration', e.target.value || undefined)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="f-image">
                  Image URL
                </label>
                <input
                  id="f-image"
                  className={INPUT}
                  placeholder="/work/cantera-01.jpg or https://…"
                  value={selected.image ?? ''}
                  onChange={(e) => update('image', e.target.value || undefined)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="f-src">
                  Video URL
                </label>
                <input
                  id="f-src"
                  className={INPUT}
                  placeholder="/work/reel-01.mp4 or https://…"
                  value={selected.src ?? ''}
                  onChange={(e) => update('src', e.target.value || undefined)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="f-surface">
                  Fallback surface (shown when there is no image)
                </label>
                <input
                  id="f-surface"
                  className={INPUT}
                  value={selected.surface}
                  onChange={(e) => update('surface', e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {SURFACES.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => update('surface', s.css)}
                      className="h-8 w-14 rounded-md border border-white/15"
                      style={{ background: s.css }}
                      aria-label={`Use ${s.name} surface`}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="f-year">
                  Year
                </label>
                <input
                  id="f-year"
                  type="number"
                  className={INPUT}
                  value={selected.year}
                  onChange={(e) => update('year', Number(e.target.value))}
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="f-views">
                  Views (sorting only)
                </label>
                <input
                  id="f-views"
                  type="number"
                  className={INPUT}
                  value={selected.views}
                  onChange={(e) => update('views', Number(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="f-trending">
                  Trending weight — {selected.trending}
                </label>
                <input
                  id="f-trending"
                  type="range"
                  min={0}
                  max={100}
                  className="w-full accent-[#e8702a]"
                  value={selected.trending}
                  onChange={(e) => update('trending', Number(e.target.value))}
                />
              </div>
            </div>
          ) : (
            <p className="text-white/50">No items yet. Use Add to create one.</p>
          )}
        </main>

        {/* Live preview */}
        <aside>
          <p className={LABEL}>Live preview</p>
          {selected ? <PortfolioCard item={selected} /> : null}
        </aside>
      </div>
    </div>
  );
}

function ratioHint(kind: Kind): string {
  if (kind === 'reel') return '9:16';
  if (kind === 'post') return '1:1';
  if (kind === 'carousel') return '4:5';
  if (kind === 'poster') return '2:3';
  return '16:9';
}

function btn(variant?: 'primary'): string {
  const base =
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
  return variant === 'primary'
    ? `${base} bg-[#e8702a] text-white hover:bg-[#d2611f]`
    : `${base} border border-white/15 text-white/80 hover:border-white/35 hover:text-white`;
}
