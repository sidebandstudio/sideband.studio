import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRightIcon } from '@/components/ui/Icons'
import type { Engineer } from '@/lib/engineers'
import type { Product } from '@/lib/products'
import { cx } from '@/components/ui/cx'
import { formatCount, type EngineerGithub } from '@/lib/engineers-github'

/** Weekly contribution totals as bars, oldest on the left. Decorative: the figures sit beside it. */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values)
  const bar = 4
  const gap = 2
  const h = 40
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${values.length * (bar + gap)} ${h}`}
      preserveAspectRatio="none"
      className="block h-10 w-full"
    >
      {values.map((v, i) => {
        const height = v === 0 ? 2 : Math.max(3, (v / max) * h)
        return (
          <rect
            key={i}
            x={i * (bar + gap)}
            y={h - height}
            width={bar}
            height={height}
            rx={1}
            style={{
              fill:
                v === 0 ? 'var(--sideband-surface-3)' : 'var(--graph-accent)',
            }}
          />
        )
      })}
    </svg>
  )
}

interface EngineerCardProps {
  engineer: Engineer
  gh: EngineerGithub | null
  weekly: number[]
  products: Product[]
  /** Stars on the repositories of the Sideband products they build. */
  productStars: number
  /** Fill a whole row: who they are on the left, their GitHub signal on the right. */
  wide?: boolean
}

/** An engineer on the index: who they are, what they build here, and their GitHub signal. */
export default function EngineerCard({
  engineer,
  gh,
  weekly,
  products,
  productStars,
  wide = false,
}: EngineerCardProps) {
  const stats = gh
    ? [
        { label: 'Contributions', value: gh.summary.total },
        { label: 'Followers', value: gh.followers },
        { label: 'Public repos', value: gh.publicRepos },
        { label: 'Stars on own repos', value: gh.stars },
      ]
    : []

  return (
    <article
      className={cx(
        'group relative flex h-full flex-col rounded-panel bg-sideband-surface p-6 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2 md:p-8',
        wide && 'lg:grid lg:grid-cols-2 lg:gap-x-16',
      )}
      style={{ '--graph-accent': engineer.accentColor } as CSSProperties}
    >
      <div>
        <div className="grid grid-cols-[6.5rem_1fr] gap-5 sm:grid-cols-[9rem_1fr] sm:gap-7">
          {engineer.portrait ? (
            <Image
              src={engineer.portrait.src}
              alt=""
              width={engineer.portrait.width}
              height={engineer.portrait.height}
              sizes="144px"
              className="aspect-[4/5] w-full rounded-inner bg-sideband-surface-2 object-cover"
            />
          ) : (
            <span className="aspect-[4/5] w-full rounded-inner bg-sideband-surface-2" />
          )}
          <div className="min-w-0">
            <h2 className="text-lead font-medium text-sideband-text">
              <Link
                href={`/engineers/${engineer.id}`}
                className="after:absolute after:inset-0 after:rounded-panel"
              >
                {engineer.name}
              </Link>
            </h2>
            <p className="mt-1 text-small text-sideband-text-secondary">
              {engineer.role}
            </p>
            {engineer.contact.location && (
              <p className="mt-1 text-small text-sideband-muted">
                {engineer.contact.location}
              </p>
            )}
            <p className="mt-4 hidden text-body text-sideband-text sm:block">
              {engineer.shortBio}
            </p>
          </div>
        </div>
        <p className="mt-5 text-body text-sideband-text sm:hidden">
          {engineer.shortBio}
        </p>

        {products.length > 0 && (
          <div className="mt-8">
            <h3 className="text-small text-sideband-muted">
              Builds at Sideband
              <span className="text-sideband-text-secondary">
                {' · '}
                {formatCount(productStars)}{' '}
                {productStars === 1 ? 'star' : 'stars'} on these products&apos;
                repos
              </span>
            </h3>
            <ul className="relative z-10 mt-3 flex flex-wrap gap-2">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-sideband-surface-2 pl-1.5 pr-3.5 text-small text-sideband-text transition-colors duration-hover hover:bg-sideband-surface-3"
                  >
                    {p.icon ? (
                      <Image
                        src={p.icon.src}
                        alt=""
                        width={48}
                        height={48}
                        className="h-6 w-6 rounded-[6px]"
                      />
                    ) : (
                      <span className="h-6 w-1" />
                    )}
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className={cx(
          'mt-auto flex flex-col',
          wide && 'lg:mt-0 lg:justify-end',
        )}
      >
        {gh && (
          <div className={cx('pt-8', wide && 'lg:pt-0')}>
            <h3 className="sr-only">GitHub, last year</h3>
            <Sparkline values={weekly} />
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse justify-end gap-1"
                >
                  <dt className="text-small text-sideband-muted">{s.label}</dt>
                  <dd className="text-lead font-medium tabular-nums text-sideband-text">
                    {formatCount(s.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <span className="mt-8 inline-flex items-center gap-1.5 text-small font-medium text-sideband-text">
          Open dossier
          <ArrowRightIcon
            size={14}
            className="transition-transform duration-hover ease-out group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  )
}
