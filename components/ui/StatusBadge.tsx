import { ProductStatus } from '@/lib/products'

interface StatusBadgeProps {
  status: ProductStatus
}

const MAP: Record<ProductStatus, { color: string; label: string }> = {
  LIVE: { color: '#4ade80', label: 'LIVE' },
  'IN DEVELOPMENT': { color: '#A855F7', label: 'IN DEV' },
  'COMING SOON': { color: '#8B82AA', label: 'SOON' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { color, label } = MAP[status] ?? MAP['COMING SOON']

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        border: `1px solid ${color}30`,
        background: `${color}12`,
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          boxShadow: status === 'LIVE' ? `0 0 6px ${color}` : 'none',
        }}
      />
      {label}
    </span>
  )
}
