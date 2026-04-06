import { ProductStatus } from '@/lib/products'

interface StatusBadgeProps {
  status: ProductStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<ProductStatus, string> = {
    LIVE: 'bg-eternal-accent text-black',
    'IN DEVELOPMENT':
      'border border-eternal-accent-cyan text-[#6366F1] bg-transparent',
    'COMING SOON':
      'border border-eternal-muted text-eternal-muted bg-transparent',
  }

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  )
}
