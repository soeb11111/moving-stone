# Portfolio CMS

A simple content system for managing the studio's portfolio: a password-protected
editor at `/admin` and a public grid at `/work`.

## How it works

- **Editor** — `src/app/admin/page.tsx` and `src/components/admin/Editor.tsx`.
  Sign in with the admin password, add or edit projects, upload cover images
  and video, and publish.
- **Public page** — `src/app/work/page.tsx` renders the published portfolio
  as a filterable grid.
- **API routes**
  - `src/app/api/auth/route.ts` — sign in / sign out.
  - `src/app/api/portfolio/route.ts` — read and publish portfolio data.
  - `src/app/api/upload/route.ts` — handles cover image and video uploads to
    Vercel Blob.
- **Storage** — published content is stored as JSON in Vercel Blob. If no
  Blob store is configured, the public page falls back to the bundled
  `data/portfolio.json`.

## Two ways to publish

**A. Download a backup copy** — the editor's "Download a backup copy" button
saves the current portfolio data as a JSON file to your computer. This is a
backup only — it does not publish anything to the live site.

**B. Publish** — the "Publish" button in the editor writes your changes to
the Blob store, and they appear on `/work` immediately.

## Things to know

Your session is held in a secure cookie that expires after eight hours. Sign
out explicitly on a shared machine.

If a project has no cover image, the public grid still renders it — add one
later.

Deleting a project asks for confirmation first; there is no undo, so use the
backup download if you want a safety copy before making large changes.

If you reload the editor mid-edit, an unpublished draft saved in your browser
is restored automatically.
