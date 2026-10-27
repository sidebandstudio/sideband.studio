import type { ReactNode } from 'react'
import Container from './Container'
import { cx } from './cx'

interface SectionProps {
  children: ReactNode
  id?: string
  /** Id of the heading that names this section (SectionHeading's `id`). */
  labelledBy?: string
  /** `ground` (default) or `surface`, one tone up. Neighbours alternate at most once or twice per page. */
  tone?: 'ground' | 'surface'
  /** Vertical rhythm. `default` is the section gap, `tight` halves it, `none` for full-bleed stages. */
  spacing?: 'default' | 'tight' | 'none'
  /** Wrap children in <Container>. Turn off for full-bleed content. */
  contained?: boolean
  /** Decorative layer, usually a <Backdrop>, painted behind the content. */
  backdrop?: ReactNode
  className?: string
}

const SPACING = {
  default: 'py-section',
  tight: 'py-[calc(theme(spacing.section)/2)]',
  none: '',
}

export default function Section({
  children,
  id,
  labelledBy,
  tone = 'ground',
  spacing = 'default',
  contained = true,
  backdrop,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        'relative isolate',
        backdrop ? 'overflow-hidden' : null,
        tone === 'surface' ? 'bg-sideband-surface' : 'bg-sideband-black',
        SPACING[spacing],
        className,
      )}
    >
      {backdrop}
      {contained ? (
        <Container className="relative">{children}</Container>
      ) : (
        children
      )}
    </section>
  )
}
