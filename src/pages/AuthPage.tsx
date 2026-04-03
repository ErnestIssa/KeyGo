import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { setSession } from '../lib/authStorage'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../theme/ThemeContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import type { User } from '../types'

type SignupRole = 'owner' | 'driver'
type DemoRole = 'owner' | 'driver'

type AuthSuccess = { token: string; user: User }

export default function AuthPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<SignupRole>('owner')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const finishAuth = (res: AuthSuccess, message: string) => {
    setSession(res.token, res.user)
    toast(message, 'success')
    navigate('/home', { replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const res = await api<AuthSuccess>('/users/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, name, role }),
        })
        finishAuth(res, 'Welcome — your account is ready.')
      } else {
        const res = await api<AuthSuccess>('/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        finishAuth(res, 'Signed in successfully.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async (r: DemoRole) => {
    setError(null)
    setLoading(true)
    try {
      const res = await api<AuthSuccess>('/users/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role: r }),
      })
      finishAuth(res, 'Demo session started.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center px-4 py-10 safe-pt safe-pb">
      <div
        className="pointer-events-none absolute inset-0 opacity-90 dark:opacity-60"
        aria-hidden
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-[var(--brand)]/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[var(--accent)]/15 blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/80 backdrop-blur px-3 py-2 text-xs font-semibold text-[var(--text)] min-h-[44px] min-w-[44px]"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-2">
            KeyGo
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Move your car when you can’t drive
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
            Vehicle relocation only — not a taxi. Owners post a trip; drivers move the car from A to B.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md shadow-[var(--shadow-lg)] p-6 sm:p-8">
          <div className="flex rounded-xl bg-[var(--bg-subtle)] p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError(null)
              }}
              className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all min-h-[48px] ${
                mode === 'login'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text)] shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError(null)
              }}
              className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all min-h-[48px] ${
                mode === 'signup'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text)] shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    I am a
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as SignupRole)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3.5 text-[var(--text)] text-base min-h-[48px]"
                  >
                    <option value="owner">Car owner — I need a driver</option>
                    <option value="driver">Driver — I relocate cars</option>
                  </select>
                  <p className="text-xs text-[var(--text-muted)] leading-snug">
                    After sign-up, switch Owner ↔ Driver anytime from Profile → Role mode — same email and password.
                  </p>
                </div>
              </>
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                hint={mode === 'signup' ? 'At least 6 characters.' : undefined}
              />
              {mode === 'login' && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-[var(--brand)] hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-[var(--danger)] bg-[var(--danger-soft)] rounded-xl px-3 py-2"
                role="alert"
              >
                {error}
              </motion.p>
            )}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              {mode === 'signup' ? 'Create account' : 'Log in'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-center text-[var(--text-muted)] mb-3 font-medium">
              Try instantly — demo password is <span className="text-[var(--text)]">demo123</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" className="!py-2.5 !text-xs" disabled={loading} onClick={() => demoLogin('owner')}>
                Demo owner
              </Button>
              <Button type="button" variant="secondary" className="!py-2.5 !text-xs" disabled={loading} onClick={() => demoLogin('driver')}>
                Demo driver
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-sm mx-auto leading-relaxed">
          KeyGo is for relocating vehicles only. Confirm pickup, vehicle, and payment directly with the other party.
        </p>
      </motion.div>

      <Modal open={forgotOpen} title="Reset password" onClose={() => setForgotOpen(false)}>
        <p className="text-[var(--text)] mb-3">
          Self-serve password reset isn’t available in this preview yet.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Use <strong>Sign up</strong> with a different email, or</li>
          <li>Use a <strong>demo account</strong> above to explore the app.</li>
        </ul>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          In production you’d receive a secure link by email — we’ll add that when you’re ready.
        </p>
      </Modal>
    </div>
  )
}
