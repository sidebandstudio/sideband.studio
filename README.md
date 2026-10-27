# Sideband

Sideband is an independent software studio founded in Boston, MA. Five founding engineers building display streaming, media pipelines, fitness software, and web products. This repo is the studio site, [sideband.studio](https://sideband.studio): every product with its screenshots, an animated scene and its GitHub figures, a dossier for each founding engineer, and the studio's About and Contact pages.

## Getting Started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the production build, run `npm run build` and then `npm run start`.

## Stack

- **Framework:** Next.js 14 (App Router), every page prerendered at build time
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS, with the tokens in `tailwind.config.ts`
- **Motion:** CSS keyframes and transitions, gated by `prefers-reduced-motion` (no animation library)
- **Typography:** Hanken Grotesk and JetBrains Mono (next/font)
- **Tests:** Playwright
- **Hosting:** Vercel

## Project Structure

```
app/                   → Pages (App Router), sitemap.ts, robots.ts, icon.png
components/
  layout/              → Navbar, Footer
  home/                → Home page sections
  products/            → Products index, product page, image viewer
    scenes/            → One animated SVG scene per product
  engineers/           → Engineer cards and dossier sections
  contact/             → Contact form
  ui/                  → Design system primitives
content/engineers/     → Long-form dossier text, one bio.md per engineer
lib/                   → Products, engineers, page data, metadata
  data/github.json     → Committed GitHub snapshot
scripts/               → Checks, GitHub sync, screenshots
styles/globals.css     → Base styles, motion and backdrops
public/assets/         → Product, engineer and company images
tests/                 → Playwright specs
```

`DESIGN.md` is the design contract. `AGENT_NOTES.md` records the structure and the decisions to keep. `PR.md` covers branches, commits and pull requests.

## Products

Products are listed in `lib/products.ts` and ranked on the site by a score that blends GitHub popularity and scope.

- **EternalMonitor**: turn your iPad into a screen for your Windows PC (Rust + Swift)
- **EternalRichPresence**: show what you play in Apple Music or Spotify on Discord
- **Exerly Fitness**: food, weight and training targets that adapt to your real data
- **TandemCode**: practice coding interview problems with a partner
- **Better Canvas**: a darker, better organized Canvas for students
- **Eternal2x**: smooth 2x for hand-drawn animation in DaVinci Resolve
- **Eternal Summary**: summarize the page you are reading, with sources you can check
- **hushtype**: hold a key, speak, and the text appears where you type (Mac)
- **EternalExchange**: equivalent exchange alchemy for Minecraft 1.21.1 on Fabric
- **Top Choice Realty**: listings site and agent back office for a New York brokerage
- **Signature Cuts 413**: book a barber by text message, no app needed

Products shipped before the rebrand keep their Eternal-prefixed names. They are separate product brands with their own domains.

## GitHub Data

Stars, forks, downloads, commits, contributors and each engineer's contribution calendar come from `lib/data/github.json`, a committed snapshot. The site never calls GitHub at build or request time. To refresh it:

```bash
npm run sync:github   # needs GITHUB_TOKEN or a logged-in gh CLI
```

## Checks

```bash
npm run build
npm run lint
npx tsc --noEmit
npx prettier --check .
npm run check:consistency   # counts in prose match lib/ data
npm run check:copy          # no em dashes or semicolons in user-facing copy
npx playwright test         # site-wide crawl, pages, scenes, accessibility
npm run check:links         # after a build: every external link answers (needs the network, not in CI)
```

CI runs all of them except `check:links` on every pull request. Set `PLAYWRIGHT_PORT` to run the suite on a port of your own. With `CI=1` it tests the production build instead of the dev server.

## Contributing

We take part-time contributors. Reach us at hello@sideband.studio.

## License

All rights reserved. &copy; 2026 Sideband.
