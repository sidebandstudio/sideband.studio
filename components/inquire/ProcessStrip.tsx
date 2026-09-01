const STEPS = [
  {
    num: '01',
    label: 'WRITE',
    detail: 'Fill in the brief. Takes about two minutes.',
  },
  {
    num: '02',
    label: 'REFERENCE',
    detail: 'Your submission gets a reference ID. Quote it in any follow-up.',
  },
  {
    num: '03',
    label: 'REPLY',
    detail: 'One of us reads it and replies within three business days.',
  },
]

export default function ProcessStrip() {
  return (
    <div className="grid grid-cols-1 gap-px border border-sideband-border bg-sideband-border md:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className="bg-sideband-surface px-6 py-7 md:px-8 md:py-8"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-sideband-accent">
              {step.num}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sideband-text-secondary">
              {`// ${step.label}`}
            </span>
          </div>
          <p className="mt-4 font-mono text-[13px] leading-relaxed text-sideband-text-secondary">
            {step.detail}
          </p>
        </div>
      ))}
    </div>
  )
}
