import Image from 'next/image'
import type { ReactNode } from 'react'
import Link from 'next/link'
import ArrowLink from '@/components/ui/ArrowLink'
import Backdrop from '@/components/ui/Backdrop'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { GitHubIcon } from '@/components/ui/Icons'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Stat from '@/components/ui/Stat'
import ClientBadge from '@/components/ui/ClientBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { cx } from '@/components/ui/cx'
import { productAccentStyle } from '@/components/products/accent'
import type { Product, ProductFeature, RankedProduct } from '@/lib/products'
import {
  formatBytes,
  formatCount,
  imageSetCount,
  imageSetTitle,
  isWideImage,
  productActions,
  productEngineers,
  productFacts,
  productStory,
  syncedLabel,
  type ProductAction,
  type ProductFacts,
  type ProductStory,
  type StoryRow,
} from '@/lib/products-view'
import { formatDate } from '@/lib/format'
import ImageGrid from './ImageGrid'
import { ImageViewerProvider, ViewableImage } from './ImageViewer'
import ProductName from './ProductName'
import ProductVideo from './ProductVideo'

interface ProductDetailProps {
  ranked: RankedProduct
  total: number
  previous: RankedProduct | null
  next: RankedProduct | null
}

/**
 * The page for a single product, told as a story from its own data: the
 * hero, the first screenshot straight after it, the overview, each feature
 * beside the image that shows it, the features no image shows, the images
 * left over, and the GitHub numbers. Every figure is read from lib/ at build
 * time.
 */
export default function ProductDetail({
  ranked,
  total,
  previous,
  next,
}: ProductDetailProps) {
  const { product } = ranked
  const facts = productFacts(product)
  const actions = productActions(product)
  const story = productStory(product)

  return (
    <div style={productAccentStyle(product.accentColor)}>
      <ImageViewerProvider images={product.images} productName={product.name}>
        <Hero ranked={ranked} total={total} actions={actions} story={story} />
        <Overview product={product} />
        <Story product={product} story={story} />
        {story.rest.length > 0 && (
          <MoreImages product={product} indexes={story.rest} />
        )}
      </ImageViewerProvider>

      <Numbers ranked={ranked} total={total} facts={facts} />

      <Neighbours previous={previous} next={next} />
    </div>
  )
}

function Hero({
  ranked,
  total,
  actions,
  story,
}: {
  ranked: RankedProduct
  total: number
  actions: ProductAction[]
  story: ProductStory
}) {
  const { product } = ranked
  const [primary, ...rest] = actions
  const buttons = rest.filter((a) => a.kind === 'store' || a.kind === 'site')
  const links = rest.filter((a) => !buttons.includes(a))

  return (
    <Section
      labelledBy="product-title"
      spacing="none"
      className="pb-[calc(theme(spacing.section)/2)] pt-32 md:pt-40"
      backdrop={
        <Backdrop
          variant="spotlight"
          tone="accent"
          colors={{ a: product.accentColor }}
        />
      }
    >
      <Reveal trigger="mount">
        <nav aria-label="Breadcrumb" className="text-small">
          <ol className="flex items-center gap-2 text-sideband-muted">
            <li>
              <Link
                href="/products"
                className="transition-colors duration-hover hover:text-sideband-text"
              >
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-sideband-text-secondary">
              {product.name}
            </li>
          </ol>
        </nav>
      </Reveal>

      <Reveal trigger="mount" delay={70} className="mt-10">
        <p className="text-small font-medium text-sideband-text-secondary">
          {product.category}
        </p>
      </Reveal>
      {/* The name gets the full width on its own row, so nothing can sit
          beside it, and wraps only between the words of a camel-case name. */}
      <Reveal trigger="mount" delay={140}>
        <h1 id="product-title" className="mt-4 text-display text-sideband-text">
          <ProductName name={product.name} />
        </h1>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal
          trigger="mount"
          delay={210}
          className="flex flex-col gap-8 lg:col-span-5"
        >
          <p className="max-w-prose text-lead text-sideband-text-secondary">
            {product.tagline}
          </p>
          {product.client && (
            <p
              data-product-client=""
              className="-mt-4 max-w-prose text-body text-sideband-text"
            >
              Built for{' '}
              {product.client.url ? (
                <a
                  href={product.client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-sideband-muted underline-offset-4 transition-colors duration-hover hover:decoration-current"
                >
                  {product.client.name}
                </a>
              ) : (
                product.client.name
              )}
              {product.client.location && ` in ${product.client.location}`}.
            </p>
          )}
          <ul className="flex flex-wrap gap-2">
            <li>
              <StatusBadge status={product.status} />
            </li>
            {product.client && (
              <li>
                <ClientBadge client={product.client} />
              </li>
            )}
            {product.version && (
              <li>
                <Badge>{product.version}</Badge>
              </li>
            )}
            <li>
              <Badge>
                <Link
                  href="/products#ranking"
                  className="underline decoration-transparent underline-offset-4 transition-colors duration-hover hover:decoration-current"
                >
                  Ranked {ranked.rank} of {total}
                </Link>
              </Badge>
            </li>
          </ul>
          <div data-product-actions="" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {primary && (
                <Button
                  href={primary.href}
                  external={!primary.href.startsWith('/')}
                  size="lg"
                >
                  {primary.kind === 'repo' && <GitHubIcon size={16} />}
                  {primary.label}
                </Button>
              )}
              {buttons.map((a) => (
                <Button
                  key={a.href}
                  href={a.href}
                  external
                  variant="secondary"
                  size="lg"
                >
                  {a.label}
                </Button>
              ))}
            </div>
            {(links.length > 0 || product.repoPrivate) && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {links.map((a) => (
                  <ArrowLink key={a.href} href={a.href} external>
                    {a.label}
                  </ArrowLink>
                ))}
                {product.repoPrivate && (
                  <p
                    data-private-source=""
                    className="text-body text-sideband-text-secondary"
                  >
                    Source is private
                  </p>
                )}
              </div>
            )}
          </div>
        </Reveal>
        {/* No entrance: the poster paints at once, so it is the largest paint. */}
        <ProductVideo
          video={product.video.hero}
          cut="hero"
          priority
          className="lg:col-span-7"
        />
      </div>

      <Lead product={product} story={story} />
    </Section>
  )
}

