import type { ProductClient } from '@/lib/products'
import Badge from './Badge'

/**
 * Marks a product built for a client business, beside its StatusBadge.
 * Renders nothing for Sideband's own products.
 */
export default function ClientBadge({
  client,
  className,
}: {
  client?: ProductClient | null
  className?: string
}) {
  if (!client) return null
  return <Badge className={className}>Client app for {client.name}</Badge>
}
