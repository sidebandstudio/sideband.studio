import type { ProductStatus } from '@/lib/products'
import Badge from './Badge'
import { cx } from './cx'

const STATUS: Record<string, { label: string; dot: string }> = {
  LIVE: { label: 'Live', dot: 'bg-sideband-ok' },
  'IN DEVELOPMENT': { label: 'In development', dot: 'bg-sideband-warn' },
  'COMING SOON': { label: 'Coming soon', dot: 'bg-sideband-muted' },
}

/** A product's release state, from lib/products.ts. The dot carries the colour. */
export default function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus
  className?: string
}) {
  const { label, dot } = STATUS[status] ?? {
    label: status,
    dot: 'bg-sideband-muted',
  }
  return (
    <Badge className={className}>
      <span
        aria-hidden="true"
        className={cx('h-1.5 w-1.5 rounded-full', dot)}
      />
      {label}
    </Badge>
  )
}
