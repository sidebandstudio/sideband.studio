'use client'

import Button from '@/components/ui/Button'
import FadeUp from '@/components/animations/FadeUp'

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-sideband-border py-32 text-center">
      {/* The mark, blown up: two offset squares. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-[78%] -translate-y-[62%] rotate-[-8deg] rounded-[64px] bg-sideband-accent-2 opacity-[0.1] blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-[22%] -translate-y-[38%] rotate-[6deg] rounded-[64px] bg-sideband-accent opacity-[0.12] blur-xl" />
      </div>
      <div className="inner relative">
        <FadeUp>
          <h2 className="display text-balance text-[clamp(36px,5vw,64px)]">
            The inbox is <em>always open.</em>
          </h2>
          <p className="mx-auto mb-9 mt-3.5 max-w-[560px] text-pretty text-[17px] tracking-[-0.005em] text-sideband-text-secondary">
            Everything we ship ends up on GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Button variant="filled" href="/contact">
              Contact
            </Button>
            <Button
              variant="ghost"
              href="https://github.com/sidebandstudio"
              external
            >
              GitHub
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
