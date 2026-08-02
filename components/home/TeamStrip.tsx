
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'

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

export default function TeamStrip() {
  const founders = listEngineers()

  return (
    <>
      <section className="border-t border-eternal-border bg-eternal-surface py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="THE TEAM" withLine />
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="mt-6 max-w-md font-mono text-[11px] uppercase tracking-[0.18em] text-eternal-muted">
              The engineers shipping the work. Open a dossier →
            </p>
          </FadeUp>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {founders.map((founder, index) => (
              <FadeUp key={founder.id} delay={index * 0.1}>
                <EngineerCard engineer={founder} compact />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="mt-10">
              <GlowButton variant="ghost" href="/engineers">
                All Engineers →
              </GlowButton>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="border-t border-eternal-border py-[72px]">
        <div className="inner text-center">
          <FadeUp>
            <p className="font-display text-[36px] text-eternal-text">
              See what we&apos;ve built.
            </p>
            <p className="mt-2.5 text-[13px] text-eternal-text-secondary">
              Six products. Technically ambitious. Obsessively refined.
            </p>
            <div className="mt-6">
              <GlowButton variant="filled" href="/products">
                Explore Products
              </GlowButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
