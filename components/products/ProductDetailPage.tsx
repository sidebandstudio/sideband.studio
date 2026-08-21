'use client'

import Link from 'next/link'
import { useState } from 'react'
import { products, type Product } from '@/lib/products'
import FadeUp from '@/components/animations/FadeUp'
import Tag from '@/components/ui/Tag'
import StatusBadge from '@/components/ui/StatusBadge'
import SectionLabel from '@/components/ui/SectionLabel'
import {
  BrowserFrame,
  IPadFrame,
  IPhoneFrame,
  TerminalFrame,
} from '@/components/products/DeviceFrames'

type GalleryItemType = Product['detail']['gallery'][number]

function GalleryItem({
  item,
  accent,
}: {
  item: GalleryItemType
  accent: string
}) {
  const [hov, setHov] = useState(false)

  const frame = (() => {
    if (item.device === 'phone') {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0',
          }}
        >
          <IPhoneFrame src={item.src} alt={item.label} width={200} />
        </div>
      )
    }
    if (item.device === 'ipad') {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0',
          }}
        >
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
  })()

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? accent + '50' : 'var(--eternal-border)'}`,
        background: 'var(--eternal-surface)',
        padding: 16,
        transition: 'all 0.25s',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px ${accent}18` : 'none',
      }}
    >
      {frame}
      <div style={{ marginTop: 12, padding: '0 4px' }}>
        <p
          style={{
            fontSize: 12,
            color: 'var(--eternal-text)',
            letterSpacing: '0.04em',
          }}
        >
          {item.label}
        </p>
        <p
          style={{
            fontSize: 10,
            color: 'var(--eternal-text-secondary)',
            marginTop: 3,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {item.sub}
        </p>
      </div>
    </div>
  )
}

