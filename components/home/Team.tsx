import Image from 'next/image'
import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { countWord, type TeamMember } from '@/lib/home-data'

/**
 * The founding engineers, one row each: who they are, what they build, the
 * products they work on, and how much they shipped on GitHub in the last year.
 * Rows hold any number of people, so the section never leaves an orphan card.
 */
export default function Team({ team }: { team: TeamMember[] }) {
  return (
    <Section id="team" labelledBy="team-title" tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
        <SectionHeading
          id="team-title"
          eyebrow="The team"
          title={
            <>
              Built by {countWord(team.length)}
              <br />
              founding engineers.
            </>
          }
          lede="Who builds what, the products each of us works on, and how much each of us shipped on GitHub in the last year."
        />
        <Reveal delay={210}>
          <ArrowLink href="/engineers">All engineer profiles</ArrowLink>
        </Reveal>
      </div>

      <ul className="mt-14 flex flex-col gap-2">
        {team.map((m, i) => (
          <Reveal as="li" key={m.id} delay={Math.min(i, 4) * 70}>
            <Member member={m} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

function Member({ member: m }: { member: TeamMember }) {
  return (
    <article className="group relative grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-4 rounded-panel p-3 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2 md:grid-cols-[6rem_minmax(0,1fr)] md:items-start md:gap-x-6 md:gap-y-3 md:p-4 lg:grid-cols-[9rem_minmax(0,3fr)_minmax(0,5fr)_minmax(0,4fr)] lg:items-center lg:gap-x-8">
      <div className="relative aspect-square overflow-hidden rounded-inner bg-sideband-surface-3 md:row-span-3 lg:row-span-1">
        {m.portrait ? (
          <Image
            src={m.portrait.src}
            alt={`Portrait of ${m.name}`}
            fill
            sizes="(min-width: 1024px) 144px, (min-width: 768px) 96px, 72px"
            className="object-cover object-top transition-transform duration-ui ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-lead text-sideband-text-secondary">
            {m.initials}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lead font-medium text-sideband-text">
          <Link
            href={`/engineers/${m.id}`}
            className="after:absolute after:inset-0 after:rounded-panel"
          >
            {m.name}
          </Link>
        </h3>
        <p className="mt-1 text-small text-sideband-text-secondary">{m.role}</p>
      </div>

      <p className="col-span-2 text-body text-sideband-text md:col-span-1 md:col-start-2 lg:col-start-auto">
        {m.builds}
      </p>

      <div className="col-span-2 flex flex-col gap-3 md:col-span-1 md:col-start-2 lg:col-start-auto">
        {m.products.length > 0 && (
          <ul
            aria-label={`Products ${m.name} works on`}
            className="relative z-10 flex flex-wrap gap-2"
          >
            {m.products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  className="inline-flex h-7 items-center rounded-full bg-sideband-surface-2 px-3 text-small text-sideband-text-secondary transition-colors duration-hover ease-standard hover:text-sideband-text group-hover:bg-sideband-surface-3"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-small text-sideband-muted">
          {m.contributions !== null && (
            <>
              <span className="tabular-nums text-sideband-text">
                {m.contributions.toLocaleString('en-US')}
              </span>{' '}
              GitHub contributions in the last year
            </>
          )}
          {m.contributions !== null && m.joined && <br />}
          {m.joined && <>At Sideband since {m.joined}</>}
        </p>
      </div>
    </article>
  )
}
