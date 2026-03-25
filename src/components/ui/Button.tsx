import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'danger' | 'accent' | 'ghost'

const variants: Record<
  Variant,
  string
> = {
  primary:
    'bg-[var(--brand)] text-white hover:opacity-95 active:scale-[0.98] shadow-md border border-transparent',
  accent:
    'bg-[var(--accent)] text-white hover:opacity-95 active:scale-[0.98] shadow-md border border-transparent',
  secondary:
    'bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] active:scale-[0.98]',
  danger:
    'bg-[var(--danger)] text-white hover:opacity-95 active:scale-[0.98] border border-transparent',
  ghost: 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)] border border-transparent',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  loading,
  fullWidth,
  type = 'button',
  ...props
}: Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
> & {
  variant?: Variant
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors min-h-[48px] disabled:opacity-45 disabled:pointer-events-none',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden
          />
          Working…
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
