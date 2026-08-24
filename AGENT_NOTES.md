# Agent Notes

This file tracks project-specific decisions that future agents should preserve.

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
- Keep `metadataBase` aligned with the real deployed site, not GitHub Pages
- Components using hooks, browser APIs, or Framer Motion must remain client components

## Images

- Prefer `next/image` over raw `<img>` in app components
- All app image sources should resolve from `public/`
- Existing project assets live under `public/assets/...`

## Tailwind

Tailwind content paths are intentionally scoped to source files:

- `./app/**/*.{ts,tsx}`
- `./components/**/*.{ts,tsx}`
- `./lib/**/*.{ts,tsx}`

Do not broaden this casually without a reason.

## Reference Files

The following files are references only and should stay out of the app root:

- `references/Eternal Reverse.html`
- `references/er-components.jsx`
- `references/er-products.jsx`
- `references/er-product-detail.jsx`

They were originally dropped into the repo root, but were moved into `references/` to keep the project structure clean.

Use them as visual/content references, not as runtime application files.

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

- **Founder count** — `lib/engineers.ts` is the source. Adding an engineer means updating the prose that names the number: About page headline and metadata, Hero, Footer. (The `[ · 03 ]` labels already derive from `engineers.length`; the prose does not.)
- **Product count and the live / in-development split** — `lib/products.ts` is the source (`status: 'LIVE'` vs `'IN DEVELOPMENT'`). Adding a product means updating "Six products", "Four live, two in active development", and the same phrasing on the products page, home strip, and product showcase.
- **Stack, roles, locations, dates** — stated in more than one place; grep for the old value before assuming one edit is enough.

This is enforced. `scripts/check-consistency.mjs` re-derives the founder and product counts from `lib/` and fails if any prose disagrees (it also catches stale head-count phrasings like "two-person studio" once the count moves on). It runs in CI on every PR (`npm run check:consistency`) and is a required check, so drift blocks merge. Run it locally before pushing. To cover a new derived fact, add an entry to the `FACTS` array in that script.

## Pull Requests

Follow `PR.md` for branch naming, commit format, the pre-review checklist, and merge style. Open PRs against `dev`.

For any change a visitor could see (pages, components, styles, images, copy in components), run `npm run dev`, open the affected page, take a screenshot of the result, and attach it to the PR under "Proof It Works". Before/after for edits to existing UI. This is the normal way to open a UI PR here, not an extra; the reviewer should be able to judge the change from the description alone. Skip it only for changes with no rendered effect (CI, docs, tests, scripts, data-only edits). See `PR.md` -> Screenshots For Visual Changes.

Never fork this repository or open a PR from a fork. Push branches straight to `origin` (this repo) and open the PR from there. Fork PRs are auto-closed by `.github/workflows/no-fork-prs.yml`, get no CI or Claude review, and cannot merge.

## If Something Looks Broken On Vercel

Check these first:

1. `next.config.mjs` for accidental static export / GitHub Pages settings
2. `app/layout.tsx` metadata and global CSS setup
3. image paths under `public/`
4. missing `'use client'` on hook/browser/Framer Motion components
5. `npm run build`

