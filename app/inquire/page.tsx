import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import InquireSection from '@/components/inquire/InquireSection'
import ProcessStrip from '@/components/inquire/ProcessStrip'

export const metadata: Metadata = {
  title: 'Inquire · Eternal Reverse',
  description:
    'Submit a project brief. Each inquiry is logged against a ticket and reviewed personally by the founders within three business days.',
}

export default function InquirePage() {
  return (
    <div className="min-h-screen bg-eternal-black pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <SectionLabel label="INQUIRE / NEW BRIEF" />
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-eternal-text md:text-7xl">
            File a brief<span className="text-eternal-accent">.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-2xl font-mono text-[14px] leading-[1.85] text-eternal-text-secondary">
            Tell us what you want built. Each submission generates a ticket the
            moment you transmit. You keep the reference, we keep the brief.
            Founders review every inquiry personally.
          </p>
        </FadeUp>

        {/* Process strip */}
        <div className="mt-16">
          <FadeUp delay={0.12}>
            <ProcessStrip />
          </FadeUp>
        </div>

        {/* Form + ticket rail */}
        <div className="mt-24">
          <InquireSection />
        </div>

        {/* Bottom CTA: fallback for non-inquiry visitors */}
        <FadeUp>
          <div className="mt-32 border-t border-eternal-border pt-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-text-secondary">
              Just saying hello?
            </p>
            <p className="mt-3 font-display text-2xl text-eternal-text md:text-3xl">
              Not every message needs a ticket.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <GlowButton variant="ghost" href="/contact">
                Open /contact instead
              </GlowButton>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
