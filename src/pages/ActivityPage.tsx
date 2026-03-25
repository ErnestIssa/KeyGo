import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { getStoredUser } from '../lib/authStorage'
import { Card } from '../components/ui/Card'
import type { Trip } from '../types'

const statusLabel: Record<string, string> = {
  pending: 'Open',
  accepted: 'In progress',
  completed: 'Completed',
}

export default function ActivityPage() {
  const user = getStoredUser()
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let c = false
    ;(async () => {
      try {
        const res = await api<{ trips: Trip[] }>('/trips/mine')
        if (!c) setTrips(res.trips.slice(0, 12))
      } catch (e: unknown) {
        if (!c) setError(e instanceof Error ? e.message : 'Could not load activity')
      } finally {
        if (!c) setLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [])

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">Updates</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight">Activity</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Recent trips you&apos;re involved in. Full messaging will come later — for now, open a trip for details.
        </p>
      </motion.div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]" />
          ))}
        </div>
      )}

      {error && (
        <Card className="border-[var(--danger)]/25 bg-[var(--danger-soft)]/20 max-w-xl">
          <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
        </Card>
      )}

      {!loading && !error && trips.length === 0 && (
        <Card>
          <p className="text-sm text-[var(--text-muted)] text-center py-10">
            No trip activity yet. {user?.role === 'owner' ? 'Create a trip from the center button.' : 'Browse available trips to get started.'}
          </p>
        </Card>
      )}

      {!loading && trips.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
          {trips.map((t, idx) => (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link to={`/trips/${t.id}`} className="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]">
                <Card className="h-full p-4 sm:p-5 hover:border-[var(--brand)]/35 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
                      {statusLabel[t.status] || t.status}
                    </span>
                    <span className="text-sm font-semibold text-[var(--text)]">{t.paymentAmount} SEK</span>
                  </div>
                  <p className="text-sm text-[var(--text)] line-clamp-2 leading-snug">
                    {t.pickupLocation} → {t.dropoffLocation}
                  </p>
                  <span className="inline-block mt-3 text-xs font-semibold text-[var(--brand)]">View trip →</span>
                </Card>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
