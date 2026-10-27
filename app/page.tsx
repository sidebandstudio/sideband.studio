import Hero from '@/components/home/Hero'
import ProductShowcase from '@/components/home/ProductShowcase'
import Team from '@/components/home/Team'
import OpenSource from '@/components/home/OpenSource'
import FinalCta from '@/components/home/FinalCta'
import { getHomeData } from '@/lib/home-data'

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
      <ProductShowcase products={data.showcase} />
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
