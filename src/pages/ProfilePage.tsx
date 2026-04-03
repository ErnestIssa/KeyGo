import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getStoredUser, getToken, setSession, clearSession } from '../lib/authStorage'
import { uploadAvatar, ApiError } from '../lib/api'
import { resolveMediaUrl } from '../lib/mediaUrl'
import { useTheme } from '../theme/ThemeContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import type { User } from '../types'

type SectionLink = { to: string; title: string; subtitle: string }

const MANAGE: SectionLink[] = [
  { to: '/profile/vehicles', title: 'Vehicles', subtitle: 'Garage, plates, and handoff preferences' },
  { to: '/profile/documents', title: 'Documents', subtitle: 'License, registration, verification' },
  { to: '/profile/insurance', title: 'Insurance', subtitle: 'Coverage and policy details' },
]

const MONEY: SectionLink[] = [
  { to: '/profile/tax-info', title: 'Tax info', subtitle: 'Forms and reporting helpers' },
  { to: '/profile/payments', title: 'Payments', subtitle: 'Payout methods and history' },
]

const RESOURCES: SectionLink[] = [
  { to: '/profile/tips', title: 'Tips & info', subtitle: 'Guides for owners and drivers' },
  { to: '/profile/about', title: 'About', subtitle: 'KeyGo version and legal' },
]

function TopChip({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 min-w-0 max-w-[34%] flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-2.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[var(--text)] shadow-md shadow-[var(--shadow)]/10 hover:bg-[var(--bg-subtle)] transition-colors min-h-[44px]"
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function SectionGroup({ label, items }: { label: string; items: SectionLink[] }) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-2 ml-1">{label}</p>
      <Card className="p-0 overflow-hidden divide-y divide-[var(--border)]">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--bg-subtle)]/80 transition-colors min-h-[52px] group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--text)]">{item.title}</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5 line-clamp-2">{item.subtitle}</p>
            </div>
            <span className="text-xl font-light text-[var(--brand)] shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden>
              ›
            </span>
          </Link>
        ))}
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [uploading, setUploading] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [safetyOpen, setSafetyOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    const token = getToken()
    if (!token) return
    setUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result))
        r.onerror = () => reject(new Error('read failed'))
        r.readAsDataURL(file)
      })
      const { user: next } = await uploadAvatar(dataUrl)
      setSession(token, next)
      setUser(next)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update photo'
      window.alert(msg)
    } finally {
      setUploading(false)
    }
  }

  const rating = user?.ratingAverage ?? 5
  const avatarSrc = resolveMediaUrl(user?.avatarUrl)
  const initial = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => void onAvatarFile(e)} />

      <Modal open={helpOpen} title="Help" onClose={() => setHelpOpen(false)}>
        <p>
          Browse FAQs, contact support, and troubleshoot trips. Full in-app help is coming soon — use your trip screens and account email for support.
        </p>
      </Modal>
      <Modal open={safetyOpen} title="Safety" onClose={() => setSafetyOpen(false)}>
        <p>
          Meet in public places when handing off keys, verify driver identity, and report issues immediately. We are building trust and safety tools into every trip.
        </p>
      </Modal>
      <Modal open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
        <p className="mb-4">
          Theme, notifications, and privacy. More granular controls will arrive as the product grows. Use the theme toggle below for light or dark mode.
        </p>
        <Button type="button" variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </Button>
      </Modal>

      <Modal
        open={signOutOpen}
        title="Sign out?"
        onClose={() => setSignOutOpen(false)}
        footer={
          <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
            <Button
              type="button"
              variant="danger"
              fullWidth
              onClick={() => {
                setSignOutOpen(false)
                clearSession()
                navigate('/', { replace: true })
              }}
            >
              Sign out
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
          </div>
        }
      >
        <p className="text-[var(--text)]">
          Signed in as <span className="font-semibold text-[var(--text)]">{user?.email}</span>
        </p>
        <p className="mt-2 text-[var(--text)]">
          Role:{' '}
          <span className="font-bold capitalize text-[var(--brand)]">{user?.role}</span>
        </p>
        <p className="mt-4 text-[var(--text-muted)]">
          Signing out clears this session in this browser. To use a different role (owner vs driver), sign out and sign in with another account — each login is tied to one role.
        </p>
      </Modal>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-between">
        <TopChip icon="❓" label="Help" onClick={() => setHelpOpen(true)} />
        <TopChip icon="🛡" label="Safety" onClick={() => setSafetyOpen(true)} />
        <TopChip icon="⚙" label="Settings" onClick={() => setSettingsOpen(true)} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="flex flex-col sm:flex-row sm:items-center gap-6"
      >
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <div
            className="rounded-full p-1"
            style={{
              background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 50%, var(--brand-hover, var(--brand)) 100%)',
            }}
          >
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="relative w-[7.5rem] h-[7.5rem] rounded-full border-[3px] border-[var(--bg-elevated)] bg-[var(--bg-subtle)] overflow-hidden flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:opacity-70"
              aria-label="Change profile photo"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-extrabold text-[var(--brand)]">{initial}</span>
              )}
              {uploading ? (
                <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">…</span>
              ) : null}
              <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--brand)] border-2 border-[var(--bg-elevated)] flex items-center justify-center text-xs shadow-lg" aria-hidden>
                📷
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--canvas-text,var(--text))] tracking-tight">{user?.name ?? 'Account'}</h1>
          <p className="text-sm text-[var(--canvas-text-muted,var(--text-muted))] mt-1 break-all">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-lg text-[var(--accent)]" aria-hidden>
              ★
            </span>
            <span className="text-lg font-bold text-[var(--canvas-text,var(--text))]">{rating.toFixed(1)}</span>
            <span className="text-sm font-semibold text-[var(--canvas-text-muted,var(--text-muted))]">rating</span>
          </div>
          <p className="text-xs text-[var(--canvas-text-muted,var(--text-muted))] mt-2">Click the photo to update — stored securely on the server.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-3">
        <SectionGroup label="Manage" items={MANAGE} />
        <SectionGroup label="Money" items={MONEY} />
        <SectionGroup label="Resources" items={RESOURCES} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-2 ml-1">Switch account</p>
        <Card className="p-0 overflow-hidden">
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--danger-soft)]/25 transition-colors min-h-[52px] group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--danger)]">Sign out</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">View email & role, then confirm. Use another account to switch roles.</p>
            </div>
            <span className="text-xl font-light text-[var(--danger)] shrink-0" aria-hidden>
              ›
            </span>
          </button>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)] mb-4">Appearance</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">Theme follows your choice on every screen.</p>
          <Button type="button" variant="secondary" onClick={toggleTheme} className="w-full sm:w-auto">
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}
