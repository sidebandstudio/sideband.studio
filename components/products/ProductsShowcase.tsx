'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { products, type Product } from '@/lib/products'
import Tag from '@/components/ui/Tag'
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
        animation: vis ? `${anim} 0.8s cubic-bezier(0.16,1,0.3,1) both` : 'none',
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
              color: 'var(--eternal-muted)',
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
          color: 'var(--eternal-text)',
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
            color: 'var(--eternal-text-secondary)',
            display: 'block',
            marginBottom: 10,
          }}
        >
          THE PROBLEM
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
          THE SOLUTION
        </span>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.9,
            color: 'var(--eternal-text)',
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
          <Tag key={t} label={t} color={accent} />
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
            border: '1px solid var(--eternal-border)',
            cursor: 'pointer',
            padding: '10px 20px',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--eternal-text-secondary)',
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
            e.currentTarget.style.borderColor = 'var(--eternal-border)'
            e.currentTarget.style.color = 'var(--eternal-text-secondary)'
          }}
        >
          Deep Dive →
        </Link>
      </div>
    </div>
  )
}

// ── 01 EternalMonitor ─────────────────────────────────────────────────────
function EternalMonitorSection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ right: '3%' }}>
        01
      </span>
      <div className="inner">
        <div className="prod-grid">
          <ProductText
            num="01"
            productId="eternal-monitor"
            name="EternalMonitor"
            version="v0.1.1-mirror"
            status="IN DEVELOPMENT"
            accent="#A855F7"
            problem="Your second monitor costs $300. Your iPad Pro costs $1000+. Neither talks to Windows natively — you either buy a dongle, pay a subscription, or accept the latency."
            solution="EternalMonitor captures your desktop via DXGI Desktop Duplication, transcodes BGRA→YUV420P, and encodes H.264 in hardware — NVENC, AMF, or QuickSync auto-selected. Streams over fragmented UDP to an iPad client that decodes via VideoToolbox and renders with Metal. Zero-config discovery via mDNS."
            tags={[
              'Rust',
              'Swift',
              'DXGI',
              'VideoToolbox',
              'Metal',
              'H.264',
              'NVENC',
              'UDP',
              'mDNS',
            ]}
            github="https://github.com/whoisaldo/EternalMonitor"
            url="https://eternalmonitor.dev"
            vis={vis}
            dir="left"
          />

          {/* Devices: iPad + PC overlay */}
          <div
            className="prod-devices-right"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 480,
              animation: vis
                ? 'slideRevealR 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            {/* Glow behind */}
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: '#A855F7',
                opacity: 0.1,
                filter: 'blur(80px)',
                animation: 'glowPulse 4s ease-in-out infinite',
              }}
            />

            {/* iPad (main) */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <IPadFrame
                src="/assets/EternalMonitor/EternalMonitorIpadView.png"
                alt="EternalMonitor on iPad"
                width={300}
              />
            </div>

            {/* PC window floating top-right */}
            <div
              style={
                {
                  position: 'absolute',
                  top: -10,
                  right: -20,
                  width: 210,
                  zIndex: 3,
                  '--r': '2deg',
                  animation: 'deviceFloatB 7s ease-in-out 0.8s infinite',
                } as CSSProperties
              }
            >
              <BrowserFrame
                src="/assets/EternalMonitor/EternalMonitorPCView.png"
                alt="EternalMonitor PC app"
                url="EternalMonitor Host v0.1.1"
              />
            </div>

            {/* Tech label bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--eternal-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                iPad × Windows · Rust + Swift
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 02 EternalRichPresence ────────────────────────────────────────────────
function RichPresenceSection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ left: '3%' }}>
        02
      </span>
      <div className="inner">
        <div className="prod-grid">
          {/* Devices LEFT */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-start',
              animation: vis
                ? 'slideRevealL 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: '#6366F1',
                opacity: 0.1,
                filter: 'blur(70px)',
                top: '20%',
                left: '10%',
                animation: 'glowPulse 5s ease-in-out infinite',
              }}
            />

            {/* Discord view in browser */}
            <div
              style={
                {
                  width: '100%',
                  maxWidth: 440,
                  '--r': '0deg',
                  animation: 'deviceFloat 6s ease-in-out infinite',
                  position: 'relative',
                  zIndex: 2,
                } as CSSProperties
              }
            >
              <BrowserFrame
                src="/assets/EternalRichPresence/EternalRichPresenceDiscordProfileView.png"
                alt="Discord Rich Presence view"
                url="discord.com/channels/@me"
              />
            </div>

            {/* Terminal below */}
            <div
              style={
                {
                  width: '100%',
                  maxWidth: 440,
                  '--r': '0deg',
                  animation: 'deviceFloatC 7s ease-in-out 1s infinite',
                  position: 'relative',
                  zIndex: 2,
                } as CSSProperties
              }
            >
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
                    eternalrp — terminal
                  </span>
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}>
                  <Image
                    src="/assets/EternalRichPresence/EternalRichPresenceTerminal.png"
                    alt="EternalRichPresence terminal"
                    fill
                    sizes="(min-width: 1024px) 440px, 100vw"
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: 10,
                color: 'var(--eternal-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Windows SMTC → Discord · Python + PyInstaller
            </span>
          </div>

          {/* Text RIGHT */}
          <ProductText
            num="02"
            productId="eternal-rich-presence"
            name="EternalRichPresence"
            version="v1.0.0-beta"
            status="LIVE"
            accent="#6366F1"
            problem="Apple Music runs on Windows. Spotify too. But Discord sees nothing — your Rich Presence is blank, your listening activity invisible, and there's no official bridge."
            solution="A lightweight Python daemon that reads the Windows System Media Transport Controls (SMTC) and bridges it to Discord Rich Presence. Live album art via upload, custom eternalrp:// URI scheme for Listen Along deep-links. Ships as a portable .exe — no install, no friction."
            tags={[
              'Python',
              'pywin32',
              'pypresence',
              'COM/SMTC',
              'Discord API',
              'PyInstaller',
            ]}
            github="https://github.com/whoisaldo/Eternal-Rich-Presence"
            url={null}
            vis={vis}
            dir="right"
          />
        </div>
      </div>
    </section>
  )
}

