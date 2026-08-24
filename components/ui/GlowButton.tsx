'use client'

import Link from 'next/link'

interface GlowButtonProps {
  children: React.ReactNode
  variant: 'filled' | 'ghost'
  color?: string
  href?: string
  onClick?: () => void
  external?: boolean
  className?: string
  disabled?: boolean
}

export default function GlowButton({
  children,
  variant,
  color = '#A855F7',
  href,
  onClick,
  external = false,
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const baseStyles =
    'inline-flex items-center gap-2 rounded-none px-5 py-2.5 font-mono text-[13px] uppercase tracking-[0.1em] transition-all duration-200'

  const variantStyles =
    variant === 'filled'
      ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
      : 'hover:text-black'

  const combinedClassName = `${baseStyles} ${variantStyles} ${className}`.trim()

  const style: Record<string, string> =
    variant === 'filled'
      ? {
          backgroundColor: color,
          color: '#000',
        }
      : {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: color,
          color: color,
        }

  const hoverHandler = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'ghost') {
      const el = e.currentTarget
      el.style.backgroundColor = color
      el.style.color = '#000'
    }
  }

  const leaveHandler = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'ghost') {
      const el = e.currentTarget
      el.style.backgroundColor = 'transparent'
      el.style.color = color
    }
  }

  const props = {
    className: combinedClassName,
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
      onClick={onClick}
      disabled={disabled}
      {...props}
      className={`${combinedClassName} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}
