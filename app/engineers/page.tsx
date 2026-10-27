import type { Metadata } from 'next'
import Reveal from '@/components/ui/Reveal'
import Eyebrow from '@/components/ui/Eyebrow'
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
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sideband-accent">
            [ ENGINEERS · {engineerCountLabel} ]
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="block text-sideband-text-secondary">
              The people
            </span>
            <span className="block font-bold text-sideband-text">
              behind the products<span className="text-sideband-accent">.</span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-10 max-w-2xl font-mono text-[14px] leading-[1.9] text-sideband-text-secondary">
            Each engineer at Sideband owns their work end to end. Open a dossier
            to see where they&apos;ve been, what they&apos;ve built, and how
            they work.
          </p>
        </Reveal>

        {/* Engineer grid */}
        <div className="mt-20">
          <Reveal>
            <Eyebrow>Dossiers</Eyebrow>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {all.map((engineer, i) => (
              <Reveal key={engineer.id} delay={100 + i * 80}>
                <EngineerCard engineer={engineer} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="pb-24" />
      </div>
    </div>
  )
}
