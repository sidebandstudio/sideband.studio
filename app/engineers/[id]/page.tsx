import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import PrevBadge from '@/components/engineers/PrevBadge'
import ExperienceTimeline from '@/components/engineers/ExperienceTimeline'
import SkillsCloud from '@/components/engineers/SkillsCloud'
import FeaturedProjects from '@/components/engineers/FeaturedProjects'
import LifestyleGallery from '@/components/engineers/LifestyleGallery'
import ContactPanel from '@/components/engineers/ContactPanel'
import {
  engineerCountLabel,
  engineerIndexLabel,
  engineers,
  getEngineerById,
  getOtherEngineer,
} from '@/lib/engineers'

export function generateStaticParams() {
  return engineers.map((e) => ({ id: e.id }))
}

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const e = getEngineerById(params.id)
  if (!e) return { title: 'Engineer not found · Sideband' }
  return {
    title: `${e.name} · ${e.role} · Sideband`,
    description: e.shortBio,
    alternates: { canonical: `/engineers/${e.id}` },
    openGraph: {
      title: `${e.name} · ${e.role}`,
      description: e.shortBio,
      url: `/engineers/${e.id}`,
      type: 'profile',
      ...(e.portrait ? { images: [{ url: e.portrait.src }] } : {}),
    },
  }
}

