# Portfolio CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a portfolio CMS a non-technical studio owner can operate — an `/admin` editor with drag-and-drop uploads and a public `/work` grid — with no code, URLs, or deploys involved in publishing.

**Architecture:** Next.js 16 App Router. Content lives in Vercel Blob at a fixed key, with a committed JSON file as a read-time fallback so the public site never breaks. Media uploads go browser-direct to Blob via short-lived tokens, bypassing the serverless body limit. Auth is a server-verified HMAC session cookie.

**Tech Stack:** Next.js 16.2.6, React 19.2.4, TypeScript 5, `@vercel/blob` 2.8.0, `node:test` (Node 24 native, no test framework).

## Global Constraints

- **Next 16 App Router conventions.** API routes are `src/app/api/<name>/route.ts`. Not `api/portfolio.ts` — that convention from `CMS.md` is wrong for this stack.
- **`cookies()` is async.** Always `await cookies()`.
- **Cache invalidation uses a fetch tag,** not `use cache`. The Blob read is tagged `'portfolio'` and publish calls `revalidateTag('portfolio')`. This sidesteps the Next 16 rule that `use cache` cannot appear in a route handler body.
- **No Tailwind exists.** Style with inline styles and `src/app/globals.css`, using existing CSS variables: `--bg #111111`, `--bg-panel #1a1a1a`, `--border #333333`, `--text-secondary #999999`, `--text-muted #666666`, `--font-sans` Inter.
- **`@vercel/blob` 2.8.0 defaults:** `addRandomSuffix` defaults to `false`, `allowOverwrite` defaults to `false`. Publishing to a fixed key **must** pass `allowOverwrite: true` or the second publish fails.
- **Blob keys:** published data at `portfolio/data.json`; uploaded media under `portfolio/media/`.
- **Fallback JSON is a static `import`,** never an `fs` read — it must be bundled for serverless.
- **Copy rule — no jargon in operator-facing text.** No "URL", "JSON", "API", "blob", "commit", "deploy", "payload" in any string the studio owner reads. Errors say what to do next.
- **Tests are `node:test`,** run with `node --test`. Pure logic only; no browser tests.
- **Secrets never reach the client.** `ADMIN_PASSWORD` and `BLOB_READ_WRITE_TOKEN` are server-only, never in a `NEXT_PUBLIC_` variable.

## File Structure

| File | Responsibility |
| --- | --- |
| `src/lib/portfolio/types.ts` | `PortfolioItem`, `Format`, `Category` — shared contract |
| `src/lib/portfolio/defaults.ts` | `FORMATS`, `GRADIENTS`, `CATEGORIES`, `emptyItem()` |
| `src/lib/portfolio/validate.ts` | `parsePortfolio()` — runtime validation |
| `src/lib/portfolio/store.ts` | `getPortfolio()`, `savePortfolio()` — Blob with fallback |
| `src/lib/portfolio/auth.ts` | `signSession()`, `verifySession()`, `checkPassword()` |
| `src/app/api/auth/route.ts` | POST sign in, DELETE sign out |
| `src/app/api/portfolio/route.ts` | GET published data, POST publish |
| `src/app/api/upload/route.ts` | POST issue client upload token |
| `src/components/portfolio/PortfolioCard.tsx` | One card — shared by grid and editor preview |
| `src/components/portfolio/PortfolioGrid.tsx` | Grid + category filter pills |
| `src/app/work/page.tsx` | Public page |
| `src/components/admin/PasswordGate.tsx` | Sign-in screen |
| `src/components/admin/UploadField.tsx` | Dropzone, progress, thumbnail |
| `src/components/admin/FormatPicker.tsx` | Five clickable shape outlines |
| `src/components/admin/ItemForm.tsx` | The field form |
| `src/components/admin/ItemList.tsx` | List, reorder, delete |
| `src/components/admin/Editor.tsx` | State owner, draft autosave, publish |
| `src/app/admin/page.tsx` | Route shell |
| `data/portfolio.json` | Committed baseline |

---

### Task 1: Foundation — config, types, defaults

Removes static export (which makes every later task possible) and establishes the shared contract.

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json` (add `test` script)
- Create: `src/lib/portfolio/types.ts`
- Create: `src/lib/portfolio/defaults.ts`
- Create: `data/portfolio.json`
- Test: `src/lib/portfolio/defaults.test.ts`

**Interfaces:**
- Produces: `PortfolioItem`, `Format`, `Category`, `FORMATS`, `GRADIENTS`, `CATEGORIES`, `emptyItem()`

- [ ] **Step 1: Remove static export**

`next.config.ts` — replace entire contents:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "node --test"
```

Node 24 discovers `*.test.ts` files itself and strips TypeScript natively. Do
not add a glob — shell globbing differs between PowerShell and bash and would
break the command on Windows.

- [ ] **Step 3: Write the failing test**

