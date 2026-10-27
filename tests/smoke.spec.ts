import { test, expect } from '@playwright/test'
import { engineers } from '../lib/engineers'
import {
  productLicense,
  productRepo,
  products,
  productsByRank,
} from '../lib/products'
import { focusOnScreen, visit } from './helpers'

test('homepage renders and primary navigation reaches products', async ({
  page,
}) => {
  await visit(page, '/')

  await expect(
    page.getByRole('heading', { name: /We build the things/i }),
  ).toBeVisible()

  await page.getByRole('link', { name: /View Products/i }).click()
  await expect(page).toHaveURL(/\/products$/)
})

test('homepage preview tabs switch the visible product screenshot', async ({
  page,
}) => {
  await visit(page, '/')

  const tabs = page.getByRole('tablist', { name: 'Products' })
  await expect(tabs.getByRole('tab')).toHaveCount(6)
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText(
    'EternalMonitor',
  )

  await tabs.getByRole('tab', { name: 'Upflow2x' }).click()
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText('Upflow2x')
  await expect(
    page.getByRole('tabpanel', { name: 'Upflow2x' }).getByRole('img'),
  ).toBeVisible()
})

test('product detail navigation works', async ({ page }) => {
  await visit(page, '/products')

  await expect(
    page.getByRole('heading', { name: 'EternalRichPresence' }),
  ).toBeVisible()

  await visit(page, '/products/exerly')
  await expect(
    page.getByRole('heading', { name: 'Exerly Fitness' }).first(),
  ).toBeVisible()
})

for (const product of products) {
  test(`product page ${product.id} returns 200 and shows its name`, async ({
    page,
  }) => {
    const res = await visit(page, `/products/${product.id}`)
    expect(res?.status()).toBe(200)
    await expect(
      page.getByRole('heading', { level: 1, name: product.name }),
    ).toBeVisible()
  })
}

test('home Open source section lists only OSI-licensed product repos', async ({
  page,
}) => {
  expect(
    productLicense(products.find((p) => p.id === 'hushtype')!),
  ).toMatchObject({ openSource: false })
  await visit(page, '/')
  const section = page.locator('#open-source')
  for (const product of products) {
    // The row names, links and counts the repo the product's numbers come from.
    const repo = productRepo(product)
    const path = product.upstreamRepo ?? product.repo
    const row = section.getByRole('link', { name: path })
    // A private repo is never listed, whatever its license.
    const listed = productLicense(product).openSource && !product.repoPrivate
    await expect(row).toHaveCount(listed ? 1 : 0)
    if (!listed) continue
    await expect(row).toHaveAttribute('href', repo.url!)
    await expect(row).toContainText(
      `${repo.commits.toLocaleString('en-US')} commits`,
    )
  }
})

test('engineers index lists all founders and links to a dossier', async ({
  page,
}) => {
  await visit(page, '/engineers')

  // Scoped to the page body: the footer links every engineer too.
  const main = page.getByRole('main')
  for (const { name } of engineers)
    await expect(main.getByRole('link', { name }).first()).toBeVisible()

  await main.getByRole('link', { name: /Ali Younes/i }).click()
  await expect(page).toHaveURL(/\/engineers\/ali-younes$/)
})

test('engineer dossier renders exactly one h1 and the portrait', async ({
  page,
}) => {
  await visit(page, '/engineers/ali-younes')

  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ali')

  const portrait = page.getByRole('img', { name: /Ali Younes, portrait/i })
  await expect(portrait).toBeVisible()
})

test('every Sideband role shows the studio mark, not a monogram', async ({
  page,
}) => {
  for (const { id } of engineers) {
    await visit(page, `/engineers/${id}`)
    await expect(page.getByRole('img', { name: 'Sideband logo' })).toBeVisible()
  }
})

for (const { id, name } of engineers) {
  test(`engineer dossier /engineers/${id} returns 200 and names ${name}`, async ({
    page,
  }) => {
    const res = await visit(page, `/engineers/${id}`)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      name.split(' ')[0],
    )
    await expect(page.getByText(name).first()).toBeVisible()
  })
}

test('unknown engineer id returns a not-found page', async ({ page }) => {
  const res = await visit(page, '/engineers/nobody')
  expect(res?.status()).toBe(404)
})

test('contact form success state is shown on successful submit', async ({
  page,
}) => {
  await page.route('https://formspree.io/f/xkoperoj', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    })
  })

  await visit(page, '/contact')

  await page.getByRole('textbox', { name: 'Name' }).fill('Ali')
  await page.getByRole('textbox', { name: 'Email' }).fill('ali@example.com')
  await page
    .getByRole('textbox', { name: 'Message' })
    .fill('Looking to talk through a product collaboration.')
  await page.getByRole('button', { name: /Send Message/i }).click()

  await expect(page.getByText(/MESSAGE SENT/i)).toBeVisible()
})

test('contact form error state is shown on failed submit', async ({ page }) => {
  await page.route('https://formspree.io/f/xkoperoj', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false }),
    })
  })

  await visit(page, '/contact')

  await page.getByRole('textbox', { name: 'Name' }).fill('Ali')
  await page.getByRole('textbox', { name: 'Email' }).fill('ali@example.com')
  await page
    .getByRole('textbox', { name: 'Message' })
    .fill('This should trigger the error state.')
  await page.getByRole('button', { name: /Send Message/i }).click()

  await expect(
    page.getByText(/Something went wrong. Please try again./i),
  ).toBeVisible()
})

