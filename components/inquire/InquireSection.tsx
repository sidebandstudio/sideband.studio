'use client'

import { useEffect, useMemo, useState } from 'react'
import FadeUp from '@/components/animations/FadeUp'
import GlowButton from '@/components/ui/GlowButton'
import { generateTicketId } from '@/lib/ticket'
import TicketCard, { type TicketStatus } from './TicketCard'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_INQUIRE_ID || 'xkoperoj'

const PROJECT_TYPES = [
  'Mobile App',
  'Web App',
  'Desktop / Systems',
  'Hardware',
  'AI / ML',
  'Other',
]

const BUDGETS = [
  '< $5k',
  '$5k – $25k',
  '$25k – $100k',
  '$100k+',
  'Equity / Partnership',
  'Curiosity brief (no budget)',
]

const TIMELINES = [
  'ASAP',
  '1 – 3 months',
  '3 – 6 months',
  '6+ months / exploratory',
]

const SECTION_HEADERS = [
  { num: '01', label: 'About You' },
  { num: '02', label: 'The Project' },
  { num: '03', label: 'Scope' },
  { num: '04', label: 'Brief' },
]

interface FormState {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  timeline: string
  links: string
  brief: string
  nda: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  links: '',
  brief: '',
  nda: false,
}

const inputClass =
  'w-full border border-sideband-border bg-sideband-surface px-4 py-3 font-mono text-[14px] text-sideband-text transition-colors duration-200 placeholder:text-sideband-muted focus:border-sideband-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sideband-accent'

const labelClass =
  'mb-2 block font-mono text-[11px] uppercase tracking-wider text-sideband-text-secondary'

const sectionHeaderClass =
  'font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-accent'

export default function InquireSection() {
  // Generated after mount: the ID is random, so producing it during render
  // makes the prerendered HTML disagree with the client and breaks hydration.
  const [ticketId, setTicketId] = useState('SB-XXXX-XXXX')
  useEffect(() => setTicketId(generateTicketId()), [])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')

  const ticketStatus: TicketStatus =
    status === 'submitting'
      ? 'SENDING'
      : status === 'success'
        ? 'SENT'
        : status === 'error'
          ? 'ERROR'
          : 'DRAFT'

  const ticketFields = useMemo(
    () => [
      { label: 'From', value: form.name },
      { label: 'Type', value: form.projectType },
      { label: 'Budget', value: form.budget },
      { label: 'Window', value: form.timeline },
    ],
    [form.name, form.projectType, form.budget, form.timeline],
  )

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Formspree honeypot: bots fill every field, humans never see this one.
    if (honeypot) {
      setStatus('success')
      return
    }

    setStatus('submitting')

    const payload = {
      ticket_id: ticketId,
      _subject: `INQUIRE · ${ticketId} · ${form.name || 'unnamed'}`,
      name: form.name,
      email: form.email,
      company: form.company || 'n/a',
      project_type: form.projectType || 'n/a',
      budget: form.budget || 'n/a',
      timeline: form.timeline || 'n/a',
      reference_links: form.links || 'n/a',
      nda: form.nda ? 'YES: flagged confidential' : 'no',
      brief: form.brief,
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
      {/* Form / success state */}
      <FadeUp>
        {status === 'success' ? (
          <SuccessPanel ticketId={ticketId} name={form.name} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-14">
            {/* 01 · About You */}
            <section className="space-y-6">
              <SectionHeader {...SECTION_HEADERS[0]} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className={labelClass}>
                  Company / Organization
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>
            </section>

            {/* 02 · The Project */}
            <section className="space-y-6">
              <SectionHeader {...SECTION_HEADERS[1]} />
              <div>
                <label htmlFor="projectType" className={labelClass}>
                  Project Type
                </label>
                <SelectField
                  id="projectType"
                  value={form.projectType}
                  onChange={(v) => update('projectType', v)}
                  placeholder="Select a category"
                  options={PROJECT_TYPES}
                />
              </div>
              <div>
                <label htmlFor="links" className={labelClass}>
                  Reference Links
                </label>
                <input
                  id="links"
                  type="text"
                  value={form.links}
                  onChange={(e) => update('links', e.target.value)}
                  className={inputClass}
                  placeholder="Existing site, wireframes, inspiration…"
                />
              </div>
            </section>

            {/* 03 · Scope */}
            <section className="space-y-6">
              <SectionHeader {...SECTION_HEADERS[2]} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="budget" className={labelClass}>
                    Budget
                  </label>
                  <SelectField
                    id="budget"
                    value={form.budget}
                    onChange={(v) => update('budget', v)}
                    placeholder="Select a range"
                    options={BUDGETS}
                  />
                </div>
                <div>
                  <label htmlFor="timeline" className={labelClass}>
                    Timeline
                  </label>
                  <SelectField
                    id="timeline"
                    value={form.timeline}
                    onChange={(v) => update('timeline', v)}
                    placeholder="Select a window"
                    options={TIMELINES}
                  />
                </div>
              </div>
            </section>

            {/* 04 · Brief */}
            <section className="space-y-6">
              <SectionHeader {...SECTION_HEADERS[3]} />
              <div>
                <label htmlFor="brief" className={labelClass}>
                  Project Brief *
                </label>
                <textarea
                  id="brief"
                  required
                  rows={7}
                  value={form.brief}
                  onChange={(e) => update('brief', e.target.value)}
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder="What are you trying to build? Who is it for? Why does it need to exist?"
                />
              </div>
              <label className="group flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.nda}
                  onChange={(e) => update('nda', e.target.checked)}
                  className="peer absolute h-4 w-4 cursor-pointer opacity-0"
                />
                <span className="relative mt-[3px] block h-4 w-4 shrink-0 border border-sideband-border bg-sideband-surface transition-colors duration-200 group-hover:border-sideband-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sideband-accent">
                  {form.nda && (
                    <span className="absolute inset-0.5 bg-sideband-accent" />
                  )}
                </span>
                <span className="font-mono text-[12px] leading-relaxed text-sideband-text-secondary">
                  Mark this brief as confidential. We will not share its
                  contents.
                </span>
              </label>
            </section>

            {/* Honeypot: hidden from humans, irresistible to bots */}
            <div
              aria-hidden
              className="absolute left-[-9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="company-website">Do not fill this in</label>
              <input
                id="company-website"
                name="_gotcha"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col items-start gap-4 border-t border-sideband-border pt-8">
              {status === 'error' && (
                <p
                  role="alert"
                  className="font-mono text-[11px] uppercase tracking-wider text-red-400"
                >
                  That did not send.{' '}
                  <a
                    href={`mailto:hello@sideband.studio?subject=INQUIRE · ${ticketId}`}
                    className="underline underline-offset-4"
                  >
                    email us directly with reference {ticketId}
                  </a>
                </p>
              )}
              <GlowButton variant="filled" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send Brief →'}
              </GlowButton>
              <p className="font-mono text-[11px] text-sideband-muted">
                By sending, you agree we may contact you about this brief at
                the email above.
              </p>
            </div>
          </form>
        )}
      </FadeUp>

      {/* Sticky rail: ticket + curiosity-brief note */}
      <FadeUp delay={0.1}>
        <aside className="lg:sticky lg:top-24 space-y-6">
          <TicketCard
            ticketId={ticketId}
            status={ticketStatus}
            fields={ticketFields}
          />

          <div className="border border-sideband-border bg-sideband-black px-5 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-accent-pink">
              [ NOTE / CURIOSITY BRIEFS ]
            </p>
            <p className="mt-3 font-mono text-[12px] leading-relaxed text-sideband-text-secondary">
              No budget? Pick{' '}
              <span className="text-sideband-text">
                &ldquo;Curiosity brief&rdquo;
              </span>
              . If it is something we wish existed, we might build it anyway.
            </p>
          </div>
        </aside>
      </FadeUp>
    </div>
  )
}

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-sideband-border pb-3">
      <span className={sectionHeaderClass}>{`[ ${num} // ${label} ]`}</span>
      <div className="h-px flex-1 bg-sideband-border" />
    </div>
  )
}

