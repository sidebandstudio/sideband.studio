// Server-only. Shapes lib/engineers.ts and lib/products.ts into what the
// engineer, about and contact pages render: grouped experience, durations,
// published links, and the products each person builds.
import { githubSyncedAt } from '@/lib/github'
import {
  type Engineer,
  type ExperienceEntry,
  type ExperienceStint,
  type FeaturedProject,
} from '@/lib/engineers'
import { productsByRank, type Product } from '@/lib/products'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

interface YearMonth {
  year: number
  /** 0 to 11, or null when only the year is published. */
  month: number | null
}

/** "Jul 2027" or "2025". "Present" and anything else return null. */
export function parseYearMonth(value: string | undefined): YearMonth | null {
  if (!value) return null
  const m = value.match(/^(?:([A-Z][a-z]{2})\s+)?(\d{4})$/)
  if (!m) return null
  const month = m[1] ? MONTHS.indexOf(m[1]) : -1
  return { year: Number(m[2]), month: month === -1 ? null : month }
}

const snapshot = new Date(githubSyncedAt)
const NOW: YearMonth = {
  year: snapshot.getUTCFullYear(),
  month: snapshot.getUTCMonth(),
}

const ordinal = (ym: YearMonth) => ym.year * 12 + (ym.month ?? 0)

/** "Jun 2026 – Sep 2026", "Jan 2026 – Present", or "From Jul 2027". */
export function dateRange(start: string, end?: string): string {
  if (!end) return `From ${start}`
  return `${start} – ${end}`
}

/**
 * Length of one continuous period, counting both end months the way resumes
 * do ("4 mos", "1 yr 2 mos"). Ongoing periods run to the snapshot date. Null
 * when a date has no month or the period has not started. Call it once per
 * stint: a role someone left and came back to is never measured across the gap.
 */
export function duration(start: string, end?: string): string | null {
  const from = parseYearMonth(start)
  const to = end === 'Present' ? NOW : parseYearMonth(end)
  if (!from || !to || from.month === null || to.month === null) return null
  const months = ordinal(to) - ordinal(from) + 1
  if (months <= 0) return null
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = [
    y ? `${y} ${y === 1 ? 'yr' : 'yrs'}` : '',
    m ? `${m} ${m === 1 ? 'mo' : 'mos'}` : '',
  ]
  return parts.filter(Boolean).join(' ')
}

/** The periods a role was held, newest first: its stints, or its one date range. */
export function periods(role: ExperienceEntry): ExperienceStint[] {
  return role.stints ?? [{ startDate: role.startDate, endDate: role.endDate }]
}

export interface ExperienceGroup {
  /** The organisation: the roles' `org`, or their company name. */
  company: string
  companyUrl?: string
  logo?: string
  logoOnDark?: boolean
  roles: ExperienceEntry[]
  /** The dated span of the group, without the gaps between roles. */
  span: string
}

/** Earliest start to latest end across dated periods, then any incoming start. */
function groupSpan(roles: ExperienceEntry[]): string {
  const all = roles.flatMap(periods)
  const dated = all.filter((p) => p.endDate)
  const incoming = all.filter((p) => !p.endDate)
  const starts = dated
    .map((p) => ({ raw: p.startDate, ym: parseYearMonth(p.startDate) }))
    .filter((x) => x.ym)
    .sort((a, b) => ordinal(a.ym!) - ordinal(b.ym!))
  const ends = dated.map((p) => p.endDate!)
  const end = ends.includes('Present')
    ? 'Present'
    : ends
        .map((raw) => ({ raw, ym: parseYearMonth(raw) }))
        .filter((x) => x.ym)
        .sort((a, b) => ordinal(b.ym!) - ordinal(a.ym!))[0]?.raw
  const parts: string[] = []
  if (starts[0] && end) parts.push(dateRange(starts[0].raw, end))
  for (const p of incoming) parts.push(`incoming ${p.startDate}`)
  return parts.join(', ')
}

/**
 * Roles grouped by organisation in the order the data lists them, so a run
 * of dated roles at one place (promotions, parallel roles, a later return
 * under the parent company) reads as one entry. A group takes the position
 * of its newest role.
 */
