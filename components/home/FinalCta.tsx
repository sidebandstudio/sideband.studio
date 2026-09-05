import Button from '@/components/ui/Button'
import { GitHubIcon } from '@/components/ui/Icons'

export default function FinalCta() {
  return (
    <section className="sec sec-cta">
      <div className="inner relative">
        <h2 className="display text-balance text-[clamp(40px,6vw,72px)]">
          Six products
          <br />
          and counting.
        </h2>
        <p className="mx-auto mb-9 mt-5 max-w-[560px] text-pretty text-[18px] leading-[1.55] tracking-[-0.005em] text-sideband-text-secondary">
          Everything we ship ends up on GitHub. The inbox is always open.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Button href="https://github.com/sidebandstudio" size="lg" external>
            <GitHubIcon size={14} />
            GitHub
          </Button>
          <Button href="/contact" size="lg" variant="ghost">
            Contact
          </Button>
        </div>
      </div>
    </section>
  )
}
