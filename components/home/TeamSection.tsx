'use client'

import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'
import { listEngineers, engineerIndexLabel } from '@/lib/engineers'

const techStack = [
  'Rust', 'Swift', 'Metal', 'DXGI', 'VideoToolbox', 'H.264', 'FFmpeg',
  'Next.js', 'React', 'TypeScript', 'Node.js', 'SwiftUI', 'HealthKit',
  'MongoDB', 'Gemini AI', 'DigitalOcean',
]

export default function TeamSection() {
  const founders = listEngineers()

  return (
    <section id="team" className="border-t border-eternal-border py-24">
      <div className="inner">
        <FadeUp>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-eternal-muted">
                The studio
              </span>
              <h2 className="display mt-3.5 text-balance text-[clamp(32px,4vw,48px)]">
                Two founders. One standard.
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
              Open the dossiers &rarr;
            </Link>
          </div>
        </FadeUp>

        <div className="grid max-w-[880px] grid-cols-1 gap-3.5 min-[720px]:grid-cols-2">
          {founders.map((engineer, index) => (
            <FadeUp key={engineer.id} delay={index * 0.08}>
              <Link
                href={`/engineers/${engineer.id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-eternal-border bg-white/[0.015] transition-colors duration-200 hover:border-eternal-border-strong hover:bg-white/[0.03]"
              >
                <div className="aspect-[4/3] border-b border-eternal-border bg-[#0a0913]">
                  {engineer.portrait ? (
                    <Image
                      src={engineer.portrait.src}
                      alt={`${engineer.name} — portrait`}
                      width={engineer.portrait.width}
                      height={engineer.portrait.height}
                      className="h-full w-full object-cover object-[center_20%]"
                      sizes="(max-width: 720px) 100vw, 440px"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-[18px]">
                  <div className="flex justify-between font-mono text-[11px] text-eternal-muted">
                    <span>[ {engineerIndexLabel(engineer.id)} ]</span>
                    <span className="truncate pl-3">{engineer.contact.location}</span>
                  </div>
                  <h3 className="mt-0.5 text-[19px] font-semibold tracking-[-0.02em] text-eternal-text">
                    {engineer.name}
                  </h3>
                  <div className="text-[13px] text-eternal-text-secondary">
                    {engineer.role}
                  </div>
                  <p className="mt-1.5 text-pretty text-[14px] leading-[1.55] tracking-[-0.003em] text-eternal-text-secondary">
                    {engineer.shortBio}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(engineer.prev ?? []).map((item) => (
                      <span
                        key={item.label}
                        className="rounded-md border border-eternal-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-eternal-text-secondary"
                      >
                        {item.label} · {item.sublabel}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>

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
