'use client'

import { useEffect, useRef, useState } from 'react'
import { products } from '@/lib/products'
import { listEngineers } from '@/lib/engineers'

type Line = { html: string }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const STATUS_HTML: Record<string, string> = {
  LIVE: '<span class="text-[#4ade80]">live</span>  ',
  'IN DEVELOPMENT': '<span class="text-[#fbbf24]">in dev</span>',
  'COMING SOON': '<span class="text-sideband-muted">soon</span>  ',
}

const COMMANDS = ['help', 'products', 'stack', 'team', 'contact', 'clear']

function commandOutput(cmd: string): string[] | 'clear' | null {
  switch (cmd) {
    case 'help':
      return [
        '  <span class="term-d">commands:</span>',
        '  products   <span class="term-d">list all six products</span>',
        '  stack      <span class="term-d">what we build with</span>',
        '  team       <span class="term-d">who we are</span>',
        '  contact    <span class="term-d">reach the studio</span>',
        '  clear      <span class="term-d">clear the screen</span>',
      ]
    case 'products':
      return products.map((p) => {
        const link = p.url ?? p.github
        const name = link
          ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${esc(p.name)}</a>`
          : esc(p.name)
        return `  ${STATUS_HTML[p.status] ?? ''}  ${name} <span class="term-d">· ${esc(p.highlight)}</span>`
      })
    case 'stack':
      return [
        '  <span class="term-d">systems :</span> Rust · Swift · Metal · DXGI · VideoToolbox · FFmpeg',
        '  <span class="term-d">web     :</span> Next.js · React · TypeScript · Node.js',
        '  <span class="term-d">mobile  :</span> SwiftUI · HealthKit',
        '  <span class="term-d">data    :</span> MongoDB · DigitalOcean · Gemini AI',
      ]
    case 'team':
      return listEngineers().map(
        (e) =>
          `  ${esc(e.name.padEnd(12))}<span class="term-d">· ${esc(e.role.toLowerCase())}</span>`,
      )
    case 'contact':
      return [
        '  <a href="mailto:hello@sideband.studio">hello@sideband.studio</a>',
        '  <a href="https://github.com/sidebandstudio" target="_blank" rel="noopener noreferrer">github.com/sidebandstudio</a>',
      ]
    case 'clear':
      return 'clear'
    default:
      return null
  }
}

const LIVE_COUNT = products.filter((p) => p.status === 'LIVE').length
const DEV_COUNT = products.filter((p) => p.status === 'IN DEVELOPMENT').length

const BOOT_INFO = [
  '  Sideband · independent software studio',
  `  Boston, MA · est. 2025 · ${listEngineers().length} founders`,
  `  ${products.length} products: ${LIVE_COUNT} live, ${DEV_COUNT} in development`,
]

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([])
  const [typed, setTyped] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const [value, setValue] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let cancelled = false

    async function boot() {
      const cmd = 'sb --studio'
      if (reduced) {
        setTyped(cmd)
      } else {
        for (let i = 0; i <= cmd.length; i += 1) {
          if (cancelled) return
          setTyped(cmd.slice(0, i))
          await new Promise((r) => setTimeout(r, 22))
        }
      }
      for (const l of BOOT_INFO) {
        if (cancelled) return
        setLines((prev) => [...prev, { html: esc(l) }])
        if (!reduced) await new Promise((r) => setTimeout(r, 70))
      }
      if (!cancelled) setBooted(true)
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, booted])

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase().split(/\s+/)[0] ?? ''
    const echo = { html: `<span class="term-p">$</span> ${esc(raw.trim())}` }
    if (cmd === '') {
      setLines((prev) => [...prev, echo])
      return
    }
    const out = commandOutput(cmd)
    if (out === 'clear') {
      setLines([])
    } else if (out) {
      setLines((prev) => [...prev, echo, ...out.map((html) => ({ html }))])
    } else {
      setLines((prev) => [
        ...prev,
        echo,
        {
          html: `  <span class="term-d">command not found: ${esc(cmd)}. try</span> help`,
        },
      ])
    }
    setValue('')
  }

  return (
    <div className="mx-auto max-w-[760px] text-left">
      <div className="overflow-hidden rounded-xl border border-sideband-border bg-[#0a0913] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-1.5 border-b border-sideband-border bg-white/[0.03] px-3.5 py-2.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          <span className="ml-2 font-mono text-[11px] text-sideband-muted">
            sideband · zsh
          </span>
          <span className="ml-auto font-mono text-[11px] text-sideband-muted">
            interactive · try{' '}
            <b className="font-medium text-sideband-text-secondary">help</b>
          </span>
        </div>

        <div
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
          className="term-scroll h-[284px] overflow-y-auto px-[18px] py-4 font-mono text-[13px] leading-[1.75] text-sideband-text-secondary"
        >
          <div className="whitespace-pre-wrap break-words">
            <span className="term-p">$</span> {typed ?? ''}
          </div>
          {lines.map((l, i) => (
            <div
              key={i}
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: l.html }}
            />
          ))}
          {booted ? (
            <div className="flex items-baseline gap-2">
              <span className="term-p">$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') run(value)
                }}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 border-none bg-transparent p-0 font-mono text-[13px] text-sideband-text caret-sideband-accent outline-none"
              />
            </div>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Terminal commands"
          className="flex flex-wrap gap-2 border-t border-sideband-border bg-white/[0.02] px-3.5 py-2.5"
        >
          {COMMANDS.filter((c) => c !== 'clear').map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => run(c)}
              className="rounded-md border border-sideband-border px-2.5 py-1 font-mono text-[12px] text-sideband-text-secondary transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/5 hover:text-sideband-text"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
