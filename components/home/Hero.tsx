'use client'

import { useRef, type CSSProperties } from 'react'
import Button from '@/components/ui/Button'
import { ArrowUpRightIcon, GitHubIcon } from '@/components/ui/Icons'
import HeroMarks from '@/components/home/HeroMarks'
import ProductPreview from '@/components/home/ProductPreview'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pb-[60px] pt-[136px] max-[820px]:pt-[196px]"
    >
      <div className="hero-grid" aria-hidden="true" />
      <HeroMarks heroRef={heroRef} />

      <div className="inner relative z-[2] text-center">
        <h1 className="hero-title display mx-auto mb-[22px] mt-0 max-w-[20ch] text-balance text-[clamp(38px,5.6vw,76px)] max-[820px]:text-[clamp(40px,11vw,56px)]">
          <span data-rise>We build the things</span>
          <br />
          <span data-rise style={delay(90)}>
            we wished existed<span className="text-sideband-accent">.</span>
          </span>
        </h1>

        <p
          data-rise
          style={delay(300)}
          className="mx-auto mb-9 max-w-[640px] text-pretty text-[clamp(16px,1.4vw,19px)] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary"
        >
          Four friends building an iPad display for Windows, a music bridge for
          Discord, a smarter video upscaler, and more in progress.
        </p>

        <div
          data-rise
          style={delay(400)}
          className="mb-14 flex flex-col items-center gap-4 max-[820px]:mb-16"
        >
          <Button href="/products" size="lg">
            View Products
          </Button>
          <a
            href="https://github.com/sidebandstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-sideband-text-secondary transition-colors duration-[180ms] hover:text-sideband-text"
          >
            <GitHubIcon />
            <span>Everything we ship is on GitHub</span>
            <ArrowUpRightIcon className="opacity-60 transition-[transform,opacity] duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
          <p className="inline-flex items-center gap-1.5 text-[13px] tracking-[-0.005em] text-sideband-muted">
            Independent software studio
            <span aria-hidden="true">&middot;</span>
            Boston, MA
            <span aria-hidden="true">&middot;</span>
            est. 2025
          </p>
        </div>

        <div data-rise style={delay(520)}>
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}
