import { test, expect, type Page } from '@playwright/test'
import { engineers } from '../lib/engineers'
import { getGithubUser } from '../lib/github'
import { productRepo, products } from '../lib/products'

const FORMSPREE = 'https://formspree.io/f/xkoperoj'
const fmt = (n: number) => n.toLocaleString('en-US')

/** The figure shown for a stat label inside a <dl>. */
function stat(scope: ReturnType<Page['locator']>, label: string) {
  return scope
    .locator('dl > div')
    .filter({ has: scope.page().locator('dt', { hasText: label }) })
    .locator('dd')
    .first()
}

for (const engineer of engineers) {
  const user = getGithubUser(engineer.githubLogin)!

  test(`dossier ${engineer.id} returns 200 with the snapshot's GitHub numbers`, async ({
    page,
  }) => {
    const res = await page.goto(`/engineers/${engineer.id}`)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      engineer.name,
    )

    const gh = page.locator('section[aria-labelledby="github-title"]')
    await expect(stat(gh, 'Contributions, last year')).toHaveText(
      fmt(user.contributions.total),
    )
    await expect(stat(gh, 'Followers')).toHaveText(fmt(user.followers))
    await expect(stat(gh, 'Following')).toHaveText(fmt(user.following))
    await expect(stat(gh, 'Public repos')).toHaveText(fmt(user.publicRepos))
    await expect(stat(gh, 'Stars on own repos')).toHaveText(fmt(user.stars))
    for (const repo of user.pinned)
      await expect(
        gh.getByRole('link', { name: new RegExp(repo.nameWithOwner) }),
      ).toHaveAttribute('href', repo.url)
  })

  test(`dossier ${engineer.id} links every published channel with a valid href`, async ({
    page,
    request,
  }) => {
    await page.goto(`/engineers/${engineer.id}`)
    const main = page.getByRole('main')
    const c = engineer.contact
    const published = [
      c.github,
      c.linkedin,
      c.website,
      c.x,
      c.tiktok,
      c.instagram,
      c.resume,
      `mailto:${c.email}`,
    ].filter((h): h is string => Boolean(h))
    for (const href of published)
      await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible()

    const hrefs = await main
      .locator('a[href]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))
    expect(hrefs.length).toBeGreaterThan(10)
    const internal = new Set<string>()
    for (const href of hrefs) {
      if (href.startsWith('mailto:'))
        expect(href).toMatch(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/)
      else if (href.startsWith('#'))
        // In-page links, such as the section index, point at a real id.
        expect(
          await page.locator(`[id="${href.slice(1)}"]`).count(),
          href,
        ).toBe(1)
      else if (href.startsWith('/')) internal.add(href.split('#')[0])
      else expect(() => new URL(href)).not.toThrow()
      if (/^https?:/.test(href)) expect(href).toMatch(/^https:\/\//)
    }
    for (const path of Array.from(internal)) {
      const r = await request.get(path)
      expect(r.status(), path).toBe(200)
    }
  })
}

test('the contribution graph has an accessible summary and reads days by keyboard', async ({
  page,
}) => {
  const user = getGithubUser(engineers[0].githubLogin)!
  await page.goto(`/engineers/${engineers[0].id}`)
  const graph = page.getByRole('img', {
    name: new RegExp(
      `${fmt(user.contributions.total)} contributions in the last year`,
    ),
  })
  await expect(graph).toBeVisible()
  const days = user.contributions.weeks.reduce((n, w) => n + w.days.length, 0)
  await expect(graph.locator('rect')).toHaveCount(days)

  const group = page.getByRole('group', { name: /Contribution calendar/ })
  await group.focus()
  const readout = page.locator(`#gh-${user.login}-summary-readout`)
  const last = user.contributions.weeks.at(-1)!.days.at(-1)!
  await expect(readout).toContainText(
    last.count === 0
      ? 'No contributions on'
      : `${fmt(last.count)} contribution`,
  )
  await page.keyboard.press('Home')
  const first = user.contributions.weeks[0].days[0]
  await expect(readout).toContainText(
    new Date(`${first.date}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  )
})

test('on a phone the contribution graph keeps its labels legible and unclipped', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const user = getGithubUser(engineers[0].githubLogin)!
  await page.goto(`/engineers/${engineers[0].id}`)
  const group = page.getByRole('group', { name: /Contribution calendar/ })
  await group.scrollIntoViewIfNeeded()

  /** Every label's font size, and whether it sits inside the visible graph box. */
  const labels = () =>
    group.evaluate((el) => {
      const box = el.getBoundingClientRect()
      return Array.from(el.querySelectorAll('[data-graph-label]')).map((l) => {
        const r = l.getBoundingClientRect()
        return {
          text: l.textContent,
          size: parseFloat(getComputedStyle(l).fontSize),
          inside: r.left >= box.left - 0.5 && r.right <= box.right + 0.5,
        }
      })
    })

  // The last 26 weeks at full size, day names included.
  const recent = user.contributions.weeks
    .slice(-26)
    .reduce((n, w) => n + w.days.length, 0)
  await expect(group.locator('rect')).toHaveCount(recent)
  let shown = await labels()
  expect(shown.map((l) => l.text)).toEqual(
    expect.arrayContaining(['Mon', 'Wed', 'Fri']),
  )
  for (const l of shown) {
    expect(l.size, l.text!).toBeGreaterThanOrEqual(12)
    expect(l.inside, l.text!).toBe(true)
  }

  // The whole year scrolls sideways, and the day names stay in view.
  await page.getByRole('button', { name: 'Show the whole year' }).click()
  const days = user.contributions.weeks.reduce((n, w) => n + w.days.length, 0)
  await expect(group.locator('rect')).toHaveCount(days)
  for (const left of [0, 10_000]) {
    await group.evaluate((el, x) => (el.scrollLeft = x), left)
    shown = (await labels()).filter((l) =>
      ['Mon', 'Wed', 'Fri'].includes(l.text!),
    )
    for (const l of shown) {
      expect(l.size).toBeGreaterThanOrEqual(12)
      expect(l.inside, `${l.text} at scrollLeft ${left}`).toBe(true)
    }
  }
  // The keyboard readout still reads days.
  await group.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator(`#gh-${user.login}-summary-readout`)).toContainText(
    /contribution|No contributions/,
  )
})

test('the engineers index shows each GitHub signal and the team graph', async ({
  page,
}) => {
  await page.goto('/engineers')
  const main = page.getByRole('main')
  for (const e of engineers) {
    const user = getGithubUser(e.githubLogin)!
    const card = main.locator('article').filter({ hasText: e.name })
    await expect(stat(card, 'Contributions')).toHaveText(
      fmt(user.contributions.total),
    )
    await expect(stat(card, 'Followers')).toHaveText(fmt(user.followers))
    await expect(stat(card, 'Stars on own repos')).toHaveText(fmt(user.stars))
    // Stars on the studio products they build, summed from the snapshot.
    const built = products.filter((p) => p.engineers.includes(e.id))
    if (built.length > 0) {
      const stars = built.reduce((n, p) => n + productRepo(p).stars, 0)
      await expect(card).toContainText(
        `Builds at Sideband · ${fmt(stars)} ${stars === 1 ? 'star' : 'stars'} on these products' repos`,
      )
    }
  }
  const total = engineers.reduce(
    (n, e) => n + getGithubUser(e.githubLogin)!.contributions.total,
    0,
  )
  await expect(
    page.getByRole('img', {
      name: new RegExp(`${fmt(total)} contributions across the team`),
    }),
  ).toBeVisible()
})

test('the about timeline dates every engineer from their Sideband role', async ({
  page,
}) => {
  await page.goto('/about')
  const history = page.locator('section[aria-labelledby="history-title"]')
  const roles = engineers.map((e) => ({
    engineer: e,
    role: e.experience!.find((x) => x.company === 'Sideband')!,
  }))
  for (const { engineer, role } of roles) {
    // Every Sideband role is a founding role, so its title is never typed out on the page.
    expect(role.role).toBe(engineer.role)
    const year = role.startDate.match(/\d{4}/)![0]
    const yearBlock = history
      .getByRole('listitem')
      .filter({ has: page.getByRole('heading', { name: year, exact: true }) })
    await expect(yearBlock).toContainText(engineer.name)
  }
  const joined = roles.filter((r) => r.engineer.id !== 'ali-younes')
  for (const { engineer, role } of joined)
    await expect(history).toContainText(
      `${engineer.name} joins as ${role.role}.`,
    )
  await expect(history).not.toContainText(/co-?found/i)
  // Projects begun before their builder joined are theirs, not studio work.
  await expect(history).toContainText(
    'Ali Tleis starts Eternal Summary, now a Sideband product.',
  )
  await expect(history).toContainText(
    'Naman Rusia starts TandemCode, now a Sideband product.',
  )
  const studioWork = await history
    .locator('li li')
    .filter({ hasText: 'Work begins at the studio' })
    .allInnerTexts()
  expect(studioWork.length).toBeGreaterThan(0)
  for (const line of studioWork)
    expect(line).not.toMatch(/Eternal Summary|TandemCode/)
  // The studio's start matches "It started as two of us".
  await expect(history).toContainText(
    'Ali Younes and one other person start the studio in Boston as Eternal Reverse.',
  )
})

test('the about page quotes Ali Younes on why EternalMonitor exists', async ({
  page,
}) => {
  await page.goto('/about')
  await expect(
    page.locator('section[aria-labelledby="how-title"]'),
  ).toContainText(
    'In Ali Younes’s words: “I refused to pay $40 for an iPad-as-second-display app that lagged. So I wrote my own.”',
  )
})

test('a role held in two stints is measured per stint, and roles group by organisation', async ({
  page,
}) => {
  await page.goto('/engineers/ali-younes')
  const exp = page.locator('section[aria-labelledby="experience-title"]')
  const groups = exp.locator(':scope ol > li')
  const philips = groups.filter({
    has: page.getByRole('heading', { name: 'Philips', exact: true }),
  })
  await expect(philips).toContainText('Aug 2026 – Present · 3 mos · Part-time')
  await expect(philips).toContainText('Jan 2026 – Jun 2026 · 6 mos · Co-op')
  // Never one length across the gap between the co-op and the return.
  await expect(philips).not.toContainText('Jan 2026 – Present')
  await expect(philips).not.toContainText('10 mos')

  const amazon = groups.filter({
    has: page.getByRole('heading', { name: 'Amazon', exact: true }),
  })
  await expect(amazon).toHaveCount(1)
  await expect(amazon).toContainText('2 roles')
  await expect(amazon).toContainText('Amazon Web Services')
  await expect(exp).toContainText('8 roles at 7 organizations')
})

test('a role dated by year alone shows the year without a month or length', async ({
  page,
}) => {
  await page.goto('/engineers/david-czartoryski')
  const exp = page.locator('section[aria-labelledby="experience-title"]')
  const sideband = exp
    .getByRole('listitem')
    .filter({ has: page.getByRole('img', { name: 'Sideband logo' }) })
  await expect(sideband).toContainText('2026 – Present · Boston, MA')
  await expect(sideband).not.toContainText(/\b(mo|mos|yr|yrs)\b/)
})

test("David's ventures are listed as his own, outside Sideband", async ({
  page,
}) => {
  await page.goto('/engineers/david-czartoryski')
  const projects = page.locator('section[aria-labelledby="projects-title"]')
  const heading = projects.getByRole('heading', {
    name: "David's own ventures, outside Sideband",
  })
  await expect(heading).toBeVisible()
  const ventures = heading.locator('xpath=..').getByRole('listitem')
  await expect(ventures).toHaveCount(3)
  for (const name of ['EternalTap', 'CrediMax', 'The creative engine'])
    await expect(ventures.filter({ hasText: name }).first()).toContainText(
      'Own venture',
    )
  // None of them is presented as a Sideband product.
  await expect(
    projects.getByRole('heading', { name: 'At Sideband' }),
  ).toHaveCount(0)
})

test.describe('contact form', () => {
  async function fill(page: Page) {
    await page.getByRole('textbox', { name: 'Name' }).fill('Ali')
    await page.getByRole('textbox', { name: 'Email' }).fill('ali@example.com')
    await page
      .getByRole('textbox', { name: 'Message' })
      .fill('Looking to talk through a product collaboration.')
  }

  test('validates before sending anything', async ({ page }) => {
    let calls = 0
    await page.route(FORMSPREE, (route) => {
      calls++
      return route.abort()
    })
    await page.goto('/contact')
    await page.getByRole('button', { name: /Send message/i }).click()
    await expect(page.getByText('Enter your name.')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused()
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await page.getByRole('textbox', { name: 'Name' }).fill('Ali')
    await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email')
    await page.getByRole('textbox', { name: 'Message' }).fill('Hi')
    await page.getByRole('button', { name: /Send message/i }).click()
    await expect(page.getByText(/Enter an email address like/)).toBeVisible()
    await expect(page.getByText('Write at least 10 characters.')).toBeVisible()
    expect(calls).toBe(0)
  })

  test('shows the sent state when Formspree accepts the message', async ({
    page,
  }) => {
    let body: Record<string, string> = {}
    await page.route(FORMSPREE, async (route) => {
      body = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })
    await page.goto('/contact')
    await fill(page)
    await page.getByRole('button', { name: /Send message/i }).click()
    await expect(
      page.getByRole('heading', { name: 'Message sent' }),
    ).toBeFocused()
    await expect(page.getByRole('status')).toContainText('ali@example.com')
    expect(body).toMatchObject({
      name: 'Ali',
      email: 'ali@example.com',
      message: 'Looking to talk through a product collaboration.',
    })
    await page.getByRole('button', { name: 'Send another message' }).click()
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('')
  })

  test('shows the error state with an email fallback when sending fails', async ({
    page,
  }) => {
    await page.route(FORMSPREE, (route) =>
      route.fulfill({ status: 500, body: '{}' }),
    )
    await page.goto('/contact')
    await fill(page)
    await page.getByRole('button', { name: /Send message/i }).click()
    const alert = page
      .getByRole('alert')
      .filter({ hasText: 'Something went wrong' })
    await expect(alert).toContainText('Something went wrong. Please try again.')
    const fallback = alert.getByRole('link', {
      name: /send it by email to hello@sideband.studio/,
    })
    await expect(fallback).toHaveAttribute(
      'href',
      /^mailto:hello@sideband\.studio\?subject=Message%20from%20Ali&body=Looking/,
    )
    // The message is kept so it can be sent again.
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(
      'Looking to talk through a product collaboration.',
    )
  })
})

const PAGES = [
  '/engineers',
  ...engineers.map((e) => `/engineers/${e.id}`),
  '/about',
  '/contact',
]

for (const width of [390, 768, 1440, 1920]) {
  test(`no console errors or sideways scroll at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`)
    })
    page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`))
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, path).toBeLessThanOrEqual(0)
    }
    expect(errors).toEqual([])
  })
}
