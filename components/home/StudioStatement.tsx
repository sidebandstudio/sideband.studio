'use client'

import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'

const techStack = [
  {
    category: 'Systems',
    color: '#A855F7',
    items: ['Rust', 'Swift', 'Metal', 'DXGI', 'VideoToolbox', 'H.264', 'FFmpeg', 'OpenCV', 'Lua', 'UDP', 'mDNS'],
  },
  {
    category: 'Web',
    color: '#6366F1',
    items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
  },
  {
    category: 'Mobile',
    color: '#D946EF',
    items: ['SwiftUI', 'HealthKit'],
  },
  {
    category: 'Desktop',
    color: '#E879F9',
    items: ['PyInstaller', 'COM/SMTC', 'Chrome MV3'],
  },
  {
    category: 'Data & Infra',
    color: '#C084FC',
    items: ['MongoDB', 'DigitalOcean', 'Fly.io', 'Docker', 'Gemini AI', 'Formspree'],
  },
]

export default function StudioStatement() {
  return (
    <>
      <section className="border-t border-eternal-border bg-eternal-surface py-20">
        <div className="inner">
          <FadeUp>
            <SectionLabel label="TECH STACK" withLine />
            <h2 className="mt-3 font-display text-[36px] text-eternal-text">
              The stack behind the studio
              <span className="text-eternal-accent">.</span>
            </h2>
          </FadeUp>

          <div className="tech-grid mt-10 grid gap-6">
            {techStack.map((category, index) => (
              <FadeUp key={category.category} delay={index * 0.07}>
                <div className="h-full border border-eternal-border bg-eternal-surface-2 p-5">
                  <div className="mb-3.5 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.15em]"
                      style={{ color: category.color }}
                    >
                      {category.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-[5px]">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-[3px] text-[10px] tracking-[0.06em] text-eternal-text-secondary"
                        style={{
                          border: `1px solid ${category.color}30`,
                          backgroundColor: `${category.color}08`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="inner mx-auto max-w-[800px]">
          <FadeUp>
            <SectionLabel label="PHILOSOPHY" />
            <blockquote className="mt-5 font-display text-[34px] font-normal leading-[1.4] text-eternal-text">
              &quot;We got tired of mediocre tools. Software that ships
              half-baked, bloated with features nobody asked for. We decided to
              stop complaining and start building.&quot;
            </blockquote>
            <p className="mt-6 text-[12px] leading-[1.8] text-eternal-text-secondary">
              Eternal Reverse exists because the best software comes from people
              obsessed with the craft, not the metrics. We stay indie because
              independence is what lets us make these choices.
            </p>
            <div className="mt-8">
              <GlowButton variant="ghost" href="/about">
                Read our story →
              </GlowButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
