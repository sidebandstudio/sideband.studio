# Sideband design system

The contract for every page on sideband.studio. If a page follows this file it looks like part of
the same site. Tokens live in `tailwind.config.ts` (colours, type, spacing, radii, motion) and
`styles/globals.css` (motion keyframes, backdrops, base styles). Components live in
`components/ui/`. Single dark theme, no toggle.

## Direction

A dark room with lit exhibits. The page is a near-black graphite ground. The things Sideband made
(real screenshots and hand-built SVG product scenes) are the pictures, set one tone up with a large
radius. Type is one grotesk, set large and quiet. Colour is held back: neutral ink and white pill
buttons, the brand magenta on one or two things per screen. The Sideband mark's two offset tiles
(magenta above, violet below) are the system's only ornament: the eyebrow glyph and the `bands`
backdrop. Motion is short entrances and slow loops that follow the product, never decoration for its
own sake.

Taste Skill (`taste-skill/SKILL.md`) house rules apply, with four deliberate exceptions the brief
or the brand requires: eyebrows exist (sentence case, with the band glyph, never tracked caps), the
navbar blurs once scrolled, violet appears because it is half of the mark, and three cheap
backdrops exist (grid, spotlight, bands), each used at most once per page.

## Type

One family: **Hanken Grotesk** (`next/font/google`, self-hosted at build, `--font-sans`). Weights:
400 for text, 500 for headings and figures, 600 only for the wordmark. Never bold headlines.
**JetBrains Mono** (`--font-mono`, `font-mono`) only inside real code or inside a product UI
fragment. No mono eyebrows, labels or captions.

Five sizes. Nothing else on new pages.

| Token          | Size (390 → 1440+) | Leading / tracking   | Use                                              |
| -------------- | ------------------ | -------------------- | ------------------------------------------------ |
| `text-display` | 44 → 104px         | 0.95 / -0.045em, 500 | The page's `h1`, once per page                   |
| `text-head`    | 32 → 56px          | 1.0 / -0.035em, 500  | Section `h2`, stat figures, mobile menu          |
| `text-lead`    | 20 → 24px          | 1.35 / -0.015em      | Ledes, card titles (`h3`, `font-medium`)         |
| `text-body`    | 16 → 18px          | 1.55 / -0.005em      | Running text, in full ink (`text-sideband-text`) |
| `text-small`   | 14px               | 1.45                 | Labels, badges, nav, footer, captions            |

Headlines fit in two lines at every width. Author the line break (`<br />`) when it matters.
One exception to the 44px floor: the home headline (`h1.title` in `components/home/Hero.module.css`)
shrinks with the viewport below about 400px, to about 35px at 320px, so it stays on two lines.
`tests/home.spec.ts` checks two lines from 320 to 1920px.
Left-aligned by default. Centre at most one moment per page (usually the closing call to action).
Numbers that align get `tabular-nums`.

## Colour

Tailwind scale `sideband-*`, also emitted as `--sideband-*` CSS variables by the plugin in
`tailwind.config.ts` (the single source). Opacity modifiers work (`bg-sideband-black/75`).

| Role       | Token                             | Value                       | Use                                                            |
| ---------- | --------------------------------- | --------------------------- | -------------------------------------------------------------- |
| Ground     | `sideband-black`                  | #0b0b0d                     | 70–90% of every screen                                         |
| Surface 1  | `sideband-surface`                | #131316                     | Panels, scenes, `tone="surface"` sections, footer              |
| Surface 2  | `sideband-surface-2`              | #1b1b1f                     | Badges, secondary buttons, hover on surface 1                  |
| Surface 3  | `sideband-surface-3`              | #25252a                     | Hover on surface 2, selected tab                               |
| Ink        | `sideband-text`                   | #f3f2ef                     | Headings and running text                                      |
| Ink 2      | `sideband-text-secondary`         | #bdbcc4                     | Ledes, nav links, secondary copy                               |
| Muted      | `sideband-muted`                  | #8f8e98                     | Stat labels, captions, copyright (≥ 5.5:1 on ground)           |
| Line       | `sideband-border` / `-strong`     | white 8% / 14%              | Form fields and product UI only                                |
| Accent     | `sideband-accent`                 | #f931ab                     | Focus ring, selection, active dot, one word or mark per screen |
| Accent dim | `sideband-accent-dim`             | magenta 14%                 | Tinted fills behind an accent glyph                            |
| Violet     | `sideband-violet`                 | #7f46f5                     | The mark's lower tile only (band glyph, bands backdrop)        |
| Status     | `sideband-ok` / `warn` / `danger` | #4ade80 / #f5b83d / #f87171 | Status dots and form states                                    |

Rules: buttons are neutral (white primary). Headlines are ink, never accent. No gradients on text or
buttons. No raw hex in components; if a colour is missing, it is a token here first.

**Per-product accent.** Each product's `accentColor` in `lib/products.ts` plugs in through one CSS
variable. Wrap the product's region with `style={productAccentStyle(product.accentColor)}` (from
`components/products/scenes`), then use `bg-product`, `text-product`, `bg-product-dim` (16% tint),
`<Badge tone="product">`, or `<Backdrop variant="spotlight" tone="accent" colors={{ a: accent }} />`.
`<ProductScene>` sets it for you. The product accent replaces the brand accent inside that region
only; it never colours page headings or primary buttons.

