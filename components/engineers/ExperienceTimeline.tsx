import Reveal from '@/components/ui/Reveal'
import Badge from '@/components/ui/Badge'
import { ArrowUpRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'
import type { ExperienceEntry } from '@/lib/engineers'
import {
  dateRange,
  duration,
  periods,
  type ExperienceGroup,
} from '@/lib/engineers-view'
import CompanyMark from './CompanyMark'

function RoleStatus({ role }: { role: ExperienceEntry }) {
  if (!role.current && !role.upcoming) return null
  return (
    <Badge>
      <span
        aria-hidden="true"
        className={cx(
          'h-1.5 w-1.5 rounded-full',
          role.upcoming ? 'bg-sideband-warn' : 'bg-sideband-ok',
        )}
      />
      {role.upcoming ? 'Incoming' : 'Current'}
    </Badge>
  )
}

function Role({
  role,
  nested,
  group,
}: {
  role: ExperienceEntry
  nested: boolean
  /** The group's name, so a role under another company name says which. */
  group: string
}) {
  const stints = periods(role)
  return (
    <div className={cx(nested && 'relative pl-7')}>
      {nested && (
        <span
          aria-hidden="true"
          className={cx(
            'absolute left-0 top-[0.55em] h-2.5 w-2.5 rounded-full',
            role.current || role.upcoming
              ? 'bg-sideband-text'
              : 'bg-sideband-surface-3',
          )}
        />
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h4 className="text-lead font-medium text-sideband-text">
          {role.role}
        </h4>
        <RoleStatus role={role} />
      </div>
      {role.company !== group && (
        <p className="mt-1.5 text-small text-sideband-text-secondary">
          {role.company}
        </p>
      )}
      {/* One line per stint, each measured on its own. */}
      <ul className="mt-1.5 space-y-0.5 text-small tabular-nums text-sideband-muted">
        {stints.map((p, i) => (
          <li key={p.startDate}>
            {[
              dateRange(p.startDate, p.endDate),
              role.upcoming ? null : duration(p.startDate, p.endDate),
              p.note,
              i === 0 ? role.location : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-prose text-body text-sideband-text">
        {role.summary}
      </p>
      {role.highlights && role.highlights.length > 0 && (
        <ul className="mt-4 max-w-prose space-y-2.5 text-body text-sideband-text-secondary">
          {role.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.7em] block h-1 w-1 shrink-0 rounded-full bg-sideband-muted"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
      {role.skills && role.skills.length > 0 && (
        <ul aria-label="Tools" className="mt-5 flex flex-wrap gap-2">
          {role.skills.map((s) => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Work history, one entry per organisation. Several dated roles at the same
 * place (promotions, a return, parallel roles) are listed under it on a rail.
 */
export default function ExperienceTimeline({
  groups,
}: {
  groups: ExperienceGroup[]
}) {
  return (
    <ol className="space-y-6">
      {groups.map((group) => {
        const many = group.roles.length > 1
        return (
          <Reveal
            as="li"
            key={group.company}
            className="grid gap-6 rounded-panel bg-sideband-surface p-6 md:grid-cols-[13rem_1fr] md:gap-10 md:p-10"
          >
            <div className="flex items-center gap-4 md:flex-col md:items-start">
              <CompanyMark
                name={group.company}
                logo={group.logo}
                onDark={group.logoOnDark}
              />
              <div className="min-w-0">
                <h3 className="text-body font-medium text-sideband-text">
                  {group.companyUrl ? (
                    <a
                      href={group.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 transition-colors duration-hover hover:text-white"
                    >
                      {group.company}
                      <ArrowUpRightIcon
                        size={12}
                        className="shrink-0 text-sideband-muted transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    group.company
                  )}
                </h3>
                {many && (
                  <p className="mt-1 text-small tabular-nums text-sideband-muted">
                    {group.roles.length} roles · {group.span}
                  </p>
                )}
              </div>
            </div>
            <div
              className={cx(
                many
                  ? 'relative space-y-10 before:absolute before:bottom-2 before:left-1 before:top-3 before:w-0.5 before:bg-sideband-surface-3'
                  : '',
              )}
            >
              {group.roles.map((role) => (
                <Role
                  key={`${role.role}-${role.startDate}`}
                  role={role}
                  nested={many}
                  group={group.company}
                />
              ))}
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}
