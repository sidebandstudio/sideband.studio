'use client'

export type TicketStatus = 'DRAFT' | 'TRANSMITTING' | 'TRANSMITTED' | 'ERROR'

interface TicketField {
  label: string
  value: string
}

interface TicketCardProps {
  ticketId: string
  status: TicketStatus
  fields: TicketField[]
}

const STATUS_COLOR: Record<TicketStatus, string> = {
  DRAFT: 'var(--eternal-text-secondary)',
  TRANSMITTING: 'var(--eternal-accent-yellow)',
  TRANSMITTED: '#4ade80',
  ERROR: '#f87171',
}

export default function TicketCard({
  ticketId,
  status,
  fields,
}: TicketCardProps) {
  const accent = STATUS_COLOR[status]

  return (
    <div className="relative border border-eternal-border bg-eternal-surface">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-eternal-border bg-eternal-surface-2 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-eternal-text-secondary">
          [ TICKET ]
        </span>
        <div className="flex items-center gap-2">
          <span
            className="block h-1.5 w-1.5 rounded-full transition-colors duration-300"
            style={{
              background: accent,
              boxShadow:
                status === 'TRANSMITTING'
                  ? `0 0 8px ${accent}`
                  : status === 'TRANSMITTED'
                    ? `0 0 10px ${accent}`
                    : 'none',
            }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
            style={{ color: accent }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Ticket ID, display */}
      <div className="border-b border-eternal-border px-5 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-eternal-muted">
          Reference
        </p>
        <p className="mt-2 break-all font-display text-3xl leading-none text-eternal-text md:text-4xl">
          {ticketId}
        </p>
        <p className="mt-3 font-mono text-[11px] text-eternal-text-secondary">
          Save this. Quote it in any follow-up.
        </p>
      </div>

      {/* Live field summary */}
      <div className="px-5 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-eternal-muted">
          {'// payload'}
        </p>
        <dl className="mt-4 space-y-2.5">
          {fields.map((field) => (
            <div
              key={field.label}
              className="grid grid-cols-[88px_1fr] gap-3 font-mono text-[12px]"
            >
              <dt className="text-eternal-muted uppercase tracking-wider">
                {field.label}
              </dt>
              <dd
                className={`truncate ${
                  field.value
                    ? 'text-eternal-text-secondary'
                    : 'text-eternal-muted italic'
                }`}
              >
                {field.value || ', '}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
