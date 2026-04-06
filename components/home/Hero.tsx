'use client'

import { motion } from 'framer-motion'
import GlowButton from '@/components/ui/GlowButton'
import { products } from '@/lib/products'

const ease = [0.16, 1, 0.3, 1]

function Stagger({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const liveProducts = products.filter(
    (p) => p.version !== null,
  )

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-eternal-black">
      {/* Gradient Orb */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 animate-orb-float">
        <div
          className="h-full w-full rounded-full opacity-30 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, #A855F7 0%, #6366F1 60%, transparent 80%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        {/* Eyebrow */}
        <Stagger delay={0}>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ ETERNAL REVERSE &middot; EST. 2025 ]
          </span>
        </Stagger>

        {/* Headline */}
        <div className="mt-6">
          <Stagger delay={0.1}>
            <h1 className="font-display text-5xl leading-[0.95] text-eternal-text-secondary md:text-7xl lg:text-[88px]">
              Software that
            </h1>
          </Stagger>
          <Stagger delay={0.2}>
            <h1 className="font-display text-5xl font-bold leading-[0.95] text-eternal-text md:text-7xl lg:text-[88px]">
              endures
              <span className="text-eternal-accent">.</span>
            </h1>
          </Stagger>
        </div>

        {/* Subheadline */}
        <Stagger delay={0.35}>
          <p className="mt-8 max-w-lg font-mono text-[15px] leading-relaxed text-eternal-text-secondary">
            A two-person studio shipping technically ambitious products — for
            developers, athletes, and people who care about quality.
          </p>
        </Stagger>

        {/* CTAs */}
        <Stagger delay={0.5}>
          <div className="mt-10 flex flex-wrap gap-4">
            <GlowButton variant="filled" href="/products">
              View Products
            </GlowButton>
            <GlowButton variant="ghost" href="/about">
              Our Story &rarr;
            </GlowButton>
          </div>
        </Stagger>

        {/* Status Bar */}
        <Stagger delay={0.65}>
          <div className="mt-20 border-t border-eternal-border pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {liveProducts.map((product, i) => (
                <span key={product.id} className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-eternal-border bg-eternal-surface px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-eternal-accent" />
                    <span className="font-mono text-[11px] text-eternal-text-secondary">
                      {product.name}
                    </span>
                    {product.version && (
                      <span className="font-mono text-[10px] text-eternal-muted">
                        {product.version}
                      </span>
                    )}
                  </span>
                  {i < liveProducts.length - 1 && (
                    <span className="text-eternal-muted">&middot;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </Stagger>
      </div>
    </section>
  )
}
