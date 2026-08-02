const STEPS = [
  {
    num: '01',
    label: 'FILE',
    detail: 'Submit a structured brief. Two minutes, no follow-up loop.',
  },
  {
    num: '02',
    label: 'TICKET',
    detail: 'A ticket ID is logged the moment you transmit. You keep the reference.',
  },
  {
    num: '03',
    label: 'REVIEW',
    detail: 'Reviewed by the founders. Personal response within three business days.',
  },
]

export default function ProcessStrip() {
  return (
    <div className="grid grid-cols-1 gap-px border border-eternal-border bg-eternal-border md:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className="bg-eternal-surface px-6 py-7 md:px-8 md:py-8"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-eternal-accent">
              {step.num}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-eternal-text-secondary">
              {`// ${step.label}`}
            </span>
          </div>
          <p className="mt-4 font-mono text-[13px] leading-relaxed text-eternal-text-secondary">
            {step.detail}
          </p>
        </div>
      ))}
    </div>
  )
}
