# Portfolio CMS

The editor lives at **`/admin`** on your site. Nothing about the portfolio needs
code edits any more.

---

## First: set the password

The studio is locked and stays locked until you set one environment variable.

1. Vercel dashboard → this project → **Settings → Environment Variables**
2. Add `ADMIN_PASSWORD`, set to whatever you want. Make it long
3. Redeploy

The password is checked on the server, so it is never in the code the browser
downloads. The same password authorises the Publish button.

---

## Everyday use

1. Go to `yoursite.com/admin` and sign in
2. **Add** creates a new piece; the list on the left reorders with the arrows,
   duplicates with the copy icon, deletes with the bin
3. Fill in the form. The card on the right updates as you type
4. **Save draft** keeps your work in this browser
5. **Publish live** pushes it to the real site

### Fields

| Field | What it does |
| --- | --- |
| Title / Client | The two lines of text on the card |
| Category | Which filter pill the piece appears under |
| Format | Sets the aspect ratio — Reel 9:16, Post 1:1, Carousel 4:5, Poster 2:3, Film 16:9 |
| Duration | Small badge, videos only |
| Image URL | The still shown on the card |
| Video URL | Plays on hover (desktop) or tap (mobile) |
| Fallback surface | Gradient shown when there is no image — six presets, or paste any CSS gradient |
| Year / Views / Trending | Only affect the three sort options |

Leave Image and Video empty and the card falls back to the gradient. That is how
the current placeholder content works.

---

## Where to put your files

**Small and simple** — drop files into `public/work/` in the repo and reference
them as `/work/reel-01.mp4`. Free, versioned, no accounts. Fine up to about 50
items; poor for long video, which is served uncompressed.

**Video over ~30 seconds** — upload to YouTube or Vimeo and paste the URL. They
handle transcoding and bandwidth, which you do not want to pay Vercel for.

**Images** — Vercel Blob or Cloudinary. Both give you a dashboard, an upload
button and a URL. Cloudinary also resizes and converts to WebP automatically,
which matters on a grid this dense.

---

## Two ways to publish

### A. Export and commit (works right now, no setup)

1. Click **Export** — you get `portfolio.json`
2. Commit it, or send it to whoever manages the repo
3. Redeploy

Slower, but free and fully versioned. Every change is in git history.

### B. Publish button (needs storage connected)

`api/portfolio.ts` is already written and deployed. It is dormant until you add
storage. To switch it on:

1. Vercel dashboard → this project → **Storage** → create a **Blob** store and
   connect it. This sets `BLOB_READ_WRITE_TOKEN` automatically
2. Redeploy

That is it — `ADMIN_PASSWORD` already authorises publishing. After this,
publishing takes about two seconds and needs no deploy.

---

## Things to know

**What the password does and does not cover.** Sign-in is verified on the
server, so the password is not in the client bundle and cannot be read out of
it. Nobody gets into the editor or publishes without it.

What it does not do is hide the *existence* of the page: `/admin` still returns
the app shell, and the editor's JavaScript is part of the public bundle, so a
determined person can see how the editor is built. They cannot see or change
your content. If you want the URL itself invisible, turn on **Deployment
Protection** in Vercel settings.

Your session lives in `sessionStorage` and ends when you close the tab. Sign out
explicitly on a shared machine.

**Drafts are per-browser.** A draft saved on your laptop is not visible on your
phone, and not visible to site visitors. Only Publish (or Export + commit)
changes what the public sees.

**Reset** discards your draft and reloads whatever shipped with the last deploy.
It does not touch published data.

---

## Outgrowing this

This is a deliberately small editor — one content type, one editor at a time, no
revision history, no user accounts. It is the right size for a studio publishing
work a few times a month.

If you get to the point of wanting several people editing, scheduled publishing,
image cropping in the browser, or draft previews shared by link, move to Sanity
or Payload. Both are free at this scale and both would replace `/admin` and
`api/portfolio.ts` while leaving the rest of the site untouched.
