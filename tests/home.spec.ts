import { test, expect, type Page } from '@playwright/test'
import { engineers } from '../lib/engineers'
import {
  productLicense,
  productRepo,
  productsByRank,
  RANKING_WEIGHTS,
} from '../lib/products'
import { countWord } from '../lib/home-data'
import { visit } from './helpers'

const ranked = productsByRank()

test('hero calls to action reach products and engineers', async ({ page }) => {
  await visit(page, '/')
  const hero = page.locator('section[aria-labelledby="hero-title"]')
  await expect(
    hero.getByRole('heading', { level: 1, name: /We build the things/ }),
  ).toBeVisible()

  await hero.getByRole('link', { name: 'View products' }).click()
  await expect(page).toHaveURL(/\/products$/)

  await visit(page, '/')
  await hero.getByRole('link', { name: 'Meet the engineers' }).click()
  await expect(page).toHaveURL(/\/engineers$/)
})

test('the hero preview links the selected product to its page', async ({
  page,
}) => {
  await visit(page, '/')
  const tabs = page.getByRole('tablist', { name: 'Products' })
  await tabs.getByRole('tab', { name: 'EternalRichPresence' }).click()
  const panel = page.getByRole('tabpanel', { name: 'EternalRichPresence' })
  await panel.getByRole('link', { name: 'Open EternalRichPresence' }).click()
  await expect(page).toHaveURL(/\/products\/eternal-rich-presence$/)
})

test('the products section links every product in ranked order', async ({
  page,
}) => {
  await visit(page, '/')
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
    section.getByRole('link', { name: 'How the ranking works' }),
  ).toHaveAttribute('href', '/products#ranking')
  await expect(
    section.getByRole('link', { name: `All ${ranked.length} products` }),
  ).toHaveAttribute('href', '/products')
})

test('the products section features three scenes and one strip for the rest', async ({
  page,
}) => {
  await visit(page, '/')
  const section = page.locator('#products')
  await expect(section.locator('[data-scene]')).toHaveCount(3)
  const strip = section.getByRole('list', {
    name: `Products ranked 4 to ${ranked.length}`,
  })
  await expect(strip.getByRole('link')).toHaveText(
    ranked.slice(3).map((p) => p.name),
  )
  // One or two lines of chips on a desktop.
  const tops = await strip
    .getByRole('link')
    .evaluateAll((links) =>
      links.map((a) => Math.round(a.getBoundingClientRect().top)),
    )
  expect(new Set(tops).size).toBeLessThanOrEqual(2)
})

