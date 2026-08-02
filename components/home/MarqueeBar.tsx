'use client'

const marqueeItems = [
  'EternalMonitor',
  'EternalRichPresence',
  'Exerly Fitness',
  'Signature Cuts 413',
  'Eternal2x',
  'Eternal Summary',
  'Rust',
  'Swift',
  'Metal',
  'DXGI',
  'SwiftUI',
  'HealthKit',
  'Next.js',
  'TypeScript',
  'Boston, MA',
  'Est. 2025',
]

export default function MarqueeBar() {
  const doubled = [...marqueeItems, ...marqueeItems]

  return (
    <div className="marquee-outer">
      <div className="marquee-track">
        {doubled.map((item, index) => (
          <div key={`${item}-${index}`} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
