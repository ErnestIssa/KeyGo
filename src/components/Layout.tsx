import { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { getStoredUser, getToken, setSession } from '../lib/authStorage'
import { useTheme } from '../theme/ThemeContext'
import type { User } from '../types'
import { DesktopChrome } from './layout/DesktopChrome'
import { MobileBottomNav } from './layout/MobileBottomNav'

export default function Layout() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const token = getToken()
    if (!token) return
    const ac = new AbortController()
    api<{ user: User }>('/users/profile', { signal: ac.signal })
      .then((res) => {
        if (ac.signal.aborted) return
        if (getToken() !== token) return
        setSession(token, res.user)
      })
      .catch(() => {})
    return () => ac.abort()
  }, [])

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--bg-page)] text-[var(--text)] transition-colors">
      {/* Mobile / tablet: slim top bar */}
      <motion.header
        initial={false}
        className="lg:hidden sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md safe-pt"
      >
        <div className="flex h-12 sm:h-14 items-center justify-between gap-3 px-4 sm:px-5">
          <Link
            to="/home"
            className="font-bold text-[var(--text)] tracking-tight text-base sm:text-lg shrink-0 min-h-[44px] min-w-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] rounded-lg"
          >
            Key<span className="text-[var(--accent)]">Go</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-xs sm:text-sm font-semibold text-[var(--brand)] min-h-[44px] px-2 rounded-lg hover:bg-[var(--brand-soft)]"
            >
              Account
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-base shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </motion.header>

      <DesktopChrome />

      <main className="flex-1 w-full min-w-0 flex flex-col px-4 sm:px-5 lg:px-8 xl:px-12 2xl:px-16 pt-4 sm:pt-5 lg:pt-8 pb-[calc(6.25rem+env(safe-area-inset-bottom))] lg:pb-10">
        <div className="w-full max-w-none flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>

      <MobileBottomNav user={user} />
    </div>
  )
}
