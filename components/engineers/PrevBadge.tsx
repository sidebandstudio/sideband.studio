import type { PrevBadgeEntry } from '@/lib/engineers'

interface PrevBadgeProps {
  entries: PrevBadgeEntry[]
}

export default function PrevBadge({ entries }: PrevBadgeProps) {
  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <span className="flex items-center font-mono text-[10px] uppercase tracking-[0.32em] text-eternal-muted">
        PREV →
      </span>
      {entries.map((entry, i) => (
        <div
          key={`${entry.label}-${i}`}
          className="group relative flex flex-col gap-0.5 border border-eternal-border bg-eternal-surface px-3 py-2 transition-colors duration-200 hover:border-eternal-accent/60"
        >
          <span className="font-display text-[15px] leading-none tracking-wide text-eternal-text">
            {entry.label}
          </span>
          {entry.sublabel && (
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-eternal-text-secondary">
              {entry.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
