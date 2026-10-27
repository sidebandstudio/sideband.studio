'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Product, RankedProduct } from '@/lib/products'
import Badge from '@/components/ui/Badge'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  BrowserFrame,
  IPadFrame,
  IPhoneFrame,
} from '@/components/products/DeviceFrames'

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, vis] as const
}

interface ProductTextProps {
  num: string
  productId: string
  name: string
  version: string | null
  status: Product['status']
  problem: string
  solution: string
  tags: string[]
  github: string | null
  url: string | null
  accent: string
  vis: boolean
  dir?: 'left' | 'right'
}

function ProductText({
  num,
  productId,
  name,
  version,
  status,
  problem,
  solution,
  tags,
  github,
  url,
  accent,
  vis,
  dir = 'left',
}: ProductTextProps) {
  const anim = dir === 'left' ? 'slideRevealL' : 'slideRevealR'
  return (
    <div
      style={{
        animation: vis
          ? `${anim} 0.8s cubic-bezier(0.16,1,0.3,1) both`
          : 'none',
        opacity: vis ? 1 : 0,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: accent,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          [ {num} ]
        </span>
        <StatusBadge status={status} />
        {version && (
          <span
            style={{
              fontSize: 10,
              color: 'var(--sideband-muted)',
              letterSpacing: '0.06em',
            }}
          >
            {version}
          </span>
        )}
      </div>

      {/* Name */}
      <h2
        className="font-display"
        style={{
          fontSize: 'clamp(36px, 4vw, 54px)',
          color: 'var(--sideband-text)',
          lineHeight: 1.05,
          marginBottom: 36,
          fontWeight: 700,
        }}
      >
        {name}
      </h2>

      {/* Problem */}
      <div style={{ marginBottom: 28 }}>
        <span
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--sideband-text-secondary)',
            display: 'block',
            marginBottom: 10,
          }}
        >
          WHAT IT IS
        </span>
        <p className="prod-problem">{problem}</p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(to right, ${accent}40, transparent)`,
          margin: '24px 0',
        }}
      />

      {/* Solution */}
      <div style={{ marginBottom: 32 }}>
        <span
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: accent,
            display: 'block',
            marginBottom: 10,
          }}
        >
          HOW IT WORKS
        </span>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.9,
            color: 'var(--sideband-text)',
          }}
        >
          {solution}
        </p>
      </div>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          marginBottom: 28,
        }}
      >
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              textDecoration: 'none',
              border: `1px solid ${accent}`,
              color: accent,
              background: 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accent
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = accent
            }}
          >
            GitHub ↗
          </a>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              textDecoration: 'none',
              background: accent,
              color: '#000',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 22px ${accent}80`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Visit ↗
          </a>
        )}
        <Link
          href={`/products/${productId}`}
          style={{
            background: 'none',
            border: '1px solid var(--sideband-border)',
            cursor: 'pointer',
            padding: '10px 20px',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--sideband-text-secondary)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent
            e.currentTarget.style.color = accent
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--sideband-border)'
            e.currentTarget.style.color = 'var(--sideband-text-secondary)'
          }}
        >
          Deep Dive →
        </Link>
      </div>
    </div>
  )
}

/** One section per product, in ranked order, with its first real screenshot. */
function ProductSection({ product, rank }: { product: Product; rank: number }) {
  const [ref, vis] = useReveal()
  const num = String(rank).padStart(2, '0')
  const shot = product.images[0]
  const dir = rank % 2 === 1 ? 'left' : 'right'
  const host = product.links.site
    ? new URL(product.links.site).host
    : product.name

  const text = (
    <ProductText
      num={num}
      productId={product.id}
      name={product.name}
      version={product.version}
      status={product.status}
      problem={product.description}
      solution={product.overview[product.overview.length - 1]}
      tags={product.stack}
      github={product.links.repo ?? null}
      url={product.links.site ?? null}
      accent={product.accentColor}
      vis={vis}
      dir={dir}
    />
  )
  const device = (
    <div
      className={dir === 'left' ? 'prod-devices-right' : undefined}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: vis
          ? `${dir === 'left' ? 'slideRevealR' : 'slideRevealL'} 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both`
          : 'none',
        opacity: vis ? 1 : 0,
      }}
    >
      {shot.device === 'mobile' ? (
        <IPhoneFrame src={shot.src} alt={shot.alt} width={240} />
      ) : shot.device === 'ipad' ? (
        <IPadFrame src={shot.src} alt={shot.alt} width={320} />
      ) : (
        <div style={{ width: '100%' }}>
          <BrowserFrame
            src={shot.src}
            alt={shot.alt}
            url={host}
            objectPosition="top center"
          />
        </div>
      )}
    </div>
  )

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={product.id}
      className="prod-section"
    >
      <span
        className="prod-num"
        style={dir === 'left' ? { right: '3%' } : { left: '3%' }}
      >
        {num}
      </span>
      <div className="inner">
        <div className="prod-grid">
          {dir === 'left' ? text : device}
          {dir === 'left' ? device : text}
        </div>
      </div>
    </section>
  )
}

/** `ranked` comes from the server, so the GitHub snapshot stays out of the client bundle. */
export default function ProductsShowcase({
  ranked,
}: {
  ranked: RankedProduct[]
}) {
  return (
    <div style={{ paddingTop: 60 }}>
      {/* Header */}
      <div
        className="inner"
        style={{
          paddingTop: 72,
          paddingBottom: 80,
          borderBottom: '1px solid var(--sideband-border)',
        }}
      >
        <div
          style={{
            animation: 'slideRevealU 0.6s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--sideband-accent)',
            }}
          >
            [ PRODUCTS ]
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(48px, 7vw, 80px)',
              marginTop: 10,
              color: 'var(--sideband-text)',
              lineHeight: 0.95,
            }}
          >
            What we build
            <span style={{ color: 'var(--sideband-accent)' }}>.</span>
          </h1>
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: 'var(--sideband-text-secondary)',
              maxWidth: 480,
              lineHeight: 1.8,
            }}
          >
            Eleven products. Eight live, three in development. Ranked by use
            first, then by size, from the public GitHub numbers.
          </p>

          {/* Jump nav */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 28,
            }}
          >
            {ranked.map(({ product: p, rank }) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  border: '1px solid var(--sideband-border)',
                  fontSize: 11,
                  color: 'var(--sideband-text-secondary)',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: p.accentColor,
                    boxShadow:
                      p.status === 'LIVE' ? `0 0 6px ${p.accentColor}` : 'none',
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--sideband-muted)' }}>
                  {String(rank).padStart(2, '0')}
                </span>
                {p.name}
                <StatusBadge status={p.status} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {ranked.map(({ product, rank }) => (
        <ProductSection key={product.id} product={product} rank={rank} />
      ))}
    </div>
  )
}
