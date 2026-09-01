import type { EngineerContact } from '@/lib/engineers'

interface ContactPanelProps {
  contact: EngineerContact
  name: string
}

interface Row {
  label: string
  value: string
  href: string
  external?: boolean
}

export default function ContactPanel({ contact, name }: ContactPanelProps) {
  const rows: Row[] = [
    { label: 'EMAIL', value: contact.email, href: `mailto:${contact.email}` },
  ]
  if (contact.website) {
    const stripped = contact.website.replace(/^https?:\/\//, '')
    rows.push({
      label: 'WEB',
      value: stripped,
      href: contact.website,
      external: true,
    })
  }
  if (contact.github) {
    const handle = contact.github.replace(
      /^https?:\/\/(www\.)?github\.com\//,
      '',
    )
    rows.push({
      label: 'GITHUB',
      value: `@${handle}`,
      href: contact.github,
      external: true,
    })
  }
  if (contact.linkedin) {
    const handle = contact.linkedin
      .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')
      .replace(/\/$/, '')
    rows.push({
      label: 'LINKEDIN',
      value: `in/${handle}`,
      href: contact.linkedin,
      external: true,
    })
  }
  if (contact.resume) {
    rows.push({
      label: 'RESUME',
      value: 'resume.pdf',
      href: contact.resume,
      external: true,
    })
  }

  return (
    <div className="border border-sideband-border bg-sideband-surface">
      <div className="flex items-center justify-between border-b border-sideband-border bg-sideband-surface-2 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-accent">
          [ DIRECT LINE ]
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sideband-muted">
          {name}
        </span>
      </div>
      <div className="divide-y divide-sideband-border">
        {rows.map((r) => (
          <a
            key={r.label}
            href={r.href}
            {...(r.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="group flex items-center justify-between gap-6 px-5 py-3 transition-colors duration-200 hover:bg-sideband-surface-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-muted">
              {r.label}
            </span>
            <span className="flex items-center gap-3 font-mono text-[12px] text-sideband-text-secondary transition-colors duration-200 group-hover:text-sideband-accent">
              {r.value}
              <span className="text-sideband-muted transition-colors duration-200 group-hover:text-sideband-accent">
                {r.external ? '↗' : '→'}
              </span>
            </span>
          </a>
        ))}
        {contact.location && (
          <div className="flex items-center justify-between gap-6 px-5 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-muted">
              LOCATION
            </span>
            <span className="font-mono text-[12px] text-sideband-text-secondary">
              {contact.location}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
