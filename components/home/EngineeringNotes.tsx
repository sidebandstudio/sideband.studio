'use client'

import FadeUp from '@/components/animations/FadeUp'
import { products } from '@/lib/products'

export default function EngineeringNotes() {
  return (
    <section className="border-t border-sideband-border py-24">
      <div className="inner">
        <FadeUp>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
            Under the hood
          </span>
          <h2 className="display mb-11 mt-3.5 text-balance text-[clamp(32px,4vw,48px)]">
            How each one works
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3">
          {products.map((product, index) => (
            <FadeUp key={product.id} delay={Math.min(index, 2) * 0.05}>
              <div className="flex h-full flex-col gap-2 rounded-[10px] border border-sideband-border bg-white/[0.015] p-[18px]">
                <div className="text-[13px] font-semibold tracking-[-0.01em] text-sideband-text">
                  {product.name}
                </div>
                <p className="text-pretty text-[13px] leading-[1.55] tracking-[-0.003em] text-sideband-text-secondary">
                  {product.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
