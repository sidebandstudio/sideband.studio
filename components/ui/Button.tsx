import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant: 'filled' | 'ghost'
  size?: 'md' | 'sm'
  href?: string
  external?: boolean
  disabled?: boolean
}

const SIZE = {
  md: 'rounded-[10px] px-[22px] py-3.5 text-[15px]',
  sm: 'rounded-lg px-[18px] py-2.5 text-[14px]',
}

const VARIANT = {
  filled:
    'bg-sideband-accent-2 font-semibold text-[#09090b] hover:-translate-y-px hover:brightness-110',
  ghost:
    'border border-sideband-border font-medium text-sideband-text-secondary hover:border-sideband-border-strong hover:bg-white/[0.03] hover:text-sideband-text',
}

export default function Button({
  children,
  variant,
  size = 'md',
  href,
  external = false,
  disabled = false,
}: ButtonProps) {
  const className = `inline-flex items-center justify-center gap-2 transition-all duration-200 ${SIZE[size]} ${VARIANT[variant]}`

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button
      disabled={disabled}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  )
}
