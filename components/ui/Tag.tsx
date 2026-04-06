interface TagProps {
  label: string
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-block rounded-full border border-eternal-border bg-eternal-surface-2 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-eternal-text-secondary">
      {label}
    </span>
  )
}
