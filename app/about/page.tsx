import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import EngineerCard from '@/components/engineers/EngineerCard'
import { listEngineers } from '@/lib/engineers'

const timeline = [
  { year: '2024', event: 'EternalRichPresence — first shipped product' },
  { year: '2025', event: 'Eternal Reverse founded' },
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
  { year: '2026', event: 'Eternal2x ships — DaVinci Resolve smart upscale' },
  { year: '2026', event: 'Eternal Summary ships — MV3 Chrome extension' },
  { year: '2026', event: 'Karan Anand joins as Co-Founder' },
  { year: '2026', event: '→  What comes next' },
]

export default function AboutPage() {
  const founders = listEngineers()

  return (
    <div className="min-h-screen bg-eternal-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ ABOUT ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-eternal-text-secondary md:text-7xl">
            Three founders.
          </h1>
          <h1 className="font-display text-5xl font-bold text-eternal-text md:text-7xl">
            One standard<span className="text-eternal-accent">.</span>
          </h1>
        </FadeUp>

        {/* Narrative */}
        <div className="mt-20 max-w-3xl space-y-16">
          <FadeUp>
            <SectionLabel label="WHY WE EXIST" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-eternal-text-secondary">
              We got tired of mediocre tools. Software that ships half-baked,
              bloated with features nobody asked for, and abandoned the moment
              the next trend arrives. We decided to stop complaining and start
              building. Eternal Reverse exists because we believe the best
              software comes from people who are obsessed with the craft — not
              the metrics.
            </p>
          </FadeUp>

          <FadeUp>
            <SectionLabel label="HOW WE WORK" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-eternal-text-secondary">
              We ship real things. Every project goes through the same filter: Is
              this technically honest? Would we use this ourselves? Does it
              respect the person on the other end? We care about technical depth
              — DXGI pipelines, VideoToolbox decoding, Metal rendering — not
              because complexity is the goal, but because doing it right demands
              going deep. We stay indie because independence is what lets us make
              these choices.
            </p>
          </FadeUp>

          <FadeUp>
            <SectionLabel label="WHERE WE&apos;RE GOING" />
            <p className="mt-6 font-mono text-[14px] leading-[1.9] text-eternal-text-secondary">
              We&apos;re growing the contributor network — bringing in engineers,
              designers, and builders who share the standard. Quality is
              non-negotiable. Every contributor ships real features, gets real
              credit, and walks away with real experience. The goal is to build
              this studio into something lasting. Not a startup. Not a side
              project. A studio.
            </p>
          </FadeUp>
        </div>

        {/* Team Cards */}
        <div className="mt-24">
          <FadeUp>
            <SectionLabel label="THE TEAM" withLine />
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="mt-6 max-w-2xl font-mono text-[12px] uppercase tracking-[0.15em] text-eternal-muted">
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
          <div className="relative mt-10 ml-4 border-l border-eternal-border pl-8">
            {timeline.map((entry, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="relative mb-8 last:mb-0">
                  {/* Dot */}
                  <div className="absolute -left-[41px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-eternal-accent bg-eternal-black" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-mono text-[13px] font-medium text-eternal-accent">
                      {entry.year}
                    </span>
                    <span className="font-mono text-[13px] text-eternal-text-secondary">
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
          <div className="mt-24 border-t border-eternal-border pb-24 pt-16 text-center">
            <p className="font-display text-3xl text-eternal-text">
              Want to build with us?
            </p>
            <div className="mt-6">
              <GlowButton variant="filled" href="/careers">
                View Contributor Roles
              </GlowButton>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'About — Eternal Reverse',
  description:
    'A three-founder software studio in Boston shipping technically ambitious products for developers, athletes, and people who care about quality.',
}
