import { test, expect } from '@playwright/test'
import { engineers } from '../lib/engineers'
import {
  productLicense,
  productsByRank,
  RANKING_WEIGHTS,
} from '../lib/products'
import { countWord } from '../lib/home-data'

const ranked = productsByRank()

test('hero calls to action reach products and engineers', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('section[aria-labelledby="hero-title"]')
  await expect(
    hero.getByRole('heading', { level: 1, name: /We build the things/ }),
  ).toBeVisible()

  await hero.getByRole('link', { name: 'View products' }).click()
  await expect(page).toHaveURL(/\/products$/)

  await page.goto('/')
  await hero.getByRole('link', { name: 'Meet the engineers' }).click()
  await expect(page).toHaveURL(/\/engineers$/)
})

test('the hero preview links the selected product to its page', async ({
  page,
}) => {
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Products' })
  await tabs.getByRole('tab', { name: 'EternalRichPresence' }).click()
  const panel = page.getByRole('tabpanel', { name: 'EternalRichPresence' })
  await panel.getByRole('link', { name: 'Open EternalRichPresence' }).click()
  await expect(page).toHaveURL(/\/products\/eternal-rich-presence$/)
})

test('the products section links every product in ranked order', async ({
  page,
}) => {
  await page.goto('/')
  const section = page.locator('#products')
  const hrefs = await section
    .locator('ol > li a[href^="/products/"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute('href')!)
        .filter((h, i, all) => all.indexOf(h) === i),
    )
  expect(hrefs).toEqual(ranked.map((p) => `/products/${p.id}`))
  await expect(
    section.getByRole('link', { name: /full ranking/ }),
  ).toHaveAttribute('href', '/products#ranking')
})

test('the products section describes the GitHub ranking with its weights', async ({
  page,
}) => {
  await page.goto('/')
  const section = page.locator('#products')
  await expect(section.locator('h2')).toContainText('ranked on GitHub')
  await expect(section).toContainText(
    `${Math.round(RANKING_WEIGHTS.popularity * 100)}% popularity`,
  )
  await expect(section).toContainText(
    `${Math.round(RANKING_WEIGHTS.scope * 100)}% scope`,
  )
  await expect(page.locator('main')).not.toContainText(
    /by use|most used|order of use/i,
  )
})

for (const product of ranked) {
  test(`home link to ${product.id} opens its page`, async ({ page }) => {
    await page.goto('/')
    const link = page
      .locator(`#products a[href="/products/${product.id}"]`)
      .first()
    await link.click()
    await expect(page).toHaveURL(new RegExp(`/products/${product.id}$`))
    await expect(
      page.getByRole('heading', { level: 1, name: product.name }),
    ).toBeVisible()
  })
}

for (const engineer of engineers) {
  test(`team card links to /engineers/${engineer.id}`, async ({ page }) => {
    await page.goto('/')
    await page
      .locator('#team')
      .getByRole('link', { name: engineer.name, exact: true })
      .click()
    await expect(page).toHaveURL(new RegExp(`/engineers/${engineer.id}$`))
  })
}

test('the team section counts and titles every engineer from the data', async ({
  page,
}) => {
  await page.goto('/')
  const team = page.locator('#team')
  await expect(team.locator('h2')).toContainText(
    `Built by ${countWord(engineers.length)} founding engineers`,
  )
  await expect(team.locator('article')).toHaveCount(engineers.length)
  for (const engineer of engineers) {
    const row = team.locator('article', {
      has: page.getByRole('link', { name: engineer.name, exact: true }),
    })
    await expect(row).toContainText(engineer.role)
  }
  await expect(page.locator('main')).not.toContainText(
    /\b(?:co-?founders?|founders|friends)\b/i,
  )
})

test('team product chips link to each product the engineer works on', async ({
  page,
}) => {
  await page.goto('/')
  for (const engineer of engineers) {
    const list = page.getByRole('list', {
      name: `Products ${engineer.name} works on`,
    })
    const own = ranked.filter((p) => p.engineers.includes(engineer.id))
    if (own.length === 0) {
      await expect(list).toHaveCount(0)
      continue
    }
    await expect(list.getByRole('link')).toHaveCount(own.length)
    for (const p of own) {
      await expect(list.getByRole('link', { name: p.name })).toHaveAttribute(
        'href',
        `/products/${p.id}`,
      )
    }
  }
})

test('open source lists exactly the OSI-licensed product repos', async ({
  page,
}) => {
  await page.goto('/')
  const open = ranked.filter((p) => productLicense(p).openSource)
  const list = page.getByRole('list', { name: 'Open-source repositories' })
  const hrefs = await list
    .getByRole('link')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')))
  expect(hrefs).toEqual(open.map((p) => p.links.repo))
  expect(open.some((p) => p.id === 'hushtype')).toBe(false)
  await expect(page.locator('#open-source h2')).toContainText(
    `${countWord(open.length, true)} of our products`,
  )
})

test('every internal link on the home page resolves', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const hrefs = await page
    .locator('main a[href^="/"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute('href')!)
        .filter((h, i, all) => all.indexOf(h) === i),
    )
  expect(hrefs.length).toBeGreaterThan(ranked.length)
  for (const href of hrefs) {
    const res = await request.get(href)
    expect(res.status(), href).toBe(200)
  }
})

test('the closing call to action goes to contact', async ({ page }) => {
  await page.goto('/')
  const cta = page.locator('section[aria-labelledby="cta-title"]')
  await expect(
    cta.getByRole('link', { name: 'hello@sideband.studio' }),
  ).toHaveAttribute('href', 'mailto:hello@sideband.studio')
  await cta.getByRole('link', { name: 'Contact us' }).click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('under reduced motion every section is visible and complete', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  // Nothing waits on an entrance: every revealed element is fully opaque.
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('main [data-rise], main [style]'))
      .filter((el) => getComputedStyle(el).opacity !== '1')
      .filter((el) => !el.closest('[role="tabpanel"][aria-hidden="true"]'))
      .map((el) => el.outerHTML.slice(0, 80)),
  )
  expect(hidden).toEqual([])

  // Stats show their final figures, with no count-up.
  const shown = await page
    .locator('dd span[aria-hidden]')
    .evaluateAll((els) => els.map((e) => e.textContent))
  const finals = await page
    .locator('dd .sr-only')
    .evaluateAll((els) => els.map((e) => e.textContent))
  expect(shown).toEqual(finals)

  // The preview does not page on its own.
  const tabs = page.getByRole('tablist', { name: 'Products' })
  await page.waitForTimeout(6500)
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText(
    ranked.find((p) => p.icon)!.name,
  )
  expect(errors).toEqual([])
})
