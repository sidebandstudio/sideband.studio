'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import Button from '@/components/ui/Button'
import { products } from '@/lib/products'

const EASE = [0.16, 1, 0.3, 1] as const

const HEADLINE: { word: string; em?: boolean }[] = [
  { word: 'We' },
  { word: 'build' },
  { word: 'the' },
  { word: 'things' },
  { word: 'we' },
  { word: 'wished', em: true },
  { word: 'existed.', em: true },
]

function Headline({ reduce }: { reduce: boolean }) {
  return (
    <h1 className="display mt-6 max-w-[12ch] text-balance text-[clamp(44px,6.4vw,92px)]">
      {HEADLINE.map((w, i) => (
        <span
          key={i}
          className="-my-[0.1em] inline-block overflow-hidden py-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.1 + i * 0.06, duration: 0.9, ease: EASE }
            }
          >
            {w.em ? <em>{w.word}</em> : w.word}
          </motion.span>
          {i < HEADLINE.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  )
}

export default function Hero() {
  const reduce = useReducedMotion() ?? false

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 50,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 50,
    damping: 18,
  })

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden pt-16"
    >
      {/* Brand light: pink top-left, purple bottom-right, like the icon. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-[12%] -top-[18%] h-[560px] w-[560px] rounded-full bg-sideband-accent-2 opacity-[0.09] blur-[130px]"
          style={
            reduce
              ? undefined
              : { animation: 'orbFloat 16s ease-in-out infinite' }
          }
        />
        <div
          className="absolute -bottom-[28%] right-[2%] h-[640px] w-[640px] rounded-full bg-sideband-accent opacity-[0.13] blur-[150px]"
          style={
            reduce
              ? undefined
              : { animation: 'orbFloat 20s ease-in-out infinite reverse' }
          }
        />
      </div>

      <div className="inner relative grid min-h-[calc(100vh-64px)] items-center gap-14 py-16 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-6">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }
            }
            className="inline-flex h-8 items-center gap-2 rounded-full border border-sideband-border bg-white/[0.03] px-3.5 text-[13px] font-medium tracking-[-0.01em] text-sideband-text-secondary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sideband-accent-2" />
            Independent software studio · Boston, MA
          </motion.span>

          <Headline reduce={reduce} />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.55, duration: 0.8, ease: EASE }
            }
            className="mt-7 max-w-[480px] text-pretty text-[clamp(16px,1.3vw,19px)] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary"
          >
            Four friends building an iPad display for Windows, a music bridge
            for Discord, a smarter video upscaler, and more in progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.7, duration: 0.8, ease: EASE }
            }
            className="mt-9 flex flex-wrap gap-2.5"
          >
            <Button variant="filled" href="/products">
              See the work
            </Button>
            <Button variant="ghost" href="/engineers">
              Meet the engineers
            </Button>
          </motion.div>
        </div>

        {/* The work, as a wall of covers that tilts toward the cursor. */}
        <div className="relative [perspective:1800px] lg:-mr-[12%]">
          <div className="[transform-style:preserve-3d] lg:[transform:rotateX(10deg)_rotateY(-18deg)_rotateZ(4deg)]">
            <motion.ul
              style={reduce ? undefined : { rotateX, rotateY }}
              className="grid grid-cols-2 gap-3 [transform-style:preserve-3d] min-[600px]:gap-4"
            >
              {products.map((p, i) => (
                <li
                  key={p.id}
                  style={
                    reduce
                      ? undefined
                      : {
                          animation: `cardFloat ${7 + (i % 3)}s ease-in-out ${i * 0.7}s infinite`,
                        }
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { delay: 0.3 + i * 0.08, duration: 1, ease: EASE }
                    }
                  >
                    <Link
                      href={`/products/${p.id}`}
                      className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0913] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] transition-[border-color] duration-300 hover:border-white/20"
                    >
                      <Image
                        src={p.cardHero}
                        alt={`${p.name} cover art`}
                        fill
                        sizes="(min-width: 1024px) 340px, 45vw"
                        priority={i < 2}
                        className="object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3.5 pb-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                          {p.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
                          {p.status === 'LIVE' ? 'Live' : 'In dev'}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
