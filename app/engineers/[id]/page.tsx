import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
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
  const portraitSrc = engineer.portrait?.src
  const indexLabel = `${engineerIndexLabel(engineer.id)} / ${engineerCountLabel}`

  return (
    <div className="min-h-screen bg-sideband-black pt-32">
      <div className="inner">
        {/* Breadcrumb */}
        <FadeUp>
          <Link
            href="/engineers"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-sideband-text-secondary transition-colors duration-200 hover:text-sideband-text"
          >
            &larr; Engineers
          </Link>
        </FadeUp>

        {/* HERO */}
        <section className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <FadeUp>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                Engineer dossier · {indexLabel}
              </span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="display mt-3.5 text-balance text-[clamp(44px,6vw,80px)]">
                {engineer.name}
                <span className="text-sideband-accent">.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-4 text-[17px] tracking-[-0.005em] text-sideband-text-secondary">
                {engineer.role}
              </p>
              {engineer.contact.location && (
                <p className="mt-2 font-mono text-[12px] text-sideband-muted">
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
                  <Button
                    variant="filled"
                    href={engineer.contact.resume}
                    external
                  >
                    Download resume &darr;
                  </Button>
                )}
                <Button
                  variant="ghost"
                  href={`mailto:${engineer.contact.email}`}
                >
                  Contact &rarr;
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* Portrait */}
          <FadeUp delay={0.1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-sideband-border bg-[#0a0913]">
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
                  <span className="display text-[160px] text-sideband-text/20">
                    {engineer.initials}
                  </span>
                </div>
              )}
            </div>
          </FadeUp>
        </section>

        {/* BIO */}
        <section className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <FadeUp>
            <SectionLabel label="Who" />
          </FadeUp>
          <div className="max-w-3xl space-y-6">
            {engineer.longBio.map((para, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <p className="text-pretty text-[17px] leading-[1.6] tracking-[-0.005em] text-sideband-text-secondary">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        {engineer.experience && engineer.experience.length > 0 && (
          <section className="mt-24">
            <FadeUp>
              <SectionLabel label="Experience" withLine />
            </FadeUp>
            <div className="mt-12">
              <ExperienceTimeline entries={engineer.experience} />
            </div>
          </section>
        )}

        {/* SKILLS */}
        {engineer.skills && engineer.skills.length > 0 && (
          <section className="mt-24">
            <FadeUp>
              <SectionLabel label="Stack" withLine />
            </FadeUp>
            <div className="mt-10">
              <SkillsCloud groups={engineer.skills} />
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {engineer.projects && engineer.projects.length > 0 && (
          <section className="mt-24">
            <FadeUp>
              <SectionLabel label="Featured work" withLine />
            </FadeUp>
            <div className="mt-10">
              <FeaturedProjects projects={engineer.projects} />
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {engineer.education && engineer.education.length > 0 && (
          <section className="mt-24">
            <FadeUp>
              <SectionLabel label="Education" withLine />
            </FadeUp>
            <div className="mt-10 space-y-6">
              {engineer.education.map((ed, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="border-l border-sideband-border pl-6">
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-sideband-text">
                      {ed.school}
                    </h3>
                    <p className="mt-0.5 text-[14px] text-sideband-text-secondary">
                      {ed.degree}
                    </p>
                    <p className="mt-2 font-mono text-[12px] text-sideband-muted">
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
          <section className="mt-24">
            <FadeUp>
              <SectionLabel label="Off duty" withLine />
            </FadeUp>
            <FadeUp delay={0.05}>
              <p className="mt-3 text-[15px] text-sideband-text-secondary">
                What the building looks like outside the repos.
              </p>
            </FadeUp>
            <div className="mt-10">
              <LifestyleGallery images={engineer.lifestyle} />
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="mt-24">
          <FadeUp>
            <SectionLabel label="Contact" withLine />
          </FadeUp>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <FadeUp>
              <div className="max-w-md">
                <p className="display text-[clamp(28px,3vw,36px)]">
                  Want to build with {engineer.name.split(' ')[0]}?
                </p>
                <p className="mt-3 text-[15px] leading-[1.6] text-sideband-text-secondary">
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
          <section className="mt-24 border-t border-sideband-border pb-24 pt-12">
            <FadeUp>
              <div className="flex flex-wrap items-baseline justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                    Next dossier
                  </p>
                  <p className="display mt-3 text-[clamp(28px,3vw,36px)]">
                    {other.name}
                    <span className="text-sideband-accent">.</span>
                  </p>
                  <p className="mt-1.5 text-[15px] text-sideband-text-secondary">
                    {other.role}
                  </p>
                </div>
                <Button variant="ghost" href={`/engineers/${other.id}`}>
                  Open dossier &rarr;
                </Button>
              </div>
            </FadeUp>
          </section>
        )}
      </div>
    </div>
  )
}
