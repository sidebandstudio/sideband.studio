import Link from 'next/link'
import type { ReactNode } from 'react'

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  external?: boolean
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,border-color,color] duration-[180ms] ease-out'

const VARIANT = {
  primary:
    'bg-sideband-text font-semibold text-[#09090b] hover:-translate-y-px hover:bg-white active:translate-y-0',
  ghost:
    'border border-sideband-border text-sideband-text-secondary hover:border-sideband-border-strong hover:bg-white/[0.02] hover:text-sideband-text',
}

const SIZE = {
  md: 'rounded-lg px-[18px] py-2.5 text-[14px]',
  lg: 'rounded-[10px] px-[22px] py-3.5 text-[15px]',
}

export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  external = false,
  className = '',
}: ButtonProps) {
  const cls = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
