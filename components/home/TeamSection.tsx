'use client'

import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import Button from '@/components/ui/Button'
import { listEngineers } from '@/lib/engineers'

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

export default function TeamSection() {
  const engineers = listEngineers()
  const founderWord = COUNT_WORDS[engineers.length] ?? String(engineers.length)

  return (
    <section id="team" className="border-t border-sideband-border py-24">
      <div className="inner">
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                The studio
              </span>
              <h2 className="display mt-3.5 text-[clamp(36px,5vw,64px)]">
                {founderWord} founders. <em>One studio.</em>
              </h2>
              <p className="mt-4 max-w-[560px] text-pretty text-[17px] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary">
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

        <div className="mt-12 grid grid-cols-2 gap-3 min-[900px]:grid-cols-4 min-[900px]:gap-4">
          {engineers.map((e, i) => (
            <FadeUp key={e.id} delay={i * 0.07}>
              <div>
                <Link
                  href={`/engineers/${e.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-sideband-border bg-[#0a0913] transition-[border-color] duration-300 hover:border-sideband-border-strong"
                >
                  {e.portrait ? (
                    <Image
                      src={e.portrait.src}
                      alt={`${e.name}, ${e.role}`}
                      fill
                      sizes="(min-width: 900px) 25vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="display text-[clamp(48px,6vw,96px)] text-sideband-text/20">
                        {e.initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 pt-16">
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                      {e.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/60">
                      {e.role}
                    </p>
                  </div>
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
