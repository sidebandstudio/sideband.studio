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
      <div className="inner">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
            Engineers · {engineerCountLabel}
          </span>
          <h1 className="display mt-3.5 max-w-[18ch] text-balance text-[clamp(40px,6vw,72px)]">
            The people behind <em>the products.</em>
          </h1>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-[600px] text-pretty text-[17px] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary">
            Each engineer at Sideband owns their work end to end. Open a dossier
            to see where they&apos;ve been, what they&apos;ve built, and how
            they work.
          </p>
        </FadeUp>

        {/* Engineer grid */}
        <div className="mt-20">
          <FadeUp>
            <SectionLabel label="Dossiers" withLine />
          </FadeUp>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-4xl">
            {all.map((engineer, i) => (
              <FadeUp key={engineer.id} delay={0.1 + i * 0.08}>
                <EngineerCard engineer={engineer} />
              </FadeUp>
            ))}
          </div>
        </div>

        <div className="pb-24" />
      </div>
    </div>
  )
}
