import Image from 'next/image'
import FadeUp from '@/components/animations/FadeUp'
import Tag from '@/components/ui/Tag'
import type { ExperienceEntry } from '@/lib/engineers'

/** Leading letters, up to three — "Amazon Web Services" -> "AWS". */
function monogram(company: string): string {
  return company
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function CompanyMark({ entry }: { entry: ExperienceEntry }) {
  if (entry.logo) {
    return (
      <span className="relative block h-10 w-[132px]">
        {/* Brand marks are drawn for light backgrounds; render them as a
            single tone so they stay legible on the dark surface. */}
        <Image
          src={entry.logo}
          alt={`${entry.company} logo`}
          fill
          sizes="132px"
          className={`object-contain object-left ${
            entry.logoOnDark ? 'opacity-95' : 'brightness-0 invert opacity-90'
          }`}
        />
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className="inline-flex h-10 items-center rounded-lg border border-sideband-border bg-white/[0.02] px-3"
    >
      <span className="font-mono text-[12px] tracking-[0.08em] text-sideband-muted">
        {monogram(entry.company)}
      </span>
    </span>
  )
}

interface ExperienceTimelineProps {
  entries: ExperienceEntry[]
}

function StatusPill({ entry }: { entry: ExperienceEntry }) {
  if (entry.upcoming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-sideband-accent" />
        Incoming
      </span>
    )
  }
  if (entry.current) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-sideband-accent-2" />
        Current
      </span>
    )
  }
  return null
}

export default function ExperienceTimeline({
  entries,
}: ExperienceTimelineProps) {
  return (
    <div className="relative ml-4 border-l border-sideband-border pl-8">
      {entries.map((entry, i) => (
        <FadeUp key={`${entry.company}-${i}`} delay={i * 0.06}>
          <div className="relative mb-12 last:mb-0">
            <div
              className={`absolute -left-[41px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-sideband-black ${
                entry.emphasis
                  ? 'border-sideband-accent'
                  : 'border-sideband-border-strong'
              }`}
            />

            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
              <span>
                {entry.startDate} – {entry.endDate}
              </span>
              <StatusPill entry={entry} />
              <span>{entry.location}</span>
            </div>

            <div className="mt-4">
              <CompanyMark entry={entry} />
              <div className="mt-2.5 min-w-0">
                <h3
                  className={`text-[20px] font-semibold tracking-[-0.02em] ${
                    entry.emphasis
                      ? 'text-sideband-text'
                      : 'text-sideband-text-secondary'
                  }`}
                >
                  {entry.company}
                </h3>
                <p className="mt-0.5 text-[14px] text-sideband-text-secondary">
                  {entry.role}
                </p>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-[1.6] text-sideband-text-secondary">
              {entry.summary}
            </p>

            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {entry.highlights.map((h, hi) => (
                  <li
                    key={hi}
                    className="flex gap-3 text-[14px] leading-[1.55] text-sideband-text-secondary"
                  >
                    <span className="mt-[9px] h-1 w-1 flex-shrink-0 rounded-full bg-sideband-muted" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {entry.skills && entry.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {entry.skills.map((s) => (
                  <Tag key={s} label={s} />
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      ))}
    </div>
  )
}
