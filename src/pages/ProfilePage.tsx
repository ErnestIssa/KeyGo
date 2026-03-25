import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clearSession, getStoredUser } from '../lib/authStorage'
import { useTheme } from '../theme/ThemeContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function ProfilePage() {
  const user = getStoredUser()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">Account</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight">Profile</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Your account details and preferences. Identity verification can be added when you connect payments or insurance.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="lg:col-span-1 xl:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)] mb-4">Signed in as</h2>
          <p className="text-lg font-bold text-[var(--text)]">{user?.name}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1 break-all">{user?.email}</p>
          <p className="text-sm font-semibold text-[var(--brand)] mt-3 capitalize">Role: {user?.role}</p>
        </Card>

        <Card className="lg:col-span-1 xl:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)] mb-4">Appearance</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">Theme follows your choice on every screen.</p>
          <Button type="button" variant="secondary" onClick={toggleTheme} className="w-full sm:w-auto">
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </Button>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1 border-[var(--border)]">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">Verification</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            MVP accounts use email and password only. Later you can add ID or license checks for trust badges.
          </p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="danger"
          className="w-full sm:w-auto"
          onClick={() => {
            clearSession()
            navigate('/', { replace: true })
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
