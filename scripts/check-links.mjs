#!/usr/bin/env node
/**
 * External link check: every http(s) link on the built site answers.
 *
 * Reads the prerendered pages in .next/server/app (run `npm run build` first),
 * collects every external <a href>, and requests each one: HEAD first, then
 * GET when HEAD fails or is refused, then GET as a browser. 2xx and 3xx are
 * good. A few sites answer
 * automated requests with an error even when the page is up. They are listed
 * in ALLOWED with the status they send and why, and pass only with that exact
 * status. Anything else fails the run and is printed with the pages that link
 * to it.
 *
 * Needs the network, so it is not in CI. Run `npm run check:links` before a
 * PR that adds or changes links. See PR.md -> Before Requesting Review.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PAGES = join(ROOT, '.next/server/app')
const TIMEOUT = 20000
const CONCURRENCY = 8
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

/** Hosts that refuse automated requests, checked by hand in a browser. */
const ALLOWED = [
  {
    host: /(^|\.)linkedin\.com$/,
    status: 999,
    reason: 'LinkedIn answers every non-browser request with 999',
  },
  {
    host: /(^|\.)tiktok\.com$/,
    status: 403,
    reason: 'TikTok refuses non-browser requests with 403',
  },
]

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return name.endsWith('.html') && !name.startsWith('_not-found')
      ? [path]
      : []
  })
}

const decode = (href) =>
  href
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")

let files
try {
  files = htmlFiles(PAGES)
} catch {
  console.error('check-links: no built pages. Run `npm run build` first.')
  process.exit(1)
}

/** url -> pages that link to it */
const links = new Map()
for (const file of files) {
  const page =
    '/' +
    relative(PAGES, file)
      .replace(/\.html$/, '')
      .replace(/^index$/, '')
  const html = readFileSync(file, 'utf8')
  for (const m of html.matchAll(/<a\b[^>]*?\shref="(https?:\/\/[^"]+)"/g)) {
    const url = decode(m[1])
    if (!links.has(url)) links.set(url, new Set())
    links.get(url).add(page)
  }
}

/**
 * Plain requests first, then a GET that looks like a browser: some sites
 * refuse one and accept the other (an auth middleware loops a browser-like
 * request through its handshake, a CDN refuses the default user agent).
 */
const ATTEMPTS = [
  { method: 'HEAD', headers: {} },
  { method: 'GET', headers: {} },
  { method: 'GET', headers: { 'user-agent': UA, accept: 'text/html,*/*' } },
]

async function request(url, { method, headers }) {
  const res = await fetch(url, {
    method,
    redirect: 'follow',
    headers,
    signal: AbortSignal.timeout(TIMEOUT),
  })
  // Release the connection without reading a large body.
  await res.body?.cancel().catch(() => {})
  return res.status
}

async function check(url) {
  let status = 0
  let error = ''
  for (const attempt of ATTEMPTS) {
    try {
      status = await request(url, attempt)
      error = ''
      if (status < 400) return { url, status, ok: true }
    } catch (e) {
      error = e.cause?.code ?? e.name ?? String(e)
    }
  }
  const host = new URL(url).hostname
  const allowed = ALLOWED.find((a) => a.host.test(host) && a.status === status)
  if (allowed) return { url, status, ok: true, allowed: allowed.reason }
  return { url, status, ok: false, error }
}

const queue = [...links.keys()].sort()
const results = []
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) results.push(await check(queue.shift()))
  }),
)
results.sort((a, b) => a.url.localeCompare(b.url))

const bad = results.filter((r) => !r.ok)
const allowed = results.filter((r) => r.allowed)
for (const r of allowed)
  console.log(`allowed ${r.status} ${r.url} (${r.allowed})`)
for (const r of bad) {
  console.log(`FAIL ${r.status || r.error} ${r.url}`)
  console.log(`  linked from ${[...links.get(r.url)].join(', ')}`)
}
console.log(
  `check-links: ${results.length} external links on ${files.length} pages, ${results.length - bad.length - allowed.length} ok, ${allowed.length} allowed bot-blockers, ${bad.length} failing.`,
)
process.exit(bad.length ? 1 : 0)
