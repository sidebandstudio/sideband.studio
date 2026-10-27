// Server-only. Studio-level facts for /about, all derived from lib/products.ts,
// lib/engineers.ts and the GitHub snapshot.
import { engineers, type Engineer } from '@/lib/engineers'
import { getGithubUser } from '@/lib/github'
import {
  productRepo,
  products,
  rankedProducts,
  type Product,
} from '@/lib/products'
import { listJoin, MONTHS, parseYearMonth } from '@/lib/engineers-view'

export function studioFacts() {
  const repos = products.map(productRepo)
  return {
    products: products.length,
    live: products.filter((p) => p.status === 'LIVE').length,
    inDevelopment: products.filter((p) => p.status === 'IN DEVELOPMENT').length,
    openSource: repos.filter((r) => !r.isPrivate).length,
    stars: repos.reduce((sum, r) => sum + r.stars, 0),
    releases: repos.reduce((sum, r) => sum + r.releases, 0),
    downloads: repos.reduce((sum, r) => sum + r.downloads, 0),
    contributions: engineers.reduce(
      (sum, e) =>
        sum + (getGithubUser(e.githubLogin)?.contributions.total ?? 0),
      0,
    ),
    platforms: new Set(products.flatMap((p) => p.platforms)).size,
  }
}

/** A person's role at the studio, from their Sideband experience entry. */
export function sidebandRole(engineer: Engineer) {
  return engineer.experience?.find((x) => x.company === 'Sideband')
}

/**
 * Sort key for a date. A bare year has no month, so it sorts after the dated
 * events of that year and before the year's product summary.
 */
function order(ym: { year: number; month: number | null }) {
  return ym.year * 12 + (ym.month ?? 11.5)
}

export interface TimelineEvent {
  /** "Jan 2026", or a bare year. */
  date: string
  text: string
  /** Engineer or product ids the event links to. */
  engineer?: string
  /** Products named after the text, as links. */
  products?: { id: string; name: string }[]
  /** Closes the sentence after the products. Defaults to a full stop. */
  suffix?: string
}

export interface TimelineYear {
  year: number
  events: TimelineEvent[]
}

type YM = { year: number; month: number | null }

/** True only when a is known to come before b: a bare year is not before a date in it. */
function before(a: YM, b: YM) {
  if (a.year !== b.year) return a.year < b.year
  return a.month !== null && b.month !== null && a.month < b.month
}

/**
 * The studio's history: when it started, when each person joined, the
 * rename, and when each product began. Dates come from each person's
 * Sideband role and each product's repository (its creation month, when
 * that falls in the product's yearStarted). A product someone began before
 * they joined is told as that person starting it, not as studio work.
 */
export function studioTimeline(): TimelineYear[] {
  const roles = engineers
    .map((e) => ({ engineer: e, role: sidebandRole(e) }))
    .filter((r) => r.role)
    .map((r) => ({ ...r, ym: parseYearMonth(r.role!.startDate)! }))
    .sort((a, b) => order(a.ym) - order(b.ym))
  const [founder, ...joined] = roles

  const events: (TimelineEvent & { order: number; year: number })[] = []
  if (founder)
    events.push({
      date: founder.role!.startDate,
      year: founder.ym.year,
      // First in its year: the studio's start comes before anything in it.
      order: founder.ym.year * 12 - 0.5,
      // "It started as two of us", aliyounes.dev (people.md, Ali Younes 1.6).
      text: `${founder.engineer.name} and one other person start the studio in Boston as Eternal Reverse.`,
      engineer: founder.engineer.id,
    })
  for (const r of joined)
    events.push({
      date: r.role!.startDate,
      year: r.ym.year,
      order: order(r.ym),
      text: `${r.engineer.name} joins as ${r.role!.role}.`,
      engineer: r.engineer.id,
    })
  // The rename shipped in sidebandstudio/sideband.studio PR #22, merged 1 Sep 2026.
  events.push({
    date: 'Sep 2026',
    year: 2026,
    order: 2026 * 12 + 8,
    text: 'Eternal Reverse becomes Sideband, with a new studio site at sideband.studio.',
  })

  const joinedAt = new Map(roles.map((r) => [r.engineer.id, r.ym]))
  const nameOf = (id: string) => engineers.find((e) => e.id === id)?.name ?? id
  const started = new Map<
    string,
    { ym: YM; atStudio: boolean; builders: string[]; made: Product[] }
  >()
  for (const { product } of rankedProducts()) {
    const created = new Date(productRepo(product).createdAt)
    const ym: YM =
      created.getUTCFullYear() === product.yearStarted
        ? { year: product.yearStarted, month: created.getUTCMonth() }
        : { year: product.yearStarted, month: null }
    // Studio work once one of its builders had joined; otherwise their own project.
    const atStudio = product.engineers.some((id) => {
      const joined = joinedAt.get(id)
      return joined ? before(joined, ym) : false
    })
    const key = `${ym.year}-${ym.month}-${atStudio}-${atStudio ? '' : product.engineers.join()}`
    const entry = started.get(key)
    if (entry) entry.made.push(product)
    else
      started.set(key, {
        ym,
        atStudio,
        builders: product.engineers,
        made: [product],
      })
  }
  for (const { ym, atStudio, builders, made } of Array.from(started.values())) {
    const names = listJoin(builders.map(nameOf))
    events.push({
      date:
        ym.month === null ? String(ym.year) : `${MONTHS[ym.month]} ${ym.year}`,
      year: ym.year,
      order: order(ym),
      text: atStudio
        ? 'Work begins at the studio on'
        : `${names} ${builders.length === 1 ? 'starts' : 'start'}`,
      engineer: !atStudio && builders.length === 1 ? builders[0] : undefined,
      products: made.map((p) => ({ id: p.id, name: p.name })),
      suffix: atStudio
        ? undefined
        : made.length === 1
          ? ', now a Sideband product.'
          : ', now Sideband products.',
    })
  }

  events.sort((a, b) => a.order - b.order)
  const out: TimelineYear[] = []
  for (const { date, text, engineer, products: made, suffix, year } of events) {
    const event = { date, text, engineer, products: made, suffix }
    const bucket = out.find((y) => y.year === year)
    if (bucket) bucket.events.push(event)
    else out.push({ year, events: [event] })
  }
  return out.sort((a, b) => a.year - b.year)
}
