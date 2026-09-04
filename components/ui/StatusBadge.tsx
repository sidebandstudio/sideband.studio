import { ProductStatus } from '@/lib/products'

interface StatusBadgeProps {
  status: ProductStatus
}

const MAP: Record<ProductStatus, { dot: string; label: string }> = {
  LIVE: { dot: 'bg-sideband-accent-2', label: 'Live' },
  'IN DEVELOPMENT': { dot: 'bg-sideband-accent', label: 'In development' },
  'COMING SOON': { dot: 'bg-sideband-muted', label: 'Coming soon' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { dot, label } = MAP[status] ?? MAP['COMING SOON']

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-sideband-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
