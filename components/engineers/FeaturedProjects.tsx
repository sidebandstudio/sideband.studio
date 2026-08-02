import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import type { FeaturedProject } from '@/lib/engineers'
import { getProductById } from '@/lib/products'

/** Internal projects point at /products/<id>; reuse that product's cover art. */
function coverFor(project: FeaturedProject): string | null {
  if (!project.internal) return null
  const id = project.href.split('/').filter(Boolean).pop()
  const cover = id ? getProductById(id)?.cardHero : undefined
  return cover && cover !== 'branded' ? cover : null
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[]
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const cover = coverFor(project)
  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      {cover && (
        <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden border border-eternal-border bg-eternal-surface-2">
          <Image
            src={cover}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-eternal-surface/70 to-transparent" />
        </div>
      )}

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[22px] leading-tight text-eternal-text">
          {project.name}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-eternal-muted transition-colors duration-200 group-hover:text-eternal-accent">
          {project.internal ? 'OPEN →' : project.source ? 'SOURCE ↗' : 'LIVE ↗'}
        </span>
      </div>
      <p className="mt-3 font-mono text-[12px] leading-[1.75] text-eternal-text-secondary">
        {project.blurb}
      </p>
      {project.tech && project.tech.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="border border-eternal-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-eternal-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  )

  const className =
    'group relative block border border-eternal-border bg-eternal-surface p-6 transition-all duration-300 hover:border-eternal-accent/60 hover:bg-eternal-surface-2'

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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((p, i) => (
        <FadeUp key={p.name} delay={i * 0.05}>
          <ProjectCard project={p} />
        </FadeUp>
      ))}
    </div>
  )
}