function ArchitectureRow({
  step,
  title,
  body,
  accent,
}: {
  step: string
  title: string
  body: string
  accent: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: 24,
        padding: '28px 0',
        borderTop: '1px solid var(--eternal-border)',
        transition: 'background 0.2s',
        background: hov ? 'var(--eternal-surface)' : 'transparent',
      }}
    >
      <div style={{ paddingTop: 3 }}>
        <span
          className="font-display"
          style={{
            fontSize: 32,
            color: accent,
            opacity: 0.5,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {step}
        </span>
      </div>
      <div>
        <h3
          style={{
            fontSize: 15,
            color: 'var(--eternal-text)',
            marginBottom: 8,
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'var(--eternal-text-secondary)',
            lineHeight: 1.85,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ product }: { product: Product }) {
  const detail = product.detail
  const acc = detail.accentColor
  const index = products.findIndex((p) => p.id === product.id)
  const numLabel = String(index + 1).padStart(2, '0')

  return (
    <div style={{ paddingTop: 60, minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--eternal-border)',
          background: 'var(--eternal-black)',
        }}
      >
        {/* Orb */}
        <div
          style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: acc,
            opacity: 0.12,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            animation: 'orbFloat 8s ease-in-out infinite',
          }}
        />

        <div
          className="inner"
          style={{
            paddingTop: 56,
            paddingBottom: 64,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Back */}
          <Link
            href="/products"
            style={{
              background: 'none',
              border: '1px solid var(--eternal-border)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 14px',
              fontSize: 11,
              color: 'var(--eternal-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 40,
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = acc
              e.currentTarget.style.color = acc
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--eternal-border)'
              e.currentTarget.style.color = 'var(--eternal-text-secondary)'
            }}
          >
            ← Back to Products
          </Link>

          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              animation: 'fadeUp 0.5s both',
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: acc,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              [ {numLabel} ]
            </span>
            <StatusBadge status={product.status} />
            {product.version && (
              <span style={{ fontSize: 10, color: 'var(--eternal-muted)' }}>
                {product.version}
              </span>
            )}
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(52px, 7vw, 88px)',
              color: 'var(--eternal-text)',
              lineHeight: 0.95,
              marginBottom: 20,
              animation: 'fadeUp 0.5s 0.05s both',
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--eternal-text-secondary)',
              maxWidth: 600,
              lineHeight: 1.7,
              marginBottom: 40,
              animation: 'fadeUp 0.5s 0.1s both',
            }}
          >
            {detail.tagline}
          </p>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0,
              borderTop: '1px solid var(--eternal-border)',
              animation: 'fadeUp 0.5s 0.15s both',
            }}
          >
            {detail.stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: '16px 28px',
                  borderRight: '1px solid var(--eternal-border)',
                  borderBottom: '1px solid transparent',
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: 'var(--eternal-text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="font-display"
                  style={{
                    fontSize: 22,
                    color: 'var(--eternal-text)',
                    fontWeight: 700,
                  }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div
        style={{
          background: 'var(--eternal-surface)',
          borderBottom: '1px solid var(--eternal-border)',
          padding: '72px 0',
        }}
      >
        <div className="inner">
          <FadeUp>
            <SectionLabel label="GALLERY" withLine />
            <p
              style={{
                fontSize: 13,
                color: 'var(--eternal-text-secondary)',
                marginTop: 8,
              }}
            >
              Every view, every screen, every state.
            </p>
          </FadeUp>
          <div
            className="gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                detail.gallery.length <= 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
              gap: 16,
              marginTop: 32,
            }}
          >
            {detail.gallery.map((item, i) => (
              <FadeUp key={`${item.label}-${i}`} delay={i * 0.06}>
                <GalleryItem item={item} accent={acc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div
        style={{
          padding: '72px 0',
          borderBottom: '1px solid var(--eternal-border)',
        }}
      >
        <div className="inner">
          <FadeUp>
            <SectionLabel label="HOW IT WORKS" withLine />
            <h2
              className="font-display"
              style={{
                fontSize: 36,
                marginTop: 10,
                color: 'var(--eternal-text)',
              }}
            >
              Under the hood<span style={{ color: acc }}>.</span>
            </h2>
          </FadeUp>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {detail.architecture.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.07}>
                <ArchitectureRow
                  step={step.step}
                  title={step.title}
                  body={step.body}
                  accent={acc}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div
        style={{
          background: 'var(--eternal-surface)',
          padding: '72px 0',
          borderBottom: '1px solid var(--eternal-border)',
        }}
      >
        <div className="inner">
          <FadeUp>
            <SectionLabel label="HIGHLIGHTS" withLine />
          </FadeUp>
          <div
            className="highlights-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 32,
            }}
          >
            {detail.highlights.map((h, i) => (
              <FadeUp key={h} delay={i * 0.07}>
                <div
                  style={{
                    padding: '20px 22px',
                    border: '1px solid var(--eternal-border)',
                    background: 'var(--eternal-surface-2)',
                    display: 'flex',
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: acc,
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--eternal-text-secondary)',
                      lineHeight: 1.8,
                    }}
                  >
                    {h}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Full Tech Stack */}
      <div
        style={{
          padding: '72px 0',
          borderBottom: '1px solid var(--eternal-border)',
        }}
      >
        <div className="inner">
          <FadeUp>
            <SectionLabel label="FULL STACK" withLine />
          </FadeUp>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 24,
            }}
          >
            {product.tags.map((t) => (
              <Tag key={t} label={t} color={acc} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '64px 0' }}>
        <div className="inner">
          <FadeUp>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <p
                  className="font-display"
                  style={{ fontSize: 28, color: 'var(--eternal-text)' }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--eternal-text-secondary)',
                    marginTop: 4,
                  }}
                >
                  {product.status === 'LIVE'
                    ? 'Live and shipping.'
                    : 'In active development.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {product.github && (
                  <a
                    href={product.github}
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
                      border: `1px solid ${acc}`,
                      color: acc,
                      background: 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = acc
                      e.currentTarget.style.color = '#000'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = acc
                    }}
                  >
                    GitHub ↗
                  </a>
                )}
                {product.url && (
                  <a
                    href={product.url}
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
                      background: acc,
                      color: '#000',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 22px ${acc}80`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    Visit ↗
                  </a>
                )}
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 22px',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                    border: '1px solid var(--eternal-text-secondary)',
                    color: 'var(--eternal-text-secondary)',
                    background: 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'var(--eternal-text-secondary)'
                    e.currentTarget.style.color = '#000'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color =
                      'var(--eternal-text-secondary)'
                  }}
                >
                  ← All Products
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
