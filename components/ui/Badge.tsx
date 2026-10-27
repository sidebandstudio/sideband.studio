import type { ReactNode } from 'react'
import { cx } from './cx'

interface BadgeProps {
  children: ReactNode
  /**
   * `neutral` (default) for tags such as a language or platform.
   * `product` tints with --product-accent, set by productAccentStyle().
   */
  tone?: 'neutral' | 'product'
  className?: string
}

/** A small filled label. Sentence case or the name as written, never tracked caps. */
export default function Badge({
  children,
  tone = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-small',
        tone === 'neutral'
          ? 'bg-sideband-surface-2 text-sideband-text-secondary'
          : 'bg-product-dim text-sideband-text',
        className,
      )}
    >
      {children}
    </span>
  )
}