// ── 03 Exerly Fitness ─────────────────────────────────────────────────────
interface PhoneItem {
  key: string
  src: string
  label: string
  tilt: number
  yOff: number
  w: number
  zBase: number
  delay: number
}

function ExerlyPhoneFan() {
  const [hovered, setHovered] = useState<string | null>(null)

  const phones: PhoneItem[] = [
    {
      key: 'left',
      src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView3.png',
      label: 'Progress',
      tilt: -9,
      yOff: 28,
      w: 185,
      zBase: 1,
      delay: 0.3,
    },
    {
      key: 'center',
      src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView1.png',
      label: 'Dashboard',
      tilt: 0,
      yOff: 0,
      w: 210,
      zBase: 3,
      delay: 0,
    },
    {
      key: 'right',
      src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView2.png',
      label: 'AI Coach',
      tilt: 9,
      yOff: 28,
      w: 185,
      zBase: 2,
      delay: 0.6,
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {phones.map((p, idx) => {
        const isHov = hovered === p.key
        const isDim = hovered !== null && hovered !== p.key
        const margin =
          idx === 0
            ? { marginRight: -52 }
            : idx === 2
              ? { marginLeft: -52 }
              : {}
        const tilt = isHov ? 0 : p.tilt
        const yOff = isHov ? 0 : p.yOff
        const scale = isHov ? 1.08 : isDim ? 0.91 : 1
        const zIdx = isHov ? 10 : isDim ? 0 : p.zBase

        return (
          <div
            key={p.key}
            onMouseEnter={() => setHovered(p.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...margin,
              zIndex: zIdx,
              transform: `rotate(${tilt}deg) translateY(${yOff}px) scale(${scale})`,
              transition:
                'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
              opacity: isDim ? 0.5 : 1,
              cursor: 'pointer',
              flexShrink: 0,
              animation: isHov
                ? 'none'
                : `deviceFloat ${5 + p.delay * 0.5}s ease-in-out ${p.delay}s infinite`,
              position: 'relative',
            }}
          >
            <IPhoneFrame
              src={p.src}
              alt={`Exerly ${p.label}`}
              width={p.w}
            />
            {isHov && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: 10,
                    color: '#D946EF',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    animation: 'slideRevealU 0.25s both',
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: -24,
                    borderRadius: '50%',
                    background: '#D946EF',
                    opacity: 0.15,
                    filter: 'blur(32px)',
                    zIndex: -1,
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ExerlySection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ right: '3%' }}>
        03
      </span>
      <div className="inner">
        <div className="prod-grid">
          <ProductText
            num="03"
            productId="exerly"
            name="Exerly Fitness"
            version={null}
            status="IN DEVELOPMENT"
            accent="#D946EF"
            problem="Fitness apps treat everyone the same. Generic macros, no AI coaching, no integration with your actual health data. You track calories in a vacuum."
            solution="A 12-step onboarding wizard computes your exact BMI, TDEE, and macro targets. Gemini 2.0 Flash coaches you in real-time. SwiftUI + HealthKit on iOS, shared Express API with the web client. Barcode scanner via FatSecret. Progress photo compare mode."
            tags={[
              'SwiftUI',
              'HealthKit',
              'React',
              'TypeScript',
              'Node.js',
              'MongoDB',
              'Gemini AI',
              'FatSecret API',
            ]}
            github="https://github.com/whoisaldo/Exerly-Fitness"
            url="https://whoisaldo.github.io/Exerly-Fitness/"
            vis={vis}
            dir="left"
          />

          {/* Devices: interactive 3 phones + web view */}
          <div
            className="prod-devices-right"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 560,
              animation: vis
                ? 'slideRevealR 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: '#D946EF',
                opacity: 0.1,
                filter: 'blur(80px)',
                animation: 'glowPulse 4.5s ease-in-out infinite',
              }}
            />

            <ExerlyPhoneFan />

            {/* Web dashboard below the fan */}
            <div
              style={{
                position: 'absolute',
                bottom: -60,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 300,
                zIndex: 0,
                animation: 'deviceFloatB 7s ease-in-out 1.2s infinite',
              }}
            >
              <BrowserFrame
                src="/assets/ExerlyFitness/ExerlyWebViewAICoach.png"
                alt="Exerly AI coach"
                url="exerly.app/coach"
              />
            </div>

            <div style={{ position: 'absolute', bottom: -96, right: 0 }}>
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--eternal-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                iOS + Web · SwiftUI + React
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 05 Eternal2x ─────────────────────────────────────────────────────────
function Eternal2xSection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ right: '3%' }}>
        05
      </span>
      <div className="inner">
        <div className="prod-grid">
          <ProductText
            num="05"
            productId="eternal2x"
            name="Eternal2x"
            version="v0.2.0"
            status="LIVE"
            accent="#8B5CF6"
            problem="Upscaling old footage to 4K in DaVinci Resolve is slow, manual, and lossy. Editors waste hours marking motion ranges, splitting clips, and re-rendering dead frames that didn't need touching in the first place."
            solution="Eternal2x is a Python + Lua + OpenCV pipeline that auto-detects motion frames, isolates active segments via threshold-based detection, removes dead frames before interpolation, and automates marker placement, clip segmentation, and timeline reconstruction inside DaVinci Resolve — then upscales the result to 4K with FFmpeg."
            tags={[
              'Python',
              'Lua',
              'OpenCV',
              'FFmpeg',
              'DaVinci Resolve API',
            ]}
            github="https://github.com/Alitleis123/Eternal2x.com"
            url="https://Eternal2x.com"
            vis={vis}
            dir="left"
          />

          {/* Devices: Eternal2x homepage browser + phone overlay */}
          <div
            className="prod-devices-right"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 480,
              animation: vis
                ? 'slideRevealR 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            {/* Glow behind */}
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: '#8B5CF6',
                opacity: 0.1,
                filter: 'blur(80px)',
                animation: 'glowPulse 4.5s ease-in-out infinite',
              }}
            />

            {/* Browser (main) */}
            <div
              style={
                {
                  position: 'relative',
                  zIndex: 2,
                  width: '100%',
                  maxWidth: 440,
                  '--r': '0deg',
                  animation: 'deviceFloat 6s ease-in-out infinite',
                } as CSSProperties
              }
            >
              <BrowserFrame
                src="/assets/Eternal2x/Eternal2xHome.png"
                alt="Eternal2x homepage"
                url="Eternal2x.com"
                objectPosition="top center"
              />
            </div>

            {/* Phone floating bottom-right */}
            <div
              style={
                {
                  position: 'absolute',
                  bottom: -30,
                  right: -10,
                  width: 150,
                  zIndex: 3,
                  '--r': '3deg',
                  animation: 'deviceFloatB 7s ease-in-out 0.8s infinite',
                } as CSSProperties
              }
            >
              <IPhoneFrame
                src="/assets/Eternal2x/Eternal2xPhone.png"
                alt="Eternal2x on mobile"
                width={150}
              />
            </div>

            {/* Tech label bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: -52,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--eternal-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                DaVinci Resolve · Python + Lua + OpenCV
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 06 Eternal Summary ───────────────────────────────────────────────────
function EternalSummarySection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ left: '3%' }}>
        06
      </span>
      <div className="inner">
        <div className="prod-grid">
          {/* Devices LEFT */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 480,
              animation: vis
                ? 'slideRevealL 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: '#E879F9',
                opacity: 0.1,
                filter: 'blur(80px)',
                animation: 'glowPulse 5s ease-in-out infinite',
              }}
            />

            {/* Home page in browser (main) */}
            <div
              style={
                {
                  position: 'relative',
                  zIndex: 2,
                  width: '100%',
                  maxWidth: 440,
                  '--r': '0deg',
                  animation: 'deviceFloat 6s ease-in-out infinite',
                } as CSSProperties
              }
            >
              <BrowserFrame
                src="/assets/EternalSummary/EternalSummaryHomePage.png"
                alt="Eternal Summary home page"
                url="alitleis123.github.io/Eternal-Summary"
                objectPosition="top center"
              />
            </div>

            {/* Phone floating bottom-left */}
            <div
              style={
                {
                  position: 'absolute',
                  bottom: -30,
                  left: -10,
                  width: 150,
                  zIndex: 3,
                  '--r': '-3deg',
                  animation: 'deviceFloatC 7s ease-in-out 1s infinite',
                } as CSSProperties
              }
            >
              <IPhoneFrame
                src="/assets/EternalSummary/EternalSummaryPhone.png"
                alt="Eternal Summary on mobile"
                width={150}
              />
            </div>

            {/* Tech label bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: -52,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--eternal-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                MV3 · Node + Express on Fly.io
              </span>
            </div>
          </div>

          {/* Text RIGHT */}
          <ProductText
            num="06"
            productId="eternal-summary"
            name="Eternal Summary"
            version="v1.0.0"
            status="LIVE"
            accent="#E879F9"
            problem="Reading long articles, docs, and research pages is a tax on attention. Existing summarizer extensions are bloated, slow, or send your data through a chain of middlemen."
            solution="Eternal Summary is a minimal MV3 Chrome extension that AI-summarizes any webpage in real time. Content scripts extract live page content, a Node/Express backend on Fly.io brokers the Gemini API request, and the summary streams back into a clean popup overlay — one click, no friction."
            tags={[
              'JavaScript',
              'Chrome Extensions API',
              'Node.js',
              'Express',
              'Docker',
              'Gemini API',
              'Fly.io',
            ]}
            github="https://github.com/Alitleis123/Eternal-Summary"
            url="https://alitleis123.github.io/Eternal-Summary/"
            vis={vis}
            dir="right"
          />
        </div>
      </div>
    </section>
  )
}

