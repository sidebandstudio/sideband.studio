import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products — Eternal Reverse',
  description:
    'Six products across desktop, mobile, and browser. Four live, two in active development.',
}

import ProductsShowcase from '@/components/products/ProductsShowcase'

export default function ProductsPage() {
  return <ProductsShowcase />
}
