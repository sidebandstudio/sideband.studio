import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'

const roles = [
  {
    title: 'Product Manager',
    area: 'Product',
    description:
      'Own the roadmap across Exerly and EternalMonitor. Turn user feedback and founder intent into scoped, shippable work, and keep the team pointed at what matters.',
    build: 'Roadmaps, specs, release plans, and the feedback loop behind them',
    learn:
      'Prioritization under real constraints, shipping cadence, working directly with engineers',
    walkAway:
      'Products you steered from idea to release, with the metrics to prove it',
  },
  {
    title: 'Marketing',
    area: 'Growth',
    description:
      'Get Sideband products in front of the right people. Launch posts, landing copy, social, community, and the story of how a small studio ships.',
    build:
      'Launch campaigns, content, and the growth channels that actually convert',
    learn:
      'Positioning, copywriting, analytics, and building an audience from zero',
    walkAway: 'Real launches with real numbers attached to your name',
  },
  {
    title: 'Full Stack Engineer',
    area: 'Engineering',
    description:
      'Ship across the stack on Next.js, Swift, and Rust products. Pick a focus (web, mobile, backend, or infra) and go deep while staying fluent end to end.',
    build: 'Features from database to UI in a production monorepo',
    learn: 'API design, auth, deployments, and how the pieces fit together',
    walkAway:
      'Shipped full stack features, GitHub contributions, studio credit',
  },
  {
    title: 'Individual Contributor',
    area: 'Open',
    description:
      'Not a fit for a single box? Bring a skill we need and carve out your own lane. Writers, testers, researchers, video, ops. If it makes the product better, there is room.',
    build: 'Whatever gap you can fill best, scoped with the founders',
    learn: 'How a small studio operates, and where your work lands in it',
    walkAway: 'A defined contribution with your name on it',
  },
  {
    title: 'Design Engineer (UX/UI)',
    area: 'Design',
    description:
      'UX and UI is our biggest gap right now. Own how Sideband products look and feel: flows, components, motion, and the design system across web, iOS, and marketing.',
    build: 'User flows, UI components, design systems, and the marketing site',
    learn:
      'Production design engineering, component architecture, brand systems',
    walkAway: 'Shipped design work across multiple live products',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-sideband-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-accent">
            [ CAREERS ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-sideband-text md:text-7xl">
            Build something real<span className="text-sideband-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl font-mono text-[15px] leading-relaxed text-sideband-text-secondary">
            We&apos;re not hiring. We&apos;re collaborating. Ship with us and
            walk away with something on your resume that actually matters.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-text-secondary">
            {roles.length} open roles
            <span className="text-sideband-accent"> / </span>
            remote
            <span className="text-sideband-accent"> / </span>
            part time friendly
          </p>
        </FadeUp>

        {/* Role Cards */}
        <div className="mt-16 space-y-6">
          {roles.map((role, i) => (
            <FadeUp key={role.title} delay={i * 0.1}>
              <div
                className="rounded-lg border border-sideband-border bg-sideband-surface p-8 transition-all duration-200 hover:border-sideband-accent/30"
                style={{ borderLeftWidth: '3px', borderLeftColor: '#A855F7' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-sideband-text">
                    {role.title}
                  </h3>
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
                    <span className="rounded border border-sideband-border px-2 py-1 text-sideband-text-secondary">
                      {role.area}
                    </span>
                    <span className="text-sideband-accent">Open</span>
                  </div>
                </div>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-sideband-text-secondary">
                  {role.description}
                </p>

                <div className="mt-6 space-y-3">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-sideband-accent">
                      You&apos;ll build:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-sideband-text-secondary">
                      {role.build}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-sideband-accent">
                      You&apos;ll learn:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-sideband-text-secondary">
                      {role.learn}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-sideband-accent">
                      You&apos;ll walk away with:
                    </span>
                    <p className="mt-1 font-mono text-[13px] text-sideband-text-secondary">
                      {role.walkAway}
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:hello@sideband.studio?subject=${encodeURIComponent(`${role.title} at Sideband`)}`}
                  className="mt-6 inline-block font-mono text-[12px] uppercase tracking-wider text-sideband-accent transition-colors duration-200 hover:text-sideband-text"
                >
                  Apply for this role &rarr;
                </a>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Eligibility */}
        <FadeUp>
          <div className="mt-16 rounded-lg border border-sideband-border bg-sideband-surface-2 p-8">
            <SectionLabel label="ELIGIBILITY" />
            <p className="mt-4 font-mono text-[14px] leading-relaxed text-sideband-text-secondary">
              Students, bootcamp grads, self-taught: all welcome.
              <span className="text-sideband-accent">
                {' '}
                Drive over credentials.
              </span>
            </p>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="mt-16 border-t border-sideband-border pb-24 pt-12">
            <p className="font-display text-2xl text-sideband-text">
              Ready to contribute?
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[14px] text-sideband-text-secondary">
                Email us at{' '}
                <a
                  href="mailto:hello@sideband.studio"
                  className="text-sideband-accent transition-colors duration-200 hover:text-sideband-text"
                >
                  hello@sideband.studio
                </a>
              </p>
              <p className="font-mono text-[14px] text-sideband-text-secondary">
                Or connect on{' '}
                <a
                  href="https://www.linkedin.com/in/alialdoyounes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sideband-accent transition-colors duration-200 hover:text-sideband-text"
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
  title: 'Careers · Sideband',
  description:
    'Open to contributors. We are a small studio that values depth, ownership, and shipping software that endures.',
}