Create `src/lib/portfolio/defaults.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FORMATS, GRADIENTS, CATEGORIES, emptyItem } from './defaults.ts';

test('every format has a label and a CSS aspect ratio', () => {
  const keys = Object.keys(FORMATS);
  assert.deepEqual(keys, ['reel', 'post', 'carousel', 'poster', 'film']);
  for (const key of keys) {
    const f = FORMATS[key as keyof typeof FORMATS];
    assert.ok(f.label.length > 0);
    assert.match(f.aspectRatio, /^\d+ \/ \d+$/);
  }
});

test('reel is portrait and film is landscape', () => {
  assert.equal(FORMATS.reel.aspectRatio, '9 / 16');
  assert.equal(FORMATS.film.aspectRatio, '16 / 9');
});

test('there are six gradient presets, each a CSS gradient', () => {
  assert.equal(GRADIENTS.length, 6);
  for (const g of GRADIENTS) {
    assert.ok(g.name.length > 0);
    assert.match(g.value, /gradient\(/);
  }
});

test('emptyItem produces a unique id and safe defaults', () => {
  const a = emptyItem();
  const b = emptyItem();
  assert.notEqual(a.id, b.id);
  assert.equal(a.title, '');
  assert.equal(a.format, 'reel');
  assert.equal(a.gradient, GRADIENTS[0].value);
  assert.ok(CATEGORIES.includes(a.category));
});
```

- [ ] **Step 4: Run it and watch it fail**

Run: `npm test`
Expected: FAIL — cannot find module `./defaults.ts`

- [ ] **Step 5: Write the types**

Create `src/lib/portfolio/types.ts`:

```ts
export type Format = 'reel' | 'post' | 'carousel' | 'poster' | 'film';

export type Category =
  | 'Commercial'
  | 'Music Video'
  | 'Documentary'
  | 'Branded'
  | 'Personal';

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: Category;
  format: Format;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  gradient: string;
  year: string;
}
```

- [ ] **Step 6: Write the defaults**

Create `src/lib/portfolio/defaults.ts`:

```ts
import type { Category, Format, PortfolioItem } from './types.ts';

export const FORMATS: Record<Format, { label: string; aspectRatio: string }> = {
  reel:     { label: 'Reel',     aspectRatio: '9 / 16' },
  post:     { label: 'Post',     aspectRatio: '1 / 1'  },
  carousel: { label: 'Carousel', aspectRatio: '4 / 5'  },
  poster:   { label: 'Poster',   aspectRatio: '2 / 3'  },
  film:     { label: 'Film',     aspectRatio: '16 / 9' },
};

export const GRADIENTS: { name: string; value: string }[] = [
  { name: 'Ember',    value: 'linear-gradient(135deg, #ff5500, #ffaa00)' },
  { name: 'Violet',   value: 'linear-gradient(135deg, #7e6ba8, #3a2f5c)' },
  { name: 'Slate',    value: 'linear-gradient(135deg, #3a3a3a, #111111)' },
  { name: 'Sea',      value: 'linear-gradient(135deg, #1e6f7a, #0d2b33)' },
  { name: 'Rose',     value: 'linear-gradient(135deg, #d1495b, #5c1a24)' },
  { name: 'Sand',     value: 'linear-gradient(135deg, #c9a227, #6b5310)' },
];

export const CATEGORIES: Category[] = [
  'Commercial',
  'Music Video',
  'Documentary',
  'Branded',
  'Personal',
];

export function emptyItem(): PortfolioItem {
  return {
    id: crypto.randomUUID(),
    title: '',
    client: '',
    category: 'Commercial',
    format: 'reel',
    duration: '',
    imageUrl: '',
    videoUrl: '',
    gradient: GRADIENTS[0].value,
    year: String(new Date().getFullYear()),
  };
}
```

- [ ] **Step 7: Create the baseline content file**

Create `data/portfolio.json`:

```json
{
  "items": [
    {
      "id": "sample-1",
      "title": "Northern Lines",
      "client": "Atlas Studio",
      "category": "Commercial",
      "format": "reel",
      "duration": "0:30",
      "imageUrl": "",
      "videoUrl": "",
      "gradient": "linear-gradient(135deg, #ff5500, #ffaa00)",
      "year": "2026"
    }
  ]
}
```

- [ ] **Step 8: Run tests and confirm they pass**

Run: `npm test`
Expected: PASS — 4 tests

- [ ] **Step 9: Commit**

```bash
git add next.config.ts package.json src/lib/portfolio data/portfolio.json
git commit -m "feat: portfolio types and defaults, drop static export"
```

---

### Task 2: Validation

Guards every publish. Must name the offending field so the editor can show a useful message.

**Files:**
- Create: `src/lib/portfolio/validate.ts`
- Test: `src/lib/portfolio/validate.test.ts`

