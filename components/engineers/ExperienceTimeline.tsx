import FadeUp from '@/components/animations/FadeUp'
import type { ExperienceEntry } from '@/lib/engineers'

interface ExperienceTimelineProps {
  entries: ExperienceEntry[]
}

function StatusPill({ entry }: { entry: ExperienceEntry }) {
  if (entry.upcoming) {
    return (
      <span className="border border-eternal-accent/60 bg-eternal-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-eternal-accent">
        INCOMING
      </span>
    )
  }
  if (entry.current) {
    return (
      <span className="border border-eternal-accent/60 bg-eternal-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-eternal-accent">
        ● CURRENT
      </span>
    )
  }
  return null
}

export default function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <div className="relative ml-4 border-l border-eternal-border pl-8">
      {entries.map((entry, i) => (
        <FadeUp key={`${entry.company}-${i}`} delay={i * 0.06}>
          <div className="relative mb-12 last:mb-0">
            {/* Dot */}
            <div
              className={`absolute -left-[41px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-eternal-black ${
                entry.emphasis ? 'border-eternal-accent shadow-[0_0_12px_rgba(168,85,247,0.6)]' : 'border-eternal-border'
              }`}
            />

            {/* Date / status row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-eternal-accent">
                {entry.startDate} — {entry.endDate}
              </span>
              <StatusPill entry={entry} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-eternal-muted">
                {entry.location}
              </span>
            </div>

            {/* Headline */}
            <h3
              className={`mt-3 font-display text-[26px] leading-tight ${
                entry.emphasis ? 'text-eternal-text' : 'text-eternal-text-secondary'
              }`}
            >
              {entry.company}
            </h3>
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-eternal-text-secondary">
              {entry.role}
            </p>

            {/* Summary */}
            <p className="mt-3 max-w-2xl font-mono text-[13px] leading-[1.85] text-eternal-text-secondary">
              {entry.summary}
            </p>

            {/* Highlights */}
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {entry.highlights.map((h, hi) => (
                  <li
                    key={hi}
                    className="flex gap-3 font-mono text-[12px] leading-[1.7] text-eternal-text-secondary"
                  >
                    <span className="mt-1 inline-block h-1 w-2 flex-shrink-0 bg-eternal-accent/70" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Skill chips */}
            {entry.skills && entry.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {entry.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-eternal-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-eternal-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      ))}
    </div>
  )
}