export default function EngineerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const engineer = getEngineerById(params.id)
  if (!engineer) notFound()

  const other = getOtherEngineer(engineer.id)
  const portraitSrc = engineer.portrait?.src ?? engineer.portraitPlaceholder
  const indexLabel = `${engineerIndexLabel(engineer.id)} / ${engineerCountLabel}`

  return (
    <div className="min-h-screen bg-sideband-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <FadeUp>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-muted">
            <Link
              href="/engineers"
              className="transition-colors hover:text-sideband-accent"
            >
              ← ENGINEERS
            </Link>
            <span className="text-sideband-border">/</span>
            <span className="text-sideband-text-secondary">{engineer.name}</span>
          </div>
        </FadeUp>

        {/* HERO */}
        <section className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <FadeUp>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-accent">
                [ ENGINEER DOSSIER · {indexLabel} ]
              </span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="mt-5 font-display text-[64px] leading-[0.95] md:text-[88px]">
                <span className="block text-sideband-text">
                  {engineer.name.split(' ')[0]}
                </span>
                <span className="block text-sideband-text-secondary">
                  {engineer.name.split(' ').slice(1).join(' ')}
                  <span className="text-sideband-accent">.</span>
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.18em] text-sideband-accent">
                {engineer.role}
              </p>
              {engineer.contact.location && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-sideband-muted">
                  {engineer.contact.location}
                </p>
              )}
            </FadeUp>

            {engineer.prev && engineer.prev.length > 0 && (
              <FadeUp delay={0.15}>
                <div className="mt-10">
                  <PrevBadge entries={engineer.prev} />
                </div>
              </FadeUp>
            )}

            <FadeUp delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {engineer.contact.resume && (
                  <GlowButton
                    variant="filled"
                    href={engineer.contact.resume}
                    external
                  >
                    Download Resume ↓
                  </GlowButton>
                )}
                <GlowButton
                  variant="ghost"
                  href={`mailto:${engineer.contact.email}`}
                >
                  Contact →
                </GlowButton>
              </div>
            </FadeUp>
          </div>

          {/* Portrait */}
          <FadeUp delay={0.1}>
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l border-t border-sideband-accent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 border-r border-t border-sideband-accent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 border-b border-l border-sideband-accent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b border-r border-sideband-accent"
              />

              <div className="relative aspect-[4/5] w-full overflow-hidden border border-sideband-border bg-sideband-surface-2">
                {portraitSrc ? (
                  <Image
                    src={portraitSrc}
                    alt={`${engineer.name}, portrait`}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    priority
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-[160px] italic text-sideband-text/30">
                      {engineer.initials}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-sideband-black/80 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.3em] text-sideband-text">
                  {engineer.initials} · ID {engineer.id.toUpperCase()}
                </span>
                <span className="absolute right-4 top-4 border border-sideband-border bg-sideband-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-sideband-accent backdrop-blur">
                  [ ACTIVE ]
                </span>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* BIO */}
        <section className="mt-32 grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <FadeUp>
            <SectionLabel label="WHO" />
          </FadeUp>
          <div className="max-w-3xl space-y-6">
            {engineer.longBio.map((para, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <p className="font-mono text-[14px] leading-[1.95] text-sideband-text-secondary">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        {engineer.experience && engineer.experience.length > 0 && (
          <section className="mt-32">
            <FadeUp>
              <SectionLabel label="EXPERIENCE" withLine />
            </FadeUp>
            <div className="mt-12">
              <ExperienceTimeline entries={engineer.experience} />
            </div>
          </section>
        )}

        {/* SKILLS */}
        {engineer.skills && engineer.skills.length > 0 && (
          <section className="mt-32">
            <FadeUp>
              <SectionLabel label="STACK" withLine />
            </FadeUp>
            <div className="mt-10">
              <SkillsCloud groups={engineer.skills} />
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {engineer.projects && engineer.projects.length > 0 && (
          <section className="mt-32">
            <FadeUp>
              <SectionLabel label="FEATURED WORK" withLine />
            </FadeUp>
            <div className="mt-10">
              <FeaturedProjects projects={engineer.projects} />
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {engineer.education && engineer.education.length > 0 && (
          <section className="mt-32">
            <FadeUp>
              <SectionLabel label="EDUCATION" withLine />
            </FadeUp>
            <div className="mt-10 space-y-6">
              {engineer.education.map((ed, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="border-l-2 border-sideband-accent/60 pl-6">
                    <h3 className="font-display text-[22px] text-sideband-text">
                      {ed.school}
                    </h3>
                    <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-sideband-text-secondary">
                      {ed.degree}
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-sideband-muted">
                      {ed.dates}
                      {ed.honors ? ` · ${ed.honors}` : ''}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>
        )}

        {/* LIFESTYLE */}
        {engineer.lifestyle && engineer.lifestyle.length > 0 && (
          <section className="mt-32">
            <FadeUp>
              <SectionLabel label="OFF DUTY" withLine />
            </FadeUp>
            <FadeUp delay={0.05}>
              <p className="mt-6 max-w-2xl font-mono text-[13px] leading-[1.85] text-sideband-text-secondary">
                What the building looks like outside the repos.
              </p>
            </FadeUp>
            <div className="mt-10">
              <LifestyleGallery images={engineer.lifestyle} />
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="mt-32">
          <FadeUp>
            <SectionLabel label="CONTACT" withLine />
          </FadeUp>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <FadeUp>
              <div className="max-w-md">
                <p className="font-display text-[28px] leading-tight text-sideband-text">
                  Want to build with {engineer.name.split(' ')[0]}?
                </p>
                <p className="mt-4 font-mono text-[13px] leading-[1.85] text-sideband-text-secondary">
                  Email is fastest. Resume, GitHub, and the rest are below.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <ContactPanel contact={engineer.contact} name={engineer.name} />
            </FadeUp>
          </div>
        </section>

        {/* NEXT ENGINEER */}
        {other && (
          <section className="mt-32 border-t border-sideband-border pb-24 pt-12">
            <FadeUp>
              <div className="flex flex-wrap items-baseline justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-muted">
                    NEXT DOSSIER
                  </p>
                  <p className="mt-2 font-display text-[36px] leading-tight text-sideband-text">
                    {other.name}
                    <span className="text-sideband-accent">.</span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-sideband-text-secondary">
                    {other.role}
                  </p>
                </div>
                <GlowButton variant="ghost" href={`/engineers/${other.id}`}>
                  Open Dossier →
                </GlowButton>
              </div>
            </FadeUp>
          </section>
        )}
      </div>
    </div>
  )
}
