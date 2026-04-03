type Props = {
  className?: string
}

/** Visual stub until `mapbox-gl` is mounted in this node. */
export function MapPlaceholder({ className = '' }: Props) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[var(--bg-subtle)] ${className}`.trim()}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-[18%_12%_22%_12%] opacity-[0.22]">
        <div className="absolute left-0 right-0 top-[38%] h-px bg-[var(--border)]" />
        <div className="absolute left-0 right-0 top-[62%] h-px bg-[var(--border)]" />
        <div className="absolute bottom-0 left-[35%] top-0 w-px bg-[var(--border)]" />
        <div className="absolute bottom-0 right-[35%] top-0 w-px bg-[var(--border)]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-35" />
    </div>
  )
}
