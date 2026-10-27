#!/usr/bin/env node
/**
 * Pulls the product videos into the site from the HyperFrames projects they
 * were rendered in. See media/product-videos/README.md.
 *
 *   npm run sync:videos -- <video-dir>
 *
 * <video-dir> holds one HyperFrames project per product id, each with its
 * encoded cuts in out/. For every product with a `videoCut()` in
 * lib/products.ts this script:
 *
 * 1. checks the six files in <video-dir>/<id>/out/ with ffprobe (one video
 *    stream, no audio, the cut's size and codec) and copies them to
 *    public/assets/products/<id>/video/,
 * 2. rewrites each cut's duration in lib/products.ts from ffprobe,
 * 3. replaces media/product-videos/<id>/ with the project's source files:
 *    the compositions, their config and notes, and the assets they reference
 *    (no node_modules, renders, out, review or snapshots).
 *
 * It prints each file's size against its budget and fails on anything that
 * would put a wrong file on the site.
 */
import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PRODUCTS_TS = join(ROOT, 'lib/products.ts')

const src = process.argv[2]
if (!src || !existsSync(src)) {
  console.error('Usage: npm run sync:videos -- <video-dir>')
  process.exit(1)
}

/** Size and budget (bytes) per cut and file, from the video spec. */
const CUTS = {
  hero: { width: 1920, height: 1200, budget: { mp4: 2.5e6, webm: 1.5e6 } },
  card: { width: 1440, height: 1080, budget: { mp4: 1.2e6, webm: 0.8e6 } },
}
const CODEC = { mp4: 'h264', webm: 'vp9' }

/** Project files kept as source, at the root and in card/. */
const SOURCE_FILES = [
  'index.html',
  'meta.json',
  'hyperframes.json',
  'package.json',
  'CLAUDE.md',
  'AGENTS.md',
]
const SOURCE_DIRS = ['compositions']

const errors = []
const fail = (msg) => errors.push(msg)

function probe(file) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', file],
    { encoding: 'utf8' },
  )
  return JSON.parse(out)
}

const mb = (bytes) => (bytes / 1e6).toFixed(2) + ' MB'

let ts = readFileSync(PRODUCTS_TS, 'utf8')
const ids = [
  ...new Set([...ts.matchAll(/videoCut\(\s*'([^']+)'/g)].map((m) => m[1])),
]
if (ids.length === 0) fail('No videoCut() calls found in lib/products.ts')

let total = 0
const rows = []

for (const id of ids) {
  const out = join(src, id, 'out')
  const dest = join(ROOT, 'public/assets/products', id, 'video')
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })

  for (const [cut, spec] of Object.entries(CUTS)) {
    let duration = null
    for (const ext of ['mp4', 'webm']) {
      const name = `${id}-${cut}.${ext}`
      const file = join(out, name)
      if (!existsSync(file)) {
        fail(`${name}: missing in ${out}`)
        continue
      }
      const info = probe(file)
      const streams = info.streams ?? []
      const video = streams.filter((s) => s.codec_type === 'video')
      const audio = streams.filter((s) => s.codec_type === 'audio')
      if (streams.length !== 1 || video.length !== 1)
        fail(`${name}: ${streams.length} streams, expected one video stream`)
      if (audio.length) fail(`${name}: has an audio stream`)
      const v = video[0]
      if (v && (v.width !== spec.width || v.height !== spec.height))
        fail(
          `${name}: ${v.width}x${v.height}, expected ${spec.width}x${spec.height}`,
        )
      if (v && v.codec_name !== CODEC[ext])
        fail(`${name}: codec ${v.codec_name}, expected ${CODEC[ext]}`)
      const seconds = Number(info.format.duration)
      if (ext === 'mp4') duration = seconds
      else if (duration !== null && Math.abs(seconds - duration) > 0.05)
        fail(`${name}: ${seconds}s, the mp4 is ${duration}s`)

      const bytes = statSync(file).size
      const budget = spec.budget[ext]
      rows.push([
        name,
        mb(bytes),
        mb(budget),
        bytes > budget ? 'OVER BUDGET' : '',
      ])
      total += bytes
      copyFileSync(file, join(dest, name))
    }

    const poster = `${id}-${cut}-poster.webp`
    const posterFile = join(out, poster)
    if (!existsSync(posterFile)) fail(`${poster}: missing in ${out}`)
    else {
      const p = probe(posterFile).streams?.[0]
      if (!p || p.width !== spec.width || p.height !== spec.height)
        fail(
          `${poster}: ${p?.width}x${p?.height}, expected ${spec.width}x${spec.height}`,
        )
      const bytes = statSync(posterFile).size
      rows.push([poster, mb(bytes), '', ''])
      total += bytes
      copyFileSync(posterFile, join(dest, poster))
    }

    if (duration !== null) {
      const pattern = new RegExp(
        `(videoCut\\(\\s*'${id}',\\s*'${cut}',\\s*)[\\d.]+`,
      )
      if (!pattern.test(ts))
        fail(`lib/products.ts: no videoCut for ${id} ${cut}`)
      ts = ts.replace(pattern, `$1${Number(duration.toFixed(3))}`)
    }
  }

  copySources(join(src, id), join(ROOT, 'media/product-videos', id))
}

