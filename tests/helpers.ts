import type { Locator, Page } from '@playwright/test'

/**
 * Waits until a page has settled after a navigation: loaded, hydrated (React
 * has attached to the document, so clicks reach its handlers) and idle. Tests
 * act or leave only after this, so nothing runs against server HTML and a page
 * is not left in the middle of its own route prefetches.
 */
export async function settle(page: Page) {
  await page.waitForLoadState('load')
  await page.waitForFunction(() =>
    Object.keys(document.body).some((key) => key.startsWith('__reactFiber')),
  )
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestIdleCallback(() => resolve(), { timeout: 2000 }),
      ),
  )
}

/** Opens a path and waits for it to settle. Returns the response. */
export async function visit(
  page: Page,
  path: string,
  options?: Parameters<Page['goto']>[1],
) {
  const response = await page.goto(path, options)
  await settle(page)
  return response
}

/**
 * Brings an element on screen, then focuses it, as a person does before
 * pressing a key on it. The page scrolls smoothly (scroll-behavior on html),
 * so focusing something off screen starts a scroll that is still running
 * when the next key lands. A jump made then races that scroll and can stop
 * where the focus scroll was headed instead of at its own target.
 */
export async function focusOnScreen(locator: Locator) {
  await locator.evaluate((el) =>
    el.scrollIntoView({ block: 'center', behavior: 'instant' }),
  )
  await locator.focus()
}

/** Lets layout catch up after a viewport change. */
export async function nextFrame(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

/**
 * How far the page is wider than its viewport, and the elements that reach
 * past its right edge, so a failing check names what overflows. Only the
 * innermost are listed (an element is skipped when a child of it overflows
 * too, or when an ancestor that clips it ends inside the viewport), and an
 * icon is listed as the element that holds it. The body hides horizontal
 * overflow, which would hide a page that is too wide, so it is released to
 * measure.
 */
export async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const html = document.documentElement
    document.body.style.overflowX = 'visible'
    const edge = html.clientWidth
    const overflow = html.scrollWidth - edge
    const past = (el: Element) => el.getBoundingClientRect().right > edge + 0.5
    const clipped = (el: Element) => {
      let p = el.parentElement
      while (p && p !== document.body) {
        if (getComputedStyle(p).overflowX !== 'visible' && !past(p)) return true
        p = p.parentElement
      }
      return false
    }
    const describe = (el: Element) => {
      const id = el.id ? `#${el.id}` : ''
      const cls = (el.getAttribute('class') ?? '').trim().split(/\s+/)
      const classes = cls[0] ? `.${cls.slice(0, 4).join('.')}` : ''
      const text = (el.textContent ?? '').trim().slice(0, 40)
      const right = Math.round(el.getBoundingClientRect().right)
      return `${el.tagName.toLowerCase()}${id}${classes} "${text}" ends at ${right}px`
    }
    const culprits =
      overflow > 0
        ? Array.from(document.body.querySelectorAll('*'))
            .filter((el) => past(el) && !clipped(el))
            .filter((el) => !Array.from(el.children).some(past))
            .map((el) =>
              el instanceof SVGElement ? el.closest('svg')!.parentElement! : el,
            )
            .filter((el, i, all) => all.indexOf(el) === i)
            .slice(0, 8)
            .map(describe)
        : []
    document.body.style.overflowX = ''
    return { overflow, culprits }
  })
}

/**
 * The one console error a healthy page may log: Next aborts a route prefetch
 * when the test navigates or closes the page before it finishes.
 */
export const ABORTED_PREFETCH =
  /^Failed to fetch RSC payload for http:\/\/127\.0\.0\.1:\d+\/\S*\. Falling back to browser navigation\. TypeError: (?:Failed to fetch|network error)$/
