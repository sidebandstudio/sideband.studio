'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import type { CalendarWeek } from '@/lib/engineers-github'
import { cx } from '@/components/ui/cx'

interface ContributionGraphProps {
  weeks: CalendarWeek[]
  /** Id of the text that summarises the graph, read as the image's name. */
  summaryId: string
  /** What the readout says while no day is picked. */
  idle: string
  /** The colour of the busiest days. Defaults to the brand accent. */
  accent?: string
  className?: string
}

const CELL = 11
const STEP = 14

const FILL = {
  NONE: 'var(--sideband-surface-3)',
  FIRST_QUARTILE:
    'color-mix(in srgb, var(--graph-accent) 32%, var(--sideband-surface-3))',
  SECOND_QUARTILE:
    'color-mix(in srgb, var(--graph-accent) 56%, var(--sideband-surface-3))',
  THIRD_QUARTILE:
    'color-mix(in srgb, var(--graph-accent) 78%, var(--sideband-surface-3))',
  FOURTH_QUARTILE: 'var(--graph-accent)',
} as const

const longDay = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortMonth = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

function describe(count: number, date: string) {
  const day = longDay.format(toDate(date))
  if (count === 0) return `No contributions on ${day}`
  return `${count.toLocaleString('en-US')} ${count === 1 ? 'contribution' : 'contributions'} on ${day}`
}

/** Weeks shown on a phone before the visitor asks for the whole year. */
const PHONE_WEEKS = 26
const PHONE = '(max-width: 639px)'

/**
 * A year of GitHub contributions, one square per day, drawn from the weekly
 * calendar in the snapshot. Pointer and keyboard both pick a day: hover a
 * square, or focus the graph and use the arrow keys, Home and End. The day
 * is read out below the graph and announced politely. Labels are HTML text
 * at the small type step, so they stay legible at any width. On a phone the
 * graph shows the last 26 weeks at full size, with a button for the year,
 * which then scrolls sideways under a fixed column of day names.
 */
