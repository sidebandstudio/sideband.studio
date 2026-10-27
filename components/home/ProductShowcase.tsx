import Image from 'next/image'
import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Badge from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import ClientBadge from '@/components/ui/ClientBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'
import { productAccentStyle } from '@/components/products/accent'
import ProductVideo from '@/components/products/ProductVideo'
import { getProductById } from '@/lib/products'
import {
  countWord,
  type HomeData,
  type MoreProduct,
  type ShowcaseProduct,
} from '@/lib/home-data'
import styles from './ProductShowcase.module.css'

/** Covers the whole card with the title link, so the card is one target. */
const STRETCH = 'after:absolute after:inset-0 after:rounded-panel'

/**
 * A curated look at the ranking: the first product large with its hero video,
 * the next two as video cards, and every other product as one strip of chips
 * in rank order. Each product links to its page. The order is the GitHub
 * ranking from lib/products.ts, whose weights and inputs the lede reads. The
 * full ranked index lives on /products only.
 */
export default function ProductShowcase({
  products,
  more,
  ranking,
  syncedOn,
}: {
  /** The featured products, in ranked order, from the server. */
  products: ShowcaseProduct[]
  /** The rest, in ranked order. */
  more: MoreProduct[]
  ranking: HomeData['ranking']
  syncedOn: string
}) {
  const [first, ...pair] = products
  const total = products.length + more.length

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
        actions={
          <ArrowLink href="/products#ranking">How the ranking works</ArrowLink>
        }
      />

      <ol className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-16">
        <Reveal as="li" className="md:col-span-2">
          <Featured product={first} />
        </Reveal>
        {pair.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 70}>
            <Card product={p} />
          </Reveal>
        ))}
      </ol>

      {more.length > 0 && (
        <Reveal className="mt-16 md:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h3 className="text-lead font-medium text-sideband-text">
              {countWord(more.length, true)} more, in rank order
            </h3>
            <ArrowLink href="/products">All {total} products</ArrowLink>
          </div>
          <ol
            start={products.length + 1}
            aria-label={`Products ranked ${products.length + 1} to ${total}`}
            className={cx(
              'mt-6 flex gap-2 max-md:-mx-gutter max-md:overflow-x-auto max-md:px-gutter md:flex-wrap',
              styles.strip,
            )}
          >
            {more.map((p) => (
              <li key={p.id} className="shrink-0">
                <Chip product={p} />
              </li>
            ))}
          </ol>
        </Reveal>
      )}
    </Section>
  )
}

function Meta({ product }: { product: ShowcaseProduct }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-sideband-text-secondary">
      <StatusBadge status={product.status} />
      <ClientBadge client={product.client} />
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
      <ProductVideo
        video={product.video.hero}
        cut="hero"
        lift
        className="lg:col-span-7"
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
        <p className="hidden text-body text-sideband-text md:block">
          {product.description}
        </p>
        <Facts facts={product.facts} />
        <ul className="hidden flex-wrap gap-2 md:flex" aria-label="Platforms">
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
      <ProductVideo
        video={product.video.card}
        cut="card"
        lift
        sizes="(min-width: 1400px) 676px, (min-width: 768px) 46vw, 92vw"
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

function Chip({ product }: { product: MoreProduct }) {
  const accent = getProductById(product.id)?.accentColor
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-sideband-surface pl-1.5 pr-4 text-small font-medium text-sideband-text transition-colors duration-hover ease-standard hover:bg-sideband-surface-2"
    >
      {product.icon ? (
        <Image
          src={product.icon}
          alt=""
          width={72}
          height={72}
          className="h-9 w-9 shrink-0 rounded-full"
        />
      ) : (
        <span
          aria-hidden="true"
          style={accent ? productAccentStyle(accent) : undefined}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sideband-surface-3"
        >
          <span className="block h-1 w-4 rounded-full bg-product" />
        </span>
      )}
      {product.name}
      <ArrowRightIcon
        size={14}
        className="text-sideband-text-secondary transition-transform duration-hover ease-out group-hover:translate-x-0.5"
      />
    </Link>
  )
}
