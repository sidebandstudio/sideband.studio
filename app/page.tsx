import Hero from '@/components/home/Hero'
import ProductGrid from '@/components/home/ProductGrid'
import StudioSection from '@/components/home/StudioSection'
import OpenSource from '@/components/home/OpenSource'
import FinalCta from '@/components/home/FinalCta'
import { productsByRank } from '@/lib/products'

export default function Home() {
  return (
    <>
      <Hero products={productsByRank()} />
      <ProductGrid />
      <StudioSection />
      <OpenSource />
      <FinalCta />
    </>
  )
}
