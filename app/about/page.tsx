import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import EngineerCard from '@/components/engineers/EngineerCard'
import { listEngineers } from '@/lib/engineers'

const timeline = [
  { year: '2024', event: 'EternalRichPresence: first shipped product' },
  { year: '2025', event: 'Sideband founded' },
  {
    year: '2025',
    event: 'EternalMonitor enters development (Rust + Swift)',
  },
  {
    year: '2025',
    event: 'Exerly iOS enters active development (SwiftUI + HealthKit)',
  },
  { year: '2025', event: 'Ali Tleis joins as Co-Founder' },
  { year: '2025', event: 'Signature Cuts 413 launches' },
  { year: '2026', event: 'Eternal2x ships: DaVinci Resolve smart upscale' },
  { year: '2026', event: 'Eternal Summary ships: MV3 Chrome extension' },
  { year: '2026', event: 'Karan Anand joins as Co-Founder' },
  { year: '2026', event: '→  What comes next' },
]

export default function AboutPage() {
  const founders = listEngineers()

  return (
    <div className="min-h-screen bg-sideband-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-accent">
            [ ABOUT ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-sideband-text-secondary md:text-7xl">
            Four founders.
          </h1>
          <h1 className="font-display text-5xl font-bold text-sideband-text md:text-7xl">
            One studio<span className="text-sideband-accent">.</span>
          </h1>
        </FadeUp>

        {/* Narrative */}
        <div className="mt-20 max-w-3xl space-y-16">
          <FadeUp>
            <SectionLabel label="WHY" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-sideband-text-secondary">
              We started Sideband because building software is the most fun we
              know how to have. Every product here began as something one of us
              wanted for ourselves, and that is still the whole strategy.
            </p>
          </FadeUp>

          <FadeUp>
            <SectionLabel label="HOW" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-sideband-text-secondary">
              We build for ourselves first, then polish until we would hand it
              to a friend. Each product page has an honest write-up of how the
              thing actually works, from DXGI capture down to the render loop.
              The architecture is the interesting part, so we show it.
            </p>
          </FadeUp>

          <FadeUp>
            <SectionLabel label="NEXT" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-sideband-text-secondary">
              More products. The list of things we wish existed is long, and we
              are in no rush.
            </p>
          </FadeUp>
        </div>

        {/* Team Cards */}
        <div className="mt-24">
          <FadeUp>
            <SectionLabel label="THE TEAM" withLine />
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="mt-6 max-w-2xl font-mono text-[12px] uppercase tracking-[0.15em] text-sideband-muted">
              Open a dossier for the full picture →
            </p>
          </FadeUp>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {founders.map((founder, i) => (
              <FadeUp key={founder.id} delay={0.1 + i * 0.08}>
                <EngineerCard engineer={founder} />
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-24">
          <FadeUp>
            <SectionLabel label="TIMELINE" withLine />
          </FadeUp>
          <div className="relative mt-10 ml-4 border-l border-sideband-border pl-8">
            {timeline.map((entry, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="relative mb-8 last:mb-0">
                  {/* Dot */}
                  <div className="absolute -left-[41px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-sideband-accent bg-sideband-black" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-mono text-[13px] font-medium text-sideband-accent">
                      {entry.year}
                    </span>
                    <span className="font-mono text-[13px] text-sideband-text-secondary">
                      {entry.event}
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* CTA */}
        <FadeUp>
          <div className="mt-24 border-t border-sideband-border pb-24 pt-16 text-center">
            <p className="font-display text-3xl text-sideband-text">
              Want to build with us?
            </p>
            <div className="mt-6">
              <GlowButton variant="filled" href="/contact">
                Get in Touch
              </GlowButton>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'About · Sideband',
  description:
    'Sideband is a four-founder software studio. We build the things we wished existed.',
}
