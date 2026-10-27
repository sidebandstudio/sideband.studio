import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/products/ProductDetail'
import { getProductById, products, rankedProducts } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export const dynamicParams = false

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const product = getProductById(params.id)
  if (!product) return { title: 'Product not found · Sideband' }

  // The first screenshot the product lists is its preview.
  const preview =
    product.images.find((image) => image.kind === 'screenshot') ??
    product.images[0]

  return {
    title: `${product.name} · ${product.category} · Sideband`,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name}: ${product.tagline}`,
      description: product.description,
      url: `/products/${product.id}`,
      type: 'website',
      images: [
        {
          url: preview.src,
          width: preview.width,
          height: preview.height,
          alt: preview.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name}: ${product.tagline}`,
      description: product.description,
      images: [preview.src],
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const ranked = rankedProducts()
  const index = ranked.findIndex((r) => r.product.id === params.id)
  if (index === -1) notFound()

  return (
    <ProductDetail
      ranked={ranked[index]}
      total={ranked.length}
      previous={ranked[index - 1] ?? null}
      next={ranked[index + 1] ?? null}
    />
  )
}
