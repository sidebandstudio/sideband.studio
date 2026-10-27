import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import { ProductScene } from '@/components/products/scenes'
import type { Product } from '@/lib/products'

/** `products` arrive ranked from the server (productsByRank in lib/products.ts). */
export default function ProductGrid({ products }: { products: Product[] }) {
  const live = products.filter((p) => p.status === 'LIVE').length
  const dev = products.filter((p) => p.status === 'IN DEVELOPMENT').length
  const open = products.filter((p) => p.links.repo).length

  return (
    <Section id="products" labelledBy="products-title">
      <SectionHeading
        id="products-title"
        eyebrow="Products"
        title="What we build"
        lede="Eleven products across desktop, browser, mobile, and the web, in order of use and size."
      />

      <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 3) * 70}>
            <Link
              href={`/products/${p.id}`}
              className="group flex flex-col gap-5 rounded-panel"
            >
              <ProductScene
                id={p.id}
                variant="card"
                className="transition-transform duration-ui ease-out group-hover:-translate-y-1"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lead font-medium text-sideband-text">
                    {p.name}
                  </h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-pretty text-small text-sideband-text-secondary">
                  {p.tagline}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16 flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
        <dl className="flex flex-wrap gap-x-14 gap-y-8">
          <Stat value={String(live)} label="Live" countUp />
          <Stat value={String(dev)} label="In active development" countUp />
          <Stat value={String(open)} label="With public source" countUp />
        </dl>
        <ArrowLink href="/products">All products</ArrowLink>
      </div>
    </Section>
  )
}
