'use client'

import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import { listEngineers } from '@/lib/engineers'

const techStack = [
  'Rust', 'Swift', 'Metal', 'DXGI', 'VideoToolbox', 'H.264', 'FFmpeg',
  'Next.js', 'React', 'TypeScript', 'Node.js', 'SwiftUI', 'HealthKit',
  'MongoDB', 'Gemini AI', 'DigitalOcean',
]

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

export default function TeamSection() {
  const founderCount = listEngineers().length
  const founderWord = COUNT_WORDS[founderCount] ?? String(founderCount)

  return (
    <section id="team" className="border-t border-eternal-border py-24">
      <div className="inner">
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-eternal-muted">
                The studio
              </span>
              <h2 className="display mt-3.5 text-balance text-[clamp(32px,4vw,48px)]">
                {founderWord} founders. One standard.
              </h2>
              <p className="mt-3.5 max-w-[560px] text-pretty text-[17px] tracking-[-0.005em] text-eternal-text-secondary">
                We got tired of mediocre tools. Software that ships half-baked,
                bloated with features nobody asked for. We decided to stop
                complaining and start building. We stay indie because
                independence is what lets us make these choices.
              </p>
            </div>
            <Link
              href="/engineers"
              className="inline-flex items-center gap-2 rounded-lg border border-eternal-border px-[18px] py-2.5 text-[14px] font-medium text-eternal-text-secondary transition-colors duration-200 hover:border-eternal-border-strong hover:bg-white/[0.03] hover:text-eternal-text"
            >
              Meet the engineers &rarr;
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mb-3 mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-eternal-muted">
            Built with
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span
                key={item}
                className="rounded-md border border-eternal-border bg-white/[0.02] px-2.5 py-1.5 font-mono text-[12px] text-eternal-text-secondary"
              >
                {item}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