**Interfaces:**
- Consumes: `PortfolioItem`, `FORMATS`, `CATEGORIES` from Task 1
- Produces: `parsePortfolio(input: unknown): { ok: true; items: PortfolioItem[] } | { ok: false; error: string }`

- [ ] **Step 1: Write the failing test**

Create `src/lib/portfolio/validate.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePortfolio } from './validate.ts';

const valid = {
  id: 'a1', title: 'Film One', client: 'Acme', category: 'Commercial',
  format: 'reel', duration: '0:30', imageUrl: '', videoUrl: '',
  gradient: 'linear-gradient(135deg, #ff5500, #ffaa00)', year: '2026',
};

test('accepts a well-formed list', () => {
  const result = parsePortfolio({ items: [valid] });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].title, 'Film One');
  }
});

test('accepts an empty list', () => {
  const result = parsePortfolio({ items: [] });
  assert.equal(result.ok, true);
});

test('rejects a non-object', () => {
  assert.equal(parsePortfolio(null).ok, false);
  assert.equal(parsePortfolio('nope').ok, false);
});

test('rejects a missing items array', () => {
  const result = parsePortfolio({});
  assert.equal(result.ok, false);
});

test('rejects an unknown format and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, format: 'banana' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /format/i);
});

test('rejects an unknown category and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, category: 'Nope' }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /category/i);
});

test('rejects a missing title and names the field', () => {
  const result = parsePortfolio({ items: [{ ...valid, title: 123 }] });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /title/i);
});

test('strips unexpected properties', () => {
  const result = parsePortfolio({ items: [{ ...valid, sneaky: 'x' }] });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal('sneaky' in result.items[0], false);
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`
Expected: FAIL — cannot find module `./validate.ts`

- [ ] **Step 3: Implement**

Create `src/lib/portfolio/validate.ts`:

```ts
import type { Category, Format, PortfolioItem } from './types.ts';
import { CATEGORIES, FORMATS } from './defaults.ts';

type Result =
  | { ok: true; items: PortfolioItem[] }
  | { ok: false; error: string };

function str(v: unknown): v is string {
  return typeof v === 'string';
}

export function parsePortfolio(input: unknown): Result {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Expected an object.' };
  }
  const raw = (input as { items?: unknown }).items;
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Expected an "items" array.' };
  }

  const items: PortfolioItem[] = [];

  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    const at = `Item ${i + 1}`;

    if (typeof it !== 'object' || it === null) {
      return { ok: false, error: `${at} is not valid.` };
    }
    const o = it as Record<string, unknown>;

    for (const field of ['id', 'title', 'client', 'duration', 'imageUrl', 'videoUrl', 'gradient', 'year']) {
      if (!str(o[field])) {
        return { ok: false, error: `${at}: "${field}" must be text.` };
      }
    }
    if (!str(o.format) || !(o.format in FORMATS)) {
      return { ok: false, error: `${at}: "format" is not a known format.` };
    }
    if (!str(o.category) || !CATEGORIES.includes(o.category as Category)) {
      return { ok: false, error: `${at}: "category" is not a known category.` };
    }

    items.push({
      id: o.id as string,
      title: o.title as string,
      client: o.client as string,
      category: o.category as Category,
      format: o.format as Format,
      duration: o.duration as string,
      imageUrl: o.imageUrl as string,
      videoUrl: o.videoUrl as string,
      gradient: o.gradient as string,
      year: o.year as string,
    });
  }

  return { ok: true, items };
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `npm test`
Expected: PASS — 12 tests total

- [ ] **Step 5: Commit**

```bash
git add src/lib/portfolio/validate.ts src/lib/portfolio/validate.test.ts
git commit -m "feat: portfolio payload validation"
```

---

### Task 3: Store — Blob read with fallback

The public site must survive Blob being unreachable.

**Files:**
- Create: `src/lib/portfolio/store.ts`
- Test: `src/lib/portfolio/store.test.ts`

**Interfaces:**
- Consumes: `parsePortfolio` (Task 2), `PortfolioItem` (Task 1)
- Produces: `readPortfolioFrom(fetchJson): Promise<PortfolioItem[]>` (pure, testable), `getPortfolio(): Promise<PortfolioItem[]>`, `savePortfolio(items): Promise<void>`, `BLOB_DATA_KEY`

**Note on testability:** `readPortfolioFrom` takes its fetcher as an argument so the fallback path can be tested without network or Blob credentials. `getPortfolio` is the thin production wrapper.

- [ ] **Step 1: Write the failing test**

Create `src/lib/portfolio/store.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPortfolioFrom } from './store.ts';

const remote = {
  items: [{
    id: 'r1', title: 'From Storage', client: 'Acme', category: 'Commercial',
    format: 'film', duration: '', imageUrl: '', videoUrl: '',
    gradient: 'linear-gradient(135deg, #ff5500, #ffaa00)', year: '2026',
  }],
};

test('returns remote items when the fetch succeeds', async () => {
  const items = await readPortfolioFrom(async () => remote);
  assert.equal(items[0].title, 'From Storage');
});

