'use client'

const items = [
  { text: 'ETERNAL REVERSE', accent: true },
  { text: 'EST. 2025', accent: false },
  { text: 'BOSTON MA', accent: false },
  { text: 'RUST · SWIFT · TYPESCRIPT · PYTHON', accent: false },
  { text: 'OPEN TO CONTRIBUTORS', accent: false },
  { text: 'BUILT FOR MAKERS', accent: false },
]

function MarqueeContent() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center gap-6">
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
              item.accent
                ? 'text-eternal-accent'
                : 'text-eternal-text-secondary'
            }`}
          >
            {item.text}
          </span>
          <span className="text-[8px] text-eternal-muted">&#x25C6;</span>
        </span>
      ))}
    </>
  )
}

export default function MarqueeBar() {
  return (
    <div className="marquee-container overflow-hidden border-b border-t border-eternal-border bg-eternal-surface py-3">
      <div className="flex">
        <div className="marquee-track flex shrink-0 animate-marquee items-center gap-6">
          <MarqueeContent />
          <MarqueeContent />
        </div>
        <div className="marquee-track flex shrink-0 animate-marquee-2 items-center gap-6">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </div>
  )
}
