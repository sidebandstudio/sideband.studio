// Typed access to the committed GitHub snapshot. Regenerate the data with
// `npm run sync:github` (scripts/sync-github.mjs). Nothing here calls GitHub.
import snapshot from '@/lib/data/github.json'

export interface GithubLanguage {
  name: string
  bytes: number
}

export interface GithubContributor {
  login: string
  avatarUrl: string
  contributions: number
}

export interface GithubRelease {
  tag: string
  date: string
  url: string
}

export interface GithubRepo {
  name: string
  url: string
  homepage: string | null
  description: string
  isFork: boolean
  isPrivate: boolean
  /** `owner/name` of the upstream repo when this is a GitHub fork. */
  parent: string | null
  stars: number
  forks: number
  watchers: number
  openIssues: number
  license: string | null
  topics: string[]
  createdAt: string
  pushedAt: string
  primaryLanguage: string | null
  /** Sorted by bytes, largest first. */
  languages: GithubLanguage[]
  defaultBranch: string | null
  /** Commits on the default branch. */
  commits: number
  /** Users only, bots excluded, most contributions first. */
  contributors: GithubContributor[]
  releases: number
  latestRelease: GithubRelease | null
  /** Sum of download counts over every release asset. */
  downloads: number
}

export type ContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE'

export interface ContributionDay {
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionWeek {
  firstDay: string
  days: ContributionDay[]
}

export interface GithubPinnedRepo {
  name: string
  nameWithOwner: string
  description: string | null
  stars: number
  language: string | null
  url: string
}

export interface GithubOrgRef {
  login: string
  name: string | null
  avatarUrl: string
  url: string
}

export interface GithubUser {
  login: string
  name: string | null
  avatarUrl: string
  url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  twitter: string | null
  followers: number
  following: number
  publicRepos: number
  createdAt: string
  /** Stars across the user's own public, non-fork repos. */
  stars: number
  /** Last year, as on the public profile. */
  contributions: { total: number; weeks: ContributionWeek[] }
  /** Bytes across the user's own public, non-fork repos, largest first. */
  languages: GithubLanguage[]
  pinned: GithubPinnedRepo[]
  /** Public memberships only. */
  organizations: GithubOrgRef[]
}

export interface GithubOrg {
  login: string
  name: string
  avatarUrl: string
  url: string
  publicRepos: number
  /** Public members only. */
  members: { login: string; name: string | null; avatarUrl: string }[]
}

export interface GithubSnapshot {
  syncedAt: string
  org: GithubOrg
  repos: Record<string, GithubRepo>
  users: Record<string, GithubUser>
}

export const github = snapshot as GithubSnapshot

export const githubSyncedAt = github.syncedAt
export const githubOrg = github.org

/** A repo by its `owner/name` key, as used in lib/products.ts. */
export function getRepo(key: string): GithubRepo | undefined {
  return github.repos[key]
}

/** A user by GitHub login, as used by `githubLogin` in lib/engineers.ts. */
export function getGithubUser(login: string): GithubUser | undefined {
  return github.users[login]
}

/** Total bytes across a repo's languages. */
export function repoCodeBytes(repo: GithubRepo): number {
  return repo.languages.reduce((sum, l) => sum + l.bytes, 0)
}
