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

// Let the hero's page-load sequence finish before the first capture.
await page.waitForTimeout(1800)
await shot('01-hero')

try {
  await page.getByRole('tab', { name: 'Exerly Fitness' }).click()
  await page.waitForTimeout(900)
  await shot('02-preview-tab')
} catch {
  console.warn('preview tab not found, skipping 02-preview-tab')
}

for (const [name, id] of [
  ['03-products', 'products'],
  ['04-studio', 'team'],
  ['05-open-source', 'open-source'],
]) {
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id)
  await page.waitForTimeout(900)
  await shot(name)
}

await page.evaluate(() =>
  window.scrollTo(0, document.documentElement.scrollHeight),
)
await page.waitForTimeout(900)
await shot('06-cta-footer')

await browser.close()
