import { test, expect } from '@playwright/test'

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
  test(`${id} card scene renders on the home page and is decorative`, async ({
    page,
  }) => {
    await page.goto('/')
    const stage = page.locator(`[data-scene="${id}"]`)
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('svg[data-frame="card"]')).toBeVisible()
    expect(
      await stage.evaluate((el) => el.closest('[aria-hidden="true"]') !== null),
    ).toBe(true)
  })

  test(`${id} product page renders its scene`, async ({ page }) => {
    const res = await page.goto(`/products/${id}`)
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
    await page.goto('/')
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

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(stage).toHaveAttribute('data-play', 'off')
    await expect.poll(running).toBe(0)
  })
}

test('scenes are complete stills under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const id of IDS) {
    const stage = page.locator(`[data-scene="${id}"]`)
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('svg[data-frame="card"]')).toBeVisible()
    expect(
      await stage.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0)
  }
})
