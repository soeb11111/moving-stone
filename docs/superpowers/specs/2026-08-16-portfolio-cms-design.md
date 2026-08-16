# Portfolio CMS — Design

**Date:** 2026-08-16
**Status:** Approved, ready for planning

## Purpose

Give a non-technical studio owner a way to publish portfolio work without
touching code, a repo, or a deploy. The editor lives at `/admin`; the public
grid lives at `/work`.

The governing constraint is that the operator is not technical. Where a choice
exists between a simpler build and a simpler experience, the experience wins.
Concretely: no URLs, no JSON, no git, no jargon.

## Context

This repo is a Next.js 16.2.6 / React 19 marketing site. Relevant existing state:

- `next.config.ts` sets `output: 'export'` — a static export with no server.
  This must be removed; API routes and server-verified auth cannot exist
  under static export.
- No Tailwind is installed despite Tailwind-shaped class names in components.
  Real styling is inline styles plus hand-written CSS in `src/app/globals.css`,
  driven by CSS variables (`--bg #111`, `--border #333`, Inter).
- No portfolio grid, `/admin`, or API routes exist today. This is a new build,
  not a wiring job.
- No test setup exists.

The source document (`CMS.md`) describes `api/portfolio.ts`. That is the wrong
convention for Next 16 App Router; the correct location is
`src/app/api/portfolio/route.ts`. The document also specifies `sessionStorage`
for the session, which cannot be verified server-side and is readable by any
script on the page. This design uses an httpOnly cookie instead.

## Architecture

```
src/lib/portfolio/
  types.ts       PortfolioItem, Format, Category — shared contract
  defaults.ts    FORMATS (aspect ratios), GRADIENTS (6 presets), CATEGORIES
  store.ts       getPortfolio() — Blob read with committed-JSON fallback
  validate.ts    parsePortfolio(unknown) → PortfolioItem[] | error
  auth.ts        session cookie sign/verify

src/app/api/auth/route.ts        POST password → sets session cookie
src/app/api/portfolio/route.ts   GET published data · POST publish (auth'd)
src/app/api/upload/route.ts      POST → short-lived client-upload token (auth'd)

src/app/work/page.tsx            public grid (server component)
src/app/admin/page.tsx           editor shell (client)

src/components/portfolio/
  PortfolioCard.tsx              shared by public grid AND editor preview
  PortfolioGrid.tsx              grid + category filter pills

src/components/admin/            editor sub-components (~5 files)

data/portfolio.json              committed baseline content
```

### Read path

`/work` is a server component calling `getPortfolio()`, which attempts a Vercel
Blob read and falls back to the committed `data/portfolio.json`. Published
content lives at a single fixed Blob key, `portfolio/data.json`, overwritten on
each publish with `addRandomSuffix: false` so reader and writer always agree on
the location. Uploaded media lives under `portfolio/media/`. The Blob read
is wrapped in a `use cache` helper with `cacheLife('minutes')` — per the Next 16
route-handler docs, `use cache` cannot appear directly in a handler body and
must be extracted to a helper function.

### Write path

`/admin` → Publish → `POST /api/portfolio` → verify session cookie → validate
payload → write to Blob → `revalidatePath('/work')`. The public page updates
without a deploy.

### Upload path

Files never pass through our server. The browser requests a short-lived token
from `POST /api/upload` (auth-checked), then uploads directly to Vercel Blob
using `@vercel/blob` v2.8.0 client uploads. This bypasses the ~4.5MB serverless
request body limit, which a server-proxied video upload would otherwise hit.

## Storage

Vercel Blob is a hard requirement, not an optional enhancement. Friendly
uploads need a destination; there is no way to offer drag-and-drop without it.

The committed `data/portfolio.json` remains as a read-time fallback so the
public site never breaks if Blob is unreachable. It is not a publishing path.
It is consumed via a static `import` rather than `fs` reads, so it is bundled
and cannot go missing in a serverless environment.

## Authentication

`ADMIN_PASSWORD` environment variable, compared server-side with
`crypto.timingSafeEqual` so response timing does not leak length or content.

