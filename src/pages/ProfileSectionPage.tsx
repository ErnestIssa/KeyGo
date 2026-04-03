import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'

const SECTIONS: Record<string, { title: string; subtitle: string }> = {
  vehicles: {
    title: 'Vehicles',
    subtitle: 'Garage, plates, and handoff preferences',
  },
  documents: {
    title: 'Documents',
    subtitle: 'License, registration, verification',
  },
  insurance: {
    title: 'Insurance',
    subtitle: 'Coverage and policy details',
  },
  'tax-info': {
    title: 'Tax info',
    subtitle: 'Forms and reporting helpers',
  },
  payments: {
    title: 'Payments',
    subtitle: 'Payout methods and history',
  },
  tips: {
    title: 'Tips & info',
    subtitle: 'Guides for owners and drivers',
  },
  about: {
    title: 'About',
    subtitle: 'KeyGo version and legal',
  },
}

export default function ProfileSectionPage() {
  const { section } = useParams<{ section: string }>()
  const meta = useMemo(() => (section ? SECTIONS[section] : undefined), [section])

  if (!meta) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/profile"
          className="inline-flex text-sm font-semibold text-[var(--brand)] hover:underline mb-3 min-h-[44px] items-center"
        >
          ← Back to profile
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">{meta.subtitle}</p>
      </motion.div>

      <Card className="max-w-2xl">
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          This area will connect to live data and workflows soon. Use the link above to return to your profile.
        </p>
      </Card>
    </div>
  )
}
