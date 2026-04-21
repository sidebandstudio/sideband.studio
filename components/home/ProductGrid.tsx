'use client'

import FadeUp from '@/components/animations/FadeUp'
import ProductCard from '@/components/products/ProductCard'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import { products } from '@/lib/products'

export default function ProductGrid() {
  return (
    <section style={{ padding: '96px 0' }}>
      <div className="inner">
        <FadeUp>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 40,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <SectionLabel label="PRODUCTS" />
              <h2
                className="font-display"
                style={{
                  fontSize: 42,
                  marginTop: 8,
                  color: 'var(--eternal-text)',
                }}
              >
                What we build
                <span style={{ color: 'var(--eternal-accent)' }}>.</span>
              </h2>
            </div>
            <GlowButton variant="ghost" href="/products">
              See all →
            </GlowButton>
          </div>
        </FadeUp>

        <div
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
