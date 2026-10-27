import type { ReactNode } from 'react'
import { cx } from './cx'

/**
 * A short label before a heading, marked by the two offset bands of the
 * Sideband mark. Sentence case, text face, never uppercase or monospace.
 */
export default function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cx(
        'flex items-center gap-2.5 text-small font-medium text-sideband-text-secondary',
        className,
      )}
    >
      <BandGlyph />
      {children}
    </p>
  )
}

/** The mark reduced to two offset bars: accent above, violet below. */
export function BandGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx('relative block h-2.5 w-3.5 shrink-0', className)}
    >
      <span className="absolute left-0 top-0 h-[4px] w-[9px] rounded-[1.5px] bg-sideband-accent" />
      <span className="absolute bottom-0 right-0 h-[4px] w-[9px] rounded-[1.5px] bg-sideband-violet" />
    </span>
  )
}
