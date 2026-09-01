interface MediaPlaceholderProps {
  label?: string
}

export default function MediaPlaceholder({
  label = 'DEMO COMING SOON',
}: MediaPlaceholderProps) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-sideband-border">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-sideband-muted"
      >
        <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" fillOpacity="0.5" />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-sideband-muted">
        [ {label} ]
      </span>
    </div>
  )
}
