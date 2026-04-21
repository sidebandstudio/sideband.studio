'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/lib/products'
import StatusBadge from '@/components/ui/StatusBadge'
import Tag from '@/components/ui/Tag'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? product.accentColor + '50' : 'var(--eternal-border)'}`,
        background: 'var(--eternal-surface)',
        transition:
          'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 40px ${product.accentColor}18`
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both`,
      }}
    >
      {/* Hero — branded visual or image */}
      {product.cardHero === 'branded' ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '62%',
            overflow: 'hidden',
            background:
              product.id === 'eternal-monitor'
                ? '#000'
                : 'radial-gradient(ellipse at 50% 35%, #2d1b50 0%, #080810 70%)',
          }}
        >
          {product.id === 'eternal-monitor' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(212,245,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,245,60,0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: '#7C3AED',
                opacity: 0.25,
                filter: 'blur(50px)',
              }}
            />
          )}

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {product.id === 'eternal-monitor' ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {[32, 24, 32].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        width: w,
                        height: 3,
                        background: '#D4F53C',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '0.04em',
                    fontFamily: 'inherit',
                  }}
                >
                  EternalMonitor
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: '#D4F53C',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}
                >
                  Windows display streaming
                </span>
              </>
            ) : (
              <>
                <div
                  style={{
                    position: 'relative',
                    width: 30,
                    height: 40,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 26,
                      height: 32,
                      background:
                        'linear-gradient(to top, #6D28D9, #8B5CF6)',
                      borderRadius:
                        '50% 50% 45% 45% / 55% 55% 45% 45%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 14,
                      height: 20,
                      background:
                        'linear-gradient(to top, #7C3AED, #A78BFA)',
                      borderRadius:
                        '50% 50% 40% 40% / 60% 60% 35% 35%',
                    }}
                  />
                </div>
                <span
                  className="font-display"
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                    letterSpacing: '0.01em',
                  }}
                >
                  Exerly
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: '#A78BFA',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                  }}
                >
                  AI-powered fitness companion
                </span>
              </>
            )}
          </div>
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <StatusBadge status={product.status} />
          </div>
        </div>
      ) : product.cardHero ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '62%',
            overflow: 'hidden',
            background: 'var(--eternal-surface-2)',
          }}
        >
          <img
            src={product.images[imgIdx] ?? product.cardHero}
            alt={product.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              transition: 'opacity 0.3s',
            }}
          />
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <StatusBadge status={product.status} />
          </div>
          {product.images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 4,
              }}
            >
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background:
                      i === imgIdx
                        ? product.accentColor
                        : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Body */}
      <div
        style={{
          padding: '20px 22px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: 22,
                color: 'var(--eternal-text)',
                fontWeight: 700,
              }}
            >
              {product.name}
            </h3>
            {product.version && (
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--eternal-muted)',
                  letterSpacing: '0.08em',
                }}
              >
                {product.version}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: 'var(--eternal-text-secondary)',
            }}
          >
            {product.tagline}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {product.tags.slice(0, 5).map((t) => (
            <Tag key={t} label={t} color={product.accentColor} />
          ))}
          {product.tags.length > 5 && (
            <Tag label={`+${product.tags.length - 5}`} />
          )}
        </div>

        {/* Highlight */}
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'var(--eternal-text-secondary)',
            borderTop: '1px solid var(--eternal-border)',
            paddingTop: 10,
            marginTop: 'auto',
          }}
        >
          {product.highlight}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {product.github && (
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                border: `1px solid ${product.accentColor}`,
                color: product.accentColor,
                background: 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = product.accentColor
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = product.accentColor
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
                gap: 6,
                padding: '9px 18px',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                background: product.accentColor,
                color: '#000',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 22px ${product.accentColor}80`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Visit ↗
            </a>
          )}
          <Link
            href={`/products/${product.id}`}
            style={{
              background: 'none',
              border: '1px solid var(--eternal-border)',
              cursor: 'pointer',
              padding: '9px 16px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--eternal-text-secondary)',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = product.accentColor
              e.currentTarget.style.color = product.accentColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--eternal-border)'
              e.currentTarget.style.color = 'var(--eternal-text-secondary)'
            }}
          >
            Deep Dive →
          </Link>
        </div>
      </div>
    </div>
  )
}
