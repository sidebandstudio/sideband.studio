// Everything the home page shows, derived at build time from lib/products.ts,
// lib/engineers.ts and the GitHub snapshot. Server-only: it reads the snapshot,
// so call it from app/page.tsx and pass the plain results to client components.
import { engineers } from '@/lib/engineers'
import { getGithubUser, getRepo, githubOrg, githubSyncedAt } from '@/lib/github'
import {
  productLicense,
  productRepo,
  productsByRank,
  type Product,
  type ProductImage,
  type ProductImageCredit,
  type ProductImageKind,
  type ProductStatus,
} from '@/lib/products'
import { rankingMethod } from '@/lib/products-view'

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
]

/** "four", or the digits past twelve. Capitalise with `capital`. */
export function countWord(n: number, capital = false) {
  const word = WORDS[n] ?? String(n)
  return capital ? word[0].toUpperCase() + word.slice(1) : word
}

const fmt = (n: number) => n.toLocaleString('en-US')

/** Dates as the studio reads them, in Boston time. */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  }).format(new Date(iso))
}

export interface Figure {
  value: string
  label: string
}

/**
 * The one number that says most about a product: stars when people have
 * starred it, else release downloads, else how many platforms it ships on,
 * else its version, else its commits. Read from the repo the ranking reads.
 */
export function keyFigure(product: Product): Figure {
  const repo = productRepo(product)
  if (repo.stars > 0)
    return {
      value: fmt(repo.stars),
      label: repo.stars === 1 ? 'GitHub star' : 'GitHub stars',
    }
  if (repo.downloads > 0)
    return { value: fmt(repo.downloads), label: 'release downloads' }
  if (product.platforms.length > 1)
    return { value: String(product.platforms.length), label: 'platforms' }
  if (product.version) return { value: product.version, label: 'version' }
  return { value: fmt(repo.commits), label: 'commits' }
}

/** Up to three short facts for a featured product, strongest first. */
function productFacts(product: Product): string[] {
  const repo = productRepo(product)
  const facts: string[] = []
  if (repo.stars > 0) facts.push(`${fmt(repo.stars)} GitHub stars`)
  if (repo.downloads > 0) facts.push(`${fmt(repo.downloads)} downloads`)
  if (repo.latestRelease)
    facts.push(
      `${repo.latestRelease.tag} released ${formatDate(repo.latestRelease.date)}`,
    )
  else if (product.version) facts.push(`Version ${product.version}`)
  if (facts.length < 3) facts.push(`${fmt(repo.commits)} commits`)
  return facts.slice(0, 3)
}

/** The image a product is previewed with: its first desktop screenshot. */
function previewShot(product: Product): ProductImage {
  return (
    product.images.find(
      (img) => img.kind === 'screenshot' && img.device === 'desktop',
    ) ??
    product.images.find((img) => img.kind === 'screenshot') ??
    product.images[0]
  )
}

