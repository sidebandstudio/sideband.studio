import Image from 'next/image'
import Link from 'next/link'
import { engineerCountLabel, engineerIndexLabel, type Engineer } from '@/lib/engineers'

interface EngineerCardProps {
  engineer: Engineer
  compact?: boolean
}

export default function EngineerCard({ engineer, compact = false }: EngineerCardProps) {
  const portraitSrc = engineer.portrait?.src ?? engineer.portraitPlaceholder

  return (
    <Link
      href={`/engineers/${engineer.id}`}
      className="group relative block border border-eternal-border bg-eternal-surface transition-all duration-300 hover:border-eternal-accent/50 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eternal-accent"
    >
      {/* Corner ticks */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-eternal-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      <div className={`relative ${compact ? 'aspect-[4/3]' : 'aspect-[5/6]'} overflow-hidden bg-eternal-surface-2`}>
        {portraitSrc ? (
          <Image
            src={portraitSrc}
            alt={`${engineer.name} — ${engineer.role}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-[120px] italic text-eternal-text/30">
              {engineer.initials}
            </span>
          </div>
        )}
        {/* Bottom gradient veil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-eternal-surface via-eternal-surface/60 to-transparent" />

        {/* Floating chip */}
        <span className="absolute left-4 top-4 border border-eternal-border bg-eternal-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-eternal-accent backdrop-blur">
          [ {engineerIndexLabel(engineer.id)} / {engineerCountLabel} ]
        </span>
      </div>

      <div className="space-y-2 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[26px] leading-tight text-eternal-text">
            {engineer.name}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-eternal-muted transition-colors duration-200 group-hover:text-eternal-accent">
            VIEW →
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-eternal-accent">
          {engineer.role}
        </p>
        {!compact && (
          <p className="pt-1 font-mono text-[12px] leading-[1.75] text-eternal-text-secondary">
            {engineer.shortBio}
          </p>
        )}
      </div>
    </Link>
  )
}