test('mobile menu works from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page, '/')

  const menu = page.locator('#mobile-menu')
  await expect(menu).toBeHidden()

  await page.getByRole('button', { name: 'Open menu' }).focus()
  await page.keyboard.press('Enter')
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: 'Products' })).toBeFocused()
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow,
    ),
  ).toBe('hidden')
  // The page behind the menu is out of reach for screen readers too.
  const inert = () =>
    page.evaluate(() =>
      ['main', 'footer', 'a[href="#main"]'].map(
        (sel) => (document.querySelector(sel) as HTMLElement).inert,
      ),
    )
  expect(await inert()).toEqual([true, true, true])

  // Tab and Shift+Tab stay inside the bar and the open menu.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('header')),
    ).toBe(true)
  }
  await page.keyboard.press('Shift+Tab')
  expect(
    await page.evaluate(() => !!document.activeElement?.closest('header')),
  ).toBe(true)

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  expect(await inert()).toEqual([false, false, false])
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow,
    ),
  ).not.toBe('hidden')

  await page.getByRole('button', { name: 'Open menu' }).click()
  await menu.getByRole('link', { name: 'Engineers' }).click()
  await expect(page).toHaveURL(/\/engineers$/)
  await expect(menu).toBeHidden()
})

test('skip link moves focus to the main content', async ({ page }) => {
  await visit(page, '/about')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('footer links every product, in rank order, and every engineer', async ({
  page,
}) => {
  await visit(page, '/about')
  const footer = page.getByRole('contentinfo')
  await expect(
    footer.getByRole('navigation', { name: 'Products' }).getByRole('link'),
  ).toHaveText(productsByRank().map((p) => p.name))
  await expect(
    footer.getByRole('navigation', { name: 'Engineers' }).getByRole('link'),
  ).toHaveCount(engineers.length)
  // Activate by keyboard once the link is on screen: a pointer click can land
  // while smooth scrolling is still moving the footer and miss the link.
  await focusOnScreen(footer.getByRole('link', { name: products[0].name }))
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`/products/${products[0].id}$`))
})

test('choosing the current page in the mobile menu returns focus to the toggle', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page, '/products')

  await page.getByRole('button', { name: 'Open menu' }).click()
  await page
    .locator('#mobile-menu')
    .getByRole('link', { name: 'Products' })
    .click()

  await expect(page.locator('#mobile-menu')).toBeHidden()
  await expect(page).toHaveURL(/\/products$/)
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('the home link closes the mobile menu on the home page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page, '/')

  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.locator('#mobile-menu')).toBeVisible()
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Sideband home' })
    .click()

  await expect(page.locator('#mobile-menu')).toBeHidden()
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow,
    ),
  ).not.toBe('hidden')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('stats skip the count-up when reduced motion is turned on after load', async ({
  page,
}) => {
  await visit(page, '/')
  // Hydrated with motion allowed: the count-up is armed at zero.
  await expect(page.locator('dd span[aria-hidden]').first()).toHaveText('0')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const finals = await page
    .locator('dd .sr-only')
    .evaluateAll((els) => els.map((e) => e.textContent ?? ''))
  // Turning it on settles every armed figure on its final value.
  await expect
    .poll(() =>
      page
        .locator('dd span[aria-hidden]')
        .evaluateAll((els) => els.map((e) => e.textContent ?? '')),
    )
    .toEqual(finals)
  await page.evaluate(() => {
    const w = window as unknown as { seen: string[] }
    w.seen = []
    document.querySelectorAll('dd span[aria-hidden]').forEach((s) => {
      w.seen.push(s.textContent ?? '')
      new MutationObserver(() => w.seen.push(s.textContent ?? '')).observe(s, {
        childList: true,
        characterData: true,
        subtree: true,
      })
    })
  })

  await page.locator('dl').scrollIntoViewIfNeeded()
  // Longer than a full count-up (1200ms), so one that started would be seen.
  await page.waitForTimeout(1500)

  const seen = await page.evaluate(
    () => (window as unknown as { seen: string[] }).seen,
  )
  expect(finals.length).toBeGreaterThan(0)
  expect(seen.every((v) => finals.includes(v))).toBe(true)
})

test('the footer credits open by keyboard and list each credit with its license', async ({
  page,
}) => {
  const credit = products.find((p) => p.id === 'upflow2x')!.video.card.credit!
  await visit(page, '/about')
  const credits = page.locator('footer details#credits')
  const summary = credits.locator('summary')
  await expect(credits.getByText(credit.text)).toBeHidden()
  await focusOnScreen(summary)
  await page.keyboard.press('Enter')
  await expect
    .poll(() => credits.evaluate((d: HTMLDetailsElement) => d.open))
    .toBe(true)
  await expect(
    credits.getByRole('link', { name: credit.text }),
  ).toHaveAttribute('href', credit.href!)
  await expect(
    credits.getByRole('link', { name: credit.license! }),
  ).toHaveAttribute('href', credit.licenseHref!)
  await expect(credits).toContainText('Upflow2x: ')
  await expect(credits).toContainText('both product videos')
  await page.keyboard.press('Space')
  await expect
    .poll(() => credits.evaluate((d: HTMLDetailsElement) => d.open))
    .toBe(false)
})
