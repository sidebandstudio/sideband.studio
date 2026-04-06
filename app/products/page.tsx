'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { products, ProductStatus } from '@/lib/products'
import ProductCard from '@/components/products/ProductCard'
import FadeUp from '@/components/animations/FadeUp'

type Filter = 'ALL' | ProductStatus

const filters: Filter[] = ['ALL', 'LIVE', 'IN DEVELOPMENT', 'COMING SOON']

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')

  const filtered =
    activeFilter === 'ALL'
      ? products
      : products.filter((p) => p.status === activeFilter)

  return (
    <div className="min-h-screen bg-eternal-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ PRODUCTS ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-eternal-text md:text-7xl">
            What we build<span className="text-eternal-accent">.</span>
          </h1>
          <p className="mt-4 max-w-lg font-mono text-[15px] text-eternal-text-secondary">
            Technically ambitious. Obsessively refined. Shipping on our own
            terms.
          </p>
        </FadeUp>

        {/* Filter Bar */}
        <FadeUp delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-eternal-accent text-black'
                    : 'border border-eternal-border text-eternal-text-secondary hover:border-eternal-accent/50 hover:text-eternal-text'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 pb-24 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
