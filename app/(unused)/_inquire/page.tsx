import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import InquireSection from '@/components/inquire/InquireSection'
import ProcessStrip from '@/components/inquire/ProcessStrip'

export const metadata: Metadata = {
  title: 'Inquire · Sideband',
  description:
    'Send a project brief. You get a reference ID and a reply within three business days.',
}

export default function InquirePage() {
  return (
    <div className="min-h-screen bg-sideband-black pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <SectionLabel label="INQUIRE / NEW BRIEF" />
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-sideband-text md:text-7xl">
            Send a brief<span className="text-sideband-accent">.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-2xl font-mono text-[14px] leading-[1.85] text-sideband-text-secondary">
            Tell us what you want built. Every submission gets a reference ID,
            and one of us reads it within three business days.
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
          <div className="mt-32 border-t border-sideband-border pt-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-text-secondary">
              Just saying hello?
            </p>
            <p className="mt-3 font-display text-2xl text-sideband-text md:text-3xl">
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
