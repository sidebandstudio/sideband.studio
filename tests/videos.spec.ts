import { test, expect, type Page } from '@playwright/test'
import { products, productsByRank } from '../lib/products'
import { engineers } from '../lib/engineers'
import { productsBy } from '../lib/engineers-view'
import { visit } from './helpers'

/**
 * The product videos (components/products/ProductVideo.tsx) on every page
 * that shows a product: the home showcase, /products, each product page (its
 * hero and the two neighbours under it) and each dossier with studio projects.
 */
const PAGES = [
  '/',
  '/products',
  ...products.map((p) => `/products/${p.id}`),
  ...engineers
    .filter((e) => productsBy(e.id).length > 0)
    .map((e) => `/engineers/${e.id}`),
]

const eternal2x = products.find((p) => p.id === 'eternal2x')!
const CREDIT = eternal2x.video.card.credit!.text

const VIDEOS = '[data-product-video]'

/** Every video on the page, as plain data read from the DOM. */
function readVideos(page: Page) {
  return page.locator(VIDEOS).evaluateAll((wraps) =>
    wraps.map((wrap, index) => {
      const frame = wrap.querySelector('[data-video-frame]')!
      const video = frame.querySelector('video')!
      const poster = frame.querySelector('img')!
      const box = frame.getBoundingClientRect()
      return {
        index,
        cut: wrap.getAttribute('data-product-video'),
        width: box.width,
        height: box.height,
        laidOut: frame.getClientRects().length > 0,
        // Layout size, which ignores the hover lift and entrance transforms.
        layout: [
          (frame as HTMLElement).offsetWidth,
          (frame as HTMLElement).offsetHeight,
        ],
        ariaHidden: frame.getAttribute('aria-hidden'),
        focusable: frame.querySelectorAll(
          'a, button, input, select, textarea, [tabindex], video[controls]',
        ).length,
        sources: Array.from(video.querySelectorAll('source')).map((s) => ({
          src: s.getAttribute('src') ?? '',
          type: s.getAttribute('type') ?? '',
        })),
        poster: poster.currentSrc || poster.src,
        muted: video.muted,
        loop: video.loop,
        playsinline: video.hasAttribute('playsinline'),
        noPip: video.hasAttribute('disablepictureinpicture'),
        controls: video.controls,
        preload: video.getAttribute('preload'),
        text: wrap.textContent ?? '',
      }
    }),
  )
}

/** Plays and paused state of one video, with what it has decoded. */
function videoState(page: Page, index: number) {
  return page
    .locator(VIDEOS)
    .nth(index)
    .evaluate((wrap) => {
      const video = wrap.querySelector('video')!
      const v = video as HTMLVideoElement & {
        webkitAudioDecodedByteCount?: number
        audioTracks?: { length: number }
        mozHasAudio?: boolean
      }
      return {
        playing: !video.paused && video.currentTime > 0,
        paused: video.paused,
        shown: getComputedStyle(video).opacity === '1',
        audioBytes: v.webkitAudioDecodedByteCount ?? 0,
        audioTracks: v.audioTracks?.length ?? 0,
        mozHasAudio: v.mozHasAudio ?? false,
      }
    })
}

function scrollToVideo(page: Page, index: number) {
  return page
    .locator(VIDEOS)
    .nth(index)
    .evaluate((wrap) =>
      wrap.scrollIntoView({ block: 'center', behavior: 'instant' }),
    )
}

