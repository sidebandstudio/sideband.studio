import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailPage from '@/components/products/ProductDetailPage'
import { getProductById, products, rankedProducts } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const product = getProductById(params.id)
  if (!product) return { title: 'Product not found · Sideband' }

  return {
    title: `${product.name} · ${product.tagline} · Sideband`,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} · Sideband`,
      description: product.description,
      url: `/products/${product.id}`,
      images: [{ url: product.images[0].src }],
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const ranked = rankedProducts().find((r) => r.product.id === params.id)

  if (!ranked) {
    notFound()
  }

  return <ProductDetailPage ranked={ranked} />
}
