# Agent Notes

This file tracks project-specific decisions that future agents should preserve.

## Brand

- The studio is **Sideband** (sideband.studio, hello@sideband.studio), rebranded from Eternal Reverse in 2026.
- Product names were deliberately not renamed. EternalMonitor, EternalRichPresence, Eternal2x, and Eternal Summary are separate product brands with their own domains and repos. Do not "fix" them to Sideband.
- The design token namespace is `sideband-*`: a Tailwind colour scale defined once in `tailwind.config.ts`, which also emits it as `--sideband-*` CSS variables. See `DESIGN.md`.
- The navbar and footer wordmark is plain text, not an image. The old logo assets under `public/assets/EternalReverse/` and `assets/EternalReverse/`, the old `public/favicon.png`, and the pre-rebrand design mockups in `references/` were removed. `app/icon.png` is the favicon and social preview image.

## Current Deployment State

- Hosting target: Vercel
- Framework: Next.js 14 App Router
- Branch currently used for active work: `dev`
- Most recent deployment-fix commit at time of writing: `04c1d0a`

## Vercel Rules

Do not reintroduce GitHub Pages settings into this repo.

Specifically, `next.config.mjs` must NOT include:

- `output: 'export'`
- `basePath`
- `assetPrefix`

Those settings were added temporarily for GitHub Pages and broke the Vercel deployment path.

## Build Expectations

The project should pass:

```bash
npm run build
```

If a future change breaks the build, fix that before pushing.

## Layout And Root Rules

- `app/layout.tsx` is the only root-level place that should import `@/styles/globals.css`
- Keep `metadataBase` aligned with the real deployed site (`SITE_URL` in `lib/metadata.ts`), not GitHub Pages
- Every route builds its metadata with `pageMetadata()` from `lib/metadata.ts`: title, description, canonical URL, Open Graph and Twitter card. Next replaces a parent's `openGraph` and `twitter` wholesale instead of merging them, so a page that sets only some of them loses the rest. Pages without a picture of their own use `app/icon.png`. Product pages use their first screenshot and dossiers the portrait.
- `app/sitemap.ts` lists every route from `lib/products.ts` and `lib/engineers.ts`. `tests/site.spec.ts` fails if a page links to a route the sitemap does not list.
- Components using hooks or browser APIs must remain client components (`'use client'`)

## Images

- Prefer `next/image` over raw `<img>` in app components
- All app image sources should resolve from `public/`
- Existing project assets live under `public/assets/...`: `products/<id>/`, `engineers/<id>/`, `logos/`, `sideband/`
- Product images are labelled by `kind` (`screenshot`, `artwork`, `photo`) and captioned that way. Artwork is never called a screenshot. An image's `credit` (author, link, license) travels with it wherever it appears, including the viewer (`components/products/ImageCredit.tsx`). `source` records where the file came from.
- A product's `icon` is its own icon or logo. Signature Cuts ships none, so its icon is a monogram drawn by Sideband (`components/products/scenes/group-b/signature-cuts/mark.svg`, rasterized to `icon.webp`), and its `source` says so.

## Design System

`DESIGN.md` at the repo root is the design contract: tokens, type, colour, layout, motion, the
components in `components/ui/`, and the product scene contract in `components/products/scenes/`.
Read it before building or changing any page. These rules from earlier work still hold:

- Every animation is off under `prefers-reduced-motion`, and content stays visible and complete without it (and without script).
- No custom cursor. No live SVG noise filter: grain is one tiled `body::after` texture.
- Product visuals are real screenshots plus hand-built SVG scenes, never AI raster art posing as product UI.
- Each product's `icon` and images come from `lib/products.ts`.

## Site Structure

- **Products.** `lib/products.ts` holds every product: copy from its repo, docs and live site, images, links, and the `repo` (and `upstreamRepo`) keys into the GitHub snapshot. `rankedProducts()` orders them by one score, `RANKING_WEIGHTS.popularity` (stars, forks, release downloads) plus `RANKING_WEIGHTS.scope` (code bytes, commits, contributors, platforms), with the inputs in `RANKING_POPULARITY_INPUTS` and `RANKING_SCOPE_INPUTS`. No rank is typed by hand. Prose that explains the ranking reads `rankingMethod` in `lib/products-view.ts`, so it cannot drift from the weights. Licenses come from `productLicense(product)`, which reads the snapshot's detected license: only an OSI-approved license is called open source. hushtype is proprietary (its LICENSE is not OSI), though it is built on the open-source Handy, and the home Open source section lists only OSI-licensed repos. Pages: `app/products/page.tsx` (`ProductIndex`) and `app/products/[id]/page.tsx` (`ProductDetail`).
- **Scenes.** `components/products/scenes/index.tsx` registers one animated SVG scene per product (`group-a/` and `group-b/`), drawn in a card and a hero framing. The contract is in `DESIGN.md` -> Product scenes.
- **Engineers.** `lib/engineers.ts` holds the five founding engineers: profile, experience, projects, portrait and `githubLogin`. Every Sideband title is "Founding Engineer". `content/engineers/<id>/bio.md` holds the long-form dossier text (quotes, notes, ventures). The server-only helpers in `lib/engineers-*.ts` shape both for the pages: `engineers-dossier.ts` keeps each fact in the first place it is told, `engineers-studio.ts` derives the /about facts and timeline, `engineers-github.ts` turns the snapshot into calendar props. Pages: `app/engineers/page.tsx` and the dossier `app/engineers/[id]/page.tsx`. `/about` and `/contact` read the same data.
- **GitHub sync.** `npm run sync:github` (`scripts/sync-github.mjs`, token from `GITHUB_TOKEN` or `gh auth token`) writes `lib/data/github.json`: the org, every product repo, and every engineer's public profile and contribution calendar. The site reads the committed file through `lib/github.ts` and never calls GitHub at build or request time. The snapshot is server-only: never import it, `lib/products-view.ts`, `lib/home-data.ts` or `lib/engineers-github.ts` from a `'use client'` file. `tests/site.spec.ts` fails if it reaches a client bundle.

