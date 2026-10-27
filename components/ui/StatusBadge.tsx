import type { ProductStatus } from '@/lib/products'
import Badge from './Badge'
import { cx } from './cx'

const STATUS: Record<ProductStatus, { label: string; dot: string }> = {
  LIVE: { label: 'Live', dot: 'bg-sideband-ok' },
  'IN DEVELOPMENT': { label: 'In development', dot: 'bg-sideband-warn' },
}

/** A product's release state, from lib/products.ts. The dot carries the colour. */
export default function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus
  className?: string
}) {
  const { label, dot } = STATUS[status]
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
