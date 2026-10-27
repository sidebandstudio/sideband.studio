import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons'
import { cx } from './cx'

interface ArrowLinkProps {
  href: string
  children: ReactNode
  /** Opens in a new tab and shows the up-right arrow. */
  external?: boolean
  /** `default` is ink. `muted` sits in secondary ink until hovered. */
  tone?: 'default' | 'muted'
  className?: string
}

/**
 * A text link with an arrow that steps forward on hover. Use it for "see
 * more" style links and next to a primary Button, never for a primary action.
 */
export default function ArrowLink({
  href,
  children,
  external = false,
  tone = 'default',
  className,
}: ArrowLinkProps) {
  const cls = cx(
    'group inline-flex items-center gap-1.5 font-medium transition-colors duration-hover ease-standard',
    tone === 'default'
      ? 'text-sideband-text hover:text-white'
      : 'text-sideband-text-secondary hover:text-sideband-text',
    className,
  )
  const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon
  const content = (
    <>
      {children}
      <Arrow
        size={14}
        className={cx(
          'shrink-0 transition-transform duration-hover ease-out',
          external
            ? 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
            : 'group-hover:translate-x-1',
        )}
      />
    </>
  )

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  )
}
