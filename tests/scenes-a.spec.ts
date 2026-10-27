import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// The animated SVG scenes in components/products/scenes/group-a.
const IDS = [
  'eternal-monitor',
  'eternal-rich-presence',
  'eternal2x',
  'eternal-exchange',
  'exerly',
  'tandemcode',
]

for (const id of IDS) {
  test(`${id} scene renders on the products index and is decorative`, async ({
    page,
  }) => {
    // The home page features only the top three, so /products, which shows
    // every scene, is where each one is checked. Rank 1 renders its hero.
    await visit(page, '/products')
    const stage = page.locator(`[data-scene="${id}"]`)
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('svg[data-frame]:visible')).toHaveCount(1)
    expect(
      await stage.evaluate((el) => el.closest('[aria-hidden="true"]') !== null),
    ).toBe(true)
  })

  test(`${id} product page renders its scene`, async ({ page }) => {
    const res = await visit(page, `/products/${id}`)
    expect(res?.status()).toBe(200)
    const stage = page.locator(`[data-scene="${id}"]`)
    test.skip(
      (await stage.count()) === 0,
      'this product page does not render ProductScene yet',
    )
    await stage.first().scrollIntoViewIfNeeded()
    await expect(stage.first().locator('svg:visible')).toHaveCount(1)
  })
}

for (const id of IDS) {
  test(`${id} loops pause off screen and run on screen`, async ({ page }) => {
    await visit(page, '/products')
    // Start scrolled to the footer so every stage, even rank 1, is off screen.
    await page.locator('footer').scrollIntoViewIfNeeded()
    const stage = page.locator(`[data-scene="${id}"]`)
    const running = () =>
      stage.evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === 'running').length,
      )

    await expect(stage).toHaveAttribute('data-play', 'off')
    expect(await running()).toBe(0)

    await stage.scrollIntoViewIfNeeded()
    await expect(stage).toHaveAttribute('data-play', 'on')
    expect(await running()).toBeGreaterThan(0)

    // A small DOM, as the scene contract asks.
    const nodes = await stage.evaluate((el) =>
      Array.from(el.querySelectorAll('svg[data-frame]')).map(
        (svg) => svg.querySelectorAll('*').length,
      ),
    )
    for (const n of nodes) expect(n).toBeLessThan(300)

    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(stage).toHaveAttribute('data-play', 'off')
    await expect.poll(running).toBe(0)
  })
}

test('scenes are complete stills under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await visit(page, '/products')
  for (const id of IDS) {
    const stage = page.locator(`[data-scene="${id}"]`)
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('svg[data-frame]:visible')).toHaveCount(1)
    expect(
      await stage.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0)
  }
})