// ── 04 Signature Cuts 413 ─────────────────────────────────────────────────
function SignatureCutsSection() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="prod-section">
      <span className="prod-num" style={{ left: '3%' }}>
        04
      </span>
      <div className="inner">
        <div className="prod-grid">
          {/* Devices LEFT */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              animation: vis
                ? 'slideRevealL 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both'
                : 'none',
              opacity: vis ? 1 : 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: '#C084FC',
                opacity: 0.1,
                filter: 'blur(70px)',
                animation: 'glowPulse 5s ease-in-out infinite',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />

            {/* Phone (main) */}
            <div
              style={
                {
                  position: 'relative',
                  zIndex: 2,
                  '--r': '0deg',
                  animation: 'deviceFloat 5.5s ease-in-out infinite',
                } as CSSProperties
              }
            >
              <IPhoneFrame
                src="/assets/SignatureCuts/SignatureCutsPhoneView.png"
                alt="Signature Cuts on mobile"
                width={250}
              />
            </div>

            {/* Browser below */}
            <div
              style={
                {
                  width: 320,
                  zIndex: 2,
                  '--r': '0deg',
                  animation: 'deviceFloatB 6.5s ease-in-out 0.9s infinite',
                  position: 'relative',
                } as CSSProperties
              }
            >
              <BrowserFrame
                src="/assets/SignatureCuts/SignatureCutsWebView.png"
                alt="Signature Cuts web"
                url="signaturecutschicopee.com"
              />
            </div>

            <span
              style={{
                fontSize: 10,
                color: 'var(--eternal-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Mobile-first · Zero backend
            </span>
          </div>

          {/* Text RIGHT */}
          <ProductText
            num="04"
            productId="signature-cuts"
            name="Signature Cuts 413"
            version={null}
            status="LIVE"
            accent="#C084FC"
            problem="Booking a haircut requires downloading an app, creating an account, or making a phone call. For a local barbershop in Chicopee, MA — this friction costs appointments."
            solution="A static Next.js site, mobile-first by design, with SMS and WhatsApp deep-link booking flows. Tap to open a pre-filled booking message — no app, no account, no backend. Custom domain, fast, dead simple."
            tags={[
              'Next.js',
              'Tailwind CSS',
              'SMS Deep-link',
              'WhatsApp API',
              'Static Site',
            ]}
            github={null}
            url="https://signaturecutschicopee.com"
            vis={vis}
            dir="right"
          />
        </div>
      </div>
    </section>
  )
}

export default function ProductsShowcase() {
  return (
    <div style={{ paddingTop: 60 }}>
      {/* Header */}
      <div
        className="inner"
        style={{
          paddingTop: 72,
          paddingBottom: 80,
          borderBottom: '1px solid var(--eternal-border)',
        }}
      >
        <div style={{ animation: 'slideRevealU 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <span
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--eternal-accent)',
            }}
          >
            [ PRODUCTS ]
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(48px, 7vw, 80px)',
              marginTop: 10,
              color: 'var(--eternal-text)',
              lineHeight: 0.95,
            }}
          >
            What we build
            <span style={{ color: 'var(--eternal-accent)' }}>.</span>
          </h1>
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: 'var(--eternal-text-secondary)',
              maxWidth: 480,
              lineHeight: 1.8,
            }}
          >
            Six products. Four live. Two in active development. Each one
            technically ambitious, obsessively refined.
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
            {products.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  border: '1px solid var(--eternal-border)',
                  fontSize: 11,
                  color: 'var(--eternal-text-secondary)',
                  letterSpacing: '0.06em',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: p.accentColor,
                    boxShadow:
                      p.status === 'LIVE'
                        ? `0 0 6px ${p.accentColor}`
                        : 'none',
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--eternal-muted)' }}>
                  0{i + 1}
                </span>
                {p.name}
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <EternalMonitorSection />
      <RichPresenceSection />
      <ExerlySection />
      <SignatureCutsSection />
      <Eternal2xSection />
      <EternalSummarySection />
    </div>
  )
}
