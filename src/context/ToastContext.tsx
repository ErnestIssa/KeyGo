import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastTone = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const toast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = `t-${++idRef.current}`
    setItems((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none safe-pb px-4 pb-4"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className={[
                'pointer-events-auto max-w-md w-full rounded-2xl px-4 py-3 text-sm font-medium shadow-lg border',
                t.tone === 'success' &&
                  'bg-[var(--bg-elevated)] border-emerald-500/30 text-emerald-800 dark:text-emerald-200',
                t.tone === 'error' &&
                  'bg-[var(--bg-elevated)] border-[var(--danger)]/35 text-[var(--danger)]',
                t.tone === 'info' &&
                  'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text)]',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