test('falls back to bundled content when the fetch throws', async () => {
  const items = await readPortfolioFrom(async () => { throw new Error('offline'); });
  assert.ok(items.length > 0);
  assert.equal(items[0].title, 'Northern Lines');
});

test('falls back when the fetch returns nothing', async () => {
  const items = await readPortfolioFrom(async () => null);
  assert.equal(items[0].title, 'Northern Lines');
});

test('falls back when remote content is malformed', async () => {
  const items = await readPortfolioFrom(async () => ({ items: [{ bad: true }] }));
  assert.equal(items[0].title, 'Northern Lines');
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`
Expected: FAIL — cannot find module `./store.ts`

- [ ] **Step 3: Implement**

Create `src/lib/portfolio/store.ts`:

```ts
import { put } from '@vercel/blob';
import type { PortfolioItem } from './types.ts';
import { parsePortfolio } from './validate.ts';
import bundled from '../../../data/portfolio.json' with { type: 'json' };

export const BLOB_DATA_KEY = 'portfolio/data.json';

function fallbackItems(): PortfolioItem[] {
  const parsed = parsePortfolio(bundled);
  return parsed.ok ? parsed.items : [];
}

/**
 * Reads published content, falling back to the bundled file whenever the
 * remote copy is missing, unreachable, or malformed. Never throws.
 */
export async function readPortfolioFrom(
  fetchJson: () => Promise<unknown>,
): Promise<PortfolioItem[]> {
  try {
    const raw = await fetchJson();
    if (!raw) return fallbackItems();
    const parsed = parsePortfolio(raw);
    return parsed.ok ? parsed.items : fallbackItems();
  } catch {
    return fallbackItems();
  }
}

async function fetchFromBlob(): Promise<unknown> {
  const base = process.env.BLOB_PUBLIC_BASE_URL;
  if (!base) return null;
  const res = await fetch(`${base}/${BLOB_DATA_KEY}`, {
    next: { tags: ['portfolio'] },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return readPortfolioFrom(fetchFromBlob);
}

export async function savePortfolio(items: PortfolioItem[]): Promise<void> {
  await put(BLOB_DATA_KEY, JSON.stringify({ items }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `npm test`
Expected: PASS — 16 tests total

- [ ] **Step 5: Commit**

```bash
git add src/lib/portfolio/store.ts src/lib/portfolio/store.test.ts
git commit -m "feat: portfolio store with fallback to bundled content"
```

---

### Task 4: Auth

The real security boundary. Timing-safe comparison, HMAC session cookie.

**Files:**
- Create: `src/lib/portfolio/auth.ts`
- Test: `src/lib/portfolio/auth.test.ts`

**Interfaces:**
- Produces: `checkPassword(supplied, actual): boolean`, `signSession(secret, issuedAt): string`, `verifySession(token, secret, now?): boolean`, `SESSION_COOKIE`, `SESSION_MAX_AGE`

- [ ] **Step 1: Write the failing test**

Create `src/lib/portfolio/auth.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPassword, signSession, verifySession, SESSION_MAX_AGE } from './auth.ts';

test('accepts the correct password', () => {
  assert.equal(checkPassword('hunter2', 'hunter2'), true);
});

test('rejects a wrong password', () => {
  assert.equal(checkPassword('wrong', 'hunter2'), false);
});

test('rejects passwords of differing length without throwing', () => {
  assert.equal(checkPassword('short', 'a-much-longer-password'), false);
});

test('rejects an empty supplied password', () => {
  assert.equal(checkPassword('', 'hunter2'), false);
});

test('a freshly signed session verifies', () => {
  const now = Date.now();
  const token = signSession('secret', now);
  assert.equal(verifySession(token, 'secret', now), true);
});

test('a session signed with another secret fails', () => {
  const now = Date.now();
  const token = signSession('secret-a', now);
  assert.equal(verifySession(token, 'secret-b', now), false);
});

test('an expired session fails', () => {
  const issued = Date.now();
  const token = signSession('secret', issued);
  const later = issued + (SESSION_MAX_AGE + 60) * 1000;
  assert.equal(verifySession(token, 'secret', later), false);
});

test('a tampered session fails', () => {
  const now = Date.now();
  const token = signSession('secret', now);
  const [ts] = token.split('.');
  assert.equal(verifySession(`${ts}.deadbeef`, 'secret', now), false);
});

test('malformed tokens fail without throwing', () => {
  assert.equal(verifySession('', 'secret'), false);
  assert.equal(verifySession('no-dot', 'secret'), false);
  assert.equal(verifySession('a.b.c', 'secret'), false);
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test`
Expected: FAIL — cannot find module `./auth.ts`

- [ ] **Step 3: Implement**

Create `src/lib/portfolio/auth.ts`:

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'ms_session';
/** Eight hours, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 8;

/** Constant-time password comparison. Length differences do not throw. */
export function checkPassword(supplied: string, actual: string): boolean {
  if (!supplied || !actual) return false;
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(actual, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** Token format: "<issuedAtMs>.<hmac>" */
export function signSession(secret: string, issuedAt: number = Date.now()): string {
  const ts = String(issuedAt);
  return `${ts}.${sign(ts, secret)}`;
}

export function verifySession(
  token: string | undefined,
  secret: string,
  now: number = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [ts, mac] = parts;
  if (!/^\d+$/.test(ts)) return false;

  const expected = sign(ts, secret);
  const a = Buffer.from(mac, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const age = (now - Number(ts)) / 1000;
  return age >= 0 && age < SESSION_MAX_AGE;
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `npm test`
Expected: PASS — 25 tests total

- [ ] **Step 5: Commit**

```bash
git add src/lib/portfolio/auth.ts src/lib/portfolio/auth.test.ts
git commit -m "feat: timing-safe password check and signed sessions"
```

---

### Task 5: API routes

**Files:**
- Create: `src/app/api/auth/route.ts`
- Create: `src/app/api/portfolio/route.ts`
- Create: `src/app/api/upload/route.ts`

**Interfaces:**
- Consumes: everything from Tasks 1–4
- Produces: `requireSession(): Promise<boolean>` exported from `src/lib/portfolio/session.ts`

- [ ] **Step 1: Create the shared session reader**

Create `src/lib/portfolio/session.ts`:

```ts
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from './auth.ts';

/** True when the caller holds a valid session. Server-only. */
export async function requireSession(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value, secret);
}
```

- [ ] **Step 2: Create the auth route**

Create `src/app/api/auth/route.ts`:

```ts
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  signSession,
} from '@/lib/portfolio/auth';

export async function POST(request: Request) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return Response.json(
      { error: 'The studio is not set up yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 400 });
  }

  if (!checkPassword(password, secret)) {
    return Response.json({ error: 'That password is not right.' }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Create the portfolio route**

Create `src/app/api/portfolio/route.ts`:

```ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { getPortfolio, savePortfolio } from '@/lib/portfolio/store';
import { parsePortfolio } from '@/lib/portfolio/validate';
import { requireSession } from '@/lib/portfolio/session';

export async function GET() {
  const items = await getPortfolio();
  return Response.json({ items });
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return Response.json({ error: 'Please sign in again.' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Storage is not connected yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 400 });
  }

  const parsed = parsePortfolio(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await savePortfolio(parsed.items);
  } catch {
    return Response.json(
      { error: 'Could not save right now. Check your connection and try again.' },
      { status: 502 },
    );
  }

  revalidateTag('portfolio');
  revalidatePath('/work');
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Create the upload route**

Create `src/app/api/upload/route.ts`:

```ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireSession } from '@/lib/portfolio/session';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Storage is not connected yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await requireSession())) {
          throw new Error('Not signed in.');
        }
        return {
          allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do — the editor records the returned address itself.
      },
    });
    return Response.json(result);
  } catch {
    return Response.json(
      { error: 'That upload did not go through. Try again.' },
      { status: 400 },
    );
  }
}
```

- [ ] **Step 5: Verify the app compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/portfolio/session.ts src/app/api
git commit -m "feat: auth, portfolio and upload API routes"
```

---

### Task 6: Public card and grid

Built before the editor because the editor's live preview reuses `PortfolioCard`.

**Files:**
- Create: `src/components/portfolio/PortfolioCard.tsx`
- Create: `src/components/portfolio/PortfolioGrid.tsx`
- Create: `src/app/work/page.tsx`
- Modify: `src/app/globals.css` (append portfolio styles)

**Interfaces:**
- Consumes: `PortfolioItem`, `FORMATS`, `CATEGORIES`, `getPortfolio`
- Produces: `<PortfolioCard item preview? />`, `<PortfolioGrid items />`

- [ ] **Step 1: Build the card**

Create `src/components/portfolio/PortfolioCard.tsx`:

```tsx
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
```

- [ ] **Step 2: Build the grid**

Create `src/components/portfolio/PortfolioGrid.tsx`:

```tsx
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
```

- [ ] **Step 3: Build the page**

Create `src/app/work/page.tsx`:

```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { getPortfolio } from '@/lib/portfolio/store';

export const metadata = { title: 'Work — Moving Stone' };

export default async function WorkPage() {
  const items = await getPortfolio();

  return (
    <>
      <Header />
      <main className="pf-page">
        <div className="container">
          <h1 className="display-sm pf-heading">Work</h1>
          <PortfolioGrid items={items} />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Add the styles**

Append to `src/app/globals.css`:

```css
/* ---------- Portfolio ---------- */
.pf-page { padding: 8rem 0 6rem; scroll-snap-align: none; }
.pf-heading { margin-bottom: 2.5rem; }

.pf-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }
.pf-pill {
  padding: 0.5rem 1rem; font-size: 0.75rem; letter-spacing: 0.08em;
  text-transform: uppercase; border: 1px solid var(--border);
  color: var(--text-secondary); border-radius: 999px; transition: all 0.2s;
}
.pf-pill:hover { color: var(--text-primary); border-color: var(--text-muted); }
.pf-pill.is-active { background: var(--text-primary); color: var(--bg); border-color: var(--text-primary); }

.pf-grid {
  display: grid; gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  align-items: start;
}

.pf-card {
  position: relative; overflow: hidden; border-radius: 4px;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.pf-media {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; transition: opacity 0.4s;
}
.pf-card::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%);
}
.pf-badge {
  position: absolute; top: 0.75rem; right: 0.75rem; z-index: 2;
  background: rgba(0,0,0,0.6); color: #fff; font-size: 0.7rem;
  padding: 0.15rem 0.5rem; border-radius: 3px;
}
.pf-meta { position: relative; z-index: 2; padding: 1.25rem; }
.pf-category {
  font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}
.pf-title { font-size: 1.1rem; color: #fff; margin-top: 0.25rem; }
.pf-client { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
.pf-empty { color: var(--text-muted); padding: 3rem 0; }
```

- [ ] **Step 5: Verify it renders**

Run: `npm run dev`, open `http://localhost:3000/work`
Expected: the "Northern Lines" sample card renders on an orange gradient at 9:16. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio src/app/work src/app/globals.css
git commit -m "feat: public work page with filterable portfolio grid"
```

---

### Task 7: Upload field and format picker

The two components that carry most of the non-technical requirement.

**Files:**
- Create: `src/components/admin/UploadField.tsx`
- Create: `src/components/admin/FormatPicker.tsx`
- Modify: `src/app/globals.css` (append admin styles)

**Interfaces:**
- Produces: `<UploadField label hint kind value onChange />` where `kind` is `'image' | 'video'`; `<FormatPicker value onChange />`

- [ ] **Step 1: Build the upload field**

Create `src/components/admin/UploadField.tsx`:

```tsx
'use client';

import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

const LIMITS = {
  image: { bytes: 10 * 1024 * 1024, label: '10MB', accept: 'image/*' },
  video: { bytes: 100 * 1024 * 1024, label: '100MB', accept: 'video/*' },
};

interface Props {
  label: string;
  hint: string;
  kind: 'image' | 'video';
  value: string;
  onChange: (url: string) => void;
}

export function UploadField({ label, hint, kind, value, onChange }: Props) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = LIMITS[kind];

  async function handleFile(file: File) {
    setError('');

    if (file.size > limit.bytes) {
      setError(`That file is too big. Try one under ${limit.label}.`);
      return;
    }

    setProgress(0);
    try {
      const result = await upload(`portfolio/media/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      onChange(result.url);
      setProgress(null);
    } catch {
      setProgress(null);
      setError('That upload did not go through. Check your connection and try again.');
    }
  }

  return (
    <div className="ad-field">
      <label className="ad-label">{label}</label>
      <p className="ad-hint">{hint}</p>

      {value ? (
        <div className="ad-preview">
          {kind === 'image'
            ? <img src={value} alt="" className="ad-thumb" />
            : <video src={value} className="ad-thumb" muted />}
          <button type="button" className="ad-remove" onClick={() => onChange('')}>
            Remove
          </button>
        </div>
      ) : (
        <div
          className={`ad-drop${dragging ? ' is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          {progress === null ? (
            <>
              <strong>Drop a file here</strong>
              <span>or click to choose one — up to {limit.label}</span>
            </>
          ) : (
            <>
              <span>Uploading… {Math.round(progress)}%</span>
              <div className="ad-bar"><div style={{ width: `${progress}%` }} /></div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={limit.accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {error && <p className="ad-error">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Build the format picker**

Create `src/components/admin/FormatPicker.tsx`:

```tsx
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
```

- [ ] **Step 3: Add admin styles**

Append to `src/app/globals.css`:

```css
/* ---------- Admin ---------- */
.ad-field { margin-bottom: 1.75rem; }
.ad-label {
  display: block; font-size: 0.75rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-primary); margin-bottom: 0.25rem;
}
.ad-hint { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem; }
.ad-error { font-size: 0.8rem; color: #ff6b6b; margin-top: 0.5rem; }

.ad-input, .ad-select {
  width: 100%; padding: 0.7rem 0.85rem; background: var(--bg);
  border: 1px solid var(--border); color: var(--text-primary);
  font-family: inherit; font-size: 0.95rem; border-radius: 3px;
}
.ad-input:focus, .ad-select:focus { outline: none; border-color: var(--text-muted); }

.ad-drop {
  border: 1px dashed var(--border); border-radius: 4px; padding: 2rem 1rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  text-align: center; cursor: pointer; transition: all 0.2s;
  color: var(--text-secondary); font-size: 0.85rem;
}
.ad-drop:hover, .ad-drop.is-dragging { border-color: var(--text-primary); background: var(--bg-panel); }
.ad-bar { width: 100%; height: 3px; background: var(--border); margin-top: 0.6rem; }
.ad-bar > div { height: 100%; background: var(--text-primary); transition: width 0.2s; }

.ad-preview { position: relative; display: inline-block; }
.ad-thumb { max-height: 140px; border-radius: 3px; border: 1px solid var(--border); }
.ad-remove {
  display: block; margin-top: 0.5rem; font-size: 0.75rem;
  color: var(--text-muted); text-decoration: underline;
}
.ad-remove:hover { color: var(--text-primary); }

.ad-formats { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.ad-format {
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--text-muted); width: 64px;
}
.ad-format-shape {
  width: 100%; max-height: 56px; border: 1px solid var(--border);
  border-radius: 2px; transition: all 0.2s;
}
.ad-format:hover .ad-format-shape { border-color: var(--text-secondary); }
.ad-format.is-active { color: var(--text-primary); }
.ad-format.is-active .ad-format-shape { border-color: var(--text-primary); background: rgba(255,255,255,0.08); }
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/admin src/app/globals.css
git commit -m "feat: upload dropzone and visual format picker"
```

---

### Task 8: The editor

**Files:**
- Create: `src/components/admin/ItemForm.tsx`
- Create: `src/components/admin/ItemList.tsx`
- Create: `src/components/admin/PasswordGate.tsx`
- Create: `src/components/admin/Editor.tsx`
- Create: `src/app/admin/page.tsx`
- Modify: `src/app/globals.css` (append editor layout)

**Interfaces:**
- Consumes: `UploadField`, `FormatPicker` (Task 7), `PortfolioCard` (Task 6), all lib modules

- [ ] **Step 1: Build the form**

Create `src/components/admin/ItemForm.tsx`:

```tsx
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
```

- [ ] **Step 2: Build the list**

Create `src/components/admin/ItemList.tsx`:

```tsx
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
          onClick={() => onSelect(item.id)}
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
```

- [ ] **Step 3: Build the password gate**

Create `src/components/admin/PasswordGate.tsx`:

```tsx
'use client';

import React, { useState } from 'react';

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onUnlock();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'That password is not right.');
      }
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ad-gate">
      <form className="ad-gate-box" onSubmit={submit}>
        <h1 className="ad-gate-title">Studio</h1>
        <p className="ad-hint">Enter your password to manage your work.</p>
        <input
          className="ad-input" type="password" value={password} autoFocus
          onChange={(e) => setPassword(e.target.value)} placeholder="Password"
        />
        <button className="btn btn-light" type="submit" disabled={busy || !password}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        {error && <p className="ad-error">{error}</p>}
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Build the editor shell**

Create `src/components/admin/Editor.tsx`:

```tsx
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
```

- [ ] **Step 5: Build the route**

Create `src/app/admin/page.tsx`:

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import type { PortfolioItem } from '@/lib/portfolio/types';
import { Editor } from '@/components/admin/Editor';
import { PasswordGate } from '@/components/admin/PasswordGate';

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<PortfolioItem[] | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, [unlocked]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  if (!items) return <div className="ad-gate"><p className="ad-hint">Loading…</p></div>;
  return <Editor initialItems={items} />;
}
```

- [ ] **Step 6: Add editor layout styles**

Append to `src/app/globals.css`:

```css
/* ---------- Admin layout ---------- */
.ad-shell {
  display: grid; grid-template-columns: 260px 1fr 320px;
  min-height: 100vh; background: var(--bg);
}
@media (max-width: 1100px) { .ad-shell { grid-template-columns: 1fr; } }

.ad-side { border-right: 1px solid var(--border); padding: 1.5rem 1rem; }
.ad-main { padding: 2rem; max-width: 640px; }
.ad-preview-pane { border-left: 1px solid var(--border); padding: 1.5rem; }

.ad-add {
  width: 100%; padding: 0.7rem; border: 1px dashed var(--border);
  color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;
}
.ad-add:hover { border-color: var(--text-primary); color: var(--text-primary); }

.ad-row-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.6rem 0.7rem; cursor: pointer; border-radius: 3px;
  font-size: 0.9rem; color: var(--text-secondary);
}
.ad-row-item:hover { background: var(--bg-panel); }
.ad-row-item.is-active { background: var(--bg-panel); color: var(--text-primary); }
.ad-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ad-row-actions { display: flex; gap: 0.35rem; opacity: 0; transition: opacity 0.2s; }
.ad-row-item:hover .ad-row-actions { opacity: 1; }
.ad-row-actions button { color: var(--text-muted); padding: 0 0.2rem; }
.ad-row-actions button:hover { color: var(--text-primary); }
.ad-row-actions button:disabled { opacity: 0.25; cursor: default; }

.ad-row { display: flex; gap: 1rem; }
.ad-details { margin-bottom: 1.75rem; color: var(--text-secondary); font-size: 0.85rem; }
.ad-details summary { cursor: pointer; }

.ad-swatches { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.ad-swatch {
  width: 40px; height: 40px; border-radius: 3px;
  border: 2px solid transparent; transition: border-color 0.2s;
}
.ad-swatch.is-active { border-color: var(--text-primary); }

.ad-actions { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
.ad-ok { font-size: 0.8rem; color: #6bcf7f; }

.ad-blank { padding: 4rem 0; text-align: center; }
.ad-blank h2 { margin-bottom: 0.5rem; }

.ad-gate {
  min-height: 100vh; display: flex; align-items: center;
  justify-content: center; background: var(--bg);
}
.ad-gate-box { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 0.85rem; }
.ad-gate-title { font-size: 1.5rem; }
```

- [ ] **Step 7: Verify it compiles and runs**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run dev`, open `http://localhost:3000/admin`
Expected: password screen. With `ADMIN_PASSWORD` set in `.env.local`, signing in shows the three-pane editor and the preview updates as you type.

- [ ] **Step 8: Commit**

```bash
git add src/components/admin src/app/admin src/app/globals.css
git commit -m "feat: admin editor with live preview and publish"
```

---

### Task 9: Navigation, setup docs, and verification

**Files:**
- Modify: `src/components/layout/Header.tsx:17-21` and `:35-39` (both navs)
- Create: `.env.example`
- Modify: `README.md`
- Modify: `CMS.md`

- [ ] **Step 1: Link Work in both navs**

In `src/components/layout/Header.tsx`, in the desktop nav (around line 17) change the `Store` entry and in the mobile overlay (around line 35) do the same, so both read:

```tsx
<Link href="/work">Work</Link>
```

Desktop keeps the remaining links unchanged; mobile keeps its `onClick={() => setMenuOpen(false)}` handler:

```tsx
<Link href="/work" onClick={() => setMenuOpen(false)}>Work</Link>
```

- [ ] **Step 2: Document the environment**

`.gitignore` line 34 is `.env*`, which would swallow this file. Add an
exception immediately below it:

```gitignore
!.env.example
```

Create `.env.example`:

```bash
# Password for the /admin editor. Choose something long.
ADMIN_PASSWORD=

# Set automatically when you connect a Blob store on Vercel.
BLOB_READ_WRITE_TOKEN=

# Public base address of your Blob store, e.g.
# https://xxxxxxxx.public.blob.vercel-storage.com
BLOB_PUBLIC_BASE_URL=
```

- [ ] **Step 3: Correct CMS.md**

In `CMS.md`, replace the two inaccurate references:

- Every mention of `api/portfolio.ts` becomes `src/app/api/portfolio/route.ts`
- In "Things to know", replace the sentence beginning "Your session lives in `sessionStorage`" with:

```markdown
Your session is held in a secure cookie that expires after eight hours. Sign
out explicitly on a shared machine.
```

- Under "Two ways to publish", relabel section A from "Export and commit" to
  "Download a backup" and note it is a backup rather than a publishing route.

- [ ] **Step 4: Document setup in the README**

Append to `README.md`:

```markdown
## Portfolio CMS

The editor is at `/admin`; the public grid is at `/work`.

### Setup

1. **Vercel → Storage → Create a Blob store** and connect it to this project.
   This sets `BLOB_READ_WRITE_TOKEN` for you.
2. Copy the store's public address into `BLOB_PUBLIC_BASE_URL`
   (Settings → Environment Variables). It looks like
   `https://xxxxxxxx.public.blob.vercel-storage.com`.
3. Add `ADMIN_PASSWORD` — make it long.
4. Redeploy.

Locally, copy `.env.example` to `.env.local` and fill in the same values.

Without a Blob store the public page still works from `data/portfolio.json`,
but uploading and publishing are disabled.
```

- [ ] **Step 5: Run the full check**

```bash
npm test
npx tsc --noEmit
npm run build
```

Expected: 25 tests pass, no type errors, build completes with `/work` and `/admin` in the route list and no "export const dynamic" warnings.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx .gitignore .env.example README.md CMS.md
git commit -m "feat: link work page, document CMS setup"
```

---

## Manual verification

Once Vercel Blob and `ADMIN_PASSWORD` are configured, walk the operator's path end to end:

1. Visit `/admin` — password screen appears
2. Wrong password — "That password is not right", no session granted
3. Correct password — editor loads
4. "Add a project", type a title — preview updates live
5. Drag an image onto the cover field — progress bar, then thumbnail
6. Pick each shape — preview aspect ratio changes
7. Publish — "Published — your changes are live"
8. Open `/work` in a private window — the new piece is there
9. Delete a project — confirmation appears first
10. Reload mid-edit — the unpublished draft is restored
