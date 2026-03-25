import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { Card } from '../components/ui/Card'
import type { Trip } from '../types'

const statusStyle: Record<string, string> = {
  pending: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20',
  accepted: 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]/20',
  completed: 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border)]',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  completed: 'Completed',
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ trips: Trip[] }>('/trips/mine')
        if (!cancelled) setTrips(res.trips)
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load trips')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">My trips</h1>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse" aria-hidden>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-none space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">My trips</h1>
        <Card className="border-[var(--danger)]/25 bg-[var(--danger-soft)]/20">
          <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
        </Card>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">My trips</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Trips you own or are assigned to drive appear here.</p>
        </motion.div>
        <Card>
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No trips yet.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">My trips</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)]">{trips.length} total</p>
      </motion.div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
        {trips.map((t, idx) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Link
              to={`/trips/${t.id}`}
              className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <Card className="p-4 sm:p-5 hover:border-[var(--brand)]/35 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-[var(--text)] line-clamp-2 flex-1 min-w-0 leading-snug">
                    {t.pickupLocation} → {t.dropoffLocation}
                  </p>
                  <span
                    className={[
                      'shrink-0 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg border',
                      statusStyle[t.status] || statusStyle.pending,
                    ].join(' ')}
                  >
                    {statusLabel[t.status] || t.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  <span className="font-semibold text-[var(--text)]">{t.paymentAmount} SEK</span>
                </p>
              </Card>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
