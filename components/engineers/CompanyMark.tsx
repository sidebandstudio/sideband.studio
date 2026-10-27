import Image from 'next/image'
import { cx } from '@/components/ui/cx'

interface CompanyMarkProps {
  name: string
  logo?: string
  /** The mark is drawn for dark UI. Otherwise it sits on a light plate. */
  onDark?: boolean
  className?: string
}

/**
 * A company or school mark on a fixed plate, so wide wordmarks and square
 * icons line up. Dark-on-transparent marks get a light plate. Without a logo
 * it shows the organisation's initials.
 */
export default function CompanyMark({
  name,
  logo,
  onDark,
  className,
}: CompanyMarkProps) {
  const plate = cx(
    'flex h-14 w-28 shrink-0 items-center justify-center rounded-inner px-3 py-2.5',
    logo && !onDark ? 'bg-sideband-text' : 'bg-sideband-surface-2',
    className,
  )
  if (!logo) {
    const initials = name
      .split(/\s+/)
      .filter((w) => /^[A-Z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
    return (
      <span aria-hidden="true" className={plate}>
        <span className="text-lead font-medium text-sideband-text-secondary">
          {initials}
        </span>
      </span>
    )
  }
  return (
    <span className={plate}>
      <Image
        src={logo}
        alt={`${name} logo`}
        width={160}
        height={64}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
