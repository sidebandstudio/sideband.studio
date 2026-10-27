import Button from '@/components/ui/Button'
import { cx } from '@/components/ui/cx'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { ArrowUpRightIcon, GitHubIcon, RepoIcon } from '@/components/ui/Icons'
import {
  countWord,
  type HomeData,
  type OpenRepo,
  type StudioFact,
} from '@/lib/home-data'

/**
 * The products whose own repo carries an OSI-approved license, and how the
 * studio ships: public repos and releases on GitHub. Every figure is derived.
 */
export default function OpenSource({
  repos,
  facts,
  org,
}: {
  repos: OpenRepo[]
  facts: StudioFact[]
  org: HomeData['org']
}) {
  const licenses = Array.from(new Set(repos.map((r) => r.license)))

  return (
    <Section id="open-source" labelledBy="open-source-title">
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-10 lg:col-span-5">
          <SectionHeading
            id="open-source-title"
            eyebrow="Open source"
            title={
              <>
                {countWord(repos.length, true)} of our products
                <br />
                are open source.
              </>
            }
            lede={`Their repos carry ${listJoin(licenses)} licenses, so you can read the code, build it yourself and change it.`}
            actions={
              <Button href={org.url} external variant="secondary">
                <GitHubIcon size={15} />
                github.com/{org.login}
              </Button>
            }
          />
        </div>

        <ul
          aria-label="Open-source repositories"
          className="flex min-w-0 flex-col gap-2 lg:col-span-7"
        >
          {repos.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 70}>
              <RepoRow repo={r} />
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="mt-20 md:mt-24">
        <Reveal>
          <h3 className="text-lead font-medium text-sideband-text">
            How we ship
          </h3>
        </Reveal>
        <ul className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal as="li" key={f.text} delay={i * 70}>
              <Fact fact={f} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function listJoin(items: string[]) {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

function Fact({ fact }: { fact: StudioFact }) {
  const body = (
    <>
      <span className="text-head tabular-nums text-sideband-text">
        {fact.value}
      </span>
      <span className="max-w-[22rem] text-body text-sideband-text-secondary transition-colors duration-hover ease-standard group-hover:text-sideband-text">
        {fact.text}
      </span>
    </>
  )
  const cls = 'flex flex-col gap-3'
  return fact.href ? (
    <a
      href={fact.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${cls}`}
    >
      {body}
    </a>
  ) : (
    <p className={cls}>{body}</p>
  )
}

function Stars({ stars, className }: { stars: number; className?: string }) {
  return (
    <span className={cx('text-small tabular-nums', className)}>
      {stars.toLocaleString('en-US')} {stars === 1 ? 'star' : 'stars'}
    </span>
  )
}

function RepoRow({ repo }: { repo: OpenRepo }) {
  const [owner, name] = repo.path.split('/')
  return (
    <a
      href={repo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-panel bg-sideband-surface p-4 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2 md:p-5"
    >
      <RepoIcon
        size={16}
        className="mt-1 shrink-0 text-sideband-text-secondary"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body font-medium text-sideband-text [overflow-wrap:anywhere]">
          {owner}/<wbr />
          {name}
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 text-small text-sideband-text-secondary">
          <span>{repo.license} license</span>
          {repo.language && <span>{repo.language}</span>}
          <span className="tabular-nums">
            {repo.commits.toLocaleString('en-US')} commits
          </span>
          <span>Last push {repo.pushedOn}</span>
          {repo.stars > 0 && <Stars stars={repo.stars} className="md:hidden" />}
        </span>
      </span>
      {repo.stars > 0 && (
        <Stars
          stars={repo.stars}
          className="mt-0.5 hidden shrink-0 text-sideband-muted md:inline"
        />
      )}
      <ArrowUpRightIcon
        size={14}
        className="mt-1 shrink-0 text-sideband-text-secondary transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  )
}
