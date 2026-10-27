import Backdrop from '@/components/ui/Backdrop'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import Stat from '@/components/ui/Stat'
import HeroPreview from '@/components/home/HeroPreview'
import { countWord, type HomeData } from '@/lib/home-data'

/**
 * The first screen: who Sideband is, the two ways in, and the top-ranked
 * products as real screenshots. The studio's numbers from GitHub close it.
 */
export default function Hero({
  hero,
  stats,
  engineerCount,
  syncedOn,
}: Pick<HomeData, 'hero' | 'stats' | 'engineerCount' | 'syncedOn'>) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-section pt-32 md:pt-36"
    >
      <Backdrop variant="spotlight" />
      <Container>
        <Reveal trigger="mount">
          <Eyebrow className="mb-6">
            Independent software studio in Boston, MA
          </Eyebrow>
        </Reveal>
        <Reveal trigger="mount" delay={70}>
          <h1 id="hero-title" className="text-display text-sideband-text">
            We build the things
            <br />
            we wished existed.
          </h1>
        </Reveal>

        <div className="mt-8 flex flex-col gap-9 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal trigger="mount" delay={140}>
            <p className="max-w-prose text-lead text-sideband-text-secondary">
              Sideband is {countWord(engineerCount)} engineers who design, build
              and ship their own software, from an iPad display for Windows to a
              Discord status for Apple Music.
            </p>
          </Reveal>
          <Reveal
            trigger="mount"
            delay={210}
            className="flex shrink-0 flex-wrap items-center gap-3"
          >
            <Button href="/products" size="lg">
              View products
            </Button>
            <Button href="/engineers" size="lg" variant="secondary">
              Meet the engineers
            </Button>
          </Reveal>
        </div>

        <Reveal trigger="mount" delay={280} className="mt-14 md:mt-16">
          <HeroPreview items={hero} />
        </Reveal>

        <div className="mt-20 md:mt-28">
          <h2 className="text-lead font-medium text-sideband-text">
            The studio on GitHub
          </h2>
          <p className="mt-2 text-small text-sideband-muted">
            Counted from our product repos and profiles, synced {syncedOn}.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
            {stats.map((s) => (
              <Stat
                key={s.label}
                value={s.value}
                label={s.label}
                countUp
                className="justify-end"
              />
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
