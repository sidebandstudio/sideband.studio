import Image from 'next/image'
import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Badge from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'
import { ProductScene, productAccentStyle } from '@/components/products/scenes'
import { SignatureCutsMark } from '@/components/products/scenes/group-b/signature-cuts/Scene'
import { getProductById } from '@/lib/products'
import type { HomeData, ShowcaseProduct } from '@/lib/home-data'

/**
 * Marks the scene builders drew for products that ship no icon, so a ranked
 * row shows the product's own mark rather than a bare accent bar.
 */
const MARKS: Partial<Record<string, typeof SignatureCutsMark>> = {
  'signature-cuts': SignatureCutsMark,
}

/** Covers the whole card with the title link, so the card is one target. */
const STRETCH = 'after:absolute after:inset-0 after:rounded-panel'

/**
 * The ranked products: the first one large with its hero scene, the next two
 * as scene cards, and the rest as a compact ranked list. Every product links
 * to its page. The order is the GitHub ranking from lib/products.ts, whose
 * weights and inputs the lede reads. The full table lives on /products.
 */
export default function ProductShowcase({
  products,
  ranking,
  syncedOn,
}: {
  /** In ranked order, from the server. */
  products: ShowcaseProduct[]
  ranking: HomeData['ranking']
  syncedOn: string
}) {
  const [first, ...rest] = products
  const pair = rest.slice(0, 2)
  const others = rest.slice(2)

  return (
    <Section id="products" labelledBy="products-title">
      <SectionHeading
        id="products-title"
        eyebrow="Products"
        title={
          <>
            Our products,
            <br />
            ranked on GitHub.
          </>
        }
        lede={`Each score is ${ranking.popularityPercent} popularity (${ranking.popularityInputs}) and ${ranking.scopePercent} scope (${ranking.scopeInputs}), with GitHub figures synced ${syncedOn}.`}
      />

      <ol className="mt-14 grid gap-x-6 gap-y-16 lg:grid-cols-2">
        <Reveal as="li" className="lg:col-span-2">
          <Featured product={first} />
        </Reveal>
        {pair.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 70}>
            <Card product={p} />
          </Reveal>
        ))}
      </ol>

      <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
        <h3 className="text-lead font-medium text-sideband-text">
          And the rest of the list
        </h3>
        <ArrowLink href="/products#ranking">
          The full ranking and how it is scored
        </ArrowLink>
      </div>
      <ol
        start={pair.length + 2}
        className="mt-8 grid gap-2 md:grid-cols-2 md:gap-x-6"
      >
        {others.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 2) * 70}>
            <Row product={p} />
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

function Meta({ product }: { product: ShowcaseProduct }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-sideband-text-secondary">
      <StatusBadge status={product.status} />
      {product.category}
    </p>
  )
}

function Facts({ facts }: { facts: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-small tabular-nums text-sideband-text">
      {facts.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  )
}

function Featured({ product }: { product: ShowcaseProduct }) {
  return (
    <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <ProductScene
        id={product.id}
        variant="hero"
        className="transition-transform duration-ui ease-out group-hover:-translate-y-1 lg:col-span-7"
      />
      <div className="flex flex-col gap-5 lg:col-span-5">
        <h3 className="text-head text-sideband-text">
          <Link href={`/products/${product.id}`} className={STRETCH}>
            {product.name}
          </Link>
        </h3>
        <Meta product={product} />
        <p className="text-lead text-sideband-text-secondary">
          {product.tagline}
        </p>
        <p className="text-body text-sideband-text">{product.description}</p>
        <Facts facts={product.facts} />
        <ul className="flex flex-wrap gap-2" aria-label="Platforms">
          {product.platforms.map((pl) => (
            <li key={pl}>
              <Badge>{pl}</Badge>
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ArrowLink href={`/products/${product.id}`}>
            More on {product.name}
          </ArrowLink>
          {product.site && (
            <ArrowLink href={product.site.href} external tone="muted">
              {product.site.label}
            </ArrowLink>
          )}
        </div>
      </div>
    </article>
  )
}

function Card({ product }: { product: ShowcaseProduct }) {
  return (
    <article className="group relative flex flex-col gap-6">
      <ProductScene
        id={product.id}
        variant="card"
        className="transition-transform duration-ui ease-out group-hover:-translate-y-1"
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-lead font-medium text-sideband-text">
          <Link href={`/products/${product.id}`} className={STRETCH}>
            {product.name}
          </Link>
        </h3>
        <Meta product={product} />
        <p className="max-w-prose text-body text-sideband-text">
          {product.tagline}
        </p>
        <Facts facts={product.facts} />
      </div>
    </article>
  )
}

function Row({ product }: { product: ShowcaseProduct }) {
  const accent = getProductById(product.id)?.accentColor
  const Mark = MARKS[product.id]
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex items-center gap-4 rounded-panel bg-sideband-surface p-4 transition-colors duration-hover ease-standard hover:bg-sideband-surface-2 md:p-5"
    >
      {product.icon ? (
        <Image
          src={product.icon}
          alt=""
          width={96}
          height={96}
          className="h-11 w-11 shrink-0 rounded-[22%]"
        />
      ) : (
        <span
          aria-hidden="true"
          style={accent ? productAccentStyle(accent) : undefined}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[22%] bg-sideband-surface-3"
        >
          {Mark ? (
            <svg viewBox="0 0 44 44" className="h-11 w-11">
              <Mark x={0} y={0} size={44} />
            </svg>
          ) : (
            <span className="block h-1 w-5 rounded-full bg-product" />
          )}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body font-medium text-sideband-text">
          {product.name}
        </span>
        <span className="flex items-center gap-2 text-small text-sideband-text-secondary">
          <span
            aria-hidden="true"
            className={cx(
              'h-1.5 w-1.5 shrink-0 rounded-full',
              product.status === 'LIVE' ? 'bg-sideband-ok' : 'bg-sideband-warn',
            )}
          />
          <span className="sr-only">
            {product.status === 'LIVE' ? 'Live.' : 'In development.'}
          </span>
          <span className="truncate">{product.category}</span>
        </span>
        <span className="text-small text-sideband-muted sm:hidden">
          <span className="tabular-nums text-sideband-text">
            {product.figure.value}
          </span>{' '}
          {product.figure.label}
        </span>
      </span>
      <span className="hidden shrink-0 flex-col items-end gap-0.5 text-right sm:flex">
        <span className="text-body tabular-nums text-sideband-text">
          {product.figure.value}
        </span>
        <span className="text-small text-sideband-muted">
          {product.figure.label}
        </span>
      </span>
      <ArrowRightIcon
        size={16}
        className="shrink-0 text-sideband-text-secondary transition-transform duration-hover ease-out group-hover:translate-x-1"
      />
    </Link>
  )
}