export default function ContributionGraph({
  weeks: allWeeks,
  summaryId,
  idle,
  accent,
  className,
}: ContributionGraphProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<{ w: number; d: number } | null>(null)
  const [phone, setPhone] = useState(false)
  const [wholeYear, setWholeYear] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const update = () => setPhone(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const half = phone && !wholeYear
  const scrolls = phone && wholeYear
  const weeks = half ? allWeeks.slice(-PHONE_WEEKS) : allWeeks

  // The year scrolls on a phone. Start at the most recent week, on the right.
  useEffect(() => {
    const el = scroller.current
    if (el && scrolls) el.scrollLeft = el.scrollWidth
  }, [scrolls])

  const width = weeks.length * STEP - (STEP - CELL)
  const height = 7 * STEP - (STEP - CELL)
  const row = (date: string) => toDate(date).getUTCDay()

  // A label at the first week that holds the 1st to the 7th of a month.
  const months: { w: number; label: string }[] = []
  weeks.forEach((week, w) => {
    const first = week.find((d) => toDate(d.date).getUTCDate() <= 7)
    if (!first) return
    const label = shortMonth.format(toDate(first.date))
    const prev = months[months.length - 1]
    if (prev && prev.label === label) return
    if (prev && w - prev.w < 3) months.pop()
    // Too close to the end to fit its name.
    if (weeks.length - w < 3) return
    months.push({ w, label })
  })

  const day = active ? weeks[active.w]?.[active.d] : undefined

  const move = (w: number, d: number) => {
    const wi = Math.max(0, Math.min(weeks.length - 1, w))
    const di = Math.max(0, Math.min(weeks[wi].length - 1, d))
    setActive({ w: wi, d: di })
    const el = scroller.current
    if (el && scrolls) {
      const x = (wi / weeks.length) * el.scrollWidth
      if (x < el.scrollLeft + 40) el.scrollLeft = x - 40
      else if (x > el.scrollLeft + el.clientWidth - 40)
        el.scrollLeft = x - el.clientWidth + 40
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = weeks.length - 1
    const cur = active ?? { w: last, d: weeks[last].length - 1 }
    const keys: Record<string, () => void> = {
      ArrowLeft: () => move(cur.w - 1, cur.d),
      ArrowRight: () => move(cur.w + 1, cur.d),
      ArrowUp: () => move(cur.w, cur.d - 1),
      ArrowDown: () => move(cur.w, cur.d + 1),
      Home: () => move(0, 0),
      End: () => move(last, weeks[last].length - 1),
    }
    const run = keys[e.key]
    if (!run) return
    e.preventDefault()
    run()
  }

  const vars = {
    '--graph-accent': accent ?? 'var(--sideband-accent)',
  } as CSSProperties
  const pct = (w: number) => `${((w * STEP) / width) * 100}%`
  const rowPct = (r: number) => `${((r * STEP + CELL / 2) / height) * 100}%`

  return (
    <div className={className} style={vars}>
      <div
        ref={scroller}
        tabIndex={0}
        role="group"
        aria-label="Contribution calendar. Use the arrow keys to read a day."
        aria-describedby={`${summaryId}-readout`}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (!active) {
            const last = weeks.length - 1
            setActive({ w: last, d: weeks[last].length - 1 })
          }
        }}
        onBlur={() => setActive(null)}
        onMouseLeave={() => {
          if (document.activeElement !== scroller.current) setActive(null)
        }}
        className={cx(
          'rounded-inner outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent',
          scrolls ? 'overflow-x-auto' : 'overflow-hidden',
        )}
      >
        <div data-graph className={cx('flex', scrolls && 'w-[44rem]')}>
          {/* Day names stay put while the year scrolls. */}
          <div
            aria-hidden="true"
            className="sticky left-0 z-10 flex w-10 shrink-0 flex-col bg-sideband-surface"
          >
            <span className="h-7 shrink-0" />
            <span className="relative flex-1">
              {[
                ['Mon', 1],
                ['Wed', 3],
                ['Fri', 5],
              ].map(([label, r]) => (
                <span
                  key={label}
                  data-graph-label
                  className="absolute left-0 -translate-y-1/2 text-small leading-none text-sideband-muted"
                  style={{ top: rowPct(r as number) }}
                >
                  {label}
                </span>
              ))}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div aria-hidden="true" className="relative h-7">
              {months.map((m) => (
                <span
                  key={`${m.label}-${m.w}`}
                  data-graph-label
                  className="absolute top-0 text-small leading-none text-sideband-muted"
                  style={{ left: pct(m.w) }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-labelledby={summaryId}
              className="block h-auto w-full"
            >
              {weeks.map((week, w) =>
                week.map((d, di) => {
                  const on = active?.w === w && active?.d === di
                  return (
                    <rect
                      key={d.date}
                      x={w * STEP}
                      y={row(d.date) * STEP}
                      width={CELL}
                      height={CELL}
                      rx={2.5}
                      style={{
                        fill: FILL[d.level],
                        stroke: on ? 'var(--sideband-text)' : 'none',
                        strokeWidth: on ? 1.5 : 0,
                      }}
                      onMouseEnter={() => setActive({ w, d: di })}
                    />
                  )
                }),
              )}
            </svg>
          </div>
        </div>
      </div>

      {phone && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-small">
          <span className="text-sideband-muted">
            {wholeYear
              ? 'The whole year. Scroll sideways for earlier months.'
              : `The last ${PHONE_WEEKS} weeks.`}
          </span>
          <button
            type="button"
            aria-pressed={wholeYear}
            onClick={() => {
              setWholeYear((v) => !v)
              setActive(null)
            }}
            className="inline-flex h-9 items-center rounded-full bg-sideband-surface-2 px-3.5 font-medium text-sideband-text transition-colors duration-hover hover:bg-sideband-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent"
          >
            {wholeYear
              ? `Show the last ${PHONE_WEEKS} weeks`
              : 'Show the whole year'}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p
          id={`${summaryId}-readout`}
          aria-live="polite"
          className={cx(
            'text-small tabular-nums',
            day ? 'text-sideband-text' : 'text-sideband-muted',
          )}
        >
          {day ? describe(day.count, day.date) : idle}
        </p>
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 text-small text-sideband-muted"
        >
          Less
          {(Object.keys(FILL) as (keyof typeof FILL)[]).map((level) => (
            <span
              key={level}
              className="block h-[11px] w-[11px] rounded-[2.5px]"
              style={{ background: FILL[level] }}
            />
          ))}
          More
        </div>
      </div>
    </div>
  )
}
