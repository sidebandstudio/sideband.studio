import { test, expect } from '@playwright/test'
import { products, productsByRank } from '../lib/products'
import {
  visit,
  settle,
  nextFrame,
  horizontalOverflow,
  ABORTED_PREFETCH,
} from './helpers'

test('products index lists every product in ranked order', async ({ page }) => {
  await visit(page, '/products')
  const ranked = productsByRank().map((p) => p.name)

  const entries = page.locator('article[data-rank]')
  await expect(entries).toHaveCount(ranked.length)
  expect(await entries.locator('h2').allTextContents()).toEqual(ranked)
  expect(
    await entries.evaluateAll((els) =>
      els.map((el) => Number(el.getAttribute('data-rank'))),
    ),
  ).toEqual(ranked.map((_, i) => i + 1))

  const table = page.getByRole('region', {
    name: 'Ranking inputs and scores for every product',
  })
  expect(
    await table.locator('tbody th[scope="row"]').allTextContents(),
  ).toEqual(ranked)
})

for (const product of products) {
  test(`${product.id}: page returns 200 with its name and valid actions`, async ({
    page,
    request,
  }) => {
    const res = await visit(page, `/products/${product.id}`)
    expect(res?.status()).toBe(200)
    await expect(
      page.getByRole('heading', { level: 1, name: product.name }),
    ).toBeVisible()

    const hrefs = await page
      .locator('[data-product-actions] a')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    const own = [
      product.links.download,
      product.links.store,
      product.links.site,
      product.links.docs,
      product.links.repo,
    ].filter(Boolean)
    // Every action the data has is offered, once, and nothing else.
    expect([...hrefs].sort()).toEqual([...own].sort())
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\/[^\s]+$/)
      expect(() => new URL(href!)).not.toThrow()
    }

    // Internal links in the page body resolve.
    const internal = await page
      .locator('main a[href^="/"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')!))
    for (const href of Array.from(
      new Set(internal.map((h) => h.split('#')[0])),
    )) {
      expect((await request.get(href)).status(), href).toBe(200)
    }

    // Images are labelled by kind: artwork is never called a screenshot.
    const captions = await page
      .locator('figure figcaption p:first-child span')
      .allTextContents()
    const label = {
      screenshot: 'Screenshot.',
      artwork: 'Artwork.',
      photo: 'Photo.',
    }
    expect([...captions].sort()).toEqual(
      product.images.map((i) => label[i.kind]).sort(),
    )
  })
}

