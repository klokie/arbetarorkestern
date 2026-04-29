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

## Cloudflare Pages setup

GitHub repo settings:

**Variables**
- `PUBLIC_SITE_URL` = `https://arbetarorkestern.klokie.com`
- `CLOUDFLARE_PROJECT_NAME` = `arbetarorkestern`

**Secrets**
- `CLOUDFLARE_API_TOKEN` (scope: Cloudflare Pages → Edit)
- `CLOUDFLARE_ACCOUNT_ID`

DNS: at klokie.com's DNS provider, add a CNAME `arbetarorkestern` → `<project>.pages.dev` (CF gives you the exact target after creating the project).

## Deploy triggers

- Push to `main` (code changes)
- `repository_dispatch` event `vault-content-sync` (content changes from the vault)
- Manual: GitHub Actions → Deploy → Run workflow

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
