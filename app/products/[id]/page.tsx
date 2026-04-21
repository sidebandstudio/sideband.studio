import { notFound } from 'next/navigation'
import ProductDetailPage from '@/components/products/ProductDetailPage'
import { getProductById, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailPage product={product} />
}
