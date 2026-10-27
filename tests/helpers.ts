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
 * The one console error a healthy page may log: Next aborts a route prefetch
 * when the test navigates or closes the page before it finishes.
 */
export const ABORTED_PREFETCH =
  /^Failed to fetch RSC payload for http:\/\/127\.0\.0\.1:\d+\/\S*\. Falling back to browser navigation\. TypeError: (?:Failed to fetch|network error)$/