/** Below this natural width a landscape lead sits beside its text instead of across the page. */
const FULL_WIDTH_LEAD = 1100

/**
 * The product's first screenshot, straight after the hero, with the feature
 * it shows when one is paired with it. A large landscape image runs the full
 * width with the feature set beneath it. A smaller one, a phone or a portrait
 * sits beside the feature.
 */
function Lead({ product, story }: { product: Product; story: ProductStory }) {
  const image = product.images[story.lead]
  const feature = story.leadFeature
  const wide = isWideImage(image)

  if (wide && image.width >= FULL_WIDTH_LEAD) {
    return (
      <div data-lead="" className="mt-16 md:mt-24">
        <Reveal>
          <ViewableImage
            index={story.lead}
            sizes="(min-width: 1440px) 1320px, 92vw"
          />
        </Reveal>
        {feature && (
          <Reveal className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-head text-sideband-text lg:col-span-5">
              {feature.title}
            </h2>
            <p className="text-lead text-sideband-text-secondary lg:col-span-6 lg:col-start-7">
              {feature.body}
            </p>
          </Reveal>
        )}
      </div>
    )
  }

  return (
    <div
      data-lead=""
      className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-12 md:gap-12"
    >
      <Reveal
        className={cx(
          !feature && 'md:col-span-12',
          feature && wide && 'md:col-span-7',
          !wide && 'mx-auto w-full max-w-[22rem]',
          feature && !wide && 'md:col-span-5 lg:col-span-4 lg:col-start-2',
        )}
      >
        <ViewableImage
          index={story.lead}
          sizes={
            wide
              ? '(min-width: 1440px) 760px, (min-width: 768px) 56vw, 92vw'
              : '(min-width: 768px) 352px, 88vw'
          }
        />
      </Reveal>
      {feature && (
        <Reveal
          delay={70}
          className={cx(
            'order-first md:order-none',
            wide
              ? 'md:col-span-5'
              : 'md:col-span-7 lg:col-span-5 lg:col-start-7',
          )}
        >
          <h2 className="text-head text-sideband-text">{feature.title}</h2>
          <p className="mt-6 text-lead text-sideband-text-secondary">
            {feature.body}
          </p>
        </Reveal>
      )}
    </div>
  )
}

