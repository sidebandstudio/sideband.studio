#!/usr/bin/env node
/**
 * GitHub snapshot sync.
 *
 * Writes lib/data/github.json: the sidebandstudio org, every product repo named
 * in lib/products.ts (`repo:` and `upstreamRepo:` keys), and the GitHub profile
 * of every engineer in lib/engineers.ts (`githubLogin:` keys). The site reads
 * this committed snapshot through lib/github.ts instead of calling GitHub at
 * request time (no token on Vercel, rate limits).
 *
 *   npm run sync:github
 *
 * Token: GITHUB_TOKEN, else `gh auth token`. Fails without one.
 *
 * The output is stable: object keys are sorted and every list has a fixed
 * order, so a second run with no upstream change only moves `syncedAt`.
 *
 * Privacy: the token belongs to an org owner, so GraphQL also returns private
 * org memberships. Org members and each user's organizations are filtered to
 * public memberships (REST public_members and /users/:login/orgs), the same
 * set a logged-out visitor sees. Contribution totals match the public profile.
 */
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'lib/data/github.json')
const ORG = 'sidebandstudio'
// Keyed by login, in roster order: every `githubLogin` in lib/engineers.ts.
const USERS = engineerLogins()

function fail(message) {
  console.error(`✖ sync:github: ${message}`)
  process.exit(1)
}

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim()
  try {
    const t = execSync('gh auth token', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (t) return t
  } catch {
    // fall through to the error below
  }
  fail('no token. Set GITHUB_TOKEN or log in with `gh auth login`.')
}

const TOKEN = token()
const HEADERS = {
  Authorization: `bearer ${TOKEN}`,
  'User-Agent': 'sideband-sync-github',
  Accept: 'application/vnd.github+json',
}

async function graphql(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  })
  const body = await res.json()
  if (!res.ok || body.errors) {
    fail(`GraphQL ${res.status}: ${JSON.stringify(body.errors ?? body)}`)
  }
  return body.data
}

async function rest(path) {
  const out = []
  for (let page = 1; ; page++) {
    const sep = path.includes('?') ? '&' : '?'
    const res = await fetch(
      `https://api.github.com${path}${sep}per_page=100&page=${page}`,
      { headers: HEADERS },
    )
    // 204: an empty repository has no contributors.
    if (res.status === 204) return out
    if (!res.ok) fail(`GET ${path} ${res.status}: ${await res.text()}`)
    const items = await res.json()
    out.push(...items)
    if (items.length < 100) return out
  }
}

/** The repo's LICENSE file as GitHub detects it, or null when there is none. */
async function licenseFile(key) {
  const res = await fetch(`https://api.github.com/repos/${key}/license`, {
    headers: HEADERS,
  })
  if (res.status === 404) return null
  if (!res.ok)
    fail(`GET /repos/${key}/license ${res.status}: ${await res.text()}`)
  const body = await res.json()
  return { path: body.path, url: body.html_url }
}

/** GitHub logins declared in lib/engineers.ts (`githubLogin:` keys). */
function engineerLogins() {
  const src = readFileSync(join(ROOT, 'lib/engineers.ts'), 'utf8')
  const logins = [...src.matchAll(/\bgithubLogin: '([\w-]+)'/g)].map(
    (m) => m[1],
  )
  if (logins.length === 0)
    fail('found no `githubLogin:` keys in lib/engineers.ts')
  return [...new Set(logins)]
}

/** Repo keys (`owner/name`) declared in lib/products.ts. */
function productRepoKeys() {
  const src = readFileSync(join(ROOT, 'lib/products.ts'), 'utf8')
  const keys = [
    ...src.matchAll(/\b(?:repo|upstreamRepo): '([\w.-]+\/[\w.-]+)'/g),
  ].map((m) => m[1])
  if (keys.length === 0) fail('found no `repo:` keys in lib/products.ts')
  return [...new Set(keys)].sort()
}

const byBytes = (a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name)

