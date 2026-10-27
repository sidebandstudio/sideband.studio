import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import EngineerCard from '@/components/engineers/EngineerCard'
import TeamActivity from '@/components/engineers/TeamActivity'
import { listEngineers } from '@/lib/engineers'
import {
  engineerGithub,
  formatCount,
  syncedLabel,
  teamCalendar,
  weeklyTotals,
} from '@/lib/engineers-github'
import {
  capitalize,
  countWord,
  listJoin,
  productsBy,
} from '@/lib/engineers-view'

export const metadata: Metadata = {
  title: 'Engineers · Sideband',
  description:
    'The founding engineers behind Sideband: what each of them builds at the studio, their work history and projects, and their activity on GitHub.',
}

export default function EngineersPage() {
  const all = listEngineers()
  const team = teamCalendar()
  const cities = Array.from(
    new Set(
      all
        .map((e) => e.contact.location?.replace(/^Greater /, ''))
        .filter((c): c is string => Boolean(c)),
    ),
  )

  return (
    <>
      <Section labelledBy="engineers-title" className="!pt-32">
        <SectionHeading
          as="h1"
          id="engineers-title"
          trigger="mount"
          title={`${capitalize(countWord(all.length))} founding engineers`}
          lede={`The people who build Sideband, working from ${listJoin(cities)}. Open a dossier for their work history, every project, what they build here and a year of GitHub activity.`}
        />
        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {all.map((engineer, i) => {
            const gh = engineerGithub(engineer)
            // An odd last card takes the whole row, laid out sideways.
            const wide = all.length % 2 === 1 && i === all.length - 1
            return (
              <Reveal
                as="li"
                key={engineer.id}
                trigger={i < 2 ? 'mount' : 'scroll'}
                delay={i < 2 ? 280 + i * 70 : (i % 2) * 70}
                className={wide ? 'lg:col-span-2' : undefined}
              >
                <EngineerCard
                  wide={wide}
                  engineer={engineer}
                  gh={gh}
                  weekly={gh ? weeklyTotals(gh.weeks) : []}
                  products={productsBy(engineer.id)}
                />
              </Reveal>
            )
          })}
        </ul>
      </Section>

      <Section labelledBy="team-title" className="!pt-0">
        <SectionHeading
          id="team-title"
          title="A year on GitHub, together"
          lede={`${formatCount(team.summary.total)} contributions from all ${countWord(team.people.length)} founding engineers in the last year, every calendar added day by day. From the snapshot synced ${syncedLabel}.`}
        />
        <div className="mt-14">
          <TeamActivity
            weeks={team.weeks}
            summary={team.summary}
            people={team.people}
          />
        </div>
      </Section>
    </>
  )
}
