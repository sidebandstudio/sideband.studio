import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import StatusBadge from '@/components/ui/StatusBadge'
import ArrowLink from '@/components/ui/ArrowLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'
import { ProductScene } from '@/components/products/scenes'
import type { FeaturedProject } from '@/lib/engineers'
import type { ProjectGroups } from '@/lib/engineers-view'
import type { CollapseTarget } from './ShowAll'

function Tech({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <ul aria-label="Built with" className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t}>
          <Badge>{t}</Badge>
        </li>
      ))}
    </ul>
  )
}

/** The links a project publishes: where it lives, and its source when that is separate. */
function ProjectLinks({ project }: { project: FeaturedProject }) {
  const links: { href: string; label: string }[] = []
  if (project.href && !project.internal)
    links.push({
      href: project.href,
      label: project.source ? 'Source' : 'Live site',
    })
  if (project.repo && project.repo !== project.href)
    links.push({ href: project.repo, label: 'Source' })
  if (links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-small">
      {links.map((l) => (
        <ArrowLink key={l.href} href={l.href} external tone="muted">
          {l.label}
          <span className="sr-only"> for {project.name}</span>
        </ArrowLink>
      ))}
    </div>
  )
}

const ORDER = ['studio', 'featured', 'ventures', 'other'] as const

/**
 * What a phone shows of the projects before "Show all": the first `budget`
 * projects in page order. Lists past the budget are shortened, and groups
 * after it are hidden whole, heading included.
 */
export function collapseProjects(
  groups: ProjectGroups,
  idPrefix: string,
  budget: number,
): CollapseTarget[] {
  const targets: CollapseTarget[] = []
  let left = budget
  for (const key of ORDER) {
    const n = groups[key].length
    if (n === 0) continue
    if (left === 0) targets.push({ id: `${idPrefix}-${key}-group`, keep: 0 })
    else if (n > left)
      targets.push({ id: `${idPrefix}-${key}-list`, keep: left })
    left = Math.max(0, left - n)
  }
  return targets
}

export default function ProjectsSection({
  groups,
  first,
  idPrefix,
}: {
  groups: ProjectGroups
  first: string
  /** Prefixes the ids of each group and list, for collapseProjects. */
  idPrefix: string
}) {
  const { studio, featured, ventures, other } = groups
  return (
    <div className="space-y-20">
      {studio.length > 0 && (
        <div id={`${idPrefix}-studio-group`}>
          <h3 className="text-lead font-medium text-sideband-text">
            At Sideband
          </h3>
          <ul
            id={`${idPrefix}-studio-list`}
            className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {studio.map(({ project, product }, i) => (
              <Reveal
                as="li"
                key={product.id}
                delay={(i % 3) * 70}
                className="group relative flex flex-col"
              >
                <ProductScene
                  id={product.id}
                  variant="card"
                  className="transition-transform duration-ui ease-out group-hover:-translate-y-1"
                />
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h4 className="text-lead font-medium text-sideband-text">
                    <Link
                      href={`/products/${product.id}`}
                      className="after:absolute after:inset-0 after:rounded-panel"
                    >
                      {project.name}
                    </Link>
                  </h4>
                  <StatusBadge status={product.status} />
                </div>
                <p className="mt-1.5 text-small text-sideband-muted">
                  {[project.role, product.category].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-3 text-body text-sideband-text-secondary">
                  {project.blurb}
                </p>
                <div className="mt-5">
                  <Tech items={project.tech} />
                </div>
                <div className="relative z-10 mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-small">
                  <span className="inline-flex items-center gap-1.5 font-medium text-sideband-text">
                    Product page
                    <ArrowRightIcon
                      size={14}
                      className="transition-transform duration-hover ease-out group-hover:translate-x-1"
                    />
                  </span>
                  {project.repo && (
                    <ArrowLink href={project.repo} external tone="muted">
                      Source
                      <span className="sr-only"> for {project.name}</span>
                    </ArrowLink>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      {featured.length > 0 && (
        <div id={`${idPrefix}-featured-group`}>
          <h3 className="text-lead font-medium text-sideband-text">
            Featured on {first}&apos;s site
          </h3>
          <ul
            id={`${idPrefix}-featured-list`}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            {featured.map((project, i) => (
              <Reveal
                as="li"
                key={project.name}
                delay={(i % 2) * 70}
                className={cx(
                  'flex flex-col rounded-panel bg-sideband-surface p-6 md:p-8',
                  // A lone last card takes the full row instead of leaving half of it empty.
                  i === featured.length - 1 &&
                    featured.length % 2 === 1 &&
                    'md:col-span-2 [&>p]:max-w-prose',
                )}
              >
                <h4 className="text-lead font-medium text-sideband-text">
                  {project.name}
                </h4>
                {project.role && (
                  <p className="mt-1.5 text-small text-sideband-muted">
                    {project.role}
                  </p>
                )}
                <p className="mt-3 text-body text-sideband-text-secondary">
                  {project.blurb}
                </p>
                <div className="mt-5">
                  <Tech items={project.tech} />
                </div>
                <div className="mt-auto pt-6">
                  {project.href || project.repo ? (
                    <ProjectLinks project={project} />
                  ) : (
                    <p className="text-small text-sideband-muted">
                      No public link
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      {ventures.length > 0 && (
        <div id={`${idPrefix}-ventures-group`}>
          <h3 className="text-lead font-medium text-sideband-text">
            {first}&apos;s own ventures, outside Sideband
          </h3>
          <p className="mt-2 max-w-prose text-body text-sideband-text-secondary">
            Companies {first} runs outside the studio. They are not Sideband
            products, and their figures are as {first} reports them.
          </p>
          <ul
            id={`${idPrefix}-ventures-list`}
            className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {ventures.map((project, i) => (
              <Reveal
                as="li"
                key={project.name}
                delay={(i % 3) * 70}
                className="flex flex-col rounded-panel bg-sideband-surface p-6 md:p-8"
              >
                <h4 className="text-lead font-medium text-sideband-text">
                  {project.name}
                </h4>
                <p className="mt-1.5 text-small text-sideband-muted">
                  {['Own venture', project.role].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-3 text-body text-sideband-text-secondary">
                  {project.blurb}
                </p>
                <p className="mt-5 text-small text-sideband-muted">
                  {project.tech?.join(', ')}
                </p>
                <div className="mt-auto pt-6">
                  {project.href || project.repo ? (
                    <ProjectLinks project={project} />
                  ) : (
                    <p className="text-small text-sideband-muted">
                      No public link
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      {other.length > 0 && (
        <div id={`${idPrefix}-other-group`}>
          <h3 className="text-lead font-medium text-sideband-text">
            Other work
          </h3>
          <ul
            id={`${idPrefix}-other-list`}
            className="mt-8 grid gap-x-10 gap-y-3 lg:grid-cols-2"
          >
            {other.map((project) => (
              <li
                key={project.name}
                className="flex flex-col gap-3 rounded-inner bg-sideband-surface px-5 py-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-body font-medium text-sideband-text">
                    {project.name}
                  </h4>
                  {project.role && (
                    <p className="text-small text-sideband-muted">
                      {project.role}
                    </p>
                  )}
                </div>
                <p className="text-small text-sideband-text-secondary">
                  {project.blurb}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <p className="text-small text-sideband-muted">
                    {project.tech?.join(', ')}
                  </p>
                  <ProjectLinks project={project} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
