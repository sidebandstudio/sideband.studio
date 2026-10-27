import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import { ProductScene } from '@/components/products/scenes'
import { products } from '@/lib/products'

const LIVE = products.filter((p) => p.status === 'LIVE').length
const DEV = products.filter((p) => p.status === 'IN DEVELOPMENT').length
const OPEN = products.filter((p) => p.github).length

export default function ProductGrid() {
  return (
    <Section id="products" labelledBy="products-title">
      <SectionHeading
        id="products-title"
        eyebrow="Products"
        title="What we build"
        lede="Six products across desktop, browser, mobile, and full-stack. Each one started as something we wanted for ourselves."
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
          <Stat value={String(LIVE)} label="Live" countUp />
          <Stat value={String(DEV)} label="In active development" countUp />
          <Stat value={String(OPEN)} label="With public source" countUp />
        </dl>
        <ArrowLink href="/products">All products</ArrowLink>
      </div>
    </Section>
  )
}
