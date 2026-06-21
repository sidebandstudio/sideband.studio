import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'

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
  { year: '2025', event: 'Signature Cuts 413 launches' },
  { year: '2026', event: 'Ali Tleis joins as Co-Founder' },
  { year: '2026', event: '→  What comes next' },
]

const founders = [
  {
    name: 'Ali Younes',
    role: 'Co-Founder & Lead Engineer',
    initials: 'AY',
    bio: 'Full-stack engineer obsessed with systems programming, low-latency streaming, and shipping products that respect the user.',
    github: 'https://github.com/whoisaldo',
    linkedin: 'https://www.linkedin.com/in/alialdoyounes/',
  },
  {
    name: 'Ali Tleis',
    role: 'Co-Founder & Frontend / Full-Stack Engineer',
    initials: 'AT',
    bio: 'CS @ Northeastern. Full-stack engineer focused on TypeScript, React, and clean systems. Builds tools that respect the user — fast, minimal, and obsessively refined.',
    github: 'https://github.com/Alitleis123',
    linkedin: 'https://www.linkedin.com/in/ali-tleis-091800247/',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-eternal-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ ABOUT ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-eternal-text-secondary md:text-7xl">
            Two brothers.
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
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-2xl">
            {founders.map((founder) => (
              <FadeUp key={founder.name} delay={0.1}>
                <div className="rounded-lg border border-eternal-border bg-eternal-surface p-8 transition-all duration-200 hover:border-eternal-accent/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eternal-surface-2 ring-2 ring-eternal-border">
                    <span className="font-mono text-sm text-eternal-accent">
                      {founder.initials}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-eternal-text">
                    {founder.name}
                  </h3>
                  <p className="mt-1 font-mono text-[12px] text-eternal-text-secondary">
                    {founder.role}
                  </p>
                  <p className="mt-3 font-mono text-[12px] leading-relaxed text-eternal-muted">
                    {founder.bio}
                  </p>
                  <div className="mt-4 flex gap-3">
                    {founder.github && (
                      <a
                        href={founder.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-eternal-muted transition-colors hover:text-eternal-accent"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {founder.linkedin && (
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-eternal-muted transition-colors hover:text-eternal-accent"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
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
