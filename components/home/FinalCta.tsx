import Backdrop from '@/components/ui/Backdrop'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { GitHubIcon } from '@/components/ui/Icons'

export default function FinalCta() {
  return (
    <Section labelledBy="cta-title" backdrop={<Backdrop variant="bands" />}>
      <SectionHeading
        id="cta-title"
        align="center"
        title={
          <>
            Eleven products
            <br />
            and counting.
          </>
        }
        lede="Everything we ship ends up on GitHub. The inbox is always open."
        actions={
          <>
            <Button href="https://github.com/sidebandstudio" size="lg" external>
              <GitHubIcon size={15} />
              GitHub
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Contact
            </Button>
          </>
        }
      />
    </Section>
  )
}
