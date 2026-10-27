import Backdrop from '@/components/ui/Backdrop'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'

/** The close: one way to reach the studio, centred once on the page. */
export default function FinalCta() {
  return (
    <Section labelledBy="cta-title" backdrop={<Backdrop variant="bands" />}>
      <SectionHeading
        id="cta-title"
        align="center"
        title={
          <>
            Questions, bugs
            <br />
            or ideas? Write to us.
          </>
        }
        lede="Ask about a product, report a bug or tell us what you would like to see next. We read every message."
        actions={
          <>
            <Button href="/contact" size="lg">
              Contact us
            </Button>
            <Button
              href="mailto:hello@sideband.studio"
              size="lg"
              variant="secondary"
            >
              hello@sideband.studio
            </Button>
          </>
        }
      />
    </Section>
  )
}