const REPO_FIELDS = `
  nameWithOwner
  name
  url
  homepageUrl
  description
  isFork
  isPrivate
  parent { nameWithOwner }
  stargazerCount
  forkCount
  watchers { totalCount }
  issues(states: OPEN) { totalCount }
  licenseInfo { spdxId name }
  repositoryTopics(first: 20) { nodes { topic { name } } }
  createdAt
  pushedAt
  primaryLanguage { name }
  languages(first: 50) { edges { size node { name } } }
  defaultBranchRef { name target { ... on Commit { history { totalCount } } } }
  latestRelease { tagName publishedAt url }
  releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
    totalCount
    nodes {
      tagName
      publishedAt
      url
      releaseAssets(first: 100) { totalCount nodes { downloadCount } }
    }
  }
`

async function syncRepos(keys) {
  const parts = keys.map((key, i) => {
    const [owner, name] = key.split('/')
    return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${REPO_FIELDS} }`
  })
  const data = await graphql(`query { ${parts.join('\n')} }`)

  const repos = {}
  for (const [i, key] of keys.entries()) {
    const r = data[`r${i}`]
    if (!r) fail(`repository ${key} not found or not visible to this token`)
    if (
      r.releases.totalCount > 100 ||
      r.releases.nodes.some((n) => n.releaseAssets.totalCount > 100)
    ) {
      fail(`${key} has more than 100 releases or assets. Add pagination.`)
    }
    const contributors = (await rest(`/repos/${key}/contributors`))
      .filter((c) => c.type === 'User')
      .map((c) => ({
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
        login: c.login,
      }))
      .sort(
        (a, b) =>
          b.contributions - a.contributions || a.login.localeCompare(b.login),
      )
    const newest = r.latestRelease ?? r.releases.nodes[0] ?? null
    repos[key] = {
      commits: r.defaultBranchRef?.target?.history?.totalCount ?? 0,
      contributors,
      createdAt: r.createdAt,
      defaultBranch: r.defaultBranchRef?.name ?? null,
      description: r.description ?? '',
      downloads: r.releases.nodes
        .flatMap((n) => n.releaseAssets.nodes)
        .reduce((sum, a) => sum + a.downloadCount, 0),
      forks: r.forkCount,
      homepage: r.homepageUrl || null,
      isFork: r.isFork,
      isPrivate: r.isPrivate,
      languages: r.languages.edges
        .map((e) => ({ bytes: e.size, name: e.node.name }))
        .sort(byBytes),
      latestRelease: newest
        ? { date: newest.publishedAt, tag: newest.tagName, url: newest.url }
        : null,
      license: r.licenseInfo?.spdxId ?? null,
      licenseFile: await licenseFile(key),
      licenseName: r.licenseInfo?.name ?? null,
      name: r.name,
      openIssues: r.issues.totalCount,
      parent: r.parent?.nameWithOwner ?? null,
      primaryLanguage: r.primaryLanguage?.name ?? null,
      pushedAt: r.pushedAt,
      releases: r.releases.totalCount,
      stars: r.stargazerCount,
      topics: r.repositoryTopics.nodes.map((n) => n.topic.name).sort(),
      url: r.url,
      watchers: r.watchers.totalCount,
    }
  }
  return repos
}

async function syncOrg() {
  const { organization: o } = await graphql(
    `
      query ($login: String!) {
        organization(login: $login) {
          login
          name
          avatarUrl
          url
          repositories(privacy: PUBLIC) {
            totalCount
          }
          membersWithRole(first: 100) {
            nodes {
              login
              name
              avatarUrl
            }
          }
        }
      }
    `,
    { login: ORG },
  )
  const visible = new Set(
    (await rest(`/orgs/${ORG}/public_members`)).map((m) => m.login),
  )
  return {
    avatarUrl: o.avatarUrl,
    login: o.login,
    members: o.membersWithRole.nodes
      .filter((m) => visible.has(m.login))
      .map((m) => ({ avatarUrl: m.avatarUrl, login: m.login, name: m.name }))
      .sort((a, b) => a.login.localeCompare(b.login)),
    name: o.name,
    publicRepos: o.repositories.totalCount,
    url: o.url,
  }
}

async function syncUser(login) {
  const owned = []
  let user
  let after = null
  do {
    const data = await graphql(
      `
        query ($login: String!, $after: String) {
          user(login: $login) {
            login
            name
            avatarUrl
            url
            bio
            company
            location
            websiteUrl
            twitterUsername
            createdAt
            followers {
              totalCount
            }
            following {
              totalCount
            }
            publicRepos: repositories(
              privacy: PUBLIC
              ownerAffiliations: OWNER
            ) {
              totalCount
            }
            owned: repositories(
              first: 100
              after: $after
              privacy: PUBLIC
              ownerAffiliations: OWNER
              isFork: false
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                stargazerCount
                languages(first: 50) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  nameWithOwner
                  name
                  isPrivate
                  description
                  stargazerCount
                  primaryLanguage {
                    name
                  }
                  url
                }
              }
            }
            organizations(first: 50) {
              nodes {
                login
                name
                avatarUrl
                url
              }
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  firstDay
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      { login, after },
    )
    if (!data.user) fail(`user ${login} not found`)
    user ??= data.user
    owned.push(...data.user.owned.nodes)
    after = data.user.owned.pageInfo.hasNextPage
      ? data.user.owned.pageInfo.endCursor
      : null
  } while (after)

  const langBytes = new Map()
  for (const repo of owned) {
    for (const e of repo.languages.edges) {
      langBytes.set(e.node.name, (langBytes.get(e.node.name) ?? 0) + e.size)
    }
  }
  const publicOrgs = new Set(
    (await rest(`/users/${login}/orgs`)).map((o) => o.login),
  )
  const cal = user.contributionsCollection.contributionCalendar
  return {
    avatarUrl: user.avatarUrl,
    bio: user.bio || null,
    blog: user.websiteUrl || null,
    company: user.company || null,
    contributions: {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          count: d.contributionCount,
          date: d.date,
          level: d.contributionLevel,
        })),
        firstDay: w.firstDay,
      })),
    },
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    languages: [...langBytes]
      .map(([name, bytes]) => ({ bytes, name }))
      .sort(byBytes),
    location: user.location || null,
    login: user.login,
    name: user.name || null,
    organizations: user.organizations.nodes
      .filter((o) => publicOrgs.has(o.login))
      .map((o) => ({
        avatarUrl: o.avatarUrl,
        login: o.login,
        name: o.name,
        url: o.url,
      }))
      .sort((a, b) => a.login.localeCompare(b.login)),
    pinned: user.pinnedItems.nodes
      .filter((p) => !p.isPrivate)
      .map((p) => ({
        description: p.description || null,
        language: p.primaryLanguage?.name ?? null,
        name: p.name,
        nameWithOwner: p.nameWithOwner,
        stars: p.stargazerCount,
        url: p.url,
      })),
    publicRepos: user.publicRepos.totalCount,
    stars: owned.reduce((sum, r) => sum + r.stargazerCount, 0),
    twitter: user.twitterUsername || null,
    url: user.url,
  }
}

/** JSON with object keys sorted at every depth, so diffs stay small. */
function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, stable(value[k])]),
    )
  }
  return value
}

const repoKeys = productRepoKeys()
const [org, repos, users] = await Promise.all([
  syncOrg(),
  syncRepos(repoKeys),
  Promise.all(USERS.map(syncUser)),
])

const snapshot = stable({
  org,
  repos,
  syncedAt: new Date().toISOString(),
  users: Object.fromEntries(users.map((u) => [u.login, u])),
})

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n')
console.log(
  `✓ sync:github wrote lib/data/github.json: ${repoKeys.length} repos, ${users.length} users, org ${org.login}`,
)