function siteLabel(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

// ---- Hero ----

export interface HeroItem {
  id: string
  name: string
  category: string
  status: ProductStatus
  icon: string
  shot: {
    src: string
    alt: string
    width: number
    height: number
    kind: ProductImageKind
    credit?: ProductImageCredit
  }
  figure: Figure
}

export interface HeroStat {
  value: string
  label: string
}

// ---- Products ----

export interface ShowcaseProduct {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  status: ProductStatus
  icon: string | null
  platforms: string[]
  facts: string[]
  figure: Figure
  site: { href: string; label: string } | null
}

// ---- Team ----

export interface TeamMember {
  id: string
  name: string
  role: string
  portrait: { src: string; width: number; height: number } | null
  initials: string
  builds: string
  products: { id: string; name: string }[]
  joined: string | null
  contributions: number | null
  github: string
}

/**
 * What each person builds, in one line. Each line restates a fact from that
 * person's entry in lib/engineers.ts (longBio or an experience entry). It is
 * their Sideband work where the data names any, and says so when it is not.
 */
const BUILDS: Record<string, string> = {
  'ali-younes':
    'Wrote the Rust host and Swift iPad client behind EternalMonitor, and the SwiftUI app and Node API behind Exerly Fitness.',
  'ali-tleis':
    'Builds the Python and Lua pipeline behind Eternal2x and owns AMD GPU support on EternalMonitor.',
  'karan-anand':
    'Works on systems design: architecture and technical planning for the product lineup.',
  'naman-rusia':
    'Built TandemCode, a pair-programming interview tool with a shared editor and a sandboxed judge.',
  'david-czartoryski':
    'Outside Sideband, builds cross-vendor GPU training systems, GPUBridge among them, at Northeastern’s HPC Research Lab.',
}

// ---- Open source ----

export interface OpenRepo {
  id: string
  name: string
  path: string
  href: string
  tagline: string
  license: string
  language: string | null
  stars: number
}

export interface StudioFact {
  value: string
  text: string
  href?: string
}

export function getHomeData() {
  const ranked = productsByRank()
  const repos = ranked.map(productRepo)
  const sum = (key: 'stars' | 'downloads' | 'commits' | 'releases') =>
    repos.reduce((total, repo) => total + repo[key], 0)

  const live = ranked.filter((p) => p.status === 'LIVE').length
  const teamContributions = engineers.reduce(
    (total, e) =>
      total + (getGithubUser(e.githubLogin)?.contributions.total ?? 0),
    0,
  )

  const stats: HeroStat[] = [
    { value: fmt(sum('stars')), label: 'GitHub stars on our product repos' },
    { value: fmt(sum('downloads')), label: 'Release downloads' },
    {
      value: String(live),
      label: `Products live, out of ${ranked.length} built`,
    },
    { value: fmt(sum('commits')), label: 'Commits across product repos' },
    {
      value: fmt(teamContributions),
      label: 'GitHub contributions by the team in the last year',
    },
  ]

  const hero: HeroItem[] = ranked
    .filter((p) => p.icon)
    .slice(0, 6)
    .map((p) => {
      const shot = previewShot(p)
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
        icon: p.icon!.src,
        shot: {
          src: shot.src,
          alt: shot.alt,
          width: shot.width,
          height: shot.height,
          kind: shot.kind,
          ...(shot.credit ? { credit: shot.credit } : {}),
        },
        figure: keyFigure(p),
      }
    })

  const showcase: ShowcaseProduct[] = ranked.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    status: p.status,
    icon: p.icon?.src ?? null,
    platforms: p.platforms,
    facts: productFacts(p),
    figure: keyFigure(p),
    site: p.links.site
      ? { href: p.links.site, label: siteLabel(p.links.site) }
      : null,
  }))

  const team: TeamMember[] = engineers.map((e) => {
    const sideband = e.experience?.find((x) => x.company === 'Sideband')
    return {
      id: e.id,
      name: e.name,
      role: e.role,
      portrait: e.portrait ?? null,
      initials: e.initials,
      builds: BUILDS[e.id] ?? e.shortBio,
      products: ranked
        .filter((p) => p.engineers.includes(e.id))
        .map((p) => ({ id: p.id, name: p.name })),
      joined: sideband?.startDate ?? null,
      contributions: getGithubUser(e.githubLogin)?.contributions.total ?? null,
      github: e.contact.github ?? `https://github.com/${e.githubLogin}`,
    }
  })

  const openRepos: OpenRepo[] = ranked.flatMap((p) => {
    const license = productLicense(p)
    const repo = getRepo(p.repo)
    if (!license.openSource || !p.links.repo || !repo) return []
    return [
      {
        id: p.id,
        name: p.name,
        path: p.links.repo.replace('https://github.com/', ''),
        href: p.links.repo,
        tagline: p.tagline,
        license: license.spdx ?? license.name,
        language: repo.primaryLanguage,
        stars: repo.stars,
      },
    ]
  })

  const released = ranked.filter((p) => productRepo(p).releases > 0)
  const latest = ranked
    .map((p) => ({ product: p, release: productRepo(p).latestRelease }))
    .filter((r) => r.release)
    .sort((a, b) => b.release!.date.localeCompare(a.release!.date))[0]
  const allPublic = ranked.every((p) => !productRepo(p).isPrivate)

  const studioFacts: StudioFact[] = [
    ...(allPublic
      ? [
          {
            value: String(ranked.length),
            text: 'Products, every one developed in a public repo on GitHub',
          },
        ]
      : []),
    {
      value: String(sum('releases')),
      text: `Releases published on GitHub, across ${released.length} products`,
    },
    ...(latest
      ? [
          {
            value: latest.release!.tag,
            text: `Latest release, ${latest.product.name} on ${formatDate(latest.release!.date)}`,
            href: latest.release!.url,
          },
        ]
      : []),
  ]

  return {
    syncedOn: formatDate(githubSyncedAt),
    engineerCount: engineers.length,
    productCount: ranked.length,
    stats,
    hero,
    showcase,
    team,
    openRepos,
    studioFacts,
    org: { url: githubOrg.url, login: githubOrg.login },
    ranking: rankingMethod,
  }
}

export type HomeData = ReturnType<typeof getHomeData>
