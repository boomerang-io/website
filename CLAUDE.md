# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Public website and documentation site for Boomerang (useboomerang.io). It is a React Router 7 (framework mode, SSR) + React 19 + Tailwind 3 app on Vite 8. It started from the [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template) and was migrated from Remix v2. The docs content does **not** live here. It is pulled at runtime from the [boomerang-io/docs](https://github.com/boomerang-io/docs) GitHub repo (`SOURCE_REPO`). Each product (Flow, Bosun) is a top-level folder in that repo with its own release line.

## Commands

The package manager is pnpm, pinned by `packageManager` in package.json. Node 22.12 or later (`.nvmrc` pins 24; the image runs Chainguard's Node, 26 today).

```sh
pnpm install
pnpm dev                     # react-router dev
pnpm build                   # react-router build -> ./build
pnpm start                   # react-router-serve ./build/server/index.js
pnpm test                    # vitest run (app/**/*.test.ts, node environment)
pnpm vitest run app/utils/github/params.test.ts   # a single test file
pnpm typecheck               # tsc
pnpm lint                    # eslint 9 flat config (eslint.config.js)
docker build -t boomerang-website .
```

pnpm 11 fails an install when a dependency's build script isn't listed under `allowBuilds` in `pnpm-workspace.yaml` (esbuild is).

## Environment

Copy `.env.example` to `.env`. `app/utils/env.server.ts` validates it with zod at import time; vitest sets `SOURCE_REPO` itself (vite.config.ts `test.env`).
- `SOURCE_REPO`: required, `owner/repo` the docs come from (`boomerang-io/docs`).
- `GITHUB_TOKEN`: required when `NODE_ENV=production`. Without it, the GitHub API limit is 60 requests/hr.
- `LOCAL_REPO_RELATIVE_PATH`: required when `NODE_ENV=development`. Path to a local clone of the docs repo (e.g. `../docs`), served as the `local` version.
- `NO_CACHE`: `z.stringbool()`, so `true/1/yes/on` turns the in-memory caches off, `false/0/no/off` or unset leaves them on, and anything else fails validation.

## Architecture

### Config (`app/config/`)
- `doc.ts`: `defaultProduct` and `products`. Each product has `title`, `pathToDocs` (its folder), `aliases` (earlier URL names, e.g. `boomerang-flow`), `branches` shown in the switcher, `releaseBranch`, and `versions.prefix` (its release tag prefix, `flow@`/`bosun@`). `getProduct()` resolves a URL segment and `getGitHubRef()` turns a URL ref into a git ref.
- `site.ts` and `nav.ts`: site metadata and the header navigation.

### Routing
`app/routes.ts` uses `flatRoutes()`, so the Remix v2 file conventions in `app/routes/` still apply. Docs URLs are `/docs/<product>/<ref>/<slug>`:
- `docs._index.tsx` and `docs.$product._index.ts` redirect to the product's release branch.
- `docs.$product.$ref.tsx` (layout loader): fetches the product's releases and the repo's branches via Octokit, and calls `validateParams` (`utils/github/params.ts`) to redirect to the canonical URL. This covers shorthand versions (`/docs/flow/3` → latest 3.x) and earlier URL shapes: `/docs/en/main/...` (language), `/docs/boomerang-flow/...` (alias) and `/docs/introduction/...` (no product, default product). A path without a valid ref resolves to the release branch, never to the latest release. The layout then builds the sidebar menu.
- `docs.$product.$ref.$.tsx` (page loader): fetches `<pathToDocs>/<slug>.md` from `raw.githubusercontent.com`. A slug ending in `/changelog` maps to the repo-root `CHANGELOG.md`. Image paths (markdown images resolve relative to the page) redirect to `docs.$product.$ref.images.$.tsx`, which proxies the bytes and returns 404 when GitHub has no such file.
- `$.tsx` catch-all: resolves unknown root paths as a doc on the default product's release branch and redirects there. `health.ts` is the container probe.

Loaders return plain objects or `data(value, init)`; components read them with `useLoaderData<typeof loader>()` (no route typegen). Route modules import everything from `react-router`.

### Versions and refs
- Releases (GitHub Releases, not bare tags, and not drafts) are cached once per repo (`utils/github/tags.ts`) and filtered per product by `versions.prefix`. The prefix is **stripped** for URLs: release `flow@4.0.0` is `/docs/flow/4.0.0/...`. A tag without a GitHub Release does not appear.
- Always go through `getGitHubRef(product, ref)` when fetching from GitHub: it adds the prefix back for anything that isn't a configured branch or `local`.
- In development, a `local` ref is added. The menu for it packs `<LOCAL_REPO_RELATIVE_PATH>/<pathToDocs>` into an in-memory tarball (`createTarballStream`), with the same `<root>/<folder>/...` layout as a GitHub archive.

### Docs pipeline
- **Menu**: the whole repo tarball (`github.com/<repo>/archive/<ref>.tar.gz`) is parsed with `tar`'s `Parser`, keeping only `<root>/<pathToDocs>/**/*.md` (`markdownPattern`). It's a two-level tree from file paths, driven by frontmatter: `title`, `order`, `hidden`, `tag` (badge), `description`. A category's `index.md` with a body gives the category its own link.
- **Markdown** (`utils/md.server.ts`): gray-matter frontmatter, then unified/remark/rehype with GFM, slugged and autolinked headings, and `rehype-pretty-code` (Shiki). The code theme is `styles/base16.json`, whose `#FFFFxx` placeholders are rewritten to `var(--basexx)` CSS variables. The page's TOC is pulled from h2/h3 with cheerio, and frontmatter `toc: false` hides it.
- **Caching**: in-memory `lru-cache` instances (menu, docs, images, releases, branches) are attached to `global` so they survive dev-server HMR. HTTP responses use `CACHE_CONTROL.DEFAULT` from `utils/http.server.ts`.
- `_redirects` at the repo root (`from to [code]`, exact matches) is imported with `?raw` and applied by `handleRedirects()` for 404s on the release branch and in the catch-all.

### Build and image
- `vite.config.ts` sets `ssr.noExternal: true` for builds, so `build/server` is self-contained. That's why package.json `dependencies` holds only `react-router` and `@react-router/serve` (what the running server loads), and everything else is a devDependency. Keep that split.
- `react-router.config.ts` opts into the five React Router v8 future flags.
- `Dockerfile`: build and serve-deps stages on `cgr.dev/chainguard/node:latest-dev` (builder platform), runtime on `cgr.dev/chainguard/node:latest`. The runtime removes npm and node-gyp, runs as numeric `USER 2000`, and starts `dumb-init -- node .../@react-router/serve/dist/cli.js build/server/index.js` on port 3000. Chainguard's free tier only has `:latest`, so there's no digest pin. The base image still ships busybox.
- Hosting is Railway, which builds the root `Dockerfile` and injects `PORT`. The service needs `SOURCE_REPO` and `GITHUB_TOKEN`; point its healthcheck at `/health`.

### UI
- `components/ui/` holds shadcn/ui components (new-york style, zinc, CSS variables; see `components.json`). The `cn` helper is in `~/utils/theme`. `~/*` maps to `app/*`.
- The docs header (`components/header.tsx`) has a product switcher and a version switcher, both fed by the layout loader.
- Marketing pages are `_index.tsx`, `about.tsx`, and `flow.*`.

### Code style
Remix style: `let` for locals, `const` for module-level constants (`prefer-const` is off). Catch bindings may be unused (`catch (_)`).
