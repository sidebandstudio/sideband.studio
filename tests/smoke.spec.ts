import { test, expect } from '@playwright/test'

test('homepage renders and primary navigation reaches products', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: /Technically ambitious products, shipped with taste/i,
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: /View Selected Work/i }).click()
  await expect(page).toHaveURL(/\/products$/)
})

test('products filter and product detail navigation work', async ({ page }) => {
  await page.goto('/products')

  await page.getByRole('button', { name: 'LIVE' }).click()
  await expect(
    page.getByRole('heading', { name: 'EternalRichPresence' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'EternalMonitor' }),
  ).toHaveCount(0)

  await page.getByRole('button', { name: 'ALL' }).click()
  await page.getByRole('link', { name: 'Exerly Fitness', exact: true }).click()

  await expect(page).toHaveURL(/\/products\/exerly$/)
  await expect(
    page.getByRole('heading', { name: 'Exerly Fitness' }),
  ).toBeVisible()
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

  await page.getByLabel('Name').fill('Ali')
  await page.getByLabel('Email').fill('ali@example.com')
  await page
    .getByLabel('Message')
    .fill('Looking to talk through a product collaboration.')
  await page.getByRole('button', { name: /Send Message/i }).click()

  await expect(page.getByText(/Message sent/i)).toBeVisible()
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

  await page.getByLabel('Name').fill('Ali')
  await page.getByLabel('Email').fill('ali@example.com')
  await page
    .getByLabel('Message')
    .fill('This should trigger the error state.')
  await page.getByRole('button', { name: /Send Message/i }).click()

  await expect(
    page.getByText(/Something went wrong. Try again or email directly./i),
  ).toBeVisible()
})
