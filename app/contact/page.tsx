import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import { ArrowUpRightIcon, GitHubIcon } from '@/components/ui/Icons'
import ContactForm from '@/components/contact/ContactForm'
import { engineers } from '@/lib/engineers'
import { githubOrg } from '@/lib/github'

export const metadata: Metadata = {
  title: 'Contact · Sideband',
  description:
    'Write to Sideband at hello@sideband.studio or through the form, or reach one of its founding engineers directly.',
}

export default function ContactPage() {
  return (
    <Section labelledBy="contact-title" className="!pt-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
        <div>
          <SectionHeading
            as="h1"
            id="contact-title"
            trigger="mount"
            title="Write to Sideband"
            lede="Questions about a product, a bug report, or an idea to build together. Messages from the form land in the studio inbox."
          />

          <Reveal trigger="mount" delay={280}>
            <h2 className="sr-only">Other ways to reach us</h2>
            <ul className="mt-12 space-y-3">
              <li>
                <a
                  href="mailto:hello@sideband.studio"
                  className="group flex items-center gap-4 rounded-inner bg-sideband-surface px-5 py-4 transition-colors duration-hover hover:bg-sideband-surface-2"
                >
                  <span className="w-16 shrink-0 text-small text-sideband-muted">
                    Email
                  </span>
                  <span className="flex-1 text-body text-sideband-text">
                    hello@sideband.studio
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={githubOrg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-inner bg-sideband-surface px-5 py-4 transition-colors duration-hover hover:bg-sideband-surface-2"
                >
                  <span className="w-16 shrink-0 text-small text-sideband-muted">
                    GitHub
                  </span>
                  <span className="flex flex-1 items-center gap-2 text-body text-sideband-text">
                    <GitHubIcon size={16} className="text-sideband-muted" />
                    github.com/{githubOrg.login}
                  </span>
                  <ArrowUpRightIcon
                    size={13}
                    className="shrink-0 text-sideband-muted transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal trigger="mount" delay={350}>
            <h2 className="mt-14 text-body font-medium text-sideband-text">
              Or write to a founding engineer
            </h2>
            <ul className="mt-5 space-y-4">
              {engineers.map((e) => (
                <li key={e.id} className="flex items-center gap-4">
                  {e.portrait && (
                    <Image
                      src={e.portrait.src}
                      alt=""
                      width={96}
                      height={96}
                      className="h-11 w-11 shrink-0 rounded-full bg-sideband-surface object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/engineers/${e.id}`}
                      className="text-small font-medium text-sideband-text transition-colors duration-hover hover:text-white"
                    >
                      {e.name}
                    </Link>
                    <a
                      href={`mailto:${e.contact.email}`}
                      className="block truncate text-small text-sideband-text-secondary transition-colors duration-hover hover:text-sideband-text"
                    >
                      {e.contact.email}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal trigger="mount" delay={210}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
