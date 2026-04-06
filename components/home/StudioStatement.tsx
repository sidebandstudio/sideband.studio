'use client'

import FadeUp from '@/components/animations/FadeUp'

const stats = [
  { value: '4', label: 'Products in flight' },
  { value: '2', label: 'Founders' },
  { value: '∞', label: 'Problems left' },
]

export default function StudioStatement() {
  return (
    <section className="bg-eternal-surface py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Quote */}
        <FadeUp>
          <div className="text-center">
            <p className="font-display text-4xl italic leading-tight text-eternal-text md:text-5xl lg:text-[64px]">
              &ldquo;We don&apos;t ship features.&rdquo;
            </p>
            <p className="mt-2 font-display text-4xl italic leading-tight text-eternal-text md:text-5xl lg:text-[64px]">
              &ldquo;We ship convictions.&rdquo;
            </p>
          </div>
        </FadeUp>

        {/* Stats */}
        <FadeUp delay={0.15}>
          <div className="mt-20 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-5xl font-medium text-eternal-accent md:text-6xl">
                  {stat.value}
                </div>
                <div className="mt-2 font-mono text-[12px] uppercase tracking-wider text-eternal-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Philosophy */}
        <FadeUp delay={0.3}>
          <p className="mx-auto mt-16 max-w-2xl text-center font-mono text-[14px] leading-[1.8] text-eternal-text-secondary">
            Every product we ship reflects a conviction about how software should
            work. We don&apos;t chase trends or optimize for metrics. We build tools
            we&apos;d stake our name on — technically ambitious, obsessively refined,
            and designed to last longer than the hype cycle that spawned them.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
