import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'

const roles = [
  {
    title: 'Mobile Engineer',
    description:
      "Help ship Exerly's SwiftUI iOS client. HealthKit integration, progress photo compare mode, barcode scanning.",
    build: 'Real SwiftUI features in a production monorepo',
    learn: 'iOS architecture, HealthKit, shared API design',
    walkAway:
      'Shipped iOS features, GitHub contributions, studio credit',
  },
  {
    title: 'Systems Engineer',
    description:
      'Contribute to EternalMonitor — Rust host + Swift iPad client, H.264 hardware encoding, Metal rendering.',
    build: 'Performance-critical systems code in Rust and/or Swift',
    learn: 'DXGI, VideoToolbox, UDP streaming, Metal GPU rendering',
    walkAway:
      'One of the most technically impressive projects on any resume',
  },
  {
    title: 'Design Engineer',
    description:
      'Shape the visual identity across all Eternal products — web, iOS, marketing.',
    build: 'UI components, design systems, marketing sites',
    learn: 'Production design engineering, component architecture, brand systems',
    walkAway: 'Shipped design work across multiple live products',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-eternal-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ CAREERS ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-eternal-text md:text-7xl">
            Build something real<span className="text-eternal-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl font-mono text-[15px] leading-relaxed text-eternal-text-secondary">
            We&apos;re not hiring. We&apos;re collaborating. Ship with us and walk away
            with something on your resume that actually matters.
          </p>
        </FadeUp>

        {/* Role Cards */}
        <div className="mt-16 space-y-6">
          {roles.map((role, i) => (
            <FadeUp key={role.title} delay={i * 0.1}>
              <div className="rounded-lg border border-eternal-border bg-eternal-surface p-8 transition-all duration-200 hover:border-eternal-accent/30"
                style={{ borderLeftWidth: '3px', borderLeftColor: '#A855F7' }}
              >
                <h3 className="font-display text-2xl text-eternal-text">
                  {role.title}
                </h3>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-eternal-text-secondary">
                  {role.description}
                </p>

                <div className="mt-6 space-y-3">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-eternal-accent">
                      You&apos;ll build:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-eternal-text-secondary">
                      {role.build}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-eternal-accent">
                      You&apos;ll learn:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-eternal-text-secondary">
                      {role.learn}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-eternal-accent">
                      You&apos;ll walk away with:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-eternal-text-secondary">
                      {role.walkAway}
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Eligibility */}
        <FadeUp>
          <div className="mt-16 rounded-lg border border-eternal-border bg-eternal-surface-2 p-8">
            <SectionLabel label="ELIGIBILITY" />
            <p className="mt-4 font-mono text-[14px] leading-relaxed text-eternal-text-secondary">
              Students, bootcamp grads, self-taught — all welcome.
              <span className="text-eternal-accent">
                {' '}
                Drive over credentials.
              </span>
            </p>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="mt-16 border-t border-eternal-border pb-24 pt-12">
            <p className="font-display text-2xl text-eternal-text">
              Ready to contribute?
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[14px] text-eternal-text-secondary">
                Email us at{' '}
                <a
                  href="mailto:hello@eternalreverse.com"
                  className="text-eternal-accent transition-colors duration-200 hover:text-eternal-text"
                >
                  hello@eternalreverse.com
                </a>
              </p>
              <p className="font-mono text-[14px] text-eternal-text-secondary">
                Or connect on{' '}
                <a
                  href="https://www.linkedin.com/in/alialdoyounes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eternal-accent transition-colors duration-200 hover:text-eternal-text"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Careers — Eternal Reverse',
  description:
    'Open to contributors. We are a small studio that values depth, ownership, and shipping software that endures.',
}
