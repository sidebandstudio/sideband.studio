'use client'

import Button from '@/components/ui/Button'
import FadeUp from '@/components/animations/FadeUp'
import { listEngineers } from '@/lib/engineers'

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

export default function TeamSection() {
  const founderCount = listEngineers().length
  const founderWord = COUNT_WORDS[founderCount] ?? String(founderCount)

  return (
    <section id="team" className="border-t border-sideband-border py-24">
      <div className="inner">
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                The studio
              </span>
              <h2 className="display mt-3.5 text-balance text-[clamp(32px,4vw,48px)]">
                {founderWord} founders. One studio.
              </h2>
              <p className="mt-3.5 max-w-[560px] text-pretty text-[17px] tracking-[-0.005em] text-sideband-text-secondary">
                Sideband started with two friends fixing their own annoyances: a
                missing second monitor, a blank Discord status. Now there are
                four of us, still building whatever we wish existed. We keep it
                small because that is what keeps it fun.
              </p>
            </div>
            <Button variant="ghost" size="sm" href="/engineers">
              Meet the engineers &rarr;
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
