import type { TextareaHTMLAttributes } from 'react'

export function TextArea({
  className = '',
  label,
  hint,
  error,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
}) {
  const inputId = id ?? props.name ?? 'textarea'
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
        {label}
      </label>
      <textarea
        id={inputId}
        className={[
          'w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3.5 text-[var(--text)] text-base min-h-[120px] resize-y',
          'placeholder:text-[var(--text-muted)]/60',
          'border-[var(--border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--ring)]',
          error ? 'border-[var(--danger)]' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[var(--text-muted)] leading-snug">{hint}</p>}
      {error && <p className="text-xs font-medium text-[var(--danger)]">{error}</p>}
    </div>
  )
}
