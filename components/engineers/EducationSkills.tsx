import Badge from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import type { EducationEntry, SkillGroup } from '@/lib/engineers'
import CompanyMark from './CompanyMark'

export function Education({ entries }: { entries: EducationEntry[] }) {
  return (
    <ul className="space-y-12">
      {entries.map((e) => (
        <Reveal as="li" key={e.school}>
          <div className="flex flex-wrap items-start gap-5">
            <CompanyMark name={e.school} logo={e.logo} onDark={e.logoOnDark} />
            <div className="min-w-0 flex-1">
              <h3 className="text-lead font-medium text-sideband-text">
                {e.school}
              </h3>
              <p className="mt-1 text-body text-sideband-text">{e.degree}</p>
              <p className="mt-1 text-small tabular-nums text-sideband-muted">
                {[e.dates, e.honors].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          {e.coursework && e.coursework.length > 0 && (
            <div className="mt-6">
              <h4 className="text-small font-medium text-sideband-text-secondary">
                Coursework
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.coursework.map((c) => (
                  <li key={c}>
                    <Badge>{c}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {e.activities && e.activities.length > 0 && (
            <div className="mt-6">
              <h4 className="text-small font-medium text-sideband-text-secondary">
                Activities
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.activities.map((a) => (
                  <li key={a}>
                    <Badge>{a}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      ))}
    </ul>
  )
}

/** Skills in the person's own groups, in their own order. */
export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.category}>
          <dt className="text-small font-medium text-sideband-text-secondary">
            {g.category}
          </dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
