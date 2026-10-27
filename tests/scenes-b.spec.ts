import { test, expect, type Page } from '@playwright/test'

// Group-b product scenes (components/products/scenes/group-b). Cards render
// in the home page's product grid. Heroes render on a product page once that
// page uses <ProductScene variant="hero">.
const ids = [
  'better-canvas',
  'eternal-summary',
  'hushtype',
  'signature-cuts',
  'top-choice-realty',
]

const scene = (page: Page, id: string, variant: 'card' | 'hero') =>
  page.locator(`svg[data-scene="${id}"][data-variant="${variant}"]`)

/** Running CSS animations inside one scene. */
const running = (page: Page, id: string, variant: string) =>
  page.evaluate(
    ([id, variant]) => {
      const svg = document.querySelector(
        `svg[data-scene="${id}"][data-variant="${variant}"]`,
      )
      if (!svg) return -1
      return svg
        .getAnimations({ subtree: true })
        .filter((a) => a.playState === 'running').length
    },
    [id, variant],
  )

async function checkScene(page: Page, id: string, variant: 'card' | 'hero') {
  const svg = scene(page, id, variant)
  await expect(svg).toHaveCount(1)
  // Decorative: the stage around the drawing is hidden from assistive tech.
  expect(
    await svg.evaluate(
      (el) => el.parentElement?.closest('[aria-hidden="true"]') !== null,
    ),
  ).toBe(true)
  // A small DOM, as the scene contract asks.
  const nodes = await svg.evaluate((el) => el.querySelectorAll('*').length)
  expect(nodes).toBeGreaterThan(30)
  expect(nodes).toBeLessThan(300)

  await svg.scrollIntoViewIfNeeded()
  await expect(svg).toBeVisible()
  await expect(svg).toHaveAttribute('data-play', 'on')
  await expect.poll(() => running(page, id, variant)).toBeGreaterThan(0)
}

test.describe('group-b scenes', () => {
  for (const id of ids) {
    test(`${id} card plays on screen and pauses off screen`, async ({
      page,
    }) => {
      await page.goto('/')
      await checkScene(page, id, 'card')

      await page.evaluate(() => window.scrollTo(0, 0))
      await expect(scene(page, id, 'card')).toHaveAttribute('data-play', 'off')
      await expect.poll(() => running(page, id, 'card')).toBe(0)
    })

    test(`${id} hero plays on its product page`, async ({ page }) => {
      await page.goto(`/products/${id}`)
      const count = await scene(page, id, 'hero').count()
      test.skip(count === 0, 'this product page does not render a hero scene')
      await checkScene(page, id, 'hero')
    })
  }

  test('scenes are still and complete under reduced motion', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    for (const id of ids) {
      const svg = scene(page, id, 'card')
      await svg.scrollIntoViewIfNeeded()
      await expect(svg).toBeVisible()
      await expect(svg).toHaveAttribute('data-play', 'off')
      const animations = await svg.evaluate(
        (el) => el.getAnimations({ subtree: true }).length,
      )
      expect(animations).toBe(0)
      // The still frame shows the finished result, so its text is on screen.
      await expect(svg.locator('text').first()).toBeVisible()
    }
    await context.close()
  })
})
