import type { InputHTMLAttributes } from 'react'

export function Input({
  className = '',
  label,
  hint,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}) {
  const inputId = id ?? props.name ?? label.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          'w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3.5 text-[var(--text)] text-base min-h-[48px]',
          'placeholder:text-[var(--text-muted)]/60 transition-shadow',
          'border-[var(--border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--ring)]',
          error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/30' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[var(--text-muted)] leading-snug">{hint}</p>}
      {error && <p className="text-xs font-medium text-[var(--text-muted)]">{error}</p>}
    </div>
  )
}
