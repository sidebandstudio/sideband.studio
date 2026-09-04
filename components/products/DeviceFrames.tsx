import Image from 'next/image'
import type { CSSProperties } from 'react'

interface FrameProps {
  src: string
  alt: string
}

interface SizedFrameProps extends FrameProps {
  width?: number
}

interface BrowserFrameProps extends FrameProps {
  url?: string
  objectPosition?: string
}

interface TerminalFrameProps extends FrameProps {
  label?: string
  sizes?: string
}

export function IPhoneFrame({ src, alt, width = 230 }: SizedFrameProps) {
  const h = Math.round(width * 2.167)

  return (
    <div
      className="iphone-wrap"
      style={
        {
          '--r': '0deg',
          animation: 'deviceFloat 5s ease-in-out 0s infinite',
          flexShrink: 0,
        } as CSSProperties
      }
    >
      <div
        style={{
          position: 'relative',
          width,
          height: h,
          background: '#0b0b0b',
          borderRadius: width * 0.155,
          border: `${Math.round(width * 0.032)}px solid #2c2c2c`,
          boxShadow: 'inset 0 0 0 1px #3a3a3a',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: width * 0.038,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.37,
            height: width * 0.108,
            background: '#000',
            borderRadius: width * 0.054,
            zIndex: 10,
          }}
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          style={{
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export function IPadFrame({ src, alt, width = 340 }: SizedFrameProps) {
  const h = Math.round(width * 1.333)

  return (
    <div
      className="ipad-wrap"
      style={
        {
          '--r': '0deg',
          animation: 'deviceFloat 6s ease-in-out infinite',
          flexShrink: 0,
        } as CSSProperties
      }
    >
      <div
        style={{
          position: 'relative',
          width,
          height: h,
          background: '#0b0b0b',
          borderRadius: width * 0.055,
          border: `${Math.round(width * 0.025)}px solid #2c2c2c`,
          boxShadow: 'inset 0 0 0 1px #3a3a3a',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.28,
            height: 3,
            background: '#555',
            borderRadius: 2,
            zIndex: 10,
          }}
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          style={{
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export function BrowserFrame({
  src,
  alt,
  url = '',
  objectPosition,
}: BrowserFrameProps) {
  return (
    <div
      className="browser-wrap"
      style={{
        borderRadius: 9,
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
        background: '#0d0d0d',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 36,
          background: '#171717',
          borderBottom: '1px solid #242424',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c,
                opacity: 0.75,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: '#222',
            borderRadius: 4,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            padding: '0 9px',
            fontSize: 10,
            color: '#4a4a4a',
            letterSpacing: '0.03em',
            maxWidth: 260,
            marginLeft: 6,
          }}
        >
          {url}
        </div>
      </div>
      <div
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition, display: 'block' }}
        />
      </div>
    </div>
  )
}

export function TerminalFrame({
  src,
  alt,
  label = 'terminal',
  sizes = '100vw',
}: TerminalFrameProps) {
  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
        background: '#0d0d0d',
      }}
    >
      <div
        style={{
          height: 30,
          background: '#151515',
          borderBottom: '1px solid #222',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 12px',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div
            key={c}
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: c,
              opacity: 0.75,
            }}
          />
        ))}
        <span
          style={{
            fontSize: 10,
            color: '#444',
            marginLeft: 8,
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover', display: 'block' }}
        />
      </div>
    </div>
  )
}
