import { useEffect, useState } from 'react'
import { useSyncGlobalLoading } from '../context/LoadingOverlayContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { Card } from '../components/ui/Card'
import type { Trip } from '../types'

export default function TripListPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useSyncGlobalLoading(loading)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ trips: Trip[] }>('/trips/available')
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
    return <div className="min-h-[40vh] w-full" aria-hidden />
  }

  if (error) {
    return (
      <div className="w-full max-w-none space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">Available trips</h1>
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
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">For drivers</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">Available trips</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Nothing open right now — check again soon.</p>
        </motion.div>
        <Card>
          <p className="text-sm text-[var(--text-muted)] text-center py-6">
            When owners post a request, it will show up here.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full max-lg:max-w-none"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">For drivers</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)]">Available trips</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)]">
          {trips.length} open {trips.length === 1 ? 'request' : 'requests'}
        </p>
      </motion.div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
        {trips.map((t, idx) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.28 }}
          >
            <Link to={`/trips/${t.id}`} className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]">
              <Card className="p-4 sm:p-5 hover:border-[var(--brand)]/35 transition-colors active:scale-[0.99]">
                <p className="font-semibold text-[var(--text)] line-clamp-2 leading-snug">
                  {t.pickupLocation} → {t.dropoffLocation}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  <span className="font-semibold text-[var(--brand)]">{t.paymentAmount} SEK</span>
                  <span className="mx-2 opacity-50">·</span>
                  Owner: {t.owner?.name ?? '—'}
                </p>
                <span className="inline-block mt-3 text-sm font-semibold text-[var(--brand)]">View details →</span>
              </Card>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
