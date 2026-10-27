// Server-only. Turns the GitHub snapshot into the plain props the engineer
// pages render. Never import this from a 'use client' file: it pulls in the
// whole snapshot (lib/data/github.json).
import {
  getGithubUser,
  githubSyncedAt,
  type ContributionLevel,
  type GithubUser,
} from '@/lib/github'
import { engineers, type Engineer } from '@/lib/engineers'

export interface CalendarDay {
  date: string
  count: number
  level: ContributionLevel
}

/** One column of the graph: Sunday to Saturday. The first and last weeks may be short. */
export type CalendarWeek = CalendarDay[]

export interface ContributionSummary {
  total: number
  firstDay: string
  lastDay: string
  activeDays: number
  longestStreak: number
  busiest: { date: string; count: number } | null
}

export interface LanguageShare {
  name: string
  bytes: number
  /** Share of all bytes, 0 to 1. */
  share: number
}

export interface EngineerGithub {
  login: string
  name: string | null
  url: string
  avatarUrl: string
  bio: string | null
  followers: number
  following: number
  publicRepos: number
  stars: number
  createdAt: string
  weeks: CalendarWeek[]
  summary: ContributionSummary
  languages: LanguageShare[]
  pinned: GithubUser['pinned']
  organizations: GithubUser['organizations']
}

export function summarize(weeks: CalendarWeek[]): ContributionSummary {
  const days = weeks.flat()
  let longest = 0
  let run = 0
  let busiest: ContributionSummary['busiest'] = null
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
    if (d.count > 0 && (!busiest || d.count > busiest.count))
      busiest = { date: d.date, count: d.count }
  }
  return {
    total: days.reduce((sum, d) => sum + d.count, 0),
    firstDay: days[0]?.date ?? '',
    lastDay: days[days.length - 1]?.date ?? '',
    activeDays: days.filter((d) => d.count > 0).length,
    longestStreak: longest,
    busiest,
  }
}

function shares(languages: GithubUser['languages']): LanguageShare[] {
  const total = languages.reduce((sum, l) => sum + l.bytes, 0)
  return languages.map((l) => ({
    ...l,
    share: total === 0 ? 0 : l.bytes / total,
  }))
}

export function engineerGithub(engineer: Engineer): EngineerGithub | null {
  const user = getGithubUser(engineer.githubLogin)
  if (!user) return null
  const weeks = user.contributions.weeks.map((w) => w.days)
  return {
    login: user.login,
    name: user.name,
    url: user.url,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    publicRepos: user.publicRepos,
    stars: user.stars,
    createdAt: user.createdAt,
    weeks,
    summary: summarize(weeks),
    languages: shares(user.languages),
    pinned: user.pinned,
    organizations: user.organizations,
  }
}

const LEVELS: ContributionLevel[] = [
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
]

/**
 * Every engineer's calendar added day by day. Levels are recomputed on the
 * combined counts the way GitHub does it: quartiles of the active days.
 */
export function teamCalendar(): {
  weeks: CalendarWeek[]
  summary: ContributionSummary
  people: { id: string; name: string; accent: string; total: number }[]
} {
  const users = engineers
    .map((e) => ({ engineer: e, user: getGithubUser(e.githubLogin) }))
    .filter((r): r is { engineer: Engineer; user: GithubUser } => !!r.user)

  const counts = new Map<string, number>()
  for (const { user } of users)
    for (const w of user.contributions.weeks)
      for (const d of w.days)
        counts.set(d.date, (counts.get(d.date) ?? 0) + d.count)

  const active = Array.from(counts.values())
    .filter((c) => c > 0)
    .sort((a, b) => a - b)
  const quartile = (q: number) =>
    active[Math.min(active.length - 1, Math.floor(active.length * q))] ?? 0
  const cuts = [quartile(0.25), quartile(0.5), quartile(0.75)]
  const level = (c: number): ContributionLevel =>
    c === 0 ? 'NONE' : LEVELS[cuts.filter((cut) => c > cut).length]

  // Every user's calendar covers the same year, so the first one is the grid.
  const weeks = (users[0]?.user.contributions.weeks ?? []).map((w) =>
    w.days.map((d) => {
      const count = counts.get(d.date) ?? 0
      return { date: d.date, count, level: level(count) }
    }),
  )

  return {
    weeks,
    summary: summarize(weeks),
    people: users.map(({ engineer, user }) => ({
      id: engineer.id,
      name: engineer.name,
      accent: engineer.accentColor,
      total: user.contributions.total,
    })),
  }
}

/** Weekly totals, oldest first, for small sparklines. */
export function weeklyTotals(weeks: CalendarWeek[]): number[] {
  return weeks.map((w) => w.reduce((sum, d) => sum + d.count, 0))
}

const dayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const monthFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "Oct 27, 2026". Accepts a date (2026-10-27) or a timestamp. */
export function formatDay(iso: string): string {
  return dayFormat.format(
    new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso),
  )
}

/** "Feb 2024". */
export function formatMonth(iso: string): string {
  return monthFormat.format(new Date(iso))
}

/** The date the snapshot was taken, as shown next to every GitHub figure. */
export const syncedLabel = formatDay(githubSyncedAt)

/** Whole years between the account's creation and the snapshot, e.g. "2 years". */
export function accountAge(createdAt: string): string {
  const from = new Date(createdAt)
  const to = new Date(githubSyncedAt)
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  if (to.getUTCDate() < from.getUTCDate()) months -= 1
  const years = Math.floor(months / 12)
  if (years >= 1) return `${years} ${years === 1 ? 'year' : 'years'}`
  return `${months} ${months === 1 ? 'month' : 'months'}`
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}
