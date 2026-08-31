'use client'

import Link from 'next/link'
import FadeUp from '@/components/animations/FadeUp'

export default function FinalCta() {
  return (
    <section className="border-t border-sideband-border py-[120px] text-center">
      <div className="inner">
        <FadeUp>
          <h2 className="display text-balance text-[clamp(40px,6vw,72px)]">
            Six products
            <br />
            and counting.
          </h2>
          <p className="mx-auto mb-9 mt-5 max-w-[560px] text-pretty text-[18px] tracking-[-0.005em] text-sideband-text-secondary">
            Everything we ship ends up on GitHub. The inbox is always open.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <a
              href="https://github.com/sidebandstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[10px] bg-sideband-text px-[22px] py-3.5 text-[15px] font-semibold text-[#09090b] transition-all duration-200 hover:-translate-y-px hover:bg-white"
            >
              GitHub
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-[10px] border border-sideband-border px-[22px] py-3.5 text-[15px] font-medium text-sideband-text-secondary transition-colors duration-200 hover:border-sideband-border-strong hover:bg-white/[0.03] hover:text-sideband-text"
            >
              Contact
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