test('the products section describes the GitHub ranking with its weights', async ({
  page,
}) => {
  await visit(page, '/')
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
    await visit(page, '/')
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
    await visit(page, '/')
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
  await visit(page, '/')
  const team = page.locator('#team')
  await expect(team.locator('h2')).toHaveText(
    new RegExp(
      `^Built by ${countWord(engineers.length)}\\s*founding engineers\\.$`,
    ),
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
  await visit(page, '/')
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
  await visit(page, '/')
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
  await visit(page, '/')
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
  await visit(page, '/')
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
  await visit(page, '/')

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

  // The preview does not page on its own and offers no Pause button.
  await expect(
    page.getByRole('button', { name: /the product preview/ }),
  ).toBeHidden()
  const tabs = page.getByRole('tablist', { name: 'Products' })
  await page.waitForTimeout(6500)
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText(
    ranked.find((p) => p.icon)!.name,
  )
  expect(errors).toEqual([])
})

/** Lines the hero headline sets in, from its height and line height. */
async function headlineLines(page: Page) {
  return page.locator('#hero-title').evaluate((h1) => {
    const lineHeight = parseFloat(getComputedStyle(h1).lineHeight)
    return Math.round(h1.getBoundingClientRect().height / lineHeight)
  })
}

for (const width of [320, 360, 390, 480, 640, 768, 1024, 1440, 1920]) {
  test(`the hero headline sets in two lines at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await visit(page, '/')
    await page.evaluate(() => document.fonts.ready)
    expect(await headlineLines(page)).toBeLessThanOrEqual(2)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
}

test('both hero actions share one row at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await visit(page, '/')
  const hero = page.locator('section[aria-labelledby="hero-title"]')
  const tops = await Promise.all(
    ['View products', 'Meet the engineers'].map(async (name) =>
      Math.round(
        (await hero.getByRole('link', { name }).boundingBox())?.y ?? -1,
      ),
    ),
  )
  expect(tops[0]).toBe(tops[1])
})

for (const [width, height] of [
  [360, 640],
  [390, 844],
]) {
  test(`the first screen at ${width}px shows a product screenshot`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await visit(page, '/')
    const shot = page.locator(
      'section[aria-labelledby="hero-title"] [role="tabpanel"]:not([aria-hidden="true"]) img',
    )
    await expect(shot).toBeVisible()
    await expect
      .poll(() => shot.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0)
    const box = (await shot.boundingBox())!
    expect(box.y).toBeGreaterThan(0)
    expect(box.y + box.height).toBeLessThanOrEqual(height)

    // The tabs are one row that scrolls, and the keyboard brings the last
    // one into view.
    const tabs = page.getByRole('tablist', { name: 'Products' })
    expect((await tabs.boundingBox())!.height).toBeLessThan(60)
    await tabs.getByRole('tab', { selected: true }).focus()
    await page.keyboard.press('End')
    const last = tabs.getByRole('tab').last()
    await expect(last).toHaveAttribute('aria-selected', 'true')
    await expect
      .poll(async () => {
        const b = (await last.boundingBox())!
        const r = (await tabs.boundingBox())!
        return b.x >= r.x - 1 && b.x + b.width <= r.x + r.width + 1
      })
      .toBe(true)
  })
}

test('the pause button stops and restarts the preview', async ({ page }) => {
  test.setTimeout(60000)
  await visit(page, '/')
  const tabs = page.getByRole('tablist', { name: 'Products' })
  const selected = () => tabs.getByRole('tab', { selected: true }).textContent()
  // Bring the whole window on screen, below the navbar.
  await tabs.evaluate((el) =>
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 96),
  )
  await page.mouse.move(0, 0)

  // It pages on its own while on screen.
  const first = await selected()
  await expect.poll(selected, { timeout: 9000 }).not.toBe(first)

  const pause = page.getByRole('button', { name: 'Pause the product preview' })
  await expect(pause).toBeVisible()
  await expect(pause).toHaveText('Pause')
  await pause.click()
  const play = page.getByRole('button', { name: 'Play the product preview' })
  await expect(play).toHaveText('Play')
  const held = await selected()
  await page.waitForTimeout(7000)
  expect(await selected()).toBe(held)

  // Play from the keyboard starts it again.
  await play.focus()
  await page.keyboard.press('Enter')
  await expect(pause).toBeVisible()
  await expect.poll(selected, { timeout: 9000 }).not.toBe(held)
})

test('the preview does not page while it is off screen', async ({ page }) => {
  test.setTimeout(30000)
  await visit(page, '/')
  const tabs = page.getByRole('tablist', { name: 'Products' })
  await page.locator('#open-source').scrollIntoViewIfNeeded()
  await page.waitForTimeout(7000)
  await expect(tabs.getByRole('tab').first()).toHaveAttribute(
    'aria-selected',
    'true',
  )
})

/** A row of a product page's Repository panel, whitespace collapsed. */
async function repositoryRow(page: Page, label: string) {
  const text = await page
    .locator('dl > div')
    .filter({ has: page.locator('dt', { hasText: label }) })
    .locator('dd')
    .first()
    .textContent()
  return text!.replace(/\s+/g, ' ').trim()
}

test('release and last-push dates read the same on the home page and the product page', async ({
  page,
}) => {
  const open = ranked.filter((p) => productLicense(p).openSource)
  const latest = ranked
    .filter((p) => productRepo(p).latestRelease)
    .sort((a, b) =>
      productRepo(b).latestRelease!.date.localeCompare(
        productRepo(a).latestRelease!.date,
      ),
    )[0]
  const checked = ranked.filter(
    (p) =>
      open.includes(p) ||
      p === latest ||
      (ranked.indexOf(p) < 3 && productRepo(p).latestRelease),
  )
  expect(checked.length).toBeGreaterThan(0)

  const shown = new Map<string, { release: string | null; push: string }>()
  for (const p of checked) {
    await visit(page, `/products/${p.id}`)
    const release = productRepo(p).latestRelease
      ? (await repositoryRow(page, 'Latest release')).replace(/^.*?, /, '')
      : null
    shown.set(p.id, { release, push: await repositoryRow(page, 'Last push') })
  }

  await visit(page, '/')
  const main = page.getByRole('main')
  for (const p of checked) {
    const { release, push } = shown.get(p.id)!
    const tag = productRepo(p).latestRelease?.tag
    if (ranked.indexOf(p) < 3 && release)
      await expect(
        page
          .locator('#products article')
          .filter({ has: page.locator(`a[href="/products/${p.id}"]`) }),
      ).toContainText(`${tag} released ${release}`)
    if (p === latest)
      await expect(main).toContainText(
        `Latest release, ${p.name} on ${release}`,
      )
    if (open.includes(p)) {
      const row = page
        .getByRole('list', { name: 'Open-source repositories' })
        .locator(`a[href="${p.links.repo}"]`)
      await expect(row).toContainText(`Last push ${push}`)
      // The same commit count the product page and the ranking read.
      await expect(row).toContainText(
        `${productRepo(p).commits.toLocaleString('en-US')} commits`,
      )
    }
  }
})
