import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant: 'filled' | 'ghost'
  href?: string
  external?: boolean
  disabled?: boolean
}

const BASE =
  'inline-flex items-center justify-center rounded-[10px] px-[22px] py-3.5 text-[15px] transition-all duration-200'

const VARIANT = {
  filled:
    'bg-sideband-text font-semibold text-[#09090b] hover:-translate-y-px hover:bg-white',
  ghost:
    'border border-sideband-border font-medium text-sideband-text-secondary hover:border-sideband-border-strong hover:bg-white/[0.03] hover:text-sideband-text',
}

export default function Button({
  children,
  variant,
  href,
  external = false,
  disabled = false,
}: ButtonProps) {
  const className = `${BASE} ${VARIANT[variant]}`

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
