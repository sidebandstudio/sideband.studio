import Reveal from '@/components/ui/Reveal'
import {
  formatCount,
  formatDay,
  syncedLabel,
  type CalendarWeek,
  type ContributionSummary,
} from '@/lib/engineers-github'
import ContributionGraph from './ContributionGraph'

interface TeamActivityProps {
  weeks: CalendarWeek[]
  summary: ContributionSummary
  people: { id: string; name: string; accent: string; total: number }[]
}

/** Every engineer's calendar added together, with each person's share of the year. */
export default function TeamActivity({
  weeks,
  summary,
  people,
}: TeamActivityProps) {
  const total = people.reduce((sum, p) => sum + p.total, 0)
  const sorted = [...people].sort((a, b) => b.total - a.total)
  return (
    <div className="rounded-panel bg-sideband-surface p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <Reveal className="min-w-0">
          <p id="team-graph-summary" className="text-small text-sideband-muted">
            {formatCount(summary.total)} contributions across the team in the
            last year, from {formatDay(summary.firstDay)} to{' '}
            {formatDay(summary.lastDay)}. At least one of them contributed on{' '}
            {formatCount(summary.activeDays)} of those days, with a longest run
            of {summary.longestStreak} days in a row
            {summary.busiest
              ? ` and a busiest day of ${formatCount(summary.busiest.count)} on ${formatDay(summary.busiest.date)}`
              : ''}
            .
          </p>
          <ContributionGraph
            weeks={weeks}
            summaryId="team-graph-summary"
            idle={`All ${people.length} calendars added together. Synced ${syncedLabel}.`}
            className="mt-6"
          />
        </Reveal>

        <Reveal delay={70} className="min-w-0">
          <h3 className="text-body font-medium text-sideband-text">
            Share of the year
          </h3>
          <div
            aria-hidden="true"
            className="mt-5 flex h-3 w-full gap-0.5 overflow-hidden rounded-full"
          >
            {sorted.map((p) => (
              <span
                key={p.id}
                className="block h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(p.total / Math.max(1, total)) * 100}%`,
                  background: p.accent,
                }}
              />
            ))}
          </div>
          <ul className="mt-6 space-y-3">
            {sorted.map((p) => (
              <li key={p.id} className="flex items-center gap-3 text-small">
                <span
                  aria-hidden="true"
                  className="block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: p.accent }}
                />
                <span className="text-sideband-text">{p.name}</span>
                <span className="ml-auto tabular-nums text-sideband-text-secondary">
                  {formatCount(p.total)}
                </span>
                <span className="w-10 text-right tabular-nums text-sideband-muted">
                  {Math.round((p.total / Math.max(1, total)) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  )
}
