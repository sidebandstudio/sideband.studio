import type { ReactNode } from 'react'
import Eyebrow from './Eyebrow'
import Reveal from './Reveal'
import { cx } from './cx'

interface SectionHeadingProps {
  title: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  /** Id for the heading, so <Section labelledBy> can point at it. */
  id?: string
  /** `h2` (default). Use `h1` once per page, for the page title. */
  as?: 'h1' | 'h2'
  align?: 'start' | 'center'
  /** Actions (a Button or ArrowLink) set under the lede. */
  actions?: ReactNode
  /** Reveal on scroll (default) or play with the page-load sequence. */
  trigger?: 'scroll' | 'mount'
  className?: string
}

export default function SectionHeading({
  title,
  eyebrow,
  lede,
  id,
  as: Tag = 'h2',
  align = 'start',
  actions,
  trigger = 'scroll',
  className,
}: SectionHeadingProps) {
  const center = align === 'center'
  return (
    <header
      className={cx(
        'flex max-w-[46rem] flex-col',
        center && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal trigger={trigger}>
          <Eyebrow className={cx('mb-5', center && 'justify-center')}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal trigger={trigger} delay={70}>
        <Tag
          id={id}
          className={cx(
            'text-sideband-text',
            Tag === 'h1' ? 'text-display' : 'text-head',
          )}
        >
          {title}
        </Tag>
      </Reveal>
      {lede && (
        <Reveal trigger={trigger} delay={140}>
          <p
            className={cx(
              'mt-6 max-w-prose text-lead text-sideband-text-secondary',
              center && 'mx-auto',
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
      {actions && (
        <Reveal trigger={trigger} delay={210}>
          <div
            className={cx(
              'mt-9 flex flex-wrap items-center gap-x-6 gap-y-4',
              center && 'justify-center',
            )}
          >
            {actions}
          </div>
        </Reveal>
      )}
    </header>
  )
}
