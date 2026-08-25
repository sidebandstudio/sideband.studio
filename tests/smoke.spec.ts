import { test, expect } from '@playwright/test'

test('homepage renders and primary navigation reaches products', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /Software that/i }),
  ).toBeVisible()

  await page.getByRole('link', { name: /View Products/i }).click()
  await expect(page).toHaveURL(/\/products$/)
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

  await expect(page.getByRole('link', { name: /Ali Younes/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Ali Tleis/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Karan Anand/i })).toBeVisible()

  await page.getByRole('link', { name: /Ali Younes/i }).click()
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

test('unknown engineer id returns a not-found page', async ({ page }) => {
  const res = await page.goto('/engineers/nobody')
  expect(res?.status()).toBe(404)
})

test('inquire form transmits and shows the success panel', async ({ page }) => {
  await page.route('https://formspree.io/f/xkoperoj', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto('/inquire')

  await page.getByLabel('Name *').fill('Ali')
  await page.getByLabel('Email *').fill('ali@example.com')
  await page.getByLabel('Project Brief *').fill('A low-latency streaming tool.')
  await page.getByRole('button', { name: /Transmit Brief/i }).click()

  await expect(page.getByText(/TRANSMITTED/i).first()).toBeVisible()
})

test('inquire form surfaces an announced error on failure', async ({
  page,
}) => {
  await page.route('https://formspree.io/f/xkoperoj', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false }),
    })
  })

  await page.goto('/inquire')

  await page.getByLabel('Name *').fill('Ali')
  await page.getByLabel('Email *').fill('ali@example.com')
  await page.getByLabel('Project Brief *').fill('This should fail.')
  await page.getByRole('button', { name: /Transmit Brief/i }).click()

  await expect(page.locator('form p[role="alert"]')).toContainText(
    /Transmission failed/i,
  )
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