test('the image viewer works by keyboard', async ({ page }) => {
  const product = products.find((p) => p.id === 'eternal2x')!
  const [first, second] = product.images
  await visit(page, `/products/${product.id}`)

  const trigger = page.getByRole('button', {
    name: `View larger: ${first.alt}`,
  })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('img', { name: first.alt })).toBeVisible()
  await expect(dialog).toContainText(`1 of ${product.images.length}`)
  // The credit travels with the image into the viewer.
  await expect(
    dialog.getByRole('link', { name: first.credit!.text }),
  ).toHaveAttribute('href', first.credit!.href!)

  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('img', { name: second.alt })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(
    dialog.getByRole('img', { name: product.images.at(-1)!.alt }),
  ).toBeVisible()

  await dialog.getByRole('button', { name: 'Next image' }).focus()
  await page.keyboard.press('Enter')
  await expect(dialog.getByRole('img', { name: first.alt })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('leaving a product page with the viewer open releases the scroll lock', async ({
  page,
}) => {
  await visit(page, '/products')
  await page
    .getByRole('heading', { name: 'EternalMonitor' })
    .getByRole('link')
    .click()
  await page.waitForURL('**/products/eternal-monitor')
  await settle(page)

  await page
    .getByRole('button', { name: /^View larger:/ })
    .first()
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe('hidden')

  await page.goBack()
  await page.waitForURL(/\/products$/)
  await settle(page)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe('')
  await page.mouse.wheel(0, 1600)
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0)
})

/**
 * The rendered text of every match stays inside the viewport, and the first
 * one does not overlap `avoid`. Text boxes are measured with a Range because
 * a heading's own box can be narrower than the word that spills out of it.
 */
async function textFits(
  page: import('@playwright/test').Page,
  selector: string,
  avoid?: string,
) {
  return page.evaluate(
    ({ selector, avoid }) => {
      const problems: string[] = []
      const boxes = Array.from(document.querySelectorAll(selector)).map(
        (el) => {
          const range = document.createRange()
          range.selectNodeContents(el)
          const rects = Array.from(range.getClientRects())
          return {
            text: el.textContent,
            left: Math.min(...rects.map((r) => r.left)),
            right: Math.max(...rects.map((r) => r.right)),
            top: Math.min(...rects.map((r) => r.top)),
            bottom: Math.max(...rects.map((r) => r.bottom)),
          }
        },
      )
      for (const b of boxes) {
        if (b.left < 0 || b.right > window.innerWidth)
          problems.push(`${b.text} spans ${b.left}-${b.right}`)
      }
      const other = avoid ? document.querySelector(avoid) : null
      if (other && boxes[0]) {
        const a = other.getBoundingClientRect()
        const t = boxes[0]
        if (
          t.left < a.right &&
          t.right > a.left &&
          t.top < a.bottom &&
          t.bottom > a.top
        )
          problems.push(`${t.text} overlaps ${avoid}`)
      }
      return problems
    },
    { selector, avoid },
  )
}

for (const product of products) {
  test(`${product.id}: hero title fits and clears the actions at 360, 390, 1440`, async ({
    page,
  }) => {
    // One load, then each width by resizing: the title's fit is layout only.
    await page.setViewportSize({ width: 360, height: 900 })
    await visit(page, `/products/${product.id}`)
    for (const width of [360, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await nextFrame(page)
      expect(
        await textFits(page, 'h1', '[data-product-actions]'),
        `at ${width}`,
      ).toEqual([])
    }
  })
}

test('products index names fit at 360, 768, 1440', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 })
  await visit(page, '/products')
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await nextFrame(page)
    expect(await textFits(page, 'h1, article h2'), `at ${width}`).toEqual([])
  }
})

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1440, height: 700 },
  { width: 390, height: 844 },
]) {
  test(`the viewer shows every image at least as large as the page at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.setTimeout(120000)
    await page.setViewportSize(viewport)
    for (const id of ['eternal2x', 'eternal-monitor', 'exerly']) {
      const product = products.find((p) => p.id === id)!
      await visit(page, `/products/${id}`)
      const triggers = page.getByRole('button', { name: /^View larger:/ })
      const count = await triggers.count()
      expect(count).toBe(product.images.length)
      for (let i = 0; i < count; i++) {
        const trigger = triggers.nth(i)
        await trigger.scrollIntoViewIfNeeded()
        const inline = await trigger
          .locator('img')
          .evaluate((img) => img.getBoundingClientRect().width)
        await trigger.click()
        const shown = page.getByRole('dialog').locator('img').first()
        await expect(shown).toBeVisible()
        const box = await shown.evaluate((img: HTMLImageElement) => ({
          width: img.getBoundingClientRect().width,
          natural: Number(img.getAttribute('width')),
          sizes: img.getAttribute('sizes'),
        }))
        expect(box.width, `${id} image ${i}`).toBeGreaterThanOrEqual(inline - 1)
        expect(box.width).toBeLessThanOrEqual(
          Math.min(box.natural, viewport.width) + 1,
        )
        expect(box.sizes).toMatch(/^\d+px$/)
        expect(Math.abs(parseInt(box.sizes!) - box.width)).toBeLessThanOrEqual(
          1,
        )
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toBeHidden()
      }
    }
  })
}

for (const product of products) {
  test(`${product.id}: the first screenshot follows the hero and features sit beside their images`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, `/products/${product.id}`)
    const lead =
      product.images.find((i) => i.kind === 'screenshot') ?? product.images[0]
    const leadBlock = page.locator('[data-lead]')
    const view = (alt: string) =>
      page.getByRole('button', { name: `View larger: ${alt}`, exact: true })

    // The lead is the first image on the page, before the overview.
    await expect(
      leadBlock.getByRole('button', { name: `View larger: ${lead.alt}` }),
    ).toHaveCount(1)
    const order = await page.evaluate(() => {
      const first = document.querySelector('figure')
      const overview = document.getElementById('overview-title')
      return first && overview
        ? Boolean(
            first.compareDocumentPosition(overview) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          )
        : false
    })
    expect(order).toBe(true)

    // Each paired feature shares its block with the image that shows it.
    for (const feature of product.features.filter((f) => f.image)) {
      const image = product.images.find((i) => i.src === feature.image)!
      const block =
        image === lead
          ? leadBlock
          : page.locator('li', {
              has: page.getByRole('heading', {
                name: feature.title,
                exact: true,
              }),
            })
      await expect(
        block.getByRole('heading', { name: feature.title }),
      ).toHaveCount(1)
      await expect(
        block.locator(`button[aria-label="View larger: ${image.alt}"]`),
      ).toHaveCount(1)
    }

    // Every image appears once, and the description is not repeated.
    for (const image of product.images)
      await expect(view(image.alt)).toHaveCount(1)
    expect(await page.locator('main').innerText()).not.toContain(
      product.description,
    )
  })
}

/**
 * What Next logs when a route prefetch is cut off because the page navigates
 * or closes while it is in flight. Matched exactly, so any other failed fetch
 * or console error still fails the test.
 */
/**
 * Two fresh loads, the narrowest and the widest width, so code that runs at
 * mount runs at both ends. The widths between are reached by resizing the
 * narrow load. Each load is scrolled to the end so scroll-driven code runs.
 */
const LOADS = [[390, 768, 1440], [1920]]
const WIDTHS = LOADS.flat()

for (const path of ['/products', ...products.map((p) => `/products/${p.id}`)]) {
  test(`no console errors on ${path} at ${WIDTHS.join(', ')}`, async ({
    context,
  }) => {
    for (const [loadWidth, ...resizes] of LOADS) {
      // A page per load: nothing navigates away mid-test, and listeners are
      // removed before the page closes, so teardown cannot report errors.
      const page = await context.newPage()
      const errors: string[] = []
      const onConsole = (m: import('@playwright/test').ConsoleMessage) => {
        if (m.type() === 'error' && !ABORTED_PREFETCH.test(m.text()))
          errors.push(m.text())
      }
      const onPageError = (e: Error) => errors.push(e.message)
      page.on('console', onConsole)
      page.on('pageerror', onPageError)

      await page.setViewportSize({ width: loadWidth, height: 900 })
      expect((await visit(page, path))?.status()).toBe(200)
      for (const width of [loadWidth, ...resizes]) {
        await page.setViewportSize({ width, height: 900 })
        await nextFrame(page)
        const { overflow, culprits } = await horizontalOverflow(page)
        expect(
          overflow,
          [`horizontal overflow at ${width}`, ...culprits].join('\n'),
        ).toBeLessThanOrEqual(0)
      }
      await page.evaluate(() =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'instant',
        }),
      )
      await settle(page)

      page.off('console', onConsole)
      page.off('pageerror', onPageError)
      await page.close()
      expect(errors, `loaded at ${loadWidth}`).toEqual([])
    }
  })
}
