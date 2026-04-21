interface SectionLabelProps {
  label: string
  withLine?: boolean
}

export default function SectionLabel({
  label,
  withLine = false,
}: SectionLabelProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--eternal-accent)',
        }}
      >
        [ {label} ]
      </span>
      {withLine && (
        <div
          style={{ flex: 1, height: 1, background: 'var(--eternal-border)' }}
        />
      )}
    </div>
  )
}
