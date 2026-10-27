import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from '@playwright/test'
import { engineers } from '../lib/engineers'
import { products } from '../lib/products'
import {
  ABORTED_PREFETCH,
  horizontalOverflow,
  nextFrame,
  visit,
} from './helpers'

/**
 * Site-wide checks on every route: what the sitemap lists, what the pages
 * link to, and what each page must get right at phone and desktop width.
 */

const SITE = 'https://sideband.studio'

const ROUTES = [
  '/',
  '/products',
  ...products.map((p) => `/products/${p.id}`),
  '/engineers',
  ...engineers.map((e) => `/engineers/${e.id}`),
  '/about',
  '/contact',
]

const WIDTHS = [390, 1440]

/** The site URL a route should claim as canonical. */
const canonical = (route: string) => (route === '/' ? SITE : SITE + route)

/**
 * Internal page links in server-rendered HTML, as paths without their hash.
 * Files (a resume PDF) are checked with the other links on each page.
 */
function linkedRoutes(html: string) {
  return Array.from(
    html.matchAll(/<a[^>]+href="(\/[^"#?]*)/g),
    (m) => m[1],
  ).filter((path) => !/\.[a-z0-9]+$/i.test(path))
}

test('the sitemap lists every route, and every route a page links to is in it', async ({
  request,
}) => {
  test.setTimeout(120000)
  const xml = await (await request.get('/sitemap.xml')).text()
  const listed = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1])
  expect([...listed].sort()).toEqual(ROUTES.map(canonical).sort())

  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  expect(robots).not.toMatch(/Disallow: \/\S/)

  // Crawl from the home page: every internal link leads to a known route.
  const seen = new Set<string>()
  const queue = ['/']
  const titles = new Map<string, string>()
  while (queue.length) {
    const route = queue.shift()!
    if (seen.has(route)) continue
    seen.add(route)
    const res = await request.get(route)
    expect(res.status(), route).toBe(200)
    const html = await res.text()
    titles.set(route, html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
    for (const next of linkedRoutes(html)) {
      expect(ROUTES, `${route} links to ${next}`).toContain(next)
      if (!seen.has(next)) queue.push(next)
    }
  }
  expect(Array.from(seen).sort()).toEqual([...ROUTES].sort())
  // Each page has a title of its own.
  expect(new Set(titles.values()).size).toBe(ROUTES.length)
})

/** Checks every response once per test, even when a page repeats a link. */
function checker(request: APIRequestContext) {
  const done = new Map<string, Promise<number>>()
  return (url: string) => {
    if (!done.has(url))
      done.set(
        url,
        request.get(url).then(async (r) => {
          await r.body()
          return r.status()
        }),
      )
    return done.get(url)!
  }
}

async function metaContent(page: Page, selector: string) {
  return page
    .locator(`head ${selector}`)
    .first()
    .getAttribute('content', { timeout: 1000 })
    .catch(() => null)
}

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route} at ${width}px: one h1, metadata, no errors, no overflow, links and images resolve`, async ({
      page,
      request,
    }) => {
      test.setTimeout(120000)
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' && !ABORTED_PREFETCH.test(m.text()))
          errors.push(m.text())
      })
      page.on('pageerror', (e) => errors.push(e.message))
      await page.setViewportSize({ width, height: 900 })
      const res = await visit(page, route)
      expect(res?.status()).toBe(200)
      await page.evaluate(() => document.fonts.ready)

      await expect(page.locator('h1')).toHaveCount(1)

      // Metadata: specific title and description, canonical URL on the real
      // site, and social images that exist.
      expect((await page.title()).trim()).not.toBe('')
      expect(
        (await metaContent(page, 'meta[name="description"]'))?.trim(),
      ).toBeTruthy()
      expect(
        await page.locator('head link[rel="canonical"]').getAttribute('href'),
      ).toBe(canonical(route))
      const check = checker(request)
      // The dev server points social images at itself so they preview
      // locally. The production build (CI=1) must point them at the site.
      const origins = process.env.CI
        ? [SITE]
        : [SITE, `http://localhost:${new URL(page.url()).port}`]
      for (const selector of [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
      ]) {
        const url = (await metaContent(page, selector)) ?? ''
        const origin = origins.find((o) => url.startsWith(`${o}/`))
        expect(origin, `${selector} ${url}`).toBeTruthy()
        expect(await check(url.slice(origin!.length)), url).toBe(200)
      }
      expect(await metaContent(page, 'meta[property="og:url"]')).toBe(
        canonical(route),
      )

      // No sideways scrolling.
      const { overflow, culprits } = await horizontalOverflow(page)
      expect(
        overflow,
        ['horizontal overflow', ...culprits].join('\n'),
      ).toBeLessThanOrEqual(0)

      // Every internal link resolves, and every anchor it names exists.
      const links = await page.locator('a[href]').evaluateAll((els) =>
        els
          .map((a) => new URL((a as HTMLAnchorElement).href))
          .filter((u) => u.origin === location.origin)
          .map((u) => ({ path: u.pathname, hash: u.hash.slice(1) })),
      )
      const pages = new Map<string, string>()
      for (const { path, hash } of links) {
        expect(await check(path), path).toBe(200)
        if (!hash) continue
        if (path === new URL(page.url()).pathname) {
          await expect(page.locator(`[id="${hash}"]`), `#${hash}`).toHaveCount(
            1,
          )
        } else {
          if (!pages.has(path))
            pages.set(path, await (await request.get(path)).text())
          expect(pages.get(path), `${path}#${hash}`).toContain(`id="${hash}"`)
        }
      }

      // Every image has alt text. An empty alt marks a decorative image, so
      // it never stands alone as the content of a link or button.
      const images = await page.locator('img').evaluateAll((els) =>
        els.map((el) => {
          const img = el as HTMLImageElement
          const control = img.closest('a, button')
          const label =
            control &&
            (control.getAttribute('aria-label') ||
              (control as HTMLElement).innerText.trim())
          return {
            src: img.getAttribute('src') ?? '',
            alt: img.getAttribute('alt'),
            named: !control || Boolean(label),
            broken: img.complete && img.naturalWidth === 0,
          }
        }),
      )
      for (const img of images) {
        expect(img.alt, `alt on ${img.src}`).not.toBeNull()
        expect(img.named, `${img.src} is the only content of a control`).toBe(
          true,
        )
        expect(img.broken, `${img.src} failed to decode`).toBe(false)
        expect(await check(img.src), img.src).toBe(200)
      }

      expect(errors).toEqual([])
    })
  }
}