/** Sums layout shifts, and records any whose source sits inside a video frame. */
async function watchShifts(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { shift: number; videoShifts: number }
    w.shift = 0
    w.videoShifts = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as {
        value: number
        hadRecentInput: boolean
        sources?: { node?: Node }[]
      }[]) {
        if (e.hadRecentInput) continue
        w.shift += e.value
        for (const s of e.sources ?? []) {
          const el = s.node instanceof Element ? s.node : s.node?.parentElement
          if (el?.closest('[data-video-frame]')) w.videoShifts += 1
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
}

for (const path of PAGES) {
  test(`${path}: every video has its sources, poster and frame`, async ({
    page,
    request,
  }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, path)
    const videos = await readVideos(page)
    expect(videos.length, 'videos on the page').toBeGreaterThan(0)

    const checked = new Set<string>()
    for (const v of videos) {
      const label = `${path} video ${v.index}`
      expect(v.cut, label).toMatch(/^(hero|card)$/)
      // Two sources, WebM then MP4, of the same product and cut.
      expect(
        v.sources.map((s) => s.type),
        label,
      ).toEqual(['video/webm', 'video/mp4'])
      expect(v.sources[0].src.replace(/\.webm$/, ''), label).toBe(
        v.sources[1].src.replace(/\.mp4$/, ''),
      )
      expect(v.sources[0].src, label).toMatch(
        new RegExp(`/video/[a-z0-9-]+-${v.cut}\\.webm$`),
      )
      for (const url of [...v.sources.map((s) => s.src), v.poster]) {
        if (checked.has(url)) continue
        checked.add(url)
        const res = await request.get(url)
        expect(res.status(), url).toBe(200)
        const type = res.headers()['content-type'] ?? ''
        expect(type, url).toMatch(/^(video\/(webm|mp4)|image\/)/)
      }

      // The frame: 16:10 for a hero from md, 4:3 for a card.
      if (v.laidOut)
        expect(v.width / v.height, label).toBeCloseTo(
          v.cut === 'hero' ? 16 / 10 : 4 / 3,
          1,
        )

      // Silent, looping, inline, no controls, decorative and unfocusable.
      expect(v.muted, label).toBe(true)
      expect(v.loop, label).toBe(true)
      expect(v.playsinline, label).toBe(true)
      expect(v.noPip, label).toBe(true)
      expect(v.controls, label).toBe(false)
      expect(v.ariaHidden, label).toBe('true')
      expect(v.focusable, label).toBe(0)
      expect(v.preload, label).toMatch(
        path.startsWith('/products/') && v.index === 0
          ? /^metadata$/
          : /^none$/,
      )

      // Credits are not shown inline: the footer lists them.
      expect(v.text, label).not.toContain(CREDIT)
    }

    // Wherever Eternal2x's video appears, the footer credits its footage.
    if (videos.some((v) => v.sources[0].src.includes('/eternal2x/')))
      await expect(
        page.locator('footer details#credits').getByText(CREDIT),
      ).toBeAttached()
  })

  test(`${path}: videos play on screen, pause off screen and never shift layout`, async ({
    page,
  }) => {
    test.setTimeout(120000)
    await watchShifts(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, path)
    const before = await readVideos(page)

    const shown = before.filter((v) => v.laidOut)
    for (const v of shown) {
      await scrollToVideo(page, v.index)
      await expect
        .poll(() => videoState(page, v.index), { timeout: 15000 })
        .toMatchObject({ playing: true, shown: true })
      const state = await videoState(page, v.index)
      expect(state.audioBytes, `video ${v.index} decoded audio`).toBe(0)
      expect(state.audioTracks, `video ${v.index} audio tracks`).toBe(0)
      expect(state.mozHasAudio).toBe(false)
    }

    // Away from every video that played, each one pauses.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    const off = await page.locator(VIDEOS).evaluateAll((wraps) =>
      wraps
        .map((w, i) => ({ i, top: w.getBoundingClientRect().top }))
        .filter((w) => w.top > window.innerHeight + 200)
        .map((w) => w.i),
    )
    for (const i of off.filter((i) => shown.some((v) => v.index === i)))
      await expect
        .poll(() => videoState(page, i).then((s) => s.paused))
        .toBe(true)

    // Playing changed nothing about the frames' size.
    const after = await readVideos(page)
    expect(after.map((v) => v.layout)).toEqual(before.map((v) => v.layout))
    const shifts = await page.evaluate(
      () =>
        (window as unknown as { shift: number; videoShifts: number })
          .videoShifts,
    )
    expect(shifts, 'layout shifts inside a video frame').toBe(0)
  })
}

for (const path of ['/', '/products', `/products/${eternal2x.id}`]) {
  test(`${path} under reduced motion: posters only, nothing plays`, async ({
    page,
  }) => {
    test.setTimeout(90000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, path)
    const videos = (await readVideos(page)).filter((v) => v.laidOut)
    for (const v of videos) {
      await scrollToVideo(page, v.index)
      const poster = page
        .locator(VIDEOS)
        .nth(v.index)
        .locator('[data-video-frame] img')
      await expect
        .poll(() =>
          poster.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true)
    }
    // Checks that nothing starts within a window: the one timeout kind allowed.
    await page.waitForTimeout(1000)
    for (const v of videos) {
      const state = await videoState(page, v.index)
      expect(state, `video ${v.index}`).toMatchObject({
        paused: true,
        shown: false,
      })
    }
  })
}

test('turning reduced motion on stops a playing video and shows its poster', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await visit(page, `/products/${products[0].id}`)
  await scrollToVideo(page, 0)
  await expect
    .poll(() => videoState(page, 0))
    .toMatchObject({ playing: true, shown: true })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() => videoState(page, 0))
    .toMatchObject({ paused: true, shown: false })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect
    .poll(() => videoState(page, 0))
    .toMatchObject({ playing: true, shown: true })
})

for (const width of [390, 1440]) {
  test(`at ${width}px no video downloads before its frame nears the viewport`, async ({
    page,
  }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    for (const path of [
      '/',
      '/products',
      `/products/${productsByRank()[3].id}`,
      `/engineers/${engineers[0].id}`,
    ]) {
      const media: string[] = []
      const log = (r: { url(): string }) => {
        if (/\.(webm|mp4)(\?|$)/.test(r.url()))
          media.push(new URL(r.url()).pathname)
      }
      page.on('request', log)
      await visit(page, path)
      // A playing video keeps its request open, so the network never goes
      // idle. Give late requests a window instead.
      await page.waitForTimeout(1500)
      page.off('request', log)

      // Only a frame within reach of the viewport may have fetched, and only
      // the product page's own hero before it is on screen (its metadata).
      const allowed = await page.locator(VIDEOS).evaluateAll((wraps) =>
        wraps.flatMap((wrap) => {
          const box = wrap.getBoundingClientRect()
          const near = box.top < window.innerHeight + 100 && box.bottom > -100
          const video = wrap.querySelector('video')!
          const ok = near || video.getAttribute('preload') === 'metadata'
          return ok
            ? Array.from(video.querySelectorAll('source')).map(
                (s) => s.getAttribute('src') ?? '',
              )
            : []
        }),
      )
      for (const url of media) expect(allowed, `${path}: ${url}`).toContain(url)
      if (path === '/')
        expect(media, 'the home page before scrolling').toEqual([])
    }
  })
}

test('below md a hero video sits in a 4:3 frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page, `/products/${products[0].id}`)
  const frame = page.locator(`${VIDEOS} [data-video-frame]`).first()
  const box = (await frame.boundingBox())!
  expect(box.width / box.height).toBeCloseTo(4 / 3, 1)
})
