'use client'

import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import { products, ProductStatus } from '@/lib/products'

const STATUS: Record<ProductStatus, { label: string; className: string }> = {
  LIVE: { label: 'Live', className: 'text-[#4ade80]' },
  'IN DEVELOPMENT': { label: 'In development', className: 'text-[#fbbf24]' },
  'COMING SOON': { label: 'Coming soon', className: 'text-eternal-muted' },
}

const LIVE = products.filter((p) => p.status === 'LIVE').length
const DEV = products.filter((p) => p.status === 'IN DEVELOPMENT').length

export default function ProductShowcase() {
  return (
    <section id="products" className="border-t border-eternal-border py-24">
      <div className="inner">
        <FadeUp>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-eternal-muted">
                Products
              </span>
              <h2 className="display mt-3.5 text-balance text-[clamp(32px,4vw,48px)]">
                What we build
              </h2>
              <p className="mt-3.5 max-w-[560px] text-pretty text-[17px] tracking-[-0.005em] text-eternal-text-secondary">
                <span className="font-semibold tabular-nums text-eternal-text">
                  {products.length}
                </span>{' '}
                products across desktop, browser, mobile, and full-stack:{' '}
                <span className="font-semibold tabular-nums text-eternal-text">
                  {LIVE}
                </span>{' '}
                live,{' '}
                <span className="font-semibold tabular-nums text-eternal-text">
                  {DEV}
                </span>{' '}
                in active development.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg border border-eternal-border px-[18px] py-2.5 text-[14px] font-medium text-eternal-text-secondary transition-colors duration-200 hover:border-eternal-border-strong hover:bg-white/[0.03] hover:text-eternal-text"
            >
              All products &rarr;
            </Link>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-3.5 min-[820px]:grid-cols-2">
          {products.map((product, index) => (
            <FadeUp key={product.id} delay={Math.min(index, 1) * 0.06}>
              <Link
                href={`/products/${product.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-eternal-border bg-white/[0.015] transition-colors duration-200 hover:border-eternal-border-strong hover:bg-white/[0.03]"
              >
                <div className="aspect-[16/10] border-b border-eternal-border bg-[#0a0913]">
                  <Image
                    src={product.cardHero}
                    alt={`${product.name} cover art`}
                    width={1000}
                    height={625}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 820px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-[18px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-eternal-text">
                      {product.name}
                    </h3>
                    <span
                      className={`whitespace-nowrap font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] ${STATUS[product.status].className}`}
                    >
                      {STATUS[product.status].label}
                    </span>
                  </div>
                  <p className="text-pretty text-[14px] leading-[1.5] tracking-[-0.003em] text-eternal-text-secondary">
                    {product.tagline}
                  </p>
                  <div className="mt-auto flex justify-between gap-3 pt-2 font-mono text-[11px] text-eternal-muted">
                    <span className="truncate">{product.tags.slice(0, 5).join(' · ')}</span>
                    {product.version ? <span>{product.version}</span> : null}
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