## Space and layout

- Frame: `<Container>` = `max-w-container` (1400px) with `px-gutter` (20 → 40px). `size="narrow"`
  is 880px for forms and long reading. Text measure: `max-w-prose` (640px).
- Sections: `<Section>` pads `py-section` (64 → 120px) top and bottom, so neighbours sit about
  130px apart on a phone and about 195px at 1440. `spacing="tight"` halves it. A gap inside a
  section is always smaller than the gap between sections.
- Grid: CSS grid inside the container. Columns 1 → 2 (`sm`) → 3 (`lg`) for collections, with
  `gap-x-6 gap-y-12`. Two-column splits use `lg:grid-cols-2 gap-16`. Heading to content: `mt-14`.
- Nav height: `h-nav` / `top-nav` (64px). The navbar is fixed, so a page's first section starts with
  at least `pt-32`.
- Breakpoints are Tailwind's defaults. Design at 390 and 1440 and check 768.

## Radii, borders and elevation

- `rounded-panel` (20px) for panels, scenes and screenshots. `rounded-inner` (12px) for media or
  controls inside a panel. `rounded-full` for buttons, badges and nav pills. Nothing else.
- Surfaces separate by tone steps, never by outlines. Do not nest a surface inside a surface.
- Borders (`sideband-border`) only on form fields and inside product UI fragments.
- Shadows only on things that float: a product window over a backdrop
  (`shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]`), a menu, a dialog. No glows.

## Motion

Tokens (Tailwind and CSS variables):

| Duration         | Value | Use                                 |
| ---------------- | ----- | ----------------------------------- |
| `duration-press` | 120ms | Active and press states             |
| `duration-hover` | 180ms | Colour and small transform on hover |
| `duration-ui`    | 320ms | Menus, tabs, card lifts             |
| `duration-enter` | 720ms | Entrances (Reveal)                  |