/**
 * Copies a HyperFrames project's sources: SOURCE_FILES and SOURCE_DIRS at the
 * root and in card/, and the files under assets/ that a composition names.
 * card/assets is a link to ../assets and stays one.
 */
function copySources(from, to) {
  rmSync(to, { recursive: true, force: true })
  const levels = ['', 'card'].filter((d) => existsSync(join(from, d)))
  const html = levels
    .map((d) => join(from, d, 'index.html'))
    .filter(existsSync)
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
  // Literal paths, and template paths such as `assets/img/cells/${row}-${i}.webp`.
  const refs = [...new Set(html.match(/assets\/[^"'`()\s]+/g) ?? [])]
  const patterns = refs.map(
    (r) =>
      new RegExp(
        '^' +
          r
            .split(/\$\{[^}]*\}/)
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('[^/]+') +
          '$',
      ),
  )

  for (const level of levels) {
    const dir = join(from, level)
    const out = join(to, level)
    mkdirSync(out, { recursive: true })
    for (const name of SOURCE_FILES)
      if (existsSync(join(dir, name)))
        copyFileSync(join(dir, name), join(out, name))
    for (const name of SOURCE_DIRS)
      if (existsSync(join(dir, name)))
        copyTree(join(dir, name), join(out, name))

    const assets = join(dir, 'assets')
    if (!existsSync(assets)) continue
    if (lstatSync(assets).isSymbolicLink()) {
      symlinkSync(readlinkSync(assets), join(out, 'assets'))
      continue
    }
    for (const file of walk(assets)) {
      const rel = 'assets/' + relative(assets, file).split('\\').join('/')
      if (!patterns.some((p) => p.test(rel))) continue
      mkdirSync(dirname(join(out, rel)), { recursive: true })
      copyFileSync(file, join(out, rel))
    }
  }

  for (const ref of refs.filter((r) => !r.includes('${')))
    if (!existsSync(join(to, ref)))
      fail(
        `${relative(ROOT, to)}: a composition names ${ref}, which is missing`,
      )
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

function copyTree(from, to) {
  for (const file of walk(from)) {
    const target = join(to, relative(from, file))
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(file, target)
  }
}

writeFileSync(PRODUCTS_TS, ts)

const width = Math.max(...rows.map((r) => r[0].length))
for (const [name, size, budget, flag] of rows)
  console.log(
    `${name.padEnd(width)}  ${size.padStart(8)}${budget ? `  of ${budget}` : ''}  ${flag}`,
  )
console.log(
  `\n${ids.length} products, ${mb(total)} in public/assets/products/*/video/`,
)

if (errors.length) {
  console.error('\n' + errors.map((e) => `- ${e}`).join('\n'))
  process.exit(1)
}
