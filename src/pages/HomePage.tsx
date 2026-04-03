import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getStoredUser } from '../lib/authStorage'
import { Card } from '../components/ui/Card'

export default function HomePage() {
  const user = getStoredUser()

  return (
    <div className="w-full max-w-none space-y-6 sm:space-y-8 lg:space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-4xl w-full max-lg:max-w-none"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">Overview</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight">
          Hello, {user?.name}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed lg:max-w-3xl">
          KeyGo helps move your <strong className="text-[var(--text)]">car</strong> when you can’t drive it yourself — not a taxi;{' '}
          <strong className="text-[var(--text)]">no passenger transport</strong>.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Signed in as <span className="font-semibold text-[var(--text)] capitalize">{user?.role}</span>.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {user?.role === 'owner' && (
          <Card className="flex flex-col h-full min-h-[200px]">
            <h2 className="font-bold text-[var(--text)] text-lg mb-1">Need your car moved?</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4 flex-1 leading-relaxed">
              Post pickup, dropoff, and vehicle details. A driver accepts and relocates the vehicle only.
            </p>
            <Link
              to="/trips/new"
              className="inline-flex rounded-xl bg-[var(--brand)] text-white px-4 py-3 text-sm font-semibold min-h-[48px] items-center justify-center w-full sm:w-auto mt-auto"
            >
              Create a trip
            </Link>
          </Card>
        )}
        {user?.role === 'driver' && (
          <Card className="flex flex-col h-full min-h-[200px]">
            <h2 className="font-bold text-[var(--text)] text-lg mb-1">Relocate vehicles</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4 flex-1 leading-relaxed">
              Browse open requests and accept trips you can complete (vehicle only, A → B).
            </p>
            <Link
              to="/trips/available"
              className="inline-flex rounded-xl bg-[var(--brand)] text-white px-4 py-3 text-sm font-semibold min-h-[48px] items-center justify-center w-full sm:w-auto mt-auto"
            >
              View available trips
            </Link>
          </Card>
        )}
        <Card className="flex flex-col h-full min-h-[200px] md:col-span-2 xl:col-span-1">
          <h2 className="font-bold text-[var(--text)] text-lg mb-1">Your trips</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4 flex-1 leading-relaxed">Requests you posted or trips you’re driving.</p>
          <Link
            to="/trips/mine"
            className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm font-semibold min-h-[48px] items-center justify-center w-full sm:w-auto mt-auto"
          >
            Open my trips
          </Link>
        </Card>
      </div>
    </div>
  )
}