Easings: `ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) for entrances and lifts, `ease-standard`
(0.2, 0, 0, 1) for state changes, `ease-in-out` (0.65, 0, 0.35, 1) for ambient loops.

- **Page load.** The first screen plays once: `<Reveal trigger="mount" delay={i * 70}>` (pure CSS
  `[data-rise]`, runs before hydration). Eyebrow, title, lede, actions, then the picture.
- **Scroll entrances.** Everything below the fold: `<Reveal delay={i * 70}>` rises 24px with opacity,
  once, staggered 70ms per sibling (`<SectionHeading>` does this for you). Content above the fold, with
  script off, or under reduced motion is simply visible.
- **Ambient loops.** Only inside scenes and the `bands` backdrop. Use `useAmbient(ref)` from
  `components/ui/motion.ts`: it sets `data-play="on"` only while the element is on screen, the tab is
  visible and motion is allowed. CSS loops use `animation-play-state: var(--play, paused)`; script
  loops read the returned boolean. Periods 6–20s, amplitudes small.
- **Home preview.** The one loop outside scenes: the hero window (`components/home/HeroPreview.tsx`)
  pages to the next product every 6s while it is on screen, the tab is visible and motion is
  allowed. Hover or focus holds it, picking a tab stops it, and a visible Pause button stops and
  restarts it. Under reduced motion it never pages and the button is not shown.
- **Hover and press.** Buttons scale to 0.97 on press. Linked cards lift their picture 4px
  (`group-hover:-translate-y-1`). Arrows step 4px (`ArrowLink`). Surfaces lift one tone. Never
  change font weight on hover.
- **Reduced motion.** `prefers-reduced-motion: reduce` turns every animation and transition off
  (global rule at the end of `globals.css`) and every element ends visible and complete. Count-ups
  show the final value. Test it.
- Transform and opacity only. No layout-affecting animation, no scroll-jacking, no custom cursor,
  no live SVG noise filter (the grain is one tiled `body::after` texture).

## Components (`components/ui/`)

| Component              | Use                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container`            | The page frame. `size="wide"` (default) or `"narrow"`.                                                                                                                                                                                                  |
| `Section`              | Every page section. `labelledBy`, `tone="ground" \| "surface"`, `spacing`, `contained`, `backdrop`.                                                                                                                                                     |
| `SectionHeading`       | `eyebrow`, `title`, `lede`, `actions`, `id`, `as="h1"` for the page title, `align="center"` once per page, `trigger="mount"` in the first screen.                                                                                                       |
| `Eyebrow`, `BandGlyph` | A short sentence-case label with the mark glyph. Use through `SectionHeading`.                                                                                                                                                                          |
| `Button`               | `variant="primary"` (white pill, one per screen), `"secondary"` (surface pill), `"ghost"`. `size="md" \| "lg"`. `href` makes it a link (internal → `Link`), `external` opens a new tab, no `href` renders `<button>` (`type="submit"` for forms).       |
| `ArrowLink`            | "All products" style text link with a moving arrow. `external` switches to the up-right arrow.                                                                                                                                                          |
| `Badge`                | Small filled label, `tone="neutral" \| "product"`. Tags, platforms, languages.                                                                                                                                                                          |
| `StatusBadge`          | A product's `status` with its dot: Live, In development, Coming soon.                                                                                                                                                                                   |
| `Stat`                 | A figure and its label as a `<dt>/<dd>` pair. Always inside a `<dl>`. `countUp` animates numbers once on scroll. Only real figures from `lib/` or the GitHub snapshot.                                                                                  |
| `Reveal`               | Entrance wrapper, see Motion. `as` sets the tag (`as="li"` in lists).                                                                                                                                                                                   |
| `Backdrop`             | `variant="grid"` (dot grid behind a product stage), `"spotlight"` (one light from `top`/`bottom`, `tone="accent"` to tint), `"bands"` (the mark's two tiles, faint, drifting). Pass to `<Section backdrop>`. One per page section, bands once per page. |
| `Icons`                | `GitHubIcon`, `CheckIcon`, `ArrowRightIcon`, `ArrowUpRightIcon`, `RepoIcon`.                                                                                                                                                                            |
| `motion.ts`            | `useAmbient`, `useReducedMotion`, `prefersReducedMotion`, `isBelowFold`.                                                                                                                                                                                |
| `cx`                   | Class joiner.                                                                                                                                                                                                                                           |

Shell (`components/layout/`): `Navbar` (fixed, transparent at the top and blurred once scrolled,
Products / Engineers / About with `aria-current`, white Contact pill, a full-screen mobile menu with
focus trap, Escape, focus return and scroll lock) and `Footer` (Products and Engineers columns derived
from `lib/`, Studio pages, Contact, copyright year). `app/layout.tsx` adds the skip link to `#main`.

Example section:

```tsx
<Section labelledBy="work-title" tone="surface">
  <SectionHeading
    id="work-title"
    eyebrow="Products"
    title="What we build"
    lede="…"
  />
  <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((p, i) => (
      <Reveal as="li" key={p.id} delay={(i % 3) * 70}>
        …
      </Reveal>
    ))}
  </ul>
</Section>
```

## Product scenes

`components/products/scenes/index.tsx` is the contract for the per-product animated SVG scenes.

- `type SceneVariant = 'card' | 'hero'`, `scenes: Partial<Record<productId, ComponentType<{ variant }>>>`,
  `ProductScene({ id, variant, className })`, `productAccentStyle(accent)`.
- `ProductScene` draws the stage: `rounded-panel bg-sideband-surface`, `overflow-hidden`, with
  `--product-accent` set. A scene fills it (`absolute inset-0` or `h-full w-full`) and draws no
  frame, radius or background of its own beyond the surface.
- **card**: 4:3 at every width (about 420×315 at 1440 in a three-column grid, 350×263 on a phone).
  Draw in `viewBox="0 0 800 600"`.
- **hero**: 4:3 below `md`, 16:10 from `md` (up to 1400×875). Draw in `viewBox="0 0 1600 1000"`
  with `preserveAspectRatio="xMidYMid slice"` and keep everything essential inside the centred
  1334×1000 safe area, which is what remains at 4:3. While the hero stage is narrower than 480px (a
  4:3 phone stage) it shows the card drawing instead, where the hero drawing's text would fall
  under 12px (`SceneStage` in `group-a/Stage.tsx`, `Framings` in `group-b/Stage.tsx`).
- Colour: the product accent (`var(--product-accent)`, or `color-mix` tints of it) for the one lit
  element, `--sideband-surface-2/3` and `--sideband-text-secondary/muted` for structure, white at
  low opacity for lines. No other hues.
- Text inside a scene uses `--font-mono` or `--font-sans` with a font size of at least 36 units in
  the card drawing and 38 in the hero, so it renders at 12px or more at every stage width
  (`tests/scenes-legibility.spec.ts` measures it). Text that cannot meet that is left out.
- Motion: a scene shows what the product does (frames streaming, a status updating, a summary
  typing), as one loop of 6–20s. Gate it with `useAmbient` (pauses offscreen and in hidden tabs).
  Under reduced motion it renders a complete still frame. Transform and opacity only, no filters
  animated per frame, no more than about 40 moving nodes.
- Accessibility: the stage is `aria-hidden`. The page names the product in text next to it.
- When no scene is registered, `ProductScene` shows the product's icon centred on the dot grid with
  one short flat bar in the product accent beneath it. No light or glow. It is a finished fallback,
  not a placeholder.

## Do and don't

- Do let the product be the picture: real screenshots on `rounded-panel`, scenes, nothing generic.
- Do keep one dominant thing per screen and give every section a heading.
- Do take every figure from `lib/` or the synced GitHub snapshot.
- Don't use eyebrows in tracked caps, `[ BRACKETS ]`, index numbers (01 / 02), or mono labels.
- Don't outline cards, add hairline dividers, or stack shadows and glows on things at rest.
- Don't use gradient text, gradient buttons, emoji, icons in tinted squares, or AI raster art
  posing as product UI.
- Don't colour headlines, and don't use the accent in more than two places per screen.
- Don't add a sixth type size or a second sans family.
