import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import Backdrop from '@/components/ui/Backdrop'
import Button from '@/components/ui/Button'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { engineers, getEngineerById } from '@/lib/engineers'
import { rankedProducts } from '@/lib/products'
import { formatCount, syncedLabel } from '@/lib/engineers-github'
import { capitalize, countWord, productsBy } from '@/lib/engineers-view'
import {
  sidebandRole,
  studioFacts,
  studioTimeline,
} from '@/lib/engineers-studio'

const count = capitalize(countWord(engineers.length))

export const metadata: Metadata = {
  title: 'About · Sideband',
  description: `Sideband is an independent software studio in Boston, founded in 2025 as Eternal Reverse. ${count} engineers build and ship its products.`,
}

export default function AboutPage() {
  const facts = studioFacts()
  const timeline = studioTimeline()
  const ranked = rankedProducts()
  const builders = engineers
    .map((e) => ({ engineer: e, made: productsBy(e.id).length }))
    .filter((b) => b.made > 0)
    .sort((a, b) => b.made - a.made)
  const founded = timeline[0]?.year
  const cities = Array.from(
    new Set(
      engineers
        .map((e) => e.contact.location?.replace(/^Greater /, ''))
        .filter(Boolean),
    ),
  )

  const stats = [
    { value: formatCount(facts.products), label: 'Products' },
    { value: formatCount(facts.live), label: 'Live today' },
    { value: formatCount(facts.inDevelopment), label: 'In development' },
    { value: formatCount(facts.stars), label: 'Stars on their repos' },
    { value: formatCount(facts.releases), label: 'Releases published' },
    {
      value: formatCount(facts.contributions),
      label: 'Contributions last year',
    },
  ]

  const principles = [
    {
      title: 'Each product has its builders',
      body: `Every product names the people who build it. ${builders
        .map(
          (b, i) =>
            `${b.engineer.name} ${i === 0 ? 'builds ' : ''}${b.made}${i === 0 ? ` of the ${facts.products}` : ''}`,
        )
        .join(', ')}.`,
    },
    {
      title: 'Source in the open',
      body: `${facts.openSource === facts.products ? `All ${facts.products} products have` : `${facts.openSource} of the ${facts.products} products have`} public source on GitHub, with ${formatCount(facts.releases)} releases and ${formatCount(facts.stars)} stars between them as of ${syncedLabel}.`,
    },
    {
      title: 'Built for a need we had',
      body: 'Eternal2x exists because every frame interpolator Ali Tleis tried smeared the held frames in anime edits. EternalMonitor exists because Ali Younes would not pay $40 for an iPad display app that lagged.',
    },
    {
      title: 'A place to learn',
      body: 'Ali Younes started the studio to give younger engineers somewhere to get mentoring for free while they ship real products.',
    },
  ]

  return (
    <>
      <Section
        labelledBy="about-title"
        className="!pt-32"
        backdrop={<Backdrop variant="bands" />}
      >
        <SectionHeading
          as="h1"
          id="about-title"
          trigger="mount"
          eyebrow="About Sideband"
          title={`${count} engineers, one studio`}
          lede={`Sideband is an independent software studio in Boston, founded in ${founded} as Eternal Reverse. It makes its own software: ${facts.products} products so far, ${facts.live} of them live and ${facts.inDevelopment} in development.`}
          actions={
            <>
              <Button href="/products" size="lg">
                See the products
              </Button>
              <Button href="/engineers" variant="secondary" size="lg">
                Meet the engineers
              </Button>
            </>
          }
        />
        <Reveal trigger="mount" delay={280}>
          <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </dl>
          <p className="mt-8 text-small text-sideband-muted">
            Counts from the product list and the GitHub snapshot synced{' '}
            {syncedLabel}.
          </p>
        </Reveal>
      </Section>

      <Section labelledBy="people-title" className="!pt-0">
        <SectionHeading
          id="people-title"
          title="Who builds it"
          lede={`Students and working engineers in ${cities.join(' and ')}, each with a full dossier of their work.`}
        />
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {engineers.map((e, i) => {
            const made = productsBy(e.id)
            return (
              <Reveal
                as="li"
                key={e.id}
                delay={(i % 4) * 70}
                className="group relative"
              >
                {e.portrait && (
                  <Image
                    src={e.portrait.src}
                    alt=""
                    width={e.portrait.width}
                    height={e.portrait.height}
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/5] w-full rounded-panel bg-sideband-surface object-cover transition-transform duration-ui ease-out group-hover:-translate-y-1"
                  />
                )}
                <h3 className="mt-5 text-lead font-medium text-sideband-text">
                  <Link
                    href={`/engineers/${e.id}`}
                    className="after:absolute after:inset-0"
                  >
                    {e.name}
                  </Link>
                </h3>
                <p className="mt-1 text-small text-sideband-text-secondary">
                  {sidebandRole(e)?.role ?? e.role} since{' '}
                  {sidebandRole(e)?.startDate}
                </p>
                <p className="mt-1 text-small text-sideband-muted">
                  {e.contact.location}
                </p>
                <p className="mt-3 text-small text-sideband-text-secondary">
                  {made.length > 0
                    ? `Builds ${made.map((p) => p.name).join(', ')}`
                    : 'Systems design for the product lineup'}
                </p>
              </Reveal>
            )
          })}
        </ul>
      </Section>

      <Section labelledBy="how-title" tone="surface">
        <SectionHeading id="how-title" title="How we work" />
        <dl className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 70}>
              <dt className="text-lead font-medium text-sideband-text">
                {p.title}
              </dt>
              <dd className="mt-3 max-w-prose text-body text-sideband-text-secondary">
                {p.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section labelledBy="history-title">
        <SectionHeading
          id="history-title"
          title="How it started"
          lede="From the dates in each person’s work history, each product’s first year, and the studio’s own repository."
        />
        <ol className="mt-14 space-y-6">
          {timeline.map((y, yi) => (
            <Reveal
              as="li"
              key={y.year}
              delay={yi * 70}
              className="grid gap-6 rounded-panel bg-sideband-surface p-6 md:grid-cols-[10rem_1fr] md:gap-10 md:p-10"
            >
              <h3 className="text-head tabular-nums text-sideband-text">
                {y.year}
              </h3>
              <ol className="space-y-6">
                {y.events.map((e) => (
                  <li
                    key={e.text + e.date}
                    className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-6"
                  >
                    <span className="text-small tabular-nums text-sideband-muted sm:pt-0.5">
                      {e.date === String(y.year) ? 'During the year' : e.date}
                    </span>
                    <div className="text-body text-sideband-text">
                      {e.engineer ? (
                        <EventWithPerson text={e.text} id={e.engineer} />
                      ) : (
                        e.text
                      )}
                      {e.products && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {e.products.map((p) => (
                            <li key={p.id}>
                              <Link
                                href={`/products/${p.id}`}
                                className="inline-flex h-8 items-center rounded-full bg-sideband-surface-2 px-3.5 text-small text-sideband-text transition-colors duration-hover hover:bg-sideband-surface-3"
                              >
                                {p.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section labelledBy="shipped-title" tone="surface">
        <SectionHeading
          id="shipped-title"
          title="What we have shipped"
          lede={`All ${facts.products} products, ranked by use first (stars, forks and downloads) and then by scope (code, commits, contributors and platforms).`}
          actions={<Button href="/products">All products</Button>}
        />
        <ol className="mt-14 grid gap-3 lg:grid-cols-2">
          {ranked.map(({ product }, i) => (
            <Reveal as="li" key={product.id} delay={(i % 2) * 70}>
              <Link
                href={`/products/${product.id}`}
                className="group flex h-full items-center gap-5 rounded-inner bg-sideband-surface-2 p-4 transition-colors duration-hover ease-standard hover:bg-sideband-surface-3 md:p-5"
              >
                {product.icon ? (
                  <Image
                    src={product.icon.src}
                    alt=""
                    width={112}
                    height={112}
                    className="h-14 w-14 shrink-0 rounded-[14px]"
                  />
                ) : (
                  <span className="h-14 w-14 shrink-0" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-body font-medium text-sideband-text">
                      {product.name}
                    </span>
                    <span className="text-small text-sideband-muted">
                      {product.category}
                    </span>
                  </span>
                  <span className="mt-1 block text-small text-sideband-text-secondary">
                    {product.tagline}
                  </span>
                  <span className="mt-1 block text-small text-sideband-muted">
                    {product.engineers
                      .map((id) => getEngineerById(id)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </span>
                <span className="hidden shrink-0 sm:block">
                  <StatusBadge status={product.status} />
                </span>
                <ArrowRightIcon
                  size={16}
                  className="shrink-0 text-sideband-muted transition-transform duration-hover ease-out group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section labelledBy="cta-title">
        <SectionHeading
          id="cta-title"
          align="center"
          title="Want to build with us?"
          lede="Write to the studio about a product, a bug, or working together."
          actions={
            <Button href="/contact" size="lg">
              Get in touch
            </Button>
          }
        />
      </Section>
    </>
  )
}

/** An event sentence with the person's name linked to their dossier. */
function EventWithPerson({ text, id }: { text: string; id: string }) {
  const e = getEngineerById(id)
  if (!e || !text.startsWith(e.name)) return <>{text}</>
  return (
    <>
      <Link
        href={`/engineers/${id}`}
        className="underline decoration-sideband-border-strong underline-offset-4 transition-colors duration-hover hover:decoration-sideband-text"
      >
        {e.name}
      </Link>
      {text.slice(e.name.length)}
    </>
  )
}
