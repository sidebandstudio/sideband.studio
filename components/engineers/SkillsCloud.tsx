import FadeUp from '@/components/animations/FadeUp'
import type { SkillGroup } from '@/lib/engineers'

interface SkillsCloudProps {
  groups: SkillGroup[]
}

export default function SkillsCloud({ groups }: SkillsCloudProps) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
      {groups.map((group, i) => (
        <FadeUp key={group.category} delay={i * 0.05}>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-accent">
                / {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-text-secondary">
                {group.category}
              </span>
              <div className="h-px flex-1 bg-sideband-border" />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="border border-sideband-border bg-sideband-surface px-2.5 py-1 font-mono text-[11px] text-sideband-text-secondary transition-colors duration-200 hover:border-sideband-accent/60 hover:text-sideband-text"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  )
}
