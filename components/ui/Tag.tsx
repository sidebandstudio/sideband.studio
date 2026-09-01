interface TagProps {
  label: string
  color?: string
}

export default function Tag({ label, color }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        fontFamily: 'inherit',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        border: `1px solid ${color ?? 'var(--sideband-border)'}`,
        color: color ?? 'var(--sideband-text-secondary)',
        opacity: color ? 0.85 : 1,
      }}
    >
      {label}
    </span>
  )
}