## Tailwind

Tailwind content paths are intentionally scoped to source files:

- `./app/**/*.{ts,tsx}`
- `./components/**/*.{ts,tsx}`
- `./lib/**/*.{ts,tsx}`

Do not broaden this casually without a reason.

## Cleanup Rules

Do not commit local tool residue.

Examples:

- `.claude/`
- `.codex-dev-*.log`
- `test-results/`
- `playwright-report/`
- other local generated clutter

`.gitignore` was updated to keep these out.

## Single Source of Truth

When you add, remove, or change something that the site states as a fact, update it **everywhere** — not just the file you happened to open. Facts are written in prose across `app/`, `components/`, and `content/`, but they derive from data in `lib/`.

Known duplications to keep in sync:

- **Founder count** — `lib/engineers.ts` is the source: five founding engineers, and every Sideband title is "Founding Engineer". The site names the team as "founding engineers". The pages derive the count from `engineers.length` (through `countWord()` in `lib/engineers-view.ts` and `lib/home-data.ts`): the home hero and team section, the engineers index, the About page and its metadata, and the footer. Still written out, so adding an engineer means editing them: the README, and count prose inside `lib/engineers.ts` summaries and `content/engineers/*/bio.md` ("is five founding engineers now", "One of five founding engineers").
- **Product count and the live / in-development split** — `lib/products.ts` is the source (`status: 'LIVE'` vs `'IN DEVELOPMENT'`). The products page and its metadata, the home page and About derive every product count they state from the data (`numberWord()` in `lib/products-view.ts`, `countWord()` in `lib/home-data.ts`). The README lists the products by name, so update it when one is added.
- **Stack, roles, locations, dates** — stated in more than one place; grep for the old value before assuming one edit is enough.

These are enforced. `scripts/check-consistency.mjs` re-derives the founder and product counts from `lib/` and fails if any prose disagrees (it also catches stale head-count phrasings like "two-person studio", "four engineers", "four co-founders" or "is now four founders" once the count moves on, and scans the prose in `lib/` for the studio's own team nouns and product counts). It runs in CI on every PR (`npm run check:consistency`) and is a required check, so drift blocks merge. Run it locally before pushing. To cover a new derived fact, add an entry to the `FACTS` array in that script.

## Checks

What each check guards. All but `check:links` run in CI on every PR.

- `npm run check:consistency`: counts in prose match `lib/` (see above).
- `npm run check:copy`: no em dashes or semicolons in user-facing copy (see Copy Style).
- `tests/scenes-legibility.spec.ts`: every scene's text renders at 12px or more, at six widths, in every place a scene appears.
- `tests/site.spec.ts`: crawls every route from the home page and the sitemap. At 390 and 1440 each page returns 200 and has one `h1`, a title, a description, a canonical URL and social images that exist, no console or page errors, no sideways scrolling, internal links and `#` anchors that resolve, and images with alt text that load. Under reduced motion nothing animates and all page text is drawn. On phones it also guards layout shift (0.1 or less), image weight (500 KB or less) and keeps the GitHub snapshot out of client scripts.
- `npm run check:links` (local only, needs the network): every external link on the built site answers. Run it after `npm run build`. It allows only the bot-blockers listed in `scripts/check-links.mjs`, each with its reason.
- Tests that click or type act only on a settled, hydrated page: open pages with `visit()` and wait with `settle()` from `tests/helpers.ts`, and wait on observable state (`expect.poll`, `toHaveURL`), never on a fixed timeout. The only timeouts left check that something does not happen within a window. Focus an element with `focusOnScreen()` before a key press that scrolls the page: the page scrolls smoothly, so focusing something off screen starts a scroll the jump would race.

## Copy Style

User-facing copy never uses em dashes or semicolons. Rephrase instead. En dashes in date ranges stay. Enforced in CI by `npm run check:copy` (string literals, template text, JSX text, and `content/` prose). Code and code comments are exempt. See PR.md -> Copy Style.

## Pull Requests

Follow `PR.md` for branch naming, commit format, the pre-review checklist, and merge style. Open PRs against `dev`.

For any change a visitor could see (pages, components, styles, images, copy in components), run `npm run dev`, open the affected page, take a screenshot of the result, and attach it to the PR under "Proof It Works". Before/after for edits to existing UI. This is the normal way to open a UI PR here, not an extra; the reviewer should be able to judge the change from the description alone. Skip it only for changes with no rendered effect (CI, docs, tests, scripts, data-only edits). See `PR.md` -> Screenshots For Visual Changes.

The `pr-screenshots` workflow auto-captures the standard landing set on every PR and posts a sticky comment, so the landing page is always covered. For any other page, publish the image with `scripts/pr-screenshot.sh <image> <pr-number>` and embed the same-origin markdown it prints (`https://github.com/<owner>/<repo>/raw/<ref>/<path>`, pinned to a commit).

Never fork this repository or open a PR from a fork. Push branches straight to `origin` (this repo) and open the PR from there. Fork PRs are auto-closed by `.github/workflows/no-fork-prs.yml`, get no CI or Claude review, and cannot merge.

## If Something Looks Broken On Vercel

Check these first:

1. `next.config.mjs` for accidental static export / GitHub Pages settings
2. `app/layout.tsx` metadata and global CSS setup
3. image paths under `public/`
4. missing `'use client'` on hook or browser-API components
5. `npm run build`
