'use client'

import Button from '@/components/ui/Button'
import FadeUp from '@/components/animations/FadeUp'

export default function FinalCta() {
  return (
    <section className="border-t border-sideband-border py-24 text-center">
      <div className="inner">
        <FadeUp>
          <h2 className="display text-balance text-[clamp(32px,4vw,48px)]">
            The inbox is always open.
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
