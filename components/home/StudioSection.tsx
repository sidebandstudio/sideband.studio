import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowUpRightIcon, CheckIcon } from '@/components/ui/Icons'
import { listEngineers } from '@/lib/engineers'

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

export default function StudioSection() {
  const engineers = listEngineers()
  const founderWord = COUNT_WORDS[engineers.length] ?? String(engineers.length)

  return (
    <section id="team" className="sec">
      <div className="inner split">
        <div className="tile">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="eyebrow">Founders</span>
            <span className="font-mono text-[11px] text-sideband-muted">
              {String(engineers.length).padStart(2, '0')}
            </span>
          </div>
          <ul>
            {engineers.map((e) => (
              <li key={e.id}>
                <Link href={`/engineers/${e.id}`} className="repo-row group">
                  {e.portrait ? (
                    <Image
                      src={e.portrait.src}
                      alt=""
                      width={72}
                      height={72}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sideband-border bg-white/[0.03] font-mono text-[11px] text-sideband-text-secondary">
                      {e.initials}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium tracking-[-0.01em] text-sideband-text">
                      {e.name}
                    </span>
                    <span className="block truncate text-[12.5px] text-sideband-text-secondary">
                      {e.role}
                    </span>
                  </span>
                  <ArrowUpRightIcon className="product-arrow shrink-0 text-sideband-text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="section-head !mb-0">
          <span className="eyebrow">The studio</span>
          <h2 className="display text-balance">
            {founderWord} founders. One studio.
          </h2>
          <p className="text-pretty">
            Sideband started with two friends fixing their own annoyances: a
            missing second monitor, a blank Discord status. Now there are four
            of us, still building whatever we wish existed. We keep it small
            because that is what keeps it fun.
          </p>
          <ul className="checklist mt-6">
            <li>
              <CheckIcon /> Based in Boston, MA
            </li>
            <li>
              <CheckIcon /> Independent since 2025
            </li>
            <li>
              <CheckIcon /> Systems work in Rust and Swift, web in TypeScript
            </li>
          </ul>
          <div className="mt-8">
            <Button href="/engineers" variant="ghost">
              Meet the engineers
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
