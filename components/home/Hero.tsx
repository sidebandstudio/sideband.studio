'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GlowButton from '@/components/ui/GlowButton'
import StatusBadge from '@/components/ui/StatusBadge'
import { products } from '@/lib/products'

const bootLines = [
  { text: '$ eternal-reverse --boot', cls: 'cmd' },
  { text: '', cls: 'dim' },
  { text: '  studio   : Eternal Reverse', cls: '' },
  { text: '  location : Boston, MA', cls: '' },
  { text: '  founded  : 2025', cls: '' },
  { text: '  products : 6 active', cls: '' },
  { text: '  stack    : Rust · Swift · React · Next.js', cls: '' },
  { text: '', cls: '' },
  { text: '  [OK] system ready.', cls: 'ok' },
]

function useTerminal() {
  const [output, setOutput] = useState<{ text: string; cls: string }[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      await new Promise((resolve) => setTimeout(resolve, 300))

      for (const line of bootLines) {
        if (cancelled) return

        setOutput((prev) => [...prev, { text: '', cls: line.cls }])

        for (let i = 0; i < line.text.length; i += 1) {
          if (cancelled) return
          await new Promise((resolve) =>
            setTimeout(resolve, line.text[i] === ' ' ? 6 : 10),
          )
          setOutput((prev) => {
            const next = [...prev]
            next[next.length - 1] = {
              text: line.text.slice(0, i + 1),
              cls: line.cls,
            }
            return next
          })
        }

        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      if (!cancelled) setDone(true)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return { output, done }
}

export default function Hero() {
  const { output, done } = useTerminal()

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-eternal-black">
      <div className="pointer-events-none absolute right-[8%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 animate-orb-float">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#A855F7_0%,#6366F1_55%,transparent_80%)] opacity-30 blur-[110px]" />
      </div>

      <div className="inner relative z-10 w-full pt-20 pb-20">
        <div className="hero-grid grid items-center gap-[60px]">
          <div>
            <div className="animate-fade-up [animation-delay:100ms] [animation-fill-mode:both]">
              <span className="text-[10px] uppercase tracking-[0.22em] text-eternal-accent">
                [ ETERNAL REVERSE · EST. 2025 ]
              </span>
            </div>

            <div className="mt-7 animate-fade-up [animation-delay:250ms] [animation-fill-mode:both]">
              <div className="terminal-box">
                <div className="terminal-content">
                  {output.map((line, index) => (
                    <div key={`${line.cls}-${index}`} className={`terminal-line ${line.cls}`}>
                      {line.text}
                      {index === output.length - 1 && !done ? (
                        <span className="terminal-cursor" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-9 animate-fade-up [animation-delay:800ms] [animation-fill-mode:both]">
              <h1 className="hero-headline font-display text-[72px] leading-[0.95] text-eternal-text-secondary">
                Software that
              </h1>
              <h1 className="hero-headline mt-1 font-display text-[72px] leading-[0.95] text-eternal-text">
                endures<span className="text-eternal-accent">.</span>
              </h1>
              <p className="mt-5 max-w-[400px] text-[13px] leading-[1.8] text-eternal-text-secondary">
                A three-founder studio shipping technically ambitious products for
                developers, athletes, and people who care about quality.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <GlowButton variant="filled" href="/products">
                  View Products
                </GlowButton>
                <GlowButton variant="ghost" href="/about">
                  Our Story →
                </GlowButton>
              </div>
            </div>
          </div>

          <div className="hero-right flex flex-col gap-3.5">
            <span className="mb-1 text-[10px] uppercase tracking-[0.15em] text-eternal-text-secondary">
              Active products
            </span>
            {products.map((product, index) => (
              <Link
                key={product.id}
                href="/products"
                className="animate-fade-up border border-eternal-border bg-eternal-surface px-4 py-3 transition-colors duration-200 hover:bg-eternal-surface-2"
                style={{
                  animationDelay: `${500 + index * 80}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{
                      backgroundColor: product.accentColor,
                      boxShadow:
                        product.status === 'LIVE'
                          ? `0 0 8px ${product.accentColor}`
                          : 'none',
                    }}
                  />
                  <span className="flex-1 text-[12px] text-eternal-text-secondary">
                    {product.name}
                  </span>
                  <StatusBadge status={product.status} />
                  {product.version ? (
                    <span className="text-[10px] text-eternal-muted">
                      {product.version}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
