'use client'

import { products, type Product, type ProductGalleryItem } from '@/lib/products'
import FadeUp from '@/components/animations/FadeUp'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import StatusBadge from '@/components/ui/StatusBadge'
import SectionLabel from '@/components/ui/SectionLabel'
import {
  BrowserFrame,
  IPadFrame,
  IPhoneFrame,
  TerminalFrame,
} from '@/components/products/DeviceFrames'

function GalleryFrame({ item }: { item: ProductGalleryItem }) {
  if (item.device === 'phone') {
    return (
      <div className="flex w-full justify-center py-5">
        <IPhoneFrame src={item.src} alt={item.label} width={200} />
      </div>
    )
  }
  if (item.device === 'ipad') {
    return (
      <div className="flex w-full justify-center py-5">
        <IPadFrame src={item.src} alt={item.label} width={280} />
      </div>
    )
  }
  if (item.device === 'terminal') {
    return <TerminalFrame src={item.src} alt={item.label} />
  }
  return (
    <BrowserFrame
      src={item.src}
      alt={item.label}
      url={item.sub}
      objectPosition={item.objectPosition}
    />
  )
}

function GalleryItem({ item }: { item: ProductGalleryItem }) {
  return (
    <div className="h-full rounded-xl border border-sideband-border bg-white/[0.015] p-4 transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/[0.03]">
      <GalleryFrame item={item} />
      <div className="mt-3 px-1">
        <p className="text-[14px] font-semibold tracking-[-0.01em] text-sideband-text">
          {item.label}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-sideband-muted">
          {item.sub}
        </p>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ product }: { product: Product }) {
  const detail = product.detail
  const index = products.findIndex((p) => p.id === product.id)
  const numLabel = String(index + 1).padStart(2, '0')

  return (
    <div className="min-h-screen pt-[60px]">
      {/* Hero */}
      <div className="border-b border-sideband-border">
        <div className="inner pb-16 pt-14">
          <Button variant="ghost" size="sm" href="/products">
            &larr; All products
          </Button>

          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
            <span>{numLabel}</span>
            <StatusBadge status={product.status} />
            {product.version && (
              <span className="normal-case tracking-normal">
                {product.version}
              </span>
            )}
          </div>

          <h1 className="display mt-3.5 text-[clamp(40px,6vw,72px)]">
            {product.name}
          </h1>
          <p className="mt-3.5 max-w-[600px] text-pretty text-[17px] tracking-[-0.005em] text-sideband-text-secondary">
            {detail.tagline}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sideband-border bg-sideband-border min-[720px]:grid-cols-4">
            {detail.stats.map((s) => (
              <div key={s.label} className="bg-sideband-black px-6 py-5">
                <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                  {s.label}
                </dt>
                <dd className="display mt-2 text-[22px]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Gallery */}
      <div className="border-b border-sideband-border bg-sideband-surface py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="Gallery" withLine />
            <p className="mt-3 text-[15px] text-sideband-text-secondary">
              Every view, every screen, every state.
            </p>
          </FadeUp>
          <div
            className={`gallery-grid mt-8 grid gap-4 ${
              detail.gallery.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {detail.gallery.map((item, i) => (
              <FadeUp
                key={`${item.label}-${i}`}
                delay={i * 0.06}
                className="h-full"
              >
                <GalleryItem item={item} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="border-b border-sideband-border py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="How it works" withLine />
            <h2 className="display mt-3.5 text-[clamp(32px,4vw,48px)]">
              Under the hood<span className="text-sideband-accent">.</span>
            </h2>
          </FadeUp>
          <div className="mt-10">
            {detail.architecture.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.07}>
                <div className="grid grid-cols-[56px_1fr] gap-6 border-t border-sideband-border py-7">
                  <span className="font-mono text-[13px] text-sideband-muted">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-sideband-text">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[640px] text-pretty text-[15px] leading-[1.6] text-sideband-text-secondary">
                      {step.body}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="border-b border-sideband-border bg-sideband-surface py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="Highlights" withLine />
          </FadeUp>
          <div className="highlights-grid mt-8 grid grid-cols-2 gap-4">
            {detail.highlights.map((h, i) => (
              <FadeUp key={h} delay={i * 0.07} className="h-full">
                <div className="flex h-full gap-3.5 rounded-xl border border-sideband-border bg-white/[0.015] px-5 py-4">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sideband-accent" />
                  <p className="text-pretty text-[15px] leading-[1.6] text-sideband-text-secondary">
                    {h}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Full stack */}
      <div className="border-b border-sideband-border py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="Full stack" withLine />
          </FadeUp>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="inner">
          <FadeUp>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="display text-[clamp(28px,3vw,36px)]">
                  {product.name}
                </p>
                <p className="mt-1.5 text-[15px] text-sideband-text-secondary">
                  {product.status === 'LIVE'
                    ? 'Live and shipping.'
                    : 'In active development.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.url && (
                  <Button variant="filled" href={product.url} external>
                    Visit &#8599;
                  </Button>
                )}
                {product.github && (
                  <Button variant="ghost" href={product.github} external>
                    GitHub &#8599;
                  </Button>
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
