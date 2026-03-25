import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { getStoredUser } from '../lib/authStorage'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import type { Trip } from '../types'

type ConfirmKind = null | 'accept' | 'complete'

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = getStoredUser()
  const { toast } = useToast()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null)

  const load = async () => {
    if (!id) return
    const res = await api<{ trip: Trip }>(`/trips/${id}`)
    setTrip(res.trip)
  }

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        await load()
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load trip')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const run = async (action: () => Promise<void>, successMessage?: string): Promise<boolean> => {
    setBusy(true)
    setError(null)
    try {
      await action()
      await load()
      if (successMessage) toast(successMessage, 'success')
      return true
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      return false
    } finally {
      setBusy(false)
    }
  }

  const backHref = user?.role === 'driver' ? '/trips/available' : '/trips/mine'

  if (loading) {
    return (
      <div className="w-full max-w-none space-y-4 animate-pulse" aria-busy="true">
        <div className="h-4 w-24 rounded bg-[var(--bg-subtle)]" />
        <div className="h-10 w-2/3 max-w-md rounded bg-[var(--bg-subtle)]" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="h-64 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]" />
          <div className="h-40 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] hidden lg:block" />
        </div>
      </div>
    )
  }

  if (error && !trip) {
    return (
      <Card className="border-[var(--danger)]/25 bg-[var(--danger-soft)]/20 max-w-xl">
        <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
        <Link to={backHref} className="inline-block mt-4 text-sm font-semibold text-[var(--brand)]">
          ← Go back
        </Link>
      </Card>
    )
  }

  if (!trip) return null

  const isOwner = user?.id === trip.owner?.id
  const isOwnListing = user?.role === 'driver' && trip.owner?.id === user?.id
  const canAccept = user?.role === 'driver' && trip.status === 'pending' && !isOwnListing
  const canComplete = isOwner && trip.status === 'accepted'

  const confirmOpen = confirmKind !== null

  return (
    <div className="w-full max-w-none space-y-5 lg:space-y-8">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,24rem)] gap-8 xl:gap-10 lg:items-start">
        <div className="min-w-0 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to={backHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] min-h-[44px] py-1"
            >
              ← Back
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight mt-1">
              Trip details
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mt-2">
              Status: <span className="text-[var(--accent)]">{trip.status}</span>
            </p>
          </motion.div>

          {isOwnListing && trip.status === 'pending' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-muted)] leading-snug">
              This is your own request — another driver can accept it.
            </div>
          )}

          <Card className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <DetailRow label="Pickup" value={trip.pickupLocation} />
              <DetailRow label="Dropoff" value={trip.dropoffLocation} />
            </div>
            <DetailRow label="Vehicle" value={trip.carDescription} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Agreed payment (fixed)</p>
              <p className="text-[var(--text)] font-semibold mt-1">{trip.paymentAmount} SEK</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                For visibility only — you arrange payment directly with the other party. KeyGo does not move money.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border)] space-y-1 text-sm">
              <p className="text-[var(--text-muted)]">
                Owner: <span className="text-[var(--text)] font-medium">{trip.owner?.name}</span>{' '}
                <span className="text-xs">({trip.owner?.email})</span>
              </p>
              {trip.driver && (
                <p className="text-[var(--text-muted)]">
                  Driver: <span className="text-[var(--text)] font-medium">{trip.driver.name}</span>{' '}
                  <span className="text-xs">({trip.driver.email})</span>
                </p>
              )}
            </div>
          </Card>

          {error && (
            <p className="text-sm font-medium text-[var(--danger)] lg:hidden" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 lg:hidden">
            {canAccept && (
              <Button type="button" fullWidth disabled={busy} onClick={() => setConfirmKind('accept')}>
                Accept trip
              </Button>
            )}
            {canComplete && (
              <Button type="button" variant="accent" fullWidth disabled={busy} onClick={() => setConfirmKind('complete')}>
                Confirm delivery
              </Button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-28 xl:top-32 space-y-4 shrink-0">
          <Card className="p-5 sm:p-6 space-y-4 border-[var(--border)] bg-[var(--bg-elevated)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Actions</p>
            {error && (
              <p className="text-sm font-medium text-[var(--danger)] hidden lg:block" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-3">
              {canAccept && (
                <Button type="button" fullWidth disabled={busy} onClick={() => setConfirmKind('accept')}>
                  Accept trip
                </Button>
              )}
              {canComplete && (
                <Button type="button" variant="accent" fullWidth disabled={busy} onClick={() => setConfirmKind('complete')}>
                  Confirm delivery
                </Button>
              )}
              {!canAccept && !canComplete && (
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  No actions right now. Status updates appear here when you can accept or complete.
                </p>
              )}
            </div>
          </Card>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed px-1 hidden lg:block">
            Vehicle relocation only — coordinate handover and keys directly with the other party.
          </p>
        </aside>
      </div>

      <ConfirmModal
        open={confirmOpen && confirmKind === 'accept'}
        title="Accept this trip?"
        message="You’ll be assigned to move this vehicle from pickup to dropoff. People are not passengers — only the car is relocated."
        confirmLabel="Accept"
        cancelLabel="Not now"
        loading={busy}
        onCancel={() => setConfirmKind(null)}
        onConfirm={() => {
          void run(
            async () => {
              await api(`/trips/${trip.id}/accept`, { method: 'POST', body: '{}' })
            },
            'You’re assigned — confirm handover details with the owner.',
          ).then((ok) => {
            if (ok) setConfirmKind(null)
          })
        }}
      />

      <ConfirmModal
        open={confirmOpen && confirmKind === 'complete'}
        title="Mark trip completed?"
        message="Use this when the vehicle has been delivered as agreed. The driver should already have finished the move."
        confirmLabel="Mark completed"
        cancelLabel="Cancel"
        variant="primary"
        loading={busy}
        onCancel={() => setConfirmKind(null)}
        onConfirm={() => {
          void run(
            async () => {
              await api(`/trips/${trip.id}/complete`, { method: 'POST', body: '{}' })
            },
            'Trip marked completed.',
          ).then((ok) => {
            if (ok) setConfirmKind(null)
          })
        }}
      />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="text-[var(--text)] mt-1 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  )
}
