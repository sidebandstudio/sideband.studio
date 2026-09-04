'use client'

import Image from 'next/image'
import Link from 'next/link'
import Terminal from '@/components/home/Terminal'

const marks = [
  {
    src: '/assets/ProductIcons/em.png',
    alt: 'EternalMonitor',
    cls: 'left-[6%] top-[9%] -rotate-[8deg]',
  },
  {
    src: '/assets/ProductIcons/rp.png',
    alt: 'EternalRichPresence',
    cls: 'right-[6%] top-[7%] rotate-[6deg]',
  },
  {
    src: '/assets/ProductIcons/ex.png',
    alt: 'Exerly Fitness',
    cls: 'left-[4%] top-[36%] rotate-[4deg]',
  },
  {
    src: '/assets/ProductIcons/e2x.png',
    alt: 'Eternal2x',
    cls: 'right-[4%] top-[36%] -rotate-[5deg]',
  },
  {
    src: '/assets/ProductIcons/es.png',
    alt: 'Eternal Summary',
    cls: 'left-[7%] top-[63%] rotate-[3deg]',
  },
  {
    src: '/assets/ProductIcons/sc.png',
    alt: 'Signature Cuts 413',
    cls: 'right-[7%] top-[63%] -rotate-[3deg]',
  },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sideband-black pb-20 pt-[88px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden min-[900px]:block"
      >
        {marks.map((m) => (
          <div
            key={m.src}
            className={`absolute grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-[22px] border border-sideband-border bg-[#0b0a14] shadow-[0_20px_48px_-16px_rgba(0,0,0,0.65),inset_0_2px_rgba(255,255,255,0.04)] ${m.cls}`}
          >
            <Image
              src={m.src}
              alt=""
              width={256}
              height={256}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="inner relative z-[2] text-center">
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

        <div className="mb-16 flex flex-wrap justify-center gap-2.5">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-[10px] bg-sideband-text px-[22px] py-3.5 text-[15px] font-semibold text-[#09090b] transition-all duration-200 hover:-translate-y-px hover:bg-white"
          >
            View Products
          </Link>
          <Link
            href="/engineers"
            className="inline-flex items-center justify-center rounded-[10px] border border-sideband-border px-[22px] py-3.5 text-[15px] font-medium text-sideband-text-secondary transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/[0.03] hover:text-sideband-text"
          >
            Meet the Engineers
          </Link>
        </div>

        <Terminal />
      </div>
    </section>
  )
}
