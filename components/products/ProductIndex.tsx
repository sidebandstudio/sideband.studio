import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Backdrop from '@/components/ui/Backdrop'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Stat from '@/components/ui/Stat'
import ClientBadge from '@/components/ui/ClientBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { cx } from '@/components/ui/cx'
import { productAccentStyle } from '@/components/products/accent'
import ProductName from './ProductName'
import ProductVideo from './ProductVideo'
import type { ProductRankInputs, RankedProduct } from '@/lib/products'
import {
  capitalize,
  formatBytes,
  formatCount,
  numberWord,
  rankingMethod,
  syncedLabel,
  type RankingSummary,
} from '@/lib/products-view'

/**
 * /products: every product in ranked order. The flagship gets the full width,
 * the next two share a row, the rest are rows of their own. Every figure is
 * read from lib/ at build time. `summary` comes from rankingSummary().
 */
export default function ProductIndex({ summary }: { summary: RankingSummary }) {
  const { ranked } = summary
  const total = ranked.length
  const [first, ...others] = ranked
  const pair = others.slice(0, 2)
  const rest = others.slice(2)
  const upstream = ranked.filter((r) => r.product.upstreamRepo)

  return (
    <>
      <Section
        labelledBy="products-title"
        spacing="none"
        className="pb-section pt-32 md:pt-40"
        backdrop={<Backdrop variant="spotlight" />}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            as="h1"
            id="products-title"
            trigger="mount"
            eyebrow="Products"
            title={
              <>
                {capitalize(numberWord(total))} products,
                <br />
                ranked on GitHub
              </>
            }
            lede={`Each product's score blends its popularity and its scope, both read from its GitHub repository. Every figure on this page was synced from GitHub on ${syncedLabel}.`}
            className="lg:col-span-7"
          />
          <Reveal trigger="mount" delay={280} className="lg:col-span-5">
            <aside
              aria-labelledby="method-title"
              className="rounded-panel bg-sideband-surface p-6 md:p-8"
            >
              <h2
                id="method-title"
                className="text-lead font-medium text-sideband-text"
              >
                How the order is computed
              </h2>
              <p className="mt-4 text-body text-sideband-text-secondary">
                Popularity is {rankingMethod.popularityInputs}, weighted{' '}
                {rankingMethod.popularityPercent}. Scope is{' '}
                {rankingMethod.scopeInputs}, weighted{' '}
                {rankingMethod.scopePercent}. Stars and downloads show interest
                in a project. They do not count its users.
              </p>
              <ArrowLink href="#ranking" className="mt-6 text-small">
                Every input, product by product
              </ArrowLink>
            </aside>
          </Reveal>
        </div>

        <Reveal trigger="mount" delay={350}>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            <Stat value={formatCount(summary.live)} label="Live" />
            <Stat
              value={formatCount(summary.inDevelopment)}
              label="In development"
            />
            <Stat value={formatCount(summary.openSource)} label="Open source" />
            <Stat value={formatCount(summary.stars)} label="GitHub stars" />
            <Stat
              value={formatCount(summary.downloads)}
              label="Release downloads"
            />
            <Stat value={formatCount(summary.commits)} label="Commits" />
          </dl>
        </Reveal>
      </Section>

      <Section labelledBy="list-title" spacing="none" className="pb-section">
        <h2 id="list-title" className="sr-only">
          Products in ranked order
        </h2>
        <ol className="grid gap-x-6 gap-y-20 md:grid-cols-2 md:gap-y-24">
          <li className="md:col-span-2">
            <Flagship r={first} total={total} />
          </li>
          {pair.map((r, i) => (
            <Reveal as="li" key={r.product.id} delay={i * 70}>
              <Feature r={r} total={total} />
            </Reveal>
          ))}
          {rest.map((r) => (
            <Reveal as="li" key={r.product.id} className="md:col-span-2">
              <Row r={r} total={total} />
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="ranking" labelledBy="ranking-title" tone="surface">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading
            id="ranking-title"
            title="Every input behind the order"
            className="lg:col-span-5"
          />
          <Reveal delay={70} className="flex flex-col gap-4 lg:col-span-7">
            <p className="text-body text-sideband-text">
              Each figure is scaled as log10(1 + x) and divided by the largest
              value across all {numberWord(total)} products, so a handful of
              stars still counts and one large repo does not flatten the rest.
              Popularity is the mean of {rankingMethod.popularityInputs}. Scope
              is the mean of {rankingMethod.scopeInputs}. The score is{' '}
              {rankingMethod.popularityWeight} times popularity plus{' '}
              {rankingMethod.scopeWeight} times scope, and ties go to the name.
            </p>
            <p className="text-body text-sideband-text-secondary">
              Code size counts every byte in a repo, including code a product
              inherited.
              {upstream.map((r) => (
                <span key={r.product.id}>
                  {' '}
                  {r.product.name} is read from {r.product.upstreamRepo}, where
                  it is built.
                </span>
              ))}{' '}
              Snapshot from {syncedLabel}.
            </p>
          </Reveal>
        </div>
        <Reveal delay={140} className="mt-14">
          <RankingTable ranked={ranked} />
        </Reveal>
      </Section>
    </>
  )
}

/** Rank and score, as a short line above the name. */
function RankLine({ r, total }: { r: RankedProduct; total: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="text-small tabular-nums text-sideband-text-secondary">
        <span className="text-sideband-text">Rank {r.rank}</span> of {total},
        score {r.score.toFixed(2)}
      </p>
      <StatusBadge status={r.product.status} />
      <ClientBadge client={r.product.client} />
    </div>
  )
}

const NUMBERS: {
  key: keyof ProductRankInputs
  one: string
  many: string
  format?: (n: number) => string
}[] = [
  { key: 'stars', one: 'star', many: 'stars' },
  { key: 'forks', one: 'fork', many: 'forks' },
  { key: 'downloads', one: 'download', many: 'downloads' },
  { key: 'commits', one: 'commit', many: 'commits' },
  { key: 'codeBytes', one: 'of code', many: 'of code', format: formatBytes },
  { key: 'platforms', one: 'platform', many: 'platforms' },
]

/** The ranking inputs as figures, in a grid or a compact list. */
function KeyNumbers({
  inputs,
  layout,
}: {
  inputs: ProductRankInputs
  layout: 'grid' | 'list'
}) {
  return (
    <dl
      className={cx(
        layout === 'grid'
          ? 'grid grid-cols-3 gap-x-6 gap-y-6'
          : 'grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-2',
      )}
    >
      {NUMBERS.map(({ key, one, many, format }) => {
        const n = inputs[key]
        return (
          <div key={key} className="flex flex-col-reverse gap-1">
            <dt className="text-small text-sideband-muted">
              {n === 1 ? one : many}
            </dt>
            <dd className="text-lead tabular-nums text-sideband-text">
              {format ? format(n) : formatCount(n)}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function hostLabel(url: string) {
  const { hostname, pathname } = new URL(url)
  const host = hostname.replace(/^www\./, '')
  return host.endsWith('github.io')
    ? `${host}${pathname}`.replace(/\/$/, '')
    : host
}

/** The product's page, its site and its source. */
function Links({ r }: { r: RankedProduct }) {
  const { product } = r
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <li>
        <ArrowLink href={`/products/${product.id}`}>
          More on {product.name}
        </ArrowLink>
      </li>
      {product.links.site && (
        <li>
          <ArrowLink href={product.links.site} external tone="muted">
            {hostLabel(product.links.site)}
          </ArrowLink>
        </li>
      )}
      {product.links.repo && (
        <li>
          <ArrowLink href={product.links.repo} external tone="muted">
            GitHub
          </ArrowLink>
        </li>
      )}
      {product.repoPrivate && (
        <li data-private-source="" className="text-sideband-muted">
          Source is private
        </li>
      )}
    </ul>
  )
}

/** The video as a link to the product's page. Hidden from the tab order: the name links there too. */
function VideoLink({
  r,
  cut,
  sizes,
  className,
}: {
  r: RankedProduct
  cut: 'card' | 'hero'
  sizes?: string
  className?: string
}) {
  return (
    <ProductVideo
      video={r.product.video[cut]}
      cut={cut}
      link={{ href: `/products/${r.product.id}`, label: r.product.name }}
      lift
      sizes={sizes}
      className={className}
    />
  )
}

function Name({ r, size }: { r: RankedProduct; size: 'head' | 'lead' }) {
  return (
    <h2
      className={cx(
        'text-sideband-text',
        size === 'head' ? 'text-head' : 'text-lead font-medium',
      )}
    >
      <Link
        href={`/products/${r.product.id}`}
        className="underline decoration-transparent decoration-1 underline-offset-[0.15em] transition-colors duration-hover hover:decoration-sideband-text"
      >
        <ProductName name={r.product.name} />
      </Link>
    </h2>
  )
}

function Meta({ r }: { r: RankedProduct }) {
  return (
    <p className="text-small text-sideband-muted">
      <span className="text-sideband-text-secondary">{r.product.category}</span>
      {' · '}
      {r.product.platforms.join(', ')}
    </p>
  )
}

function Flagship({ r, total }: { r: RankedProduct; total: number }) {
  const { product } = r
  return (
    <article
      aria-label={product.name}
      data-rank={r.rank}
      style={productAccentStyle(product.accentColor)}
      className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      <Reveal className="lg:col-span-7">
        <VideoLink r={r} cut="hero" />
      </Reveal>
      <Reveal delay={70} className="flex flex-col gap-6 lg:col-span-5">
        <div className="flex flex-col gap-3">
          <Name r={r} size="head" />
          <Meta r={r} />
          <RankLine r={r} total={total} />
        </div>
        <p className="text-lead text-sideband-text">{product.tagline}</p>
        <p className="text-body text-sideband-text-secondary">
          {product.description}
        </p>
        <div className="rounded-panel bg-sideband-surface p-6">
          <KeyNumbers inputs={r.inputs} layout="grid" />
        </div>
        <Links r={r} />
      </Reveal>
    </article>
  )
}

function Feature({ r, total }: { r: RankedProduct; total: number }) {
  const { product } = r
  return (
    <article
      aria-label={product.name}
      data-rank={r.rank}
      style={productAccentStyle(product.accentColor)}
      className="flex flex-col gap-8"
    >
      <VideoLink r={r} cut="card" sizes="(min-width: 768px) 46vw, 92vw" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Name r={r} size="head" />
          <Meta r={r} />
          <RankLine r={r} total={total} />
        </div>
        <p className="text-lead text-sideband-text">{product.tagline}</p>
        <p className="text-body text-sideband-text-secondary">
          {product.description}
        </p>
        <div className="rounded-panel bg-sideband-surface p-6">
          <KeyNumbers inputs={r.inputs} layout="grid" />
        </div>
        <Links r={r} />
      </div>
    </article>
  )
}

function Row({ r, total }: { r: RankedProduct; total: number }) {
  const { product } = r
  return (
    <article
      aria-label={product.name}
      data-rank={r.rank}
      style={productAccentStyle(product.accentColor)}
      className="grid gap-8 md:grid-cols-12 md:gap-x-10"
    >
      <VideoLink
        r={r}
        cut="card"
        sizes="(min-width: 1024px) 31vw, (min-width: 768px) 40vw, 92vw"
        className="md:col-span-5 lg:col-span-4"
      />
      <div className="flex flex-col gap-4 md:col-span-7 lg:col-span-5">
        <div className="flex flex-col gap-2">
          <Name r={r} size="lead" />
          <Meta r={r} />
          <RankLine r={r} total={total} />
        </div>
        <p className="text-body text-sideband-text">{product.tagline}</p>
        <p className="text-body text-sideband-text-secondary">
          {product.description}
        </p>
        <Links r={r} />
      </div>
      <div className="md:col-span-12 lg:col-span-3">
        <KeyNumbers inputs={r.inputs} layout="list" />
      </div>
    </article>
  )
}

const COLUMNS: {
  key: keyof ProductRankInputs
  label: string
  format?: (n: number) => string
}[] = [
  { key: 'stars', label: 'Stars' },
  { key: 'forks', label: 'Forks' },
  { key: 'downloads', label: 'Downloads' },
  { key: 'codeBytes', label: 'Code', format: formatBytes },
  { key: 'commits', label: 'Commits' },
  { key: 'contributors', label: 'Contributors' },
  { key: 'platforms', label: 'Platforms' },
]

const TABLE_ROW = 'border-t border-sideband-border text-sideband-text-secondary' // taste-skill-ignore: rules in a real data table

function RankingTable({ ranked }: { ranked: RankedProduct[] }) {
  return (
    <div
      role="region"
      aria-labelledby="ranking-caption"
      tabIndex={0}
      className="overflow-x-auto rounded-panel bg-sideband-surface-2"
    >
      <table className="w-full min-w-[60rem] text-small tabular-nums">
        <caption id="ranking-caption" className="sr-only">
          Ranking inputs and scores for every product
        </caption>
        <thead>
          <tr className="text-left text-sideband-muted">
            <th scope="col" className="px-5 py-4 font-normal">
              Rank
            </th>
            <th scope="col" className="px-5 py-4 font-normal">
              Product
            </th>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="px-5 py-4 text-right font-normal"
              >
                {c.label}
              </th>
            ))}
            <th scope="col" className="px-5 py-4 text-right font-normal">
              Popularity
            </th>
            <th scope="col" className="px-5 py-4 text-right font-normal">
              Scope
            </th>
            <th scope="col" className="px-5 py-4 text-right font-normal">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r) => (
            <tr key={r.product.id} className={TABLE_ROW}>
              <td className="px-5 py-3.5 text-sideband-text">{r.rank}</td>
              <th scope="row" className="px-5 py-3.5 text-left font-normal">
                <Link
                  href={`/products/${r.product.id}`}
                  className="text-sideband-text underline decoration-transparent underline-offset-4 transition-colors duration-hover hover:decoration-sideband-text"
                >
                  {r.product.name}
                </Link>
              </th>
              {COLUMNS.map((c) => (
                <td key={c.key} className="px-5 py-3.5 text-right">
                  {c.format
                    ? c.format(r.inputs[c.key])
                    : formatCount(r.inputs[c.key])}
                </td>
              ))}
              <td className="px-5 py-3.5 text-right">
                {r.popularity.toFixed(3)}
              </td>
              <td className="px-5 py-3.5 text-right">{r.scope.toFixed(3)}</td>
              <td className="px-5 py-3.5 text-right text-sideband-text">
                {r.score.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
