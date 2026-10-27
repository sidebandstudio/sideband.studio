import { test, expect } from '@playwright/test'
import { engineers } from '../lib/engineers'

test('/engineers/david-czartoryski returns 200 and names David Czartoryski', async ({
  page,
}) => {
  const res = await page.goto('/engineers/david-czartoryski')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('David')
  await expect(page.getByText('David Czartoryski').first()).toBeVisible()
  await expect(page.getByRole('img', { name: 'Sideband logo' })).toBeVisible()
})

test('/engineers lists all five founding engineers', async ({ page }) => {
  expect(engineers).toHaveLength(5)
  await page.goto('/engineers')

  // Scoped to the page body: the footer links every engineer too.
  const main = page.getByRole('main')
  const hrefs = await main
    .locator('a[href^="/engineers/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')))
  expect(Array.from(new Set(hrefs)).sort()).toEqual(
    engineers.map((e) => `/engineers/${e.id}`).sort(),
  )
  for (const e of engineers) {
    await expect(
      main.getByRole('link', { name: new RegExp(e.name, 'i') }).first(),
    ).toBeVisible()
  }
})
