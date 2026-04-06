import Hero from '@/components/home/Hero'
import MarqueeBar from '@/components/home/MarqueeBar'
import ProductGrid from '@/components/home/ProductGrid'
import StudioStatement from '@/components/home/StudioStatement'
import TeamStrip from '@/components/home/TeamStrip'

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBar />
      <ProductGrid />
      <StudioStatement />
      <TeamStrip />
    </>
  )
}
