'use client'

import { products } from '@/lib/products'
import ProductCard from '@/components/products/ProductCard'
import SectionLabel from '@/components/ui/SectionLabel'
import FadeUp from '@/components/animations/FadeUp'

export default function ProductGrid() {
  return (
    <section className="bg-eternal-black py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeUp>
          <SectionLabel label="WHAT WE BUILD" withLine />
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
