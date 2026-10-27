import type { ElementType, ReactNode } from 'react'
import { cx } from './cx'

interface ContainerProps {
  children: ReactNode
  /** `wide` (default) is the page frame. `narrow` is for forms and long reading. */
  size?: 'wide' | 'narrow'
  as?: ElementType
  className?: string
}

/** The page frame: one max width and one pair of gutters, used everywhere. */
export default function Container({
  children,
  size = 'wide',
  as: Tag = 'div',
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cx(
        'mx-auto w-full px-gutter',
        size === 'wide' ? 'max-w-container' : 'max-w-narrow',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
