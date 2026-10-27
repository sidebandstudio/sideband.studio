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
const LEFT = 30
const TOP = 20

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

/**
 * A year of GitHub contributions, one square per day, drawn from the weekly
 * calendar in the snapshot. Pointer and keyboard both pick a day: hover a
 * square, or focus the graph and use the arrow keys, Home and End. The day
 * is read out below the graph and announced politely.
 */
export default function ContributionGraph({
  weeks,
  summaryId,
  idle,
  accent,
  className,
}: ContributionGraphProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<{ w: number; d: number } | null>(null)

  // Most recent days are on the right. Start there on narrow screens.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  const width = LEFT + weeks.length * STEP
  const height = TOP + 7 * STEP
  const row = (date: string) => toDate(date).getUTCDay()

  const months: { x: number; label: string }[] = []
  weeks.forEach((week, w) => {
    const first = week.find((d) => toDate(d.date).getUTCDate() <= 7)
    if (!first || toDate(first.date).getUTCDate() > 7) return
    const label = shortMonth.format(toDate(first.date))
    const x = LEFT + w * STEP
    const prev = months[months.length - 1]
    if (prev && prev.label === label) return
    if (prev && x - prev.x < STEP * 3) months.pop()
    months.push({ x, label })
  })

  const day = active ? weeks[active.w]?.[active.d] : undefined

  const move = (w: number, d: number) => {
    const wi = Math.max(0, Math.min(weeks.length - 1, w))
    const di = Math.max(0, Math.min(weeks[wi].length - 1, d))
    setActive({ w: wi, d: di })
    const el = scroller.current
    if (el) {
      const scale = el.scrollWidth / width
      const x = (LEFT + wi * STEP) * scale
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
        className="-mx-1 overflow-x-auto rounded-inner px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={summaryId}
          className="block h-auto w-full min-w-[640px]"
        >
          {months.map((m) => (
            <text
              key={`${m.label}-${m.x}`}
              x={m.x}
              y={11}
              className="fill-sideband-muted text-[9px]"
            >
              {m.label}
            </text>
          ))}
          {[
            ['Mon', 1],
            ['Wed', 3],
            ['Fri', 5],
          ].map(([label, r]) => (
            <text
              key={label}
              x={0}
              y={TOP + (r as number) * STEP + CELL - 2}
              className="fill-sideband-muted text-[9px]"
            >
              {label}
            </text>
          ))}
          {weeks.map((week, w) =>
            week.map((d, di) => {
              const on = active?.w === w && active?.d === di
              return (
                <rect
                  key={d.date}
                  x={LEFT + w * STEP}
                  y={TOP + row(d.date) * STEP}
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
