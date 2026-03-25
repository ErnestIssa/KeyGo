import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { TextArea } from '../components/ui/TextArea'
import { useToast } from '../context/ToastContext'
import type { Trip } from '../types'

export default function CreateTripPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pickupLocation, setPickup] = useState('')
  const [dropoffLocation, setDropoff] = useState('')
  const [carDescription, setCarDescription] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const amount = parseFloat(paymentAmount)
    if (Number.isNaN(amount) || amount < 0) {
      setError('Enter a valid payment amount (0 or more).')
      return
    }
    setLoading(true)
    try {
      const res = await api<{ trip: Trip }>('/trips', {
        method: 'POST',
        body: JSON.stringify({
          pickupLocation,
          dropoffLocation,
          carDescription,
          paymentAmount: amount,
        }),
      })
      toast('Trip created — you can share details with your driver from the trip page.', 'success')
      navigate(`/trips/${res.trip.id}`, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">New request</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight">Create a trip</h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed lg:max-w-3xl">
          This request is for moving the <strong className="text-[var(--text)]">vehicle only</strong> — not transporting people. Add pickup, dropoff, and car details.
        </p>
      </motion.div>

      <Card className="w-full">
        <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
          <div className="grid gap-5 lg:gap-6 lg:grid-cols-2 lg:items-start">
            <TextArea
              label="Pickup"
              name="pickup"
              required
              placeholder="Address or meeting point"
              value={pickupLocation}
              onChange={(e) => setPickup(e.target.value)}
              className="min-h-[100px] lg:min-h-[120px]"
            />
            <TextArea
              label="Dropoff"
              name="dropoff"
              required
              placeholder="Where the vehicle should end up"
              value={dropoffLocation}
              onChange={(e) => setDropoff(e.target.value)}
              className="min-h-[100px] lg:min-h-[120px]"
            />
          </div>
          <TextArea
            label="Vehicle"
            name="vehicle"
            required
            placeholder="Make, model, color, registration — whatever helps the driver"
            value={carDescription}
            onChange={(e) => setCarDescription(e.target.value)}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
            <div className="sm:col-span-2 lg:col-span-2">
              <Input
                label="Payment (fixed, SEK)"
                name="payment"
                type="number"
                min={0}
                step={1}
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                hint="Agreed outside the app — this field is for visibility only."
              />
            </div>
          </div>
          {error && (
            <p className="text-sm font-medium text-[var(--danger)]" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth loading={loading} className="lg:max-w-md lg:mx-0">
            Create trip
          </Button>
        </form>
      </Card>
    </div>
  )
}
