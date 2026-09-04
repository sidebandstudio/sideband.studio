'use client'

import Link from 'next/link'

const ACCENT = '#A855F7'

interface GlowButtonProps {
  children: React.ReactNode
  variant: 'filled' | 'ghost'
  href?: string
  external?: boolean
  disabled?: boolean
}

export default function GlowButton({
  children,
  variant,
  href,
  external = false,
  disabled = false,
}: GlowButtonProps) {
  const baseStyles =
    'inline-flex items-center gap-2 rounded-none px-5 py-2.5 font-mono text-[13px] uppercase tracking-[0.1em] transition-all duration-200'

  const variantStyles =
    variant === 'filled'
      ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
      : 'hover:text-black'

  const className = `${baseStyles} ${variantStyles}`

  const style: Record<string, string> =
    variant === 'filled'
      ? {
          backgroundColor: ACCENT,
          color: '#000',
        }
      : {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: ACCENT,
          color: ACCENT,
        }

  const hoverHandler = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'ghost') {
      const el = e.currentTarget
      el.style.backgroundColor = ACCENT
      el.style.color = '#000'
    }
  }

  const leaveHandler = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'ghost') {
      const el = e.currentTarget
      el.style.backgroundColor = 'transparent'
      el.style.color = ACCENT
    }
  }

  const props = {
    className,
    style,
    onMouseEnter: hoverHandler,
    onMouseLeave: leaveHandler,
  }

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button
      disabled={disabled}
      {...props}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}
