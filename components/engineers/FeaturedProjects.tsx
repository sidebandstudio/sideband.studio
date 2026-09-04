import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import Tag from '@/components/ui/Tag'
import type { FeaturedProject } from '@/lib/engineers'
import { getProductById } from '@/lib/products'

/** Internal projects point at /products/<id>; reuse that product's cover art. */
function coverFor(project: FeaturedProject): string | null {
  if (!project.internal) return null
  const id = project.href.split('/').filter(Boolean).pop()
  return (id && getProductById(id)?.cardHero) || null
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[]
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const cover = coverFor(project)
  const inner = (
    <>
      {cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-sideband-border bg-sideband-surface">
          <Image
            src={cover}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover mix-blend-lighten transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1.5 p-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-sideband-text">
            {project.name}
          </h3>
          <span className="whitespace-nowrap font-mono text-[11px] text-sideband-muted transition-colors duration-200 group-hover:text-sideband-text">
            {project.internal
              ? 'Open →'
              : project.source
                ? 'Source ↗'
                : 'Live ↗'}
          </span>
        </div>
        <p className="text-pretty text-[14px] leading-[1.5] text-sideband-text-secondary">
          {project.blurb}
        </p>
        {project.tech && project.tech.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {project.tech.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        )}
      </div>
    </>
  )

  const className =
    'group flex h-full flex-col overflow-hidden rounded-xl border border-sideband-border bg-white/[0.015] transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/[0.03]'

  if (project.internal) {
    return (
      <Link href={project.href} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {inner}
    </a>
  )
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((p, i) => (
        <FadeUp key={p.name} delay={i * 0.05} className="h-full">
          <ProjectCard project={p} />
        </FadeUp>
      ))}
    </div>
  )
}
