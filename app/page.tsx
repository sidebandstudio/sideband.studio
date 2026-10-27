import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import ProductShowcase from '@/components/home/ProductShowcase'
import Team from '@/components/home/Team'
import OpenSource from '@/components/home/OpenSource'
import FinalCta from '@/components/home/FinalCta'
import { getHomeData } from '@/lib/home-data'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Sideband · Independent software studio',
  description:
    'Sideband is an independent software studio. We build the things we wished existed.',
  path: '/',
})

export default function Home() {
  const data = getHomeData()
  return (
    <>
      <Hero
        hero={data.hero}
        stats={data.stats}
        engineerCount={data.engineerCount}
        syncedOn={data.syncedOn}
      />
      <ProductShowcase
        products={data.showcase}
        more={data.more}
        ranking={data.ranking}
        syncedOn={data.syncedOn}
      />
      <Team team={data.team} />
      <OpenSource
        repos={data.openRepos}
        facts={data.studioFacts}
        org={data.org}
      />
      <FinalCta />
    </>
  )
}
