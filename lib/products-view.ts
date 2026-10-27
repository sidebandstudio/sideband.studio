// Plain data for the products index and product pages, derived from
// lib/products.ts and the GitHub snapshot. Server-side only: it reads the
// snapshot, so import it from server components and pass the results down as
// props. Never import it into a 'use client' file.
import { engineers } from '@/lib/engineers'
import { formatDate } from '@/lib/format'
import { githubSyncedAt } from '@/lib/github'
import {
  productLicense,
  productRepo,
  rankedProducts,
  RANKING_POPULARITY_INPUTS,
  RANKING_SCOPE_INPUTS,
  RANKING_WEIGHTS,
  type ProductRankInputs,
  type Product,
  type ProductFeature,
  type ProductImage,
  type ProductImageKind,
  type ProductLicense,
  type RankedProduct,
} from '@/lib/products'

export function formatCount(n: number) {
  return n.toLocaleString('en-US')
}

/** Code size in decimal units, as GitHub counts language bytes. */
export function formatBytes(bytes: number) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${Math.round(bytes / 1e3)} KB`
}

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

/** A count as a word up to twenty, digits above. */
export function numberWord(n: number) {
  return WORDS[n] ?? String(n)
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** The snapshot date every figure on these pages comes from. */
export const syncedLabel = formatDate(githubSyncedAt)

export interface ContributorView {
  login: string
  avatarUrl: string
  contributions: number
  /** The engineer's page when the contributor is one of Sideband's engineers. */
  href: string
  internal: boolean
}

export interface LanguageView {
  name: string
  bytes: number
  /** Share of the repo's code, 0 to 1. */
  share: number
}

export interface ProductFacts {
  /** `owner/name` of the repo the numbers come from. */
  repoKey: string
  repoUrl: string
  /** True when the numbers come from the upstream repo the product is built in. */
  readsUpstream: boolean
  stars: number
  forks: number
  downloads: number
  commits: number
  codeBytes: number
  releases: number
  latestRelease: { tag: string; date: string; url: string } | null
  languages: LanguageView[]
  contributors: ContributorView[]
  createdAt: string
  pushedAt: string
  license: ProductLicense
}

function engineerForLogin(login: string) {
  return engineers.find(
    (e) => e.githubLogin.toLowerCase() === login.toLowerCase(),
  )
}

/** Up to four named languages, the rest grouped as Other. */
function languageShares(languages: { name: string; bytes: number }[]) {
  const total = languages.reduce((sum, l) => sum + l.bytes, 0)
  if (total === 0) return []
  const named = languages.slice(0, 4)
  const rest = languages.slice(4).reduce((sum, l) => sum + l.bytes, 0)
  const rows = rest > 0 ? [...named, { name: 'Other', bytes: rest }] : named
  return rows.map((l) => ({ ...l, share: l.bytes / total }))
}

export function productFacts(product: Product): ProductFacts {
  const repo = productRepo(product)
  const repoKey = product.upstreamRepo ?? product.repo
  return {
    repoKey,
    repoUrl: repo.url,
    readsUpstream: Boolean(product.upstreamRepo),
    stars: repo.stars,
    forks: repo.forks,
    downloads: repo.downloads,
    commits: repo.commits,
    codeBytes: repo.languages.reduce((sum, l) => sum + l.bytes, 0),
    releases: repo.releases,
    latestRelease: repo.latestRelease,
    languages: languageShares(repo.languages),
    contributors: repo.contributors.map((c) => {
      const engineer = engineerForLogin(c.login)
      return {
        login: c.login,
        avatarUrl: c.avatarUrl,
        contributions: c.contributions,
        href: engineer
          ? `/engineers/${engineer.id}`
          : `https://github.com/${c.login}`,
        internal: Boolean(engineer),
      }
    }),
    createdAt: repo.createdAt,
    pushedAt: repo.pushedAt,
    license: productLicense(product),
  }
}

export interface ProductAction {
  kind: 'download' | 'store' | 'site' | 'docs' | 'repo'
  href: string
  label: string
}