interface SelectFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[]
}

function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10 ${
          value ? '' : 'text-sideband-muted'
        }`}
      >
        <option value="" className="bg-sideband-surface text-sideband-muted">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-sideband-surface text-sideband-text"
          >
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sideband-text-secondary"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M1 1l4 4 4-4" strokeLinecap="square" />
      </svg>
    </div>
  )
}

function SuccessPanel({ ticketId, name }: { ticketId: string; name: string }) {
  return (
    <div className="border border-sideband-accent bg-sideband-surface">
      <div className="flex items-center justify-between border-b border-sideband-accent/40 bg-sideband-surface-2 px-6 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-accent">
          [ BRIEF SENT ]
        </span>
        <div className="flex items-center gap-2">
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{
              background: '#4ade80',
              boxShadow: '0 0 10px #4ade80',
            }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#4ade80]">
            SENT
          </span>
        </div>
      </div>
      <div className="px-6 py-10 md:px-10 md:py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sideband-text-secondary">
          {'// your reference'}
        </p>
        <p className="mt-3 break-all font-display text-4xl text-sideband-text md:text-6xl">
          {ticketId}
        </p>
        <p className="mt-6 max-w-md font-mono text-[14px] leading-relaxed text-sideband-text-secondary">
          {name ? `${name.split(' ')[0]}, your` : 'Your'} brief is in. One of
          us will reply within three business days.
        </p>
        <p className="mt-4 max-w-md font-mono text-[12px] leading-relaxed text-sideband-muted">
          Following up? Email{' '}
          <a
            href={`mailto:hello@sideband.studio?subject=Re: ${ticketId}`}
            className="text-sideband-text-secondary underline underline-offset-4 transition-colors hover:text-sideband-accent"
          >
            hello@sideband.studio
          </a>{' '}
          and quote your reference.
        </p>
      </div>
    </div>
  )
}
