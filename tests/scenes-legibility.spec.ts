import { test, expect, type Page } from '@playwright/test'

// Every piece of text a product scene draws must render at 12 CSS px or more,
// in every place a scene appears: cards on the home page and /products, the
// hero on /products/<id>, and the related-product cards at the foot of each
// product page. The rendered size is the text's font size times the scale the
// SVG applies to it (its screen transform), so it shrinks with the stage.

const MIN_PX = 12
const WIDTHS = [320, 390, 768, 1024, 1440, 1920]
const IDS = [
  'eternal-monitor',
  'eternal-rich-presence',
  'eternal2x',
  'eternal-exchange',
  'exerly',
  'tandemcode',
  'better-canvas',
  'eternal-summary',
  'hushtype',
  'signature-cuts',
  'top-choice-realty',
]
const PAGES = ['/', '/products', ...IDS.map((id) => `/products/${id}`)]

interface Reading {
  id: string
  framing: 'card' | 'hero'
  text: string
  px: number
}

/**
 * Reads every text run in every scene stage on the page. The stage is the
 * ProductScene surface itself (a linked wrapper may also be a rounded panel). A run counts when it
 * is in the drawing on show (not display:none) and inside the stage's visible
 * box. Opacity is ignored on purpose: a label hidden in the still frame is
 * shown at some point in the loop, so it has to be legible too.
 */
function measure(page: Page) {
  return page.evaluate(() => {
    const out: {
      id: string
      framing: 'card' | 'hero'
      text: string
      px: number
    }[] = []
    const stages = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.rounded-panel.bg-sideband-surface[aria-hidden="true"]',
      ),
    )
    for (const stage of stages) {
      const scene = stage.querySelector('[data-scene]')
      if (!scene) continue
      const id = scene.getAttribute('data-scene') ?? ''
      // The stage's aspect class tells the framing: heroes go 16:10 from md.
      const framing = stage.className.includes('md:aspect-[16/10]')
        ? 'hero'
        : 'card'
      const box = stage.getBoundingClientRect()
      if (box.width === 0) continue
      const runs = Array.from(
        stage.querySelectorAll('text, tspan'),
      ) as SVGTextContentElement[]
      for (const el of runs) {
        const content = (el.textContent ?? '').trim()
        if (!content) continue
        if (el.getClientRects().length === 0) continue
        const style = getComputedStyle(el)
        if (style.visibility === 'hidden') continue
        const r = el.getBoundingClientRect()
        const inside =
          r.right > box.left + 1 &&
          r.left < box.right - 1 &&
          r.bottom > box.top + 1 &&
          r.top < box.bottom - 1
        if (!inside) continue
        const m = el.getScreenCTM()
        if (!m) continue
        const scale = Math.hypot(m.c, m.d)
        out.push({
          id,
          framing,
          text: content.slice(0, 40),
          px: Math.round(parseFloat(style.fontSize) * scale * 100) / 100,
        })
      }
    }
    return out
  })
}

for (const width of WIDTHS) {
  test.describe(`scene text at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const path of PAGES) {
      test(`${path} has no scene text under ${MIN_PX}px`, async ({ page }) => {
        // The still frame: every element at its base transform.
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(path)
        const readings: Reading[] = await measure(page)
        if (path.startsWith('/products/')) {
          const id = path.split('/').pop()
          expect(
            readings.some((r) => r.id === id && r.framing === 'hero'),
            `the ${id} hero draws text`,
          ).toBe(true)
        }
        const small = readings.filter((r) => r.px < MIN_PX)
        expect(
          small.map((r) => `${r.id} ${r.framing} "${r.text}" ${r.px}px`),
        ).toEqual([])
      })
    }
  })
}
