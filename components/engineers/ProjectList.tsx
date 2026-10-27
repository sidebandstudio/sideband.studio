import Link from 'next/link'
import type { FeaturedProject } from '@/lib/engineers'

interface ProjectListProps {
  projects: FeaturedProject[]
}

/** Compact rows for the projects that are not featured. */
export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="divide-y divide-sideband-border border-y border-sideband-border">
      {projects.map((p) => {
        const name = p.href ? (
          p.internal ? (
            <Link
              href={p.href}
              className="transition-colors hover:text-sideband-accent focus-visible:text-sideband-accent"
            >
              {p.name} →
            </Link>
          ) : (
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sideband-accent focus-visible:text-sideband-accent"
            >
              {p.name} ↗
            </a>
          )
        ) : (
          p.name
        )
        return (
          <li
            key={p.name}
            className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[240px_1fr] md:gap-8"
          >
            <h3 className="font-display text-[17px] leading-snug text-sideband-text">
              {name}
            </h3>
            <div>
              <p className="font-mono text-[12px] leading-[1.75] text-sideband-text-secondary">
                {p.blurb}
              </p>
              {p.tech && p.tech.length > 0 && (
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-sideband-muted">
                  {p.tech.join(' · ')}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
