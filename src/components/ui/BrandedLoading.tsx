import { motion } from 'framer-motion'
import { IconKeyGoLogo } from '../layout/navIcons'

type Props = {
  /** Full viewport behind content (boot / overlay). */
  fullscreen?: boolean
  className?: string
}

export function BrandedLoading({ fullscreen, className = '' }: Props) {
  const core = (
    <div className={`flex flex-col items-center justify-center gap-7 ${className}`}>
      <div className="relative flex h-[7.5rem] w-[7.5rem] items-center justify-center">
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[var(--accent)]"
          animate={{ scale: [1, 1.32, 1], opacity: [0.22, 0.48, 0.22], rotate: [0, 360] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-[10px] rounded-full border border-[var(--accent)]/70"
          animate={{ scale: [1.05, 0.92, 1.05], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 1.75, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
        <motion.div
          className="relative z-10 text-[var(--accent)]"
          animate={{
            scale: [1, 1.09, 1],
            rotate: [-6, 6, -6],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IconKeyGoLogo className="block h-[4.5rem] w-[4.5rem]" />
        </motion.div>
      </div>
      <div className="flex h-3 items-center gap-2" role="progressbar" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-[var(--accent)]"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.55,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-page)]"
        aria-live="polite"
      >
        {core}
      </div>
    )
  }

  return core
}
