interface TagProps {
  label: string
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-block rounded-md border border-sideband-border bg-white/[0.02] px-2.5 py-1 font-mono text-[12px] text-sideband-text-secondary">
      {label}
    </span>
  )
}
