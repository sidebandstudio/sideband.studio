import Hero from '@/components/home/Hero'
import ProductShowcase from '@/components/home/ProductShowcase'
import EngineeringNotes from '@/components/home/EngineeringNotes'
import TeamSection from '@/components/home/TeamSection'
import FinalCta from '@/components/home/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <EngineeringNotes />
      <TeamSection />
      <FinalCta />
    </>
  )
}