export function groupExperience(entries: ExperienceEntry[]): ExperienceGroup[] {
  const groups: (Omit<ExperienceGroup, 'span'> & { span?: string })[] = []
  for (const entry of entries) {
    const name = entry.org ?? entry.company
    const group = groups.find((g) => g.company === name)
    if (group) group.roles.push(entry)
    else
      groups.push({
        company: name,
        companyUrl: entry.companyUrl,
        logo: entry.logo,
        logoOnDark: entry.logoOnDark,
        roles: [entry],
      })
  }
  return groups.map((g) => ({
    ...g,
    companyUrl: g.companyUrl ?? g.roles.find((r) => r.companyUrl)?.companyUrl,
    logo: g.logo ?? g.roles.find((r) => r.logo)?.logo,
    span: groupSpan(g.roles),
  }))
}

export interface PublishedLink {
  label: string
  /** What the link shows: a handle, a host or an address. */
  value: string
  href: string
  external: boolean
}

const host = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

const handle = (url: string) =>
  '@' + url.replace(/\/$/, '').split('/').pop()!.replace(/^@/, '')

/** Every link the person publishes, in a fixed order, with a plain label. */
export function publishedLinks(engineer: Engineer): PublishedLink[] {
  const c = engineer.contact
  const links: PublishedLink[] = []
  if (c.github)
    links.push({
      label: 'GitHub',
      value: handle(c.github),
      href: c.github,
      external: true,
    })
  if (c.linkedin)
    links.push({
      label: 'LinkedIn',
      value: host(c.linkedin),
      href: c.linkedin,
      external: true,
    })
  if (c.website)
    links.push({
      label: 'Portfolio',
      value: host(c.website),
      href: c.website,
      external: true,
    })
  if (c.x)
    links.push({ label: 'X', value: handle(c.x), href: c.x, external: true })
  if (c.instagram)
    links.push({
      label: 'Instagram',
      value: handle(c.instagram),
      href: c.instagram,
      external: true,
    })
  if (c.tiktok)
    links.push({
      label: 'TikTok',
      value: handle(c.tiktok),
      href: c.tiktok,
      external: true,
    })
  links.push({
    label: 'Email',
    value: c.email,
    href: `mailto:${c.email}`,
    external: false,
  })
  if (c.resume)
    links.push({
      label: 'Resume',
      value: 'PDF',
      href: c.resume,
      external: true,
    })
  return links
}

/** The Sideband products a person builds, in ranked order. */
export function productsBy(engineerId: string): Product[] {
  return productsByRank().filter((p) => p.engineers.includes(engineerId))
}

export interface ProjectGroups {
  /** Projects that are Sideband products, each with its product. */
  studio: { project: FeaturedProject; product: Product }[]
  featured: FeaturedProject[]
  /** The person's own ventures, which the data marks as outside Sideband. */
  ventures: FeaturedProject[]
  other: FeaturedProject[]
}

/** The data words a person's own venture "His own venture ..." in its blurb. */
export function isOwnVenture(project: FeaturedProject): boolean {
  return /^\w+ own venture\b/i.test(project.blurb)
}

/** Splits a person's projects: Sideband products first, then their featured work, their own ventures, then the rest. */
export function groupProjects(projects: FeaturedProject[] = []): ProjectGroups {
  const ranked = productsByRank()
  const studio = projects
    .map((project) => ({
      project,
      product: ranked.find((p) => p.id === project.productId),
    }))
    .filter((r): r is { project: FeaturedProject; product: Product } =>
      Boolean(r.product),
    )
    .sort((a, b) => ranked.indexOf(a.product) - ranked.indexOf(b.product))
  const inStudio = new Set(studio.map((s) => s.project))
  const rest = projects.filter((p) => !inStudio.has(p))
  return {
    studio,
    featured: rest.filter((p) => p.featured),
    ventures: rest.filter((p) => !p.featured && isOwnVenture(p)),
    other: rest.filter((p) => !p.featured && !isOwnVenture(p)),
  }
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
]

/** "A", "A and B", "A, B and C". */
export function listJoin(items: string[]): string {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** A count as a word ("five"), so prose that names a number follows the data. */
export function countWord(n: number): string {
  return WORDS[n] ?? String(n)
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** First name, for headings such as "About Ali". */
export function firstName(engineer: Engineer): string {
  return engineer.name.split(' ')[0]
}
