import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from './cx'

interface ButtonProps {
  children: ReactNode
  /** Internal routes render a <Link>, anything else an <a>. No href renders a <button>. */
  href?: string
  /** Open in a new tab. For off-site links only, never for mailto. */
  external?: boolean
  /**
   * `primary`: white pill, one per screen, the action you want taken.
   * `secondary`: a tone-step pill next to a primary.
   * `ghost`: text-weight action in dense places (nav, card footers).
   */
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  className?: string
}

const BASE =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color,color] duration-hover ease-standard active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const VARIANT = {
  primary: 'bg-sideband-text text-sideband-black hover:bg-white',
  secondary:
    'bg-sideband-surface-2 text-sideband-text hover:bg-sideband-surface-3',
  ghost:
    'text-sideband-text-secondary hover:bg-white/[0.05] hover:text-sideband-text',
}

const SIZE = {
  md: 'h-10 px-[1.125rem] text-small',
  lg: 'h-12 px-6 text-[1rem]',
}

/** The site's one button. Pill shaped, neutral, flat. See DESIGN.md -> Components. */
export default function Button({
  children,
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  onClick,
  className,
}: ButtonProps) {
  const cls = cx(BASE, VARIANT[variant], SIZE[size], className)

  if (href === undefined) {
    return (
      <button type={type} disabled={disabled} onClick={onClick} className={cls}>
        {children}
      </button>
    )
  }

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