function Overview({ product }: { product: Product }) {
  const team = productEngineers(product)
  return (
    <Section labelledBy="overview-title">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading id="overview-title" title="Overview" />
          <div className="mt-10 flex max-w-prose flex-col gap-6">
            {product.overview.map((paragraph, i) => (
              <Reveal key={i} delay={i * 70}>
                <p className="text-body text-sideband-text">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="lg:col-span-5" delay={140}>
          <aside
            aria-labelledby="glance-title"
            className="rounded-panel bg-sideband-surface p-6 md:p-8"
          >
            <h3
              id="glance-title"
              className="text-lead font-medium text-sideband-text"
            >
              At a glance
            </h3>
            <dl className="mt-8 flex flex-col gap-7">
              <Fact label="Platforms">
                <ul className="flex flex-col gap-1">
                  {product.platforms.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Fact>
              <Fact label="Built with">
                <ul className="flex flex-wrap gap-2">
                  {product.stack.map((s) => (
                    <li key={s}>
                      <Badge className="bg-sideband-surface-2">{s}</Badge>
                    </li>
                  ))}
                </ul>
              </Fact>
              <Fact label={team.length === 1 ? 'Engineer' : 'Engineers'}>
                <ul className="flex flex-col gap-3">
                  {team.map((engineer) => (
                    <li key={engineer.id}>
                      <Link
                        href={`/engineers/${engineer.id}`}
                        className="group flex items-center gap-3"
                      >
                        {engineer.portrait ? (
                          <Image
                            src={engineer.portrait.src}
                            alt=""
                            width={engineer.portrait.width}
                            height={engineer.portrait.height}
                            sizes="40px"
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sideband-surface-2 text-small"
                          >
                            {engineer.initials}
                          </span>
                        )}
                        <span className="flex flex-col">
                          <span className="text-sideband-text underline decoration-transparent underline-offset-4 transition-colors duration-hover group-hover:decoration-sideband-text">
                            {engineer.name}
                          </span>
                          <span className="text-small text-sideband-muted">
                            {engineer.role}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fact>
              <Fact label="Started">{product.yearStarted}</Fact>
              {product.origin && (
                <Fact label="Credit">
                  <p>{product.origin}</p>
                  {product.links.upstream && (
                    <ArrowLink
                      href={product.links.upstream}
                      external
                      tone="muted"
                      className="mt-2 text-small"
                    >
                      {product.links.upstream.replace(
                        'https://github.com/',
                        '',
                      )}
                    </ArrowLink>
                  )}
                </Fact>
              )}
            </dl>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}

/**
 * The features: each one an image shows set beside that image, alternating
 * sides, then the ones no image shows as a list. A product with no paired
 * images is only the list.
 */
function Story({ product, story }: { product: Product; story: ProductStory }) {
  const { rows, plain } = story
  return (
    <Section labelledBy="story-title">
      <SectionHeading id="story-title" title="What it does" />
      {rows.length > 0 && (
        <ul className="mt-14 flex flex-col gap-20 md:gap-28">
          {rows.map((row, i) => (
            <StoryRowItem
              key={row.feature.title}
              product={product}
              row={row}
              flip={i % 2 === 1}
            />
          ))}
        </ul>
      )}
      {plain.length > 0 && (
        <div className={rows.length > 0 ? 'mt-24 md:mt-32' : 'mt-14'}>
          {rows.length > 0 && (
            <Reveal>
              <h3 className="text-lead font-medium text-sideband-text">
                Also in {product.name}
              </h3>
            </Reveal>
          )}
          <ul
            className={cx(
              'grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3',
              rows.length > 0 && 'mt-10',
            )}
          >
            {plain.map((feature, i) => (
              <Reveal as="li" key={feature.title} delay={(i % 3) * 70}>
                <FeatureTitle
                  feature={feature}
                  as={rows.length > 0 ? 'h4' : 'h3'}
                />
                <p className="mt-3 text-body text-sideband-text-secondary">
                  {feature.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}

function FeatureTitle({
  feature,
  as: Tag,
}: {
  feature: ProductFeature
  as: 'h3' | 'h4'
}) {
  return (
    <Tag className="text-lead font-medium text-sideband-text">
      {feature.title}
    </Tag>
  )
}

/** Grid placement for an image and its text, by image shape and side. */
const ROW_LAYOUT = {
  wide: {
    image: 'lg:col-span-7',
    text: 'lg:col-span-5',
    imageFlip: 'lg:col-span-7 lg:col-start-6 lg:row-start-1',
    textFlip: 'lg:col-span-5 lg:col-start-1 lg:row-start-1',
  },
  tall: {
    image: 'lg:col-span-4 lg:col-start-2 lg:row-start-1',
    text: 'lg:col-span-5 lg:col-start-7 lg:row-start-1',
    imageFlip: 'lg:col-span-4 lg:col-start-8 lg:row-start-1',
    textFlip: 'lg:col-span-5 lg:col-start-2 lg:row-start-1',
  },
}

function StoryRowItem({
  product,
  row,
  flip,
}: {
  product: Product
  row: StoryRow
  flip: boolean
}) {
  const image = product.images[row.image]
  const shape = isWideImage(image) ? 'wide' : 'tall'
  const layout = ROW_LAYOUT[shape]
  return (
    <li className="grid items-center gap-8 lg:grid-cols-12 lg:gap-x-12">
      <Reveal
        className={cx(
          flip ? layout.imageFlip : layout.image,
          shape === 'tall' &&
            cx(
              'mx-auto w-full lg:mx-0',
              image.device === 'mobile' ? 'max-w-[20rem]' : 'max-w-[26rem]',
            ),
        )}
      >
        <ViewableImage
          index={row.image}
          sizes={
            shape === 'wide'
              ? '(min-width: 1440px) 760px, (min-width: 1024px) 55vw, 92vw'
              : '(min-width: 1024px) 416px, 88vw'
          }
        />
      </Reveal>
      <Reveal
        delay={70}
        className={cx(
          'order-first lg:order-none',
          flip ? layout.textFlip : layout.text,
        )}
      >
        <FeatureTitle feature={row.feature} as="h3" />
        <p className="mt-4 text-body text-sideband-text">{row.feature.body}</p>
      </Reveal>
    </li>
  )
}

/** The images neither the lead nor beside a feature. */
function MoreImages({
  product,
  indexes,
}: {
  product: Product
  indexes: number[]
}) {
  const images = indexes.map((i) => product.images[i])
  const title = imageSetTitle(images)
  return (
    <Section labelledBy="images-title">
      <SectionHeading
        id="images-title"
        title={`More ${title.charAt(0).toLowerCase()}${title.slice(1)}`}
        lede={`${imageSetCount(images)} of ${product.name}.`}
      />
      <div className="mt-14">
        <ImageGrid
          images={product.images}
          indexes={indexes}
          label={`More images of ${product.name}`}
        />
      </div>
    </Section>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-small text-sideband-muted">{label}</dt>
      <dd className="text-body text-sideband-text">{children}</dd>
    </div>
  )
}

const LANGUAGE_TONES = [
  'bg-product',
  'bg-white/60',
  'bg-white/35',
  'bg-white/20',
  'bg-white/10',
]

function Numbers({
  ranked,
  total,
  facts,
}: {
  ranked: RankedProduct
  total: number
  facts: ProductFacts
}) {
  const { product } = ranked
  const source = facts.readsUpstream
    ? `Read from ${facts.repoKey}, where ${product.name} is built. Synced from GitHub on ${syncedLabel}.`
    : facts.repoUrl
      ? `From ${facts.repoKey} on GitHub, synced ${syncedLabel}.`
      : `From ${product.name}’s private repo on GitHub, synced ${syncedLabel}. The source is private, so only these figures are shown.`

  return (
    <Section labelledBy="numbers-title" tone="surface">
      <SectionHeading id="numbers-title" title="By the numbers" lede={source} />

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-6">
        <Stat value={formatCount(facts.stars)} label="Stars" countUp />
        <Stat value={formatCount(facts.forks)} label="Forks" countUp />
        <Stat
          value={formatCount(facts.downloads)}
          label="Release downloads"
          countUp
        />
        <Stat value={formatCount(facts.commits)} label="Commits" countUp />
        <Stat
          value={formatCount(facts.contributors.length)}
          label={
            facts.contributors.length === 1 ? 'Contributor' : 'Contributors'
          }
          countUp
        />
        <Stat value={formatBytes(facts.codeBytes)} label="Code" countUp />
      </dl>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <Reveal className="rounded-panel bg-sideband-surface-2 p-6 md:p-8">
          <h3 className="text-lead font-medium text-sideband-text">
            Languages
          </h3>
          <div
            aria-hidden="true"
            className="mt-6 flex h-3 gap-1 overflow-hidden rounded-full"
          >
            {facts.languages.map((l, i) => (
              <span
                key={l.name}
                className={cx('h-full rounded-full', LANGUAGE_TONES[i])}
                style={{ width: `${Math.max(l.share * 100, 1)}%` }}
              />
            ))}
          </div>
          <ul className="mt-6 flex flex-col gap-2 text-small">
            {facts.languages.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cx('h-2 w-2 rounded-full', LANGUAGE_TONES[i])}
                />
                <span className="text-sideband-text">{l.name}</span>
                <span className="ml-auto tabular-nums text-sideband-text-secondary">
                  {(l.share * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={70}
          className="rounded-panel bg-sideband-surface-2 p-6 md:p-8"
        >
          <h3 className="text-lead font-medium text-sideband-text">
            {facts.contributors.length === 1 ? 'Contributor' : 'Contributors'}
          </h3>
          <ul className="mt-6 flex flex-col gap-4">
            {facts.contributors.map((c) => (
              <li key={c.login}>
                <a
                  href={c.href}
                  {...(c.internal
                    ? {}
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex items-center gap-3"
                >
                  <Image
                    src={`${c.avatarUrl}&s=80`}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 shrink-0 rounded-full bg-sideband-surface-3"
                  />
                  <span className="text-sideband-text underline decoration-transparent underline-offset-4 transition-colors duration-hover group-hover:decoration-sideband-text">
                    {c.login}
                  </span>
                  <span className="ml-auto text-small tabular-nums text-sideband-text-secondary">
                    {formatCount(c.contributions)}{' '}
                    {c.contributions === 1 ? 'commit' : 'commits'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={140}
          className="rounded-panel bg-sideband-surface-2 p-6 md:p-8"
        >
          <h3 className="text-lead font-medium text-sideband-text">
            Repository
          </h3>
          <dl className="mt-6 flex flex-col gap-4 text-small">
            <Row label="Latest release">
              {facts.latestRelease ? (
                <a
                  href={facts.latestRelease.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-sideband-muted/60 underline-offset-[3px] transition-colors duration-hover hover:decoration-sideband-text"
                >
                  {facts.latestRelease.tag},{' '}
                  {formatDate(facts.latestRelease.date)}
                </a>
              ) : (
                'No GitHub releases'
              )}
            </Row>
            {facts.releases > 0 && (
              <Row label="Releases">{formatCount(facts.releases)}</Row>
            )}
            <Row label="Created">{formatDate(facts.createdAt)}</Row>
            <Row label="Last push">{formatDate(facts.pushedAt)}</Row>
            <Row label="License">
              {facts.license.url ? (
                <a
                  href={facts.license.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-sideband-muted/60 underline-offset-[3px] transition-colors duration-hover hover:decoration-sideband-text"
                >
                  {facts.license.name}
                </a>
              ) : (
                facts.license.name
              )}
            </Row>
            <Row label="Open source">
              {facts.license.openSource ? 'Yes' : 'No'}
            </Row>
            <Row label="Ranking">
              <Link
                href="/products#ranking"
                className="underline decoration-sideband-muted/60 underline-offset-[3px] transition-colors duration-hover hover:decoration-sideband-text"
              >
                {ranked.rank} of {total}, score {ranked.score.toFixed(2)}
              </Link>
            </Row>
            <Row label="Synced">{syncedLabel}</Row>
          </dl>
          {facts.repoUrl ? (
            <ArrowLink
              href={facts.repoUrl}
              external
              tone="muted"
              className="mt-6 text-small"
            >
              {facts.repoKey}
            </ArrowLink>
          ) : (
            <p
              data-private-source=""
              className="mt-6 text-small text-sideband-muted"
            >
              Source is private
            </p>
          )}
        </Reveal>
      </div>
    </Section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="shrink-0 text-sideband-muted">{label}</dt>
      <dd className="text-right text-sideband-text">{children}</dd>
    </div>
  )
}

function Neighbours({
  previous,
  next,
}: {
  previous: RankedProduct | null
  next: RankedProduct | null
}) {
  const items = [
    previous && { r: previous, label: 'Previous by rank' },
    next && { r: next, label: 'Next by rank' },
  ].filter(Boolean) as { r: RankedProduct; label: string }[]

  return (
    <Section labelledBy="more-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="more-title" title="More from Sideband" />
        <Reveal delay={70}>
          <ArrowLink href="/products">All products</ArrowLink>
        </Reveal>
      </div>
      <ul className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2">
        {items.map(({ r, label }, i) => {
          const single = items.length === 1
          return (
            <Reveal
              as="li"
              key={r.product.id}
              delay={i * 70}
              className={cx(single && 'md:col-span-2')}
            >
              <Link
                href={`/products/${r.product.id}`}
                className={cx(
                  'group grid gap-5 rounded-panel',
                  single && 'md:grid-cols-2 md:items-center md:gap-10',
                )}
              >
                <ProductVideo
                  video={r.product.video.card}
                  cut="card"
                  lift
                  sizes="(min-width: 768px) 46vw, 92vw"
                />
                <span className="flex flex-col gap-2">
                  <span className="text-small text-sideband-muted">
                    {label}, ranked {r.rank}
                  </span>
                  <span className="text-lead font-medium text-sideband-text">
                    <ProductName name={r.product.name} />
                  </span>
                  <span className="text-small text-sideband-text-secondary">
                    {r.product.tagline}
                  </span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
