'use client'

import Image from 'next/image'
import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import FadeUp from '@/components/animations/FadeUp'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import Tag from '@/components/ui/Tag'
import { products, type Product } from '@/lib/products'

const COUNT = products.length

function StackCard({
  product,
  index,
  progress,
  reduce,
}: {
  product: Product
  index: number
  progress: MotionValue<number>
  reduce: boolean
}) {
  // Each card shrinks a little once the next one starts sliding over it.
  const scale = useTransform(
    progress,
    [index / COUNT, 1],
    [1, 1 - (COUNT - index) * 0.035],
  )

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center">
      <motion.article
        style={{
          scale: reduce ? 1 : scale,
          top: `calc(-4vh + ${index * 22}px)`,
        }}
        className="relative grid h-[76vh] w-full origin-top grid-rows-[42%_1fr] overflow-hidden rounded-2xl border border-sideband-border bg-sideband-surface shadow-[0_-20px_80px_-30px_rgba(0,0,0,0.9)] min-[900px]:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] min-[900px]:grid-rows-1"
      >
        <div className="relative order-first min-[900px]:order-last">
          <Image
            src={product.cardHero}
            alt={`${product.name} cover art`}
            fill
            sizes="(min-width: 900px) 58vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sideband-surface via-transparent to-transparent min-[900px]:bg-gradient-to-r" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 min-[900px]:p-12">
          <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span className="h-px w-6 bg-sideband-border-strong" />
            <StatusBadge status={product.status} />
          </div>

          <div>
            <h3 className="display text-[clamp(32px,4.4vw,64px)]">
              {product.name}
            </h3>
            <p className="mt-4 max-w-[440px] text-pretty text-[clamp(15px,1.2vw,18px)] leading-[1.55] text-sideband-text-secondary">
              {product.tagline}
            </p>
            <div className="mt-6 hidden flex-wrap gap-1.5 min-[900px]:flex">
              {product.tags.slice(0, 4).map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="ghost" size="sm" href={`/products/${product.id}`}>
              Open {product.name} &rarr;
            </Button>
            {product.version && (
              <span className="font-mono text-[11px] text-sideband-muted">
                {product.version}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function WorkStack() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="products" className="relative">
      <div className="inner pb-4 pt-24">
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                Work
              </span>
              <h2 className="display mt-3.5 text-[clamp(36px,5vw,64px)]">
                The things we <em>make.</em>
              </h2>
            </div>
            <Button variant="ghost" size="sm" href="/products">
              How each one works &rarr;
            </Button>
          </div>
        </FadeUp>
      </div>

      <div ref={ref} className="inner">
        {products.map((p, i) => (
          <StackCard
            key={p.id}
            product={p}
            index={i}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  )
}
