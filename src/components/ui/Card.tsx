import type { HTMLAttributes, ReactNode } from 'react'

type DivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
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
>
import { motion } from 'framer-motion'

export function Card({
  children,
  className = '',
  ...props
}: DivProps & { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6',
        'shadow-[var(--shadow)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.div>
  )
}
