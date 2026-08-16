# Moving Stone

Website for Moving Stone, a design agency. React 18 + TypeScript + Vite + Tailwind,
deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build locally
```

## Routes

| Path | What it is |
| --- | --- |
| `/` | Home — hero with the cursor spotlight reveal, services, work, process, studio, contact |
| `/portfolio` | Filterable portfolio grid, 14 categories, mixed aspect ratios |
| `/admin` | Password-protected editor for portfolio content |

## Structure

```
api/                    Vercel serverless functions
  auth.ts               Verifies the studio password
  portfolio.ts          Reads/writes published portfolio JSON (Vercel Blob)
src/
  components/           Shared UI
    Hero.tsx            Full-screen hero
    RevealLayer.tsx     Canvas-masked cursor spotlight
    PortfolioCard.tsx   Portfolio grid card
    StudioLock.tsx      Sign-in screen for /admin
    Sections.tsx        Home page sections
  data/
    content.ts          All home page copy
    portfolio.ts        Default portfolio items + types
  lib/
    auth.ts             Sign-in and session handling
    store.ts            Loading, drafts, publishing
  pages/                Home, Portfolio, Admin
```

All home page copy lives in `src/data/content.ts` — edit there, not in components.

## Environment variables

Set these in Vercel under Settings → Environment Variables.

| Variable | Required for | Notes |
| --- | --- | --- |
| `ADMIN_PASSWORD` | `/admin` sign-in and publishing | Until this is set, the studio stays locked |
| `BLOB_READ_WRITE_TOKEN` | The Publish button | Set automatically when you connect a Vercel Blob store |

Without `BLOB_READ_WRITE_TOKEN` the site falls back to the portfolio data bundled
in `src/data/portfolio.ts`, and you publish by exporting JSON from `/admin` and
committing it. See [CMS.md](./CMS.md).

## Content management

See [CMS.md](./CMS.md) for how to add portfolio pieces, where to host images and
video, and how publishing works.

## Notes

- Hero images are hosted externally on `images.higgs.ai` — see `src/data/content.ts`
- Portfolio placeholder videos are Google's public sample clips; replace them with real work
- The site is client-rendered, so `/portfolio` and `/admin` set their titles via JavaScript.
  If portfolio SEO becomes important, moving to Next.js would give proper per-route metadata.
