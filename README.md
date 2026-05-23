# arbetarorkestern

Landing site for [Arbetarorkestern](https://arbetarorkestern.klokie.com) — Stockholm world-music ensemble.

## Stack

- Astro 5 (static) + MDX
- `@klokie/theme` with the **Jordsång** preset
- Cloudflare Pages
- Content authored in Obsidian vault, synced via GitHub Actions

## Content source

Content lives in the vault at:
```
personal/music/Arbetarorkestern/PUBLIC/
├── gigs/
├── news/
└── pages/
```

A vault-side workflow rsyncs that folder into this repo's `src/content/` on every vault push, then triggers a deploy here via `repository_dispatch`.

## Local development

```bash
pnpm install
pnpm dev          # → http://localhost:4321
```

To edit content live against the vault:
```bash
rm -r src/content/gigs src/content/news src/content/pages
ln -s "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/vault/personal/music/Arbetarorkestern/PUBLIC/gigs"  src/content/gigs
ln -s "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/vault/personal/music/Arbetarorkestern/PUBLIC/news"  src/content/news
ln -s "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/vault/personal/music/Arbetarorkestern/PUBLIC/pages" src/content/pages
```
(Don't commit those symlinks.)

## Cloudflare setup

This site deploys as a **Cloudflare Worker with static assets** (the modern path; same hosting as Pages but unified product). Cloudflare's Git integration watches `klokie/arbetarorkestern` and rebuilds on every push.

The `wrangler.jsonc` in repo root tells Cloudflare to serve `./dist` as static assets.

**On Cloudflare:**
- Build command: `pnpm build`
- Deploy command: `npx wrangler deploy` (default — uses `wrangler.jsonc`)
- Variables: `PUBLIC_SITE_URL=https://arbetarorkestern.klokie.com`, `NODE_VERSION=22`
- Custom domain: `arbetarorkestern.klokie.com` → CNAME at klokie.com's DNS

**On GitHub:** the only workflow is `check.yml` — typecheck + build on every push and PR. No deploy step here; Cloudflare handles that.

## Deploy triggers

- Push to `main` (code or content) → Cloudflare auto-builds and deploys
- Vault content change → `sync-sites.yml` in vault repo pushes a commit here → Cloudflare auto-builds

## Content shape

```yaml
# gigs/*.md
title: Tidafestivalen 2026
date: 2026-06-06
venue: Tidafestivalen
city: Tida
ticketUrl: https://...        # optional
status: upcoming              # upcoming | past | cancelled
published: true
image: https://media.arbetarorkestern.klokie.com/posters/2026-06-06-tida.png  # optional
imageAlt: Tidafestivalen affisch                                              # optional
imageWidth: 1055                                                              # optional, prevents CLS
imageHeight: 1491                                                             # optional, prevents CLS
```

```yaml
# news/*.md or news/<slug>/index.md
title: Ny visuell identitet
date: 2026-04-29
description: …
cover: ./cover.jpg            # optional, co-located image
tags: [identitet]
published: true
```

```yaml
# pages/<slug>.md   (e.g. pages/om.md → /om)
title: Om Arbetarorkestern
description: …
published: true
```

Set `published: false` to stage a post in repo without showing on site.

## Images

Images live in the `aark-media` Cloudflare R2 bucket and are served from `media.arbetarorkestern.klokie.com`. No Astro `<Image>` pipeline, no images committed to this repo.

Upload an image:

```bash
CLOUDFLARE_ACCOUNT_ID=<klokie-account-id> node scripts/upload-media.mjs <local-file> [<key>]
```

The script uses `sharp` to pre-generate webp + avif variants at widths `400, 640, 800, 1200, 1600` (skipping widths larger than the original), uploads them alongside the original via `wrangler r2 object put --remote`, and prints a frontmatter snippet (`image:` / `imageAlt:` / `imageWidth:` / `imageHeight:`) with the public URL copied to clipboard.

`src/components/ResponsiveImage.astro` derives variant URLs from the original by inserting `-<width>w` before the extension and swapping the extension, so frontmatter only stores the original URL. The rendered `<picture>` element prefers avif → webp → original.