function hostOf(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

function storeLabel(url: string) {
  const host = hostOf(url)
  if (host === 'testflight.apple.com') return 'Join the TestFlight beta'
  if (host === 'chromewebstore.google.com') return 'Add from Chrome Web Store'
  if (host === 'apps.apple.com') return 'View on the App Store'
  return 'Get it from the store'
}

function downloadLabel(url: string) {
  return hostOf(url) === 'github.com' ? 'Download from GitHub' : 'Download'
}

/**
 * Every action the product's links allow, the one to take first at the top:
 * a download, then a store listing, then the site, then the source.
 */
export function productActions(product: Product): ProductAction[] {
  const { links } = product
  const actions: ProductAction[] = []
  if (links.download)
    actions.push({
      kind: 'download',
      href: links.download,
      label: downloadLabel(links.download),
    })
  if (links.store)
    actions.push({
      kind: 'store',
      href: links.store,
      label: storeLabel(links.store),
    })
  if (links.site)
    actions.push({ kind: 'site', href: links.site, label: 'Visit the site' })
  if (links.docs)
    actions.push({ kind: 'docs', href: links.docs, label: 'Read the docs' })
  if (links.repo)
    actions.push({ kind: 'repo', href: links.repo, label: 'Source on GitHub' })
  return actions
}

/** The product's engineers, in the order the data lists them. */
export function productEngineers(product: Product) {
  return product.engineers.flatMap((id) => {
    const engineer = engineers.find((e) => e.id === id)
    return engineer ? [engineer] : []
  })
}

const KIND_SINGULAR: Record<ProductImageKind, string> = {
  screenshot: 'screenshot',
  artwork: 'piece of artwork',
  photo: 'photo',
}

const KIND_PLURAL: Record<ProductImageKind, string> = {
  screenshot: 'screenshots',
  artwork: 'pieces of artwork',
  photo: 'photos',
}

const KIND_ORDER: ProductImageKind[] = ['screenshot', 'artwork', 'photo']

/**
 * A heading for a set of images that names what is in it: "Screenshots" only
 * when every image is one, otherwise each kind present.
 */
export function imageSetTitle(images: ProductImage[]) {
  const kinds = KIND_ORDER.filter((k) => images.some((i) => i.kind === k))
  const names = kinds.map((k) => {
    if (k === 'screenshot') return 'screenshots'
    if (k === 'artwork') return 'artwork'
    return images.filter((i) => i.kind === 'photo').length === 1
      ? 'a photo'
      : 'photos'
  })
  const title =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
  return capitalize(title)
}

/** "6 screenshots, 1 piece of artwork and 1 photo". */
export function imageSetCount(images: ProductImage[]) {
  const parts = KIND_ORDER.flatMap((k) => {
    const n = images.filter((i) => i.kind === k).length
    if (n === 0) return []
    return [`${n} ${n === 1 ? KIND_SINGULAR[k] : KIND_PLURAL[k]}`]
  })
  return parts.length === 1
    ? parts[0]
    : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

export interface RankingSummary {
  ranked: RankedProduct[]
  live: number
  inDevelopment: number
  openSource: number
  stars: number
  downloads: number
  commits: number
}

/** The ranked list and totals across it, for the products index. */
export function rankingSummary(): RankingSummary {
  const ranked = rankedProducts()
  const sum = (pick: (r: RankedProduct) => number) =>
    ranked.reduce((total, r) => total + pick(r), 0)
  return {
    ranked,
    live: ranked.filter((r) => r.product.status === 'LIVE').length,
    inDevelopment: ranked.filter((r) => r.product.status === 'IN DEVELOPMENT')
      .length,
    openSource: ranked.filter((r) => productLicense(r.product).openSource)
      .length,
    stars: sum((r) => r.inputs.stars),
    downloads: sum((r) => r.inputs.downloads),
    commits: sum((r) => r.inputs.commits),
  }
}

/** "a, b and c". */
export function listText(items: readonly string[]) {
  return items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** What each ranking input measures, in words. */
const INPUT_LABEL: Record<keyof ProductRankInputs, string> = {
  stars: 'GitHub stars',
  forks: 'forks',
  downloads: 'release downloads',
  codeBytes: 'code size',
  commits: 'commits',
  contributors: 'contributors',
  platforms: 'platforms',
}

/**
 * The ranking formula from lib/products.ts in words and figures, so the
 * prose that explains it cannot drift from the code that computes it.
 */
export const rankingMethod = {
  popularityInputs: listText(
    RANKING_POPULARITY_INPUTS.map((k) => INPUT_LABEL[k]),
  ),
  scopeInputs: listText(RANKING_SCOPE_INPUTS.map((k) => INPUT_LABEL[k])),
  popularityWeight: RANKING_WEIGHTS.popularity,
  scopeWeight: RANKING_WEIGHTS.scope,
  popularityPercent: `${Math.round(RANKING_WEIGHTS.popularity * 100)}%`,
  scopePercent: `${Math.round(RANKING_WEIGHTS.scope * 100)}%`,
}

export interface StoryRow {
  feature: ProductFeature
  /** Index into product.images. */
  image: number
}

export interface ProductStory {
  /** The image shown right after the hero: the first screenshot. */
  lead: number
  /** The feature the lead image shows, when one is paired with it. */
  leadFeature: ProductFeature | null
  /** Other features paired with the image that shows them, in feature order. */
  rows: StoryRow[]
  /** Features no image shows. */
  plain: ProductFeature[]
  /** Images neither the lead nor paired with a feature, in data order. */
  rest: number[]
}

/**
 * How a product page tells its story, from the data alone: the lead image,
 * the features that sit beside the image that shows them, the features that
 * stand on their own, and the images left for the gallery. Fails the build if
 * a feature names an image the product does not list, or two features share
 * one image.
 */
export function productStory(product: Product): ProductStory {
  const { images, features } = product
  const indexOf = (src: string) => {
    const i = images.findIndex((image) => image.src === src)
    if (i === -1)
      throw new Error(
        `${product.id}: feature image ${src} is not one of the product's images.`,
      )
    return i
  }
  const used = new Set<number>()
  const paired = features.flatMap((feature) => {
    if (!feature.image) return []
    const image = indexOf(feature.image)
    if (used.has(image))
      throw new Error(
        `${product.id}: ${feature.image} is paired with more than one feature.`,
      )
    used.add(image)
    return [{ feature, image }]
  })

  const first = images.findIndex((image) => image.kind === 'screenshot')
  const lead = first === -1 ? 0 : first
  const leadRow = paired.find((row) => row.image === lead)

  return {
    lead,
    leadFeature: leadRow?.feature ?? null,
    rows: paired.filter((row) => row !== leadRow),
    plain: features.filter((feature) => !feature.image),
    rest: images.map((_, i) => i).filter((i) => i !== lead && !used.has(i)),
  }
}

/** Whether an image reads as landscape on the page. */
export function isWideImage(image: ProductImage) {
  return image.width / image.height >= 1.25
}
