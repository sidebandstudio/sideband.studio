// Server-only. Studio-level facts for /about, all derived from lib/products.ts,
// lib/engineers.ts and the GitHub snapshot.
import { engineers, type Engineer } from '@/lib/engineers'
import { getGithubUser } from '@/lib/github'
import { productRepo, products, rankedProducts } from '@/lib/products'
import { parseYearMonth } from '@/lib/engineers-view'

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
  products?: { id: string; name: string }[]
}

export interface TimelineYear {
  year: number
  events: TimelineEvent[]
}

/**
 * The studio's history: when it started, when each person joined, the
 * rename, and which products were started each year. Dates come from each
 * person's Sideband role and each product's yearStarted.
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
      order: order(founder.ym),
      text: `${founder.engineer.name} starts the studio in Boston as Eternal Reverse.`,
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

  const ranked = rankedProducts().map((r) => r.product)
  const years = Array.from(new Set(products.map((p) => p.yearStarted)))
  for (const year of years)
    events.push({
      date: String(year),
      year,
      // After the dated events of the same year.
      order: year * 12 + 12,
      text: 'Work begins on what are now Sideband products:',
      products: ranked
        .filter((p) => p.yearStarted === year)
        .map((p) => ({ id: p.id, name: p.name })),
    })

  events.sort((a, b) => a.order - b.order)
  const out: TimelineYear[] = []
  for (const { date, text, engineer, products: made, year } of events) {
    const event = { date, text, engineer, products: made }
    const bucket = out.find((y) => y.year === year)
    if (bucket) bucket.events.push(event)
    else out.push({ year, events: [event] })
  }
  return out.sort((a, b) => a.year - b.year)
}
