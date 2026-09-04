import Image from 'next/image'
import Link from 'next/link'
import { type Engineer } from '@/lib/engineers'

export default function EngineerCard({ engineer }: { engineer: Engineer }) {
  const portraitSrc = engineer.portrait?.src

  return (
    <Link
      href={`/engineers/${engineer.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-sideband-border bg-white/[0.015] transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sideband-accent"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-sideband-border bg-[#0a0913]">
        {portraitSrc ? (
          <Image
            src={portraitSrc}
            alt={`${engineer.name}, ${engineer.role}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="display text-[96px] text-sideband-text/20">
              {engineer.initials}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-sideband-text">
            {engineer.name}
          </h3>
          <span className="font-mono text-[11px] text-sideband-muted transition-colors duration-200 group-hover:text-sideband-text">
            &rarr;
          </span>
        </div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
          {engineer.role}
        </p>
        <p className="pt-1 text-pretty text-[14px] leading-[1.5] text-sideband-text-secondary">
          {engineer.shortBio}
        </p>
      </div>
    </Link>
  )
}
