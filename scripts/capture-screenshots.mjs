#!/usr/bin/env node
/**
 * Capture the standard landing-page screenshot set.
 *
 * Local:  npm run shots            (server must be running; BASE_URL defaults
 *         to http://localhost:3000, override with BASE_URL=... )
 * CI:     the pr-screenshots workflow runs this against the production build,
 *         commits the output to the `pr-assets` branch, and posts a sticky
 *         PR comment embedding the images.
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT_DIR = process.env.OUT_DIR ?? 'screenshots'

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const shot = async (name) => {
  await page.screenshot({
    path: `${OUT_DIR}/${name}.jpg`,
    type: 'jpeg',
    quality: 82,
  })
  console.log(`captured ${name}`)
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' })

// Scroll through slowly so whileInView reveals fire before capturing.
await page.evaluate(async () => {
  const height = () => document.documentElement.scrollHeight
  for (let y = 0; y < height(); y += 500) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 300))
  }
})
await page.waitForTimeout(1200)

await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
await shot('01-hero')

try {
  await page.getByRole('button', { name: 'products', exact: true }).click()
  await page.waitForTimeout(500)
  await shot('02-terminal')
} catch {
  console.warn('terminal chip not found, skipping 02-terminal')
}

for (const [name, action] of [
  ['03-products', () => document.getElementById('products')?.scrollIntoView()],
  ['04-under-the-hood', () => window.scrollBy(0, 1400)],
  ['05-studio-cta', () => document.getElementById('team')?.scrollIntoView()],
]) {
  await page.evaluate(action)
  await page.waitForTimeout(900)
  await shot(name)
}

await browser.close()
