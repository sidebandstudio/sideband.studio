import { test, expect } from '@playwright/test'
import { engineers } from '../lib/engineers'

const index = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Sections of this dossier' })

test('the section index jumps to a section by keyboard on desktop', async ({
  page,
}) => {
  await page.goto('/engineers/ali-younes', { waitUntil: 'networkidle' })
  const link = index(page).getByRole('link', { name: 'Experience' })
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#experience$/)

  const heading = page.locator('#experience-title')
  await expect(heading).toBeInViewport()
  // The heading lands below the held index bar, not under it.
  await expect
    .poll(async () => {
      const bar = await index(page).boundingBox()
      const top = await heading.boundingBox()
      return top!.y - (bar!.y + bar!.height)
    })
    .toBeGreaterThanOrEqual(0)
  await expect(link).toHaveAttribute('aria-current', 'location')
})

test('on a phone the jump control opens and moves to a section by keyboard', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/engineers/david-czartoryski', {
    waitUntil: 'networkidle',
  })
  const summary = index(page).locator('summary')
  await expect(summary).toBeVisible()
  await summary.focus()
  await page.keyboard.press('Enter')
  const projects = index(page).getByRole('link', { name: 'Projects' })
  await expect(projects).toBeVisible()
  await projects.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('#projects-title')).toBeInViewport()
  await expect(projects).toBeHidden()
})

test('long sections collapse on a phone and expand by keyboard, with everything in the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/engineers/ali-younes')
  const list = page.locator('#experience-list')
  const groups = list.locator(':scope > li')
  const total = await groups.count()
  expect(total).toBeGreaterThan(2)

  // Every organisation is in the page. Two are shown.
  const shown = () =>
    list.evaluate(
      (el) =>
        Array.from(el.children).filter(
          (c) => (c as HTMLElement).offsetParent !== null,
        ).length,
    )
  await expect.poll(shown).toBe(2)

  // Found by what it controls: its label changes once it is open.
  const button = page.locator('button[aria-controls~="experience-list"]')
  await expect(button).toHaveText(/Show the full history, all \d+ roles/)
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  await expect.poll(shown).toBe(total)
  await expect(
    page.getByText('Jan 2026 – Jun 2026 · 6 mos · Co-op'),
  ).toBeVisible()

  // Projects: one shown, the rest one keypress away.
  const more = page.locator('button[aria-controls~="projects-other-group"]')
  await expect(more).toHaveText(/Show all \d+ projects/)
  await more.focus()
  await page.keyboard.press('Space')
  await expect(more).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#projects-other-list > li').first()).toBeVisible()
})

test('desktop shows every section in full, with no disclosure buttons', async ({
  page,
}) => {
  await page.goto('/engineers/ali-younes')
  await expect(page.getByRole('button', { name: /^Show / })).toHaveCount(0)
  const list = page.locator('#experience-list > li')
  const n = await list.count()
  for (let i = 0; i < n; i++) await expect(list.nth(i)).toBeVisible()
})

for (const e of engineers) {
  test(`dossier ${e.id} is about twelve phone screens or less with sections collapsed`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/engineers/${e.id}`)
    await page.waitForLoadState('networkidle')
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    )
    expect(height / 844).toBeLessThanOrEqual(12.7)
  })
}

test('each fact appears once on a dossier', async ({ page }) => {
  await page.goto('/engineers/david-czartoryski')
  const main = page.getByRole('main')
  const text = await main.innerText()
  expect(text.match(/English, Polish and Russian/g)?.length).toBe(1)
  await expect(main.getByRole('heading', { name: 'Now' })).toHaveCount(0)
  // The pull quote is not repeated in the list of quotes.
  expect(
    text.match(/The work that actually pulls me in is making things faster/g)
      ?.length,
  ).toBe(1)
  // His ventures' figures are told on their cards, not again in his work history.
  expect(text.match(/22,000\+ riders/g)?.length).toBe(1)
  await expect(main).toContainText('8 projects. 1 is featured on David')

  await page.goto('/engineers/ali-tleis')
  await expect(page.getByRole('main')).not.toContainText('Security Clearance')
})
