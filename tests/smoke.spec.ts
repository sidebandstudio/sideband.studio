import { test, expect } from '@playwright/test'
import { engineers } from '../lib/engineers'
import { products } from '../lib/products'

test('homepage renders and primary navigation reaches products', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /We build the things/i }),
  ).toBeVisible()

  await page.getByRole('link', { name: /View Products/i }).click()
  await expect(page).toHaveURL(/\/products$/)
})

test('homepage preview tabs switch the visible product screenshot', async ({
  page,
}) => {
  await page.goto('/')

  const tabs = page.getByRole('tablist', { name: 'Products' })
  await expect(tabs.getByRole('tab')).toHaveCount(6)
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText(
    'EternalMonitor',
  )

  await tabs.getByRole('tab', { name: 'Eternal2x' }).click()
  await expect(tabs.getByRole('tab', { selected: true })).toHaveText(
    'Eternal2x',
  )
  await expect(
    page.getByRole('tabpanel', { name: 'Eternal2x' }).getByRole('img'),
  ).toBeVisible()
})

test('product detail navigation works', async ({ page }) => {
  await page.goto('/products')

  await expect(
    page.getByRole('heading', { name: 'EternalRichPresence' }),
  ).toBeVisible()

  await page.goto('/products/exerly')
  await expect(
    page.getByRole('heading', { name: 'Exerly Fitness' }).first(),
  ).toBeVisible()
})

test('engineers index lists all founders and links to a dossier', async ({
  page,
}) => {
  await page.goto('/engineers')

  // Scoped to the page body: the footer links every engineer too.
  const main = page.getByRole('main')
  await expect(main.getByRole('link', { name: /Ali Younes/i })).toBeVisible()
  await expect(main.getByRole('link', { name: /Ali Tleis/i })).toBeVisible()
  await expect(main.getByRole('link', { name: /Karan Anand/i })).toBeVisible()
  await expect(main.getByRole('link', { name: /Naman Rusia/i })).toBeVisible()

  await main.getByRole('link', { name: /Ali Younes/i }).click()
  await expect(page).toHaveURL(/\/engineers\/ali-younes$/)
})

test('engineer dossier renders exactly one h1 and the portrait', async ({
  page,
}) => {
  await page.goto('/engineers/ali-younes')

  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ali')

  const portrait = page.getByRole('img', { name: /Ali Younes, portrait/i })
  await expect(portrait).toBeVisible()
})

test('every Sideband role shows the studio mark, not a monogram', async ({
  page,
}) => {
  for (const id of ['ali-younes', 'ali-tleis', 'karan-anand']) {
    await page.goto(`/engineers/${id}`)
    await expect(page.getByRole('img', { name: 'Sideband logo' })).toBeVisible()
  }
})

test('unknown engineer id returns a not-found page', async ({ page }) => {
  const res = await page.goto('/engineers/nobody')
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

  await page.goto('/contact')

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

  await page.goto('/contact')

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
  await page.goto('/')

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
  await page.goto('/about')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('footer links every product and engineer', async ({ page }) => {
  await page.goto('/about')
  const footer = page.getByRole('contentinfo')
  await expect(
    footer.getByRole('navigation', { name: 'Products' }).getByRole('link'),
  ).toHaveCount(products.length)
  await expect(
    footer.getByRole('navigation', { name: 'Engineers' }).getByRole('link'),
  ).toHaveCount(engineers.length)
  await footer.getByRole('link', { name: products[0].name }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${products[0].id}$`))
})

test('choosing the current page in the mobile menu returns focus to the toggle', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products')

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
  await page.goto('/')

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
