#!/usr/bin/env node
/**
 * Content consistency check.
 *
 * lib/engineers.ts and lib/products.ts are the single source of truth for how
 * many founders and products the studio has. Those counts are also written out
 * in prose all over the site ("Three founders.", "Six products.", "Four live,
 * two in active development."). This script re-derives the counts from the data
 * and fails if any prose disagrees — so adding an engineer or a product forces
 * the copy that mentions the count to be updated too.
 *
 * It also catches stale head-count phrasings generically: with three founders,
 * any "two-person studio" / "two founders" left behind is flagged, because the
 * number word no longer matches the source of truth.
 *
 * Extend it by adding a fact to FACTS below. See AGENT_NOTES.md → Single Source
 * of Truth.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]
const wordToNum = new Map(WORDS.map((w, i) => [w, i]))
const numToWord = (n) => WORDS[n] ?? String(n)

// --- Source of truth: counts derived from the data files ---
const engineersSrc = read('lib/engineers.ts')
const productsSrc = read('lib/products.ts')

// Top-level entries sit at exactly four-space indent; nested objects use other
// keys (school, company, src, …) or deeper indentation, so this counts entries.
const engineerCount = (engineersSrc.match(/^ {4}id: '/gm) || []).length
const productCount = (productsSrc.match(/^ {4}id: '/gm) || []).length
const liveCount = (productsSrc.match(/status: 'LIVE'/g) || []).length
const devCount = (productsSrc.match(/status: 'IN DEVELOPMENT'/g) || []).length

const preflight = []
if (engineerCount === 0)
  preflight.push(
    'Could not count engineers in lib/engineers.ts (entry format changed?)',
  )
if (productCount === 0)
  preflight.push(
    'Could not count products in lib/products.ts (entry format changed?)',
  )
if (liveCount + devCount !== productCount) {
  preflight.push(
    `Product status split (${liveCount} LIVE + ${devCount} IN DEVELOPMENT = ${liveCount + devCount}) ` +
      `does not equal ${productCount} total — a status value may be unrecognized. ` +
      `Update this script if a new ProductStatus was added.`,
  )
}

// --- Facts to verify in prose. Each regex captures the number word that
// precedes the noun; non-number words ("the founders", "our products") are
// skipped automatically. ---
const FACTS = [
  {
    label: 'founder count',
    expected: engineerCount,
    re: /\b([a-z]+)[- ](?:founders?|person|people|friends?)\b/gi,
  },
  {
    label: 'total product count',
    expected: productCount,
    re: /\b([a-z]+) products?\b/gi,
  },
  {
    label: 'live product count',
    expected: liveCount,
    re: /\b([a-z]+) live\b/gi,
  },
  {
    label: 'in-development product count',
    expected: devCount,
    re: /\b([a-z]+) in (?:active )?development\b/gi,
  },
]

// Historical references ("started from two founders", "began as a two-person
// team") describe the past, not the current count, and are exempt.
const HISTORICAL = /\b(?:started|began|grew|founded)\b[^.!?]{0,40}$/i
const isHistorical = (text, index) =>
  HISTORICAL.test(text.slice(Math.max(0, index - 60), index))

// --- Files to scan: everything user-facing, never the source-of-truth data. ---
const SCAN_DIRS = ['app', 'components', 'content']
const SCAN_FILES = ['README.md']
const EXT = new Set(['.tsx', '.ts', '.md'])

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

const files = [...SCAN_DIRS.flatMap(walk), ...SCAN_FILES]

const errors = []
for (const file of files) {
  read(file)
    .split('\n')
    .forEach((line, i) => {
      for (const fact of FACTS) {
        fact.re.lastIndex = 0
        let m
        while ((m = fact.re.exec(line))) {
          const word = m[1].toLowerCase()
          if (!wordToNum.has(word)) continue // "the founders", "our products" → not a claim
          if (isHistorical(line, m.index)) continue // past-tense origin copy, not a current count
          if (wordToNum.get(word) !== fact.expected) {
            errors.push({
              file,
              line: i + 1,
              text: m[0].trim(),
              claimed: word,
              expected: numToWord(fact.expected),
              label: fact.label,
            })
          }
        }
      }
    })
}

const summary = `${engineerCount} founders, ${productCount} products (${liveCount} live, ${devCount} in development)`

if (preflight.length) {
  console.error('✖ Consistency check could not run:')
  for (const e of preflight) console.error(`  - ${e}`)
  process.exit(2)
}

if (errors.length) {
  console.error(
    `✖ Content consistency check failed — ${errors.length} stale count${errors.length > 1 ? 's' : ''}\n`,
  )
  console.error(
    `Source of truth (lib/engineers.ts, lib/products.ts): ${summary}\n`,
  )
  for (const e of errors) {
    console.error(`  ${e.file}:${e.line}`)
    console.error(
      `    "${e.text}" — ${e.label} should be "${e.expected}", found "${e.claimed}"`,
    )
  }
  console.error(
    `\nUpdate the prose to match the data, or fix the data if the count itself is wrong.`,
  )
  console.error(`See AGENT_NOTES.md → Single Source of Truth.`)
  process.exit(1)
}

console.log(
  `✓ Consistency check passed — ${summary}, consistent across the site`,
)
