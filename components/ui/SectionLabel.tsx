interface SectionLabelProps {
  label: string
  withLine?: boolean
}

export default function SectionLabel({
  label,
  withLine = false,
}: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-eternal-accent">
        [ {label} ]
      </span>
      {withLine && (
        <div className="h-px flex-1 bg-eternal-accent/30" />
      )}
    </div>
  )
}
