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

## Pull Requests

Follow `PR.md` for branch naming, commit format, the pre-review checklist, and merge style. Open PRs against `dev`.

## If Something Looks Broken On Vercel

Check these first:

1. `next.config.mjs` for accidental static export / GitHub Pages settings
2. `app/layout.tsx` metadata and global CSS setup
3. image paths under `public/`
4. missing `'use client'` on hook/browser/Framer Motion components
5. `npm run build`

