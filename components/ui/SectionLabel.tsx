interface SectionLabelProps {
  label: string
  withLine?: boolean
}

export default function SectionLabel({
  label,
  withLine = false,
}: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
        {label}
      </span>
      {withLine && <div className="h-px flex-1 bg-sideband-border" />}
    </div>
  )
}
