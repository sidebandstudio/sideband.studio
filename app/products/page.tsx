import type { Metadata } from 'next'
import ProductsShowcase from '@/components/products/ProductsShowcase'

export default function ProductsPage() {
  return <ProductsShowcase />
}

export const metadata: Metadata = {
  title: 'Products · Sideband',
  description:
    'Six products across desktop, mobile, and browser. Four live, two in active development.',
}
