import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import Eyebrow from '@/components/ui/Eyebrow'
import Badge from '@/components/ui/Badge'
import ArrowLink from '@/components/ui/ArrowLink'
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/ui/Icons'
import ExperienceTimeline from '@/components/engineers/ExperienceTimeline'
import GithubPanel from '@/components/engineers/GithubPanel'
import PortfolioViewer from '@/components/engineers/PortfolioViewer'
import ProjectsSection from '@/components/engineers/ProjectsSection'
import LifeGallery from '@/components/engineers/LifeGallery'
import { Education, Skills } from '@/components/engineers/EducationSkills'
import { Blocks, InlineText } from '@/components/engineers/Markdown'
import { engineers, getEngineerById, getOtherEngineer } from '@/lib/engineers'
import { engineerGithub } from '@/lib/engineers-github'
import { bioSection, readBio } from '@/lib/engineers-bio'
import { imageSizes } from '@/lib/engineers-media'
import {
  countWord,
  firstName,
  groupExperience,
  groupProjects,
  publishedLinks,
} from '@/lib/engineers-view'

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

export default function EngineerPage({ params }: { params: { id: string } }) {
  const engineer = getEngineerById(params.id)
  if (!engineer) notFound()

  const first = firstName(engineer)
  const gh = engineerGithub(engineer)
  const bio = readBio(engineer.id)
  const words = bio?.sections.find((s) => /^in \w+ words$/i.test(s.title))
  const now = bioSection(bio, 'Now')
  const offDuty = bioSection(bio, 'Off duty')
  const links = publishedLinks(engineer)
  const groups = groupExperience(engineer.experience ?? [])
  const projects = groupProjects(engineer.projects)
  const projectCount = engineer.projects?.length ?? 0
  const order = [
    projects.studio.length > 0 && 'Sideband products',
    projects.featured.length > 0 &&
      `the work ${first} features on a personal site`,
    projects.other.length > 0 && 'everything else',
  ].filter(Boolean) as string[]
  const projectsLede = `All ${projectCount} of ${first}'s projects${
    order.length > 1
      ? `: ${order[0]} first, then ${order.slice(1).join(', then ')}.`
      : '.'
  }`
  const lifestyle = engineer.lifestyle ?? []
  const next = getOtherEngineer(engineer.id)

  const meta = [
    { label: 'Based in', value: engineer.contact.location },
    { label: 'Availability', value: engineer.availability },
    {
      label: 'Speaks',
      value: engineer.spokenLanguages?.join(' and '),
    },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value))

  const interests =
    engineer.interests && engineer.interests.length > 0 ? (
      <ul aria-label="Interests" className="flex flex-wrap gap-2">
        {engineer.interests.map((i) => (
          <li key={i}>
            <Badge>{i}</Badge>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <>
      {/* Header */}
      <section aria-labelledby="engineer-name" className="pb-section pt-32">
        <Container>
          <Reveal trigger="mount">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-small text-sideband-muted">
                <li>
                  <Link
                    href="/engineers"
                    className="transition-colors duration-hover hover:text-sideband-text"
                  >
                    Engineers
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  aria-current="page"
                  className="text-sideband-text-secondary"
                >
                  {engineer.name}
                </li>
              </ol>
            </nav>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
            <div className="min-w-0">
              <Reveal trigger="mount" delay={70}>
                <Eyebrow>{engineer.role}</Eyebrow>
              </Reveal>
              <Reveal trigger="mount" delay={140}>
                <h1
                  id="engineer-name"
                  className="mt-5 text-display text-sideband-text"
                >
                  {engineer.name}
                </h1>
              </Reveal>
              <Reveal trigger="mount" delay={210}>
                <p className="mt-8 max-w-prose text-lead text-sideband-text-secondary">
                  {engineer.shortBio}
                </p>
              </Reveal>

              {meta.length > 0 && (
                <Reveal trigger="mount" delay={280}>
                  <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-3">
                    {meta.map((m) => (
                      <div key={m.label}>
                        <dt className="text-small text-sideband-muted">
                          {m.label}
                        </dt>
                        <dd className="mt-1 text-body text-sideband-text">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}

              <Reveal trigger="mount" delay={350}>
                <h2 className="sr-only">Links</h2>
                <ul className="mt-10 grid gap-2 sm:grid-cols-2">
                  {links.map((l) => (
                    <li key={l.label} className="min-w-0">
                      <a
                        href={l.href}
                        {...(l.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex h-full items-center gap-4 rounded-inner bg-sideband-surface px-4 py-3 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2"
                      >
                        <span className="w-[4.75rem] shrink-0 text-small text-sideband-muted">
                          {l.label}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-small text-sideband-text">
                          {l.value}
                        </span>
                        {l.external ? (
                          <ArrowUpRightIcon
                            size={13}
                            className="shrink-0 text-sideband-muted transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        ) : (
                          <ArrowRightIcon
                            size={13}
                            className="shrink-0 text-sideband-muted transition-transform duration-hover ease-out group-hover:translate-x-1"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
              {now && (
                <Reveal trigger="mount" delay={420}>
                  <h2 className="mt-12 text-body font-medium text-sideband-text">
                    Now
                  </h2>
                  <Blocks
                    blocks={now.blocks}
                    className="mt-4 [&_li]:text-small [&_li]:text-sideband-text-secondary [&_ul]:grid [&_ul]:gap-x-8 [&_ul]:space-y-0 [&_ul]:gap-y-3 sm:[&_ul]:grid-cols-2"
                  />
                </Reveal>
              )}
            </div>

            <div className="flex flex-col gap-10">
              {engineer.portrait && (
                <Reveal trigger="mount" delay={210}>
                  <Image
                    src={engineer.portrait.src}
                    alt={`${engineer.name}, portrait`}
                    width={engineer.portrait.width}
                    height={engineer.portrait.height}
                    priority
                    sizes="(min-width: 1024px) 416px, (min-width: 640px) 60vw, 100vw"
                    className="aspect-[4/5] w-full rounded-panel bg-sideband-surface object-cover sm:max-w-[26rem]"
                  />
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* GitHub */}
      {gh && (
        <Section labelledBy="github-title" className="!pt-0">
          <SectionHeading
            id="github-title"
            title="On GitHub"
            lede={`${first}'s public activity, languages and pinned work, from the studio's GitHub snapshot.`}
          />
          <div className="mt-14">
            <GithubPanel gh={gh} accent={engineer.accentColor} first={first} />
          </div>
        </Section>
      )}

      {/* Portfolio */}
      {engineer.portfolio && (
        <Section labelledBy="portfolio-title">
          <SectionHeading
            id="portfolio-title"
            title={`${first}'s own site`}
            lede={engineer.portfolio.summary}
            actions={
              <ArrowLink href={engineer.portfolio.url} external>
                Visit{' '}
                {engineer.portfolio.url
                  .replace(/^https?:\/\/(www\.)?/, '')
                  .replace(/\/$/, '')}
              </ArrowLink>
            }
          />
          <div className="mt-14">
            <PortfolioViewer
              pages={engineer.portfolio.pages}
              first={first}
              idPrefix={`${engineer.id}-portfolio`}
            />
          </div>
        </Section>
      )}

      {/* Bio */}
      <Section labelledBy="bio-title" tone="surface">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 id="bio-title" className="text-head text-sideband-text">
                About {first}
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <div className="mt-10 max-w-prose space-y-5 text-body text-sideband-text">
                {engineer.longBio.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="flex flex-col gap-12">
            {bio?.quote && (
              <Reveal delay={70}>
                <blockquote className="text-lead font-medium text-sideband-text">
                  <InlineText content={bio.quote} />
                </blockquote>
              </Reveal>
            )}
            {words && (
              <Reveal delay={140}>
                <h3 className="text-body font-medium text-sideband-text">
                  {words.title}
                </h3>
                <Blocks
                  blocks={words.blocks}
                  className="mt-4 text-sideband-text-secondary"
                />
              </Reveal>
            )}
            {offDuty && lifestyle.length === 0 && (
              <Reveal delay={210}>
                <h3 className="text-body font-medium text-sideband-text">
                  Off duty
                </h3>
                <Blocks
                  blocks={offDuty.blocks}
                  className="mt-4 text-sideband-text-secondary"
                />
                {interests && <div className="mt-5">{interests}</div>}
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* Experience */}
      {groups.length > 0 && (
        <Section labelledBy="experience-title">
          <SectionHeading
            id="experience-title"
            title="Experience"
            lede={`${groups.reduce((n, g) => n + g.roles.length, 0)} roles at ${groups.length} ${groups.length === 1 ? 'organization' : 'organizations'}, newest first.`}
          />
          <div className="mt-14">
            <ExperienceTimeline groups={groups} />
          </div>
        </Section>
      )}

      {/* Projects */}
      {projectCount > 0 && (
        <Section labelledBy="projects-title">
          <SectionHeading
            id="projects-title"
            title="Projects"
            lede={projectsLede}
          />
          <div className="mt-14">
            <ProjectsSection groups={projects} first={first} />
          </div>
        </Section>
      )}

      {/* Education and skills */}
      {((engineer.education?.length ?? 0) > 0 ||
        (engineer.skills?.length ?? 0) > 0) && (
        <Section labelledBy="education-title" tone="surface">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {engineer.education && engineer.education.length > 0 && (
              <div>
                <Reveal>
                  <h2
                    id="education-title"
                    className="text-head text-sideband-text"
                  >
                    Education
                  </h2>
                </Reveal>
                <div className="mt-10">
                  <Education entries={engineer.education} />
                </div>
              </div>
            )}
            {engineer.skills && engineer.skills.length > 0 && (
              <div>
                <Reveal>
                  <h2 className="text-head text-sideband-text">Skills</h2>
                </Reveal>
                <Reveal delay={70} className="mt-10">
                  <Skills groups={engineer.skills} />
                </Reveal>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Off duty, with photos */}
      {lifestyle.length > 0 && (
        <Section labelledBy="life-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <Reveal>
              <h2 id="life-title" className="text-head text-sideband-text">
                Off duty
              </h2>
            </Reveal>
            <Reveal delay={70} className="flex flex-col gap-6">
              {offDuty && (
                <Blocks
                  blocks={offDuty.blocks}
                  className="text-sideband-text-secondary"
                />
              )}
              {interests}
            </Reveal>
          </div>
          <div className="mt-14">
            <LifeGallery
              images={lifestyle}
              sizes={imageSizes(lifestyle.map((l) => l.src))}
            />
          </div>
        </Section>
      )}

      {/* Next engineer */}
      {next && next.id !== engineer.id && (
        <Section labelledBy="next-title" spacing="tight" className="pb-section">
          <h2 id="next-title" className="sr-only">
            Next engineer
          </h2>
          <Link
            href={`/engineers/${next.id}`}
            className="group flex items-center gap-6 rounded-panel bg-sideband-surface p-6 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2 md:p-8"
          >
            {next.portrait && (
              <Image
                src={next.portrait.src}
                alt=""
                width={160}
                height={160}
                className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-small text-sideband-muted">
                Next of {countWord(engineers.length)} engineers
              </span>
              <span className="mt-1 block text-head text-sideband-text">
                {next.name}
              </span>
              <span className="mt-2 block text-small text-sideband-text-secondary">
                {next.role}
              </span>
            </span>
            <ArrowRightIcon
              size={24}
              className="shrink-0 text-sideband-text-secondary transition-transform duration-hover ease-out group-hover:translate-x-1"
            />
          </Link>
        </Section>
      )}
    </>
  )
}
