import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import Tag from '@/components/ui/Tag'
import type { SkillGroup } from '@/lib/engineers'

interface SkillsCloudProps {
  groups: SkillGroup[]
}

export default function SkillsCloud({ groups }: SkillsCloudProps) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
      {groups.map((group, i) => (
        <FadeUp key={group.category} delay={i * 0.05}>
          <SectionLabel label={group.category} withLine />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <Tag key={item} label={item} />
            ))}
          </div>
        </FadeUp>
      ))}
    </div>
  )
}
