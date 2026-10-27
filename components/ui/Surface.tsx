import Link from 'next/link'
import type { ElementType, ReactNode } from 'react'
import { cx } from './cx'

interface SurfaceProps {
  children: ReactNode
  /**
   * `1` (default) is one tone above the ground. `2` is for a panel on a
   * `tone="surface"` section. Never nest one surface inside another.
   */
  tone?: 1 | 2
  padding?: 'none' | 'md' | 'lg'
  /** Makes the whole surface a link with a hover lift in tone. */
  href?: string
  external?: boolean
  as?: ElementType
  className?: string
}

const TONE = {
  1: 'bg-sideband-surface',
  2: 'bg-sideband-surface-2',
}

const HOVER = {
  1: 'hover:bg-sideband-surface-2',
  2: 'hover:bg-sideband-surface-3',
}

const PADDING = {
  none: '',
  md: 'p-6',
  lg: 'p-6 md:p-10',
}

/**
 * The card. A flat panel one tone step up with the panel radius. No border,
 * no shadow, no gradient. See DESIGN.md -> Surfaces.
 */
export default function Surface({
  children,
  tone = 1,
  padding = 'md',
  href,
  external = false,
  as: Tag = 'div',
  className,
}: SurfaceProps) {
  const cls = cx(
    'relative block overflow-hidden rounded-panel',
    TONE[tone],
    PADDING[padding],
    href && cx('transition-colors duration-hover ease-standard', HOVER[tone]),
    className,
  )

  if (!href) return <Tag className={cls}>{children}</Tag>
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
