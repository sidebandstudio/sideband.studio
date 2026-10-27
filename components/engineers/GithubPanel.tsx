import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowUpRightIcon, GitHubIcon } from '@/components/ui/Icons'
import {
  accountAge,
  formatCount,
  formatDay,
  formatMonth,
  syncedLabel,
  type EngineerGithub,
  type LanguageShare,
} from '@/lib/engineers-github'
import { cx } from '@/components/ui/cx'
import ContributionGraph from './ContributionGraph'

/** Language shares from the accent down to grey, largest first. */
const SHADES = [100, 72, 50, 34, 22, 14]

function shade(i: number) {
  const pct = SHADES[i]
  if (pct === undefined) return 'var(--sideband-surface-3)'
  return `color-mix(in srgb, var(--graph-accent) ${pct}%, var(--sideband-surface-3))`
}

/** Top languages by bytes. Anything past the sixth folds into "Other". */
function LanguageBar({
  languages,
  wide,
}: {
  languages: LanguageShare[]
  /** Spread the legend wider when the bar has the full row. */
  wide: boolean
}) {
  const top = languages.slice(0, 6)
  const rest = languages.slice(6)
  const rows = rest.length
    ? [
        ...top,
        {
          name: `Other (${rest.length})`,
          bytes: rest.reduce((s, l) => s + l.bytes, 0),
          share: rest.reduce((s, l) => s + l.share, 0),
        },
      ]
    : top
  const pct = (share: number) =>
    share >= 0.1
      ? `${Math.round(share * 100)}%`
      : `${(share * 100).toFixed(1)}%`
  return (
    <div>
      <div
        aria-hidden="true"
        className="flex h-3 w-full overflow-hidden rounded-full bg-sideband-surface-3"
      >
        {rows.map((l, i) => (
          <span
            key={l.name}
            className="block h-full"
            style={{ width: `${l.share * 100}%`, background: shade(i) }}
          />
        ))}
      </div>
      <ul
        className={cx(
          'mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3',
          wide && 'lg:grid-cols-4 xl:grid-cols-7',
        )}
      >
        {rows.map((l, i) => (
          <li key={l.name} className="flex items-center gap-2.5 text-small">
            <span
              aria-hidden="true"
              className="block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: shade(i) }}
            />
            <span className="truncate text-sideband-text">{l.name}</span>
            <span className="ml-auto tabular-nums text-sideband-muted">
              {pct(l.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface GithubPanelProps {
  gh: EngineerGithub
  accent: string
  /** Short name for headings and alt text. */
  first: string
}

/** Everything the snapshot holds about an engineer's GitHub account. */
export default function GithubPanel({ gh, accent, first }: GithubPanelProps) {
  const s = gh.summary
  const summaryId = `gh-${gh.login}-summary`
  const hasPinned = gh.pinned.length > 0
  const hasSide = gh.languages.length > 0 || gh.organizations.length > 0
  const stats = [
    { label: 'Contributions, last year', value: formatCount(s.total) },
    { label: 'Followers', value: formatCount(gh.followers) },
    { label: 'Following', value: formatCount(gh.following) },
    { label: 'Public repos', value: formatCount(gh.publicRepos) },
    { label: 'Stars on own repos', value: formatCount(gh.stars) },
    {
      label: `On GitHub since ${formatMonth(gh.createdAt)}`,
      value: accountAge(gh.createdAt),
    },
  ]

  return (
    <div
      className="space-y-6"
      style={{ '--graph-accent': accent } as CSSProperties}
    >
      <div className="rounded-panel bg-sideband-surface p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <Image
            src={`${gh.avatarUrl}${gh.avatarUrl.includes('?') ? '&' : '?'}s=160`}
            alt={`${first}'s GitHub avatar`}
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 rounded-full bg-sideband-surface-2"
          />
          <div className="min-w-0 flex-1">
            <p className="text-lead font-medium text-sideband-text">
              {gh.name ?? gh.login}
            </p>
            <a
              href={gh.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-0.5 inline-flex items-center gap-1.5 text-small text-sideband-text-secondary transition-colors duration-hover hover:text-sideband-text"
            >
              <GitHubIcon size={14} />
              github.com/{gh.login}
              <ArrowUpRightIcon
                size={12}
                className="transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
        {gh.bio && (
          <p className="mt-5 max-w-prose text-body text-sideband-text-secondary">
            {gh.bio}
          </p>
        )}

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-1.5"
            >
              <dt className="text-small text-sideband-muted">{stat.label}</dt>
              <dd className="text-lead font-medium tabular-nums text-sideband-text">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <h3 className="text-body font-medium text-sideband-text">
            Contributions
          </h3>
          <p
            id={summaryId}
            className="mt-1.5 max-w-prose text-small text-sideband-muted"
          >
            {formatCount(s.total)} contributions in the last year, from{' '}
            {formatDay(s.firstDay)} to {formatDay(s.lastDay)}. Active on{' '}
            {formatCount(s.activeDays)} days, with a longest streak of{' '}
            {s.longestStreak} {s.longestStreak === 1 ? 'day' : 'days'}
            {s.busiest
              ? ` and a busiest day of ${formatCount(s.busiest.count)} on ${formatDay(s.busiest.date)}`
              : ''}
            .
          </p>
          <ContributionGraph
            weeks={gh.weeks}
            summaryId={summaryId}
            accent={accent}
            idle={`Synced from GitHub on ${syncedLabel}`}
            className="mt-6"
          />
        </div>
      </div>

      <div
        className={cx(
          'grid gap-6',
          hasPinned && hasSide && 'lg:grid-cols-[1fr_1.4fr]',
        )}
      >
        {hasSide && (
          <div className="flex flex-col gap-10 rounded-panel bg-sideband-surface p-6 md:p-10">
            {gh.languages.length > 0 && (
              <div>
                <h3 className="text-body font-medium text-sideband-text">
                  Top languages
                </h3>
                <p className="mt-1.5 text-small text-sideband-muted">
                  By code size across {first}&apos;s own public repositories.
                </p>
                <div className="mt-6">
                  <LanguageBar languages={gh.languages} wide={!hasPinned} />
                </div>
              </div>
            )}
            {gh.organizations.length > 0 && (
              <div>
                <h3 className="text-body font-medium text-sideband-text">
                  Organizations
                </h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {gh.organizations.map((org) => (
                    <li key={org.login}>
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2.5 rounded-full bg-sideband-surface-2 pl-1.5 pr-4 text-small text-sideband-text transition-colors duration-hover hover:bg-sideband-surface-3"
                      >
                        <Image
                          src={`${org.avatarUrl}${org.avatarUrl.includes('?') ? '&' : '?'}s=64`}
                          alt=""
                          width={32}
                          height={32}
                          unoptimized
                          className="h-8 w-8 rounded-full"
                        />
                        {org.name ?? org.login}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasPinned && (
          <div className="rounded-panel bg-sideband-surface p-6 md:p-10">
            <h3 className="text-body font-medium text-sideband-text">
              Pinned repositories
            </h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {gh.pinned.map((repo) => (
                <li key={repo.nameWithOwner}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-inner bg-sideband-surface-2 p-5 transition-colors duration-hover ease-standard hover:bg-sideband-surface-3"
                  >
                    <span className="flex items-center gap-2 text-small font-medium text-sideband-text">
                      <span className="truncate">{repo.nameWithOwner}</span>
                    </span>
                    {repo.description && (
                      <span className="mt-2 text-small text-sideband-text-secondary">
                        {repo.description}
                      </span>
                    )}
                    <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-small text-sideband-muted">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="tabular-nums">
                        {formatCount(repo.stars)}{' '}
                        {repo.stars === 1 ? 'star' : 'stars'}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-small text-sideband-muted">
        From the GitHub snapshot synced on {syncedLabel}. Contributions are the
        count on the public profile for the year before that date.
      </p>
    </div>
  )
}
