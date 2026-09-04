'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const marks = [
  {
    src: '/assets/ProductIcons/em.png',
    name: 'EternalMonitor',
    href: '/products/eternal-monitor',
    tilt: '-rotate-6',
  },
  {
    src: '/assets/ProductIcons/rp.png',
    name: 'EternalRichPresence',
    href: '/products/eternal-rich-presence',
    tilt: 'rotate-3',
  },
  {
    src: '/assets/ProductIcons/ex.png',
    name: 'Exerly Fitness',
    href: '/products/exerly',
    tilt: '-rotate-2',
  },
  {
    src: '/assets/ProductIcons/sc.png',
    name: 'Signature Cuts 413',
    href: '/products/signature-cuts',
    tilt: 'rotate-6',
  },
  {
    src: '/assets/ProductIcons/e2x.png',
    name: 'Eternal2x',
    href: '/products/eternal2x',
    tilt: '-rotate-3',
  },
  {
    src: '/assets/ProductIcons/es.png',
    name: 'Eternal Summary',
    href: '/products/eternal-summary',
    tilt: 'rotate-2',
  },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sideband-black pb-20 pt-[88px]">
      <div className="inner text-center">
        <span className="inline-flex h-8 items-center rounded-full border border-sideband-border bg-white/[0.03] px-3.5 text-[13px] font-medium tracking-[-0.01em] text-sideband-text-secondary">
          Independent software studio · Boston, MA
        </span>

        <h1 className="display mx-auto mb-[22px] mt-6 max-w-[18ch] text-balance text-[clamp(40px,6vw,80px)]">
          We build the things we wished existed
          <span className="text-sideband-accent">.</span>
        </h1>

        <p className="mx-auto mb-9 max-w-[600px] text-pretty text-[clamp(16px,1.4vw,19px)] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary">
          Four friends building an iPad display for Windows, a music bridge for
          Discord, a smarter video upscaler, and more in progress.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          <Button variant="filled" href="/products">
            View Products
          </Button>
          <Button variant="ghost" href="/engineers">
            Meet the Engineers
          </Button>
        </div>

        <ul className="mx-auto mt-16 flex max-w-[720px] flex-wrap items-center justify-center gap-4 min-[600px]:gap-6">
          {marks.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                title={m.name}
                aria-label={m.name}
                className={`block h-[76px] w-[76px] overflow-hidden rounded-[20px] border border-sideband-border bg-[#0b0a14] shadow-[0_20px_48px_-16px_rgba(0,0,0,0.65),inset_0_2px_rgba(255,255,255,0.04)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 min-[600px]:h-[88px] min-[600px]:w-[88px] ${m.tilt}`}
              >
                <Image
                  src={m.src}
                  alt=""
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
