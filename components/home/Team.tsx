import Image from 'next/image'
import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { countWord, type TeamMember } from '@/lib/home-data'

/**
 * The engineers: who they are, what they build at Sideband, the products they
 * work on, and how much they shipped on GitHub in the last year.
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
              {countWord(team.length, true)} engineers,
              <br />
              one studio.
            </>
          }
          lede="Who builds what, the products each of us works on, and how much each of us shipped on GitHub in the last year."
        />
        <Reveal delay={210}>
          <ArrowLink href="/engineers">All engineer profiles</ArrowLink>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
        {team.map((m, i) => (
          <Reveal as="li" key={m.id} delay={(i % 4) * 70}>
            <Member member={m} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

function Member({ member: m }: { member: TeamMember }) {
  return (
    <article className="group relative grid grid-cols-[6rem_1fr] gap-x-5 gap-y-5 sm:grid-cols-1">
      <div className="relative aspect-square overflow-hidden rounded-inner bg-sideband-surface-2 sm:aspect-[4/5] sm:rounded-panel">
        {m.portrait ? (
          <Image
            src={m.portrait.src}
            alt={`Portrait of ${m.name}`}
            fill
            sizes="(min-width: 1280px) 330px, (min-width: 640px) 45vw, 96px"
            className="object-cover object-top transition-transform duration-ui ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-lead text-sideband-text-secondary">
            {m.initials}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lead font-medium text-sideband-text">
            <Link
              href={`/engineers/${m.id}`}
              className="after:absolute after:inset-0"
            >
              {m.name}
            </Link>
          </h3>
          <p className="mt-1 text-small text-sideband-text-secondary">
            {m.role}
          </p>
        </div>
        <p className="text-body text-sideband-text">{m.builds}</p>

        {m.products.length > 0 && (
          <ul
            aria-label={`Products ${m.name} works on`}
            className="relative z-10 flex flex-wrap gap-2"
          >
            {m.products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  className="inline-flex h-7 items-center rounded-full bg-sideband-surface-2 px-3 text-small text-sideband-text-secondary transition-colors duration-hover ease-standard hover:bg-sideband-surface-3 hover:text-sideband-text"
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
