import type { Metadata } from 'next'
import ProductsShowcase from '@/components/products/ProductsShowcase'
import { rankedProducts } from '@/lib/products'

export default function ProductsPage() {
  return <ProductsShowcase ranked={rankedProducts()} />
}

export const metadata: Metadata = {
  title: 'Products · Sideband',
  description:
    'Eleven products across desktop, mobile, browser, and the web. Eight live, three in active development.',
}
