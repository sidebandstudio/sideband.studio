#!/usr/bin/env node
/**
 * Copy style check: user-facing text uses no em dashes and no semicolons.
 *
 * "User-facing text" means what can render on the site: string literals,
 * template literal text, and JSX text in app/, components/, lib/, and tests/,
 * plus prose in content/ markdown. Code itself is exempt by construction
 * (statement semicolons never live inside those nodes) and so are code
 * comments, which may keep em dashes.
 *
 * Allowed and stripped before the semicolon check: HTML entities such as
 * &middot; or &#8594;, and the acronym TL;DR, whose semicolon is spelling,
 * not punctuation. En dashes stay allowed (date ranges use them).
 *
 * Runs in CI as `npm run check:copy`. See PR.md -> Copy Style.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SCAN_DIRS = ['app', 'components', 'lib', 'content', 'tests']
const EXT = new Set(['.ts', '.tsx', '.md'])

const problems = []
const report = (file, line, rule, text) => {
  const excerpt = text.trim().replace(/\s+/g, ' ').slice(0, 70)
  problems.push(`${file}:${line}: ${rule}: "${excerpt}"`)
}

const stripAllowed = (text) =>
  text.replace(/&[a-zA-Z]+\d*;|&#\d+;/g, '').replace(/TL;DR/g, 'TLDR')

function checkChunk(file, line, text) {
  if (text.includes('—')) report(file, line, 'em dash in copy', text)
  if (stripAllowed(text).includes(';')) report(file, line, 'semicolon in copy', text)
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(join(ROOT, dir))) {
    if (name === 'node_modules' || name === '.next') continue
    const rel = join(dir, name)
    if (statSync(join(ROOT, rel)).isDirectory()) out.push(...walk(rel))
    else if (EXT.has(extname(name))) out.push(rel)
  }
  return out
}

function checkTsFile(rel, src) {
  const kind = rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
  const visit = (node) => {
    const isText =
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node)
    if (isText && node.text) {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
      checkChunk(rel, line + 1, node.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

function checkMdFile(rel, src) {
  let inFence = false
  src.split('\n').forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    checkChunk(rel, i + 1, raw.replace(/`[^`]*`/g, ''))
  })
}

let fileCount = 0
for (const dir of SCAN_DIRS) {
  for (const rel of walk(dir)) {
    fileCount += 1
    const src = readFileSync(join(ROOT, rel), 'utf8')
    if (rel.endsWith('.md')) checkMdFile(rel, src)
    else checkTsFile(rel, src)
  }
}

if (problems.length > 0) {
  console.error(`Copy style check failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):\n`)
  for (const p of problems) console.error(`  ${p}`)
  console.error('\nUser-facing copy must not contain em dashes or semicolons. See PR.md -> Copy Style.')
  process.exit(1)
}
console.log(`Copy style OK: ${fileCount} files scanned, no em dashes or semicolons in user-facing text.`)
