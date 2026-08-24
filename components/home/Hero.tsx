'use client'

import Image from 'next/image'
import Link from 'next/link'
import Terminal from '@/components/home/Terminal'

const marks = [
  { src: '/assets/ProductIcons/em.png', alt: 'EternalMonitor', cls: 'left-[6%] top-[9%] -rotate-[8deg]' },
  { src: '/assets/ProductIcons/rp.png', alt: 'EternalRichPresence', cls: 'right-[6%] top-[7%] rotate-[6deg]' },
  { src: '/assets/ProductIcons/ex.png', alt: 'Exerly Fitness', cls: 'left-[4%] top-[36%] rotate-[4deg]' },
  { src: '/assets/ProductIcons/e2x.png', alt: 'Eternal2x', cls: 'right-[4%] top-[36%] -rotate-[5deg]' },
  { src: '/assets/ProductIcons/es.png', alt: 'Eternal Summary', cls: 'left-[7%] top-[63%] rotate-[3deg]' },
  { src: '/assets/ProductIcons/sc.png', alt: 'Signature Cuts 413', cls: 'right-[7%] top-[63%] -rotate-[3deg]' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-eternal-black pb-20 pt-[88px]">
      <div
        aria-hidden="true"
        className="hero-grid-bg pointer-events-none absolute inset-0"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden min-[900px]:block">
        {marks.map((m) => (
          <div
            key={m.src}
            className={`absolute grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-[22px] border border-eternal-border bg-[#0b0a14] shadow-[0_20px_48px_-16px_rgba(0,0,0,0.65),inset_0_2px_rgba(255,255,255,0.04)] ${m.cls}`}
          >
            <Image src={m.src} alt="" width={256} height={256} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="inner relative z-[2] text-center">
        <span className="inline-flex h-8 items-center rounded-full border border-eternal-border bg-white/[0.03] px-3.5 text-[13px] font-medium tracking-[-0.01em] text-eternal-text-secondary">
          Independent software studio · Boston, MA
        </span>

        <h1 className="display mx-auto mb-[22px] mt-6 max-w-[18ch] text-balance text-[clamp(40px,6vw,80px)]">
          Software that endures
          <span className="text-eternal-accent">.</span>
        </h1>

        <p className="mx-auto mb-9 max-w-[600px] text-pretty text-[clamp(16px,1.4vw,19px)] leading-[1.55] tracking-[-0.005em] text-eternal-text-secondary">
          A three-founder studio shipping technically ambitious products for
          developers, athletes, and people who care about quality.
        </p>

        <div className="mb-16 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-[10px] bg-eternal-text px-[22px] py-3.5 text-[15px] font-semibold text-[#09090b] transition-all duration-200 hover:-translate-y-px hover:bg-white"
            >
              View Products
            </Link>
            <Link
              href="/engineers"
              className="inline-flex items-center justify-center rounded-[10px] border border-eternal-border px-[22px] py-3.5 text-[15px] font-medium text-eternal-text-secondary transition-colors duration-200 hover:border-eternal-border-strong hover:bg-white/[0.03] hover:text-eternal-text"
            >
              Meet the Engineers
            </Link>
          </div>

          <a
            href="https://github.com/whoisaldo"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-eternal-text-secondary transition-colors duration-200 hover:text-eternal-text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.8-.26.8-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.2.7.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Everything we ship is on GitHub
            <span className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
        </div>

        <Terminal />
      </div>
    </section>
  )
}
