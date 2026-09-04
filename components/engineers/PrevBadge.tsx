import type { PrevBadgeEntry } from '@/lib/engineers'

interface PrevBadgeProps {
  entries: PrevBadgeEntry[]
}

export default function PrevBadge({ entries }: PrevBadgeProps) {
  return (
    <div>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
        Previously
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {entries.map((entry, i) => (
          <div
            key={`${entry.label}-${i}`}
            className="flex flex-col gap-0.5 rounded-lg border border-sideband-border bg-white/[0.02] px-3 py-2"
          >
            <span className="text-[14px] font-medium tracking-[-0.01em] text-sideband-text">
              {entry.label}
            </span>
            {entry.sublabel && (
              <span className="font-mono text-[11px] text-sideband-muted">
                {entry.sublabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