On success the server sets an httpOnly, `secure`, `sameSite=lax` cookie holding
an HMAC of a timestamp, letting the server verify sessions without server-side
storage. Sessions expire after 8 hours.

`/admin` shows a password gate until the cookie validates, but that gate is
convenience only. `POST /api/portfolio` and `POST /api/upload` independently
re-verify the cookie — that is the real security boundary.

If `ADMIN_PASSWORD` is unset, the editor and both mutating routes return 503
with a plain "not configured yet" message. Fails closed.

### What this does and does not cover

Sign-in is verified on the server, so the password is never in the client
bundle. Nobody edits or publishes without it.

It does not hide that `/admin` exists — the route returns an app shell and the
editor's JavaScript is in the public bundle. Content cannot be read or changed,
but the editor's construction is visible. Vercel Deployment Protection is the
answer if the URL itself must be invisible.

## The editor

Two panes, styled with the site's existing dark palette and CSS variables.
Left: item list with up/down reorder, delete, and Add. Right: form plus a live
preview rendered through the *same* `PortfolioCard` the public grid uses, so
preview and reality cannot drift.

### Fields

| Field | Notes |
| --- | --- |
| Title | Card's first line |
| Client | Card's second line |
| Category | Which filter pill it appears under |
| Format | Reel 9:16, Post 1:1, Carousel 4:5, Poster 2:3, Film 16:9 |
| Duration | Small badge, video only |
| Image | Uploaded file, not a URL |
| Video | Uploaded file, or pasted YouTube/Vimeo link |
| Fallback surface | Six gradient presets, used when no image |
| Year | Metadata |

Out of scope for v1: duplicate button, the three sort options, trending flag.
These are additive and can follow later.

### Non-technical affordances

These are requirements, not polish:

- **No URL fields.** A dropzone accepts drag-and-drop or click-to-browse,
  shows a progress bar, then a thumbnail. The resulting URL is never surfaced.
  A collapsed "or paste a YouTube/Vimeo link" row handles long-form video.
- **Size guards run before upload starts** — images ≤10MB, video ≤100MB — with
  messages like "That file is too big. Try one under 10MB" rather than a 413
  after a long wait.
- **Format is chosen from five clickable shape outlines** labelled Reel, Post,
  Carousel, Poster, Film — not ratio text.
- **Every field carries a one-line plain-English hint** in muted grey.
- **Delete asks for confirmation.**
- **Publish reports "Published — your changes are live"** with a link to view
  the page. Failures state what to do next. Never a silent success.
- **Empty state is a single "Add your first project" card**, not a bare toolbar.
- **Export is demoted** to a small "Download a backup copy" link. It is a
  backup, not a publishing route, and is not presented as one.

Draft state autosaves to `localStorage` on a debounce. Drafts are per-browser
and invisible to visitors until published.

## Error handling

| Condition | Behaviour |
| --- | --- |
| Blob unreachable on read | Fall back to committed JSON, log server-side, public site unaffected |
| Invalid publish payload | 400 naming the specific field that failed |
| Wrong password | Generic 401, no hints |
| `ADMIN_PASSWORD` unset | 503, "not configured yet" |
| Upload too large | Blocked client-side before upload with a plain-English message |

## Testing

No test infrastructure exists in this repo. This design adds `node:test` unit
coverage for the pure logic only:

- `validate.ts` — accepts good payloads, rejects malformed ones with the right
  field named
- `store.ts` — falls back to JSON when Blob throws
- `defaults.ts` — format and gradient resolution

UI is verified by running the app, not by browser tests.

## Deployment changes

1. Remove `output: 'export'` and `images.unoptimized` from `next.config.ts`
2. Add `@vercel/blob` dependency
3. Create a Vercel Blob store (sets `BLOB_READ_WRITE_TOKEN` automatically)
4. Set `ADMIN_PASSWORD` in Vercel environment variables
5. Redeploy

## Outgrowing this

One content type, one editor at a time, no revision history, no user accounts.
Correctly sized for a studio publishing a few times a month. Wanting multiple
editors, scheduled publishing, in-browser cropping, or shareable draft previews
means moving to Sanity or Payload, which would replace `/admin` and the
portfolio API while leaving the rest of the site untouched.
