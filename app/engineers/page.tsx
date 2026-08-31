import type { Metadata } from 'next'
import FadeUp from '@/components/animations/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import EngineerCard from '@/components/engineers/EngineerCard'
import { engineerCountLabel, listEngineers } from '@/lib/engineers'

export const metadata: Metadata = {
  title: 'Engineers · Sideband',
  description:
    'The engineers behind Sideband. Dossiers, work history, and the projects we ship.',
}

export default function EngineersIndexPage() {
  const all = listEngineers()

  return (
    <div className="min-h-screen bg-sideband-black pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-accent">
            [ ENGINEERS · {engineerCountLabel} ]
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="block text-sideband-text-secondary">
              The people who
            </span>
            <span className="block font-bold text-sideband-text">
              actually ship<span className="text-sideband-accent">.</span>
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-10 max-w-2xl font-mono text-[14px] leading-[1.9] text-sideband-text-secondary">
            Each engineer at Sideband owns their work end-to-end. Open a
            dossier to see where they&apos;ve been, what they&apos;ve built, and
            how they think about the craft.
          </p>
        </FadeUp>

        {/* Engineer grid */}
        <div className="mt-20">
          <FadeUp>
            <SectionLabel label="DOSSIERS" withLine />
          </FadeUp>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {all.map((engineer, i) => (
              <FadeUp key={engineer.id} delay={0.1 + i * 0.08}>
                <EngineerCard engineer={engineer} />
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp>
          <div className="mt-24 border-t border-sideband-border pb-24 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sideband-muted">
              [ NETWORK EXPANDING ]
            </p>
            <p className="mt-3 max-w-xl font-mono text-[13px] leading-[1.85] text-sideband-text-secondary">
              We&apos;re growing the contributor network: engineers, designers,
              and builders who share the standard. Reach out through the
              contact page.
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