// The narrowest phones, below the widths above. Long unbreakable text (an
// address, a handle) is what overflows here, and platforms measure text
// differently (Linux sets it a few pixels wider than macOS), so one load is
// resized through the narrow widths.
for (const route of ROUTES) {
  test(`${route} from 320 to 375px: no sideways scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await visit(page, route)
    await page.evaluate(() => document.fonts.ready)
    for (const width of [320, 340, 360, 375]) {
      await page.setViewportSize({ width, height: 900 })
      await nextFrame(page)
      const { overflow, culprits } = await horizontalOverflow(page)
      expect(
        overflow,
        [`horizontal overflow at ${width}`, ...culprits].join('\n'),
      ).toBeLessThanOrEqual(0)
    }
  })
}

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route} at ${width}px under reduced motion: nothing animates and all text shows`, async ({
      page,
    }) => {
      test.setTimeout(90000)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      await visit(page, route)

      // Entrances and loops are off: no CSS or Web Animation is running.
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              document.getAnimations().filter((a) => a.playState === 'running')
                .length,
          ),
        )
        .toBe(0)

      // Nor does script move anything: no style or attribute changes on
      // drawn elements for longer than the shortest loop's step.
      const moved = await page.evaluate(
        () =>
          new Promise<string[]>((resolve) => {
            const seen: string[] = []
            const observer = new MutationObserver((records) => {
              for (const r of records)
                seen.push(
                  `${(r.target as Element).tagName} ${r.attributeName ?? ''}`,
                )
            })
            observer.observe(document.querySelector('main')!, {
              subtree: true,
              attributes: true,
              attributeFilter: [
                'style',
                'transform',
                'x',
                'y',
                'cx',
                'cy',
                'd',
                'opacity',
                'width',
                'height',
              ],
              characterData: true,
            })
            setTimeout(() => {
              observer.disconnect()
              resolve(seen)
            }, 1500)
          }),
      )
      expect(moved).toEqual([])

      // Every piece of text that is laid out is fully drawn: nothing is left
      // at zero opacity or hidden by an entrance that never ran.
      const faded = await page.evaluate(() => {
        const out: string[] = []
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        )
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const text = n.textContent?.trim()
          const el = n.parentElement
          if (!text || !el || el.closest('script, style, noscript')) continue
          // Hidden from everyone by design: an unselected tab's panel, and the
          // product videos, which tests/videos.spec.ts checks.
          if (el.closest('[aria-hidden="true"]')) continue
          if (el.getClientRects().length === 0) continue
          if (getComputedStyle(el).visibility !== 'visible') {
            out.push(`hidden: ${text.slice(0, 40)}`)
            continue
          }
          let opacity = 1
          for (let a: Element | null = el; a; a = a.parentElement)
            opacity *= Number(getComputedStyle(a).opacity)
          if (opacity < 0.05)
            out.push(`opacity ${opacity}: ${text.slice(0, 40)}`)
        }
        return out
      })
      expect(faded).toEqual([])
    })
  }
}

for (const route of [
  '/',
  '/products',
  `/products/${products[0].id}`,
  `/engineers/${engineers[0].id}`,
]) {
  test(`${route} on a phone: no layout shift, light images, no GitHub snapshot in scripts`, async ({
    page,
  }) => {
    test.setTimeout(120000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(() => {
      const w = window as unknown as { shift: number }
      w.shift = 0
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as {
          value: number
          hadRecentInput: boolean
        }[])
          if (!e.hadRecentInput) w.shift += e.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    const images: { url: string; bytes: number }[] = []
    const scripts: Promise<string>[] = []
    page.on('response', (r) => {
      const type = r.headers()['content-type'] ?? ''
      if (type.startsWith('image/'))
        r.body()
          .then((b) => images.push({ url: r.url(), bytes: b.length }))
          .catch(() => {})
      if (type.includes('javascript')) scripts.push(r.text().catch(() => ''))
    })
    await visit(page, route)

    // Scroll the whole page so every lazy image and entrance has its turn.
    const height = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => r(null))),
      )
    }
    await page.waitForLoadState('networkidle')

    const shift = await page.evaluate(
      () => (window as unknown as { shift: number }).shift,
    )
    expect(shift, 'cumulative layout shift').toBeLessThanOrEqual(0.1)
    expect(images.length).toBeGreaterThan(0)
    for (const img of images)
      expect(img.bytes, img.url).toBeLessThanOrEqual(500 * 1024)
    // lib/data/github.json stays on the server. Bundled JSON keeps its quoted
    // keys, so its calendar field would show up in a client script.
    for (const js of await Promise.all(scripts))
      expect(js).not.toContain('"firstDay"')
  })
}
